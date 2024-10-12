const query = `
SELECT 
   mes,
   sum(soma) soma
FROM (
    SELECT 
      EXTRACT(MONTH FROM d."DataCompra") mes,
      SUM(d."ValorTotal") soma
    FROM "Despesas" d
    WHERE EXTRACT(YEAR FROM d."DataCompra") = 2024
      AND NOT d."IsParcelada"
    GROUP BY mes

    UNION

    SELECT 
      EXTRACT(MONTH FROM p."DataVencimento") mes,
      SUM(COALESCE(p."Valor", 0)) soma
    FROM "Parcelas" p
    WHERE EXTRACT(YEAR FROM p."DataVencimento") = 2024
    GROUP BY mes
) GROUP BY mes;
`;

export default query;
