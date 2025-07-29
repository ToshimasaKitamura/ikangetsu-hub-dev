export interface Card {
  id: string;
  name: string;
  image: string;
  type: string;
  deck: string;
  description: string;
  characters: string;
  cardNumber: string;
  race: string;
  illustratorName: string;
  deck_id: string;
  deck_name: string;
  remakeCardId: string | null;
  promoCardId: string | null;
  spcCardId: string | null;
  cpcCardId: string | null;
  pclCardId: string | null;
  pfcCardId: string | null;
  rclCardId: string | null;
  sclCardId: string | null;
  nclCardId: string;
  isPromoCardVisible?: boolean;
  isSpcCardVisible?: boolean;
  isCpcCardVisible?: boolean;
  isRemakeCardVisible?: boolean;
  isPfcCardVisible?: boolean;
  selectedAdditionalCard?: 'ncl' | 'promo' | 'spc' | 'cpc' | 'remake' | 'pfc';
  nclImage?: string | null;
}

export interface SpcCard {
  id: string;
  card_name: string;
  characters: string;
  normal_card_id: string;
  illustrator_id: string;
}

export interface CpcCard {
  id: string;
  card_name: string;
  characters: string;
  normal_card_id: string;
  illustrator_id: string;
}

export interface PfcCard {
  id: string;
  card_name: string;
  characters: string;
  normal_card_id: string;
  illustrator_id: string;
} 