import React from 'react';

interface DeckSidebarProps {
  deckNames: string[];
  activeDeckName?: string;
}

const DeckSidebar: React.FC<DeckSidebarProps> = ({ deckNames, activeDeckName }) => {
  const handleClick = (deckName: string) => {
    const el = document.getElementById(`deck-${deckName}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <div style={{
      position: 'sticky',
      top: 20,
      left: 0,
      width: 320,
      background: 'rgba(30,30,30,0.3)',
      color: '#fff',
      padding: '16px 12px',
      height: 'auto',
      maxHeight: '92vh',
      overflowY: 'auto',
      borderRadius: 12,
      border: '1.5px solid rgba(255,255,255,0.15)',
      backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      fontSize: '0.95rem',
      textAlign: 'left',
      borderRight: '2.5px solid #fff',
      boxSizing: 'border-box',
    }}>
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
            transition: 'background 0.3s ease-in-out, color 0.3s ease-in-out',
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
  );
};

export default DeckSidebar; 