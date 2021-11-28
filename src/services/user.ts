import { Service, Inject } from 'typedi';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { resetPwdInput } from '../interfaces/IUser';
import  mongoose from 'mongoose'

@Service()
export default class UserService {
  constructor(@Inject('userModel') private userModel: any, @Inject('logger') private logger: any) {}

  public async updatePassword(resetPwdInput: resetPwdInput): Promise<object> {
    try {
      const userRecord = await this.userModel.findOne({ email: resetPwdInput.email });
      if (!userRecord) {
        throw new Error('User not registered');
      }
      this.logger.silly('Checking password');
      const validPassword = await argon2.verify(userRecord.password, resetPwdInput.password);
      if (validPassword) {
        const salt = randomBytes(32);
        this.logger.silly('Hashing password');
        const hashedPassword = await argon2.hash(resetPwdInput.newpassword);
        const filter = { email: resetPwdInput.email };
        const update = { password: hashedPassword };
        try {
          await this.userModel.findOneAndUpdate(filter, update, {});
          const res = {
            "returncode" : "300",
            "message" : "Successfully updated!",
          }
          return res;
        } catch (e) {
          this.logger.error(e);
          throw e;
        }
      } else {
        throw new Error('Invalid Password');
      }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getAllUsers(): Promise<object>{
    try{
      const allRecords = await this.userModel.find({})
      const res = {
        "returncode" : "300",
        "data" : allRecords,
      }
      return (res)
    }
    catch (e){
      this.logger.error(e);
      throw e;
    }
  }

  public async deleteUser(id : string): Promise<object> {
    try {
      // const deleteid = new mongoose.Types.ObjectId(id)
      await this.userModel.deleteOne({_id : id})
      const res = {
        "returncode" : "300",
        "message" : "Successfully deleted!"
      }
      return (res)
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
