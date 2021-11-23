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
const auth_1 = __importDefault(require("../../services/auth"));
const celebrate_1 = require("celebrate");
const middlewares_1 = __importDefault(require("../middlewares"));
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/auth', route);
    //Sign up
    route.post('/signup', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            name: celebrate_1.Joi.string().required(),
            email: celebrate_1.Joi.string().required(),
            password: celebrate_1.Joi.string().required(),
        }),
    }), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const logger = typedi_1.Container.get('logger');
        logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
        try {
            const authServiceInstance = typedi_1.Container.get(auth_1.default);
            const { user } = yield authServiceInstance.SignUp(req.body);
            return res.status(201).json({ user });
        }
        catch (e) {
            logger.error('🔥 error: %o', e);
            return next(e);
        }
    }));
    // Sign in
    route.post('/signin', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            email: celebrate_1.Joi.string().required(),
            password: celebrate_1.Joi.string().required(),
        }),
    }), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const logger = typedi_1.Container.get('logger');
        logger.debug('Calling Sign-In endpoint with body: %o', req.body);
        try {
            const { email, password } = req.body;
            const authServiceInstance = typedi_1.Container.get(auth_1.default);
            const { user, token } = yield authServiceInstance.SignIn(email, password);
            return res.json({ user, token }).status(200);
        }
        catch (e) {
            logger.error('🔥 error: %o', e);
            return next(e);
        }
    }));
    // Log out function - We try to get the token from the header first using the middlewares
    route.post('/logout', middlewares_1.default.isAuth, (req, res, next) => {
        const logger = typedi_1.Container.get('logger');
        logger.debug('Calling Sign-Out endpoint with body: %o', req.body);
        try {
            const logger = typedi_1.Container.get('logger');
            logger.info("Ha! Token is correct!");
            return res.status(200).json({
                "message": "You are logged out."
            });
        }
        catch (e) {
            logger.error('🔥 error %o', e);
            return next(e);
        }
    });
};
