export async function getCardImage(id: string): Promise<string> {
  // カードIDから画像パスを生成
  let folderPrefix = '0xxx'; // デフォルトは0xxx
  if (id.startsWith('1')) {
    folderPrefix = '1xxx';
  } else if (id.startsWith('2')) {
    folderPrefix = '2xxx';
  } else if (id.startsWith('3')) {
    folderPrefix = '3xxx';
  } else if (id.startsWith('4')) {
    folderPrefix = '4xxx';
  } else if (id.startsWith('5')) {
    folderPrefix = '5xxx';
  }
  const imagePath = import.meta.env.BASE_URL + `cards/${folderPrefix}/${id}.webp`;
  
  // 画像パスを直接返す（存在確認はしない）
  return imagePath;
}

export async function getDeckImage(deckId: string): Promise<string> {
  // デッキIDから画像パスを生成
  const imagePath = import.meta.env.BASE_URL + `decks/${deckId}.jpg`;
  return imagePath;
}

export async function downloadImageAsPNG(imageUrl: string, filename: string): Promise<void> {
  try {
    // Fetch the WebP image
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Create an image element
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    
    // Create a canvas to convert WebP to PNG
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    
    // Draw the image on canvas
    ctx.drawImage(img, 0, 0);
    
    // Convert to PNG and download
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to convert to PNG');
      }
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename.replace('.webp', '.png');
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(url);
      URL.revokeObjectURL(img.src);
    }, 'image/png');
  } catch (error) {
    console.error('Error downloading image as PNG:', error);
    throw error;
  }
}   