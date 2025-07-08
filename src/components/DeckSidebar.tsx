import React from 'react';

interface DeckSidebarProps {
  deckNames: string[];
  activeDeckName?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  style?: React.CSSProperties;
}

const DeckSidebar: React.FC<DeckSidebarProps> = ({ deckNames, activeDeckName, open, setOpen, style }) => {
  const handleClick = (deckName: string) => {
    const el = document.getElementById(`deck-${deckName}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // スマホ判定
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
  const H1_TOP = 120; // h1のy座標（見た目で微調整OK）
  const MENU_BTN_SIZE = 48;
  const SIDEBAR_OFFSET = 16;
  const sidebarTop = H1_TOP + MENU_BTN_SIZE + SIDEBAR_OFFSET;
  const sidebarLeft = isMobile ? 12 : 24;

  // トグルボタンのスタイル
  const toggleBtnStyle: React.CSSProperties = {
    position: 'fixed',
    top: 16,
    left: 8,
    width: isMobile ? 48 : 48,
    height: isMobile ? 48 : 48,
    background: 'rgba(255,255,255,0.18)',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    cursor: 'pointer',
    zIndex: 2001,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    boxShadow: '0 2px 12px rgba(0,0,0,0.13)',
    transition: 'background 0.2s',
  };

  // サイドバーの幅
  const sidebarWidth = isMobile ? '80vw' : 320;
  const sidebarMaxWidth = isMobile ? '90vw' : 320;

  return (
    <>
      {/* トグルボタン（h1の高さに合わせて表示） */}
      {style?.display !== 'none' && (
        <button
          onClick={() => setOpen(!open)}
          style={toggleBtnStyle}
          aria-label={open ? 'サイドバーを閉じる' : 'サイドバーを開く'}
        >
          {open ? (
            <span style={{ fontWeight: 700, fontSize: 28 }}>×</span>
          ) : (
            <span style={{ fontWeight: 700, fontSize: 28 }}>≡</span>
          )}
        </button>
      )}
      {/* サイドバー本体（ハンバーガーメニューより下に表示） */}
      <div
        style={{
          ...{
            position: 'fixed',
            top: sidebarTop,
            left: sidebarLeft,
            width: sidebarWidth,
            minWidth: sidebarWidth,
            maxWidth: sidebarMaxWidth,
            height: `calc(100vh - ${sidebarTop}px)` ,
            background: 'rgba(30,30,30,0.3)',
            color: '#fff',
            padding: '16px 12px 16px 12px',
            overflowY: 'auto',
            borderRadius: 12,
            border: '1.5px solid rgba(255,255,255,0.15)',
            backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            fontSize: '0.95rem',
            textAlign: 'left',
            borderRight: '2.5px solid #fff',
            boxSizing: 'border-box',
            zIndex: 2000,
            marginTop: 0,
            marginLeft: 0,
            boxShadow: isMobile ? '2px 0 16px rgba(0,0,0,0.18)' : 'none',
            transition: 'transform 0.35s cubic-bezier(.4,1.2,.4,1), opacity 0.2s',
            transform: open ? 'translateX(0)' : 'translateX(-110%)',
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
          },
          ...style
        }}
      >
        <h3 style={{ fontSize: '1.1rem', marginBottom: 18, fontWeight: 700, textAlign: 'left' }}>デッキ一覧</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {deckNames.map((deck, idx) => (
            <li key={deck} style={{
              marginBottom: 0,
              display: 'flex',
              alignItems: 'center',
              borderBottom: idx !== deckNames.length - 1 ? '1.5px solid #fff' : 'none',
              padding: '10px 0',
              cursor: 'pointer',
              background: activeDeckName === deck ? '#fff' : 'transparent',
              color: activeDeckName === deck ? '#000' : '#fff',
              transition: 'background 0.3s, color 0.3s',
            }} onClick={() => handleClick(deck)}>
              <span style={{ marginRight: 10, fontWeight: 600, fontSize: '0.95rem' }}>{String(idx + 1).padStart(2, '0')}</span>
              <button
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '0.95rem', textAlign: 'left', padding: 0 }}
                onClick={(e) => { e.stopPropagation(); handleClick(deck); }}
              >
                {deck}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default DeckSidebar; 