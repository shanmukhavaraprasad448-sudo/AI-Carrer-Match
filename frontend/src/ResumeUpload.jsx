import { useState } from "react";
import "./ResumeUpload.css";

function ResumeUpload({ setPage, setResumeFile }) {
  const [file, setFile] = useState(null);

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  }

  function handleContinue() {
    if (!file) {
      alert("Please upload your resume first!");
      return;
    }

    setResumeFile(file);
    setPage("job");
  }

  return (
    <div className="resume-page">

      <div className="resume-card">

        {/* Header */}
        <div className="brand">
          <h1>AI CareerMatch</h1>
          <p>Resume • Skills • Career</p>
        </div>

        {/* Main Content */}
        <div className="resume-content">

          <h2>Upload Your Resume</h2>

          <p className="description">
            Upload your resume to find out how well it matches your target job.
          </p>

          {/* Upload Box */}
          <div className="upload-box">

            <div className="upload-icon">
              📄
            </div>

            <h3>Upload your resume</h3>

            <p>PDF files only</p>

            <label className="file-label">
              Choose Resume

              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>

            {/* Selected File */}
            {file && (
              <p className="selected-file">
                ✓ {file.name}
              </p>
            )}

          </div>

          {/* Continue Button */}
          <button
            className="continue-btn"
            onClick={handleContinue}
          >
            Continue →
          </button>

          {/* Bottom Text */}
          <p className="bottom-text">
            Simple • Fast • Career focused
          </p>

        </div>

      </div>

    </div>
  );
}

export default ResumeUpload;