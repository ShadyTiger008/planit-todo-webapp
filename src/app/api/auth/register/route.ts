import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "~/app/server/db";
import User from "~/app/server/models/user.model";
import { v4 as uuidv4 } from "uuid";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const { fullName, userName, email, password } = await request.json();

    // Validate required fields
    if (!fullName || !userName || !email || !password) {
      throw new Error("All fields are required");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      throw new Error("User with this email or userName already exists");
    }

    // Create a new user
    const newUser = new User({
      userId: uuidv4(),
      fullName,
      userName,
      email,
      password, // This will be hashed in the pre-save middleware
    });

    // Save user to the database
    await newUser.save();

    // Generate tokens
    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();

    // Update refresh token in MongoDB
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Prepare response
    const response = NextResponse.json(
      {
        success: true,
        message: "User successfully registered",
        data: newUser,
      },
      { status: 201 },
    );

    // Set refresh token as cookie
    const expiresInMs = Number(process.env.REFRESH_TOKEN_EXPIRY) * 1000; // Convert to milliseconds
    const expiryDate = new Date(Date.now() + expiresInMs);
    response.cookies.set("auth", refreshToken, { expires: expiryDate });

    return response;
  } catch (error: any) {
    console.error("Error during registration:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
