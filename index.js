import express from 'express';
import cors from 'cors'; // Importar o cors
import dashboardRouter from './src/routes/dashboard.routes.js';
import transacaoRouter from './src/routes/transacao.routes.js';
import userRouter from './src/routes/user.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import { autentication } from './src/middlewares/autentication.js';

import home from './pages/home.js';
const app = express();
const PORT = 3000;

const allowedOrigins = [
    'http://localhost:4200',
    'https://gerenciamento-one.vercel.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir origens que estão na lista ou se a origem não estiver definida (solicitações de aplicativos de back-end)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    credentials: true, // Permitir cookies
};

app.use(cors(corsOptions));
app.use(express.json());

// Usar as rotas
app.use('/auth', authRoutes);
app.use('/dashboard', autentication, dashboardRouter);
app.use('/transacoes', autentication, transacaoRouter);
app.use('/user', userRouter);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send(home);
});
