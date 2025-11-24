import Joi from "joi";

export const addGallerySchema = Joi.object().keys({
    images: Joi.array().items(Joi.string()).required(),
    title: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
})

export const editGallerySchema = Joi.object().keys({
    galleryId: Joi.string().required(),
    images: Joi.array().items(Joi.string()).optional(),
    title: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
})

export const deleteGallerySchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const getGallerySchema = Joi.object().keys({
    id: Joi.string().required(),
})

