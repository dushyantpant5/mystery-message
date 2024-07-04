import dbConnect from "@/lib/dbConnect";
import UserModel, { IUser } from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userName, email, password } = await request.json();

    const userVerifiedByUsername = await UserModel.findOne({
      userName,
      isUserVerified: true,
    });

    if (userVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already taken and verified.",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail: IUser | null = await UserModel.findOne({
      email,
    });
    const verifyCodeOtp = Math.floor(100000 + Math.random() * 90000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isUserVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCodeOtp;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + 1);

      const newUser = new UserModel({
        userName,
        email,
        password: hashedPassword,
        verifyCode: verifyCodeOtp,
        verifyCodeExpiry: expiryTime,
        isUserVerified: false,
        isUserAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      userName,
      verifyCodeOtp
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    //If emailResponse.success === true

    return Response.json(
      {
        success: true,
        message: "User registered successfully . Please verify your email. ",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
