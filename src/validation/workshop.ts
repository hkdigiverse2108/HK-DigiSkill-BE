import Joi from "joi";

export const addWorkshopSchema = Joi.object().keys({
    image: Joi.string().allow('', null).optional(),
    title: Joi.string().required(),
    subTitle: Joi.string().allow('', null).optional(),
    about: Joi.string().allow('', null).optional(),
    pdfAttach: Joi.string().allow('', null).optional(),
    workshopCurriculum: Joi.array().items(Joi.string()).optional(),
    workshopTestimonials: Joi.array().items(Joi.string()).optional(),
    workshopFAQ: Joi.array().items(Joi.string()).optional(),
    price: Joi.number().default(0),
    mrpPrice: Joi.number().default(0),
    validFor: Joi.string().allow('', null).optional(),
    couponCode: Joi.string().allow('', null).optional(),
    language: Joi.string().allow('', null).optional(),
    duration: Joi.string().allow('', null).optional(),
})

export const editWorkshopSchema = Joi.object().keys({
    workshopId: Joi.string().required(),
    image: Joi.string().allow('', null).optional(),
    title: Joi.string().optional(),
    subTitle: Joi.string().allow('', null).optional(),
    about: Joi.string().allow('', null).optional(),
    pdfAttach: Joi.string().allow('', null).optional(),
    workshopCurriculum: Joi.array().items(Joi.string()).optional(),
    workshopTestimonials: Joi.array().items(Joi.string()).optional(),
    workshopFAQ: Joi.array().items(Joi.string()).optional(),
    price: Joi.number().optional(),
    mrpPrice: Joi.number().optional(),
    validFor: Joi.string().allow('', null).optional(),
    couponCode: Joi.string().allow('', null).optional(),
    language: Joi.string().allow('', null).optional(),
    duration: Joi.string().allow('', null).optional(),
})

export const deleteWorkshopSchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const getWorkshopSchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const purchaseWorkshopSchema = Joi.object().keys({
    workshopId: Joi.string().required(),
    amount: Joi.number().optional(),
    paymentId: Joi.string().allow('', null).optional(),
    paymentMethod: Joi.string().allow('', null).optional(),
    receiptNumber: Joi.string().allow('', null).optional(),
    discountAmount: Joi.number().default(0),
    finalAmount: Joi.number().optional(),
})

