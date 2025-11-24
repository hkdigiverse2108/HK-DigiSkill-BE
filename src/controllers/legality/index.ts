import { apiResponse } from "../../common";
import { legalityModel } from "../../database";
import { getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { addEditLegalitySchema } from "../../validation";

export const add_legality = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addEditLegalitySchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await updateData(legalityModel, { isDeleted: false }, value, { upsert: true })

        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("legality"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}


export const get_legality = async (req, res) => {
    reqInfo(req)
    let match: any = {}, { typeFilter } = req.query
    try {
        
        if(typeFilter) match.type = typeFilter

        const response = await getFirstMatch(legalityModel, { isDeleted: false, ...match }, {}, {})

        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("settings"), {}, {}))

        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("settings"), response, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}
