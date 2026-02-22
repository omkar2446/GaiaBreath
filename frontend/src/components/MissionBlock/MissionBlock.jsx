function MissionBlock() {
  return (
    <section className="mission-section">
      <h2>Our Mission - Make Every Breath Count</h2>

      <div className="mission-cards">
        <div className="mission-card">
          <div className="mission-icon">AIR</div>
          <h3>Transparency</h3>
          <p>
            AI sensors track air quality continuously, alerting you to
            invisible risks around you.
          </p>
        </div>

        <div className="mission-card">
          <div className="mission-icon">LAB</div>
          <h3>Innovation</h3>
          <p>
            Intelligent algorithms analyze air patterns to detect pollution
            before it affects you.
          </p>
        </div>

        <div className="mission-card">
          <div className="mission-icon">CARE</div>
          <h3>Sustainability</h3>
          <p>
            Real-time insights help communities build healthier, more
            sustainable environments.
          </p>
        </div>
      </div>
    </section>
  );
}

export default MissionBlock;
