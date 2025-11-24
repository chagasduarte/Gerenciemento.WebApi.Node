import { CartaoBusiness } from "../business/cartao.business.js";

export const CartaoController = {
    async criar(req, res) {
        try {
            const cartao = req.body;
            const userid = req.userId;
            const response = CartaoBusiness.criar(cartao, userid)

            res.status(201).json(response);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async listar(req, res) {
        try {
            const userid = req.userId;
            const response = CartaoBusiness.listar(userid)
            res.status(201).json(response);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
