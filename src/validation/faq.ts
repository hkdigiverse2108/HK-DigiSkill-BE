import Joi from "joi";
import { FAQ_STATUS } from "../common";

export const addFaqSchema = Joi.object().keys({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    learningCatalogId: Joi.string().optional(),
    isFeatured: Joi.boolean().default(false),
    type: Joi.string().valid(...Object.values(FAQ_STATUS)),
})

export const editFaqSchema = Joi.object().keys({
    faqId: Joi.string().required(),
    question: Joi.string().required(),
    answer: Joi.string().required(),
    learningCatalogId: Joi.string().optional(),
    isFeatured: Joi.boolean().default(false),
    type: Joi.string().valid(...Object.values(FAQ_STATUS)).optional(),
})

export const deleteFaqSchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const getFaqSchema = Joi.object().keys({
    id: Joi.string().required(),
})

