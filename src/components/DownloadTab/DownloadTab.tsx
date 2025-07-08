import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Card } from '../../types';

interface DownloadTabProps {
  cards: Card[];
  decks: string[];
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

const DownloadTab: React.FC<DownloadTabProps> = ({ cards, decks }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pressed, setPressed] = useState<string | null>(null);

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
        zip.file(`${safeName}.png`, blob);
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
              return (
                <div
                  key={deck}
                  style={{
                    width: '150px',
                    height: '150px',
                    textAlign: 'center',
                    flex: '0 0 150px',
                    marginBottom: 16,
                  }}
                >
                  <div style={{ width: '150px', height: '150px', textAlign: 'center', flex: '0 0 150px' }}>
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
                        padding: '16px',
                        background: isPressed || isHovered ? '#fff' : 'rgba(255,255,255,0.1)',
                        color: isPressed || isHovered ? '#222' : '#fff',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 500,
                        transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        boxShadow: isHovered || isPressed ? '0 4px 16px rgba(0,0,0,0.10)' : 'none',
                      }}
                    >
                      {deck}
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