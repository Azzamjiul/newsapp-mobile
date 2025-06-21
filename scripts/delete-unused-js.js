const fs = require('fs');
const path = require('path');

const unusedFiles = [
  'App.js',
  'screens/NewsListScreen.js',
  'screens/NewsDetailScreen.js'
];

unusedFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log('Deleted', filePath);
  }
});
