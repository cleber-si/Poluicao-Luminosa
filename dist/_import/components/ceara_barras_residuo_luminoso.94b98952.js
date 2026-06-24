import * as Plot from "../../_npm/@observablehq/plot@0.6.17/a96a6bbb.js";
import * as d3 from "../../_npm/d3@7.9.0/66d82917.js";

// Gráfico 3
// Barras dos maiores excessos e déficits luminosos.
// Espera receber o arquivo:
// src/data/ceara_residuo_luminoso_municipios.csv
export function cearaBarrasResiduoLuminoso(data, {width = 900, n = 10} = {}) {
  const excessos = data
    .slice()
    .sort((a, b) => d3.descending(a.residuo_luminoso_log, b.residuo_luminoso_log))
    .slice(0, n);

  const deficits = data
    .slice()
    .sort((a, b) => d3.ascending(a.residuo_luminoso_log, b.residuo_luminoso_log))
    .slice(0, n);

  // Juntamos os dois grupos em uma tabela só.
  // Primeiro os déficits, depois os excessos.
  const dados = deficits
    .concat(excessos)
    .map((d) => ({
      ...d,
      tipo: d.residuo_luminoso_log >= 0 ? "Excesso luminoso" : "Déficit luminoso"
    }));

  return Plot.plot({
    width,
    height: 34 * dados.length + 85,

    marginTop: 30,
    marginRight: 50,
    marginBottom: 50,
    marginLeft: 135,

    style: {
      background: "transparent",
      color: "currentColor",
      fontSize: "13px"
    },

    x: {
      label: "← menos luminoso que o esperado | mais luminoso que o esperado →",
      grid: true
    },

    y: {
      label: null,
      domain: dados.map((d) => d.name_muni)
    },

    color: {
      domain: ["Déficit luminoso", "Excesso luminoso"],
      range: ["#2b83ba", "#d7191c"],
      legend: true,
      label: "Tipo de resíduo"
    },

    marks: [
      Plot.ruleX([0], {stroke: "currentColor", strokeWidth: 1}),

      Plot.barX(dados, {
        y: "name_muni",
        x: "residuo_luminoso_log",
        fill: "tipo",
        title: (d) =>
          `${d.name_muni}\n` +
          `${d.tipo}\n` +
          `Resíduo luminoso: ${d.residuo_luminoso_log.toFixed(3)}\n` +
          `Densidade: ${d.densidade_2022_ibge_hab_km2.toFixed(1)} hab/km²`
      }),

      Plot.text(dados, {
        y: "name_muni",
        x: "residuo_luminoso_log",
        text: (d) => d.residuo_luminoso_log.toFixed(2),
        dx: (d) => d.residuo_luminoso_log >= 0 ? 5 : -5,
        textAnchor: (d) => d.residuo_luminoso_log >= 0 ? "start" : "end",
        fill: "currentColor"
      })
    ]
  });
}
