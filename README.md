# NewsApp

A React Native Expo app using Expo Router and TypeScript that displays news articles from a backend API.

## Features
- List news articles from `/api/news`
- View details for each article from `/api/news/{id}`

## Getting Started
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the Expo development server:
   ```sh
   npm start
   ```
3. Run on your device:
   - For iOS: `npm run ios`
   - For Android: `npm run android`
   - For Web: `npm run web`

## API
- Backend API base URL: `http://<YOUR_LOCAL_IP>:4000`
- See `news-app.json` for the OpenAPI contract.

## Project Structure
- `app/news/index.tsx`: News list page
- `app/news/[id].tsx`: News detail page

---
Replace placeholder assets and texts as needed.
