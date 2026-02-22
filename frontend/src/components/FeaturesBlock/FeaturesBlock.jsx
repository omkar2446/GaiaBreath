const FEATURES = [
  {
    title: "Live AQI Map",
    description: "Continuous tracking of air quality in real time.",
    variant: "green",
    icon: "MAP",
  },
  {
    title: "Personal Safety Alerts",
    description: "Instant notifications when air quality drops.",
    variant: "teal",
    icon: "ALERT",
  },
  {
    title: "AI Chat Bot",
    description: "AI-powered health advice based on AQI levels.",
    variant: "blue",
    icon: "AI",
  },
  {
    title: "IoT AQI Monitoring",
    description: "IoT devices monitor live AQI data around you.",
    variant: "mint",
    icon: "IOT",
  },
  {
    title: "Health Reports",
    description: "Daily exposure reports and health insights.",
    variant: "rose",
    icon: "CARE",
  },
  {
    title: "Community Dashboard",
    description: "Share updates and learn about local air quality.",
    variant: "slate",
    icon: "HUB",
  },
];

function FeaturesBlock() {
  return (
    <section className="features-section">
      <h2>Features of GaiaBreathAI</h2>

      <div className="features-grid">
        {FEATURES.map((feature) => (
          <div key={feature.title} className={`feature-card ${feature.variant}`}>
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesBlock;
