import Joi from "joi";

export const addCourseCategorySchema = Joi.object().keys({
    name: Joi.string().required(),
    image: Joi.string().optional(),
    description: Joi.string().allow('', null).optional(),
    isFeatured: Joi.boolean().default(false),
    isBlocked: Joi.boolean().default(false),
});

export const editCourseCategorySchema = Joi.object().keys({
    courseCategoryId: Joi.string().required(),
    name: Joi.string().optional(),
    image: Joi.string().optional(),
    description: Joi.string().allow('', null).optional(),
    isFeatured: Joi.boolean().optional(),
    isBlocked: Joi.boolean().optional(),
});

export const deleteCourseCategorySchema = Joi.object().keys({
    id: Joi.string().required(),
});

export const getCourseCategorySchema = Joi.object().keys({
    id: Joi.string().required(),
});

