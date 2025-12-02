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
        const hasImages = req.files && req.files.images && req.files.images.length > 0;
        const hasPdfs = req.files && req.files.pdf && req.files.pdf.length > 0;

        // At least one of images or pdf must be uploaded
        if (!hasImages && !hasPdfs) {
            return res.status(400).json(new apiResponse(400, "No files uploaded", {}, {}));
        }

        const uploadedImages: string[] = [];
        const uploadedPdfs: string[] = [];

        // MOVE IMAGES (if any)
        if (hasImages) {
            if (
                !req.body.category ||
                !Object.values(MEDIA_CATEGORY).includes(req.body.category)
            ) {
                return res.status(400).json(new apiResponse(400, "Invalid MediaCategory", {}, {}));
            }

            const imageDir = path.join(process.cwd(), "images", req.body.category);
            if (!fs.existsSync(imageDir)) {
                fs.mkdirSync(imageDir, { recursive: true });
            }

            req.files.images.forEach((file: any) => {
                const newPath = path.join(imageDir, file.filename);
                fs.renameSync(file.path, newPath);
                const imageUrl = `${config.BACKEND_URL}/images/${req.body.category}/${file.filename}`;
                uploadedImages.push(imageUrl);
            });
        }

        // MOVE PDFs (if any)
        if (hasPdfs) {
            const pdfDir = path.join(process.cwd(), "pdf");
            if (!fs.existsSync(pdfDir)) {
                fs.mkdirSync(pdfDir, { recursive: true });
            }

            req.files.pdf.forEach((file: any) => {
                const newPath = path.join(pdfDir, file.filename);
                fs.renameSync(file.path, newPath);
                const pdfUrl = `${config.BACKEND_URL}/pdf/${file.filename}`;
                uploadedPdfs.push(pdfUrl);
            });
        }

        return res.status(200).json(new apiResponse(200, "Files uploaded successfully", { images: uploadedImages, pdfs: uploadedPdfs }, {}));

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
});

router.delete("/", (req: any, res: any) => {
    reqInfo(req);
    try {
        const { fileUrl } = req.body;
        if (!fileUrl) {
            return res.status(400).json(new apiResponse(400, "fileUrl is required", {}, {}));
        }

        const parsedUrl = url.parse(fileUrl);
        const pathParts = (parsedUrl.pathname || "").split("/").filter(Boolean);
        // Expected:
        //  - Image: /images/:category/:filename  -> ["images", ":category", ":filename"]
        //  - PDF:   /pdf/:filename               -> ["pdf", ":filename"]

        const type = pathParts[0];

        if (type === "images") {
            const category = pathParts[1];
            const filename = pathParts[2];

            if (!category || !filename) {
                return res.status(400).json(new apiResponse(400, "Invalid image URL", {}, {}));
            }

            const imagePath = path.join(process.cwd(), "images", category, filename);

            if (!fs.existsSync(imagePath)) {
                return res.status(404).json(new apiResponse(404, "Image not found", {}, {}));
            }

            fs.unlinkSync(imagePath);
            return res.status(200).json(new apiResponse(200, "Image deleted successfully", {}, {}));
        }

        if (type === "pdf") {
            const filename = pathParts[1];

            if (!filename) {
                return res.status(400).json(new apiResponse(400, "Invalid pdf URL", {}, {}));
            }

            const pdfPath = path.join(process.cwd(), "pdf", filename);

            if (!fs.existsSync(pdfPath)) {
                return res.status(404).json(new apiResponse(404, "PDF not found", {}, {}));
            }

            fs.unlinkSync(pdfPath);
            return res.status(200).json(new apiResponse(200, "PDF deleted successfully", {}, {}));
        }

        return res.status(400).json(new apiResponse(400, "Unsupported file type in URL", {}, {}));
    } catch (error) {
        console.log(error);
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

router.get("/pdf", (req, res) => {
    reqInfo(req)
    try {
        const dir = path.join('pdf');

        if (!fs.existsSync(dir)) {
            return res.status(200).json(new apiResponse(200, "No pdf found", [], {}));
        }
        const images = fs.readdirSync(dir).map(
            (file) => `${config.BACKEND_URL}/pdf/${file}`
        );
        return res.status(200).json(new apiResponse(200, "PDF fetched successfully", images, {}));
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
});

export const uploadRoute = router