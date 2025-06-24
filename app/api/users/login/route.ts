import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connect from "@/lib/db";
import User from "@/lib/modals/user";

const JWT_SECRET = process.env.JWT_SECRET || "yoursecret"; // Use environment variable in production

export const POST = async (request: Request) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email , 
        isAdmin: user.isAdmin || false 
       },
      JWT_SECRET,
      { expiresIn: "7d" }
    );



  

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin || false,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { message: "Login failed", error: error.message },
      { status: 500 }
    );
  }
};
