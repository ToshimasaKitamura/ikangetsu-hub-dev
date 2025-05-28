import React, { useState, useEffect, useRef } from 'react'
import CardList from './components/CardList'
import CardDetail from './components/CardDetail'
import TabNavigation from './components/TabNavigation'
import CardSearch from './components/CardSearch'
import { readNclCsv, readIrlCsv, readRclCsv, readPclCsv, readSpcCsv, readCpcCsv, readPfcCsv, readSclCsv } from './utils/csvReader'
import { getCardImage } from './utils/imageLoader'
import './App.css'
import { Card } from './types'
import DeckSidebar from './components/DeckSidebar'

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

const App: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([])
  const [searchCards, setSearchCards] = useState<Card[]>([])
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [activeTab, setActiveTab] = useState<'gallery' | 'search'>('gallery')
  const [testImages, setTestImages] = useState<Card[]>([])
  const [rclData, setRclData] = useState<{ id: string; normal_card_id: string }[]>([])
  const [pclData, setPclData] = useState<{ id: string; card_name: string; characters: string; illustrator_id: string; normal_card_id: string }[]>([]);
  const [illustrators, setIllustrators] = useState<{ id: string; name: string }[]>([])
  const [spcData, setSpcData] = useState<{ id: string; card_name: string; characters: string; normal_card_id: string }[]>([])
  const [cpcData, setCpcData] = useState<{ id: string; card_name: string; characters: string; normal_card_id: string }[]>([])
  const [pfcData, setPfcData] = useState<{ id: string; card_name: string; characters: string; normal_card_id: string }[]>([])
  const [sclData, setSclData] = useState<{ id: string; card_name: string; characters: string; normal_card_id: string }[]>([])
  const [activeDeckName, setActiveDeckName] = useState<string>('');
  const deckRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const groupedCards = groupCardsByDeck(cards)

  useEffect(() => {
    const loadCards = async () => {
      try {
        const csvData = await readNclCsv()
        const illustrators = await readIrlCsv()
        const rclEntries = await readRclCsv()
        const pclEntries = await readPclCsv()
        const spcEntries = await readSpcCsv()
        const cpcEntries = await readCpcCsv()
        const pfcEntries = await readPfcCsv()
        const sclEntries = await readSclCsv()
        setPclData(pclEntries)
        setRclData(rclEntries)
        setIllustrators(illustrators)
        setSpcData(spcEntries)
        setCpcData(cpcEntries)
        setPfcData(pfcEntries)
        setSclData(sclEntries)
        
        const cardData: Card[] = []
        const searchCardData: Card[] = []
        for (const card of csvData) {
          if (!card.id) {
            continue
          }
          const imageUrl = await getCardImage(card.id)
          const illustrator = illustrators.find(ill => ill.id === card.illustrator_id)
          const remakeCard = rclEntries.find(entry => entry.normal_card_id === card.id)
          const promoCard = pclEntries.find(entry => entry.normal_card_id === card.id)
          const spcCard = spcEntries.find(entry => entry.normal_card_id === card.id)
          const cpcCard = cpcEntries.find(entry => entry.normal_card_id === card.id)
          const pfcCard = pfcEntries.find(entry => entry.normal_card_id === card.id)
          const sclCard = sclEntries.find(entry => entry.normal_card_id === card.id)
          const newCard: Card = {
            id: card.id,
            name: card.card_name,
            image: imageUrl,
            type: card.spell_type,
            deck: card.deck_name,
            description: card.card_text,
            characters: card.characters,
            cardNumber: card.card_number,
            race: card.race,
            illustratorName: illustrator ? illustrator.name : '不明',
            deck_name: card.deck_name || '',
            remakeCardId: remakeCard ? remakeCard.id : null,
            promoCardId: promoCard ? promoCard.id : null,
            spcCardId: spcCard ? spcCard.id : null,
            cpcCardId: cpcCard ? cpcCard.id : null,
            pclCardId: promoCard ? promoCard.id : null,
            pfcCardId: pfcCard ? pfcCard.id : null,
            rclCardId: remakeCard ? remakeCard.id : null,
            sclCardId: sclCard ? sclCard.id : null,
            nclCardId: card.id,
            nclImage: imageUrl,
          }
          cardData.push(newCard)
          searchCardData.push(newCard)
          if (remakeCard) {
            searchCardData.push({
              ...newCard,
              id: remakeCard.id,
              image: await getCardImage(remakeCard.id),
              remakeCardId: remakeCard.id,
              promoCardId: null,
              spcCardId: null,
              cpcCardId: null,
              pfcCardId: null,
              nclCardId: card.id,
              nclImage: imageUrl,
              illustratorName: newCard.illustratorName,
            })
          }
          if (promoCard) {
            const promoIllustrator = illustrators.find(ill => ill.id === promoCard.illustrator_id);
            const promoImage = await getCardImage(promoCard.id);
            searchCardData.push({
              ...newCard,
              id: promoCard.id,
              name: promoCard.card_name,
              image: promoImage,
              remakeCardId: null,
              promoCardId: promoCard.id,
              spcCardId: null,
              cpcCardId: null,
              pfcCardId: null,
              nclCardId: card.id,
              nclImage: imageUrl,
              illustratorName: promoIllustrator ? promoIllustrator.name : newCard.illustratorName,
            })
          }
          if (spcCard) {
            const spcIllustrator = illustrators.find(ill => ill.id === spcCard.illustrator_id);
            searchCardData.push({
              ...newCard,
              id: spcCard.id,
              name: spcCard.card_name,
              image: await getCardImage(spcCard.id),
              remakeCardId: null,
              promoCardId: null,
              spcCardId: spcCard.id,
              cpcCardId: null,
              pfcCardId: null,
              nclCardId: card.id,
              nclImage: imageUrl,
              illustratorName: spcIllustrator ? spcIllustrator.name : newCard.illustratorName,
            })
          }
          if (cpcCard) {
            const cpcIllustrator = illustrators.find(ill => ill.id === cpcCard.illustrator_id);
            const cpcImage = await getCardImage(cpcCard.id);
            searchCardData.push({
              id: cpcCard.id,
              name: cpcCard.card_name,
              image: cpcImage,
              type: card.spell_type,
              deck: card.deck_name,
              description: card.card_text,
              characters: cpcCard.characters,
              cardNumber: card.card_number,
              race: card.race,
              illustratorName: cpcIllustrator ? cpcIllustrator.name : (illustrator ? illustrator.name : '不明'),
              deck_name: card.deck_name || '',
              nclCardId: card.id,
              remakeCardId: null,
              promoCardId: null,
              spcCardId: null,
              cpcCardId: cpcCard.id,
              pclCardId: null,
              pfcCardId: null,
              rclCardId: null,
              sclCardId: null,
              nclImage: imageUrl,
            });
          }
          if (pfcCard) {
            const pfcIllustrator = illustrators.find(ill => ill.id === pfcCard.illustrator_id);
            searchCardData.push({
              ...newCard,
              id: pfcCard.id,
              name: pfcCard.card_name,
              image: await getCardImage(pfcCard.id),
              remakeCardId: null,
              promoCardId: null,
              spcCardId: null,
              cpcCardId: null,
              pfcCardId: pfcCard.id,
              nclCardId: card.id,
              nclImage: imageUrl,
              illustratorName: pfcIllustrator ? pfcIllustrator.name : newCard.illustratorName,
            })
          }
        }
        
        setCards(cardData)
        setSearchCards(searchCardData)
        setTestImages(cardData)
      } catch (error) {
      }
    }

    loadCards()
  }, [])

  // 状態の変更を監視
  useEffect(() => {
  }, [cards])

  useEffect(() => {
  }, [testImages])

  useEffect(() => {
  }, [selectedCard])

  useEffect(() => {
  }, [groupedCards]);

  useEffect(() => {
  }, [rclData])

  useEffect(() => {
  }, [pclData])

  useEffect(() => {
  }, [spcData])

  useEffect(() => {
  }, [cpcData])

  useEffect(() => {
  }, [pfcData])

  useEffect(() => {
  }, [sclData])

  useEffect(() => {
  }, [selectedCard]);

  // スクロールで現在表示中のデッキ名を判定
  useEffect(() => {
    if (activeTab !== 'gallery') return;
    const handleScroll = () => {
      const center = window.innerHeight / 2;
      let closest = '';
      let minDiff = Infinity;
      Object.entries(deckRefs.current).forEach(([deck, ref]) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const diff = Math.abs(rect.top + rect.height / 2 - center);
          if (diff < minDiff) {
            minDiff = diff;
            closest = deck;
          }
        }
      });
      setActiveDeckName(closest);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab, groupedCards]);

  return (
    <div className="app">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'gallery' ? (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
          <DeckSidebar deckNames={Object.keys(groupedCards)} activeDeckName={activeDeckName} />
          <div style={{ flex: 1, filter: selectedCard ? 'blur(5px)' : 'none', padding: '0 16px' }}>
            {!selectedCard && <h1>東方如何月カードギャラリー</h1>}
            <div>
              {Object.entries(groupedCards).map(([deckName, deckCards]) => (
                <div
                  key={deckName}
                  id={`deck-${deckName}`}
                  ref={el => { deckRefs.current[deckName] = el; }}
                  style={{ marginBottom: '20px' }}
                >
                  <h2>{deckName}</h2>
                  <CardList
                    cards={deckCards}
                    onCardSelect={(card) => setSelectedCard({
                      ...card,
                      illustratorName: card.illustratorName || '不明',
                      deck_name: card.deck_name || ''
                    })}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <CardSearch
          cards={searchCards}
          illustrators={illustrators}
          pclData={pclData}
          spcData={spcData}
          cpcData={cpcData.map(cpc => ({ ...cpc, illustrator_id: '' }))}
          pfcData={pfcData}
          onCardSelect={(card) => setSelectedCard({
            ...card,
            illustratorName: card.illustratorName || '不明',
            deck_name: card.deck_name || ''
          })}
        />
      )}
      {selectedCard && (
        <CardDetail
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          pclData={pclData}
          illustrators={illustrators}
          cpcData={cpcData.map(cpc => ({ ...cpc, illustrator_id: '' }))}
        />
      )}
    </div>
  )
}

export default App
