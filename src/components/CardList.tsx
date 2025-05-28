import React from 'react';
import './CardList.css';
import CardItem from './CardItem';
import { Card } from '../types';

interface CardListProps {
  cards: Card[];
  onCardSelect: (card: Card) => void;
}

const CardList: React.FC<CardListProps> = ({ cards, onCardSelect }) => {
  return (
    <div className="card-list">
      {cards.map((card, index) => {
        // 通常画像とリメイク画像を切り替え用に渡す
        const normalImage = card.nclImage || card.image;
        const remakeImage = cards.find(c => c.id === card.remakeCardId)?.image || null;
        return (
          <div key={card.id} style={{ marginBottom: '10px', animationDelay: `${index * 0.1}s` }}>
            <CardItem
              card={card}
              normalImage={normalImage}
              remakeImage={remakeImage}
              onClick={() => onCardSelect(card)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CardList; 