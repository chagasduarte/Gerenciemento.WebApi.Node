function query(ano)
{
  return `
SELECT 
   Id,
   TO_CHAR(TO_DATE(CONCAT(${ano},'-', Id, '-01'), 'YYYY-MM-DD'), 'Mon') as nomeAbrev,
   sum(Saida) Saida,
   sum(Entrada) Entrada,
   sum(Progressao) Progressao
FROM (
    SELECT 
      EXTRACT(MONTH FROM d."DataCompra") Id,
      SUM(d."ValorTotal") Saida,
      0 as Entrada,
      0 as Progressao
    FROM "Despesas" d
    WHERE EXTRACT(YEAR FROM d."DataCompra") = ${ano}
      AND NOT d."IsParcelada"
    GROUP BY Id

    UNION

    SELECT 
      EXTRACT(MONTH FROM p."DataVencimento") Id,
      SUM(COALESCE(p."Valor", 0)) Saida,
      0 as Entrada,
      0 as Progressao 
    FROM "Parcelas" p
    WHERE EXTRACT(YEAR FROM p."DataVencimento") = ${ano}
    GROUP BY Id

    UNION

    SELECT
      EXTRACT(MONTH FROM e."DataDebito") Id,
      0 Saida,
      SUM(COALESCE(e."Valor", 0)) as Entrada,
      0 as Progressao 
    FROM "Entradas" e
    WHERE EXTRACT(YEAR FROM e."DataDebito") = ${ano}
    GROUP BY Id

    UNION

    SELECT
      "Mes" as Id,
      0 Saida,
      0 as Entrada,
      SUM(COALESCE(c."Debito", 0)) as Progressao 
    FROM "Contas" c
    WHERE "Ano" = ${ano}
    GROUP BY "Mes"
) GROUP BY Id;
`
}
export default query;
