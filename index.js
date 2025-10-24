import express from 'express';
import cors from 'cors'; // Importar o cors
import dashboard from './src/routes/dashboard.routes.js';
import transacaoRouter from './src/routes/transacao.routes.js';
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
app.use('/dashboard', dashboard);
app.use('/transacoes', transacaoRouter);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send(home);
});
