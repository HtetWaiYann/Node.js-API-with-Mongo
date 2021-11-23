"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const celebrate_1 = require("celebrate");
const middlewares_1 = __importDefault(require("../middlewares"));
const user_1 = __importDefault(require("../../services/user"));
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/user', route);
    //Reset Password
    route.post('/resetpwd', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            email: celebrate_1.Joi.string().required(),
            password: celebrate_1.Joi.string().required(),
            newpassword: celebrate_1.Joi.string().required(),
        }),
    }), middlewares_1.default.isAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const logger = typedi_1.Container.get('logger');
        logger.debug('Calling Reset Password endpoint with body: %o', req.body);
        try {
            const authServiceInstance = typedi_1.Container.get(user_1.default);
            const result = yield authServiceInstance.updatePassword(req.body);
            return res.status(201).json(result);
        }
        catch (e) {
            logger.error('🔥 error: %o', e);
            return next(e);
        }
    }));
    route.post('/delete', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            id: celebrate_1.Joi.string().required()
        }),
    }), middlewares_1.default.isAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const logger = typedi_1.Container.get('logger');
        logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
        try {
            const authServiceInstance = typedi_1.Container.get(user_1.default);
            const result = yield authServiceInstance.deleteUser(req.body.id);
            return res.status(201).json(result);
        }
        catch (e) {
            logger.error('🔥 error: %o', e);
            return next(e);
        }
    }));
};
