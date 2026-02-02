import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";



export const sendMail =(subject:string, data:string, clientEmail:string ):Promise<unknown> =>{
  const transactionalEmailsApi = new TransactionalEmailsApi();
  transactionalEmailsApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY! || "");
  return transactionalEmailsApi.sendTransacEmail({
    to: [{ email: clientEmail, name: "Rupayan Nandi" }],
    subject,
    htmlContent: `
    <p>Hello,</p>
    <p>${data}</p>
    <p>Regards,<br/>Porilekh Team</p>
  `,
    textContent: data,
    sender: { email: "no-reply@rupayannandi.top", name: "Team Proilekh" },
  });
}