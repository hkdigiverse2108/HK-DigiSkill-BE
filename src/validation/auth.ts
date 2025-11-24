import Joi from "joi";

export const signUpSchema = Joi.object().keys({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone: Joi.string().optional(),
    designation: Joi.string().optional(),
    referralCode: Joi.string().optional(),
    agreeTerms: Joi.boolean().default(false),
});

export const loginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const resetPasswordSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    newPassword: Joi.string().required(),
});

export const otpVerifySchema = Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.string().pattern(/^\d{6}$/).required(),
});

export const forgotPasswordSchema = Joi.object().keys({
    email: Joi.string().email().required(),
});

export const changePasswordSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
});

export const updateProfileSchema = Joi.object().keys({
    fullName: Joi.string().optional(),
    phone: Joi.string().optional(),
    designation: Joi.string().optional(),
    profilePhoto: Joi.string().allow('', null).optional(),
});

export const deleteUserAccountSchema = Joi.object().keys({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    reason: Joi.string().required(),
    rate: Joi.number().integer().min(1).max(10).required(),
});