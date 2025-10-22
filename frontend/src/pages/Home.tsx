import HeroSlider from "@/components/HeroSlider";
import SectionCategories from "../components/SectionCategories";
import { SelectRentalDates } from "@/components/SelectRentalDates";

function Home() {
  return (
    <div className="flex flex-col items-center">
      <HeroSlider />
      <SelectRentalDates />
      <SectionCategories />
    </div>
  );
}

export default Home;
