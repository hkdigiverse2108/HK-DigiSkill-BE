import { apiResponse } from "../../common";
import { getInTouchModel } from "../../database";
import { countData, createData, getDataWithSorting, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { addGetInTouchSchema, editGetInTouchSchema, deleteGetInTouchSchema, getGetInTouchSchema } from "../../validation";

const ObjectId = require('mongoose').Types.ObjectId;

export const add_get_in_touch = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addGetInTouchSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await createData(getInTouchModel, value);
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("contact message"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_get_in_touch_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editGetInTouchSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await updateData(getInTouchModel, { _id: new ObjectId(value.getInTouchId), isDeleted: false }, value, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.updateDataError("contact message"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("contact message"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_get_in_touch_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteGetInTouchSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await updateData(getInTouchModel, { _id: new ObjectId(value.id) }, { isDeleted: true }, { new: true })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("contact message"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("contact message"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_get_in_touch = async (req, res) => {
    reqInfo(req)
    try {
        const { page, limit, search, startDate, endDate, isRead } = req.query
        let criteria: any = { isDeleted: false }, options: any = { lean: true }

        if (search) {
            criteria.$or = [
                { name: { $regex: search, $options: 'si' } },
                { email: { $regex: search, $options: 'si' } },
                { subject: { $regex: search, $options: 'si' } },
                { message: { $regex: search, $options: 'si' } },
            ]
        }
        if (isRead !== undefined) {
            criteria.isRead = isRead === 'true'
        }
        if (startDate && endDate) {
            criteria.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
        options.sort = { createdAt: -1 }
        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit)
            options.limit = parseInt(limit)
        }

        const response = await getDataWithSorting(getInTouchModel, criteria, {}, options)
        const totalCount = await countData(getInTouchModel, criteria)
        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        }
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('contact messages'), { contact_messages_data: response, totalData: totalCount, state: stateObj }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_get_in_touch_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getGetInTouchSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await getFirstMatch(getInTouchModel, { _id: new ObjectId(value.id), isDeleted: false }, {}, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("contact message"), {}, {}))
        
        // Mark as read when viewing
        await updateData(getInTouchModel, { _id: new ObjectId(value.id) }, { isRead: true }, {})
        
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("contact message"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

