import { useState } from "react";
import ResumeUpload from "./ResumeUpload";
import JobDescription from "./JobDescription";
import Result from "./Result";
import "./App.css";

function App() {
  const [page, setPage] = useState("resume");
  const [resumeFile, setResumeFile] = useState(null);

  return (
    <div className="app">

      {page === "resume" && (
        <ResumeUpload
          setPage={setPage}
          setResumeFile={setResumeFile}
        />
      )}

      {page === "job" && (
        <JobDescription
          setPage={setPage}
          resumeFile={resumeFile}
        />
      )}

      {page === "result" && (
        <Result />
      )}

    </div>
  );
}

export default App;