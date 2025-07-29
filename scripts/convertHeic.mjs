import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOURNAMENT_DIR = path.join(__dirname, '../public/tournament');

async function convertHeicToJpeg() {
  console.log('🖼️  HEIC画像をJPEGに変換中...');
  
  try {
    // sipsコマンドが使用可能か確認 (macOS)
    try {
      await execAsync('which sips');
    } catch (error) {
      console.log('⚠️  sipsコマンドが見つかりません。macOSでのみHEIC変換が可能です。');
      return;
    }

    // tournamentディレクトリ内のすべてのHEICファイルを検索
    const findHeicFiles = (dir) => {
      const files = [];
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          files.push(...findHeicFiles(fullPath));
        } else if (item.toLowerCase().endsWith('.heic')) {
          files.push(fullPath);
        }
      }
      
      return files;
    };

    const heicFiles = findHeicFiles(TOURNAMENT_DIR);
    
    if (heicFiles.length === 0) {
      console.log('✅ HEIC画像が見つかりませんでした。');
      return;
    }

    console.log(`📁 ${heicFiles.length}個のHEICファイルを変換します...`);

    for (const heicFile of heicFiles) {
      const jpegFile = heicFile.replace(/\.heic$/i, '.jpg');
      
      try {
        // sipsコマンドでHEICをJPEGに変換
        await execAsync(`sips -s format jpeg "${heicFile}" --out "${jpegFile}"`);
        
        // 元のHEICファイルを削除
        fs.unlinkSync(heicFile);
        
        console.log(`✅ 変換完了: ${path.basename(heicFile)} → ${path.basename(jpegFile)}`);
      } catch (error) {
        console.error(`❌ 変換失敗: ${path.basename(heicFile)}`, error.message);
      }
    }

    console.log('🎉 すべてのHEIC画像の変換が完了しました！');
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// スクリプトを実行
convertHeicToJpeg();