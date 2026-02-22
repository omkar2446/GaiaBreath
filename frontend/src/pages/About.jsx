import { Link } from "react-router-dom";

function About() {
  return (
    <main className="landing-bg" style={{ padding: "48px 24px" }}>
      <section
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "32px",
          borderRadius: "20px",
          boxShadow: "0 14px 32px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h1>About GaiaBreath</h1>
        <p>
          GaiaBreath provides air-quality intelligence with personalized health
          guidance. The platform combines AQI signals with user factors to help
          people make safer day-to-day decisions.
        </p>
        <p>
          Current modules include a home dashboard, personalized AQI risk
          assessment, and backend APIs for prediction services.
        </p>
        <Link to="/">Back to home</Link>
      </section>
    </main>
  );
}

export default About;
