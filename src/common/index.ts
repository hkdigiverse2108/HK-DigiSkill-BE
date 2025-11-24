import { config } from "../../config"
import { userModel } from "../database"
import { getFirstMatch } from "../helper"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const jwt_token_secret = config.JWT_TOKEN_SECRET

export class apiResponse {
    private status: number | null
    private message: string | null
    private data: any | null
    private error: any | null
    constructor(status: number, message: string, data: any, error: any) {
        this.status = status
        this.message = message
        this.data = data
        this.error = error
    }
}

export const userStatus = {
    user: "user",
    admin: "admin",
    upload: "upload"
}

export const USER_ROLES = {
    ADMIN: "admin",
    USER: "user",
}

const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

export const getUniqueOtp = async () => {
    let otp;
    let isUnique = false;

    while (!isUnique) {
        otp = generateOtp();
        const isAlreadyAssign = await getFirstMatch(userModel, { otp }, {}, {});
        if (!isAlreadyAssign) {
            isUnique = true;
        }
    }

    return otp;
};

export const generateHash = async (password = '') => {
    const salt = await bcryptjs.genSaltSync(10)
    const hashPassword = await bcryptjs.hash(password, salt)
    return hashPassword
}

export const generateToken = (data = {}, expiresIn = {}) => {
    const token = jwt.sign(data, jwt_token_secret, expiresIn)
    return token
}

export const TESTIMONIAL_STATUS = {
    HOME: "home",
    WORKSHOP: "workshop",
    COURSE: "course",
}

export const FAQ_STATUS = {
    HOME: "home",
    WORKSHOP: "workshop",
    COURSE: "course",
}

export const HERO_BANNER_TYPE = {
    WEB: "web",
    APP: "app",
}

export const LEGALITY_TYPE = {
    TERMS_CONDITION: "termsCondition",
    PRIVACY_POLICY: "privacyPolicy",
    REFUND_POLICY: "refundPolicy",
}

export const PAYMENT_STATUS = {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
    REFUNDED: "refunded",
}

export const DISCOUNT_TYPE = {
    PERCENTAGE: "percentage",
    FLAT: "flat",
}

export const COUPON_CODE_APPLIES_TO = {
    COURSE: "course",
    WORKSHOP: "workshop",
    DEFAULT: "default"
}

export const COUPON_STATUS = {
    ACTIVE: "active",
    IN_ACTIVE: "inactive",
    EXPIRED: "expired",
}

export const REFERRAL_CODE_STATUS = {
    ACTIVE: "active",
    IN_ACTIVE: "inactive",
    EXPIRED: "expired",
}

export const REFERRAL_REWARD_TYPE = {
    PERCENTAGE: "percentage",
    FLAT: "flat",
}