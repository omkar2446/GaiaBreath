import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getHealthReport } from "../services/api";
import "./HealthReport.css";

const FIELD_CONFIG = [
  { name: "age", label: "Age" },
  { name: "outdoor_hours", label: "How many hours are you outside daily?" },
  { name: "avg_aqi", label: "Average AQI" },
  { name: "avg_temp", label: "Average Temperature (C)" },
];

function HealthReport() {
  const initialValues = useMemo(
    () =>
      FIELD_CONFIG.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
      }, {}),
    []
  );

  const [inputs, setInputs] = useState(initialValues);
  const [smoke, setSmoke] = useState("no");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const generate = async () => {
    const hasMissing = Object.values(inputs).some((value) => value === "");
    if (hasMissing) {
      setError("Please fill all fields before generating report.");
      return;
    }

    const payload = Object.entries(inputs).reduce((acc, [key, value]) => {
      acc[key] = Number(value);
      return acc;
    }, {});
    payload.smoke = smoke;

    try {
      setLoading(true);
      setError("");
      const data = await getHealthReport(payload);
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err.message || "Unable to generate report.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result?.report) return;
    const blob = new Blob([result.report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `health-report-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="report-page">
      <div className="report-card">
        <div className="report-header">
          <h2>Health Report</h2>
          <p>Generate a report using age, smoking status, outdoor time, average AQI and average temperature.</p>
        </div>

        <div className="report-inputs">
          {FIELD_CONFIG.map((field) => (
            <input
              key={field.name}
              type="number"
              name={field.name}
              placeholder={field.label}
              value={inputs[field.name]}
              onChange={handleChange}
            />
          ))}
          <label className="report-radio">
            Do you smoke?
            <div>
              <label>
                <input
                  type="radio"
                  name="smoke"
                  value="yes"
                  checked={smoke === "yes"}
                  onChange={(e) => setSmoke(e.target.value)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="smoke"
                  value="no"
                  checked={smoke === "no"}
                  onChange={(e) => setSmoke(e.target.value)}
                />
                No
              </label>
            </div>
          </label>

          <button onClick={generate} disabled={loading}>
            {loading ? "Working..." : "Generate Report"}
          </button>
        </div>

        {error && <p className="report-error">{error}</p>}

        {result && (
          <div className="report-result">
            <h3>Report Summary</h3>
            <pre className="report-text">{result.report}</pre>
            <div className="result-grid">
              <div>
                <strong>Risk Level</strong>
                <p>{result.risk_level}</p>
              </div>
              <div>
                <strong>Risk Score</strong>
                <p>{result.risk_score}/16</p>
              </div>
              <div>
                <strong>Smoking</strong>
                <p>{result.smoke ? "Yes" : "No"}</p>
              </div>
              <div>
                <strong>Avg AQI</strong>
                <p>{result.avg_aqi}</p>
              </div>
              <div>
                <strong>Avg Temp</strong>
                <p>{result.avg_temp} C</p>
              </div>
              <div>
                <strong>Outdoor Hours</strong>
                <p>{result.outdoor_hours}</p>
              </div>
            </div>
            <div className="report-actions-list">
              <h4>Actions</h4>
              <ul>
                {(result.actions || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <button className="print-btn" onClick={handleDownload}>
              Download Report
            </button>
          </div>
        )}

        <p className="report-back">
          <Link to="/">Back to home</Link>
        </p>
      </div>
    </div>
  );
}

export default HealthReport;
