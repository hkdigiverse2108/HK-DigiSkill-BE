import Joi from "joi";

export const addBlogSchema = Joi.object().keys({
    title: Joi.string().required(),
    subTitle: Joi.string().allow('', null).optional(),
    coverImage: Joi.string().allow('', null).optional(),
    mainImage: Joi.string().allow('', null).optional(),
    author: Joi.string().allow('', null).optional(),
    quote: Joi.string().allow('', null).optional(),
    content: Joi.string().required(),
    category: Joi.string().required(),
    isFeatured: Joi.boolean().default(false),
})

export const editBlogSchema = Joi.object().keys({
    blogId: Joi.string().required(),
    title: Joi.string().required(),
    subTitle: Joi.string().allow('', null).optional(),
    coverImage: Joi.string().allow('', null).optional(),
    mainImage: Joi.string().allow('', null).optional(),
    author: Joi.string().allow('', null).optional(),
    quote: Joi.string().allow('', null).optional(),
    content: Joi.string().required(),
    category: Joi.string().required(),
    isFeatured: Joi.boolean().default(false),
})

export const deleteBlogSchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const getBlogSchema = Joi.object().keys({
    id: Joi.string().required(),
})

