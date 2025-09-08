import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Step 1: Generate OTP
def generate_otp(length=6):
    digits = "0123456789"
    otp = "".join(random.choice(digits) for _ in range(length))
    return otp

# Step 2: Send OTP via Email
def send_otp_email(receiver_email, otp):
    sender_email = "bhuvankalyankumar2000@gmail.com"
    sender_password = "bndp uqcl hsyo hlvx"
    subject = "Your OTP Code"
    body = f"Your OTP code is: {otp}"

    # Build email
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, message.as_string())
        server.quit()
        print("✅ OTP sent successfully!")
    except Exception as e:
        print("❌ Error:", e)

# Step 3 & 4: OTP Flow
def otp_flow():
    receiver = input("Enter your email: ")
    otp = generate_otp()
    send_otp_email(receiver, otp)

    user_input = input("Enter the OTP sent to your email: ")

    if user_input == otp:
        print("✅ OTP Verified Successfully!")
    else:
        print("❌ Invalid OTP, please try again.")

# Run the OTP flow
otp_flow()