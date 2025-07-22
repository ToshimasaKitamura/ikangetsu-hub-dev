import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 単一ユーザーのRSSフィードを取得
async function fetchSingleUserRss(username, hashtag = null) {
  // ハッシュタグ指定がある場合はURLに追加
  let rssUrl = `https://note.com/${username}/rss`;
  if (hashtag) {
    rssUrl += `?hashtag=${encodeURIComponent(hashtag)}`;
  }
  console.log(`📡 ${username}のRSSフィードを取得中: ${rssUrl}`);

  try {
    const response = await fetch(rssUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlData = await response.text();
    const result = await parseStringPromise(xmlData);
    
    const channel = result.rss.channel[0];
    const items = channel.item || [];

    console.log(`✅ ${items.length}件の記事を取得しました`);

    // 記事データを整形
    const articles = items.map(item => {
      // サムネイル画像の抽出
      let thumbnail = null;
      if (item.description && item.description[0]) {
        const imgMatch = item.description[0].match(/<img[^>]+src="([^"]+)"/);
        if (imgMatch) {
          thumbnail = imgMatch[1];
        }
      }

      // カテゴリーの取得
      const categories = item.category || [];

      return {
        title: item.title[0],
        link: item.link[0],
        pubDate: item.pubDate[0],
        creator: username,
        thumbnail: thumbnail,
        description: item.description[0]?.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
        categories: categories.map(cat => cat.trim())
      };
    });

    return articles;

  } catch (error) {
    console.error(`❌ ${username}のRSS取得でエラーが発生しました:`, error.message);
    return [];
  }
}

// ユーザーリストファイルを読み込む
function loadUserList() {
  try {
    const usersFilePath = path.join(__dirname, '../public/note-users.txt');
    const content = fs.readFileSync(usersFilePath, 'utf8');
    const users = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#')); // 空行とコメント行を除外
    
    console.log(`📋 ユーザーリストを読み込みました: ${users.length}人`);
    return users;
  } catch (error) {
    console.error('❌ ユーザーリストの読み込みに失敗しました:', error.message);
    return [];
  }
}

// 複数ユーザーからRSSを取得して統合
async function fetchMultipleUsersRss(hashtag = '東方如何月') {
  const users = loadUserList();
  if (users.length === 0) {
    console.error('❌ 取得対象のユーザーが見つかりません');
    return;
  }

  console.log(`🚀 ${users.length}人のユーザーから「${hashtag}」記事を取得開始`);
  
  let allArticles = [];
  
  for (const username of users) {
    const articles = await fetchSingleUserRss(username, hashtag);
    if (articles && articles.length > 0) {
      // 「東方如何月」タグを含む記事のみフィルタリング
      const filteredArticles = articles.filter(article => 
        article.categories.some(cat => cat.includes(hashtag))
      );
      allArticles = allArticles.concat(filteredArticles);
      console.log(`✅ ${username}: ${filteredArticles.length}件の関連記事を取得`);
    } else {
      console.log(`⚠️  ${username}: 関連記事なし`);
    }
    
    // API制限を避けるため少し待機
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 日付順でソート（新しい順）
  allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // JSONファイルとして保存
  const outputPath = path.join(__dirname, '../public/note-articles.json');
  fs.writeFileSync(outputPath, JSON.stringify(allArticles, null, 2));
  
  console.log(`💾 合計${allArticles.length}件の記事を保存しました: ${outputPath}`);
  return allArticles;
}

// メイン実行
const hashtag = process.argv[2] || '東方如何月';
console.log(`📝 「${hashtag}」タグで記事を取得します`);
fetchMultipleUsersRss(hashtag);