import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT ?? '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface OrderEmailData {
  to: string;
  orderId: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  discount?: number;
  couponCode?: string;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    // Email not configured — skip silently in development
    console.warn('[Email] SMTP credentials not set. Skipping order confirmation email.');
    return;
  }

  const itemRows = data.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${(i.price * i.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
      <h1 style="font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:-0.5px">
        Order Confirmed
      </h1>
      <p style="color:#666;font-size:14px">Thank you for your purchase! Here's your order summary.</p>
      
      <div style="background:#f9f9f9;padding:16px;margin:24px 0;border-radius:8px">
        <p style="margin:0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:2px">Order ID</p>
        <p style="margin:4px 0 0;font-family:monospace;font-size:14px;font-weight:700">${data.orderId}</p>
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="border-bottom:2px solid #111">
            <th style="padding:8px;text-align:left">Item</th>
            <th style="padding:8px;text-align:center">Qty</th>
            <th style="padding:8px;text-align:right">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      ${data.discount ? `<p style="text-align:right;color:#16a34a;font-weight:700;margin-top:8px">Coupon (${data.couponCode}): −$${data.discount.toFixed(2)}</p>` : ''}
      <p style="text-align:right;font-size:20px;font-weight:900;margin-top:8px">Total: $${data.total.toFixed(2)}</p>

      <p style="margin-top:32px;font-size:13px;color:#999">
        Questions? Contact us at <a href="mailto:support@ggcosmetics.com" style="color:#111">support@ggcosmetics.com</a>
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"GG Shop" <${process.env.SMTP_USER}>`,
    to: data.to,
    subject: `Order Confirmed — #${data.orderId.slice(-8).toUpperCase()}`,
    html,
  });
}
