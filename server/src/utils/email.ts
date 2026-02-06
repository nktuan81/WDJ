/**
 * Send reservation confirmation email when status is set to "confirmed".
 * Configure SMTP in .env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
 */

interface ReservationRecord {
  name: string;
  email: string | null;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string | null;
}

function getConfirmationEmailBody(r: ReservationRecord): string {
  const details = [
    `Name / 姓名: ${r.name}`,
    `Date / 日期: ${r.date}`,
    `Time / 时间: ${r.time}`,
    `Guests / 人数: ${r.guests}`,
    ...(r.notes ? [`Notes / 备注: ${r.notes}`] : []),
  ].join('\n');

  return `
=== Reservation Details / 预订信息 ===
${details}
=====================================

**🇩🇪 Deutsch**

Sehr geehrte Damen und Herren,

vielen Dank für Ihre Reservierung.
Wir freuen uns, Ihnen mitteilen zu können, dass Ihre Tischreservierung bestätigt wurde.

Nachfolgend finden Sie die Details Ihrer Reservierung. Bitte überprüfen Sie diese sorgfältig.
Sollten Sie Unstimmigkeiten feststellen oder Änderungswünsche haben, kontaktieren Sie uns bitte so bald wie möglich.

Vielen Dank für Ihr Vertrauen.
Wir freuen uns darauf, Sie bei uns begrüßen zu dürfen.

Mit freundlichen Grüßen
**WeiDaoJia Team**

---

**🇬🇧 English**

Dear Valued Guest,

Thank you very much for your reservation.
We are pleased to inform you that your table reservation has been successfully confirmed.

Please find your reservation details below and kindly review them carefully.
If any information is incorrect or requires adjustment, please contact us at your earliest convenience.

Thank you for choosing us.
We look forward to welcoming you soon.

Kind regards,
**WeiDaoJia Team**

---

**🇨🇳 中文（简体）**

尊敬的宾客，

非常感谢您的订位。
我们很高兴地通知您，您的餐桌预订已成功确认。

以下是您的预订信息，请您仔细核对。
如有任何信息需要修改或存在错误，请尽快与我们联系。

衷心感谢您的信任，
期待您的光临！

此致
敬礼
**WeiDaoJia 餐厅团队**
`.trim();
}

export async function sendReservationConfirmationEmail(
  to: string,
  reservation: ReservationRecord
): Promise<void> {
  const nodemailer = await import('nodemailer');
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || 'noreply@weidaojia.de';

  if (!host || !user || !pass) {
    console.warn('[Email] SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS). Skipping confirmation email to', to);
    return;
  }

  const transporter = nodemailer.default.createTransport({
    host,
    port: port ? parseInt(port, 10) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });

  const subject = 'WeiDaoJia – Ihre Reservierung ist bestätigt / Your reservation is confirmed / 您的预订已确认';
  const text = getConfirmationEmailBody(reservation);

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });
  console.log('[Email] Confirmation sent to', to);
}
