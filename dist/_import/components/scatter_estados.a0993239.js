import * as Plot from "../../_npm/@observablehq/plot@0.6.17/a96a6bbb.js";
import * as d3 from "../../_npm/d3@7.9.0/66d82917.js";

export function scatterEstados(data, {width = 900} = {}) {
  const estadosRotulados = ["SP", "RJ", "DF", "MG", "BA", "CE", "PE", "AM", "PA"];

  const dados = data.filter((d) =>
    d.sum_radiance > 0 &&
    d.mean_radiance > 0
  );

  const dadosRotulados = dados.filter((d) =>
    estadosRotulados.includes(d.abbrev_state)
  );

  const ceara = dados.filter((d) => d.abbrev_state === "CE");

  return Plot.plot({
    width,
    height: width * 0.3,

    marginTop: 35,
    marginRight: 45,
    marginBottom: 60,
    marginLeft: 75,

    x: {
      type: "log",
      label: "Radiância total, em escala logarítmica →",
      grid: true,
      tickFormat: d3.format(".2s")
    },

    y: {
      label: "↑ Radiância média",
      grid: true,
      zero: true
    },

    color: {
      legend: true,
      label: "Região"
    },

    marks: [
      Plot.dot(dados, {
        x: "sum_radiance",
        y: "mean_radiance",
        fill: "name_region",
        stroke: "currentColor",
        strokeWidth: 0.7,
        r: 6,
        opacity: 0.85,
        title: (d) =>
          `${d.name_state} (${d.abbrev_state})\n` +
          `Região: ${d.name_region}\n` +
          `Radiância média: ${d.mean_radiance.toFixed(3)}\n` +
          `Radiância total: ${d3.format(".3s")(d.sum_radiance)}`
      }),

      // Plot.dot(ceara, {
      //   x: "sum_radiance",
      //   y: "mean_radiance",
      //   r: 11,
      //   fill: "none",
      //   stroke: "currentColor",
      //   strokeWidth: 2
      // }),

      Plot.text(dadosRotulados, {
        x: "sum_radiance",
        y: "mean_radiance",
        text: "abbrev_state",
        dx: 9,
        dy: -8,
        fill: "currentColor",
        fontSize: 12
      })
    ]
  });
}