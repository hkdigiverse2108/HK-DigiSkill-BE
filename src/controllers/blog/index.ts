import { apiResponse } from "../../common";
import { blogModel } from "../../database";
import { countData, createData, getDataWithSorting, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { addBlogSchema, editBlogSchema, deleteBlogSchema, getBlogSchema } from "../../validation";

const ObjectId = require('mongoose').Types.ObjectId;

export const add_blog = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addBlogSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await createData(blogModel, value);
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("blog"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_blog_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editBlogSchema.validate(req.body)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))

        const response = await updateData(blogModel, { _id: new ObjectId(value.blogId), isDeleted: false }, value, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.updateDataError("blog"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("blog"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_blog_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteBlogSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await updateData(blogModel, { _id: new ObjectId(value.id) }, { isDeleted: true }, { new: true })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("blog"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("blog"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_blog = async (req, res) => {
    reqInfo(req)
    try {
        const { page, limit, search, startDate, endDate } = req.query
        let criteria: any = { isDeleted: false }, options: any = { lean: true }

        if (search) {
            criteria.$or = [
                { title: { $regex: search, $options: 'si' } },
                { subTitle: { $regex: search, $options: 'si' } },
                { category: { $regex: search, $options: 'si' } },
            ]
        }
        if (startDate && endDate) {
            criteria.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
        options.sort = { createdAt: -1 }
        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit)
            options.limit = parseInt(limit)
        }

        const response = await getDataWithSorting(blogModel, criteria, {}, options)
        const totalCount = await countData(blogModel, criteria)
        const stateObj = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || totalCount,
            page_limit: Math.ceil(totalCount / (parseInt(limit) || totalCount)) || 1,
        }
        return res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('blog'), { 
            blog_data: response, 
            totalData: totalCount, 
            state: stateObj 
        }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_blog_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getBlogSchema.validate(req.params)
        if (error) return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        const response = await getFirstMatch(blogModel, { _id: new ObjectId(value.id) }, {}, {})
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("blog"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("blog"), response, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}