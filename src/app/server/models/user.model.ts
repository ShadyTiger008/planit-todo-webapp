import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  userId: string;
  fullName: string;
  userName: string;
  gender?: string;
  email: string;
  phone: string;
  occupation?: string;
  password: string;
  type: Number;
  status?: Number;
  otp?: number;
  isVerified?: boolean;
  otpVerified?: boolean;
  profileImage?: string;
  refreshToken?: string;

  // Methods
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    gender: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    occupation: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
      default: 1,
    },
    status: {
      type: Number,
      required: true,
      default: 1,
    },
    otp: {
      type: Number,
      default: null,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    otpGeneratedAt: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: null,
    },
    coverImage: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

userSchema.index({ username: 1, email: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

const User =
  mongoose.models.Users || mongoose.model<IUser>("Users", userSchema);

export default User;
