import Joi from "joi";

export const addTrustedPartnerSchema = Joi.object().keys({
    image: Joi.string().allow('', null).optional(),
    name: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
})

export const editTrustedPartnerSchema = Joi.object().keys({
    trustedPartnerId: Joi.string().required(),
    image: Joi.string().allow('', null).optional(),
    name: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
})

export const deleteTrustedPartnerSchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const getTrustedPartnerSchema = Joi.object().keys({
    id: Joi.string().required(),
})

