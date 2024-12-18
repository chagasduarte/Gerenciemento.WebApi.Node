import pool from '../database/db.js';

// Busca todos o meses
export const getAllLogs = async (req, res) => {
    const {ano} = req.params
    try {
        const result = await pool.query('SELECT * FROM log_mensal where ano = $1', [ano]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar logs');
    }
};

export const postLog = async (req, res) => {
    const {mes, abrevmes, nomemes, valorsaldo, percentgasto, ano} = req.body;

    if(!mes || !abrevmes || !nomemes || !valorsaldo || !percentgasto || !ano){
      res.status(500).send("Todos os campos devem estar preenchidos");
    }

    try {
       const result = await pool.query(`INSERT INTO 
                                        log_mensal (mes, abrevmes, nomemes, valorsaldo, percentgasto, ano)
                                        VALUES ($1, $2, $3, $4, $5, $6)
                                        ON CONFLICT (mes, ano) 
                                        DO UPDATE 
                                        SET 
                                            abrevmes = EXCLUDED.abrevmes,
                                            nomemes = EXCLUDED.nomemes,
                                            valorsaldo = EXCLUDED.valorsaldo,
                                            percentgasto = EXCLUDED.percentgasto;`, [mes, abrevmes, nomemes, valorsaldo, percentgasto, ano]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Não foi possível adicionar log");
    }
}