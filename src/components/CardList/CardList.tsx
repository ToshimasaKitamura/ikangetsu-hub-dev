import React from 'react';
import './CardList.css';
import CardItem from '../CardItem';
import { Card } from '../../types';

interface CardListProps {
  cards: Card[];
  onCardSelect: (card: Card) => void;
}

// 画面幅でCSSを切り替え
if (typeof window !== 'undefined') {
  if (window.innerWidth <= 767) {
    import('./CardList.sp.css');
  } else {
    import('./CardList.pc.css');
  }
}

// デッキごとにグループ化
const groupCardsByDeck = (cards: Card[]) => {
  const grouped: { [key: string]: Card[] } = {};
  cards.forEach(card => {
    if (!grouped[card.deck]) {
      grouped[card.deck] = [];
    }
    grouped[card.deck].push(card);
  });
  return grouped;
};

const CardList: React.FC<CardListProps> = ({ cards, onCardSelect }) => {
  const groupedCards = groupCardsByDeck(cards);

  return (
    <div className="card-list">
      {Object.entries(groupedCards).map(([deckName, deckCards]) => (
        <React.Fragment key={deckName}>
          <div className="deck-title">{deckName}</div>
          {deckCards.map(card => (
            <div className="card-item" key={card.id}>
              <CardItem
                card={card}
                normalImage={card.nclImage || card.image}
                remakeImage={deckCards.find(c => c.id === card.remakeCardId)?.image || null}
                onClick={() => onCardSelect(card)}
              />
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CardList; 