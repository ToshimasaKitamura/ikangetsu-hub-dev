import React, { useState, useEffect } from 'react';
import './NoteArticles.css';

interface NoteArticle {
  title: string;
  link: string;
  pubDate: string;
  creator: string;
  creatorName?: string;
  thumbnail?: string;
  description: string;
  categories: string[];
  likeCount?: number;
  commentCount?: number;
}

const NoteArticles: React.FC = () => {
  const [articles, setArticles] = useState<NoteArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [authorFilter, setAuthorFilter] = useState<string>('all');

  useEffect(() => {
    fetchNoteArticles();
  }, []);

  const fetchNoteArticles = async () => {
    
    setLoading(true);
    setError(null);

    try {
      // GitHub ActionsでフェッチしたJSONファイルを読み込む
      const response = await fetch('./note-articles.json');
      if (!response.ok) {
        throw new Error('記事データの取得に失敗しました');
      }
      
      const data = await response.json();
      
      // データが空の場合もフォールバックを実行
      if (!data || data.length === 0) {
        throw new Error('記事データが空です');
      }
      
      setArticles(data);
      setLoading(false);
    } catch (error) {
      // フォールバック: JSONファイルがないか空の場合は仮データを表示
      console.info('Note記事を読み込み中です。仮データを表示します。');
      
      const mockData: NoteArticle[] = [
        {
          title: '東方如何月 第4回大会のお知らせ',
          link: 'https://note.com/example/n/n1234567890',
          pubDate: '2024-07-25',
          creator: 'ikangetsu_official',
          description: '次回の東方如何月大会について、詳細をお知らせします。今回は新ルールを導入し...',
          categories: ['東方如何月', '大会', 'お知らせ'],
          thumbnail: './tournament/如何月3on3/IMG_6445.jpg'
        },
        {
          title: '3on3大会 優勝者インタビュー',
          link: 'https://note.com/example/n/n0987654321',
          pubDate: '2024-07-22',
          creator: 'ikangetsu_official',
          description: '先日行われた3on3大会の優勝チームにインタビューを行いました。',
          categories: ['東方如何月', '大会レポート', 'インタビュー'],
          thumbnail: './tournament/如何月3on3/IMG_6458.jpg'
        },
        {
          title: 'カードゲーム制作日記',
          link: 'https://note.com/example/n/n1111111111',
          pubDate: '2024-07-20',
          creator: 'ikangetsu_official',
          description: '最近のカードゲーム制作について振り返ります。',
          categories: ['ゲーム制作', '日記'],
          thumbnail: undefined
        },
        {
          title: '東方如何月 新カード紹介',
          link: 'https://note.com/example/n/n2222222222',
          pubDate: '2024-07-18',
          creator: 'ikangetsu_official',
          description: '次回のアップデートで追加される新カードを紹介します。',
          categories: ['東方如何月', '新カード', 'アップデート'],
          thumbnail: './tournament/如何月3on3/IMG_6450.jpg'
        }
      ];

      setArticles(mockData);
      setLoading(false);
    }
  };

  // フィルタリング開始（全記事から）
  let filteredArticles = articles;

  // 作者でフィルタリング
  if (authorFilter && authorFilter !== 'all') {
    filteredArticles = filteredArticles.filter(article => 
      article.creator === authorFilter
    );
  }

  // 日付でソート
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const dateA = new Date(a.pubDate);
    const dateB = new Date(b.pubDate);
    
    if (sortOrder === 'newest') {
      return dateB.getTime() - dateA.getTime();
    } else {
      return dateA.getTime() - dateB.getTime();
    }
  });


  // ユニークな作者リストを取得
  const uniqueAuthors = Array.from(new Set(
    articles.map(article => article.creator)
  )).sort().map(creator => {
    const article = articles.find(a => a.creator === creator);
    return {
      creator,
      displayName: article?.creatorName || creator
    };
  });

  return (
    <div className="note-articles">
      <div className="note-header">
        <h2>Note記事一覧</h2>
        <div className="note-controls">
          <div className="author-filter">
            <label>作者：</label>
            <select 
              value={authorFilter} 
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="author-select"
            >
              <option value="all">すべての作者</option>
              {uniqueAuthors.map((author) => (
                <option key={author.creator} value={author.creator}>
                  {author.displayName} ({author.creator})
                </option>
              ))}
            </select>
          </div>
          <div className="sort-controls">
            <label>並び順：</label>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="sort-select"
            >
              <option value="newest">新しい順</option>
              <option value="oldest">古い順</option>
            </select>
          </div>
          <button onClick={() => fetchNoteArticles()} className="refresh-button">
            更新
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-message">
          記事を読み込み中...
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!loading && !error && sortedArticles.length === 0 && (
        <div className="no-articles">
          {authorFilter !== 'all'
            ? `選択した作者の記事が見つかりませんでした。`
            : '記事が見つかりませんでした。'}
        </div>
      )}

      {!loading && !error && sortedArticles.length > 0 && (
        <div className="articles-grid">
          {sortedArticles.map((article, index) => (
            <a
              key={index}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="article-card"
            >
              {article.thumbnail && (
                <div className="article-thumbnail">
                  <img src={article.thumbnail} alt={article.title} />
                </div>
              )}
              <div className="article-info">
                <h3>{article.title}</h3>
                <div className="article-meta">
                  <div className="meta-line">
                    <span className="article-date">
                      📅 {new Date(article.pubDate).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="meta-line">
                    <span className="article-creator">
                      ✍️ {article.creatorName || article.creator} (@{article.creator})
                    </span>
                  </div>
                </div>
                <p className="article-description">
                  {article.description}
                </p>
                <div className="article-categories">
                  {article.categories.map((category, idx) => (
                    <span key={idx} className="category">
                      #{category}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="note-footer">
        <p>
          {articles.length > 0 && articles[0].creator === 'ikangetsu_official' ? (
            <>※ 現在はサンプル記事を表示しています。GitHub Actionsで実際のNote記事を取得中です。</>
          ) : (
            <>※ 記事はGitHub Actionsで定期的に自動取得されます。最新の記事を表示するには「更新」ボタンをクリックしてください。</>
          )}
        </p>
      </div>
    </div>
  );
};

export default NoteArticles;