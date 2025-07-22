import React, { useState, useEffect } from 'react';
import './NoteArticles.css';

interface NoteArticle {
  title: string;
  link: string;
  pubDate: string;
  creator: string;
  thumbnail?: string;
  description: string;
  categories: string[];
}

const NoteArticles: React.FC = () => {
  const [articles, setArticles] = useState<NoteArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyIkangetsu, setShowOnlyIkangetsu] = useState(true);

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

  // 「東方如何月」タグでフィルタリング
  const filteredArticles = showOnlyIkangetsu
    ? articles.filter(article => 
        article.categories.some(cat => cat.includes('東方如何月'))
      )
    : articles;

  return (
    <div className="note-articles">
      <div className="note-header">
        <h2>Note記事一覧</h2>
        <div className="note-controls">
          <label className="filter-toggle">
            <input
              type="checkbox"
              checked={showOnlyIkangetsu}
              onChange={(e) => setShowOnlyIkangetsu(e.target.checked)}
            />
            <span>「東方如何月」タグのみ表示</span>
          </label>
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

      {!loading && !error && filteredArticles.length === 0 && (
        <div className="no-articles">
          {showOnlyIkangetsu && articles.length > 0
            ? '「東方如何月」タグを含む記事が見つかりませんでした。'
            : '記事が見つかりませんでした。'}
        </div>
      )}

      {!loading && !error && filteredArticles.length > 0 && (
        <div className="articles-grid">
          {filteredArticles.map((article, index) => (
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
                  <span className="article-date">
                    {new Date(article.pubDate).toLocaleDateString('ja-JP')}
                  </span>
                  <span className="article-creator">@{article.creator}</span>
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