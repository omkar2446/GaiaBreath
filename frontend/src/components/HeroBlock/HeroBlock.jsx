import { Link } from "react-router-dom";
import "./HeroBlock.css";
import heroImage from "../../assets/ilove.jpeg";

function HeroBlock() {
  return (
    <section className="hero">
      <div className="hero-left">
        <h1>
          Every Breath,
          <br />
          <span>Protected by Intelligence</span>
        </h1>

        <p>
          GaiaBreath continuously monitors air quality and helps you
          understand what you breathe with real-time insights and
          intelligent analysis.
        </p>

        <div className="hero-buttons">
          <Link to="/healthadvisor">
            <button className="btn-primary">Health Advisor</button>
          </Link>
          <Link to="/about">
            <button className="btn-secondary">Our Mission</button>
          </Link>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-image-wrapper">
          <img 
            src={heroImage}
            alt="Clean air"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroBlock;
