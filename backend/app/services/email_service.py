import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import threading
from ..config import settings
import traceback

def send_email_async(to_email: str, subject: str, body_html: str):
    if not settings.SMTP_EMAIL or not settings.SMTP_PASSWORD:
        print("WARNING: SMTP_EMAIL or SMTP_PASSWORD not set. Cannot send email.")
        return

    def send():
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"Zoom Clone <{settings.SMTP_EMAIL}>"
            msg["To"] = to_email
            
            msg.attach(MIMEText(body_html, "html"))
            
            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
            server.starttls()
            server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
            server.send_message(msg)
            server.quit()
            print(f"Successfully sent email to {to_email}")
        except Exception as e:
            print(f"Failed to send email to {to_email}: {e}")
            traceback.print_exc()
            
    # Run in background thread so it doesn't block FastAPI response
    threading.Thread(target=send).start()

def send_verification_email(to_email: str, token: str):
    link = f"{settings.FRONTEND_ORIGIN}/auth/verify?token={token}"
    body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0B5CFF;">Welcome to Zoom Clone!</h2>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
        <div style="margin: 30px 0;">
            <a href="{link}" style="background-color: #0B5CFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p style="color: #666; font-size: 14px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="color: #666; font-size: 14px; word-break: break-all;">{link}</p>
    </div>
    """
    send_email_async(to_email, "Verify your email address", body)

def send_password_reset_email(to_email: str, token: str):
    link = f"{settings.FRONTEND_ORIGIN}/auth/reset-password?token={token}"
    body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0B5CFF;">Password Reset Request</h2>
        <p>We received a request to reset your password. Click the button below to choose a new password:</p>
        <div style="margin: 30px 0;">
            <a href="{link}" style="background-color: #0B5CFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        <p style="color: #666; font-size: 14px; word-break: break-all;">{link}</p>
    </div>
    """
    send_email_async(to_email, "Reset your password", body)
