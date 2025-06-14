import { Router } from 'express';
import BalanceController from '../controllers/BalanceController';
import auth from '../middlewares/auth';

const router = Router();

router.post('/balance/deposit', auth('user'), BalanceController.deposit);
router.get('/balance', auth('user'), BalanceController.getBalance);
router.get('/transactions', auth('user'), BalanceController.getTransactions);

export default router; 