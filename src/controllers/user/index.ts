import { apiResponse, generateHash, getUniqueOtp, USER_ROLES } from "../../common";
import { userModel } from "../../database";
import { countData, createData, email_verification_mail, getDataWithSorting, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { addUserSchema, editUserSchema, deleteUserSchema, getUserSchema } from "../../validation";

const ObjectId = require('mongoose').Types.ObjectId;

export const add_user = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addUserSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        let existingUser = await getFirstMatch(userModel, { email: value?.email, role: USER_ROLES.USER, isDeleted: false }, {}, {})
        if (existingUser) return res.status(400).json(new apiResponse(400, responseMessage?.dataAlreadyExist("Email"), {}, {}))

        existingUser = await getFirstMatch(userModel, { phoneNumber: value?.phoneNumber, role: USER_ROLES.USER, isDeleted: false }, {}, {})
        if (existingUser) return res.status(400).json(new apiResponse(400, responseMessage?.dataAlreadyExist("Phone Number"), {}, {}))

        let otp = await getUniqueOtp()
        value.password = await generateHash(value.password)
        value.otp = otp;
        value.otpExpireTime = new Date(Date.now() + 2 * 60 * 1000);

        email_verification_mail(value, otp);
        const response = await createData(userModel, value);
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}))

        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("user"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_user_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editUserSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        let existingUser = await getFirstMatch(userModel, { email: value.email, role: USER_ROLES.USER, _id: { $ne: new ObjectId(value.userId) }, isDeleted: false }, {}, {})
        if (existingUser) return res.status(400).json(new apiResponse(400, responseMessage?.dataAlreadyExist("Email"), {}, {}))

        const response = await updateData(userModel, { _id: new ObjectId(value.userId), isDeleted: false }, value, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.updateDataError("user"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("user"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_user_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteUserSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await updateData(userModel, { _id: new ObjectId(value.id) }, { isDeleted: true }, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("user"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("user"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_user = async (req, res) => {
    reqInfo(req)
    try {
        const { page, limit, search, startDate, endDate, activeFilter } = req.query
        let criteria: any = { isDeleted: false }, options: any = { lean: true }

        if (search) {
            criteria.$or = [
                { fullName: { $regex: search, $options: 'si' } },
                { email: { $regex: search, $options: 'si' } },
                { phoneNumber: { $regex: search, $options: 'si' } }
            ]
        }

        criteria.role = USER_ROLES.USER

        if (activeFilter !== undefined) criteria.isBlocked = activeFilter === 'true'

        if (startDate && endDate) criteria.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }

        options.sort = { createdAt: -1 }
        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit)
            options.limit = parseInt(limit)
        }

        const response = await getDataWithSorting(userModel, criteria, {}, options)
        const totalCount = await countData(userModel, criteria)
        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        }
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('user'), {
            user_data: response,
            totalData: totalCount,
            state: stateObj
        }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_user_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getUserSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await getFirstMatch(userModel, { _id: new ObjectId(value.id), isDeleted: false }, {}, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("user"), {}, {}))

        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("user"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

