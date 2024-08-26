// import { connectDB, getConnection } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "~/app/server/db";
import User from "~/app/server/models/user.model";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const { email, userName, password } = await request.json();

    if (!email && !password) {
      throw new Error("Email and password are required");
    }

    // Find user by email in MongoDB
    const user = await User.findOne({ $or: [{ email }, { userName }] });

    if (!user) {
      throw new Error("No user exists with this email");
    }

    // If password is not provided, generate OTP
    // if (!password) {
    //   const generatedOtp = await generateOTP(); // Implement this function as needed

    //   // Update user's OTP in MongoDB
    //   user.otp = generatedOtp;
    //   user.otpVerified = false;
    //   await user.save();

    //   // Send OTP email (implement sendEmail function)
    //   await sendEmail({
    //     mail_type: mailTypes[1],
    //     email: user.email,
    //     subject: "Your One-Time Password (OTP) for Login Verification",
    //     title: "Welcome! Here's Your OTP to Access Your Account",
    //     otp: generatedOtp,
    //     name: user.fullName,
    //   });

    //   return NextResponse.json(
    //     {
    //       message: "An OTP is sent to your email. Check your mail!",
    //       success: true,
    //     },
    //     { status: 200 },
    //   );
    // }

    // Validate password
    const isValidPassword = await user.isPasswordCorrect(password);

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Update refresh token in MongoDB
    user.refreshToken = refreshToken;
    await user.save();

    // Prepare response
    const response = NextResponse.json(
      {
        success: true,
        message: "User successfully logged in",
        data: user,
      },
      { status: 200 },
    );

    // Set refresh token as cookie
    const expiresInMs = Number(process.env.REFRESH_TOKEN_EXPIRY) * 1500000000; // Convert seconds to milliseconds
    const expiryDate = new Date(Date.now() + expiresInMs);
    response.cookies.set("auth", refreshToken, { expires: expiryDate });

    return response;
  } catch (error: any) {
    console.error("Error logging in:", error);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
