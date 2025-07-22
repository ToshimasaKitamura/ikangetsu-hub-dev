import React from 'react';
import './TabNavigation.css';

interface TabNavigationProps {
  activeTab: 'gallery' | 'search' | 'download' | 'note';
  onTabChange: (tab: 'gallery' | 'search' | 'download' | 'note') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="tab-navigation">
      <button
        className={`tab-button ${activeTab === 'gallery' ? 'active' : ''}`}
        onClick={() => onTabChange('gallery')}
      >
        カードギャラリー
      </button>
      <button
        className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
        onClick={() => onTabChange('search')}
      >
        カード検索
      </button>
      <button
        className={`tab-button ${activeTab === 'download' ? 'active' : ''}`}
        onClick={() => onTabChange('download')}
      >
        デッキダウンロード
      </button>
      <button
        className={`tab-button ${activeTab === 'note' ? 'active' : ''}`}
        onClick={() => onTabChange('note')}
      >
        Note記事
      </button>
    </div>
  );
};

export default TabNavigation; 