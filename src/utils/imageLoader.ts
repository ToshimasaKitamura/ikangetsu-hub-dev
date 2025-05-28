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
  const imagePath = `/cards/${folderPrefix}/${id}.png`;
  
  // 画像パスを直接返す（存在確認はしない）
  return imagePath;
}   