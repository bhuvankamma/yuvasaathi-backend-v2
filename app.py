import pyodbc
import hashlib
import random
import time
from flask import Flask, request, jsonify, send_file, redirect, make_response
import ollama
import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
from otp_service import generate_otp, send_otp_email
from map_api import map_bp 

# Flask App setup
app = Flask(__name__)
# NOTE: The CORS(app) line has been removed.

# Add a before_request handler to manually set CORS headers for preflight OPTIONS requests
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.status_code = 200
        response.headers["Access-Control-Allow-Origin"] = "https://www.yuvasaathi.in"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Content-Length"] = "0"
        return response

# Add an after_request handler to set CORS headers on all responses
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "https://www.yuvasaathi.in"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

# Configure the upload folder for resumes
UPLOAD_FOLDER = "uploads"
GENERATED_FOLDER = "generated_resumes"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(GENERATED_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['GENERATED_FOLDER'] = GENERATED_FOLDER
app.register_blueprint(map_bp)

SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "your_default_email@gmail.com")
SENDER_PASSWORD = os.environ.get("SENDER_PASSWORD", "your_default_password")
VERIFICATION_SECRET_KEY = os.environ.get("VERIFICATION_SECRET_KEY", "a-strong-and-secret-key-that-is-not-the-default")
s = URLSafeTimedSerializer(VERIFICATION_SECRET_KEY)
APP_URL = os.environ.get("APP_URL")

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def get_connection():
    connection_string = os.environ.get("DATABASE_URL")
    if not connection_string:
        print("Warning: Using local database connection. This will fail on Vercel.")
        return pyodbc.connect(
            'DRIVER={SQL Server};'
            'SERVER=DESKTOP-JQUK7UE;'
            'DATABASE=User DB1;'
            'Trusted_Connection=yes;'
        )
    return pyodbc.connect(connection_string)

otp_store = {}

def send_verification_email(to_email, name, verification_token):
    subject = "Please Verify Your Email Address"
    base_url = APP_URL if APP_URL else "https://www.yuvasaathi.in"
    verification_link = f"{base_url}/verify-email/{verification_token}"

    body = f"""
Hi {name},

Thank you for registering! Please click the link below to verify your email address and activate your account:

{verification_link}

This link will expire in 1 hour.

Regards, 
Yuva Saathi Team
"""
    msg = MIMEMultipart()
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        server.quit()
        print(f"📧 Verification email sent successfully to {to_email}")
    except Exception as e:
        print(f"❌ Error sending verification email: {e}")

def register_user(first, middle, surname, email, mobile, aadhaar, pan, password,
                  education, location, history, certifications, prev_exchange):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT Email FROM dbo.Users1 WHERE Email=?", (email,))
        if cursor.fetchone():
            return "Email already registered.", False
        hashed_pwd = hash_password(password)
        verification_token = s.dumps(email, salt='email-confirm')
        cursor.execute("""
            INSERT INTO dbo.Users1
            (First_Name, Middle_Name, Surname, Email, Mobile_No, Aadhaar_Number, PAN_Number, 
            Password, Confirm_password, Education_Claiification, Current_location, 
            Empolyment_history_Appraisals, Certifications, Have_You_previously_with_the_Employemnt_Exchange,
            Verified)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        """, (first, middle, surname, email, mobile, aadhaar, pan,
              hashed_pwd, hashed_pwd, education, location, history, certifications, prev_exchange))
        conn.commit()
        send_verification_email(email, first, verification_token)
        return "User registered successfully! A verification link has been sent to your email.", True
    except Exception as e:
        return f"Error: {e}", False
    finally:
        conn.close()

def login_user_with_password(email, password):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT UserID, First_Name, Surname, Email, Password, Verified FROM dbo.Users1 WHERE Email=?", (email,))
        user = cursor.fetchone()
        if not user:
            return {"error": "Email not found."}, None
        if not user.Verified:
            return {"error": "Please verify your email address to log in."}, None
        hashed_pwd = hash_password(password)
        if user.Password == hashed_pwd:
            return {"message": "Login successful!", "user": {"User ID": user.UserID, "First_Name": user.First_Name, "Surname": user.Surname, "Email": user.Email}}, True
        else:
            return {"error": "Invalid password."}, None
    except Exception as e:
        print(f"⚠️ Error: {e}")
        return {"error": "An error occurred."}, None
    finally:
        conn.close()

@app.route('/api/register', methods=['POST'])
def register_endpoint():
    data = request.json
    required_fields = ['First_Name', 'Surname', 'Email', 'Mobile_No', 'Aadhaar_Number', 'PAN_Number', 'Password', 'Education_Claiification', 'Current_location', 'Empolyment_history_Appraisals', 'Certifications', 'Have_You_previously_with_the_Employemnt_Exchange']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    message, success = register_user(
        first=data.get('First_Name'),
        middle=data.get('Middle_Name'),
        surname=data.get('Surname'),
        email=data.get('Email'),
        mobile=data.get('Mobile_No'),
        aadhaar=data.get('Aadhaar_Number'),
        pan=data.get('PAN_Number'),
        password=data.get('Password'),
        education=data.get('Education_Claiification'),
        location=data.get('Current_location'),
        history=data.get('Empolyment_history_Appraisals'),
        certifications=data.get('Certifications'),
        prev_exchange=data.get('Have_You_previously_with_the_Employemnt_Exchange')
    )
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 400

@app.route('/verify-email/<token>', methods=['GET'])
def verify_email_endpoint(token):
    try:
        email = s.loads(token, salt='email-confirm', max_age=3600)
        conn = get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute("UPDATE dbo.Users1 SET Verified = 1 WHERE Email=?", (email,))
            conn.commit()
            print(f"✅ Email verified successfully for: {email}")
            frontend_url = APP_URL if APP_URL else "http://localhost:3000"
            return redirect(f"{frontend_url}/login?verified=true")
        except Exception as e:
            conn.rollback()
            print(f"❌ Database error during email verification: {e}")
            return jsonify({"error": "An error occurred during verification."}), 500
        finally:
            conn.close()
    except SignatureExpired:
        print("❌ Verification link has expired.")
        return jsonify({"error": "The verification link has expired."}), 400
    except BadTimeSignature:
        print("❌ Invalid verification token.")
        return jsonify({"error": "Invalid verification token."}), 400
    except Exception as e:
        print(f"❌ Unexpected error during email verification: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500

@app.route('/api/generate-otp', methods=['POST'])
def generate_otp_endpoint():
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required."}), 400

    # NOTE: Temporarily removed database connection and user lookup
    # This endpoint will no longer check if the user is registered or verified.
    # It will simply generate and send an OTP to the provided email.
    
    otp = generate_otp()
    try:
        send_otp_email(email, otp)
        otp_store[email] = {'otp': otp, 'expiry': time.time() + 300}
        return jsonify({"message": "OTP has been sent to your email."}), 200
    except Exception as e:
        print(f"❌ Error sending OTP email: {e}")
        return jsonify({"error": "Failed to send OTP email."}), 500

@app.route('/api/login', methods=['POST'])
def login_endpoint():
    data = request.json
    email = data.get('email')
    otp = data.get('otp')
    if not email or not otp:
        return jsonify({"error": "Email and OTP are required."}), 400
    if email not in otp_store:
        return jsonify({"error": "OTP not generated or expired. Please generate a new one."}), 400
    stored_otp_data = otp_store[email]
    if time.time() > stored_otp_data['expiry']:
        del otp_store[email]
        return jsonify({"error": "OTP has expired. Please generate a new one."}), 400
    if otp == stored_otp_data['otp']:
        del otp_store[email]

        # NOTE: Temporarily removed database connection and user lookup from login endpoint
        # This will now allow login with a correct OTP, but without database verification.
        user_data = {"User ID": "N/A", "First_Name": "Guest", "Surname": "User", "Email": email}
        return jsonify({"message": "Login successful!", "user": user_data}), 200

    else:
        return jsonify({"error": "Invalid OTP."}), 400

@app.route("/api/upload_resume/<int:user_id>", methods=["POST"])
def upload_resume(user_id):
    if "resume" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["resume"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    if file and file.filename.endswith((".pdf", ".docx")):
        filename = f"user_{user_id}_{file.filename}"
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)
        try:
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("UPDATE dbo.Users1 SET ResumePath=? WHERE UserID=?", (filepath, user_id))
            conn.commit()
            return jsonify({"message": "Resume uploaded successfully!", "path": filepath}), 200
        except Exception as e:
            conn.rollback()
            return jsonify({"error": f"Database error: {e}"}), 500
        finally:
            conn.close()
    else:
        return jsonify({"error": "Invalid file format"}), 400

@app.route("/api/generate_resume/<int:user_id>", methods=["POST"])
def generate_resume(user_id):
    data = request.json
    required_fields = ['firstName', 'surname', 'email', 'mobile', 'education', 'location', 'history', 'certifications']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    filename = f"resume_{user_id}_{int(time.time())}.pdf"
    filepath = os.path.join(app.config["GENERATED_FOLDER"], filename)
    try:
        doc = SimpleDocTemplate(filepath, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        line_style = ParagraphStyle(
            'LineSeparator',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=1,
            leading=1,
            spaceAfter=1
        )
        full_name = f"{data.get('firstName', '')} {data.get('middleName', '') or ''} {data.get('surname', '')}".strip()
        story.append(Paragraph(full_name, styles['h1']))
        story.append(Paragraph(f"{data.get('email')} | {data.get('mobile')} | {data.get('location')}", styles['Normal']))
        story.append(Spacer(1, 12))
        story.append(Paragraph("Education", styles['h2']))
        story.append(Paragraph("____________________________________________________________________", line_style))
        story.append(Paragraph(data.get('education'), styles['Normal']))
        story.append(Spacer(1, 12))
        if data.get('history'):
            story.append(Paragraph("Employment History", styles['h2']))
            story.append(Paragraph("____________________________________________________________________", line_style))
            history_list = data['history'].split('\n')
            for item in history_list:
                story.append(Paragraph(item, styles['Normal']))
            story.append(Spacer(1, 12))
        if data.get('certifications'):
            story.append(Paragraph("Certifications", styles['h2']))
            story.append(Paragraph("____________________________________________________________________", line_style))
            cert_list = data['certifications'].split(',')
            for item in cert_list:
                story.append(Paragraph(f"- {item.strip()}", styles['Normal']))
            story.append(Spacer(1, 12))
        doc.build(story)
    except Exception as e:
        print(f"Error generating resume: {e}")
        return jsonify({"error": f"An error occurred while generating the resume: {e}"}), 500
    try:
        conn = get_connection()
        cursor = conn.cursor()
        if not isinstance(filepath, str) or not filepath:
            print("⚠️ Error: Filepath is invalid or empty. Database update skipped.")
            return jsonify({"error": "Failed to generate resume: Invalid file path."}), 500
        cursor.execute("UPDATE dbo.Users1 SET GeneratedResumePath=? WHERE UserID=?", (filepath, user_id))
        conn.commit()
        print(f"✅ Successfully updated database for UserID: {user_id} with path: {filepath}")
    except Exception as db_e:
        conn.rollback()
        print(f"❌ Database error on update: {db_e}")
        return jsonify({"error": f"Database error during resume update: {db_e}"}), 500
    finally:
        if conn:
            conn.close()
    return jsonify({"message": "Resume generated successfully!", "path": filepath}), 200

@app.route("/api/download_resume/<int:user_id>", methods=["GET"])
def download_resume(user_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT GeneratedResumePath FROM dbo.Users1 WHERE UserID=?", (user_id,))
        filepath_row = cursor.fetchone()
        if not filepath_row or not filepath_row[0]:
            print(f"Resume file not found for UserID: {user_id}")
            return jsonify({"error": "Resume file not found."}), 404
        relative_path = filepath_row[0]
        filepath = os.path.join(app.root_path, relative_path)
        if not os.path.exists(filepath):
            print(f"File does not exist at path: {filepath}")
            return jsonify({"error": "Resume file not found on the server."}), 404
        filename = os.path.basename(filepath)
        return send_file(
            filepath,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )
    except Exception as e:
        print(f"Error downloading resume for UserID {user_id}: {e}")
        return jsonify({"error": "An error occurred while downloading the resume."}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()

@app.route('/api/chat', methods=['POST'])
def chat_with_ollama():
    data = request.get_json()
    user_message = data.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    try:
        response = ollama.chat(
            model='llama3.2:1b',
            messages=[
                {'role': 'user', 'content': user_message}
            ]
        )
        bot_response_content = response['message']['content']
        return jsonify({'content': bot_response_content})
    except Exception as e:
        print(f"Error communicating with Ollama: {e}")
        return jsonify({'error': 'An error occurred while getting a response from the chatbot.'}), 500

if __name__ == '__main__':
    app.run(debug=True)