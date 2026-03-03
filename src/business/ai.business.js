export const AiBusiness = {
    async processMessage(message, base64Image) {
        if (!process.env.DEEPSEEK_API_KEY) {
            throw new Error("Chave de API não configurada no servidor (DEEPSEEK_API_KEY).");
        }

        const messages = [
            {
                role: "system",
                content: `Você é um assistente financeiro inteligente. Sua tarefa é extrair informações da mensagem do usuário e convertê-las em uma transação financeira estruturada.
Sua resposta deve ser estritamente em formato JSON, sem nenhuma outra palavra, saudação ou formatação markdown (sem as tags \`\`\`json).
A estrutura do JSON DEVE conter exatamente estas chaves:
- "tipo" (string): "entrada" se for um recebimento/ganho, ou "saida" se for um gasto/despesa.
- "descricao" (string): Uma breve descrição do que foi a transação (ex: "Almoço Padaria", "Salário Mensal").
- "valor" (number): O valor da transação como número, sempre positivo (ex: 50.50).
- "categoria" (string): A categoria ou subcategoria que mais se adequa (ex: "Alimentação", "Salário", "Transporte"). Tente deduzir de forma lógica.
- "data" (string): A data da transação no formato "YYYY-MM-DD". Se não for mencionada uma data explícita (como "ontem" ou "hoje"), assuma a data atual de onde você deduz que o usuário está, baseando-se no contexto, ou simplesmente não preencha se não houver contexto mas, idealmente, preencha com a data deduzida. Hoje é ${new Date().toISOString().split('T')[0]}.
- "ispaycart" (boolean): OPCIONAL, preencha com true apenas se ficar claro que foi o pagamento da fatura de um cartão de crédito ou alguma compra no cartão. caso seja compra será informado 'compra no cartão 'nubank''. Caso contrário omita ou use false.

Exemplo de saída correta e esperada:
{
  "tipo": "saida",
  "descricao": "Almoço Padaria Central",
  "valor": 45.90,
  "categoria": "Alimentação",
  "data": "${new Date().toISOString().split('T')[0]}"
}`
            }
        ];

        if (base64Image) {
            messages.push({
                role: "user",
                content: [
                    { type: "text", text: message },
                    { type: "image_url", image_url: { url: "data:image/jpeg;base64," + base64Image } }
                ]
            });
        } else {
            messages.push({
                role: "user",
                content: message
            });
        }

        try {
            const response = await fetch("https://api.deepseek.com/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + process.env.DEEPSEEK_API_KEY
                },
                body: JSON.stringify({
                    model: "deepseek-chat", // usaremos o modelo padrão
                    messages: messages,
                    temperature: 0.1, // reduzido para ter consistencia e menos criatividade indesejada
                })
            });

            if (!response.ok) {
                let errorBody;
                try {
                    errorBody = await response.text();
                } catch (e) { }
                throw new Error("Erro na API DeepSeek: " + response.status + " - " + (errorBody || response.statusText));
            }

            const data = await response.json();

            let aiResponseContent = data.choices[0].message.content.trim();

            if (aiResponseContent.startsWith("```json")) {
                aiResponseContent = aiResponseContent.replace(/^```json\n/, "").replace(/\n```$/, "");
            } else if (aiResponseContent.startsWith("```")) {
                aiResponseContent = aiResponseContent.replace(/^```\n/, "").replace(/\n```$/, "");
            }

            const transaction = JSON.parse(aiResponseContent);

            return transaction;
        } catch (error) {
            console.error("Falha ao comunicar com DeepSeek:", error);
            throw error;
        }
    }
};
