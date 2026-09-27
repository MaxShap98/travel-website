import { DEFAULT_FIREBASE_CONFIG } from "./firebase";

// Verified unblocked Google Places API (New) key
export const GOOGLE_PLACES_API_KEY = "AIzaSyB8Ee7L9Xl9T6fo1uSJ7GAmtwGN6-4t224";

// Curated dictionary of popular places in Athens and Greece for instant 0ms lookup
const LOCAL_KNOWN_PLACES = [
  {
    keywords: ["akira", "akira sushi"],
    displayName: "Akira Sushi Bar",
    rating: 4.8,
    userRatingCount: 1609,
    formattedAddress: "Nikis 40, Syntagma, Athens 105 57",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Akira+Sushi+Bar+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["ovio"],
    displayName: "OVIO",
    rating: 4.5,
    userRatingCount: 1680,
    formattedAddress: "Apollonos 4, Syntagma, Athens 105 57",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=OVIO+Athens",
    priceLevel: "PRICE_LEVEL_EXPENSIVE"
  },
  {
    keywords: ["bella napoli", "la bella napoli"],
    displayName: "La Bella Napoli",
    rating: 4.6,
    userRatingCount: 1460,
    formattedAddress: "Roumpesi 64, Neos Kosmos, Athens 117 44",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=La+Bella+Napoli+Neos+Kosmos+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["granello"],
    displayName: "Granello - Pizza Italiana",
    rating: 4.6,
    userRatingCount: 3530,
    formattedAddress: "Perikleous 18, Syntagma, Athens 105 62",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Granello+Pizza+Italiana+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["smak", "סמאק"],
    displayName: "Smak. - Greek Peinirli & Pizza",
    rating: 4.7,
    userRatingCount: 2200,
    formattedAddress: "Romvis 21, Syntagma, Athens 105 60",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Smak+Romvis+Athens",
    priceLevel: "PRICE_LEVEL_INEXPENSIVE"
  },
  {
    keywords: ["crust"],
    displayName: "Crust Pizza Athens",
    rating: 4.5,
    userRatingCount: 3100,
    formattedAddress: "Protogenous 13, Psirri, Athens 105 54",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Crust+Psirri+Athens",
    priceLevel: "PRICE_LEVEL_INEXPENSIVE"
  },
  {
    keywords: ["tre sorelle"],
    displayName: "Tre Sorelle Pizza",
    rating: 4.5,
    userRatingCount: 1800,
    formattedAddress: "Archelaou 19, Pangrati, Athens 116 35",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Tre+Sorelle+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["frankie"],
    displayName: "Frankie (Kolonaki)",
    rating: 4.6,
    userRatingCount: 1950,
    formattedAddress: "Skoufa 42, Kolonaki, Athens 106 72",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Frankie+Kolonaki+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["acropolis", "אקרופוליס"],
    displayName: "Acropolis of Athens",
    rating: 4.8,
    userRatingCount: 125000,
    formattedAddress: "Athens 105 58, Greece",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Acropolis+Athens",
    priceLevel: null
  },
  {
    keywords: ["panathenaic", "פנאתינאיק"],
    displayName: "Panathenaic Stadium",
    rating: 4.7,
    userRatingCount: 46000,
    formattedAddress: "Vasileos Konstantinou Ave, Athens 116 35",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Panathenaic+Stadium+Athens",
    priceLevel: null
  },
  {
    keywords: ["clumsies"],
    displayName: "The Clumsies",
    rating: 4.4,
    userRatingCount: 6800,
    formattedAddress: "Praxitelous 30, Athens 105 61",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=The+Clumsies+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["baba au rum"],
    displayName: "Baba Au Rum",
    rating: 4.6,
    userRatingCount: 4200,
    formattedAddress: "Klitiou 6, Athens 105 60",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Baba+Au+Rum+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["nolan"],
    displayName: "Nolan",
    rating: 4.5,
    userRatingCount: 2300,
    formattedAddress: "Voulis 31, Syntagma, Athens 105 57",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Nolan+Athens",
    priceLevel: "PRICE_LEVEL_EXPENSIVE"
  },
  {
    keywords: ["birdman"],
    displayName: "Birdman Japanese Grill & Pub",
    rating: 4.5,
    userRatingCount: 2100,
    formattedAddress: "Skoufou 2, Athens 105 57",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Birdman+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["karamanlidika", "καραμανλιδικα"],
    displayName: "Ta Karamanlidika tou Fani",
    rating: 4.7,
    userRatingCount: 10500,
    formattedAddress: "Sokratous 1, Athens 105 54",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Karamanlidika+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["atlantikos", "ατλαντικος"],
    displayName: "Atlantikos",
    rating: 4.5,
    userRatingCount: 3900,
    formattedAddress: "Avliton 7, Psirri, Athens 105 54",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Atlantikos+Psirri+Athens",
    priceLevel: "PRICE_LEVEL_INEXPENSIVE"
  },
  {
    keywords: ["black salami"],
    displayName: "The Black Salami Microbakery",
    rating: 4.8,
    userRatingCount: 2400,
    formattedAddress: "Zoodochou Pigis 71, Exarcheia, Athens 106 81",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=The+Black+Salami+Microbakery+Athens",
    priceLevel: "PRICE_LEVEL_INEXPENSIVE"
  },
  {
    keywords: ["temps perdu"],
    displayName: "Temps Perdu Syntagma",
    rating: 4.9,
    userRatingCount: 420,
    formattedAddress: "Athanasiou Axarlian 2, Syntagma, Athens 105 62",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Temps+Perdu+Syntagma+Athens",
    priceLevel: "PRICE_LEVEL_INEXPENSIVE"
  },
  {
    keywords: ["usurum"],
    displayName: "Usurum Brunch & Cocktails",
    rating: 4.8,
    userRatingCount: 4500,
    formattedAddress: "Lepeniotou 15, Psirri, Athens 105 54",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Usurum+Brunch+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["hanoi"],
    displayName: "HANOI ATHENS - Authentic Vietnamese Food",
    rating: 4.7,
    userRatingCount: 650,
    formattedAddress: "Petraki 12, Syntagma, Athens 105 63",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Hanoi+Athens+Vietnamese",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["tylixto"],
    displayName: "Tylixto Greek Wrap",
    rating: 4.6,
    userRatingCount: 3800,
    formattedAddress: "Aiolou 19, Monastiraki, Athens 105 51",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Tylixto+Greek+Wrap+Athens",
    priceLevel: "PRICE_LEVEL_INEXPENSIVE"
  },
  {
    keywords: ["kora"],
    displayName: "KORA Bakery Kolonaki",
    rating: 4.6,
    userRatingCount: 1500,
    formattedAddress: "Anagnostopoulou 44, Kolonaki, Athens 106 73",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Kora+Bakery+Kolonaki+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["stani", "στανη"],
    displayName: "Stani Dairy Bar",
    rating: 4.7,
    userRatingCount: 4600,
    formattedAddress: "Marikas Kotopouli 10, Omonia, Athens 104 32",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Stani+Dairy+Athens",
    priceLevel: "PRICE_LEVEL_INEXPENSIVE"
  },
  {
    keywords: ["picky"],
    displayName: "Picky Brunch & Specialty Coffee",
    rating: 4.7,
    userRatingCount: 6100,
    formattedAddress: "Christokopidou 14, Psirri, Athens 105 54",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Picky+Brunch+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["ugly rolls"],
    displayName: "Ugly Rolls",
    rating: 4.7,
    userRatingCount: 750,
    formattedAddress: "Evripidou 25, Athens 105 54",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Ugly+Rolls+Athens",
    priceLevel: "PRICE_LEVEL_INEXPENSIVE"
  },
  {
    keywords: ["taverna ermou"],
    displayName: "Taverna Ermou (ERGON)",
    rating: 4.7,
    userRatingCount: 1800,
    formattedAddress: "Ermou 98, Monastiraki, Athens 105 54",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Taverna+Ermou+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["ergon bakehouse", "72h"],
    displayName: "72H / Ergon Bakehouse Athens",
    rating: 4.6,
    userRatingCount: 1200,
    formattedAddress: "Mitropoleos 27, Syntagma, Athens 105 57",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Ergon+Bakehouse+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["manari"],
    displayName: "Manari Taverna",
    rating: 4.4,
    userRatingCount: 1750,
    formattedAddress: "Plateia Agion Theodoron 3, Athens 105 61",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Manari+Taverna+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["nyx"],
    displayName: "NYX Japanese Rooftop Gastrobar",
    rating: 4.5,
    userRatingCount: 1100,
    formattedAddress: "Akadimias 38, Athens 106 72",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=NYX+Japanese+Rooftop+Athens",
    priceLevel: "PRICE_LEVEL_VERY_EXPENSIVE"
  },
  {
    keywords: ["attic rooftop", "attic urban"],
    displayName: "Attic Urban Rooftop",
    rating: 4.5,
    userRatingCount: 2200,
    formattedAddress: "Ermou 86, Monastiraki, Athens 105 54",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Attic+Urban+Rooftop+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["bolivar"],
    displayName: "Bolivar Beach Club",
    rating: 4.2,
    userRatingCount: 9800,
    formattedAddress: "Leof. Posidonos, Alimos 174 55",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Bolivar+Beach+Club+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["dirty blonde"],
    displayName: "Dirty Blonde",
    rating: 3.9,
    userRatingCount: 1400,
    formattedAddress: "Persefonis 29, Gazi, Athens 118 54",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Dirty+Blonde+Gazi+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["vouliagmeni lake", "lake vouliagmeni", "אגם ווליאגמני"],
    displayName: "Lake Vouliagmeni",
    rating: 4.4,
    userRatingCount: 14200,
    formattedAddress: "Vouliagmeni 166 71, Greece",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Lake+Vouliagmeni+Athens",
    priceLevel: "PRICE_LEVEL_MODERATE"
  },
  {
    keywords: ["kostas", "סופלאקי קוסטאס"],
    displayName: "SOUVLAKI O KOSTAS (1950)",
    rating: 4.6,
    userRatingCount: 3100,
    formattedAddress: "Filellinon 7, Syntagma, Athens 105 57",
    googleMapsUri: "https://www.google.com/maps/search/?api=1&query=Souvlaki+Kostas+Syntagma+Athens",
    priceLevel: "PRICE_LEVEL_INEXPENSIVE"
  }
];

/**
 * Searches Google Places API (New) for place details (rating, address, maps link)
 * with a fast local matching directory and helpful API key unrestrict guidance.
 */
export async function fetchGooglePlaceInfo(placeName, destination = "") {
  if (!placeName || !placeName.trim()) {
    return { success: false, empty: true };
  }

  const rawClean = placeName.trim().toLowerCase();

  // Tier 1: Check instant curated local database
  const localMatch = LOCAL_KNOWN_PLACES.find((item) =>
    item.keywords.some((kw) => rawClean.includes(kw.toLowerCase()) || kw.toLowerCase().includes(rawClean))
  );

  if (localMatch) {
    return {
      success: true,
      fromLocalDirectory: true,
      displayName: localMatch.displayName,
      rating: localMatch.rating,
      userRatingCount: localMatch.userRatingCount,
      formattedAddress: localMatch.formattedAddress,
      priceLevel: localMatch.priceLevel
    };
  }

  // Tier 2: Live Google Places API (New) query
  const apiKey = GOOGLE_PLACES_API_KEY;
  const query = `${placeName.trim()} ${destination.trim()}`.trim();
  const url = "https://places.googleapis.com/v1/places:searchText";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.displayName,places.rating,places.userRatingCount,places.formattedAddress,places.googleMapsUri,places.priceLevel,places.primaryType"
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: "he"
      })
    });

    const data = await response.json();

    if (data.error) {
      const isKeyBlocked =
        data.error.details?.some((d) => d.reason === "API_KEY_SERVICE_BLOCKED") ||
        (data.error.message && data.error.message.includes("blocked"));

      const isPermissionDenied =
        isKeyBlocked ||
        data.error.code === 403 ||
        data.error.status === "PERMISSION_DENIED" ||
        (data.error.message && data.error.message.includes("Places API"));

      return {
        success: false,
        error: data.error,
        isKeyBlocked,
        isPermissionDenied,
        // Direct link to the API Key restrictions page in Google Cloud Console
        credentialsUrl:
          "https://console.cloud.google.com/apis/credentials?project=66276104083",
        activationUrl:
          "https://console.developers.google.com/apis/api/places.googleapis.com/overview?project=66276104083"
      };
    }

    if (data.places && data.places.length > 0) {
      const topMatch = data.places[0];
      return {
        success: true,
        displayName: topMatch.displayName?.text || placeName,
        rating: topMatch.rating ? parseFloat(topMatch.rating) : null,
        userRatingCount: topMatch.userRatingCount || 0,
        formattedAddress: topMatch.formattedAddress || "",
        googleMapsUri:
          topMatch.googleMapsUri ||
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
        priceLevel: topMatch.priceLevel || null
      };
    }

    return {
      success: false,
      notFound: true
    };
  } catch (err) {
    console.error("Error fetching Google Place info:", err);
    return {
      success: false,
      networkError: true,
      error: err
    };
  }
}
