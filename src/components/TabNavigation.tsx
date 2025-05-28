import React from 'react';
import './TabNavigation.css';

interface TabNavigationProps {
  activeTab: 'gallery' | 'search';
  onTabChange: (tab: 'gallery' | 'search') => void;
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
    </div>
  );
};

export default TabNavigation; 