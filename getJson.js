'use strict';

const rp    = require('request-promise');
const { parse } = require('csv-parse/sync');   // ← destructure so parse is the fn
const fs    = require('fs');
const path  = require('path');

// 1) Your spreadsheet ID:
const SPREADSHEET_ID = '13sAxo8wG3VxHgjSNayT0qqLUKpypYRa3AeAY2OWPl1g';

// 2) Tabs + their GIDs (in order: questionTypes, answers, questions, choices)
const spreadsheets = [
  {
    name: 'QuestionTypesSpreadsheet',
    url: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=1541233227`
  },
  {
    name: 'AnswersSpreadsheet',
    url: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=1129464320`
  },
  {
    name: 'QuestionsSpreadsheet',
    url: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=13606149`
  },
  {
    name: 'ChoicesSpreadsheet',
    url: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=1332666698`
  }
];

// will hold each sheet’s parsed rows
const FetchedJsonData = {};

function fetchSheet(sheet) {
  console.log(`[DEBUG] Fetching ${sheet.name} as CSV…`);
  return rp(sheet.url)
    .then(csvText => {
      // now parse is a function, so this works:
      const rows = parse(csvText, { columns: true, skip_empty_lines: true });
      FetchedJsonData[sheet.name] = rows;
      console.log(`[DEBUG] ${sheet.name}: ${rows.length} rows`);
    })
    .catch(err => {
      console.error(`[ERROR] ${sheet.name} failed:`, err.message);
      throw err;
    });
}

// fetch all sheets in parallel
Promise.all(spreadsheets.map(fetchSheet))
  .then(() => {
    const outputPath = path.join(__dirname, 'src', 'fetchedJsonData.js');
    const fileContent =
      'var FetchedJsonData = ' +
      JSON.stringify(FetchedJsonData, null, 2) +
      ';\n';
    fs.writeFileSync(outputPath, fileContent, 'utf8');
    console.log(`[DEBUG] All CSVs fetched; file written to ${outputPath}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('[ERROR] Failed to fetch one or more sheets:', err.message);
    process.exit(1);
  });
