import mongoose, { Schema, Document, Models } from "mongoose";

export interface IMessage extends Document {
  content: string;
  createdAt: Date;
}

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isUserVerified: boolean;
  isUserAcceptingMessage: boolean;
  messages: IMessage[];
}

const MessageSchema: Schema<IMessage> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const UserSchema: Schema<IUser> = new Schema({
  userName: {
    type: String,
    required: [true, "User Name is Required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
    match: [
      /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
      "Please use a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is Required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is Required"],
  },
  isUserVerified: {
    type: Boolean,
    default: false,
  },
  isUserAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default UserModel;
