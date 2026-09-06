import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from resume_parser import extract_text_from_pdf
import re


app = Flask(__name__)

CORS(app)


# =========================================
# HOME
# =========================================

@app.route("/")
def home():
    return jsonify({
        "message": "AI CareerMatch Backend is running!"
    })


# =========================================
# RESUME UPLOAD
# =========================================

@app.route("/api/upload-resume", methods=["POST"])
def upload_resume():

    if "resume" not in request.files:

        return jsonify({
            "error": "No resume uploaded"
        }), 400


    file = request.files["resume"]


    if file.filename == "":

        return jsonify({
            "error": "No file selected"
        }), 400


    try:

        resume_text = extract_text_from_pdf(file)

        return jsonify({

            "message":
                "Resume uploaded successfully",

            "resume_text":
                resume_text

        })


    except Exception as e:

        return jsonify({

            "error":
                str(e)

        }), 500


# =========================================
# SKILL CHECKING
# =========================================

def skill_exists(text, skill):

    text = text.lower()
    skill = skill.lower()


    if skill == "c++":

        return (
            "c++" in text
            or "cpp" in text
        )


    if skill == "react":

        return (

            "react" in text
            or "react.js" in text
            or "reactjs" in text

        )


    if skill == "node":

        return (

            "node" in text
            or "node.js" in text
            or "nodejs" in text

        )


    if skill == "express":

        return (

            "express" in text
            or "express.js" in text

        )


    pattern = (

        r"(?<![a-zA-Z0-9])"
        + re.escape(skill)
        + r"(?![a-zA-Z0-9])"

    )


    return re.search(

        pattern,
        text,
        re.IGNORECASE

    ) is not None


# =========================================
# ANALYZE RESUME
# =========================================

@app.route("/api/analyze", methods=["POST"])
def analyze():

    # Check resume

    if "resume" not in request.files:

        return jsonify({

            "error":
                "Resume is required"

        }), 400


    resume_file = request.files["resume"]


    # Get job description

    job_description = request.form.get(

        "job_description",
        ""

    )


    if not job_description.strip():

        return jsonify({

            "error":
                "Job description is required"

        }), 400


    try:

        # Extract resume text

        resume_text = extract_text_from_pdf(
            resume_file
        )


        if not resume_text or not resume_text.strip():

            return jsonify({

                "error":
                    "Could not extract text from resume"

            }), 400


        resume_lower = resume_text.lower()

        job_lower = job_description.lower()


        # =====================================
        # SKILLS DATABASE
        # =====================================

        skills = [

            "python",
            "java",
            "c++",

            "javascript",

            "react",

            "html",
            "css",

            "sql",
            "mysql",
            "mongodb",

            "node",
            "express",

            "git",
            "github",

            "docker",

            "aws",
            "azure",

            "machine learning",
            "deep learning",
            "artificial intelligence",

            "data structures",
            "algorithms",

            "oops",

            "rest api",

            "flask",
            "django",

            "tensorflow",
            "pytorch",

            "communication",
            "problem solving"

        ]


        # =====================================
        # REQUIRED SKILLS
        # =====================================

        required_skills = []


        for skill in skills:

            if skill_exists(job_lower, skill):

                required_skills.append(skill)


        # =====================================
        # MATCHING SKILLS
        # =====================================

        matching_skills = []


        for skill in required_skills:

            if skill_exists(resume_lower, skill):

                matching_skills.append(skill)


        # =====================================
        # MISSING SKILLS
        # =====================================

        missing_skills = []


        for skill in required_skills:

            if skill not in matching_skills:

                missing_skills.append(skill)


        # =====================================
        # MATCH SCORE
        # =====================================

        if len(required_skills) > 0:

            score = round(

                (
                    len(matching_skills)
                    /
                    len(required_skills)
                )
                * 100

            )

        else:

            score = 0


        # =====================================
        # QUALIFICATION CHECK
        # =====================================

        qualification_match = (
            "No specific qualification detected."
        )


        education_keywords = [

            "b.tech",
            "btech",
            "b.e",
            "be",
            "bachelor",
            "engineering",
            "computer science",
            "information technology",
            "cse",
            "ece"

        ]


        for keyword in education_keywords:

            if skill_exists(
                resume_lower,
                keyword
            ):

                qualification_match = (

                    "The resume contains a relevant "
                    "technical or engineering qualification."

                )

                break


        # =====================================
        # SCORE EXPLANATION
        # =====================================

        if score >= 80:

            explanation = (

                "Excellent match! Your resume contains "
                "most of the important skills required "
                "for this job."

            )


        elif score >= 60:

            explanation = (

                "Good match. Your resume contains many "
                "of the required skills, but a few areas "
                "can still be improved."

            )


        elif score >= 40:

            explanation = (

                "Moderate match. Some required skills "
                "are present, but several important "
                "skills are missing."

            )


        elif score > 0:

            explanation = (

                "Low match. Your resume contains some "
                "relevant skills, but more skills are "
                "required for this job."

            )


        else:

            if len(required_skills) == 0:

                explanation = (

                    "No recognized technical skills were "
                    "found in the job description."

                )

            else:

                explanation = (

                    "None of the recognized required skills "
                    "were found in the resume."

                )


        # =====================================
        # IMPROVEMENT SUGGESTIONS
        # =====================================

        suggestions = []


        for skill in missing_skills[:5]:

            suggestions.append(

                "Learn and practice " + skill

            )


        if score < 50:

            suggestions.append(

                "Add relevant projects to your resume."

            )


        if score < 70:

            suggestions.append(

                "Highlight your technical skills more "
                "clearly in your resume."

            )


        if len(suggestions) == 0:

            suggestions.append(

                "Continue improving your existing "
                "technical skills and project experience."

            )


        # =====================================
        # RESULT
        # =====================================

        result = {

            "match_score":
                score,

            "matching_skills":
                matching_skills,

            "missing_skills":
                missing_skills,

            "qualification_match":
                qualification_match,

            "explanation":
                explanation,

            "suggestions":
                suggestions

        }


        # Terminal log

        print("\n==============================")

        print("RESUME ANALYSIS")

        print("==============================")

        print("Required Skills:", required_skills)

        print("Matching Skills:", matching_skills)

        print("Missing Skills:", missing_skills)

        print("Match Score:", score)

        print("==============================\n")


        # =====================================
        # SEND RESPONSE
        # =====================================

        return jsonify({

            "success": True,

            "match_score":
                score,

            "matching_skills":
                matching_skills,

            "missing_skills":
                missing_skills,

            "qualification_match":
                qualification_match,

            "explanation":
                explanation,

            "suggestions":
                suggestions,

            "result":
                result

        })


    except Exception as e:

        print(
            "ANALYSIS ERROR:",
            str(e)
        )


        return jsonify({

            "success": False,

            "error":
                str(e)

        }), 500


# =========================================
# START SERVER
# =========================================

if __name__ == "__main__":

    port = int(
        os.environ.get("PORT", 5000)
    )


    app.run(

        host="0.0.0.0",

        port=port,

        debug=False

    )