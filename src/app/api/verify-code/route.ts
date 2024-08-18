import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userName, verifyCode } = await request.json();

    const user = await UserModel.findOne({ userName });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === verifyCode;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isUserVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User successfully verified",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code has expired , please signup again.",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verification code.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in verifying username", error);
    return Response.json(
      {
        success: false,
        message: "Error in verifying username",
      },
      { status: 500 }
    );
  }
}
