// src/data/allInternationalPackageData.js
import bali1 from "../../assets/packageimg/internationalPackage1.png";
import bali2 from "../../assets/packageimg/internationalPackage1.png";
import bali3 from "../../assets/packageimg/internationalPackage1.png";
import baliHeader from "../../assets/packageimg/internationalPackage1.png";

import thailand1 from "../../assets/packageimg/internationalPackage2.jpg";
import thailand2 from "../../assets/packageimg/internationalPackage2.jpg";
import thailand3 from "../../assets/packageimg/internationalPackage2.jpg";
import thailandHeader from "../../assets/packageimg/internationalPackage2.jpg";

import singapore1 from "../../assets/packageimg/internationalPackage3.png";
import singapore2 from "../../assets/packageimg/internationalPackage3.png";
import singapore3 from "../../assets/packageimg/internationalPackage3.png";
import singaporeHeader from "../../assets/packageimg/internationalPackage3.png";

import malaysia1 from "../../assets/packageimg/internationalPackage4.png";
import malaysia2 from "../../assets/packageimg/internationalPackage4.png";
import malaysia3 from "../../assets/packageimg/internationalPackage4.png";
import malaysiaHeader from "../../assets/packageimg/internationalPackage4.png";

import dubai1 from "../../assets/packageimg/internationalPackage5.png";
import dubai2 from "../../assets/packageimg/internationalPackage5.png";
import dubai3 from "../../assets/packageimg/internationalPackage5.png";
import dubaiHeader from "../../assets/packageimg/internationalPackage5.png";

import europe1 from "../../assets/packageimg/internationalPackage6.png";
import europe2 from "../../assets/packageimg/internationalPackage6.png";
import europe3 from "../../assets/packageimg/internationalPackage6.png";
import europeHeader from "../../assets/packageimg/internationalPackage6.png";

import sriLanka1 from "../../assets/packageimg/internationalPackage1.png";
import sriLanka2 from "../../assets/packageimg/internationalPackage1.png";
import sriLanka3 from "../../assets/packageimg/internationalPackage1.png";
import sriLankaHeader from "../../assets/packageimg/internationalPackage1.png";

import mauritius1 from "../../assets/packageimg/internationalPackage5.png";
import mauritius2 from "../../assets/packageimg/internationalPackage5.png";
import mauritius3 from "../../assets/packageimg/internationalPackage5.png";
import mauritiusHeader from "../../assets/packageimg/internationalPackage5.png";

const allInternationalPackageData = [
  {
    id: 1,
    title: "Bali Paradise Tour - 5N",
    validTill: "31/12/2025",
    priceNote: "Basis 2 person travelling together",
    notValidDuring: ["Christmas", "New Year", "Peak Season"],
    sightseeing: "5 Nights / 6 Days",
    nights: "5 N Bali",
    headerImage: baliHeader,
    days: [
      {
        day: "Day 1 : Arrival in Bali",
        image: bali1,
        description: `Arrive at Ngurah Rai International Airport, meet and greet by our representative. Transfer to hotel for check-in. Rest of the day at leisure. Evening enjoy Kecak dance performance. Overnight in Bali.`,
        note: `Bali is known as the Island of Gods, famous for its volcanic mountains, iconic rice paddies, beaches and coral reefs.`,
      },
      {
        day: "Day 2 : Uluwatu Temple & Kuta Beach",
        image: bali2,
        description: `After breakfast, visit Uluwatu Temple perched on a cliff with stunning ocean views. Later proceed to Kuta Beach for sunset. Enjoy seafood dinner at Jimbaran Bay. Overnight in Bali.`,
      },
      {
        day: "Day 3 : Ubud Cultural Tour",
        image: bali3,
        description: `Full day Ubud tour visiting Sacred Monkey Forest, Ubud Palace, Tegalalang Rice Terrace, and traditional art markets. Experience Balinese culture and craftsmanship. Overnight in Bali.`,
      },
    ],
  },
  {
    id: 2,
    title: "Thailand Experience - 6N",
    validTill: "31/12/2025",
    priceNote: "Basis 2 person travelling together",
    notValidDuring: ["Songkran Festival", "New Year"],
    sightseeing: "6 Nights / 7 Days",
    nights: "3 N Bangkok, 3 N Phuket",
    headerImage: thailandHeader,
    days: [
      { 
        day: "Day 1 : Arrival Bangkok", 
        image: thailand1, 
        description: "Arrive at Bangkok airport, transfer to hotel. Evening visit to Asiatique The Riverfront." 
      },
      { 
        day: "Day 2 : Bangkok City Tour", 
        image: thailand2, 
        description: "Visit Grand Palace, Wat Pho, Wat Arun. Enjoy Chao Phraya River cruise. Evening explore Patpong Night Market." 
      },
      { 
        day: "Day 3 : Flight to Phuket", 
        image: thailand3, 
        description: "Fly to Phuket. Check-in at hotel. Evening visit Patong Beach and enjoy nightlife." 
      },
    ],
  },
  {
    id: 3,
    title: "Singapore & Malaysia - 5N",
    validTill: "31/12/2025",
    priceNote: "Basis 2 person travelling together",
    notValidDuring: ["Chinese New Year", "Hari Raya"],
    sightseeing: "5 Nights / 6 Days",
    nights: "2 N Singapore, 3 N Kuala Lumpur",
    headerImage: singaporeHeader,
    days: [
      { 
        day: "Day 1 : Arrival Singapore", 
        image: singapore1, 
        description: "Arrive at Changi Airport, transfer to hotel. Evening visit Gardens by the Bay light show." 
      },
      { 
        day: "Day 2 : Singapore City Tour", 
        image: singapore2, 
        description: "Visit Sentosa Island, Merlion Park, Marina Bay Sands. Evening cable car ride." 
      },
      { 
        day: "Day 3 : Travel to Kuala Lumpur", 
        image: singapore3, 
        description: "Travel to KL by road. Check-in at hotel. Evening visit KLCC Park and fountain show." 
      },
    ],
  },
  {
    id: 4,
    title: "Dubai Extravaganza - 4N",
    validTill: "31/12/2025",
    priceNote: "Basis 2 person travelling together",
    notValidDuring: ["Eid Al Fitr", "Eid Al Adha"],
    sightseeing: "4 Nights / 5 Days",
    nights: "4 N Dubai",
    headerImage: dubaiHeader,
    days: [
      { 
        day: "Day 1 : Arrival Dubai", 
        image: dubai1, 
        description: "Arrive at Dubai Airport, transfer to hotel. Evening Dhow Cruise with dinner." 
      },
      { 
        day: "Day 2 : Dubai City Tour", 
        image: dubai2, 
        description: "Visit Burj Khalifa, Dubai Mall, Palm Jumeirah. Desert Safari with BBQ dinner in evening." 
      },
      { 
        day: "Day 3 : Abu Dhabi Day Trip", 
        image: dubai3, 
        description: "Full day Abu Dhabi tour visiting Sheikh Zayed Mosque, Ferrari World, and Emirates Palace." 
      },
    ],
  },
  {
    id: 5,
    title: "European Dream - 7N",
    validTill: "31/12/2025",
    priceNote: "Basis 2 person travelling together",
    notValidDuring: ["Christmas", "Summer Peak Season"],
    sightseeing: "7 Nights / 8 Days",
    nights: "2 N Paris, 2 N Switzerland, 3 N Italy",
    headerImage: europeHeader,
    days: [
      { 
        day: "Day 1 : Arrival Paris", 
        image: europe1, 
        description: "Arrive in Paris, transfer to hotel. Evening Eiffel Tower visit and Seine River cruise." 
      },
      { 
        day: "Day 2 : Paris City Tour", 
        image: europe2, 
        description: "Visit Louvre Museum, Notre Dame, Champs-Élysées. Evening at leisure." 
      },
      { 
        day: "Day 3 : Travel to Switzerland", 
        image: europe3, 
        description: "Travel to Interlaken. Visit Jungfraujoch - Top of Europe. Overnight in Switzerland." 
      },
    ],
  },
  {
    id: 6,
    title: "Sri Lanka Explorer - 6N",
    validTill: "31/12/2025",
    priceNote: "Basis 2 person travelling together",
    notValidDuring: ["Sinhala New Year", "Vesak Festival"],
    sightseeing: "6 Nights / 7 Days",
    nights: "2 N Colombo, 2 N Kandy, 2 N Bentota",
    headerImage: sriLankaHeader,
    days: [
      { 
        day: "Day 1 : Arrival Colombo", 
        image: sriLanka1, 
        description: "Arrive at Colombo Airport, transfer to hotel. Evening city tour of Colombo." 
      },
      { 
        day: "Day 2 : Kandy Cultural Tour", 
        image: sriLanka2, 
        description: "Travel to Kandy. Visit Temple of Tooth Relic, Royal Botanical Gardens." 
      },
      { 
        day: "Day 3 : Bentota Beach Relaxation", 
        image: sriLanka3, 
        description: "Travel to Bentota. Enjoy beach activities, water sports, and turtle hatchery visit." 
      },
    ],
  },
  {
    id: 7,
    title: "Mauritius Holiday - 5N",
    validTill: "31/12/2025",
    priceNote: "Basis 2 person travelling together",
    notValidDuring: ["Christmas", "New Year"],
    sightseeing: "5 Nights / 6 Days",
    nights: "5 N Mauritius",
    headerImage: mauritiusHeader,
    days: [
      { 
        day: "Day 1 : Arrival Mauritius", 
        image: mauritius1, 
        description: "Arrive at Sir Seewoosagur Ramgoolam Airport, transfer to resort. Evening at leisure." 
      },
      { 
        day: "Day 2 : North Island Tour", 
        image: mauritius2, 
        description: "Visit Port Louis, Caudan Waterfront, Pamplemousses Botanical Garden." 
      },
      { 
        day: "Day 3 : South Island Tour", 
        image: mauritius3, 
        description: "Visit Trou aux Cerfs, Grand Bassin, Chamarel Seven Colored Earth." 
      },
    ],
  },
  {
    id: 8,
    title: "Malaysia Adventure - 4N",
    validTill: "31/12/2025",
    priceNote: "Basis 2 person travelling together",
    notValidDuring: ["Hari Raya Puasa", "Chinese New Year"],
    sightseeing: "4 Nights / 5 Days",
    nights: "2 N Kuala Lumpur, 2 N Langkawi",
    headerImage: malaysiaHeader,
    days: [
      { 
        day: "Day 1 : Arrival Kuala Lumpur", 
        image: malaysia1, 
        description: "Arrive at KLIA, transfer to hotel. Evening visit Petronas Twin Towers." 
      },
      { 
        day: "Day 2 : KL City Tour", 
        image: malaysia2, 
        description: "Visit Batu Caves, National Monument, Merdeka Square. Evening shopping at Bukit Bintang." 
      },
      { 
        day: "Day 3 : Flight to Langkawi", 
        image: malaysia3, 
        description: "Fly to Langkawi. Island hopping tour, visit Eagle Square, Cable Car ride." 
      },
    ],
  }
];

export default allInternationalPackageData;