import HeroBlock from "../components/HeroBlock/HeroBlock";
import MissionBlock from "../components/MissionBlock/MissionBlock";
import FeaturesBlock from "../components/FeaturesBlock/FeaturesBlock";

function Home() {
  return (
    <div className="landing-bg">
      <main className="hero-wrapper">
        <HeroBlock />
      </main>

      <MissionBlock />
      <FeaturesBlock />
    </div>
  );
}

export default Home;
