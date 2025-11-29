import { apiResponse } from "../../common";
import { workshopCurriculumModel } from "../../database";
import { countData, createData, findAllWithPopulate, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { addWorkshopCurriculumSchema, editWorkshopCurriculumSchema, deleteWorkshopCurriculumSchema, getWorkshopCurriculumSchema } from "../../validation";

const ObjectId = require('mongoose').Types.ObjectId;

export const add_workshop_curriculum = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addWorkshopCurriculumSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await createData(workshopCurriculumModel, value);
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("workshop curriculum"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_workshop_curriculum_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editWorkshopCurriculumSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await updateData(workshopCurriculumModel, { _id: new ObjectId(value.workshopCurriculumId), isDeleted: false }, value, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.updateDataError("workshop curriculum"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("workshop curriculum"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_workshop_curriculum_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteWorkshopCurriculumSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await updateData(workshopCurriculumModel, { _id: new ObjectId(value.id), isDeleted: false }, { isDeleted: true }, { new: true })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("workshop curriculum"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("workshop curriculum"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_workshop_curriculum = async (req, res) => {
    reqInfo(req)
    try {
        const { page, limit, search, startDate, endDate, workshopFilter } = req.query
        let criteria: any = { isDeleted: false }, options: any = { lean: true }

        if (search) {
            criteria.$or = [
                { title: { $regex: search, $options: 'si' } },
                { description: { $regex: search, $options: 'si' } },
            ]
        }
        if (workshopFilter) {
            criteria.workshopId = new ObjectId(workshopFilter)
        }
        if (startDate && endDate) {
            criteria.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
        options.sort = { date: 1, createdAt: -1 }
        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit)
            options.limit = parseInt(limit)
        }

        let populateModel = [
            { path: 'workshopId', select: 'title subTitle image price mrpPrice language duration' },
        ]

        const response = await findAllWithPopulate(workshopCurriculumModel, criteria, {}, options, populateModel)
        const totalCount = await countData(workshopCurriculumModel, criteria)
        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        }
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('workshop curriculum'), { 
            workshop_curriculum_data: response, 
            totalData: totalCount, 
            state: stateObj 
        }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_workshop_curriculum_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getWorkshopCurriculumSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await getFirstMatch(workshopCurriculumModel, { _id: new ObjectId(value.id), isDeleted: false }, {}, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("workshop curriculum"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("workshop curriculum"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

