import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Render'da Web Service sifatida uxlamasligi uchun cron-job.org route
app.get('/ping', (req, res) => {
  res.status(200).send('Frontend is alive!');
});

// React app build'langan fayllarini ulash
app.use(express.static(join(__dirname, 'dist')));

// Boshqa har qanday noma'lum route'lar react routerga tushishi uchun
app.use((req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Frontend server runs on port \${PORT}`);
});
