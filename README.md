# apparel-hs-codes

**Open database of Harmonized System (HS) tariff codes for apparel and textiles.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/@kobolabs/apparel-hs-codes.svg)](https://www.npmjs.com/package/@kobolabs/apparel-hs-codes)

## What are HS Codes?

The Harmonized System (HS) is a standardized numerical system for classifying traded products, maintained by the World Customs Organization. Every country's customs tariff is built on HS codes. The first 6 digits are internationally standardized, meaning `6109.10` refers to "cotton t-shirts, knitted" everywhere in the world. Getting the right code determines how much duty you pay.

## Coverage

| Chapter | Title | Headings |
|---------|-------|----------|
| 61 | Articles of apparel, knitted or crocheted | 6101 -- 6117 |
| 62 | Articles of apparel, not knitted (woven) | 6201 -- 6217 |
| 63 | Other made-up textile articles; worn clothing | 6301 -- 6310 |
| 64 | Footwear, gaiters and parts | 6401 -- 6406 |
| 65 | Headgear and parts | 6501 -- 6507 |

Duty rates are included for **US**, **EU**, **UK**, and **Australia**.

## Quick Start

```bash
npm install @kobolabs/apparel-hs-codes
```

```js
const codes = require('@kobolabs/apparel-hs-codes');

// Find the HS code for a cotton t-shirt
const cottonTee = codes.find(c => c.code === '6109.10');
console.log(cottonTee.description);
// → "T-shirts, singlets and other vests, knitted or crocheted, of cotton"
```

Or search by keyword:

```js
const results = codes.filter(c =>
  c.keywords.some(k => k.includes('hoodie'))
);
// → [{ code: "6110.20", ... }, { code: "6110.30", ... }]
```

## Data Format

### Chapter files (`data/chapters/*.json`)

Each chapter file contains headings and their subheadings:

```json
{
  "code": "6109",
  "description": "T-shirts, singlets and other vests, knitted or crocheted",
  "level": "heading",
  "children": [
    {
      "code": "6109.10",
      "description": "Of cotton",
      "level": "subheading",
      "keywords": ["t-shirt", "tshirt", "tee", "singlet", "vest", "tank top", "cotton", "knitted"],
      "commonGarments": ["cotton t-shirt", "cotton tank top", "cotton singlet"],
      "notes": "One of the most commonly traded apparel items globally."
    }
  ]
}
```

### Flat index (`data/index.json`)

A searchable array of all subheading-level codes with metadata:

```json
{
  "code": "6109.10",
  "chapter": 61,
  "description": "T-shirts, singlets and other vests, knitted or crocheted, of cotton",
  "keywords": ["t-shirt", "tshirt", "tee", "singlet", "vest", "tank top", "cotton", "knitted", "jersey"],
  "category": "tops",
  "construction": "knitted",
  "gender": "unisex"
}
```

### Duty rate files (`data/duty-rates/*.json`)

Per-country MFN duty rates:

```json
{
  "code": "6109.10",
  "description": "T-shirts, singlets — of cotton, knitted",
  "dutyRate": "16.5%",
  "dutyType": "ad_valorem",
  "notes": "One of the most commonly imported apparel items"
}
```

## Duty Rates

| Country | File | Rate Type |
|---------|------|-----------|
| United States | `data/duty-rates/us.json` | MFN/NTR (general) |
| European Union | `data/duty-rates/eu.json` | MFN (third-country) |
| United Kingdom | `data/duty-rates/uk.json` | UK Global Tariff |
| Australia | `data/duty-rates/au.json` | General rate |

Rates shown are MFN (Most Favoured Nation) rates -- the standard rate applied to WTO members. Preferential rates under free trade agreements (USMCA, CPTPP, EU GSP, etc.) are often lower or zero. Additional tariffs (e.g., US Section 301 duties on China-origin goods) are not included.

## Common Classification Pitfalls

### Knitted vs Woven (Chapter 61 vs 62)

This is the single most common classification mistake. The same garment (e.g., a men's shirt) has completely different HS codes depending on whether the fabric is knitted or woven:

- **6105.10** -- Men's cotton shirt, *knitted* (polo shirt)
- **6205.20** -- Men's cotton shirt, *woven* (dress shirt)

If the fabric stretches in at least one direction, it is almost certainly knitted (Chapter 61). Poplin, twill, denim, chiffon, and satin are woven (Chapter 62).

### Material-based subheading selection

Within each heading, subheadings are split by fibre content. The general pattern is:

- **.10** or **.11** -- Wool or fine animal hair
- **.20** -- Cotton
- **.30** -- Man-made (synthetic) fibres
- **.40** -- Artificial fibres (rayon, viscose)
- **.90** -- Other textile materials

Classification is based on the fibre that makes up the greatest proportion **by weight**. A "60% cotton / 40% polyester" blend is classified under cotton.

### T-shirts vs shirts (6109 vs 6105/6205)

A t-shirt (6109) is a lightweight, pull-over garment without a collar or with a simple crew/V-neck. A shirt (6105/6205) typically has a collar (polo collar, button-down collar) and may have a partial or full button placket. The distinction matters: the duty rates can be very different.

### Coated and laminated garments (6113 / 6210)

Garments made from fabrics that have been coated, covered, or laminated with plastics or rubber get their own special headings, even if the base fabric is ordinary knitted or woven textile. A PU-coated rain jacket is not classified with regular jackets.

### Sets and ensembles

A "suit" (6103/6203 or 6104/6204) must consist of matching components of the same fabric. Coordinate sets sold together but of different fabrics are classified as "ensembles" or individually by component.

## Example Script

```bash
node examples/classify-garment.js "cotton t-shirt"
node examples/classify-garment.js "polyester hoodie"
node examples/classify-garment.js "leather ankle boots"
```

## Disclaimer

This database is provided as a reference tool for educational and informational purposes. It does not constitute legal, customs, or trade compliance advice. HS code classification is ultimately determined by the customs authority of the importing country. Always verify codes and duty rates with a licensed customs broker or the relevant government tariff schedule before making import decisions.

Duty rates change. Check official sources for current rates:
- **US**: [HTSUS](https://hts.usitc.gov/)
- **EU**: [TARIC](https://ec.europa.eu/taxation_customs/dds2/taric/)
- **UK**: [UK Global Tariff](https://www.trade-tariff.service.gov.uk/)
- **Australia**: [Australian Customs Tariff](https://www.abf.gov.au/importing-exporting-and-manufacturing/tariff-classification)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on submitting corrections, adding new country duty rates, or expanding coverage to additional HS chapters.

---

Built by the team at [Kobo](https://kobolabs.io) -- modern PLM for fashion brands.
