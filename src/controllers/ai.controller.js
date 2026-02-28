import { AiBusiness } from "../business/ai.business.js";

export const AiController = {
    async processMessage(req, res) {
        try {
            const { message, base64Image } = req.body;

            if (!message) {
                return res.status(400).json({ erro: "A mensagem é obrigatória." });
            }

            // We process the message through Business layer
            const response = await AiBusiness.processMessage(message, base64Image);

            res.status(200).json(response);
        } catch (error) {
            console.error("Erro no processamento da IA:", error);
            res.status(500).json({ erro: error.message || "Erro interno ao processar a mensagem com a IA." });
        }
    }
};
