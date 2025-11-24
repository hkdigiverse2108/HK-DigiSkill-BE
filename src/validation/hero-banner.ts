import Joi from "joi";
import { HERO_BANNER_TYPE } from "../common";

export const addHeroBannerSchema = Joi.object().keys({
    type: Joi.string().valid(...Object.values(HERO_BANNER_TYPE)).required(),
    title: Joi.string().allow('', null).optional(),
    description: Joi.string().allow('', null).optional(),
    images: Joi.array().items(Joi.string()).optional(), // For Web type
    link: Joi.string().allow('', null).optional(), // For App type
    image: Joi.string().allow('', null).optional(), // For App type
})

export const editHeroBannerSchema = Joi.object().keys({
    heroBannerId: Joi.string().required(),
    type: Joi.string().valid(...Object.values(HERO_BANNER_TYPE)).optional(),
    title: Joi.string().allow('', null).optional(),
    description: Joi.string().allow('', null).optional(),
    images: Joi.array().items(Joi.string()).optional(),
    link: Joi.string().allow('', null).optional(),
    image: Joi.string().allow('', null).optional(),
})

export const deleteHeroBannerSchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const getHeroBannerSchema = Joi.object().keys({
    id: Joi.string().required(),
})

