"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = void 0;
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
exports.multerConfig = platform_express_1.MulterModule.register({
    storage: (0, multer_1.diskStorage)({
        destination: './uploads',
        filename: (req, file, callback) => {
            const uniqueName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
            callback(null, uniqueName);
        },
    }),
    fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
            return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
//# sourceMappingURL=multer.config.js.map