import React, { useState, useEffect } from 'react';
import './CardItem.css';
import { Card } from '../types';

interface CardItemProps {
  card: Card;
  normalImage: string;
  remakeImage: string | null;
  onClick: () => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, normalImage, remakeImage, onClick }) => {
  const [showRemake, setShowRemake] = useState(false);
  const [fade, setFade] = useState<'in' | 'out'>('in');

  // 画像切り替えロジック
  useEffect(() => {
    if (!remakeImage) return;
    let timeout: NodeJS.Timeout;
    let fadeTimeout: NodeJS.Timeout;
    const switchImage = () => {
      setFade('out');
      fadeTimeout = setTimeout(() => {
        setShowRemake((prev) => !prev);
        setFade('in');
      }, 400);
      timeout = setTimeout(switchImage, Math.random() * 5000 + 5000);
    };
    timeout = setTimeout(switchImage, Math.random() * 5000 + 5000);
    return () => {
      clearTimeout(timeout);
      clearTimeout(fadeTimeout);
    };
  }, [remakeImage]);

  // 表示する画像
  const imageUrl = showRemake && remakeImage ? remakeImage : normalImage;

  return (
    <div className="card-item" onClick={onClick}>
      <img
        src={imageUrl}
        alt={card.name}
        className={`fade-${fade}`}
      />
      <div className="card-info">
        <p className="card-name">{card.name}</p>
      </div>
    </div>
  );
};

export default CardItem; 