import express from 'express';
import cors from 'cors'; // Importar o cors
import contaRoutes from './src/routes/contaRoutes.js';
import despesaRoutes from './src/routes/despesaRoutes.js';
import entradaRoutes from './src/routes/entradaRoutes.js';
import parcelaRoutes from './src/routes/pacelaRoutes.js';
import graficoRoutes from './src/routes/graficoRoutes.js';
import logMensalRoutes from './src/routes/logMensalRoutes.js';
import objetivosRoutes from './src/routes/objetivoRoutes.js';

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
app.use('/Contas', contaRoutes);
app.use('/Despesas', despesaRoutes);
app.use('/Entradas', entradaRoutes);
app.use('/Parcelas', parcelaRoutes);
app.use('/Graficos', graficoRoutes);
app.use('/Logs', logMensalRoutes);
app.use('/Objetivos', objetivosRoutes);
// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send(`
        <h1>Faz é tempo que deu certo!!</h1>    
    `);
});
