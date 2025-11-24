import { apiResponse } from "../../common";
import { courseModel, userCourseModel } from "../../database";
import { countData, createData, findAllWithPopulate, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { addCourseSchema, editCourseSchema, deleteCourseSchema, getCourseSchema, purchaseCourseSchema } from "../../validation";

const ObjectId = require('mongoose').Types.ObjectId;

export const add_course = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addCourseSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await createData(courseModel, value);
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("course"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_course_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editCourseSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await updateData(courseModel, { _id: new ObjectId(value.courseId), isDeleted: false }, value, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.updateDataError("course"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("course"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_course_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteCourseSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await updateData(courseModel, { _id: new ObjectId(value.id) }, { isDeleted: true }, { new: true })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("course"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("course"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_course = async (req, res) => {
    reqInfo(req)
    try {
        const { page, limit, search, startDate, endDate, courseCategoryId } = req.query
        let criteria: any = { isDeleted: false }, options: any = { lean: true }

        if (search) {
            criteria.$or = [
                { name: { $regex: search, $options: 'si' } },
                { description: { $regex: search, $options: 'si' } }
            ]
        }
        if (courseCategoryId) {
            criteria.courseCategoryId = new ObjectId(courseCategoryId)
        }
        if (startDate && endDate) {
            criteria.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
        options.sort = { createdAt: -1 }
        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit)
            options.limit = parseInt(limit)
        }

        const populateModel = { path: 'courseCategoryId', select: 'name description' };
        const response = await findAllWithPopulate(courseModel, criteria, {}, options, populateModel)
        const totalCount = await countData(courseModel, criteria)
        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        }
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('course'), { course_data: response, totalData: totalCount, state: stateObj }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_course_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getCourseSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const populateModel = { path: 'courseCategoryId', select: 'categoryName description' };
        const response = await getFirstMatch(courseModel, { _id: new ObjectId(value.id), isDeleted: false }, {}, {})
        if (response) {
            const populatedResponse = await courseModel.findById(value.id).populate(populateModel).lean()
            if (!populatedResponse) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("course"), {}, {}))
            return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("course"), populatedResponse, {}))
        }
        return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("course"), {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const purchase_course = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = purchaseCourseSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const userId = req.headers.user?._id;
        if (!userId) return res.status(401).json(new apiResponse(401, "User not authenticated", {}, {}))

        const course = await getFirstMatch(courseModel, { _id: new ObjectId(value.courseId), isDeleted: false }, {}, {})
        if (!course) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("course"), {}, {}))

        const existingPurchase = await getFirstMatch(userCourseModel, { userId: new ObjectId(userId), courseId: new ObjectId(value.courseId), isDeleted: false }, {}, {})
        if (existingPurchase) return res.status(400).json(new apiResponse(400, "Course already purchased", {}, {}))

        const purchaseData = {
            userId: new ObjectId(userId),
            courseId: new ObjectId(value.courseId),
            paymentStatus: value.razorpayPaymentId ? 'completed' : 'pending',
            razorpayOrderId: value.razorpayOrderId,
            razorpayPaymentId: value.razorpayPaymentId,
        }

        const response = await createData(userCourseModel, purchaseData);
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}))

        return res.status(200).json(new apiResponse(200, responseMessage?.purchaseSuccess, response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_my_courses = async (req, res) => {
    reqInfo(req)
    try {
        const userId = req.headers.user?._id;
        if (!userId) return res.status(401).json(new apiResponse(401, "User not authenticated", {}, {}))

        const { page, limit } = req.query
        let criteria: any = { userId: new ObjectId(userId), isDeleted: false }, options: any = { lean: true }

        options.sort = { createdAt: -1 }
        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit)
            options.limit = parseInt(limit)
        }

        const populateModel = { path: 'courseId', select: 'courseName description price image enrolledLearners classCompleted satisfactionRate' };
        const response = await findAllWithPopulate(userCourseModel, criteria, {}, options, populateModel)
        const totalCount = await countData(userCourseModel, criteria)
        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        }
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('my courses'), { my_courses_data: response, totalData: totalCount, state: stateObj }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

