# Note RSS連携 実装ガイド

NoteのRSSフィードはCORS制限があるため、ブラウザから直接取得できません。以下の方法で実装可能です。

## 方法1: GitHub Actions + GitHub Pages（推奨）

最も簡単で無料の方法です。

### 1. GitHub Actionsワークフローを作成

`.github/workflows/fetch-note-rss.yml`を作成：

```yaml
name: Fetch Note RSS

on:
  schedule:
    - cron: '0 */6 * * *'  # 6時間ごとに実行
  workflow_dispatch:  # 手動実行も可能

jobs:
  fetch-rss:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm install node-fetch xml2js
      
      - name: Fetch Note RSS
        run: |
          node scripts/fetchNoteRss.mjs YOUR_NOTE_USERNAME 東方如何月
        env:
          NOTE_USERNAME: ${{ secrets.NOTE_USERNAME }}
      
      - name: Commit and push
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add public/note-articles.json
          git commit -m "Update Note articles" || exit 0
          git push
```

### 2. GitHub Secretsを設定

リポジトリの Settings > Secrets で `NOTE_USERNAME` を設定

### 3. フロントエンドの修正

```javascript
// NoteArticles.tsx を修正
const fetchNoteArticles = async () => {
  setLoading(true);
  try {
    const response = await fetch('./note-articles.json');
    const data = await response.json();
    setArticles(data);
  } catch (error) {
    setError('記事の取得に失敗しました');
  } finally {
    setLoading(false);
  }
};
```

## 方法2: Netlify Functions（サーバーレス）

### 1. Netlify Functionを作成

`netlify/functions/note-rss.js`:

```javascript
const fetch = require('node-fetch');
const xml2js = require('xml2js');

exports.handler = async (event) => {
  const { username, hashtag } = event.queryStringParameters;
  
  let url = `https://note.com/${username}/rss`;
  if (hashtag) {
    url += `?hashtag=${encodeURIComponent(hashtag)}`;
  }
  
  try {
    const response = await fetch(url);
    const xmlData = await response.text();
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlData);
    
    // RSS データを整形
    const items = result.rss.channel[0].item || [];
    const articles = items.map(item => ({
      title: item.title[0],
      link: item.link[0],
      pubDate: item.pubDate[0],
      description: item.description[0],
      categories: item.category || []
    }));
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(articles)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch RSS' })
    };
  }
};
```

### 2. フロントエンドから呼び出し

```javascript
const fetchNoteArticles = async (username) => {
  const response = await fetch(`/.netlify/functions/note-rss?username=${username}&hashtag=東方如何月`);
  const data = await response.json();
  setArticles(data);
};
```

## 方法3: Vercel API Routes

### 1. API Routeを作成

`api/note-rss.js`:

```javascript
export default async function handler(req, res) {
  const { username, hashtag } = req.query;
  
  // Netlify Functionsと同様の実装
  
  res.status(200).json(articles);
}
```

## 方法4: 自前のバックエンドAPI

Node.js/Express などでAPIサーバーを構築：

```javascript
app.get('/api/note-rss', async (req, res) => {
  const { username, hashtag } = req.query;
  // RSS取得処理
  res.json(articles);
});
```

## 方法5: CORSプロキシサービス（開発用）

開発環境でのテスト用：

```javascript
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const rssUrl = `${CORS_PROXY}https://note.com/${username}/rss`;
```

注意: 本番環境では使用しないでください。

## 推奨実装

**GitHub Actions + GitHub Pages** が最も簡単で無料です：

1. 定期的に自動更新
2. 追加のサーバー不要
3. GitHub Pagesで配信
4. 完全無料

実装手順：
1. 上記のGitHub Actionsワークフローを追加
2. `fetchNoteRss.mjs` でJSONファイルを生成
3. フロントエンドでJSONファイルを読み込む

これで「東方如何月」タグの記事が自動的に取得・表示されます。