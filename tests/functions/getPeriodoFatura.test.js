import { getPeriodoFatura } from "../../src/functions/getPeriodoFatura.function";

describe("getPeriodoFatura", () => {

  test("deve calcular período quando diaFatura = 1 e não é virada de ano", () => {
    const result = getPeriodoFatura(1, 5, 2024);
    expect(result).toEqual({
      inicio: "2024-04-01",
      fim: "2024-04-30"
    });
  });

  test("deve calcular período quando diaFatura = 1 e é virada de ano (janeiro)", () => {
    const result = getPeriodoFatura(1, 1, 2024);
    expect(result).toEqual({
      inicio: "2023-12-01",
      fim: "2023-12-31"
    });
  });

  test("deve calcular período quando diaFatura > 1", () => {
    const result = getPeriodoFatura(10, 5, 2024);
    expect(result).toEqual({
      inicio: "2024-04-10",
      fim: "2024-05-09"
    });
  });

  test("deve calcular período quando diaFatura > 1 e virada de ano (janeiro)", () => {
    const result = getPeriodoFatura(15, 1, 2024);
    expect(result).toEqual({
      inicio: "2023-12-15",
      fim: "2024-01-14"
    });
  });

  test("deve lidar com meses de 30 e 31 dias corretamente", () => {
    const result = getPeriodoFatura(5, 7, 2024); // Julho (31 dias), mês anterior Junho (30 dias)
    expect(result).toEqual({
      inicio: "2024-06-05",
      fim: "2024-07-04"
    });
  });

  test("deve lidar com fevereiro corretamente (ano não bissexto)", () => {
    const result = getPeriodoFatura(20, 3, 2023); // Março → Fevereiro (28 dias)
    expect(result).toEqual({
      inicio: "2023-02-20",
      fim: "2023-03-19"
    });
  });

  test("deve lidar com fevereiro corretamente (ano bissexto)", () => {
    const result = getPeriodoFatura(20, 3, 2024); // Março → Fevereiro (29 dias)
    expect(result).toEqual({
      inicio: "2024-02-20",
      fim: "2024-03-19"
    });
  });

  test("diaFatura deve ser preenchido com zero à esquerda quando necessário", () => {
    const result = getPeriodoFatura(9, 6, 2024);
    expect(result).toEqual({
      inicio: "2024-05-09",
      fim: "2024-06-08"
    });
  });

});
