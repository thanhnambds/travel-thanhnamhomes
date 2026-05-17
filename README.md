# Travel Thanh Nam Homes MVP

Static-first lead generation site for `travel.thanhnamhomes.vn`.

## Scope

- Static Next.js export for GitHub Pages or equivalent static hosting.
- No backend server, database, payment flow, server actions or API routes in MVP.
- Data lives in repo files under `data/`.
- Flight provider is an adapter-style mock file: `data/flights.mock.json`.
- Hotel rates are read from `data/hotels.csv`.
- Daily combo is stored in `data/generated/daily-combo.json`.
- Chatbot is client-side and only summarizes demand before sending users to Zalo.

## Data Files

- `data/hotels.csv`: hotel rate table.
- `data/flights.mock.json`: mock flight data.
- `data/config.json`: margin, destination and site config.
- `data/generated/draft-combo.json`: generated draft for manual review.
- `data/generated/daily-combo.json`: published combo displayed on `/combo-hom-nay/`.
- `data/generated/combo-history.json`: lightweight admin log.

Required price warning:

> Giá tham khảo tại thời điểm cập nhật, có thể thay đổi theo tình trạng vé, phòng và chính sách của nhà cung cấp. Vui lòng liên hệ để kiểm tra giá chính xác trước khi giữ dịch vụ.

## Commands

```bash
npm install
npm run validate:data
npm run generate:combo
npm run publish:combo
npm run build
```

Manual publish flow:

1. Update `data/hotels.csv`, `data/flights.mock.json` or `data/config.json`.
2. Run `npm run validate:data`.
3. Run `npm run generate:combo`.
4. Review `data/generated/draft-combo.json`.
5. Run `npm run publish:combo` only when the draft is approved.
6. Commit and push to deploy.

## GitHub Pages Setup

1. Create a GitHub repository for this project.
2. Push this code to the `main` branch.
3. In GitHub repo settings, enable Pages with GitHub Actions as the source.
4. Add DNS CNAME record:

```text
travel.thanhnamhomes.vn CNAME <github-username>.github.io
```

5. Keep `public/CNAME` as:

```text
travel.thanhnamhomes.vn
```

GitHub Pages should issue SSL automatically after DNS resolves.

## GitHub Actions

- `.github/workflows/deploy.yml`: validates data, builds static export and deploys `out/`.
- `.github/workflows/generate-combo.yml`: runs every day at 08:00 Vietnam time, generates `draft-combo.json` and uploads it as an artifact for review.

The scheduled workflow does not auto-publish.

## SEO

Indexable pages:

- `/`
- `/combo-du-lich/`
- `/combo-phu-quoc/`
- `/combo-da-nang/`
- `/combo-nha-trang/`
- `/ve-may-bay-khach-san/`
- `/lien-he/`

`/combo-hom-nay/` is marked `noindex` in MVP because the content is short-lived.

## Flight API Phase 2

Do not call flight APIs with secret keys from browser code. For real providers, fetch prices in GitHub Actions or a backend service, transform them into public JSON, then deploy the static site.
