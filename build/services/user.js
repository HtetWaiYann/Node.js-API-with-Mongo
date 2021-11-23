"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const typedi_1 = require("typedi");
const argon2_1 = __importDefault(require("argon2"));
const crypto_1 = require("crypto");
let UserService = class UserService {
    constructor(userModel, logger) {
        this.userModel = userModel;
        this.logger = logger;
    }
    updatePassword(resetPwdInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRecord = yield this.userModel.findOne({ email: resetPwdInput.email });
                if (!userRecord) {
                    throw new Error('User not registered');
                }
                /**
                 * We use verify from argon2 to prevent 'timing based' attacks
                 */
                this.logger.silly('Checking password');
                const validPassword = yield argon2_1.default.verify(userRecord.password, resetPwdInput.password);
                if (validPassword) {
                    const salt = (0, crypto_1.randomBytes)(32);
                    this.logger.silly('Hashing password');
                    const hashedPassword = yield argon2_1.default.hash(resetPwdInput.newpassword);
                    const filter = { email: resetPwdInput.email };
                    const update = { password: hashedPassword };
                    try {
                        yield this.userModel.findOneAndUpdate(filter, update, {});
                        return { message: 'Password updated successfully!' };
                    }
                    catch (e) {
                        this.logger.error(e);
                        throw e;
                    }
                }
                else {
                    throw new Error('Invalid Password');
                }
            }
            catch (e) {
                this.logger.error(e);
                throw e;
            }
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userModel.deleteOne({ _id: id });
                return ({ "message": "User deleted successfully." });
            }
            catch (e) {
                this.logger.error(e);
                throw e;
            }
        });
    }
};
UserService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('userModel')),
    __param(1, (0, typedi_1.Inject)('logger')),
    __metadata("design:paramtypes", [Object, Object])
], UserService);
exports.default = UserService;
