import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO } from '../interfaces/IUser';

@Service()
export default class AuthService {
  constructor(
    @Inject('userModel') private userModel: any,
    // @Inject('logger') private logger : any,
  ) {
  }

  public async SignUp(userInputDTO: IUserInputDTO): Promise<object> {
    try {
      const hashedPassword = await argon2.hash(userInputDTO.password);
      const userRecord = await this.userModel.create({
        ...userInputDTO,
        password: hashedPassword,
      });

      if (!userRecord) {
        throw new Error('User cannot be created');
      }

      const token = this.generateToken(userRecord);
      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      const res = {
        "returncode" : "300",
        "data" : user,
        "token" : token,
      }
      return (res);
    } catch (e) {
      throw e;
    }
  }

  public async SignIn(email: string, password: string): Promise<object> {
    const userRecord = await this.userModel.findOne({ email : email });
    if (!userRecord) {
      throw new Error('User not registered');
    }

    const validPassword = await argon2.verify(userRecord.password, password);
    if (validPassword) {
      const token = this.generateToken(userRecord);
      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      const res = {
        "returncode" : "300",
        "data" : user,
        "token" : token
      }
      return (res);
    } else {
      throw new Error('Invalid Password');
    }
  }

  private generateToken(user: any) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    // this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        _id: user._id, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        name: user.name,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret!
    );
  }
}
