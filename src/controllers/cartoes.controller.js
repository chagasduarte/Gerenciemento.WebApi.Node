import { CartaoBusiness } from "../business/cartao.business.js";

export const CartaoController = {
    async criar(req, res) {
        try {
            const cartao = req.body;
            const userid = req.userId;
            const response = await CartaoBusiness.criar(cartao, userid)

            res.status(201).json(response);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async listar(req, res) {
        try {
            const userid = req.usuarioId;
            const response = await CartaoBusiness.listar(userid)
            res.status(201).json(response);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
