const productsDatas = [
 {
    title: "Sports d'hiver",
    name: "Ski bleu",
    urls: [
      "/assets/images/products/winterSports/skiBlue1.webp",
      "/assets/images/products/winterSports/skiBlue2.webp",
      "/assets/images/products/winterSports/skiBlue3.webp",
    ],
    price: 15,
    tagLabels: ["Ski"],
    options: [
      { size: "150 cm", total_quantity: 10 },
      { size: "160 cm", total_quantity: 7 },
      { size: "170 cm", total_quantity: 5 },
    ],
  },
  {
    title: "Sports d'hiver",
    name: "Ski rose",
    urls: [
      "/assets/images/products/winterSports/skiPink1.webp",
      "/assets/images/products/winterSports/skiPink2.webp",
      "/assets/images/products/winterSports/skiPink3.webp",
    ],
    price: 20,
    tagLabels: ["Ski"],
    options: [
      { size: "150 cm", total_quantity: 8 },
      { size: "160 cm", total_quantity: 6 },
    ],
  },
  {
    title: "Sports d'hiver",
    name: "Ski orange",
    urls: [
      "/assets/images/products/winterSports/skiOrange1.webp",
      "/assets/images/products/winterSports/skiOrange1.webp",
    ],
    price: 25,
    tagLabels: ["Ski"],
    options: [
      { size: "160 cm", total_quantity: 6 },
      { size: "170 cm", total_quantity: 5 },
      { size: "180 cm", total_quantity: 4 },
    ],
  },
  {
    title: "Sports d'hiver",
    name: "Snowboard Burton",
    urls: [
      "/assets/images/products/winterSports/snowboardBurton1.webp",
      "/assets/images/products/winterSports/snowboardBurton2.webp",
      "/assets/images/products/winterSports/snowboardBurton4.webp",
    ],
    price: 30,
    tagLabels: ["Snowboard"],
    options: [
      { size: "140 cm", total_quantity: 8 },
      { size: "150 cm", total_quantity: 7 },
      { size: "160 cm", total_quantity: 5 },
    ],
  },
  {
    title: "Sports d'hiver",
    name: "Snowboard Volcom",
    urls: [
      "/assets/images/products/winterSports/snowboardVolcom1.webp",
      "/assets/images/products/winterSports/snowboardVolcom2.webp",
      "/assets/images/products/winterSports/snowboardVolcom3.webp",
    ],
    price: 30,
    tagLabels: ["Snowboard"],
    options: [
      { size: "140 cm", total_quantity: 10 },
      { size: "150 cm", total_quantity: 8 },
    ],
  },
  {
    title: "Sports d'hiver",
    name: "Chaussures de ski enfant",
    urls: ["/assets/images/products/winterSports/skiShoesKid.webp"],
    price: 8,
    tagLabels: ["Chaussures", "Enfant"],
    options: [
      { size: "30", total_quantity: 15 },
      { size: "32", total_quantity: 12 },
      { size: "34", total_quantity: 10 },
    ],
  },
  {
    title: "Sports d'hiver",
    name: "Chaussures de snow",
    urls: ["/assets/images/products/winterSports/snowShoes-1.webp"],
    price: 8,
    tagLabels: ["Chaussures"],
    options: [
      { size: "38", total_quantity: 10 },
      { size: "40", total_quantity: 8 },
      { size: "42", total_quantity: 6 },
    ],
  },
  {
    title: "Sports d'hiver",
    name: "Gants noir",
    urls: ["/assets/images/products/winterSports/skiGloves-1.jpg"],
    price: 5,
    tagLabels: ["Accessoires", "Gants"],
    options: [
      { size: "S", total_quantity: 20 },
      { size: "M", total_quantity: 15 },
      { size: "L", total_quantity: 10 },
    ],
  },
  {
    title: "Sports d'hiver",
    name: "Gants camo",
    urls: ["/assets/images/products/winterSports/skiGloves-2.webp"],
    price: 7,
    tagLabels: ["Accessoires", "Gants"],
    options: [
      { size: "S", total_quantity: 15 },
      { size: "M", total_quantity: 10 },
      { size: "L", total_quantity: 8 },
    ],
  },
  {
    title: "Sports nautiques",
    name: "Planche de surf verte",
    urls: ["/assets/images/products/waterSports/surfboardGreen1.webp"],
    price: 25,
    tagLabels: ["Planche de surf"],
    options: [
      { size: "Standard", total_quantity: 12 },
    ],
  },
  {
    title: "Sports nautiques",
    name: "Planche de surf rose",
    urls: [
      "/assets/images/products/waterSports/surfboardPink1.webp",
      "/assets/images/products/waterSports/surfboardPink2.webp",
    ],
    price: 25,
    tagLabels: ["Planche de surf"],
    options: [
      { size: "Standard", total_quantity: 15 },
    ],
  },
  {
    title: "Sports nautiques",
    name: "Bodyboard",
    urls: ["/assets/images/products/waterSports/bodyboard.webp"],
    price: 15,
    tagLabels: ["Bodyboard"],
    options: [
      { size: "Standard", total_quantity: 20 },
    ],
  },
  {
    title: "Sports nautiques",
    name: "Palme",
    urls: ["/assets/images/products/waterSports/flippersBlack.webp"],
    price: 4,
    tagLabels: ["Accessoires"],
    options: [
      { size: "S", total_quantity: 30 },
      { size: "M", total_quantity: 25 },
      { size: "L", total_quantity: 20 },
    ],
  },
  {
    title: "Sports nautiques",
    name: "Bouée",
    urls: [
      "/assets/images/products/waterSports/buoy1.jpg",
      "/assets/images/products/waterSports/buoy2.jpg",
    ],
    price: 3,
    tagLabels: ["Accessoires"],
    options: [
      { size: "Standard", total_quantity: 10 },
    ],
  },
  {
    title: "Sports nautiques",
    name: "Paddle",
    urls: [
      "/assets/images/products/waterSports/paddlePink1.jpg",
      "/assets/images/products/waterSports/paddlePink2.jpg",
      "/assets/images/products/waterSports/paddlePink3.jpg",
    ],
    price: 20,
    tagLabels: ["Paddleboard"],
    options: [
      { size: "Standard", total_quantity: 10 },
    ],
  },
  {
    title: "Sports nautiques",
    name: "Combinaison surf homme",
    urls: [
      "/assets/images/products/waterSports/surfSuitMengreen1.webp",
      "/assets/images/products/waterSports/surfSuitMengreen2.webp",
    ],
    price: 6,
    tagLabels: ["Combinaison", "Homme"],
    options: [
      { size: "M", total_quantity: 12 },
      { size: "L", total_quantity: 10 },
      { size: "XL", total_quantity: 8 },
    ],
  },
  {
    title: "Sports nautiques",
    name: "Combinaison surf femme",
    urls: [
      "/assets/images/products/waterSports/surfSuitWomenMulti1.webp",
      "/assets/images/products/waterSports/surfSuitWomenMulti2.webp",
    ],
    price: 6,
    tagLabels: ["Combinaison", "Femme"],
    options: [
      { size: "S", total_quantity: 15 },
      { size: "M", total_quantity: 12 },
      { size: "L", total_quantity: 10 },
    ],
  },
  {
    title: "VTT / Vélo",
    name: "Vélo éléctrique blanc",
    urls: ["/assets/images/products/biking/electricVttWhite.jpg"],
    price: 40,
    tagLabels: ["Vélo", "Electrique"],
    options: [
      { size: "M", total_quantity: 5 },
      { size: "L", total_quantity: 3 },
    ],
  },
  {
    title: "VTT / Vélo",
    name: "Vélo éléctrique noir",
    urls: ["/assets/images/products/biking/electricVttBlack.jpg"],
    price: 40,
    tagLabels: ["Vélo", "Electrique"],
    options: [
      { size: "M", total_quantity: 4 },
      { size: "L", total_quantity: 6 },
    ],
  },
  {
    title: "VTT / Vélo",
    name: "VTT",
    urls: [
      "/assets/images/products/biking/menVttGrey1.jpg",
      "/assets/images/products/biking/menVttGrey2.jpg",
    ],
    price: 30,
    tagLabels: ["VTT"],
    options: [
      { size: "M", total_quantity: 10 },
      { size: "L", total_quantity: 7 },
    ],
  },
  {
    title: "VTT / Vélo",
    name: "Casque",
    urls: ["/assets/images/products/biking/helmet.avif"],
    price: 10,
    tagLabels: ["Accessoires"],
    options: [
      { size: "S", total_quantity: 10 },
      { size: "M", total_quantity: 7 },
      { size: "L", total_quantity: 7 },
    ],
  },
  {
    title: "Randonnée",
    name: "Chaussures randonnée Homme",
    urls: [
      "/assets/images/products/hiking/hikingBootsMenBrown1.webp",
      "/assets/images/products/hiking/hikingBootsMenBrown2.webp",
      "/assets/images/products/hiking/hikingBootsMenBrown3.webp",
    ],
    price: 15,
    tagLabels: ["Chaussures", "Homme"],
    options: [
      { size: "36", total_quantity: 10 },
      { size: "37", total_quantity: 7 },
      { size: "38", total_quantity: 7 },
      { size: "39", total_quantity: 7 },
      { size: "41", total_quantity: 7 },
      { size: "42", total_quantity: 7 },
      { size: "43", total_quantity: 7 },
    ],
  },
  {
    title: "Randonnée",
    name: "Chaussures randonnée Homme",
    urls: [
      "/assets/images/products/hiking/hikingBootsMenGreen1.jpg",
      "/assets/images/products/hiking/hikingBootsMenGreen2.jpg",
      "/assets/images/products/hiking/hikingBootsMenGreen3.jpg",
    ],
    price: 12,
    tagLabels: ["Chaussures", "Homme"],
    options: [
      { size: "36", total_quantity: 10 },
      { size: "37", total_quantity: 7 },
      { size: "38", total_quantity: 7 },
      { size: "39", total_quantity: 7 },
      { size: "41", total_quantity: 7 },
      { size: "42", total_quantity: 7 },
      { size: "43", total_quantity: 7 },
    ],
  },
  {
    title: "Randonnée",
    name: "Chaussures randonnée Femme",
    urls: [
      "/assets/images/products/hiking/hikingShoesWomen1.webp",
      "/assets/images/products/hiking/hikingShoesWomen2.webp",
      "/assets/images/products/hiking/hikingShoesWomen3.webp",
    ],
    price: 12,
    tagLabels: ["Chaussures", "Femme"],
    options: [
      { size: "36", total_quantity: 10 },
      { size: "37", total_quantity: 7 },
      { size: "38", total_quantity: 7 },
      { size: "39", total_quantity: 7 },
      { size: "41", total_quantity: 7 },
      { size: "42", total_quantity: 7 },
      { size: "43", total_quantity: 7 },
    ],
  },
  {
    title: "Randonnée",
    name: "Chaussures randonnée Femme",
    urls: [
      "/assets/images/products/hiking/hikingBootsWomenBeige1.webp",
      "/assets/images/products/hiking/hikingBootsWomenBeige1.webp",
      "/assets/images/products/hiking/hikingBootsWomenBeige1.webp",
    ],
    price: 13,
    tagLabels: ["Chaussures", "Femme"],
    options: [
      { size: "36", total_quantity: 10 },
      { size: "37", total_quantity: 7 },
      { size: "38", total_quantity: 7 },
      { size: "39", total_quantity: 7 },
      { size: "41", total_quantity: 7 },
      { size: "42", total_quantity: 7 },
      { size: "43", total_quantity: 7 },
    ],
  },
  {
    title: "Randonnée",
    name: "Bâtons noir",
    urls: ["/assets/images/products/hiking/hikingSticksBlack.webp"],
    price: 7,
    tagLabels: ["Accessoires"],
    options: [
      { size: "Standard", total_quantity: 10 }
    ],
  },
  {
    title: "Randonnée",
    name: "Bâtons bleu",
    urls: ["/assets/images/products/hiking/hikingSticksBlue.jpg"],
    price: 5,
     tagLabels: ["Accessoires"],
    options: [
      { size: "Standard", total_quantity: 10 }
    ],
  },
  {
    title: "Randonnée",
    name: "Bâtons multi",
    urls: ["/assets/images/products/hiking/hikingSticksMulti.jpg"],
    price: 6,
     tagLabels: ["Accessoires"],
    options: [
      { size: "Standard", total_quantity: 10 }
    ],
  },
  {
    title: "Camping",
    name: "Grand tente",
    urls: ["/assets/images/products/camping/tentBig.jpg"],
    price: 18,
    tagLabels: ["Toile de tente"],
    options: [
      { size: "Standard", total_quantity: 5 }
    ],
  },
  {
    title: "Camping",
    name: "Tente 6 places",
    urls: ["/assets/images/products/camping/tent6p.avif"],
    price: 13,
    tagLabels: ["Toile de tente"],
    options: [
      { size: "Standard", total_quantity: 5 }
    ],
  },
  {
    title: "Camping",
    name: "Tente",
    urls: ["/assets/images/products/camping/tentgreen.webp"],
    price: 12,
    tagLabels: ["Toile de tente"],
    options: [
      { size: "Standard", total_quantity: 5 }
    ],
  },
  {
    title: "Camping",
    name: "Sac de couchage",
    urls: ["/assets/images/products/camping/simpleSleepingBag1.jpg"],
    price: 6,
    tagLabels: ["Sac de couchage"],
    options: [
      { size: "Standard", total_quantity: 5 }
    ],
  },
  {
    title: "Camping",
    name: "Sac de couchage",
    urls: ["/assets/images/products/camping/simpleSleepingBag2.jpg"],
    price: 6,
    tagLabels: ["Sac de couchage"],
    options: [
      { size: "Standard", total_quantity: 5 }
    ],
  },
  {
    title: "Camping",
    name: "Sac de couchage 2 places",
    urls: [
      "/assets/images/products/camping/sleepingBag2p1.jpg",
      "/assets/images/products/camping/sleepingBag2p2.jpg",
    ],
    price: 10,
    tagLabels: ["Sac de couchage"],
    options: [
      { size: "Standard", total_quantity: 5 }
    ],
  },
  {
    title: "Camping",
    name: "Chaise camping",
    urls: ["/assets/images/products/camping/campingChairBlue.jpg"],
    price: 3,
    tagLabels: ["Chaise de camping"],
    options: [
      { size: "Standard", total_quantity: 5 }
    ],
  },
  {
    title: "Camping",
    name: "Chaise camping",
    urls: ["/assets/images/products/camping/campingChairGreen1.jpg"],
    price: 2,
     tagLabels: ["Chaise de camping"],
    options: [
      { size: "Standard", total_quantity: 5 }
    ],
  },
];

export default productsDatas;
