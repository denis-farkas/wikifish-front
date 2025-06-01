import "./home.css";

import Presentation from "../../components/presentation";
import GalleryPreview from "../../components/gallery-preview";
import Services from "../../components/services";

const Home = () => {
  return (
    <div className="container">
      <Presentation />
      <Services />
      <GalleryPreview />
    </div>
  );
};

export default Home;
