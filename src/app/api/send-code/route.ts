// src\app\api\send-code\route.ts
// pages/api/send-code.ts - SendGrid Implementation
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

interface EmailRequest {
  email: string;
  secretCode: string;
  names: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, secretCode, names }: EmailRequest = req.body;

    // Validate required fields
    if (!email || !secretCode || !names) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    // Create SendGrid transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'apikey', // Always 'apikey' for SendGrid
        pass: process.env.SENDGRID_API_KEY, // Your SendGrid API key
      },
    });

    // Enhanced email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Love Wall Secret Code</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
          .email-container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #ec4899, #f43f5e); color: white; text-align: center; padding: 40px 20px; }
          .header h1 { font-size: 28px; margin-bottom: 10px; }
          .header p { font-size: 16px; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 20px; margin-bottom: 20px; color: #2d3748; }
          .code-section { background: linear-gradient(135deg, #fef7ff, #fdf2f8); border: 2px solid #ec4899; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
          .code-label { font-size: 16px; color: #6b46c1; margin-bottom: 15px; font-weight: 600; }
          .code { font-size: 32px; font-weight: bold; color: #ec4899; letter-spacing: 4px; font-family: 'Courier New', monospace; background: white; padding: 15px; border-radius: 8px; display: inline-block; box-shadow: 0 2px 10px rgba(236, 72, 153, 0.1); }
          .instructions { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
          .instructions h3 { color: #0ea5e9; margin-bottom: 10px; }
          .instructions ul { margin-left: 20px; }
          .instructions li { margin-bottom: 8px; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; border-top: 1px solid #e2e8f0; }
          .footer p { font-size: 14px; line-height: 1.5; }
          .heart { color: #ec4899; }
          .button { display: inline-block; background: linear-gradient(135deg, #ec4899, #f43f5e); color: white; text-decoration: none; padding: 12px 25px; border-radius: 8px; margin: 20px 0; font-weight: 600; }
          @media (max-width: 600px) {
            .content { padding: 20px; }
            .code { font-size: 24px; letter-spacing: 2px; }
            .header h1 { font-size: 24px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Love Wall <span class="heart">💕</span></h1>
            <p>Your photo has been successfully submitted!</p>
          </div>
          
          <div class="content">
            <div class="greeting">Hello ${names}! 👋</div>
            
            <p>Thank you for joining our Love Wall community! Your beautiful photo has been received and will be reviewed within 24 hours.</p>
            
            <div class="code-section">
              <div class="code-label">🔐 Your Secret Code</div>
              <div class="code">${secretCode}</div>
            </div>
            
            <div class="instructions">
              <h3>📋 Important: Save This Code!</h3>
              <p>You'll need this secret code to:</p>
              <ul>
                <li>Track your photo's approval status</li>
                <li>Make updates to your submission</li>
                <li>Contact support if needed</li>
                <li>Access your photo on the Love Wall</li>
              </ul>
            </div>
            
            <p>Once approved, your photo will become part of our beautiful Love Wall, contributing to a growing mosaic of love stories from around the world. 🌍</p>
            
            <p><strong>What happens next?</strong></p>
            <ol style="margin-left: 20px; margin-top: 10px;">
              <li>Our team reviews your photo (within 24 hours)</li>
              <li>You'll receive an approval notification</li>
              <li>Your photo goes live on the Love Wall!</li>
            </ol>
            
            <p style="margin-top: 25px;">Thank you for being part of this special project!</p>
            
            <p style="margin-top: 20px;"><strong>With love,</strong><br>The Love Wall Team <span class="heart">❤️</span></p>
          </div>
          
          <div class="footer">
            <p><strong>Need help?</strong> Contact us at support@lovewall.com with your secret code.</p>
            <p style="margin-top: 10px;">This email was sent because you submitted a photo to our Love Wall.<br>
            We respect your privacy and will only use your email for important updates about your submission.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text version
    const textContent = `
Hello ${names}!

Thank you for joining our Love Wall community! Your beautiful photo has been received and will be reviewed within 24 hours.

🔐 YOUR SECRET CODE: ${secretCode}

📋 IMPORTANT: Save this code! You'll need it to:
- Track your photo's approval status
- Make updates to your submission  
- Contact support if needed
- Access your photo on the Love Wall

What happens next?
1. Our team reviews your photo (within 24 hours)
2. You'll receive an approval notification
3. Your photo goes live on the Love Wall!

Once approved, your photo will become part of our beautiful Love Wall, contributing to a growing mosaic of love stories from around the world.

Thank you for being part of this special project!

With love,
The Love Wall Team ❤️

---
Need help? Contact us at support@lovewall.com with your secret code.
`;

    // Send email
    const mailOptions = {
      from: `"Love Wall" <${process.env.FROM_EMAIL || 'noreply@yourdomain.com'}>`,
      to: email,
      subject: `💕 Your Love Wall Secret Code: ${secretCode}`,
      text: textContent,
      html: htmlContent,
      // Optional: Add custom headers
      headers: {
        'X-Priority': '1 (Highest)',
        'X-MSMail-Priority': 'High',
        'Importance': 'High'
      }
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Secret code email sent successfully to ${email}`, {
      messageId: info.messageId,
      secretCode: secretCode // Remove in production for security
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: info.messageId
    });

  } catch (error: any) {
    console.error('❌ Error sending email:', {
      error: error.message,
      stack: error.stack,
      code: error.code
    });
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email. Please try again.' 
    });
  }
}