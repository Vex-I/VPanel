import express from 'express';
import { generateReadToken, invalidateReadToken} from '../controllers/authController.js'

const router = express.Router();


/**
 * @swagger
 * /auth/token/:
 *   get:
 *     summary: Generate a long-lived read token.
 *     tags:
 *       - Authentication required
 *     parameters:
 *       - in: header
 *         name: adminToken
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT admin token 
 *     responses:
 *       200:
 *         description: Generated token
 *       500:
 *         description: Error generating token
 */
router.get('/token', generateReadToken);


/**
 * @swagger
 * /auth/token/:
 *   delete:
 *     summary: Invalidate a read token.
 *     tags:
 *       - Authentication required
 *     parameters:
 *       - in: header
 *         name: adminToken
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT admin token 
 *       - in: header
 *         name: readToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The read token
 *     responses:
 *       200:
 *         description: Successfully invalidated token
 *       500:
 *         description: Error invalidating token
 */
router.delete('/token', invalidateReadToken);

export default router;
