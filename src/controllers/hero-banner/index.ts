import { apiResponse } from "../../common";
import { heroBannerModel } from "../../database";
import { countData, createData, getDataWithSorting, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { addHeroBannerSchema, editHeroBannerSchema, deleteHeroBannerSchema, getHeroBannerSchema } from "../../validation";

const ObjectId = require('mongoose').Types.ObjectId;

export const add_hero_banner = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addHeroBannerSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await createData(heroBannerModel, value);
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("hero banner"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_hero_banner_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editHeroBannerSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await updateData(heroBannerModel, { _id: new ObjectId(value.heroBannerId), isDeleted: false }, value, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.updateDataError("hero banner"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("hero banner"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_hero_banner_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteHeroBannerSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await updateData(heroBannerModel, { _id: new ObjectId(value.id) }, { isDeleted: true }, { new: true })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("hero banner"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("hero banner"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_hero_banner = async (req, res) => {
    reqInfo(req)
    try {
        const { page, limit, search, startDate, endDate, type } = req.query
        let criteria: any = { isDeleted: false }, options: any = { lean: true }

        if (search) {
            criteria.$or = [
                { title: { $regex: search, $options: 'si' } },
                { description: { $regex: search, $options: 'si' } },
            ]
        }
        if (type) {
            criteria.type = type
        }
        if (startDate && endDate) {
            criteria.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
        options.sort = { createdAt: -1 }
        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit)
            options.limit = parseInt(limit)
        }

        const response = await getDataWithSorting(heroBannerModel, criteria, {}, options)
        const totalCount = await countData(heroBannerModel, criteria)
        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        }
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('hero banner'), { 
            hero_banner_data: response, 
            totalData: totalCount, 
            state: stateObj 
        }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_hero_banner_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getHeroBannerSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await getFirstMatch(heroBannerModel, { _id: new ObjectId(value.id), isDeleted: false }, {}, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("hero banner"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("hero banner"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

