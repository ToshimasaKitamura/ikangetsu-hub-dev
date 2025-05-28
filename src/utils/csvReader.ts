import Papa from 'papaparse';

interface CardData {
  id: string;
  card_name: string;
  characters: string;
  card_number: string;
  spell_type: string;
  race: string;
  card_text: string;
  illustrator_id: string;
  deck_name: string;
  fc2wiki_link: string;
}

export interface IllustratorData {
  id: string;
  name: string;
}

export function readIrlCsv(): Promise<IllustratorData[]> {
  const csvPath = '/db/IRL.csv';
  return fetch(csvPath)
    .then(response => response.text())
    .then(csvText => {
      const result = Papa.parse<IllustratorData>(csvText, {
        header: false,
        skipEmptyLines: true,
        delimiter: ','
      });
      return result.data
        .slice(1)
        .map((record: any) => {
          const illustrator = {
            id: record[0]?.trim() || '',
            name: record[1]?.trim() || ''
          };
          return illustrator;
        })
        .filter(illustrator => illustrator.id !== '');
    });
}

export function readNclCsv(): Promise<CardData[]> {
  const csvPath = '/db/NCL.csv';
  return fetch(csvPath)
    .then(response => {
      return response.text();
    })
    .then(csvText => {
      const result = Papa.parse<CardData>(csvText, {
        header: false,
        skipEmptyLines: true,
        delimiter: ','
      });
      return result.data
        .slice(1)
        .map((record: any) => {
          const card = {
            id: record[0]?.trim() || '',
            card_name: record[1]?.trim() || '',
            characters: record[2]?.trim() || '',
            card_number: record[3]?.trim() || '',
            spell_type: record[4]?.trim() || '',
            race: record[5]?.trim() || '',
            card_text: record[6]?.trim() || '',
            illustrator_id: record[7]?.trim() || '',
            deck_name: record[8]?.trim() || '',
            fc2wiki_link: record[9]?.trim() || ''
          };
          return card;
        })
        .filter(card => {
          const isValid = card.id !== '';
          return isValid;
        });
    });
}

export function readRclCsv(): Promise<{ id: string; normal_card_id: string }[]> {
  const csvPath = '/db/RCL.csv';
  return fetch(csvPath)
    .then(response => response.text())
    .then(csvText => {
      const result = Papa.parse<{ id: string; normal_card_id: string }>(csvText, {
        header: false,
        skipEmptyLines: true,
        delimiter: ','
      });
      return result.data
        .slice(1)
        .map((record: any) => {
          const rclEntry = {
            id: record[0]?.trim() || '',
            normal_card_id: record[1]?.trim() || ''
          };
          return rclEntry;
        })
        .filter(entry => entry.id !== '');
    });
}

export function readPclCsv(): Promise<{ id: string; card_name: string; characters: string; illustrator_id: string; normal_card_id: string }[]> {
  const csvPath = '/db/PCL.csv';
  return fetch(csvPath)
    .then(response => response.text())
    .then(csvText => {
      const result = Papa.parse<{ id: string; card_name: string; characters: string; illustrator_id: string; normal_card_id: string }>(csvText, {
        header: false,
        skipEmptyLines: true,
        delimiter: ','
      });
      return result.data
        .slice(1)
        .map((record: any) => {
          const pclEntry = {
            id: record[0]?.trim() || '',
            card_name: record[1]?.trim() || '',
            characters: record[2]?.trim() || '',
            illustrator_id: record[3]?.trim() || '',
            normal_card_id: record[4]?.trim() || ''
          };
          return pclEntry;
        })
        .filter(entry => entry.id !== '');
    });
}

export async function readSpcCsv(): Promise<{ id: string; card_name: string; characters: string; illustrator_id: string; normal_card_id: string }[]> {
  const csvPath = '/db/SPC.csv';
  return fetch(csvPath)
    .then(response => response.text())
    .then(csvText => {
      const result = Papa.parse<{ id: string; card_name: string; characters: string; illustrator_id: string; normal_card_id: string }>(csvText, {
        header: false,
        skipEmptyLines: true,
        delimiter: ','
      });
      return result.data
        .slice(1)
        .map((record: any) => {
          const spcEntry = {
            id: record[0]?.trim() || '',
            card_name: record[1]?.trim() || '',
            characters: record[2]?.trim() || '',
            illustrator_id: record[3]?.trim() || '',
            normal_card_id: record[4]?.trim() || ''
          };
          return spcEntry;
        })
        .filter(entry => entry.id !== '');
    });
}

export async function readCpcCsv(): Promise<{ id: string; card_name: string; characters: string; normal_card_id: string; illustrator_id: string }[]> {
  const csvPath = '/db/CPC.csv';
  return fetch(csvPath)
    .then(response => response.text())
    .then(csvText => {
      const result = Papa.parse<{ id: string; card_name: string; characters: string; normal_card_id: string; illustrator_id: string }>(csvText, {
        header: false,
        skipEmptyLines: true,
        delimiter: ','
      });
      return result.data
        .slice(1)
        .map((record: any) => {
          const cpcEntry = {
            id: record[0]?.trim() || '',
            card_name: record[1]?.trim() || '',
            characters: record[2]?.trim() || '',
            normal_card_id: record[3]?.trim() || '',
            illustrator_id: record[4]?.trim() || ''
          };
          return cpcEntry;
        })
        .filter(entry => entry.id !== '');
    });
}

export async function readPfcCsv(): Promise<{ id: string; card_name: string; characters: string; normal_card_id: string; illustrator_id: string }[]> {
  const csvPath = '/db/PFC.csv';
  return fetch(csvPath)
    .then(response => response.text())
    .then(csvText => {
      const result = Papa.parse<{ id: string; card_name: string; characters: string; normal_card_id: string; illustrator_id: string }>(csvText, {
        header: false,
        skipEmptyLines: true,
        delimiter: ','
      });
      return result.data
        .slice(1)
        .map((record: any) => {
          const pfcEntry = {
            id: record[0]?.trim() || '',
            card_name: record[1]?.trim() || '',
            characters: record[2]?.trim() || '',
            normal_card_id: record[3]?.trim() || '',
            illustrator_id: record[4]?.trim() || ''
          };
          return pfcEntry;
        })
        .filter(entry => entry.id !== '');
    });
}

export const readSclCsv = async (): Promise<{ id: string; card_name: string; characters: string; normal_card_id: string }[]> => {
  try {
    const response = await fetch('/data/scl.csv');
    const csvText = await response.text();
    const rows = csvText.split('\n').slice(1); // ヘッダー行をスキップ
    return rows
      .filter(row => row.trim()) // 空行を除外
      .map(row => {
        const [id, card_name, characters, normal_card_id] = row.split(',').map(field => field.trim());
        return { id, card_name, characters, normal_card_id };
      });
  } catch (error) {
    return [];
  }
};

declare module 'papaparse' {
  export function parse(input: string, config?: any): any;
} 