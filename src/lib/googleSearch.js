export async function fetchGoogleResults(query) {
  const res = await fetch(
    `https://www.googleapis.com/customsearch/v1?` +
      new URLSearchParams({
        q: query,
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_CSE_ID,
        num: 1,
      })
  );

  const data = await res.json();
  return data.items?.[0]?.link || "";
}
