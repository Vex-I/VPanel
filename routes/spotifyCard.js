import express from 'express';
import { getSpotifyCard } from '../controllers/spotifyCardController.js';

let router = express.Router();

router.get('/spotify-card', getSpotifyCard);

export default router;