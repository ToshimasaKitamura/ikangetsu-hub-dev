import React, { useState, useEffect } from 'react';
import './TournamentTab.css';

interface TournamentArticle {
  id: string;
  title: string;
  date: string;
  author: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  tournamentFolder?: string;
  images?: string[];
}

const TournamentTab: React.FC = () => {
  const [articles, setArticles] = useState<TournamentArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('./tournament/articles.json')
      .then(response => response.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('記事データの読み込みに失敗しました:', error);
        setLoading(false);
      });
  }, []);

  const [selectedArticle, setSelectedArticle] = useState<TournamentArticle | null>(null);
  const [filterTag, setFilterTag] = useState<string>('');

  const allTags = Array.from(new Set(articles.flatMap(article => article.tags)));
  
  const filteredArticles = filterTag
    ? articles.filter(article => article.tags.includes(filterTag))
    : articles;

  if (loading) {
    return (
      <div className="tournament-tab">
        <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>
          記事を読み込み中...
        </div>
      </div>
    );
  }

  return (
    <div className="tournament-tab">
      <div className="tournament-header">
        <h2>大会情報・レポート</h2>
        <div className="tag-filter">
          <select 
            value={filterTag} 
            onChange={(e) => setFilterTag(e.target.value)}
            className="tag-select"
          >
            <option value="">すべてのタグ</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedArticle ? (
        <div className="article-detail">
          <button 
            className="back-button"
            onClick={() => setSelectedArticle(null)}
          >
            ← 一覧に戻る
          </button>
          <article className="article-content">
            <h1>{selectedArticle.title}</h1>
            <div className="article-meta">
              <span className="article-date">{selectedArticle.date}</span>
              <span className="article-author">{selectedArticle.author}</span>
            </div>
            {selectedArticle.imageUrl && (
              <img 
                src={selectedArticle.imageUrl} 
                alt={selectedArticle.title}
                className="article-image"
              />
            )}
            <div className="article-body">
              {selectedArticle.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            {selectedArticle.images && selectedArticle.images.length > 0 && (
              <div className="article-gallery">
                <h3>フォトギャラリー</h3>
                <div className="gallery-grid">
                  {selectedArticle.images.map((image, index) => (
                    <div key={index} className="gallery-item">
                      <img 
                        src={image} 
                        alt={`${selectedArticle.title} - 画像${index + 1}`}
                        onClick={() => window.open(image, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="article-tags">
              {selectedArticle.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </article>
        </div>
      ) : (
        <div className="articles-grid">
          {filteredArticles.map(article => (
            <div 
              key={article.id} 
              className="article-card"
              onClick={() => setSelectedArticle(article)}
            >
              {article.imageUrl && (
                <div className="article-thumbnail">
                  <img src={article.imageUrl} alt={article.title} />
                </div>
              )}
              <div className="article-info">
                <h3>{article.title}</h3>
                <div className="article-meta">
                  <span className="article-date">{article.date}</span>
                  <span className="article-author">{article.author}</span>
                </div>
                <p className="article-preview">
                  {article.content.substring(0, 100)}...
                </p>
                <div className="article-tags">
                  {article.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TournamentTab;