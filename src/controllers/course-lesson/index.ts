import { apiResponse } from "../../common";
import { courseLessonModel } from "../../database";
import { countData, createData, findAllWithPopulate, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { addCourseLessonSchema, editCourseLessonSchema, deleteCourseLessonSchema, getCourseLessonSchema } from "../../validation";

const ObjectId = require('mongoose').Types.ObjectId;

export const add_course_lesson = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addCourseLessonSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await createData(courseLessonModel, value);
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("course lesson"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_course_lesson_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editCourseLessonSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await updateData(courseLessonModel, { _id: new ObjectId(value.courseLessonId), isDeleted: false }, value, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.updateDataError("course lesson"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("course lesson"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_course_lesson_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteCourseLessonSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await updateData(courseLessonModel, { _id: new ObjectId(value.id) }, { isDeleted: true }, { new: true })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("course lesson"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("course lesson"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_course_lessons = async (req, res) => {
    reqInfo(req)
    try {
        const { page, limit, search, courseId, startDate, endDate } = req.query
        let criteria: any = { isDeleted: false }, options: any = { lean: true }

        if (search) {
            criteria.$or = [
                { title: { $regex: search, $options: 'si' } },
                { subtitle: { $regex: search, $options: 'si' } }
            ]
        }
        if (courseId) {
            criteria.courseId = new ObjectId(courseId)
        }
        if (startDate && endDate) {
            criteria.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
        options.sort = { createdAt: -1 }
        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit)
            options.limit = parseInt(limit)
        }

        const populateModel = { path: 'courseId', select: 'name description' };
        const response = await findAllWithPopulate(courseLessonModel, criteria, {}, options, populateModel)
        const totalCount = await countData(courseLessonModel, criteria)
        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        }
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('course lessons'), { course_lesson_data: response, totalData: totalCount, state: stateObj }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_course_lesson_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getCourseLessonSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const populateModel = { path: 'courseId', select: 'name description' };
        const response = await getFirstMatch(courseLessonModel, { _id: new ObjectId(value.id), isDeleted: false }, {}, {})
        if (response) {
            const populatedResponse = await courseLessonModel.findById(value.id).populate(populateModel).lean()
            if (!populatedResponse) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("course lesson"), {}, {}))
            return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("course lesson"), populatedResponse, {}))
        }
        return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("course lesson"), {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

