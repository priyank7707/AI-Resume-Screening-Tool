from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import fitz
import mysql.connector

app = FastAPI()

connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="resume_screening"
)

cursor = connection.cursor()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to AI Resume Screening Tool"
    }


@app.post("/login")
def login(email: str = Form(...), password: str = Form(...)):
    cursor.execute(
        "SELECT id FROM users WHERE email = %s AND password = %s",
        (email, password)
    )
    user = cursor.fetchone()

    if user:
        return {"message": "Login Successful"}

    return {"message": "Invalid Email or Password"}


@app.post("/register")
def register(email: str = Form(...), password: str = Form(...)):
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    existing_user = cursor.fetchone()

    if existing_user:
        return {"message": "Email already registered"}

    cursor.execute(
        "INSERT INTO users (email, password) VALUES (%s, %s)",
        (email, password)
    )
    connection.commit()

    return {"message": "Registration successful"}


@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    jobDescription: str = Form(...)
):

    # PDF Open
    pdf = fitz.open(stream=await resume.read(), filetype="pdf")

    # PDF Text Read
    text = ""

    for page in pdf:
        text += page.get_text()

    print(text)

    # Skills List
    skills = [
        "html",
        "css",
        "javascript",
        "react",
        "python",
        "java",
        "mysql",
        "mongodb",
        "php"
    ]

    # Matched Skills
    matchedSkills = []

    # Find Skills
    for skill in skills:
        if skill in text.lower():
            matchedSkills.append(skill)

    requiredSkills = []

    for skill in skills:
        if skill in jobDescription.lower():
            requiredSkills.append(skill)

    finalMatchedSkills = []

    for skill in requiredSkills:
        if skill in matchedSkills:
            finalMatchedSkills.append(skill)

    unmatchedSkills = []

    for skill in requiredSkills:
        if skill not in matchedSkills:
            unmatchedSkills.append(skill)

    # Match Percentage
    totalSkills = len(requiredSkills)
    matchedCount = len(finalMatchedSkills)
    matchScore = (matchedCount / totalSkills) * 100

    if matchScore >= 70:
        status = "Selected"
    else:
        status = "Rejected"

    if matchScore >= 70:
        candidate = "⭐ Strong Candidate"
    else:
        candidate = "⚠️ Need More Skills"

    print(status)

    cursor.execute(
        "INSERT INTO resume_results (resume_name, match_score, status, analyze_date) VALUES (%s, %s, %s, NOW())",
        (resume.filename, round(matchScore, 2), status)
    )

    connection.commit()

    # Send Result
    return {
        "message": "Resume Received",
        "resumeName": resume.filename,
        "matchedSkills": finalMatchedSkills,
        "unmatchedSkills": unmatchedSkills,
        "matchScore": round(matchScore, 2),
        "status": status,
        "candidate": candidate
    }

@app.delete("/delete/{id}")
def delete_resume(id: int):

    cursor.execute(
        "DELETE FROM resume_results WHERE id=%s",
        (id,)
    )
    connection.commit()

    return {"message": "Resume Deleted Successfully"}


@app.get("/history")
def get_history():

    cursor.execute("SELECT * FROM resume_results")

    data = cursor.fetchall()

    return data

