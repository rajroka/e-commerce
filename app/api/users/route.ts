import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";



export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json(
      { message: "Error in fetching users", error: error.message },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();

    const newUser = new User(body);
    await newUser.save();

    return NextResponse.json(
      { message: "User is created", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error in creating user", error: error.message },
      { status: 500 }
    );
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newuserName } = body;

    await connect();

    if (!userId || !newuserName) {
      return NextResponse.json(
        { message: "ID or new username not provided" },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: newuserName },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User updated", user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error in updating user", error: error.message },
      { status: 500 }
    );
  }
};


export const DELETE = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId } = body;

    await connect();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID not provided" },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted", user: deletedUser },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error in deleting user", error: error.message },
      { status: 500 }
    );
  }
};