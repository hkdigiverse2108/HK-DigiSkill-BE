import { apiResponse } from "../../common";
import { courseCurriculumModel } from "../../database";
import { countData, createData, findAllWithPopulate, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { addCourseCurriculumSchema, editCourseCurriculumSchema, deleteCourseCurriculumSchema, getCourseCurriculumSchema } from "../../validation";

const ObjectId = require('mongoose').Types.ObjectId;

export const add_course_curriculum = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addCourseCurriculumSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        if (value.courseId) value.courseId = new ObjectId(value.courseId)
        if (value.courseLessonId) value.courseLessonId = new ObjectId(value.courseLessonId)
        if (value.courseLessonsAssigned) {
            value.courseLessonsAssigned = value.courseLessonsAssigned.map(id => new ObjectId(id))
        }

        const response = await createData(courseCurriculumModel, value);
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("course curriculum"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_course_curriculum_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editCourseCurriculumSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        if (value.courseId) value.courseId = new ObjectId(value.courseId)
        if (value.courseLessonId) value.courseLessonId = new ObjectId(value.courseLessonId)
        if (value.courseLessonsAssigned) {
            value.courseLessonsAssigned = value.courseLessonsAssigned.map(id => new ObjectId(id))
        }

        const response = await updateData(courseCurriculumModel, { _id: new ObjectId(value.courseCurriculumId), isDeleted: false }, value, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.updateDataError("course curriculum"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("course curriculum"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_course_curriculum_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteCourseCurriculumSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await updateData(courseCurriculumModel, { _id: new ObjectId(value.id) }, { isDeleted: true }, { new: true })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("course curriculum"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("course curriculum"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_course_curriculums = async (req, res) => {
    reqInfo(req)
    try {
        const { page, limit, search, courseId, courseLessonId, startDate, endDate } = req.query
        let criteria: any = { isDeleted: false }, options: any = { lean: true }

        if (search) {
            criteria.$or = [
                { title: { $regex: search, $options: 'si' } },
                { description: { $regex: search, $options: 'si' } }
            ]
        }
        if (courseId) {
            criteria.courseId = new ObjectId(courseId)
        }
        if (courseLessonId) {
            criteria.courseLessonId = new ObjectId(courseLessonId)
        }
        if (startDate && endDate) {
            criteria.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
        options.sort = { courseLessonsPriority: 1, createdAt: -1 }
        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit)
            options.limit = parseInt(limit)
        }

        const populateModel = [
            { path: 'courseId', select: 'name description' },
            { path: 'courseLessonId', select: 'title subtitle' },
            { path: 'courseLessonsAssigned', select: 'title subtitle' }
        ];
        const response = await courseCurriculumModel.find(criteria, {}, options).populate(populateModel).lean()
        const totalCount = await countData(courseCurriculumModel, criteria)
        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        }
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('course curriculums'), { course_curriculum_data: response, totalData: totalCount, state: stateObj }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_course_curriculum_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getCourseCurriculumSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const populateModel = [
            { path: 'courseId', select: 'name description' },
            { path: 'courseLessonId', select: 'title subtitle' },
            { path: 'courseLessonsAssigned', select: 'title subtitle' }
        ];
        const response = await courseCurriculumModel.findById(value.id).populate(populateModel).lean()
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("course curriculum"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("course curriculum"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

