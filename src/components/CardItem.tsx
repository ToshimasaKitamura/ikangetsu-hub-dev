import React, { useState, useEffect } from 'react';
import './CardItem.css';
import { Card } from '../types';

interface CardItemProps {
  card: Card;
  normalImage: string;
  remakeImage: string | null;
  showRemake?: boolean;
  onClick: () => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, normalImage, remakeImage, showRemake: externalShowRemake, onClick }) => {
  const [internalShowRemake, setInternalShowRemake] = useState(false);
  const [fade, setFade] = useState<'in' | 'out'>('in');

  // 外部制御がある場合はそれを使用、ない場合は内部制御
  const showRemake = externalShowRemake !== undefined ? externalShowRemake : internalShowRemake;

  // 画像切り替えロジック（外部制御がない場合のみ）
  useEffect(() => {
    if (!remakeImage || externalShowRemake !== undefined) return;
    let timeout: NodeJS.Timeout;
    let fadeTimeout: NodeJS.Timeout;
    const switchImage = () => {
      setFade('out');
      fadeTimeout = setTimeout(() => {
        setInternalShowRemake((prev) => !prev);
        setFade('in');
      }, 400);
      timeout = setTimeout(switchImage, Math.random() * 5000 + 5000);
    };
    timeout = setTimeout(switchImage, Math.random() * 5000 + 5000);
    return () => {
      clearTimeout(timeout);
      clearTimeout(fadeTimeout);
    };
  }, [remakeImage, externalShowRemake]);

  // 表示する画像
  const imageUrl = showRemake && remakeImage ? remakeImage : normalImage;

  return (
    <div className="card-item" onClick={onClick}>
      <img
        src={imageUrl}
        alt={card.name}
        className={`fade-${fade}`}
      />
      {/* <div className="card-info">
        <p className="card-name">{card.name}</p>
      </div> */}
    </div>
  );
};

export default CardItem; 