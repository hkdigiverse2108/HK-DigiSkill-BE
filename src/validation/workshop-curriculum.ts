import Joi from "joi";

export const addWorkshopCurriculumSchema = Joi.object().keys({
    workshopId: Joi.string().required(),
    date: Joi.date().optional(),
    thumbnail: Joi.string().allow('', null).optional(),
    videoLink: Joi.string().allow('', null).optional(),
    title: Joi.string().required(),
    priority: Joi.number().required(),
    description: Joi.string().allow('', null).optional(),
    duration: Joi.number().optional(),
    attachment: Joi.string().allow('', null).optional(),
})

export const editWorkshopCurriculumSchema = Joi.object().keys({
    workshopCurriculumId: Joi.string().required(),
    workshopId: Joi.string().optional(),
    date: Joi.date().optional(),
    thumbnail: Joi.string().allow('', null).optional(),
    videoLink: Joi.string().allow('', null).optional(),
    title: Joi.string().optional(),
    priority: Joi.number().optional(),
    description: Joi.string().allow('', null).optional(),
    duration: Joi.number().optional(),
    attachment: Joi.string().allow('', null).optional(),
})

export const deleteWorkshopCurriculumSchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const getWorkshopCurriculumSchema = Joi.object().keys({
    id: Joi.string().required(),
})

