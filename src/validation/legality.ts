import Joi from "joi";
import { LEGALITY_TYPE } from "../common";

export const addEditLegalitySchema = Joi.object().keys({
    type: Joi.string().valid(...Object.values(LEGALITY_TYPE)).required(),
    content: Joi.string().required(),
})
