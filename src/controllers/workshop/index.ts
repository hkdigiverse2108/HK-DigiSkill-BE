import { apiResponse, USER_ROLES } from "../../common";
import { userModel, workshopModel, workshopPaymentModel } from "../../database";
import { countData, createData, findAllWithPopulate, findAllWithPopulateWithSorting, findOneAndPopulate, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { addWorkshopSchema, editWorkshopSchema, deleteWorkshopSchema, getWorkshopSchema, purchaseWorkshopSchema } from "../../validation";

const ObjectId = require('mongoose').Types.ObjectId;

export const add_workshop = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addWorkshopSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await createData(workshopModel, value);
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("workshop"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_workshop_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editWorkshopSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await updateData(workshopModel, { _id: new ObjectId(value.workshopId), isDeleted: false }, value, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.updateDataError("workshop"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("workshop"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_workshop_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteWorkshopSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await updateData(workshopModel, { _id: new ObjectId(value.id) }, { isDeleted: true }, { new: true })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("workshop"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("workshop"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_workshop = async (req, res) => {
    reqInfo(req)
    let { user } = req.headers
    try {
        const { page, limit, search, startDate, endDate } = req.query
        let criteria: any = { isDeleted: false }, options: any = { lean: true }

        if (search) {
            criteria.$or = [
                { title: { $regex: search, $options: 'si' } },
                { subTitle: { $regex: search, $options: 'si' } },
                { about: { $regex: search, $options: 'si' } },
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

        let populateModel = [
            { path: 'workshopCurriculum', select: 'title date thumbnail videoLink duration' },
            { path: 'workshopTestimonials', select: 'name designation rate description image' },
            { path: 'workshopFAQ', select: 'question answer' }
        ]

        const workshops = await findAllWithPopulateWithSorting(workshopModel, criteria, {}, options, populateModel)

        const totalCount = await countData(workshopModel, criteria)

        const unlockedSet = new Set(
            (user?.workshopIds || []).map((id) => id.toString())
        );

        const response = workshops.map((w) => ({
            ...w,
            isUnlocked: unlockedSet.has(w._id.toString()),
        }));

        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        }
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('workshop'), {
            workshop_data: response,
            totalData: totalCount,
            state: stateObj
        }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_workshop_by_id = async (req, res) => {
    reqInfo(req)
    let { user } = req.headers
    try {
        const { error, value } = getWorkshopSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const populateModels = [
            { path: 'workshopCurriculum', select: 'title date thumbnail videoLink duration description attachment' },
            { path: 'workshopTestimonials', select: 'name designation rate description image' },
            { path: 'workshopFAQ', select: 'question answer' }
        ];
        
        const response = await findOneAndPopulate(workshopModel, { _id: new ObjectId(value.id), isDeleted: false }, {}, {}, populateModels)
        if (!response || response.isDeleted) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("workshop"), {}, {}))
        response.isUnlocked = false
        if (user && user?._id) {
            let isExist = await userModel.findOne({ _id: new ObjectId(user._id), workshopIds: { $in: [new ObjectId(value.id)] }, isDeleted: false }).lean()
            if (isExist) response.isUnlocked = true
        }
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("workshop"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const purchase_workshop = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = purchaseWorkshopSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const userId = req.headers.user?._id;
        if (!userId) return res.status(401).json(new apiResponse(401, "User not authenticated", {}, {}))

        const workshop = await getFirstMatch(workshopModel, { _id: new ObjectId(value.workshopId), isDeleted: false }, {}, {})
        if (!workshop) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("workshop"), {}, {}))

        const existingPurchase = await getFirstMatch(workshopPaymentModel, { workshopId: new ObjectId(value.workshopId), user_id: new ObjectId(userId), isDeleted: false }, {}, {})
        if (existingPurchase) return res.status(400).json(new apiResponse(400, "Workshop already purchased", {}, {}))

        const purchaseData = {
            workshopId: new ObjectId(value.workshopId),
            userId: new ObjectId(userId),
            amount: value.amount || workshop.price,
            paymentStatus: value.paymentId ? 'completed' : 'pending',
            paymentId: value.paymentId,
            paymentMethod: value.paymentMethod,
            transactionDate: new Date(),
            receiptNumber: value.receiptNumber,
            discountAmount: value.discountAmount || 0,
            finalAmount: value.finalAmount || (value.amount || workshop.price),
        }

        const response = await createData(workshopPaymentModel, purchaseData);
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.purchaseSuccess, response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_my_workshops = async (req, res) => {
    reqInfo(req)
    let { user } = req.headers, match: any = {}
    try {
        if (user.role === USER_ROLES.USER) {
            match.userId = new ObjectId(user._id)
        }
        const { page, limit } = req.query
        let criteria: any = { ...match, isDeleted: false }, options: any = { lean: true }

        options.sort = { createdAt: -1 }
        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit)
            options.limit = parseInt(limit)
        }

        let populateModel = [
            { path: 'workshopId', select: 'title subTitle image price mrpPrice language duration' },
            { path: 'userId', select: 'fullName email phoneNumber profilePhoto designation' }
        ]

        const response = await findAllWithPopulate(workshopPaymentModel, criteria, {}, options, populateModel)
        const totalCount = await countData(workshopPaymentModel, criteria)
        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        }
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('my workshops'), { my_workshops_data: response, totalData: totalCount, state: stateObj }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}