import { useState, useEffect } from "react";
import "./Dashboard.css";

function Dashboard() {

  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  // Load Resume History
  const loadHistory = async () => {

    try {

      const response = await fetch("http://127.0.0.1:8000/history");

      const data = await response.json();

      setHistory(data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    loadHistory();

  }, []);

  // Analyze Resume
  const analyzeResume = async () => {

    if (!resume) {

      alert("Please Select Resume");

      return;

    }

    const formData = new FormData();

    formData.append("resume", resume);

    formData.append("jobDescription", jobDescription);

    try {

      const response = await fetch("http://127.0.0.1:8000/analyze", {

        method: "POST",

        body: formData,

      });

      const data = await response.json();

      setResult(data);

      loadHistory();

      alert(data.message);

    }

    catch (error) {

      console.log(error);

    }

  };

  const deleteResume = async (id) => {

  try {
    await fetch(`http://127.0.0.1:8000/delete/${id}`, {
      method: "DELETE",
    });
    loadHistory();
  }
  catch (error) {
    console.log(error);
  }
};
    return (
    <div className="dashboard">

      <h1>AI Resume Screening Tool</h1>

      <h2>Welcome HR 👋</h2>

      <label>📄 Upload Resume</label>

      <br /><br />

      <input
        type="file"
        onChange={(e) => setResume(e.target.files[0])}
      />

      {resume && (
        <p>
          📄 Selected Resume : <b>{resume.name}</b>
        </p>
      )}

      <br /><br />

      <label>📝 Job Description</label>

      <br /><br />

      <textarea
        rows="8"
        placeholder="Paste Job Description Here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <br /><br />

      <button onClick={analyzeResume}>
        Analyze Resume
      </button>

      {result && (

        <div className="result-box">

          <h2>Analysis Result</h2>

          <p>
            <b>Resume Name :</b> {result.resumeName}
          </p>

          <h3>✅ Matched Skills</h3>

          <ul>
            {result.matchedSkills.map((skill, index) => (
              <li key={index}>✅ {skill}</li>
            ))}
          </ul>

          <h3>❌ Unmatched Skills</h3>

          <ul>
            {result.unmatchedSkills.map((skill, index) => (
              <li key={index}>❌ {skill}</li>
            ))}
          </ul>

          <p>
            <b>Match Score :</b> {result.matchScore}%
          </p>

          <p>
            <b>Status :</b> {result.status}
          </p>

          <p>
            <b>Candidate :</b> {result.candidate}
          </p>

        </div>

      )}

    <div className="stats-container">

    <div className="stat-card">
      <div className="stat-icon">📄</div>
      <h3>Total Resumes</h3>
      <h2>{history.length}</h2>
    </div>

    <div className="stat-card">
      <div className="stat-icon">✅</div>
      <h3>Selected</h3>
      <h2>
        {history.filter(item => item[3] === "Selected").length}
      </h2>
    </div>

    <div className="stat-card">
      <div className="stat-icon">❌</div>
      <h3>Rejected</h3>
      <h2>
        {history.filter(item => item[3] === "Rejected").length}
      </h2>
    </div>

  </div>

      <div className="history-section">

  <h2 className="history-title">
    📋 Resume History
  </h2>
  
  <input
  type="text"
  className="search-box"
  placeholder="🔍 Search Resume..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  />

  <div className="table-container">

    <table className="history-table">

      <thead>
        <tr>
          <th>Resume</th>
          <th>Score</th>
          <th>Status</th>
          <th>Date</th>
           <th>Action</th>
        </tr>
      </thead>

      <tbody>

        {history
          .filter((item) =>
            item[1].toLowerCase().includes(search.toLowerCase())
        )
        .map((item, index) => (

          <tr key={index}>

            <td>{item[1]}</td>

            <td>{item[2]}%</td>

            <td>
              <span
                className={
                  item[3] === "Selected"
                    ? "status-selected"
                    : "status-rejected"
                }
              >
                {item[3]}
              </span>
            </td>

            <td>{item[4]}</td>

            <td>
            <button
            className="delete-btn"
            onClick={() => {

            if(window.confirm("Are you sure you want to delete this resume?")){

            deleteResume(item[0]);

          }

        }}
        >
          🗑️ Delete
        </button>
            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>

</div>

);

}

export default Dashboard;