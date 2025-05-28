import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import fs from 'fs'

// cardsディレクトリをpublicにコピーする関数
function copyCards() {
  const srcCards = path.resolve(__dirname, 'src/assets/cards')
  const publicDir = path.resolve(__dirname, 'public')
  
  if (fs.existsSync(srcCards)) {
    // public/cardsがなければ作成
    const publicCards = path.join(publicDir, 'cards')
    if (!fs.existsSync(publicCards)) {
      fs.mkdirSync(publicCards, { recursive: true })
    }
    
    // cardsディレクトリをコピー
    fs.cpSync(srcCards, publicCards, { recursive: true })
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
