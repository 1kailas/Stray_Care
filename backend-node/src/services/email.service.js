import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SPRING_MAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SPRING_MAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SPRING_MAIL_USERNAME,
        pass: process.env.SPRING_MAIL_PASSWORD
      }
    });
  }

  async sendEmail({ to, subject, text, html }) {
    try {
      if (!process.env.SPRING_MAIL_USERNAME || !process.env.SPRING_MAIL_PASSWORD) {
        console.log('📧 Email not configured, skipping send');
        return { success: false, message: 'Email not configured' };
      }

      const mailOptions = {
        from: process.env.SPRING_MAIL_FROM || process.env.SPRING_MAIL_USERNAME,
        to,
        subject,
        text,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Email error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(user) {
    return this.sendEmail({
      to: user.email,
      subject: 'Welcome to Stray Dog Care',
      html: `
        <h1>Welcome ${user.name}!</h1>
        <p>Thank you for joining Stray Dog Care community.</p>
        <p>Together we can make a difference in the lives of stray dogs.</p>
      `
    });
  }

  async sendVolunteerApprovalEmail(volunteer) {
    return this.sendEmail({
      to: volunteer.email,
      subject: 'Volunteer Application Approved',
      html: `
        <h1>Congratulations ${volunteer.name}!</h1>
        <p>Your volunteer application has been approved.</p>
        <p>You can now start helping stray dogs in your area.</p>
      `
    });
  }

  async sendAdoptionConfirmationEmail(adoption) {
    return this.sendEmail({
      to: adoption.adopterEmail,
      subject: 'Adoption Application Received',
      html: `
        <h1>Thank you for your adoption application!</h1>
        <p>Dear ${adoption.adopterName},</p>
        <p>We have received your application to adopt ${adoption.dogName}.</p>
        <p>Our team will review your application and contact you soon.</p>
      `
    });
  }

  async sendDonationReceiptEmail(donation) {
    return this.sendEmail({
      to: donation.donorEmail,
      subject: 'Donation Receipt - Stray Dog Care',
      html: `
        <h1>Thank you for your donation!</h1>
        <p>Dear ${donation.donorName},</p>
        <p>We have received your donation of ₹${donation.amount}.</p>
        <p>Transaction ID: ${donation.transactionId}</p>
        <p>Your contribution helps us save more lives.</p>
      `
    });
  }
}

export default new EmailService();
