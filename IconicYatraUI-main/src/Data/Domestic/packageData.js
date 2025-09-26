// src/data/allDomesticPackageData.js
import guwahati1 from "../../assets/packageimg/package1.png";
import guwahati2 from "../../assets/packageimg/package1.png";
import guwahati3 from "../../assets/packageimg/package1.png";
import guwahatiHeader from "../../assets/packageimg/package1.png";

import holy1 from "../../assets/packageimg/package2.png";
import holy2 from "../../assets/packageimg/package2.png";
import holy3 from "../../assets/packageimg/package2.png";
import holyHeader from "../../assets/packageimg/package2.png";

import kashi1 from "../../assets/packageimg/package3.png";
import kashi2 from "../../assets/packageimg/package3.png";
import kashi3 from "../../assets/packageimg/package3.png";
import kashiHeader from "../../assets/packageimg/package3.png";

import ayodhya1 from "../../assets/packageimg/package4.jpg";
import ayodhya2 from "../../assets/packageimg/package4.jpg";
import ayodhya3 from "../../assets/packageimg/package4.jpg";
import ayodhyaHeader from "../../assets/packageimg/package4.jpg";

import odisha1 from "../../assets/packageimg/package5.png";
import odisha2 from "../../assets/packageimg/package5.png";
import odisha3 from "../../assets/packageimg/package5.png";
import odishaHeader from "../../assets/packageimg/package5.png";

import uniqueOdisha1 from "../../assets/packageimg/package6.png";
import uniqueOdisha2 from "../../assets/packageimg/package6.png";
import uniqueOdisha3 from "../../assets/packageimg/package6.png";
import uniqueOdishaHeader from "../../assets/packageimg/package6.png";

import meghalaya1 from "../../assets/packageimg/package1.png";
import meghalaya2 from "../../assets/packageimg/package1.png";
import meghalaya3 from "../../assets/packageimg/package1.png";
import meghalayaHeader from "../../assets/packageimg/package1.png";

import goa1 from "../../assets/packageimg/package3.png";
import goa2 from "../../assets/packageimg/package3.png";
import goa3 from "../../assets/packageimg/package3.png";
import goaHeader from "../../assets/packageimg/package3.png";

const allDomesticPackageData = [
  {
    id:1,
    title: "2N Guwahati",
    validTill: "31/12/2025",
    priceNote: "Basis 2 person travelling together",
    notValidDuring: ["Diwali", "New Year", "Long Weekend"],
    sightseeing: "2 Nights / 3 Days",
    nights: "2 N Guwahati",
    headerImage: guwahatiHeader,
    days: [
      {
        day: "Day 1 : Guwahati-Guwahati",
        image: guwahati1,
        description: `Assistance on arrival at the Guwahati airport later checks in to your hotel. 
        As time permits we may take a tour of the Kamakhya Temple. Evening enjoy at Brahmaputra River Cruise (Ticket cost not Included). 
        Overnight in Guwahati.`,
        note: `Guwahati, formerly known as Gauhati is a city of the Indian state of Assam and also the largest metropolis in northeastern India. 
        It has several ancient Hindu temples including the Umananda Temple, Navagraha Temple, and Basistha Temple.`,
      },
      {
        day: "Day 2 : Local SightSeeing At Guwahati",
        image: guwahati2,
        description: `After breakfast visit a full day sightseeing of Guwahati. 
        We may take a tour of temples in Guwahati like Purva Tirupati Shri Balaji Temple, Sukreswar Temple, Navagraha Temple, Umananda Temple at Peacock Island, 
        Assam State Museum, DighaliPukhuri (Lake), State Zoo cum Botanical Garden, Planetarium and Assam State Emporiums. 
        Later proceed to the hotel and complete check in. Overnight in Guwahati.`,
      },
      {
        day: "Day 3 : Guwahati-Guwahati",
        image: guwahati3,
        description: `Post breakfast check out from the hotel and take transfer to the Guwahati Airport for your onward journey.`,
      },
    ],
  },
  {
     id:2,
    title: "Holy Tringle Tour-4N",
    validTill: "31/12/2025",
    priceNote: "Basis 2 person travelling together",
    notValidDuring: ["Diwali", "New Year"],
    sightseeing: "4 Nights / 5 Days",
    nights: "4 N",
    headerImage: holyHeader,
    days: [
      { day: "Day 1 : Arrival & Local Darshan", image: holy1, description: "Arrival and hotel check-in. Evening local temple visit." },
      { day: "Day 2 : Temple Tour", image: holy2, description: "Full day sightseeing of major temples." },
      { day: "Day 3 : Travel & Darshan", image: holy3, description: "Travel to next city and temple visits." },
      { day: "Day 4 : Return Journey", image: holy1, description: "Check-out and transfer to departure point." },
    ],
  },
  {
     id:3,
    title: "Kashi Darshan with Triveni Sangam-3N",
    validTill: "31/12/2025",
    priceNote: "Basis 2 person travelling together",
    notValidDuring: ["Diwali", "New Year"],
    sightseeing: "3 Nights / 4 Days",
    nights: "3 N",
    headerImage: kashiHeader,
    days: [
      { day: "Day 1 : Arrival Kashi", image: kashi1, description: "Arrival at Kashi and check-in. Evening Ganga Aarti." },
      { day: "Day 2 : Full Day Darshan", image: kashi2, description: "Sightseeing of major temples and Triveni Sangam." },
      { day: "Day 3 : Local Visit & Departure", image: kashi3, description: "Local sightseeing and return journey." },
    ],
  },
  {
     id:4,
    title: "Ayodhya & Beyond Temple Tour-2N",
    validTill: "31/12/2025",
    priceNote: "Basis 2 person travelling together",
    notValidDuring: ["Diwali", "New Year"],
    sightseeing: "2 Nights / 3 Days",
    nights: "2 N",
    headerImage: ayodhyaHeader,
    days: [
      { day: "Day 1 : Arrival & Temple Visit", image: ayodhya1, description: "Arrival and check-in. Visit local temples." },
      { day: "Day 2 : Full Day Ayodhya Tour", image: ayodhya2, description: "Sightseeing of temples and historical sites." },
      { day: "Day 3 : Departure", image: ayodhya3, description: "Check-out and transfer to departure point." },
    ],
  },
  {
     id:5,
    title: "SEA SHORE OF ODISHA (Puri 2N - Bhubaneswar 1N - Gopalpur 2N)",
    validTill: "31/12/2025",
    priceNote: "Basis 2 person travelling together",
    notValidDuring: ["Diwali", "New Year"],
    sightseeing: "5 Nights / 6 Days",
    nights: "5 N",
    headerImage: odishaHeader,
    days: [
      { day: "Day 1 : Arrival Puri", image: odisha1, description: "Check-in and evening beach visit." },
      { day: "Day 2 : Puri Sightseeing", image: odisha2, description: "Full day temple and beach tour." },
      { day: "Day 3 : Bhubaneswar Visit", image: odisha3, description: "Sightseeing of temples in Bhubaneswar." },
      { day: "Day 4 : Travel Gopalpur", image: odisha1, description: "Transfer to Gopalpur, beach leisure." },
      { day: "Day 5 : Explore Gopalpur", image: odisha2, description: "Full day at Gopalpur and local visits." },
      { day: "Day 6 : Departure", image: odisha3, description: "Check-out and onward journey." },
    ],
  },
  {
     id:6,
    title: "UNIQUE ODISHA (Puri 3N - Bhubaneswar 1N)",
    validTill: "31/12/2025",
    priceNote: "Basis 2 person travelling together",
    notValidDuring: ["Diwali", "New Year"],
    sightseeing: "4 Nights / 5 Days",
    nights: "4 N",
    headerImage: uniqueOdishaHeader,
    days: [
      { day: "Day 1 : Arrival Puri", image: uniqueOdisha1, description: "Check-in and evening beach visit." },
      { day: "Day 2 : Puri Sightseeing", image: uniqueOdisha2, description: "Full day temple and beach tour." },
      { day: "Day 3 : Bhubaneswar Visit", image: uniqueOdisha3, description: "Sightseeing of temples in Bhubaneswar." },
      { day: "Day 4 : Departure", image: uniqueOdisha1, description: "Check-out and onward journey." },
    ],
  },
  {
     id:7,
    title: "7N Meghalaya + Assam",
    validTill: "31/12/2025",
    priceNote: "Basis 2 person travelling together",
    notValidDuring: ["Diwali", "New Year"],
    sightseeing: "7 Nights / 8 Days",
    nights: "7 N",
    headerImage: meghalayaHeader,
    days: [
      { day: "Day 1 : Arrival Assam", image: meghalaya1, description: "Arrival and hotel check-in." },
      { day: "Day 2 : Assam Sightseeing", image: meghalaya2, description: "Full day sightseeing in Assam." },
      { day: "Day 3 : Travel Meghalaya", image: meghalaya3, description: "Transfer to Meghalaya, local visit." },
      { day: "Day 4 : Meghalaya Sightseeing", image: meghalaya1, description: "Tour of major attractions." },
      { day: "Day 5 : Explore Meghalaya", image: meghalaya2, description: "Full day local tour." },
      { day: "Day 6 : Back to Assam", image: meghalaya3, description: "Return to Assam, leisure evening." },
      { day: "Day 7 : Departure", image: meghalaya1, description: "Check-out and transfer to airport." },
    ],
  },
  {
     id:8,
    title: "Magical Goa 2N",
    validTill: "31/12/2025",
    priceNote: "Basis 2 person travelling together",
    notValidDuring: ["Diwali", "New Year"],
    sightseeing: "2 Nights / 3 Days",
    nights: "2 N Goa",
    headerImage: goaHeader,
    days: [
      { day: "Day 1 : Arrival & Beach Visit", image: goa1, description: "Arrival at Goa and check-in. Evening at beach." },
      { day: "Day 2 : Goa Sightseeing", image: goa2, description: "Full day sightseeing of Goa attractions." },
      { day: "Day 3 : Departure", image: goa3, description: "Check-out and transfer to airport." },
    ],
  },
];

export default allDomesticPackageData;
