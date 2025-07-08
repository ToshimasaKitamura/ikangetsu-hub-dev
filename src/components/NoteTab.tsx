import React, { useEffect, useState } from 'react';

interface NoteArticle {
  title: string;
  url: string;
}

const NOTE_TAG_URL = 'https://note.com/hashtag/%E6%9D%B1%E6%96%B9%E5%A6%82%E4%BD%95%E6%9C%88';

const NoteTab: React.FC = () => {
  const [articles, setArticles] = useState<NoteArticle[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(NOTE_TAG_URL);
        const html = await res.text();
        // DOMParserでHTMLをパース
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // 記事リンクを抽出（noteの構造に依存）
        const anchors = Array.from(doc.querySelectorAll('a'));
        const articleLinks = anchors.filter(a => a.href.includes('/note.com/') === false && a.href.includes('/notes/') && a.textContent && a.textContent.length > 10);
        const articles: NoteArticle[] = articleLinks.map(a => ({
          title: a.textContent || '',
          url: a.href
        }));
        setArticles(articles);
      } catch (e: any) {
        setError(e.message || '記事の取得に失敗しました（CORSの可能性あり）');
      }
    };
    fetchArticles();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>note「東方如何月」記事リスト</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {articles.map((article, idx) => (
          <li key={idx} style={{ marginBottom: 8 }}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
          </li>
        ))}
      </ul>
      {(!error && articles.length === 0) && <div>記事が見つかりませんでした。</div>}
    </div>
  );
};

export default NoteTab; 