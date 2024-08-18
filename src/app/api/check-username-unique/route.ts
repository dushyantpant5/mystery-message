import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  userName: userNameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const userNameFromQueryParam = { userName: searchParams.get("username") };

    const zodCheckResult = UsernameQuerySchema.safeParse(
      userNameFromQueryParam
    );

    if (!zodCheckResult.success) {
      const userNameErrors =
        zodCheckResult.error.format().userName?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            userNameErrors?.length > 0
              ? userNameErrors.join(",")
              : "Invalid Query parameters",
        },
        { status: 400 }
      );
    }

    const { userName: userNameFromZod } = zodCheckResult.data;

    const existingVerifiedUserFromDatabase = await UserModel.findOne({
      userName: userNameFromZod,
      isUserVerified: true,
    });

    if (existingVerifiedUserFromDatabase) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
