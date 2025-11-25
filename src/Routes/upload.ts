"use strict"
import { Router } from 'express'
import { reqInfo, responseMessage } from '../helper';
import { config } from '../../config';
import { apiResponse, MEDIA_CATEGORY } from '../common';
import fs from 'fs';
import path from 'path';
import url from 'url';

const router = Router()

router.post("/", (req: any, res: any) => {
    reqInfo(req)
    try {
        if (!req.files || !req.files.images || req.files.images.length === 0)
            return res.status(400).json(new apiResponse(400, "No files uploaded", {}, {}));
        
        if (!Object.values(MEDIA_CATEGORY).includes(req.body.category))
            return res.status(400).json(new apiResponse(400, "Invalid MediaCategory", {}, {}));

        const dir = path.join(process.cwd(), "images", req.body.category);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const uploadedImages: string[] = [];

        req.files.images.forEach((file: any) => {
            const newPath = path.join(dir, file.filename);
            fs.renameSync(file.path, newPath);
            const imageUrl = `${config.BACKEND_URL}/images/${req.body.category}/${file.filename}`;
            uploadedImages.push(imageUrl);
        });

        return res.status(200).json(new apiResponse(200, "Images uploaded successfully", uploadedImages, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
});

router.delete("/",  (req: any, res: any) => {
    reqInfo(req)
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) return res.status(400).json(new apiResponse(400, "Image URL is required", {}, {}));

        const parsedUrl = url.parse(imageUrl);
        const pathParts  = (parsedUrl.pathname || "").split("/");

        const category = pathParts[2];
        const filename = pathParts[3];
        if (!filename || !category) return res.status(400).json(new apiResponse(400, "Invalid image URL", {}, {}));

        const imagePath = path.join(process.cwd(), "images", category, filename);

        if (!fs.existsSync(imagePath)) return res.status(404).json(new apiResponse(404, "Image not found", {}, {}));

        fs.unlinkSync(imagePath);

        return res.status(200).json(new apiResponse(200, "Image deleted successfully", {}, {}));
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
});

router.get("/images/:category", (req, res) => {
    reqInfo(req)
    const { category } = req.params;
    try {
        if (!Object.values(MEDIA_CATEGORY).includes(category)) {
            return res.status(400).json(new apiResponse(400, "Invalid MediaCategory", {}, {}));
        }
        const dir = path.join('images', category);

        if (!fs.existsSync(dir)) {
            return res.status(200).json(new apiResponse(200, "No images found", [], {}));
        }
        const images = fs.readdirSync(dir).map(
            (file) => `${config.BACKEND_URL}/images/${category}/${file}`
        );
        return res.status(200).json(new apiResponse(200, "Images fetched successfully", images, {}));
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
});

export const uploadRoute = router