interface ActionEmailTemplateOptions {
  title: string;
  greetingName: string;
  message: string;
  actionText: string;
  actionLink: string;
  footerNote?: string;
}

export function generateActionEmailTemplate(options: ActionEmailTemplateOptions): string {
  const {
    title,
    greetingName,
    message,
    actionText,
    actionLink,
    footerNote = "If you did not initiate this request, you may safely ignore this email.",
  } = options;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif; color:#333;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background-color:#ffffff; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="padding:24px 32px; border-bottom:1px solid #e5e7eb;">
              <h2 style="margin:0; font-size:20px; font-weight:600;">
                ${title}
              </h2>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px 0; font-size:15px; line-height:1.6;">
                Dear ${greetingName},
              </p>

              <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6;">
                ${message}
              </p>

              <div style="margin:32px 0; text-align:center;">
                <a href="${actionLink}"
                   style="display:inline-block; padding:12px 28px; background-color:#1f2937; color:#ffffff; text-decoration:none; font-size:14px; border-radius:4px;">
                  ${actionText}
                </a>
              </div>

              <p style="margin:0 0 16px 0; font-size:14px; line-height:1.6; color:#555;">
                ${footerNote}
              </p>

              <p style="margin:24px 0 0 0; font-size:14px;">
                Sincerely,<br />
                <strong>Support Team </strong> <br/>
                <strong>Porilekh</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px; background-color:#f9fafb; border-top:1px solid #e5e7eb; font-size:12px; color:#6b7280;">
              <p style="margin:0;">
                This is an automated message. Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
