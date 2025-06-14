import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'dotenv/config';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler';
import registerTournamentSocket from './sockets/tournament';
import './jobs/autoTournamentCron';
import './jobs/autoRoundAdvanceCron';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

(global as any).io = io;

registerTournamentSocket(io);

// Make io accessible via request (simple approach)
app.use((req: Request, _res: Response, next: NextFunction) => {
  (req as any).io = io;
  next();
});

app.use(cors());
app.use(express.json());

app.use('/api', routes);

// Global error handler (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
}); 