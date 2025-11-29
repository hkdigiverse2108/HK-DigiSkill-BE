"use strict"
import bcryptjs from 'bcryptjs'
import { Request, Response } from 'express'
import { userModel, userAccountDeletionModel } from '../../database'
import { apiResponse, generateHash, generateToken, getUniqueOtp, USER_ROLES } from '../../common'
import { createData, email_verification_mail, getFirstMatch, reqInfo, responseMessage, updateData } from '../../helper'
import { forgotPasswordSchema, otpVerifySchema, resetPasswordSchema, signUpSchema, changePasswordSchema, updateProfileSchema, deleteUserAccountSchema, resendOTPSchema } from '../../validation'

const ObjectId = require('mongoose').Types.ObjectId

export const signUp = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = signUpSchema.validate(req.body)

        if (error) {
            return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}));
        }
        let isAlready: any = await getFirstMatch(userModel, {
            $or: [
                { email: value?.email },
            ]
        }, {}, {});

        if (isAlready) {
            if (isAlready.email === value?.email) {
                return res.status(404).json(new apiResponse(404, responseMessage?.alreadyEmail, {}, {}));
            }
        }

        if (isAlready?.isBlocked == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))

        const payload = { ...value }
        payload.password = await generateHash(payload.password)
        payload.role = USER_ROLES.ADMIN

        let otp = await getUniqueOtp()

        payload.otp = otp;
        payload.isEmailVerified = false

        let response = await createData(userModel, payload);

        response = {
            userType: response?.userType,
            _id: response?._id,
            email: response?.email,
        }

        return res.status(200).json(new apiResponse(200, "Signup Successfully", response, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const otp_verification = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = otpVerifySchema.validate(req.body)

        if (error) {
            return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}));
        }

        let data = await getFirstMatch(userModel, { email: value?.email, otp: value?.otp }, {}, {});

        if (!data) return res.status(400).json(new apiResponse(400, responseMessage?.invalidOTP, {}, {}))
        if (data.isBlocked == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))
        if (new Date(data.otpExpireTime).getTime() < new Date().getTime()) return res.status(410).json(new apiResponse(410, responseMessage?.expireOTP, {}, {}))

        if (data) {
            let response: any
            response = await updateData(userModel, { _id: new ObjectId(data?._id) }, { otp: null, isEmailVerified: true }, { new: true })

            let expiresIn = { expiresIn: '24h' };

            const token = await generateToken({
                _id: response._id,
                status: "Login",
                generatedOn: (new Date().getTime())
            }, expiresIn)

            const result = {
                isEmailVerified: response?.isEmailVerified,
                _id: response?._id,
                email: response?.email,
                role: response?.role,
                fullName: response?.fullName,
                token,
            }
            return res.status(200).json(new apiResponse(200, responseMessage?.OTPVerified, result, {}))
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const login = async (req: Request, res: Response) => { //email or password // phone or password
    reqInfo(req)
    let body = req.body, response: any
    try {
        response = await getFirstMatch(userModel, { email: body?.email, isDeleted: false }, {}, {})

        if (!response) return res.status(400).json(new apiResponse(400, responseMessage?.invalidUserPasswordEmail, {}, {}))
        if (response?.isBlocked == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))

        const passwordMatch = await bcryptjs.compare(body.password, response.password)
        if (!passwordMatch) return res.status(400).json(new apiResponse(400, responseMessage?.invalidUserPasswordEmail, {}, {}))

        const token = await generateToken({
            _id: response._id,
            status: "Login",
            generatedOn: (new Date().getTime())
        }, { expiresIn: '24h' })

        response = {
            isEmailVerified: response?.isEmailVerified,
            role: response?.role,
            _id: response?._id,
            email: response?.email,
            fullName: response?.fullName,
            token,
        }
        return res.status(200).json(new apiResponse(200, responseMessage?.loginSuccess, response, {}))

    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const forgot_password = async (req, res) => {
    reqInfo(req);
    try {

        const { error, value } = forgotPasswordSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}));

        let data = await getFirstMatch(userModel, { email: value?.email, isDeleted: false }, {}, {})

        if (!data) return res.status(400).json(new apiResponse(400, responseMessage?.invalidEmail, {}, {}));

        if (data.isBlocked == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}));

        const otp = await getUniqueOtp()
        const otpExpireTime = new Date(Date.now() + 2 * 60 * 1000);

        email_verification_mail(data, otp);

        let response = await updateData(userModel, { _id: new ObjectId(data?._id) }, { otp, otpExpireTime }, { new: true })

        if (response) return res.status(200).json(new apiResponse(200, responseMessage?.otpSendSuccess, {}, {}));
        return res.status(501).json(new apiResponse(501, responseMessage?.errorMail, {}, `${response}`));

    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error));
    }
};

export const reset_password = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = resetPasswordSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}));

        const hashPassword = await generateHash(value.newPassword)

        const payload = { password: hashPassword }

        let response = await updateData(userModel, { email: value?.email, isDeleted: false }, payload, { new: true })

        if (!response) return res.status(405).json(new apiResponse(405, responseMessage?.resetPasswordError, {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.resetPasswordSuccess, response, {}))

    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const resend_otp = async (req, res) => {
    reqInfo(req);
    try {
        const { error, value } = resendOTPSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}));

        const admin = await getFirstMatch(userModel, { email: value.email, isDeleted: false }, {}, {});
        if (!admin) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound('user'), {}, {}));

        if (admin.isBlocked) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}));

        const otp = await getUniqueOtp();
        const otpExpireTime = new Date(Date.now() + 2 * 60 * 1000);

        await updateData(userModel, { _id: new ObjectId(admin._id) }, { otp, otpExpireTime }, {});

        await email_verification_mail(admin, otp);

        return res.status(200).json(new apiResponse(200, responseMessage?.otpSendSuccess, {}, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error));
    }
};

export const change_user_password = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = changePasswordSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}));

        let user = await getFirstMatch(userModel, { email: value?.email, isDeleted: false }, {}, {})
        if (!user) return res.status(405).json(new apiResponse(405, responseMessage?.getDataNotFound('user'), {}, {}));

        const isPasswordMatch = await bcryptjs.compare(value.oldPassword, user.password);
        if (!isPasswordMatch) return res.status(400).json(new apiResponse(400, responseMessage?.oldPasswordError, {}, {}));

        const hashPassword = await generateHash(value.newPassword)

        let response = await updateData(userModel, { email: value?.email, isDeleted: false }, { password: hashPassword }, {})

        if (!response) return res.status(405).json(new apiResponse(405, responseMessage?.passwordChangeError, {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.passwordChangeSuccess, response, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const update_profile = async (req, res) => {
    reqInfo(req)
    let { user } = req.headers
    try {
        const { error, value } = updateProfileSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}));

        let isExist = await getFirstMatch(userModel, { _id: new ObjectId(user._id), isDeleted: false }, {}, {})
        if (!isExist) return res.status(405).json(new apiResponse(405, responseMessage?.getDataNotFound('user'), {}, {}));

        let response = await updateData(userModel, { _id: new ObjectId(user._id), isDeleted: false }, value, {})

        if (!response) return res.status(405).json(new apiResponse(405, responseMessage?.updateDataError('profile'), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess('profile'), response, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_user_account = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteUserAccountSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}));

        // Find user by email
        let user = await getFirstMatch(userModel, { email: value?.email, isDeleted: false, role: USER_ROLES.USER }, {}, {})
        if (!user) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound('user'), {}, {}));

        if (user.fullName !== value.fullName) {
            return res.status(400).json(new apiResponse(400, "Full name does not match", {}, {}));
        }

        const passwordMatch = await bcryptjs.compare(value.password, user.password)
        if (!passwordMatch) return res.status(400).json(new apiResponse(400, "Invalid password", {}, {}));

        if (user.isBlocked == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}));

        const deletionRecord = {
            userId: user._id,
            fullName: value.fullName,
            email: value.email,
            reason: value.reason,
            rate: value.rate
        }
        await createData(userAccountDeletionModel, deletionRecord);

        let response = await updateData(userModel, { _id: new ObjectId(user._id), isDeleted: false }, { isDeleted: true }, {})

        if (!response) return res.status(405).json(new apiResponse(405, "Failed to delete account", {}, {}))
        return res.status(200).json(new apiResponse(200, "Account deleted successfully", {}, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}