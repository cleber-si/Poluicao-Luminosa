import * as Plot from "../../_npm/@observablehq/plot@0.6.17/a96a6bbb.js";
import * as d3 from "../../_npm/d3@7.9.0/66d82917.js";

// Gráfico 1
// Ranking dos municípios do Ceará por radiância total.
// Espera receber o arquivo:
// src/data/ceara_residuo_luminoso_municipios.csv
export function cearaRankingRadianciaTotal(data, {width = 900, n = 15} = {}) {
  // Fazemos uma cópia com .slice() para não modificar a tabela original.
  const ranking = data
    .slice()
    .sort((a, b) => d3.descending(a.sum_radiance, b.sum_radiance))
    .slice(0, n);

  return Plot.plot({
    width,
    height: 38 * ranking.length + 80,

    marginTop: 30,
    marginRight: 90,
    marginBottom: 50,
    marginLeft: 135,

    style: {
      background: "transparent",
      color: "currentColor",
      fontSize: "13px"
    },

    x: {
      label: "Radiância total →",
      grid: true,
      tickFormat: d3.format(".2s")
    },

    y: {
      label: null,
      domain: ranking.map((d) => d.name_muni)
    },

    marks: [
      Plot.barX(ranking, {
        y: "name_muni",
        x: "sum_radiance",
        fill: "#f59e0b",
        title: (d) =>
          `${d.name_muni}\n` +
          `Radiância total: ${d3.format(".3s")(d.sum_radiance)}\n` +
          `Participação no Ceará: ${d.share_radiancia_total_ce_pct.toFixed(2)}%`
      }),

      Plot.text(ranking, {
        y: "name_muni",
        x: "sum_radiance",
        text: (d) => d3.format(".2s")(d.sum_radiance),
        dx: 6,
        fill: "currentColor",
        textAnchor: "start"
      })
    ]
  });
}
