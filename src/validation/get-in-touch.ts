import Joi from "joi";

export const addGetInTouchSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().allow('', null).optional(),
    subject: Joi.string().allow('', null).optional(),
    message: Joi.string().optional(),
})

export const editGetInTouchSchema = Joi.object().keys({
    getInTouchId: Joi.string().required(),
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string().allow('', null).optional(),
    subject: Joi.string().allow('', null).optional(),
    message: Joi.string().optional(),
    isRead: Joi.boolean().optional(),
})

export const deleteGetInTouchSchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const getGetInTouchSchema = Joi.object().keys({
    id: Joi.string().required(),
})

