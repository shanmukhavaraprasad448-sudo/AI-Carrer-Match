import { useState } from "react";
import "./JobDescription.css";

function JobDescription({ setPage, resumeFile }) {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    // Check job description
    if (!jobDescription.trim()) {
      alert("Please enter a job description!");
      return;
    }

    // Check resume
    if (!resumeFile) {
      alert("Please upload your resume first!");
      return;
    }

    setLoading(true);

    try {
      // Create form data
      const formData = new FormData();

      formData.append("resume", resumeFile);
      formData.append("job_description", jobDescription);

      // Send request to Flask backend
      const response = await fetch(
        "http://127.0.0.1:5000/api/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      // Get backend response
      const data = await response.json();

      console.log("BACKEND RESPONSE:", data);

      // Check for backend error
      if (!response.ok) {
        throw new Error(
          data.error || "Analysis failed"
        );
      }

      // Make sure we received some data
      if (!data) {
        throw new Error(
          "No result received from backend."
        );
      }

      // Save result
      sessionStorage.setItem(
        "analysisResult",
        JSON.stringify(data)
      );

      console.log(
        "SAVED RESULT:",
        sessionStorage.getItem("analysisResult")
      );

      // Go to result page
      setPage("result");

    } catch (error) {
      console.error(
        "ANALYSIS ERROR:",
        error
      );

      alert(
        "Backend error: " +
        error.message
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="job-page">

      <div className="job-card">

        {/* ==============================
            HEADER
        =============================== */}

        <div className="job-header">

          <h1>
            AI CareerMatch
          </h1>

          <p>
            Resume • Skills • Career
          </p>

        </div>


        {/* ==============================
            MAIN CONTENT
        =============================== */}

        <div className="job-content">

          <h2>
            Enter Job Description
          </h2>

          <p className="job-subtitle">
            Paste the job description to check
            how well your resume matches.
          </p>


          {/* ==============================
              JOB DESCRIPTION INPUT
          =============================== */}

          <div className="job-input-box">

            <label>
              Job Description
            </label>

            <textarea
              placeholder="Example: We are looking for a Java developer with knowledge of DSA, SQL, React and problem solving..."
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(e.target.value)
              }
            />

            <p className="character-count">
              {jobDescription.length} characters
            </p>

          </div>


          {/* ==============================
              ANALYZE BUTTON
          =============================== */}

          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={loading}
          >

            {loading
              ? "Analyzing..."
              : "Analyze Match →"}

          </button>


          {/* ==============================
              BOTTOM TEXT
          =============================== */}

          <p className="job-bottom-text">
            Get your matching skills, missing
            skills and improvement suggestions.
          </p>

        </div>

      </div>

    </div>
  );
}

export default JobDescription;