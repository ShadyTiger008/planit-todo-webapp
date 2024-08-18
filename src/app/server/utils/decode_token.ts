import jwt from "jsonwebtoken";

export const decodeToken = async (token: string) => {
  try {
    if (!token) {
      throw new Error("No token provided");
    }

    // @ts-ignore
    const decoded = await jwt.decode(token, process.env.REFRESH_TOKEN_SECRET);

    if (!decoded) {
      throw new Error("Invalid token");
    }

    return {
      userId: decoded._id,
      email: decoded.email
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    throw new Error("Token decoding failed");
  }
};
