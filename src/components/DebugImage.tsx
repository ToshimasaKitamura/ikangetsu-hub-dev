import React, { useState, useEffect } from 'react';
import './DebugImage.css';

const DebugImage: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    // 0001.pngを表示
    setImageUrl('/cards/0xxx/0001.png');
  }, []);

  return (
    <div className="debug-image">
      <h2>デバッグ用画像表示</h2>
      {imageUrl ? (
        <div className="image-container">
          <img src={imageUrl} alt="0001.png" />
          <p>画像パス: {imageUrl}</p>
        </div>
      ) : (
        <p>画像を読み込み中...</p>
      )}
    </div>
  );
};

export default DebugImage; 