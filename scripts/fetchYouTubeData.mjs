#!/usr/bin/env node

/**
 * YouTube Data API v3 を使用してハッシュタグ「#東方如何月」の動画を取得し、
 * JSONファイルとして保存するバッチスクリプト
 * 
 * 使用方法:
 * 1. .env ファイルに VITE_YOUTUBE_API_KEY を設定
 * 2. node scripts/fetchYouTubeData.mjs
 * 
 * 出力: public/db/youtube_data.json
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 環境変数からAPIキーを取得
const API_KEY = process.env.VITE_YOUTUBE_API_KEY;

if (!API_KEY) {
  console.error('❌ Error: VITE_YOUTUBE_API_KEY not found in environment variables');
  console.log('💡 Please add your YouTube Data API v3 key to .env file:');
  console.log('   VITE_YOUTUBE_API_KEY=your_api_key_here');
  process.exit(1);
}

// ISO 8601 duration (PT4M13S) を mm:ss 形式に変換
function parseDuration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

async function fetchYouTubeData() {
  try {
    console.log('🔍 Searching for #東方如何月 hashtag videos...');
    
    // ハッシュタグで動画を検索
    const searchQuery = encodeURIComponent('#東方如何月');
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&order=date&maxResults=20&key=${API_KEY}`
    );

    if (!searchResponse.ok) {
      throw new Error(`YouTube API error: ${searchResponse.status} ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      console.log('⚠️  No videos found for hashtag #東方如何月');
      return [];
    }

    console.log(`📹 Found ${searchData.items.length} videos`);

    // 動画の詳細情報を取得
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
    );

    if (!detailsResponse.ok) {
      throw new Error(`YouTube API error: ${detailsResponse.status} ${detailsResponse.statusText}`);
    }

    const detailsData = await detailsResponse.json();

    // データを結合
    const videos = searchData.items.map((item) => {
      const details = detailsData.items.find(detail => detail.id === item.id.videoId);
      const thumbnail = item.snippet.thumbnails.high?.url || 
                       item.snippet.thumbnails.medium?.url || 
                       item.snippet.thumbnails.default?.url || '';
      
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: thumbnail,
        publishedAt: item.snippet.publishedAt,
        duration: details ? parseDuration(details.contentDetails.duration) : '0:00',
        viewCount: details?.statistics.viewCount || '0',
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId
      };
    });

    console.log('✅ Successfully fetched video data');
    return videos;

  } catch (error) {
    console.error('❌ Error fetching YouTube data:', error.message);
    throw error;
  }
}

async function saveDataToFile(data) {
  try {
    // 出力ディレクトリを確保
    const outputDir = path.join(__dirname, '..', 'public', 'db');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // データにタイムスタンプを追加
    const outputData = {
      lastUpdated: new Date().toISOString(),
      totalVideos: data.length,
      videos: data
    };

    const outputPath = path.join(outputDir, 'youtube_data.json');
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');
    
    console.log(`💾 Data saved to: ${outputPath}`);
    console.log(`📊 Total videos: ${data.length}`);
    console.log(`🕒 Last updated: ${outputData.lastUpdated}`);

  } catch (error) {
    console.error('❌ Error saving data to file:', error.message);
    throw error;
  }
}

// メイン実行部分
async function main() {
  try {
    console.log('🚀 Starting YouTube data fetch...');
    console.log(`📅 ${new Date().toISOString()}\n`);

    const videoData = await fetchYouTubeData();
    await saveDataToFile(videoData);

    console.log('\n🎉 YouTube data fetch completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Failed to fetch YouTube data:', error.message);
    process.exit(1);
  }
}

// 直接実行された場合のみメイン関数を呼び出し
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}