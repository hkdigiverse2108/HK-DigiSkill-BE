import Joi from "joi";

export const addCourseCurriculumSchema = Joi.object().keys({
    courseId: Joi.string().optional(),
    courseLessonId: Joi.string().optional(),
    date: Joi.date().optional(),
    thumbnail: Joi.string().allow('', null).optional(),
    videoLink: Joi.string().allow('', null).optional(),
    title: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
    duration: Joi.string().allow('', null).optional(),
    attachment: Joi.string().allow('', null).optional(),
    courseLessonsAssigned: Joi.array().items(Joi.string()).optional(),
    courseLessonsPriority: Joi.number().default(0),
    curriculumLock: Joi.boolean().default(false),
})

export const editCourseCurriculumSchema = Joi.object().keys({
    courseCurriculumId: Joi.string().required(),
    courseId: Joi.string().optional(),
    courseLessonId: Joi.string().optional(),
    date: Joi.date().optional(),
    thumbnail: Joi.string().allow('', null).optional(),
    videoLink: Joi.string().allow('', null).optional(),
    title: Joi.string().optional(),
    description: Joi.string().allow('', null).optional(),
    duration: Joi.string().allow('', null).optional(),
    attachment: Joi.string().allow('', null).optional(),
    courseLessonsAssigned: Joi.array().items(Joi.string()).optional(),
    courseLessonsPriority: Joi.number().optional(),
    curriculumLock: Joi.boolean().optional(),
})

export const deleteCourseCurriculumSchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const getCourseCurriculumSchema = Joi.object().keys({
    id: Joi.string().required(),
})

