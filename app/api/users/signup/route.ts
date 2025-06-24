import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connect from "@/lib/db";
import User from "@/lib/modals/user";

export const POST = async (request: Request) => {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    await connect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 No role assigned
    const newUser = new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Signup error:", error);
    return NextResponse.json(
      { message: "Signup failed", error: error.message },
      { status: 500 }
    );
  }
};
