import { ObjetivosBusiness } from "../business/objetivos.business.js";

export const ObjetivosController = {
    async criar(req, res) {
        try {
            const cartao = req.body;
            const userid = req.usuarioId;
            const response = await ObjetivosBusiness.criar(cartao, userid)

            res.status(201).json(response);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async listar(req, res) {
        try {
            const userid = req.usuarioId;
            const response = await ObjetivosBusiness.listar(userid)
            res.status(201).json(response);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
