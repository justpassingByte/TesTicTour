import { Router } from 'express';
import RoundController from '../controllers/RoundController';
import auth from '../middlewares/auth';

const router = Router();

router.get('/:tournamentId/rounds', RoundController.list);
router.post('/:tournamentId/rounds', auth('admin'), RoundController.create);
router.post('/:roundId/auto-advance', auth('admin'), RoundController.autoAdvance);
router.get('/:roundId/lobbies', RoundController.lobbies);

export default router;
