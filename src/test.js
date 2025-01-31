import dotenv from "dotenv";
dotenv.config();
async function fetchImageURL(influencerName) {
  try {
    const query = `${influencerName} picture`;
    console.log("Search Query:", query);

    const url =
      `https://www.googleapis.com/customsearch/v1?` +
      new URLSearchParams({
        q: query,
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_CSE_ID_RESEARCH,
        num: 1,
        searchType: "image", // Add this to specifically search for images
      });

    console.log("Request URL:", url);

    const res = await fetch(url);
    const data = await res.json();

    console.log("Raw API Response:", JSON.stringify(data, null, 2));

    // Enhanced image extraction logic
    let imageUrl = "";

    // Try multiple image sources in order of preference
    if (data.items?.[0]?.pagemap?.metatags?.[0]?.["og:image"]) {
      imageUrl = data.items[0].pagemap.metatags[0]["og:image"];
      console.log("Found og:image:", imageUrl);
    } else if (data.items?.[0]?.pagemap?.cse_image?.[0]?.src) {
      imageUrl = data.items[0].pagemap.cse_image[0].src;
      console.log("Found cse_image:", imageUrl);
    } else if (data.items?.[0]?.pagemap?.cse_thumbnail?.[0]?.src) {
      imageUrl = data.items[0].pagemap.cse_thumbnail[0].src;
      console.log("Found thumbnail:", imageUrl);
    } else if (data.items?.[0]?.link) {
      imageUrl = data.items[0].link;
      console.log("Using direct image link:", imageUrl);
    }

    // Verify the image URL is valid
    if (!imageUrl) {
      console.warn("No image URL found in API response");
    }

    console.log("Image URL:", imageUrl);
    return {
      imageUrl,
      query,
    };
  } catch (error) {
    console.error("Image search error:", error);
    return { imageUrl: "", query };
  }
}

result = fetchImageURL("Elon Musk");
