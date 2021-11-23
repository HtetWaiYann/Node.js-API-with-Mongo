import { IUser } from '../interfaces/IUser';
import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      //optional
      //   required: [true, 'Please enter a full name'],
      //   index: true,
    },
    email: {
      type: String,
      //optional
      //   lowercase: true,
      //   unique: true,
      //   index: true,
    },
    password: String,
    role: {
      type: String,
      default: 'user',
    },
  },
  { timestamps: true },
);

// 'User' is table name, User is database schema
export default mongoose.model<IUser & mongoose.Document>('User', User);
