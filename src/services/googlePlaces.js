import { DEFAULT_FIREBASE_CONFIG } from "./firebase";

/**
 * Searches Google Places API (New) for place details (rating, address, maps link)
 * by place name and destination city.
 */
export async function fetchGooglePlaceInfo(placeName, destination = "") {
  if (!placeName || !placeName.trim()) {
    return { success: false, empty: true };
  }

  const apiKey = DEFAULT_FIREBASE_CONFIG.apiKey;
  // Combine place name with destination for high accuracy (e.g. "Acropolis Athens")
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
      const isPermissionDenied =
        data.error.code === 403 ||
        data.error.status === "PERMISSION_DENIED" ||
        (data.error.message && data.error.message.includes("Places API (New)"));

      return {
        success: false,
        error: data.error,
        isPermissionDenied,
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
