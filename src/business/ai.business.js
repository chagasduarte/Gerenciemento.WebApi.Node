import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

function isValidTransaction(obj) {
    if (!obj || typeof obj !== "object") return false;

    const allowedKeys = new Set(["tipo", "descricao", "valor", "categoria", "data", "ispaycart"]);
    for (const k of Object.keys(obj)) if (!allowedKeys.has(k)) return false;

    if (obj.tipo !== "entrada" && obj.tipo !== "saida") return false;
    if (typeof obj.descricao !== "string" || !obj.descricao.trim()) return false;
    if (typeof obj.categoria !== "string" || !obj.categoria.trim()) return false;

    // valor: number positivo
    if (typeof obj.valor !== "number" || !Number.isFinite(obj.valor) || obj.valor <= 0) return false;

    // data: YYYY-MM-DD (pode aceitar vazio/ausente se você quiser — aqui eu exijo string)
    if (typeof obj.data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(obj.data)) return false;

    // ispaycart opcional
    if (obj.ispaycart !== undefined && typeof obj.ispaycart !== "boolean") return false;

    return true;
}

async function runCompletion({ messages, model }) {
    return groq.chat.completions.create({
        model,
        messages,
        temperature: 0.1,
        // JSON mode: garante JSON sintaticamente válido (ainda precisa validar esquema)
        response_format: { type: "json_object" },
    });
}

export const AiBusiness = {
    async processMessage(message, base64Image) {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY não definida nas variáveis de ambiente.");
        }

        // Modelo padrão (texto). Você pode trocar por deepseek-r1-distill-llama-70b se preferir.
        const TEXT_MODEL = process.env.AI_TEXT_MODEL || "openai/gpt-oss-20b"; // :contentReference[oaicite:3]{index=3}

        // Se quiser suportar imagem, use um modelo vision da Groq e configure em env:
        // AI_VISION_MODEL=meta-llama/llama-4-scout-17b-16e-instruct (exemplo)
        const VISION_MODEL = process.env.AI_VISION_MODEL;

        const systemPrompt = `
Você é um assistente financeiro inteligente. Extraia informações da mensagem do usuário e converta em uma transação financeira estruturada.
Responda ESTRITAMENTE em JSON (apenas JSON, sem markdown), com exatamente estas chaves:
- "tipo": "entrada" ou "saida"
- "descricao": string
- "valor": number (positivo)
- "categoria": string
- "data": "YYYY-MM-DD" (se não houver data explícita, assuma hoje: ${todayISO()})
- "ispaycart": boolean (opcional; true apenas se for pagamento/compra no cartão)
`.trim();

        const messages = [{ role: "system", content: systemPrompt }];

        // ⚠️ Imagens: só envie se você tiver configurado um modelo vision compatível
        if (base64Image) {
            if (!VISION_MODEL) {
                throw new Error(
                    "base64Image foi enviado, mas AI_VISION_MODEL não está configurado. " +
                    "A Groq só aceita imagens em modelos vision específicos."
                );
            }

            messages.push({
                role: "user",
                content: [
                    { type: "text", text: message },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
                ],
            });
        } else {
            messages.push({ role: "user", content: message });
        }

        const modelToUse = base64Image ? VISION_MODEL : TEXT_MODEL;

        try {
            // 1ª tentativa
            const completion1 = await runCompletion({ messages, model: modelToUse });
            const content1 = completion1.choices?.[0]?.message?.content?.trim() || "{}";

            let parsed;
            try {
                parsed = JSON.parse(content1);
            } catch {
                parsed = null;
            }

            // Valida estrutura mínima
            if (isValidTransaction(parsed)) return parsed;

            // 2ª tentativa (fallback): pede correção do JSON
            const retryMessages = [
                ...messages,
                {
                    role: "assistant",
                    content: content1,
                },
                {
                    role: "user",
                    content:
                        "Seu JSON está inválido para o esquema exigido. " +
                        "Retorne NOVAMENTE apenas JSON com as chaves: tipo, descricao, valor, categoria, data e (opcional) ispaycart. " +
                        "Sem texto extra.",
                },
            ];

            const completion2 = await runCompletion({ messages: retryMessages, model: modelToUse });
            const content2 = completion2.choices?.[0]?.message?.content?.trim() || "{}";

            const parsed2 = JSON.parse(content2);
            if (!isValidTransaction(parsed2)) {
                throw new Error("A IA retornou JSON, mas fora do esquema esperado.");
            }

            return parsed2;
        } catch (error) {
            console.error("Falha ao comunicar com Groq:", error);
            throw error;
        }
    },
};