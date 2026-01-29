import { apiResponse } from "../../common";
import { newsletterModel } from "../../database";
import { countData, createData, getDataWithSorting, getFirstMatch, reqInfo, responseMessage, send_newsletter, updateData } from "../../helper";
import { addNewsletterSchema, deleteNewsletterSchema, getNewsletterSchema, sendNewsletterSchema } from "../../validation";

const ObjectId = require('mongoose').Types.ObjectId;

export const add_newsletter = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addNewsletterSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const existingEmail = await getFirstMatch(newsletterModel, { email: value.email, isDeleted: false }, {}, {})
        if (existingEmail) return res.status(400).json(new apiResponse(400, "Email already subscribed", {}, {}))

        const response = await createData(newsletterModel, value);
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("newsletter"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_newsletter_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteNewsletterSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await updateData(newsletterModel, { _id: new ObjectId(value.id) }, { isDeleted: true }, { new: true })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("newsletter"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("newsletter"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_newsletter = async (req, res) => {
    reqInfo(req)
    try {
        const { page, limit, search, startDate, endDate } = req.query
        let criteria: any = { isDeleted: false }, options: any = { lean: true }

        if (search) {
            criteria.$or = [
                { email: { $regex: search, $options: 'si' } },
            ]
        }
        if (startDate && endDate) {
            criteria.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
        options.sort = { createdAt: -1 }
        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit)
            options.limit = parseInt(limit)
        }

        const response = await getDataWithSorting(newsletterModel, criteria, {}, options)
        const totalCount = await countData(newsletterModel, criteria)
        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        }
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('newsletter'), {
            newsletter_data: response,
            totalData: totalCount,
            state: stateObj
        }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_newsletter_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getNewsletterSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await getFirstMatch(newsletterModel, { _id: new ObjectId(value.id), isDeleted: false }, {}, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("newsletter"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("newsletter"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const send_newsletter_to_subscribers = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = sendNewsletterSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        let { emails, subject, message } = value

        for (let email of emails) {
            await send_newsletter(email, subject, message)
        }

        return res.status(200).json(new apiResponse(200, "Newsletter sent successfully", {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}