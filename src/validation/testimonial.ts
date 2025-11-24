import Joi from "joi";
import { TESTIMONIAL_STATUS } from "../common";

export const addTestimonialSchema = Joi.object().keys({
    image: Joi.string().allow('', null).optional(),
    name: Joi.string().required(),
    designation: Joi.string().allow('', null).optional(),
    rate: Joi.number().min(0).max(5).optional(),
    description: Joi.string().allow('', null).optional(),
    isFeatured: Joi.boolean().default(false),
    type: Joi.string().valid(...Object.values(TESTIMONIAL_STATUS)).required(),
})

export const editTestimonialSchema = Joi.object().keys({
    testimonialId: Joi.string().required(),
    image: Joi.string().allow('', null).optional(),
    name: Joi.string().required(),
    designation: Joi.string().allow('', null).optional(),
    rate: Joi.number().min(0).max(5).optional(),
    description: Joi.string().allow('', null).optional(),
    isFeatured: Joi.boolean().default(false),
    type: Joi.string().valid(...Object.values(TESTIMONIAL_STATUS)).optional(),
})

export const deleteTestimonialSchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const getTestimonialSchema = Joi.object().keys({
    id: Joi.string().required(),
})

