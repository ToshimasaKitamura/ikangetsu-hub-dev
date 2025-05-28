import React, { useState, useEffect } from 'react';
import './CardDetail.css';
import { getCardImage } from '../utils/imageLoader';
import { Card } from '../types';

interface CardDetailProps {
  card: Card;
  onClose: () => void;
  pclData: { id: string; card_name: string; characters: string; illustrator_id: string; normal_card_id: string; }[];
  illustrators: { id: string; name: string }[];
  cpcData: { id: string; card_name: string; characters: string; illustrator_id: string; normal_card_id: string; }[];
}

const CardDetail: React.FC<CardDetailProps> = ({ card, onClose, pclData, illustrators, cpcData }) => {
  const [selectedAdditionalCard, setSelectedAdditionalCard] = useState<'ncl' | 'promo' | 'spc' | 'cpc' | 'remake' | 'pfc'>(card.selectedAdditionalCard || 'ncl');
  const [promoCardImage, setPromoCardImage] = useState<string | null>(null);
  const [isPromoCardVisible, setIsPromoCardVisible] = useState<boolean>(!!card.isPromoCardVisible);
  const [spcCardImage, setSpcCardImage] = useState<string | null>(null);
  const [isSpcCardVisible, setIsSpcCardVisible] = useState<boolean>(!!card.isSpcCardVisible);
  const [cpcCardImage, setCpcCardImage] = useState<string | null>(null);
  const [isCpcCardVisible, setIsCpcCardVisible] = useState<boolean>(!!card.isCpcCardVisible);
  const [remakeCardImage, setRemakeCardImage] = useState<string | null>(null);
  const [isRemakeCardVisible, setIsRemakeCardVisible] = useState<boolean>(!!card.isRemakeCardVisible);
  const [pfcCardImage, setPfcCardImage] = useState<string | null>(null);
  const [isPfcCardVisible, setIsPfcCardVisible] = useState<boolean>(!!card.isPfcCardVisible);

  useEffect(() => {
    setSelectedAdditionalCard(card.selectedAdditionalCard || 'ncl');
    setIsPromoCardVisible(!!card.isPromoCardVisible);
    setIsSpcCardVisible(!!card.isSpcCardVisible);
    setIsCpcCardVisible(!!card.isCpcCardVisible);
    setIsRemakeCardVisible(!!card.isRemakeCardVisible);
    setIsPfcCardVisible(!!card.isPfcCardVisible);
  }, [card]);

  useEffect(() => {
    if (card.remakeCardId) {
      getCardImage(card.remakeCardId).then(setRemakeCardImage);
    }
  }, [card.remakeCardId]);

  useEffect(() => {
    if (card.promoCardId) {
      getCardImage(card.promoCardId).then(setPromoCardImage);
    }
  }, [card.promoCardId]);

  useEffect(() => {
    if (card.spcCardId) {
      getCardImage(card.spcCardId).then(setSpcCardImage);
    }
  }, [card.spcCardId]);

  useEffect(() => {
    if (card.cpcCardId) {
      getCardImage(card.cpcCardId).then(setCpcCardImage);
    }
  }, [card.cpcCardId]);

  useEffect(() => {
    if (card.pfcCardId) {
      getCardImage(card.pfcCardId).then(setPfcCardImage);
    }
  }, [card.pfcCardId]);

  useEffect(() => {
    if (isRemakeCardVisible) {
      const imgElement = document.querySelector('.main-image') as HTMLElement;
      if (imgElement) {
        imgElement.classList.remove('bounce');
        void imgElement.offsetWidth; // Trigger reflow
        imgElement.classList.add('bounce');
      }
    }
  }, [isRemakeCardVisible, isPromoCardVisible]);

  const promoCardName = isPromoCardVisible && promoCardImage ? pclData.find(promo => promo.id === card.promoCardId)?.card_name || card.name : card.name;
  const promoIllustratorName = isPromoCardVisible && promoCardImage ? illustrators.find(ill => ill.id === pclData.find(promo => promo.id === card.promoCardId)?.illustrator_id)?.name || card.illustratorName : card.illustratorName;

  const spcCardName = isSpcCardVisible && spcCardImage ? pclData.find(spc => spc.id === card.spcCardId)?.card_name || card.name : card.name;

  const cpcCardName = isCpcCardVisible && cpcCardImage
    ? cpcData.find(cpc => cpc.id === card.cpcCardId)?.card_name || card.name
    : card.name;

  const pfcCardName = isPfcCardVisible && pfcCardImage ? pclData.find(pfc => pfc.id === card.pfcCardId)?.card_name || card.name : card.name;

  return (
    <div className="card-detail">
      <button className="close-button" onClick={onClose}>×</button>
      <div className="main-content">
        <div className="card-content">
          <img className={`main-image ${isRemakeCardVisible || isPromoCardVisible || isSpcCardVisible || isCpcCardVisible || isPfcCardVisible ? 'bounce' : ''}`} 
            src={
              isRemakeCardVisible ? (remakeCardImage || card.image) :
              isPromoCardVisible ? (promoCardImage || card.image) :
              isSpcCardVisible ? (spcCardImage || card.image) :
              isCpcCardVisible ? (cpcCardImage || card.image) :
              isPfcCardVisible ? (pfcCardImage || card.image) :
              card.image
            } 
            alt={card.name} 
          />
          <div className="card-info">
            <h2>
              {isPromoCardVisible ? promoCardName
                : isSpcCardVisible ? spcCardName
                : isCpcCardVisible ? cpcCardName
                : isPfcCardVisible ? pfcCardName
                : card.name}
            </h2>
            <p className="card-type">スペル: {card.type}</p>
            <p className="card-race">種族: {card.race}</p>
            <br />
            <p className="card-description" style={{ whiteSpace: 'pre-wrap' }}>{card.description}</p>
            <br />
            <p className="card-deck">デッキ: {
              isRemakeCardVisible ? `${card.deck_name} Remake` :
              isPromoCardVisible ? 'プロモ' :
              isSpcCardVisible ? 'スペシャルプロモ' :
              isCpcCardVisible ? 'コレクションプリズム' :
              isPfcCardVisible ? 'pixivFANBOX' :
              card.deck_name
            }</p>
            <p className="card-illustrator">イラストレーター: {isPromoCardVisible ? promoIllustratorName : card.illustratorName}</p>
          </div>
        </div>
      </div>
      {(remakeCardImage || promoCardImage || spcCardImage || cpcCardImage || pfcCardImage) && (
        <div className="additional-content">
          <div className="remake-card-thumbnail" onMouseEnter={() => { setIsRemakeCardVisible(false); setIsPromoCardVisible(false); setIsSpcCardVisible(false); setIsCpcCardVisible(false); setIsPfcCardVisible(false); }}>
            <img src={card.nclImage || card.image} alt={`${card.name} 通常`} style={{ width: '100px', height: 'auto' }} />
          </div>
          {remakeCardImage && (
            <div className="remake-card-thumbnail" onMouseEnter={() => { setIsRemakeCardVisible(true); setIsPromoCardVisible(false); setIsSpcCardVisible(false); setIsCpcCardVisible(false); setIsPfcCardVisible(false); }}>
              <img src={remakeCardImage || undefined} alt={`${card.name} リメイク`} style={{ width: '100px', height: 'auto' }} />
            </div>
          )}
          {promoCardImage && (
            <div className="promo-card-thumbnail" onMouseEnter={() => { setIsRemakeCardVisible(false); setIsPromoCardVisible(true); setIsSpcCardVisible(false); setIsCpcCardVisible(false); setIsPfcCardVisible(false); }}>
              <img src={promoCardImage || undefined} alt={`${card.name} プロモ`} style={{ width: '100px', height: 'auto' }} />
            </div>
          )}
          {spcCardImage && (
            <div className="spc-card-thumbnail" onMouseEnter={() => { setIsRemakeCardVisible(false); setIsPromoCardVisible(false); setIsSpcCardVisible(true); setIsCpcCardVisible(false); setIsPfcCardVisible(false); }}>
              <img src={spcCardImage || undefined} alt={`${card.name} SPC`} style={{ width: '100px', height: 'auto' }} />
            </div>
          )}
          {cpcCardImage && (
            <div className="cpc-card-thumbnail" onMouseEnter={() => { setIsRemakeCardVisible(false); setIsPromoCardVisible(false); setIsSpcCardVisible(false); setIsCpcCardVisible(true); setIsPfcCardVisible(false); }}>
              <img src={cpcCardImage || undefined} alt={`${card.name} CPC`} style={{ width: '100px', height: 'auto' }} />
            </div>
          )}
          {pfcCardImage && (
            <div className="pfc-card-thumbnail" onMouseEnter={() => { setIsRemakeCardVisible(false); setIsPromoCardVisible(false); setIsSpcCardVisible(false); setIsCpcCardVisible(false); setIsPfcCardVisible(true); }}>
              <img src={pfcCardImage || undefined} alt={`${card.name} PFC`} style={{ width: '100px', height: 'auto' }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CardDetail; 