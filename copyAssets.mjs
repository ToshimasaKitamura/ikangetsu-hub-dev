import fs from 'fs-extra';
import path from 'path';

async function copyAssets() {
  // カード画像のコピー
  const sourceDir = path.join(process.cwd(), 'src/assets/cards');
  const destDir = path.join(process.cwd(), 'public/cards');

  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
  }
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  try {
    await fs.copy(sourceDir, destDir);
    console.log('Card assets copied successfully!');
  } catch (err) {
    console.error('Error copying card assets:', err);
  }

  // 大会画像のコピー（public/tournament から dist/tournament へ）
  const tournamentSourceDir = path.join(process.cwd(), 'public/tournament');
  const tournamentDestDir = path.join(process.cwd(), 'dist/tournament');

  if (fs.existsSync(tournamentSourceDir)) {
    try {
      await fs.copy(tournamentSourceDir, tournamentDestDir);
      console.log('Tournament assets copied successfully!');
    } catch (err) {
      console.error('Error copying tournament assets:', err);
    }
  }
}

copyAssets();