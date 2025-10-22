import { Award, Clock, MapPin } from "lucide-react";

const HeroSlider = () => {
  return (
    <div className="relative w-full overflow-hidden sm:max-h-[350px] lg:max-h-[450px] 2xl:max-h-[600px] ">
      <img
        src="/assets/images/hiking.jpg"
        className="w-full sm:max-h-[350px] lg:max-h-[450px] 2xl:max-h-[600px] object-cover object-[25%_75%]"
      ></img>
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/40 via-black/10 to-black/40"></div>
      <div className="absolute text-white w-full top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-4 md:gap-8 lg:gap-12 items-center">
          <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center px-2">
            L'aventure vous attend
          </h1>
          <p className="w-2/3 text-center text-sm md:text-base lg:text-lg xl:text-xl lg:w-[500px] text-white/80">
            Découvrez la nature avec notre équipement de sports outdoor premium.
            De la montagne à la mer, vivez des expériences inoubliables.
          </p>
          <div className="hidden md:flex items-center justify-between w-2/3 lg:w-1/2 xl:w-1/3">
            <div className="flex flex-col items-center">
              <MapPin />
              <p className="text-white text-sm lg:text-base">+50 centres</p>
              <p className="text-white/70 text-xs lg:text-sm">de location</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock />
              <p className="text-white text-sm lg:text-base">Ouvert 7j/7</p>
              <p className="text-white/70 text-xs lg:text-sm">
                même le dimanche
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Award />
              <p className="text-white text-sm lg:text-base">
                Les plus grandes
              </p>
              <p className="text-white/70 text-xs lg:text-sm">marques</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
