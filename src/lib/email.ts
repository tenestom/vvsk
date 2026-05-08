import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailData {
  participantName: string
  sessionTitle: string
  sessionDate: string
  totalPrice: number
  email: string
}

export async function sendConfirmationEmail(data: EmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Skipping email send.")
    return { success: false, error: "API key missing" }
  }

  const { participantName, sessionTitle, sessionDate, totalPrice, email } = data

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="sv">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bekräftelse på anmälan - VVSK</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
        
        <!-- Header -->
        <div style="background-color: #0284c7; padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Tack för din anmälan!</h1>
        </div>

        <!-- Content -->
        <div style="padding: 32px; color: #334155; line-height: 1.6;">
          <p style="font-size: 16px; margin-top: 0;">Hej!</p>
          <p style="font-size: 16px;">
            Vad roligt att <strong>${participantName}</strong> ska vara med på VVSK:s vattenskidskola. Här nedan följer detaljerna för er bokning och information om betalningen.
          </p>

          <!-- Details Card -->
          <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h2 style="color: #0f172a; font-size: 18px; margin-top: 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 12px;">Bokningsdetaljer</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Valt tillfälle:</td>
                <td style="padding: 8px 0; text-align: right; color: #0f172a; font-weight: bold;">${sessionTitle}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Datum:</td>
                <td style="padding: 8px 0; text-align: right; color: #0f172a; font-weight: bold;">${sessionDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-top: 1px dashed #cbd5e1; color: #64748b; font-weight: 500;">Totalt att betala:</td>
                <td style="padding: 8px 0; border-top: 1px dashed #cbd5e1; text-align: right; color: #0284c7; font-weight: bold; font-size: 18px;">${totalPrice} kr</td>
              </tr>
            </table>
          </div>

          <!-- Payment Info -->
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 32px;">Betalningsinformation</h2>
          <p style="font-size: 16px; margin-bottom: 8px;">Vänligen betala in beloppet på <strong>${totalPrice} kr</strong> via något av följande alternativ:</p>
          
          <ul style="list-style-type: none; padding: 0; margin: 0 0 20px 0;">
            <li style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 6px; margin-bottom: 8px;">
              <strong style="color: #0f172a;">Swish:</strong> 1232752855
            </li>
            <li style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 6px;">
              <strong style="color: #0f172a;">Bankgiro:</strong> 5031-4426
            </li>
          </ul>

          <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; color: #92400e; font-size: 14px;">
            <strong>Viktigt:</strong> Glöm inte att märka betalningen med deltagarens namn (${participantName})!
          </div>
          
          <p style="margin-top: 32px; font-size: 16px;">
            Om du har några frågor är du varmt välkommen att svara på detta mejl.
          </p>
          <p style="font-size: 16px; margin-bottom: 0;">
            Vi ses på vattnet!<br>
            <strong>Teamet på VVSK</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">Med vänliga hälsningar, VVSK</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    console.log(`[Resend] Försöker skicka e-post till ${email} för deltagare ${participantName}`)
    
    const { data: resendData, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      reply_to: "thomas.enestrom@gmail.com",
      to: [email],
      subject: `Bekräftelse på din anmälan till vattenskidskolan`,
      html: htmlContent,
    })

    console.log("[Resend] Svar från Resend:", { resendData, error })

    if (error) {
      console.error("[Resend] Fel från Resend API:", error)
      return { success: false, error }
    }

    return { success: true, data: resendData }
  } catch (err) {
    console.error("[Resend] Undantag vid sändning av e-post:", err)
    return { success: false, error: err }
  }
}
