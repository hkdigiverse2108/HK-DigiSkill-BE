import { apiResponse } from "../../common";
import { referralCodeModel, userModel } from "../../database";
import { countData, createData, findAllWithPopulate, getDataWithSorting, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { addReferralCodeSchema, editReferralCodeSchema, deleteReferralCodeSchema, getReferralCodeSchema, validateReferralCodeSchema } from "../../validation";

const ObjectId = require('mongoose').Types.ObjectId;

export const add_referral_code = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addReferralCodeSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const existingCode = await getFirstMatch(referralCodeModel, { code: value.code, isDeleted: false }, {}, {})
        if (existingCode) return res.status(400).json(new apiResponse(400, "Referral code already exists", {}, {}))

        const user = await getFirstMatch(userModel, { _id: new ObjectId(value.userId), isDeleted: false }, {}, {})
        if (!user) return res.status(404).json(new apiResponse(404, "User not found", {}, {}))

        const response = await createData(referralCodeModel, value);
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("referral code"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_referral_code_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editReferralCodeSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        if (value.code) {
            const existingCode = await getFirstMatch(referralCodeModel, { code: value.code, _id: { $ne: new ObjectId(value.referralCodeId) }, isDeleted: false }, {}, {})
            if (existingCode) return res.status(400).json(new apiResponse(400, "Referral code already exists", {}, {}))
        }

        if (value.userId) {
            const user = await getFirstMatch(userModel, { _id: new ObjectId(value.userId), isDeleted: false }, {}, {})
            if (!user) return res.status(404).json(new apiResponse(404, "User not found", {}, {}))
        }

        const response = await updateData(referralCodeModel, { _id: new ObjectId(value.referralCodeId), isDeleted: false }, value, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.updateDataError("referral code"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("referral code"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_referral_code_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteReferralCodeSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await updateData(referralCodeModel, { _id: new ObjectId(value.id) }, { isDeleted: true }, { new: true })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("referral code"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("referral code"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_referral_codes = async (req, res) => {
    reqInfo(req)
    try {
        const { page, limit, search, startDateFilter, endDateFilter, statusFilter, userIdFilter } = req.query
        let criteria: any = { isDeleted: false }, options: any = { lean: true }

        if (search) {
            criteria.$or = [
                { code: { $regex: search, $options: 'si' } }
            ]
        }
        if (statusFilter) {
            criteria.status = statusFilter
        }
        if (userIdFilter) {
            criteria.userId = new ObjectId(userIdFilter)
        }
        if (startDateFilter && endDateFilter) {
            criteria.createdAt = { $gte: new Date(startDateFilter), $lte: new Date(endDateFilter) }
        }
        options.sort = { createdAt: -1 }
        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit)
            options.limit = parseInt(limit)
        }

        let populateModel = [
            { path: 'userId', select: 'fullName email phoneNumber' }
        ]

        const response = await findAllWithPopulate(referralCodeModel, criteria, {}, options, populateModel)     
        const totalCount = await countData(referralCodeModel, criteria)
        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        }
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('referral codes'), { referral_code_data: response, totalData: totalCount, state: stateObj }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_referral_code_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getReferralCodeSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await getFirstMatch(referralCodeModel, { _id: new ObjectId(value.id), isDeleted: false }, { path: 'userId', select: 'fullName email phoneNumber' }, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("referral code"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("referral code"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const validate_referral_code = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = validateReferralCodeSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const referralCode = await getFirstMatch(referralCodeModel, { code: value.code, isDeleted: false, status: 'active' }, { path: 'userId', select: 'fullName email phoneNumber' }, {})
        if (!referralCode) return res.status(404).json(new apiResponse(404, "Invalid or expired referral code", {}, {}))

        const now = new Date()
        if (new Date(referralCode.startDate) > now || new Date(referralCode.endDate) < now) {
            return res.status(400).json(new apiResponse(400, "Referral code has expired", {}, {}))
        }

        if (referralCode.usageLimit && referralCode.usedCount >= referralCode.usageLimit) {
            return res.status(400).json(new apiResponse(400, "Referral code usage limit reached", {}, {}))
        }

        // If amount is provided, validate minimum order amount and calculate rewards
        if (value.amount !== undefined && value.amount !== null) {
            if (value.amount < referralCode.minOrderAmount) {
                return res.status(400).json(new apiResponse(400, `Minimum order amount is ${referralCode.minOrderAmount}`, {}, {}))
            }

            let rewardAmount = 0
            if (referralCode.rewardType === 'percentage') {
                rewardAmount = (value.amount * referralCode.rewardValue) / 100
                if (referralCode.maxRewardAmount && rewardAmount > referralCode.maxRewardAmount) {
                    rewardAmount = referralCode.maxRewardAmount
                }
            } else {
                rewardAmount = referralCode.rewardValue
            }

            const finalAmount = Math.max(0, value.amount - rewardAmount)

            return res.status(200).json(new apiResponse(200, "Referral code validated successfully", {
                rewardAmount,
                finalAmount,
                referralCode: referralCode
            }, {}))
        } else {
            // If amount is not provided, just validate the code and return basic info
            return res.status(200).json(new apiResponse(200, "Referral code is valid", {
                referralCode: referralCode,
                minOrderAmount: referralCode.minOrderAmount,
                rewardType: referralCode.rewardType,
                rewardValue: referralCode.rewardValue,
                maxRewardAmount: referralCode.maxRewardAmount
            }, {}))
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

