import { ReactNode, useCallback, useEffect, useState } from "react";
import { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

const Carousel = ({ children }: { children: ReactNode }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // La fonction onSelect vérifie s'il est possible de scroller à une vue précédente ou suivante et quel vue du caroussel est visible. On set les states définis plus hauts avec les informations recueillies de l'emblaApi. UseCallBack "memoise" la fonction et évite les re-renders non-nécessaires.
  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  // La fonction onInit vérifie quel est le nombre de vues possibles du caroussel. On set le state défini plus hauts avec l'information recueillie de l'emblaApi.
  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  // On lance les 2 fonctions précédentes au montage du composant. emblaApi.on créé un "listener" qui lance une fonction à chaque fois qu'un événement survient. Par exemple on("select", onSelect) lance la fonction onSelect à chaque fois qu'un utilisateur sélecte une slide. 
  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  // Fonctions pour passer à la vue précédente ou suivante utilisant les méthodes scrollPrev et scrollNext de l'emblaApi.
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

   // Fonctions pour passer à la vue sélectionnée utilisant la méthode scrollTo de l'emblaApi.
  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <section className="embla w-full flex flex-col">
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex my-2 mr-4">{children}</div>
      </div>

      <div className="flex px-4 gap-4 items-center w-full justify-center mt-8">
        <button
          className="embla__prev cursor-pointer disabled:cursor-default text-green disabled:text-green/20 hover:text-green/50 text-3xl lg:text-4xl pointer"
          onClick={scrollPrev}
          disabled={prevBtnDisabled}
        >
          <IoIosArrowDropleftCircle />
        </button>
        <div className="flex px-2 gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`w-2 lg:w-2.5 lg:h-2.5 h-2 rounded-full transition-all duration-300 ease-out  ${
                index === selectedIndex ? " bg-green w-4 lg:w-4" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <button
          className="embla__next cursor-pointer disabled:cursor-default text-green pointer disabled:text-green/20 hover:text-green/50 text-3xl lg:text-4xl pointer"
          onClick={scrollNext}
          disabled={nextBtnDisabled}
        >
          <IoIosArrowDroprightCircle />
        </button>
      </div>
    </section>
  );
};

export default Carousel;
