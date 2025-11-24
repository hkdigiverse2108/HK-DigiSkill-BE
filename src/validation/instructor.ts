import Joi from "joi";

export const addInstructorSchema = Joi.object().keys({
    image: Joi.string().allow('', null).optional(),
    name: Joi.string().required(),
    designation: Joi.string().allow('', null).optional(),
    linkedin: Joi.string().allow('', null).optional(),
    instagram: Joi.string().allow('', null).optional(),
    facebook: Joi.string().allow('', null).optional(),
    twitter: Joi.string().allow('', null).optional(),
})

export const editInstructorSchema = Joi.object().keys({
    instructorId: Joi.string().required(),
    image: Joi.string().allow('', null).optional(),
    name: Joi.string().optional(),
    designation: Joi.string().allow('', null).optional(),
    linkedin: Joi.string().allow('', null).optional(),
    instagram: Joi.string().allow('', null).optional(),
    facebook: Joi.string().allow('', null).optional(),
    twitter: Joi.string().allow('', null).optional(),
})

export const deleteInstructorSchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const getInstructorSchema = Joi.object().keys({
    id: Joi.string().required(),
})

