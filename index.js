import fs from "fs-extra";
import axios from "axios";

const BASE_API_URL = "https://quran.ebadollah.com/api/quran";
const OUTPUT_DIR = "./data/verses";
const TRANSLATOR = "fa_fooladvand";

// Function to fetch surah data from the API
async function fetchSurah(suraNo) {
  try {
    const response = await axios.post(`${BASE_API_URL}/getSura`, {
      suraNo,
      options: { translators: [TRANSLATOR] },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching surah ${suraNo}:`, error);
    throw error;
  }
}

// Function to save surah data to a JSON file
async function saveSurahToFile(suraNo, verses) {
  const filePath = `${OUTPUT_DIR}/${suraNo}.json`;
  try {
    await fs.outputJson(filePath, verses, { spaces: 2 });
    console.log(`✅ Saved surah ${suraNo} to ${filePath}`);
  } catch (error) {
    console.error(`Error saving surah ${suraNo}:`, error);
    throw error;
  }
}

// Main function to process all surahs
async function generateQuranJson() {
  try {
    // Ensure output directory exists
    await fs.ensureDir(OUTPUT_DIR);

    for (let suraNo = 1; suraNo <= 114; suraNo++) {
      console.log(`Fetching surah ${suraNo}...`);
      const surahData = await fetchSurah(suraNo);
      console.log(`Response for surah ${suraNo}:`, JSON.stringify(surahData, null, 2));

      // Map ayat to the required structure
      const verses = surahData.ayat.map((verse) => ({
        id: verse.AyaId,
        verseNumber: verse.AyaNo,
        verseKey: `${verse.SuraNo}:${verse.AyaNo}`,
        arabic: verse.Arabic,
        persian: verse.translations.find((t) => t.TranslationName === TRANSLATOR)?.Text || "",
      }));

      // Save to JSON file
      await saveSurahToFile(suraNo, verses);
    }

    console.log("✅ All surahs have been processed and saved.");
  } catch (error) {
    console.error("❌ An error occurred:", error);
  }
}

// Run the script
generateQuranJson();
