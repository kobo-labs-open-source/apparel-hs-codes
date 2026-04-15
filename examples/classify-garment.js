#!/usr/bin/env node

/**
 * Example: Classify a garment and look up duty rates
 *
 * Usage:
 *   node examples/classify-garment.js "cotton t-shirt"
 *   node examples/classify-garment.js "polyester hoodie"
 *   node examples/classify-garment.js "leather ankle boots"
 */

const fs = require('fs');
const path = require('path');

// Load the index and duty rate data
const index = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'index.json'), 'utf8')
);
const usDutyRates = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'duty-rates', 'us.json'), 'utf8')
);

/**
 * Search the HS code index by keyword query.
 * Returns matching entries sorted by relevance (number of keyword matches).
 */
function searchByKeyword(query) {
  const terms = query.toLowerCase().split(/\s+/);

  const results = index
    .map((entry) => {
      const allText = [
        ...entry.keywords,
        entry.description.toLowerCase(),
        entry.category,
        entry.construction,
      ].join(' ');

      const matchCount = terms.filter((term) => allText.includes(term)).length;
      return { ...entry, matchCount };
    })
    .filter((entry) => entry.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount);

  return results;
}

/**
 * Look up the US duty rate for a given HS code.
 */
function getUsDutyRate(code) {
  return usDutyRates.rates.find((rate) => rate.code === code) || null;
}

/**
 * Explain the knitted vs woven distinction — the most common classification mistake.
 */
function explainConstruction(results) {
  const hasKnitted = results.some((r) => r.construction === 'knitted');
  const hasWoven = results.some((r) => r.construction === 'woven');

  if (hasKnitted && hasWoven) {
    return (
      '\n  NOTE: This garment type exists in both Chapter 61 (knitted) and Chapter 62 (woven).\n' +
      '  The correct code depends on the fabric construction method, not the garment appearance.\n' +
      '  - Jersey, interlock, rib knit, French terry → Chapter 61 (knitted)\n' +
      '  - Poplin, twill, satin, denim, chiffon → Chapter 62 (woven)\n' +
      '  Check the fabric by stretching it — knits stretch in at least one direction.'
    );
  }
  return '';
}

// Main
const query = process.argv.slice(2).join(' ') || 'cotton t-shirt';
console.log(`\nSearching for: "${query}"\n`);

const results = searchByKeyword(query);

if (results.length === 0) {
  console.log('No matching HS codes found. Try different keywords.');
  process.exit(1);
}

// Show top 5 results
const topResults = results.slice(0, 5);
console.log(`Found ${results.length} matches. Top results:\n`);

topResults.forEach((result, i) => {
  console.log(`  ${i + 1}. ${result.code} — ${result.description}`);
  console.log(`     Category: ${result.category} | Construction: ${result.construction} | Gender: ${result.gender}`);

  const dutyRate = getUsDutyRate(result.code);
  if (dutyRate) {
    console.log(`     US Duty Rate: ${dutyRate.dutyRate} (${dutyRate.dutyType})`);
    if (dutyRate.notes) {
      console.log(`     Note: ${dutyRate.notes}`);
    }
  }
  console.log();
});

// Show the knitted vs woven warning if applicable
const constructionNote = explainConstruction(topResults);
if (constructionNote) {
  console.log(constructionNote);
}

console.log(
  '\nDisclaimer: This is a reference tool only. Always verify HS code classification\n' +
  'with your customs broker or the relevant customs authority before importing.\n'
);
