import getFootnotes from "./getFootnotes.js";
import parseTranslationHtml from "./parseTranslationHtml.js";

export default async function createVerseFileContent(
  verse,
  verseFileName,
  surah,
  surahFileName,
  quranFilePrefix
) {
  // TODO: fix sorting somehow - ?base on file.ctime

  // const footnotes = await getFootnotes(verse.persian, quranFilePrefix);

  // const footnoteText =
  //   footnotes === null
  //     ? ""
  //     : footnotes.reduce((acc, footnote, i) => {
  //         console.log(`Adding footnote ${i + 1}...`);

  //         return (acc += `[^${footnote.footnoteNum}]: ${footnote.text}\n`);
  //       }, "");

  const parsedTranslation = parseTranslationHtml(verse.persian);

  return `---
aliases: ["${verse.verseKey}", "سوره ${surah.name}, آیه ${verse.verseNumber}", "قرآن ${verse.verseKey}"]
tags: Qvref
---

parent:: [[${surahFileName}|${surah.name}]]

> [!arabic]+ سوره ${surah.name}, آیه ${verse.verseNumber} (${verse.verseKey})
> <span class="quran-arabic">${verse.arabic}</span>
^arabic

> [!translation]+ سوره ${surah.name}, آیه ${verse.verseNumber} (${verse.verseKey}) - ترجمه
> ${parsedTranslation}
^translation

## یادداشت‌های مرتبط
\`\`\`dataview
LIST from [[${verseFileName}]]
WHERE !contains(file.name, "${quranFilePrefix}")
SORT file.name ASC
\`\`\`

### آیات مرتبط (footnote backlinks)
\`\`\`dataview
LIST FROM [[${verseFileName}]] AND #Qvref
SORT file.name ASC
\`\`\`

`;
}
