import { resend } from "@/lib/resendEmail";
import VerificationEmail from "../../emails/VerificationEmail";
import { IApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  userName: string,
  verifyCode: string
): Promise<IApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Message || Verification Code",
      react: VerificationEmail({ userName, otp: verifyCode }),
    });
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Failes to send verification email." };
  }
}
