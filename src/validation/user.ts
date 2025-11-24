import Joi from "joi";

export const addUserSchema = Joi.object().keys({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().optional(),
    password: Joi.string().optional(),
    profilePhoto: Joi.string().allow('', null).optional(),
    designation: Joi.string().optional(),
    referralCode: Joi.string().optional(),
    agreeTerms: Joi.boolean().default(false),
    isEmailVerified: Joi.boolean().default(false),
    isBlocked: Joi.boolean().default(false),
});

export const editUserSchema = Joi.object().keys({
    userId: Joi.string().required(),
    fullName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string().optional(),
    profilePhoto: Joi.string().allow('', null).optional(),
    designation: Joi.string().optional(),
    referralCode: Joi.string().optional(),
    agreeTerms: Joi.boolean().optional(),
    isEmailVerified: Joi.boolean().optional(),
    isBlocked: Joi.boolean().optional(),
});

export const deleteUserSchema = Joi.object().keys({
    id: Joi.string().required(),
});

export const getUserSchema = Joi.object().keys({
    id: Joi.string().required(),
});

export const blockUnblockUserSchema = Joi.object().keys({
    userId: Joi.string().required(),
    isBlocked: Joi.boolean().required(),
});

