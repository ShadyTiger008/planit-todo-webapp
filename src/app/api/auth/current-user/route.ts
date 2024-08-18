// import { connectDB, getConnection } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "~/app/server/db";
import User from "~/app/server/models/user.model";
import { decodeToken } from "~/app/server/utils/decode_token";

connectDB();

export async function GET(request: NextRequest) {
  try {
    let token: any = request.cookies.get("auth");
    // console.log("Token: ", token);

    let authToken;

    // Check if token is present in query params
    if (!token) {
      const queryParams = new URLSearchParams(request.nextUrl.searchParams);
      authToken = queryParams.get("token") || "";
    } else {
      authToken = token.value;
    }

    if (!authToken) {
      return NextResponse.json(
        { message: "No token provided", success: false },
        { status: 404 }
      );
    }

    const { userId, email } = await decodeToken(authToken);

    const userData = await User.findOne({ _id: userId }).exec();

    if (!userData) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "User profile retrieved successfully",
        success: true,
        data: userData
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     const token = request.cookies.get("auth");

//     if (!token) {
//       return NextResponse.json(
//         { message: "No token provided", success: false },
//         { status: 404 }
//       );
//     }

//     const { userId } = await decodeToken(token.value);

//     const connection = await getConnection();

//     const [userData] = await connection.query(
//       `SELECT * FROM users WHERE userId=?`,
//       [userId]
//     );

//     if (!userData.length) {
//       return NextResponse.json(
//         { message: "User not found", success: false },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       {
//         message: "User profile retrieved successfully",
//         success: true,
//         data: userData[0]
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     return NextResponse.json(
//       { message: "Internal server error", success: false },
//       { status: 500 }
//     );
//   }
// }
