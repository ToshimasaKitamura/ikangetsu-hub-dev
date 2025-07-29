// YouTube Data API v3 を使用してチャンネルの動画を取得

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
}

// バッチ処理で使用するインターフェース（コメントアウト）
// interface YouTubeChannelResponse {
//   items: {
//     id: string;
//   }[];
// }

// interface YouTubeSearchResponse {
//   items: {
//     id: {
//       videoId: string;
//     };
//     snippet: {
//       title: string;
//       description: string;
//       publishedAt: string;
//       thumbnails: {
//         high?: {
//           url: string;
//         };
//         medium?: {
//           url: string;
//         };
//         default?: {
//           url: string;
//         };
//       };
//     };
//   }[];
// }

// interface YouTubeVideoDetailsResponse {
//   items: {
//     id: string;
//     contentDetails: {
//       duration: string;
//     };
//     statistics: {
//       viewCount: string;
//     };
//   }[];
// }

// ISO 8601 duration (PT4M13S) を mm:ss 形式に変換（バッチ処理で使用）
// function parseDuration(duration: string): string {
//   const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
//   if (!match) return '0:00';
  
//   const hours = parseInt(match[1] || '0');
//   const minutes = parseInt(match[2] || '0');
//   const seconds = parseInt(match[3] || '0');
  
//   if (hours > 0) {
//     return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//   }
//   return `${minutes}:${seconds.toString().padStart(2, '0')}`;
// }

export async function fetchYouTubeVideos(_searchQuery: string = '#東方如何月'): Promise<YouTubeVideo[]> {
  try {
    // まず保存されたJSONデータを試す
    const savedData = await loadSavedYouTubeData();
    if (savedData && savedData.length > 0) {
      console.log('✅ Loaded YouTube data from saved file');
      return savedData;
    }
    
    // 保存データがない場合はダミーデータを返す
    console.warn('⚠️ No saved YouTube data found. Using dummy data.');
    console.log('💡 Run "npm run fetch-youtube" to fetch real data from YouTube API');
    return getDummyVideos();
    
  } catch (error) {
    console.error('❌ Error loading YouTube data:', error);
    return getDummyVideos();
  }
}

// 保存されたYouTubeデータを読み込む
async function loadSavedYouTubeData(): Promise<YouTubeVideo[] | null> {
  try {
    const response = await fetch(import.meta.env.BASE_URL + 'db/youtube_data.json');
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    // データの有効性をチェック
    if (!data.videos || !Array.isArray(data.videos)) {
      return null;
    }
    
    // データの更新日時をチェック（24時間以内かどうか）
    const lastUpdated = new Date(data.lastUpdated);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      console.warn(`⚠️ YouTube data is ${Math.round(hoursDiff)} hours old. Consider running "npm run fetch-youtube"`);
    }
    
    // 最新12件に制限
    return data.videos.slice(0, 12);
    
  } catch (error) {
    console.error('Error loading saved YouTube data:', error);
    return null;
  }
}

// ハッシュタグ検索用のダミーデータも更新

// ダミーデータを返す関数
function getDummyVideos(): Promise<YouTubeVideo[]> {
  const dummyVideos: YouTubeVideo[] = [
    {
      id: 'sample1',
      title: '【東方如何月】初心者向けルール解説 #東方如何月 #TCG',
      description: '東方如何月の基本的なルールとゲームの流れについて詳しく解説します。#東方如何月 初めてプレイする方にもわかりやすく説明していますので、ぜひご覧ください！',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      publishedAt: '2024-03-15T10:00:00Z',
      duration: '15:32',
      viewCount: '25400'
    },
    {
      id: 'sample2',
      title: '紅魔郷デッキで勝利！#東方如何月 コンボ解説',
      description: '紅魔郷デッキの特徴的なカードとコンボを紹介。#東方如何月 レミリア・スカーレットを中心とした戦術について解説します。',
      thumbnail: 'https://img.youtube.com/vi/oHg5SJYRHA0/maxresdefault.jpg',
      publishedAt: '2024-03-10T14:30:00Z',
      duration: '12:45',
      viewCount: '18900'
    },
    {
      id: 'sample3',
      title: '【大会実況】東方如何月全国大会決勝！#東方如何月',
      description: '全国大会決勝戦の模様をお届け！#東方如何月 上級者同士の駆け引きと戦略をお楽しみください。',
      thumbnail: 'https://img.youtube.com/vi/y6120QOlsfU/maxresdefault.jpg',
      publishedAt: '2024-03-05T18:00:00Z',
      duration: '28:15',
      viewCount: '42100'
    },
    {
      id: 'sample4',
      title: 'みんなで東方如何月！新カード開封動画 #東方如何月',
      description: '新パックを開封して新カードをチェック！#東方如何月 みんなでワイワイ楽しむ開封動画です。',
      thumbnail: 'https://img.youtube.com/vi/abc123def456/maxresdefault.jpg',
      publishedAt: '2024-02-28T16:00:00Z',
      duration: '10:20',
      viewCount: '15600'
    },
    {
      id: 'sample5',
      title: '東方如何月デッキレシピ公開！#東方如何月 #デッキ構築',
      description: '効果的なデッキの組み方を公開！#東方如何月 各デッキタイプの特徴について初心者向けに解説します。',
      thumbnail: 'https://img.youtube.com/vi/xyz789uvw012/maxresdefault.jpg',
      publishedAt: '2024-02-20T12:00:00Z',
      duration: '18:45',
      viewCount: '31200'
    },
    {
      id: 'sample6',
      title: '東方如何月プレイ動画 友達と対戦！#東方如何月',
      description: '友達との対戦プレイ動画です！#東方如何月 楽しい対戦の様子をお楽しみください。',
      thumbnail: 'https://img.youtube.com/vi/mno345pqr678/maxresdefault.jpg',
      publishedAt: '2024-02-15T20:00:00Z',
      duration: '8:30',
      viewCount: '12800'
    },
    {
      id: 'sample7',
      title: '【開封】東方如何月新弾パック開封！レアカード狙い #東方如何月',
      description: '新弾パックを大量開封！#東方如何月 レアカードが出るか!?ドキドキの開封動画です。',
      thumbnail: 'https://img.youtube.com/vi/pqr678stu901/maxresdefault.jpg',
      publishedAt: '2024-02-10T19:00:00Z',
      duration: '22:18',
      viewCount: '38700'
    },
    {
      id: 'sample8',
      title: '東方如何月 店舗大会優勝デッキ紹介！#東方如何月 #大会',
      description: '店舗大会で優勝したデッキを詳しく紹介！#東方如何月 デッキ構築の参考にしてください。',
      thumbnail: 'https://img.youtube.com/vi/vwx234yza567/maxresdefault.jpg',
      publishedAt: '2024-02-05T15:30:00Z',
      duration: '14:55',
      viewCount: '21300'
    }
  ];

  // 読み込み感を演出
  return new Promise(resolve => {
    setTimeout(() => resolve(dummyVideos), 800);
  });
}