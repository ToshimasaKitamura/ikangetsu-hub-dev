import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Note非公式APIを使ってハッシュタグで記事を取得（記事検索API使用）
async function fetchNotesByHashtag(hashtag = '東方如何月', size = 10, start = 0, retries = 3) {
  // 記事検索APIエンドポイントを使用
  const apiUrl = `https://note.com/api/v3/searches?context=note&q=${encodeURIComponent('#' + hashtag)}&size=${size}&start=${start}`;
  console.log(`📡 ハッシュタグ「${hashtag}」の記事を取得中: ${apiUrl}`);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'ja,en;q=0.9',
          'Referer': 'https://note.com/',
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 10000 // 10秒タイムアウト
      });

      // レート制限の場合
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || 60;
        console.warn(`⏰ レート制限に達しました。${retryAfter}秒後にリトライします...`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      // APIレスポンスの構造をチェック（記事検索API用）
      if (!data.data || !data.data.notes || !Array.isArray(data.data.notes.contents)) {
        console.warn('⚠️  予期しないAPIレスポンス構造:', JSON.stringify(data, null, 2));
        return [];
      }

      const notes = data.data.notes.contents;
      console.log(`✅ ${notes.length}件の記事を取得しました (試行: ${attempt}/${retries})`);

      // 記事データを整形
      const articles = notes.map(note => {
        try {
          // サムネイル画像の取得
          let thumbnail = null;
          if (note.eyecatch) {
            thumbnail = note.eyecatch.replace(/\?.*/, ''); // クエリパラメータを除去
          }

          // 公開日の変換
          const pubDate = new Date(note.publish_at).toISOString();

          return {
            title: note.name || 'タイトルなし',
            link: `https://note.com/${note.user?.urlname || 'unknown'}/n/${note.key}`,
            pubDate: pubDate,
            creator: note.user?.urlname || 'unknown',
            creatorName: note.user?.nickname || '不明',
            thumbnail: thumbnail,
            description: note.description ? note.description.substring(0, 200) + '...' : '',
            categories: [hashtag],
            likeCount: note.likeCount || 0,
            commentCount: note.commentCount || 0,
            noteKey: note.key
          };
        } catch (parseError) {
          console.error(`❌ 記事データの解析エラー:`, parseError.message, note);
          return null;
        }
      }).filter(article => article !== null); // null要素を除去

      return articles;

    } catch (error) {
      console.error(`❌ 試行 ${attempt}/${retries} でエラー:`, error.message);
      
      if (attempt === retries) {
        console.error(`❌ ${retries}回の試行後も失敗しました`);
        return [];
      }
      
      // 指数バックオフでリトライ
      const backoffTime = Math.pow(2, attempt) * 1000;
      console.log(`⏳ ${backoffTime / 1000}秒後にリトライします...`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
  
  return [];
}

// 複数ページの記事を取得（ページネーション対応）
async function fetchAllNotesByHashtag(hashtag = '東方如何月', maxArticles = 50) {
  console.log(`🚀 ハッシュタグ「${hashtag}」から最大${maxArticles}件の記事を取得開始`);
  
  let allArticles = [];
  let start = 0;
  const size = 10; // 1回のAPIコールで取得する件数
  
  while (allArticles.length < maxArticles) {
    console.log(`📄 ページ ${Math.floor(start / size) + 1} を取得中... (${start} - ${start + size})`);
    
    const articles = await fetchNotesByHashtag(hashtag, size, start);
    
    if (articles.length === 0) {
      console.log('🔚 これ以上記事がありません');
      break;
    }
    
    allArticles = allArticles.concat(articles);
    
    // 目標件数に達したら終了
    if (allArticles.length >= maxArticles) {
      allArticles = allArticles.slice(0, maxArticles);
      console.log(`🎯 目標の${maxArticles}件に達しました`);
      break;
    }
    
    start += size;
    
    // レート制限対策（2秒間隔）
    console.log('⏳ API制限対策で2秒待機...');
    await new Promise(resolve => setTimeout(resolve, 2000));
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
const maxArticles = parseInt(process.argv[3]) || 50;
console.log(`📝 「${hashtag}」タグで最大${maxArticles}件の記事を取得します`);
fetchAllNotesByHashtag(hashtag, maxArticles);