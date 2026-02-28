import express from 'express';
import cors from 'cors'; // Importar o cors
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dashboardRouter from './src/routes/dashboard.routes.js';
import transacaoRouter from './src/routes/transacao.routes.js';
import userRouter from './src/routes/user.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import cartaoRoutes from './src/routes/cartao.router.js';
import { autentication } from './src/middlewares/autentication.js';
import categoriaRoutes from "./src/routes/categoria.routes.js";
import subcategoriaRoutes from "./src/routes/subcategoria.routes.js";
import planejamentoRoutes from "./src/routes/planejamento.routes.js";
import objetivosRoutes from "./src/routes/objetivos.routes.js";
import aiRoutes from './src/routes/ai.routes.js';
import home from './pages/home.js';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Gerenciamento API',
            version: '1.0.0',
            description: 'API para gerenciamento financeiro pessoal',
        },
        servers: [
            {
                url: 'https://novasapi.vercel.app',
                description: 'Servidor de Produção (Principal)',
            },
            {
                url: 'http://localhost:3000',
                description: 'Servidor Local (Desenvolvimento)',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js', './index.js'], // Caminhos onde estão as anotações do Swagger
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

import path from 'path';
import { fileURLToPath } from 'url';

// Correção do __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 3000;

const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:3000',
    'https://gerenciamento-one.vercel.app',
    'https://novasapi.vercel.app'
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
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});

// Forçar Content-Type como HTML para o Swagger na Vercel
app.use('/api-docs', (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    next();
}, swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    customCssUrl: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
    customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js'
    ],
    swaggerOptions: {
        url: '/api-docs.json', // URL para o JSON do swagger
    },
    explorer: true
}));
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Usar as rotas
app.use('/auth', authRoutes);
app.use('/dashboard', await autentication, dashboardRouter);
app.use('/transacoes', await autentication, transacaoRouter);
app.use('/cartao', await autentication, cartaoRoutes);
app.use('/user', userRouter);
app.use("/categorias", categoriaRoutes);
app.use("/subcategorias", subcategoriaRoutes);
app.use("/planejamento", await autentication, planejamentoRoutes);
app.use("/objetivos", await autentication, objetivosRoutes);
app.use("/ai", await autentication, aiRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send(home);
});
