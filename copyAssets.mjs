import fs from 'fs-extra';
import path from 'path';

const sourceDir = path.join(process.cwd(), 'src/assets/cards');
const destDir = path.join(process.cwd(), 'public/cards');

fs.copy(sourceDir, destDir, err => {
  if (err) {
    console.error('Error copying assets:', err);
  } else {
    console.log('Assets copied successfully!');
  }
});