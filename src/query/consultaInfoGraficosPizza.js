function queryPizza(ano)
{
  return `
    SELECT 
      EXTRACT(MONTH FROM d."DataCompra") Id,
      "TipoDespesa",
      SUM(d."ValorTotal") Saida
    FROM "Despesas" d
    WHERE EXTRACT(YEAR FROM d."DataCompra") = ${ano}
      AND NOT d."IsParcelada"
    GROUP BY Id, "TipoDespesa"

    UNION

    SELECT 
      EXTRACT(MONTH FROM p."DataVencimento") Id,
      d."TipoDespesa",
      SUM(COALESCE(p."Valor", 0)) Saida
    FROM "Parcelas" p
    INNER JOIN "Despesas" d ON d."Id" = p."DespesaId"
    WHERE EXTRACT(YEAR FROM p."DataVencimento") = ${ano}
    GROUP BY Id, d."TipoDespesa"`;
}
export default queryPizza;
