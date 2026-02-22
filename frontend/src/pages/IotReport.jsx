import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getIotReport } from "../services/api";
import "./IotReport.css";

function IotReport() {
  const [node, setNode] = useState("NODE-01");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(true);

  const loadData = async (selectedNode) => {
    try {
      setError("");
      const report = await getIotReport(selectedNode);
      setData(report);
    } catch (err) {
      setError(err.message || "Unable to load IoT report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadData(node);
  }, [node]);

  useEffect(() => {
    if (!live) return undefined;
    const timer = setInterval(() => {
      loadData(node);
    }, 2000);
    return () => clearInterval(timer);
  }, [live, node]);

  const gaugeProgress = useMemo(() => {
    const aqi = data?.aqi ?? 0;
    return Math.max(0, Math.min(100, (aqi / 500) * 100));
  }, [data?.aqi]);

  return (
    <main className="iot-page">
      <section className="iot-card">
        <header className="iot-header">
          <h1>IoT AQI Live Report</h1>
          <p>Proxy-based random IoT stream with speed animation.</p>
        </header>

        <div className="iot-controls">
          <label>
            Node
            <select value={node} onChange={(e) => setNode(e.target.value)}>
              <option value="NODE-01">NODE-01</option>
              <option value="NODE-02">NODE-02</option>
              <option value="NODE-03">NODE-03</option>
            </select>
          </label>
          <button type="button" onClick={() => loadData(node)}>
            Refresh
          </button>
          <button type="button" onClick={() => setLive((prev) => !prev)}>
            {live ? "Pause Live" : "Start Live"}
          </button>
        </div>

        {error && <p className="iot-error">{error}</p>}

        {loading && !data && <p>Loading IoT report...</p>}

        {data && (
          <>
            <div className="aqi-speed-wrap">
              <div
                className="aqi-speed"
                style={{ "--progress": `${gaugeProgress}%` }}
              >
                <div className="aqi-speed-center">
                  <span>{data.aqi}</span>
                  <small>AQI</small>
                </div>
              </div>
              <div className="aqi-speed-meta">
                <h3>{data.aqi_band}</h3>
                <p>Trend: {data.trend}</p>
                <p>Node: {data.node}</p>
                <p className={live ? "live-on" : "live-off"}>
                  {live ? "Live streaming every 2s" : "Live paused"}
                </p>
              </div>
            </div>

            <div className="iot-grid">
              <article>
                <strong>Temperature</strong>
                <p>{data.temperature} C</p>
              </article>
              <article>
                <strong>Humidity</strong>
                <p>{data.humidity}%</p>
              </article>
              <article>
                <strong>Updated (UTC)</strong>
                <p>{new Date(data.timestamp_utc).toLocaleString()}</p>
              </article>
            </div>
          </>
        )}

        <p className="iot-back">
          <Link to="/">Back to home</Link>
        </p>
      </section>
    </main>
  );
}

export default IotReport;
