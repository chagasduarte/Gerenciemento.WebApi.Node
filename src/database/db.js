import  pkg  from 'pg';
const {Pool} = pkg;
const pool = new Pool({
    user: 'default', // seu usuário do PostgreSQL
    host: 'ep-empty-frog-a4t87m7t-pooler.us-east-1.aws.neon.tech',
    database: 'verceldb',
    password: 'iadCKEeo0M9V', // sua senha do PostgreSQL
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // Use isso se estiver em um ambiente de desenvolvimento
    },
});

export default pool;
