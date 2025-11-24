import Joi from "joi";

export const addEditSettingsSchema = Joi.object().keys({
    logo: Joi.string().allow('', null).optional(),
    razorpayKey: Joi.string().allow('', null).optional(),
    razorpaySecret: Joi.string().allow('', null).optional(),
    enrolledLearners: Joi.number().default(0),
    classCompleted: Joi.number().default(0),
    satisfactionRate: Joi.number().default(0),
    //contact info
    link: Joi.string().allow('', null).optional(),
    address: Joi.string().allow('', null).optional(),
    phoneNumber: Joi.string().allow('', null).optional(),
    email: Joi.string().email().allow('', null).optional(),
    socialMediaLinks: Joi.object().keys({
        facebook: Joi.string().allow('', null).optional(),
        twitter: Joi.string().allow('', null).optional(),
        instagram: Joi.string().allow('', null).optional(),
        linkedin: Joi.string().allow('', null).optional(),
    }).optional(),
});

