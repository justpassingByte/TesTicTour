import { Router } from 'express';

import authRoutes from './auth.routes';
import tournamentRoutes from './tournament.routes';
import templateRoutes from './template.routes';
import participantRoutes from './participant.routes';
import roundRoutes from './round.routes';
import lobbyRoutes from './lobby.routes';
import matchRoutes from './match.routes';
import balanceRoutes from './balance.routes';
// TODO: import other route modules (participant, balance, etc.)

const router = Router();

router.use('/auth', authRoutes);
router.use('/tournaments', tournamentRoutes);
router.use('/tournament-templates', templateRoutes);
router.use('/tournaments', participantRoutes);
router.use('/tournaments', roundRoutes);
router.use('/', lobbyRoutes);
router.use('/', matchRoutes);
router.use('/', balanceRoutes);
// router.use('/participants', participantRoutes);
// router.use('/balance', balanceRoutes);

export default router; 