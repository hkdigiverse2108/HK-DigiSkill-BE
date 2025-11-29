import { apiResponse } from "../../common";
import { couponCodeModel } from "../../database";
import { countData, createData, findAllWithPopulate, getDataWithSorting, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { addCouponCodeSchema, editCouponCodeSchema, deleteCouponCodeSchema, getCouponCodeSchema, validateCouponCodeSchema } from "../../validation";

const ObjectId = require('mongoose').Types.ObjectId;

export const add_coupon_code = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addCouponCodeSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const existingCode = await getFirstMatch(couponCodeModel, { code: value.code, isDeleted: false }, {}, {})
        if (existingCode) return res.status(400).json(new apiResponse(400, "Coupon code already exists", {}, {}))

        const response = await createData(couponCodeModel, value);
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("coupon code"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_coupon_code_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editCouponCodeSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        if (value.code) {
            const existingCode = await getFirstMatch(couponCodeModel, { code: value.code, _id: { $ne: new ObjectId(value.couponCodeId) }, isDeleted: false }, {}, {})
            if (existingCode) return res.status(400).json(new apiResponse(400, "Coupon code already exists", {}, {}))
        }

        const response = await updateData(couponCodeModel, { _id: new ObjectId(value.couponCodeId), isDeleted: false }, value, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.updateDataError("coupon code"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("coupon code"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_coupon_code_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteCouponCodeSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await updateData(couponCodeModel, { _id: new ObjectId(value.id) }, { isDeleted: true }, { new: true })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("coupon code"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("coupon code"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_coupon_codes = async (req, res) => {
    reqInfo(req)
    try {
        const { page, limit, search, startDateFilter, endDateFilter, statusFilter } = req.query
        let criteria: any = { isDeleted: false }, options: any = { lean: true }

        if (search) {
            criteria.$or = [
                { title: { $regex: search, $options: 'si' } },
                { code: { $regex: search, $options: 'si' } }
            ]
        }
        if (statusFilter) {
            criteria.status = statusFilter
        }
        if (startDateFilter && endDateFilter) {
            criteria.createdAt = { $gte: new Date(startDateFilter), $lte: new Date(endDateFilter) }
        }
        options.sort = { createdAt: -1 }
        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit)
            options.limit = parseInt(limit)
        }

        const response = await getDataWithSorting(couponCodeModel, criteria, {}, options )
        const totalCount = await countData(couponCodeModel, criteria)
        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        }
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('coupon codes'), { 
            coupon_code_data: response, 
            totalData: totalCount, 
            state: stateObj 
        }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_coupon_code_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getCouponCodeSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await getFirstMatch(couponCodeModel, { _id: new ObjectId(value.id), isDeleted: false }, {}, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("coupon code"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("coupon code"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const validate_coupon_code = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = validateCouponCodeSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const coupon = await getFirstMatch(couponCodeModel, { code: value.code, isDeleted: false, status: 'active' }, {}, {})
        if (!coupon) return res.status(404).json(new apiResponse(404, "Invalid or expired coupon code", {}, {}))

        const now = new Date()
        if (new Date(coupon.startDate) > now || new Date(coupon.endDate) < now) {
            return res.status(400).json(new apiResponse(400, "Coupon code has expired", {}, {}))
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json(new apiResponse(400, "Coupon code usage limit reached", {}, {}))
        }

        if (value.appliesToId && coupon.specificIds && coupon.specificIds.length > 0) {
            if (!coupon.specificIds.includes(new ObjectId(value.appliesToId))) {
                return res.status(400).json(new apiResponse(400, "Coupon code not applicable for this item", {}, {}))
            }
        }

        let discountAmount = 0
        if (coupon.discountType === 'percentage') {
            discountAmount = (value.amount * coupon.discountValue) / 100
            if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
                discountAmount = coupon.maxDiscountAmount
            }
        } else {
            discountAmount = coupon.discountValue
        }

        const finalAmount = Math.max(0, value.amount - discountAmount)

        return res.status(200).json(new apiResponse(200, "Coupon code validated successfully", {
            discountAmount,
            finalAmount,
            coupon: coupon
        }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

