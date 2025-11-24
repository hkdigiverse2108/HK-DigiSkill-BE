import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { userModel } from '../database'
import { responseMessage } from './response'
import { apiResponse } from '../common'

const ObjectId = require('mongoose').Types.ObjectId

const jwt_token_secret = process.env.JWT_TOKEN_SECRET;

export const adminJWT = async (req: Request, res: Response, next) => {
    let { authorization } = req.headers, result: any
    if (authorization) {
        try {
            let isVerifyToken = jwt.verify(authorization, jwt_token_secret)
            result = await userModel.findOne({ _id: new ObjectId(isVerifyToken._id), isDeleted: false });
            if (result?.isBlocked == true) return res.status(403).json(new apiResponse(403, 'Your account has been blocked.', {}, {}));
            if (result?.isDeleted == false) {
                req.headers.user = result
                return next()
            } else {
                return res.status(401).json(new apiResponse(401, "Invalid-Token", {}, {}))
            }
        } catch (err) {
            if (err.message == "invalid signature") return res.status(403).json(new apiResponse(403, `Invalid Token`, {}, {}))
            else if (err.name === "TokenExpiredError") return res.status(410).json(new apiResponse(410, "Your token has been expired.", {}, {}));
            return res.status(401).json(new apiResponse(401, "Invalid Token", {}, {}))
        }
    } else {
        return res.status(401).json(new apiResponse(401, "Token not found in header", {}, {}))
    }
}

export const userJWT = async (req: Request, res: Response, next) => {
    let { authorization } = req.headers, result: any
    if (authorization) {
        try {
            let isVerifyToken = jwt.verify(authorization, jwt_token_secret)
            result = await userModel.findOne({ _id: new ObjectId(isVerifyToken._id), isDeleted: false }).lean()
            if (result?.isBlocked == true) return res.status(410).json(new apiResponse(410, responseMessage?.accountBlock, {}, {}));
            if (result?.isDeleted == false) {
                req.headers.user = result
                return next()
            } else {
                return next()
            }
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(410).json(new apiResponse(410, "Your token has been expired.", {}, {}));
            }
            if (err.message == "invalid signature") {
                return res.status(410).json(new apiResponse(410, `Invalid Token`, {}, {}))
            }
            console.log(err);
            return res.status(410).json(new apiResponse(410, "Invalid Token", {}, {}))
        }
    } else {
        return next()
    }
}