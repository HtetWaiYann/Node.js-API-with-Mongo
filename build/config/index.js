"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound = dotenv_1.default.config();
if (envFound.error) {
    // This error will crash the whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
exports.default = {
    // Server run port
    port: process.env.PORT || 3000,
    // Mongodb database url
    databaseURL: process.env.MONGODB_URI || "",
    // jwt secret key and hash algorithms
    jwtSecret: process.env.JWT_SECRET,
    jwtAlgorithm: process.env.JWT_ALGO,
    //winston logger
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
    // api config
    api: {
        prefix: '/api',
    },
};
