import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import { BREVO_API_KEY } from "./envs.ts";



export const sendMail =(subject:string, data:string, clientEmail:string,clientName:string ):Promise<unknown> =>{
  const transactionalEmailsApi = new TransactionalEmailsApi();
  transactionalEmailsApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY || "");
  return transactionalEmailsApi.sendTransacEmail({
    to: [{ email: clientEmail, name: clientName }],
    subject,
    htmlContent: `
    <p>Hello,</p>
    <p>${data}</p>
    <p>Regards,<br/>Porilekh Team</p>
  `,
    textContent: data,
    sender: { email: "no-reply@rupayannandi.top", name: "Team Porilekh" },
  });
}