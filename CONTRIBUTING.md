# Contributing to apparel-hs-codes

Thank you for your interest in improving this dataset. Contributions are welcome — whether you're fixing an error, adding missing codes, or expanding duty rate coverage to new countries.

## How HS Codes Work

The Harmonized System is maintained by the World Customs Organization (WCO). Key points:

- **Chapters (2 digits)** and **headings (4 digits)** are internationally standardized.
- **Subheadings (6 digits)** are also internationally standardized under the HS Convention.
- **Beyond 6 digits**, each country defines its own national tariff lines. This repo covers codes up to the 6-digit level.

## Submitting Changes

1. Fork the repository and create a branch for your change.
2. Make your edits to the relevant JSON files in `data/`.
3. Ensure your JSON is valid — run `node -e "require('./data/index.json')"` as a quick check.
4. Submit a pull request with a clear description of what you changed and why.

## Guidelines

- **Verify codes against official schedules.** Before submitting, cross-reference your additions or corrections with the official tariff schedule of the relevant country (e.g., HTSUS for the US, TARIC for the EU, UK Global Tariff for the UK).
- **Use the existing data structure.** Follow the same JSON schema used in existing chapter files. Every subheading entry should include `keywords` and `commonGarments` arrays for searchability.
- **Keep duty rates realistic.** When adding or updating duty rates, cite the source schedule and the date you verified the rate. Rates change — include the `lastUpdated` date.
- **One change per PR.** If you're fixing a code description and adding a new country's duty rates, submit them as separate pull requests.

## What We're Looking For

- Additional country duty rate files (e.g., Canada, Japan, India, China)
- Corrections to existing code descriptions or duty rates
- Expanded keyword coverage for better search results
- Chapter coverage beyond 61-65 (e.g., Chapter 50-60 for raw textiles and fabrics)

## Code of Conduct

Be respectful and constructive. This is a reference dataset — accuracy matters more than speed.
