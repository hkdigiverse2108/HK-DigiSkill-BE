import { apiResponse } from "../../common";
import { testimonialModel } from "../../database";
import { countData, createData, getDataWithSorting, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { addTestimonialSchema, editTestimonialSchema, deleteTestimonialSchema, getTestimonialSchema } from "../../validation";

const ObjectId = require('mongoose').Types.ObjectId;

export const add_testimonial = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addTestimonialSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await createData(testimonialModel, value);
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("testimonial"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_testimonial_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editTestimonialSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await updateData(testimonialModel, { _id: new ObjectId(value.testimonialId), isDeleted: false }, value, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.updateDataError("testimonial"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("testimonial"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_testimonial_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteTestimonialSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await updateData(testimonialModel, { _id: new ObjectId(value.id) }, { isDeleted: true }, { new: true })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("testimonial"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("testimonial"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_testimonial = async (req, res) => {
    reqInfo(req)
    try {
        const { page, limit, search, startDate, endDate, type, isFeatured } = req.query
        let criteria: any = { isDeleted: false }, options: any = { lean: true }

        if (search) {
            criteria.$or = [
                { name: { $regex: search, $options: 'si' } },
                { designation: { $regex: search, $options: 'si' } },
                { description: { $regex: search, $options: 'si' } },
            ]
        }
        if (type) {
            criteria.type = type
        }
        if (isFeatured !== undefined) {
            criteria.isFeatured = isFeatured === 'true'
        }
        if (startDate && endDate) {
            criteria.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
        options.sort = { createdAt: -1 }
        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit)
            options.limit = parseInt(limit)
        }

        const response = await getDataWithSorting(testimonialModel, criteria, {}, options)
        const totalCount = await countData(testimonialModel, criteria)
        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        }
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('testimonial'), { 
            testimonial_data: response, 
            totalData: totalCount, 
            state: stateObj 
        }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_testimonial_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getTestimonialSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await getFirstMatch(testimonialModel, { _id: new ObjectId(value.id), isDeleted: false }, {}, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("testimonial"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("testimonial"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

