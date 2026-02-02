import { asyncHandler, sendJsonResponse } from "@/utils/handler.ts";
import { sendMail } from "@/utils/sendMail.ts";
import express from "express";
// import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";
export const verifyEmailController = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    // Implementation for email verification goes here
    // const { email } = req.body;
    // const emailApi=new TransactionalEmailsApi();
    // emailApi.au
    // Return a success response
    
    sendMail()
    sendJsonResponse(res, 200, { success: true, message: "Email verified successfully" });
  }
);