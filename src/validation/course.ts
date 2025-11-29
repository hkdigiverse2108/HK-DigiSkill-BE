import Joi from "joi";

export const addCourseSchema = Joi.object().keys({
    name: Joi.string().required(),
    courseCategoryId: Joi.string().required(),
    courseCurriculumIds: Joi.array().items(Joi.string()).required(),
    description: Joi.string().allow('', null).optional(),
    price: Joi.number().default(0),
    image: Joi.string().allow('', null).optional(),
    purchasedCoursesShow: Joi.boolean().default(false),
    enrolledLearners: Joi.number().default(0),
    classCompleted: Joi.number().default(0),
    satisfactionRate: Joi.number().default(0),
});

export const editCourseSchema = Joi.object().keys({
    courseId: Joi.string().required(),
    name: Joi.string().optional(),
    courseCategoryId: Joi.string().optional(),
    courseCurriculumIds: Joi.array().items(Joi.string()).optional(),
    description: Joi.string().allow('', null).optional(),
    price: Joi.number().optional(),
    image: Joi.string().allow('', null).optional(),
    purchasedCoursesShow: Joi.boolean().optional(),
    enrolledLearners: Joi.number().optional(),
    classCompleted: Joi.number().optional(),
    satisfactionRate: Joi.number().optional(),
});

export const deleteCourseSchema = Joi.object().keys({
    id: Joi.string().required(),
});

export const getCourseSchema = Joi.object().keys({
    id: Joi.string().required(),
});

export const purchaseCourseSchema = Joi.object().keys({
    courseId: Joi.string().required(),
    razorpayOrderId: Joi.string().optional(),
    razorpayPaymentId: Joi.string().optional(),
});

