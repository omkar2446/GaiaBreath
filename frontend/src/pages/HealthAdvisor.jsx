import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAqiRisk } from "../services/api";
import "./HealthAdvisor.css";

const FIELD_CONFIG = [
  { name: "temperature", label: "Temperature (C)" },
  { name: "humidity", label: "Humidity (%)" },
  { name: "pm2_5", label: "PM2.5" },
  { name: "pm10", label: "PM10" },
  { name: "no2", label: "NO2" },
  { name: "co", label: "CO" },
  { name: "so2", label: "SO2" },
  { name: "age", label: "Age" },
];

function HealthAdvisor() {
  const initialValues = useMemo(
    () =>
      FIELD_CONFIG.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
      }, {}),
    []
  );

  const [inputs, setInputs] = useState(initialValues);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const analyze = async () => {
    const hasMissing = Object.values(inputs).some((value) => value === "");
    if (hasMissing) {
      setError("Please fill all fields before running analysis.");
      return;
    }

    const payload = Object.entries(inputs).reduce((acc, [key, value]) => {
      acc[key] = Number(value);
      return acc;
    }, {});

    try {
      setLoading(true);
      setError("");
      const data = await getAqiRisk(payload);
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err.message || "Unable to run analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="advisor-page">
      <div className="advisor-card">
        <div className="advisor-header">
          <div className="ai-core" />
          <h2>AQI Health Advisor</h2>
          <p>Enter your local air readings to get a personalized risk estimate.</p>
        </div>

        <div className="advisor-inputs">
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

          <button onClick={analyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {error && <p className="advisor-error">{error}</p>}

        {result && (
          <div className="advisor-result">
            <h3>Risk: {result.final_risk}</h3>
            <div className="result-grid">
              <div>
                <strong>Base</strong>
                <p>{result.base_risk}</p>
              </div>
              <div>
                <strong>Final</strong>
                <p>{result.final_risk}</p>
              </div>
              <div>
                <strong>Guidance</strong>
                <p>{result.suggestion}</p>
              </div>
            </div>
          </div>
        )}

        <p className="advisor-back">
          <Link to="/">Back to home</Link>
        </p>
      </div>
    </div>
  );
}

export default HealthAdvisor;
