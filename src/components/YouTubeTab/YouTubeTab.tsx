import React, { useState, useEffect } from 'react';
import { fetchYouTubeVideos, YouTubeVideo } from '../../utils/youtubeApi';

const YouTubeTab: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const videoData = await fetchYouTubeVideos('#東方如何月');
        setVideos(videoData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '動画の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViewCount = (count: string) => {
    const num = parseInt(count);
    if (num >= 10000) {
      return `${Math.floor(num / 1000)}K回視聴`;
    }
    return `${num.toLocaleString()}回視聴`;
  };

  const openVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📺</div>
          <div>動画を読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>❌</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: typeof window !== 'undefined' && window.innerWidth <= 767 ? '20px 16px' : '40px 32px',
      minHeight: '100vh',
      color: '#fff'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        marginTop: typeof window !== 'undefined' && window.innerWidth <= 767 ? '80px' : '100px'
      }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 700,
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          📺 公式YouTube動画
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#bbb',
          marginBottom: '24px'
        }}>
          ハッシュタグ「#東方如何月」が付いた最新動画
        </p>
        <a
          href="https://www.youtube.com/hashtag/東方如何月"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #ff0000, #cc0000)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '25px',
            fontWeight: 600,
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 15px rgba(255, 0, 0, 0.3)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 0, 0, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 0, 0, 0.3)';
          }}
        >
          YouTubeで検索
        </a>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth <= 767 
          ? '1fr' 
          : 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => openVideo(video.id)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.3)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              overflow: 'hidden'
            }}>
              <img
                src={video.thumbnail}
                alt={video.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjM2MCIgdmlld0JveD0iMCAwIDY0MCAzNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2NDAiIGhlaWdodD0iMzYwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjMyMCIgeT0iMTgwIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiPvCfk7o8L3RleHQ+Cjwvc3ZnPg==';
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                {video.duration}
              </div>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                background: 'rgba(255, 0, 0, 0.9)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                transition: 'all 0.2s ease'
              }}>
                ▶️
              </div>
            </div>
            <div style={{ padding: '16px' }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                marginBottom: '8px',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {video.title}
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: '#bbb',
                marginBottom: '12px',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {video.description}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.85rem',
                color: '#888'
              }}>
                <span>{formatViewCount(video.viewCount)}</span>
                <span>{formatDate(video.publishedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeTab;