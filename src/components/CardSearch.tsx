import React, { useState } from 'react';
import { Card } from '../types';
import './CardSearch.css';

interface CardSearchProps {
  cards: Card[];
  onCardSelect: (card: Card) => void;
  illustrators: { id: string; name: string }[];
  pclData: { id: string; card_name: string; characters: string; illustrator_id: string; normal_card_id: string; }[];
  spcData: { id: string; card_name: string; characters: string; normal_card_id: string; }[];
  cpcData: { id: string; card_name: string; characters: string; normal_card_id: string; }[];
  pfcData: { id: string; card_name: string; characters: string; normal_card_id: string; }[];
}

function cardNumberToInt(cardNumber: string): number {
  // 丸数字対応
  const maruMap: { [key: string]: number } = {
    '①': 1, '②': 2, '③': 3, '④': 4, '⑤': 5, '⑥': 6, '⑦': 7, '⑧': 8, '⑨': 9, '⑩': 10, '⑪': 11, '⑫': 12
  };
  if (maruMap[cardNumber.trim()]) return maruMap[cardNumber.trim()];
  // 半角数字
  const num = parseInt(cardNumber.replace(/[^0-9]/g, ''));
  if (!isNaN(num)) return num;
  // 必要なら漢数字も追加
  const kanjiMap: { [key: string]: number } = {
    '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10, '十一': 11, '十二': 12
  };
  if (kanjiMap[cardNumber.trim()]) return kanjiMap[cardNumber.trim()];
  return 999; // 不明な場合は一番後ろ
}

const CardSearch: React.FC<CardSearchProps> = ({ cards, onCardSelect, illustrators, pclData, spcData, cpcData, pfcData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDeck, setSelectedDeck] = useState<string>('all');
  const [selectedNumber, setSelectedNumber] = useState<string>('all');
  const [selectedRace, setSelectedRace] = useState<string>('all');
  const [selectedIllustrator, setSelectedIllustrator] = useState<string>('all');
  const [remakeFilter, setRemakeFilter] = useState<'all' | 'remakeOnly' | 'excludeRemake'>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // デッキの一覧を取得
  const decks = Array.from(new Set([
    ...cards.map(card => card.deck_name),
    'プロモ',
    'スペシャルプロモ',
    'コレクションプリズム',
    'pixivFANBOX'
  ]));
  // 種族の一覧を取得
  const races = Array.from(new Set(cards.map(card => card.race)));
  // イラストレーターの一覧を取得
  const illustratorNames = Array.from(new Set(illustrators.map(ill => ill.name)));

  // 数値の選択肢
  const numbers = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫'];

  // 検索条件をリセット
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedDeck('all');
    setSelectedNumber('all');
    setSelectedRace('all');
    setSelectedIllustrator('all');
    setRemakeFilter('all');
  };

  // フィルタリングされたカード
  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || card.type === selectedType;
    const matchesNumber = selectedNumber === 'all' || card.cardNumber === selectedNumber;
    const matchesRace = selectedRace === 'all' || card.race === selectedRace;
    const matchesIllustrator =
      selectedIllustrator === 'all' ||
      (card.illustratorName && card.illustratorName.trim().toLowerCase() === selectedIllustrator.trim().toLowerCase());

    // Remakeフィルタ
    let matchesRemake = true;
    if (remakeFilter === 'remakeOnly') {
      matchesRemake = !!card.remakeCardId && card.id === card.remakeCardId;
    } else if (remakeFilter === 'excludeRemake') {
      matchesRemake = !(!!card.remakeCardId && card.id === card.remakeCardId);
    }

    // デッキ名でバリエーションも絞り込む
    let matchesDeck = true;
    if (selectedDeck !== 'all') {
      switch (selectedDeck) {
        case 'Remake':
          matchesDeck = !!card.remakeCardId && card.id === card.remakeCardId;
          break;
        case 'プロモ':
          matchesDeck = !!card.promoCardId && card.id === card.promoCardId;
          break;
        case 'スペシャルプロモ':
          matchesDeck = !!card.spcCardId && card.id === card.spcCardId;
          break;
        case 'コレクションプリズム':
          matchesDeck = !!card.cpcCardId && card.id === card.cpcCardId;
          break;
        case 'pixivFANBOX':
          matchesDeck = !!card.pfcCardId && card.id === card.pfcCardId;
          break;
        default:
          // Remakeのみフィルタ時はバリエーション除外しない
          if (remakeFilter === 'remakeOnly') {
            matchesDeck = card.deck_name === selectedDeck;
          } else {
            matchesDeck =
              card.deck_name === selectedDeck &&
              !(
                (card.remakeCardId && card.id === card.remakeCardId) ||
                (card.promoCardId && card.id === card.promoCardId) ||
                (card.spcCardId && card.id === card.spcCardId) ||
                (card.cpcCardId && card.id === card.cpcCardId) ||
                (card.pfcCardId && card.id === card.pfcCardId)
              );
          }
          break;
      }
    }

    return matchesSearch && matchesType && matchesDeck && matchesRemake && matchesNumber && matchesRace && matchesIllustrator;
  });

  // カードを並び替える
  const sortedCards = [...filteredCards].sort((a, b) => {
    // 同じカードの場合は、NCL → Remake → プロモ → スペシャルプロモ → コレクションプリズム → pixivFANBOXの順
    if (a.name === b.name) {
      const getCardOrder = (card: Card) => {
        if (card.remakeCardId) return 1;
        if (card.promoCardId) return 2;
        if (card.spcCardId) return 3;
        if (card.cpcCardId) return 4;
        if (card.pfcCardId) return 5;
        return 0; // NCL
      };
      return getCardOrder(a) - getCardOrder(b);
    }
    // カード番号が異なる場合は、数値順でソート
    const numA = cardNumberToInt(a.cardNumber);
    const numB = cardNumberToInt(b.cardNumber);
    return numA - numB;
  });

  // カードの表示用画像を取得
  const getDisplayImage = (card: Card) => {
    return card.image;
  };

  return (
    <div className="card-search">
      <div className="search-filters">
        <div className="search-row">
          <input
            type="text"
            placeholder="カード名やテキストで検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={resetFilters} className="reset-button">
            検索条件をリセット
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className={`filter-toggle-button ${showFilters ? 'on' : ''}`}
          >
            フィルター検索：{showFilters ? 'ON' : 'OFF'}
          </button>
          <span style={{ marginLeft: '16px', fontWeight: 500, fontSize: '1rem', color: '#fafafa' }}>
            {filteredCards.length}件ヒットしました
          </span>
        </div>
        {showFilters && (
          <div className="filter-row">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="filter-select"
            >
              <option value="all">全てのスペル</option>
              <option value="攻撃スペル">攻撃スペル</option>
              <option value="回避スペル">回避スペル</option>
              <option value="スペルなし">スペルなし</option>
              <option value="特殊能力">特殊能力</option>
            </select>
            <select
              value={selectedDeck}
              onChange={(e) => setSelectedDeck(e.target.value)}
              className="filter-select"
            >
              <option value="all">全てのデッキ</option>
              {decks.map(deck => (
                <option key={deck} value={deck}>{deck}</option>
              ))}
            </select>
            <select
              value={remakeFilter}
              onChange={e => setRemakeFilter(e.target.value as 'all' | 'remakeOnly' | 'excludeRemake')}
              className="filter-select"
            >
              <option value="all">Remake指定なし</option>
              <option value="remakeOnly">Remakeのみ</option>
              <option value="excludeRemake">Remakeを含まない</option>
            </select>
            <select
              value={selectedNumber}
              onChange={(e) => setSelectedNumber(e.target.value)}
              className="filter-select"
            >
              <option value="all">全ての数値</option>
              {numbers.map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <select
              value={selectedRace}
              onChange={(e) => setSelectedRace(e.target.value)}
              className="filter-select"
            >
              <option value="all">全ての種族</option>
              {races.map(race => (
                <option key={race} value={race}>{race}</option>
              ))}
            </select>
            <select
              value={selectedIllustrator}
              onChange={(e) => setSelectedIllustrator(e.target.value)}
              className="filter-select"
            >
              <option value="all">全てのイラストレーター</option>
              {illustratorNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="search-results">
        {sortedCards.map(card => {
          return (
            <div
              key={card.id}
              className="search-card-item"
              onClick={() => {
                const baseCard = cards.find(c => c.id === card.nclCardId) || card;
                // どのバリエーションか判定
                let selected = { ...baseCard };
                if (card.promoCardId && card.id === card.promoCardId) {
                  selected.selectedAdditionalCard = 'promo';
                  selected.isPromoCardVisible = true;
                } else if (card.spcCardId && card.id === card.spcCardId) {
                  selected.selectedAdditionalCard = 'spc';
                  selected.isSpcCardVisible = true;
                } else if (card.cpcCardId && card.id === card.cpcCardId) {
                  selected.selectedAdditionalCard = 'cpc';
                  selected.isCpcCardVisible = true;
                } else if (card.pfcCardId && card.id === card.pfcCardId) {
                  selected.selectedAdditionalCard = 'pfc';
                  selected.isPfcCardVisible = true;
                } else if (card.remakeCardId && card.id === card.remakeCardId) {
                  selected.selectedAdditionalCard = 'remake';
                  selected.isRemakeCardVisible = true;
                } else {
                  selected.selectedAdditionalCard = 'ncl';
                  selected.isPromoCardVisible = false;
                  selected.isSpcCardVisible = false;
                  selected.isCpcCardVisible = false;
                  selected.isPfcCardVisible = false;
                  selected.isRemakeCardVisible = false;
                }
                onCardSelect(selected);
              }}
            >
              <img src={getDisplayImage(card)} alt={card.name} className="search-card-image" />
              <div className="search-card-info">
                <h3>{
                  card.promoCardId && card.id === card.promoCardId ? 
                    pclData.find(promo => promo.id === card.promoCardId)?.card_name || card.name :
                  card.spcCardId && card.id === card.spcCardId ? 
                    spcData.find(spc => spc.id === card.spcCardId)?.card_name || card.name :
                  card.cpcCardId && card.id === card.cpcCardId ? 
                    cpcData.find(cpc => cpc.id === card.cpcCardId)?.card_name || card.name :
                  card.pfcCardId && card.id === card.pfcCardId ? 
                    pfcData.find(pfc => pfc.id === card.pfcCardId)?.card_name || card.name :
                  card.name
                }</h3>
                <span
                  style={{
                    color:
                      card.type === '攻撃スペル' ? '#ff7f7f' :
                      card.type === '回避スペル' ? '#7faaff' :
                      card.type === 'スペルなし' ? '#7fff7f' :
                      card.type === '特殊能力' ? '#ffe066' :
                      undefined
                  }}
                >{card.type}</span><span style={{ marginLeft: '0.7em' }}>{card.race}</span>
                <p>{
                  card.promoCardId && card.id === card.promoCardId ? 'プロモ' :
                  card.spcCardId && card.id === card.spcCardId ? 'スペシャルプロモ' :
                  card.cpcCardId && card.id === card.cpcCardId ? 'コレクションプリズム' :
                  card.pfcCardId && card.id === card.pfcCardId ? 'pixivFANBOX' :
                  card.deck_name
                }</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardSearch; 