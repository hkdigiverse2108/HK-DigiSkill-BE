import { apiResponse } from "../../common";
import { settingsModel } from "../../database";
import { reqInfo, responseMessage, updateData } from "../../helper";
import { addEditSettingsSchema } from "../../validation";

export const add_edit_settings = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addEditSettingsSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await updateData(settingsModel, { isDeleted: false }, value, { upsert: true })

        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("settings"), response, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_settings = async (req, res) => {
    reqInfo(req)
    try {
        const response = await settingsModel.findOne({ isDeleted: false })

        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("settings"), {}, {}))

        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("settings"), response, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

