# Playwright を使ってスクリーンショット撮る

## Installation

```
npm i
npx playwright install
```

## Configuration

`main.ts`

```typescript
// ページのURL
const pageURL = "https://google.com/search?q=playwright";
// ページロード後の待機時間をミリ秒で指定
const initialWait = 3000;
// スクロール後の待機時間をミリ秒で指定
const scrollWait = 1500;
// ヘッドレスモードを真/偽で指定
const headless = false;
```

## Usage

```
npx ts-node src/main.ts
```
