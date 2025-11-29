import { apiResponse } from "../../common";
import { galleryModel } from "../../database";
import { countData, createData, getDataWithSorting, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { addGallerySchema, editGallerySchema, deleteGallerySchema, getGallerySchema } from "../../validation";

const ObjectId = require('mongoose').Types.ObjectId;

export const add_gallery = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addGallerySchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await createData(galleryModel, value);
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("gallery"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_gallery_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editGallerySchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await updateData(galleryModel, { _id: new ObjectId(value.galleryId), isDeleted: false }, value, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.updateDataError("gallery"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("gallery"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_gallery_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteGallerySchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await updateData(galleryModel, { _id: new ObjectId(value.id) }, { isDeleted: true }, { new: true })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("gallery"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("gallery"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_gallery = async (req, res) => {
    reqInfo(req)
    try {
        const { page, limit, search, startDate, endDate } = req.query
        let criteria: any = { isDeleted: false }, options: any = { lean: true }

        if (search) {
            criteria.$or = [
                { title: { $regex: search, $options: 'si' } },
                { description: { $regex: search, $options: 'si' } },
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

        const response = await getDataWithSorting(galleryModel, criteria, {}, options)
        const totalCount = await countData(galleryModel, criteria)
        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        }
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('gallery'), { 
            gallery_data: response, 
            totalData: totalCount, 
            state: stateObj 
        }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_gallery_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getGallerySchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await getFirstMatch(galleryModel, { _id: new ObjectId(value.id), isDeleted: false }, {}, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("gallery"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("gallery"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

