import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Card } from '../../types';
import { DeckData } from '../../utils/csvReader';
import { getDeckImage } from '../../utils/imageLoader';

interface DownloadTabProps {
  cards: Card[];
  decks: string[];
  deckData: DeckData[];
}

function oSafeFileName(name: string) {
  // ファイル名に使えない文字を_に変換
  return name.replace(/[\\/:*?"<>|\s]/g, '_');
}

// 配列をn個ずつの配列に分割する関数
function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const DownloadTab: React.FC<DownloadTabProps> = ({ cards, decks, deckData }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pressed, setPressed] = useState<string | null>(null);
  const [deckImages, setDeckImages] = useState<{ [deckName: string]: string }>({});

  // デッキ画像を読み込む
  useEffect(() => {
    const loadDeckImages = async () => {
      const images: { [deckName: string]: string } = {};
      
      for (const deck of decks) {
        // DPLデータからデッキIDを取得（通常デッキとバリエーションデッキ両方）
        const deckInfo = deckData.find(d => d.deck_name === deck);
        if (deckInfo) {
          try {
            const imageUrl = await getDeckImage(deckInfo.id);
            images[deck] = imageUrl;
          } catch (error) {
            console.log(`Failed to load image for deck: ${deck}`);
          }
        }
      }
      
      setDeckImages(images);
    };

    if (deckData.length > 0) {
      loadDeckImages();
    }
  }, [decks, deckData]);

  const handleDownload = async (deck: string) => {
    setIsDownloading(true);
    const zip = new JSZip();
    const deckCards = cards.filter(card => {
      // 通常デッキ
      if (card.deck_name === deck) return true;
      // リメイクカード（RCL: id === remakeCardId かつ nclCardIdで元カードを参照）
      if (card.remakeCardId && card.id === card.remakeCardId && card.nclCardId) {
        const base = cards.find(c => c.id === card.nclCardId);
        if (base && base.deck_name === deck) return true;
      }
      // バリエーションデッキ
      if (deck === 'プロモ' && card.promoCardId && card.id === card.promoCardId) return true;
      if (deck === 'スペシャルプロモ' && card.spcCardId && card.id === card.spcCardId) return true;
      if (deck === 'コレクションプリズム' && card.cpcCardId && card.id === card.cpcCardId) return true;
      if (deck === 'pixivFANBOX' && card.pfcCardId && card.id === card.pfcCardId) return true;
      return false;
    });

    for (const card of deckCards) {
      try {
        const response = await fetch(card.image);
        const blob = await response.blob();
        let safeName = oSafeFileName(card.name);
        // リメイクカードならファイル名に_remakeを付ける
        if (card.remakeCardId && card.id === card.remakeCardId) {
          safeName += '_remake';
        }
        zip.file(`${safeName}.webp`, blob);
      } catch (e) {
        // 画像取得失敗時はスキップ
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${oSafeFileName(deck)}_cards.zip`);
    setIsDownloading(false);
  };

  // 8個ずつの行に分割
  const deckRows = chunkArray(decks, 8);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', color: '#fff', paddingTop: 0, marginBottom: 40, minHeight: '100vh', boxSizing: 'border-box' }}>
      <div style={{ fontSize: '0.95rem', color: '#bbb', marginBottom: 30, marginTop: typeof window !== 'undefined' && window.innerWidth <= 767 ? 90 : 120 }}>※デッキ名を押すとダウンロードが始まるよ！</div>
      <div
        style={
          typeof window !== 'undefined' && window.innerWidth <= 767
            ? {
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                justifyItems: 'center',
              }
            : {
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap',
              }
        }
      >
        {deckRows.map((row, rowIdx) => (
          <div key={rowIdx} style={{ display: 'contents' }}>
            {row.map(deck => {
              const isHovered = hovered === deck;
              const isPressed = pressed === deck;
              const deckImage = deckImages[deck];
              return (
                <div
                  key={deck}
                  style={{
                    width: '170px',
                    height: '210px',
                    textAlign: 'center',
                    flex: '0 0 170px',
                    marginBottom: 16,
                  }}
                >
                  <div style={{ width: '170px', height: '210px', textAlign: 'center', flex: '0 0 170px' }}>
                    <button
                      onClick={() => handleDownload(deck)}
                      disabled={isDownloading}
                      onMouseEnter={() => setHovered(deck)}
                      onMouseLeave={() => { setHovered(null); setPressed(null); }}
                      onMouseDown={() => setPressed(deck)}
                      onMouseUp={() => setPressed(null)}
                      style={{
                        width: '100%',
                        height: '100%',
                        padding: '8px',
                        background: isPressed || isHovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.1)',
                        color: isPressed || isHovered ? '#222' : '#fff',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderRadius: 12,
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        boxSizing: 'border-box',
                        boxShadow: isHovered || isPressed ? '0 8px 24px rgba(0,0,0,0.20)' : '0 2px 8px rgba(0,0,0,0.10)',
                        transform: isPressed ? 'scale(0.95)' : isHovered ? 'scale(1.05)' : 'scale(1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {deckImage ? (
                        <div style={{
                          width: '100%',
                          height: '150px',
                          backgroundImage: `url(${deckImage})`,
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center 30%',
                          borderRadius: 8,
                          marginBottom: 8,
                          border: '1px solid rgba(255,255,255,0.2)',
                        }} />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '150px',
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                          borderRadius: 8,
                          marginBottom: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          opacity: 0.7,
                        }}>
                          📦
                        </div>
                      )}
                      <div style={{
                        padding: '4px 8px',
                        textAlign: 'center',
                        lineHeight: 1.2,
                        fontSize: typeof window !== 'undefined' && window.innerWidth <= 767 ? '0.8rem' : '0.9rem',
                        marginTop: 'auto',
                      }}>
                        {deck}
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadTab; 