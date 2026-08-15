import "./Result.css";

function Result() {
  const savedResult = sessionStorage.getItem("analysisResult");

  // ==========================================
  // NO RESULT
  // ==========================================

  if (!savedResult) {
    return (
      <div className="result-page">
        <div className="result-container empty-result">
          <h1>AI CareerMatch</h1>
          <h2>No Analysis Result Found</h2>

          <p>
            Please upload your resume and analyze a job description first.
          </p>

          <button
            className="new-analysis-btn"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            🔄 Start Analysis
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // READ RESULT
  // ==========================================

  let savedData;

  try {
    savedData = JSON.parse(savedResult);
  } catch (error) {
    console.error("Invalid analysis result:", error);

    return (
      <div className="result-page">
        <div className="result-container empty-result">
          <h1>AI CareerMatch</h1>
          <h2>Something went wrong</h2>

          <p>
            The analysis result could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  // IMPORTANT:
  // Backend sends result inside "result"
  const result = savedData?.result || savedData;

  console.log("FINAL RESULT:", result);

  // ==========================================
  // SAFE VALUES
  // ==========================================

  const matchScore = result?.match_score ?? 0;

  const matchingSkills = Array.isArray(result?.matching_skills)
    ? result.matching_skills
    : [];

  const missingSkills = Array.isArray(result?.missing_skills)
    ? result.missing_skills
    : [];

  const qualification =
    result?.qualification_match ||
    "Qualification information is not available.";

  const explanation =
    result?.explanation ||
    "No detailed explanation is available for this score.";

  const suggestions = Array.isArray(result?.suggestions)
    ? result.suggestions
    : [];

  // ==========================================
  // TOTAL SKILLS
  // ==========================================

  const totalSkills =
    matchingSkills.length + missingSkills.length;

  const matchingPercentage =
    totalSkills > 0
      ? Math.round(
          (matchingSkills.length / totalSkills) * 100
        )
      : 0;

  // ==========================================
  // RETURN UI
  // ==========================================

  return (
    <div className="result-page">

      <div className="result-container">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="result-header">

          <div className="brand-icon">
            AI
          </div>

          <h1>AI CareerMatch</h1>

          <p>
            Resume • Skills • Career
          </p>

          <h2>
            Job Match Result
          </h2>

        </div>


        {/* =====================================
            SCORE
        ====================================== */}

        <div className="score-card">

          <div className="score-circle">

            <div className="score-number">
              {matchScore}%
            </div>

          </div>

          <h3>
            Overall Match Score
          </h3>

          <p>
            Your resume matches approximately{" "}
            <strong>{matchScore}%</strong> of the
            required job skills.
          </p>

        </div>


        {/* =====================================
            MATCHING + MISSING SKILLS
        ====================================== */}

        <div className="skills-grid">


          {/* MATCHING SKILLS */}

          <div className="skill-card matching-card">

            <div className="skill-card-header">

              <div className="skill-icon matching-icon">
                ✓
              </div>

              <div>
                <h2>
                  Matching Skills
                </h2>

                <p>
                  Skills found in your resume
                </p>
              </div>

            </div>


            {matchingSkills.length > 0 ? (

              <div className="skills-list">

                {matchingSkills.map(
                  (skill, index) => (

                    <div
                      className="skill-tag matching-tag"
                      key={index}
                    >
                      ✓ {skill}
                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="no-skills">
                No matching skills found.
              </div>

            )}

          </div>


          {/* MISSING SKILLS */}

          <div className="skill-card missing-card">

            <div className="skill-card-header">

              <div className="skill-icon missing-icon">
                !
              </div>

              <div>
                <h2>
                  Missing Skills
                </h2>

                <p>
                  Skills you should improve
                </p>
              </div>

            </div>


            {missingSkills.length > 0 ? (

              <div className="skills-list">

                {missingSkills.map(
                  (skill, index) => (

                    <div
                      className="skill-tag missing-tag"
                      key={index}
                    >
                      + {skill}
                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="no-skills success-message">
                🎉 No important missing skills detected.
              </div>

            )}

          </div>

        </div>


        {/* =====================================
            SKILL MATCH BREAKDOWN
        ====================================== */}

        <div className="result-section">

          <div className="section-title">

            <span className="section-icon">
              📊
            </span>

            <div>
              <h2>
                Skill Match Breakdown
              </h2>

              <p>
                Overview of your skill compatibility
              </p>
            </div>

          </div>


          <div className="progress-area">

            <div className="progress-info">

              <span>
                Matching Skills
              </span>

              <strong>
                {matchingPercentage}%
              </strong>

            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${matchingPercentage}%`
                }}
              ></div>

            </div>

          </div>


          <div className="breakdown-count">

            <div>
              <strong>
                {matchingSkills.length}
              </strong>

              <span>
                Matching
              </span>
            </div>


            <div>
              <strong>
                {missingSkills.length}
              </strong>

              <span>
                Missing
              </span>
            </div>


            <div>
              <strong>
                {totalSkills}
              </strong>

              <span>
                Total Skills
              </span>
            </div>

          </div>

        </div>


        {/* =====================================
            QUALIFICATION
        ====================================== */}

        <div className="result-section">

          <div className="section-title">

            <span className="section-icon">
              🎓
            </span>

            <div>
              <h2>
                Qualification
              </h2>

              <p>
                Education compatibility
              </p>
            </div>

          </div>

          <div className="info-box">

            {qualification}

          </div>

        </div>


        {/* =====================================
            WHY THIS SCORE
        ====================================== */}

        <div className="result-section">

          <div className="section-title">

            <span className="section-icon">
              💡
            </span>

            <div>
              <h2>
                Why this score?
              </h2>

              <p>
                Analysis explanation
              </p>
            </div>

          </div>

          <div className="info-box explanation-box">

            {explanation}

          </div>

        </div>


        {/* =====================================
            SUGGESTIONS
        ====================================== */}

        <div className="result-section">

          <div className="section-title">

            <span className="section-icon">
              🚀
            </span>

            <div>
              <h2>
                Improvement Suggestions
              </h2>

              <p>
                Recommended areas for improvement
              </p>
            </div>

          </div>


          {suggestions.length > 0 ? (

            <div className="suggestions-list">

              {suggestions.map(
                (suggestion, index) => (

                  <div
                    className="suggestion-item"
                    key={index}
                  >

                    <span>
                      {index + 1}
                    </span>

                    <p>
                      {suggestion}
                    </p>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="info-box">
              No improvement suggestions available.
            </div>

          )}

        </div>


        {/* =====================================
            BUTTONS
        ====================================== */}

        <div className="result-actions">

          <button
            className="download-btn"
            onClick={() => window.print()}
          >
            📄 Download Report
          </button>


          <button
            className="new-analysis-btn"
            onClick={() => {

              sessionStorage.removeItem(
                "analysisResult"
              );

              window.location.href = "/";

            }}
          >
            🔄 Analyze Another Resume
          </button>

        </div>

      </div>

    </div>
  );
}

export default Result;