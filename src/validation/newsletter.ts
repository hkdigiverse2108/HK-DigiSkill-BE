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

