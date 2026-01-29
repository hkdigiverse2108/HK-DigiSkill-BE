import Joi from "joi";

export const addNewsletterSchema = Joi.object().keys({
    email: Joi.string().email().required(),
})

export const deleteNewsletterSchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const getNewsletterSchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const sendNewsletterSchema = Joi.object().keys({
    emails: Joi.array().items(Joi.string().required()).optional(),
    subject: Joi.string().required(),
    message: Joi.string().required(),
})