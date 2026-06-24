import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function radianciaPorRegiao(data, {width = 900} = {}) {
  const totalBrasil = d3.sum(data, (d) => d.sum_radiance);

  const regioes = Array.from(
    d3.rollup(
      data,
      (grupo) => d3.sum(grupo, (d) => d.sum_radiance),
      (d) => d.name_region
    ),
    ([regiao, total]) => ({
      regiao,
      total,
      participacao: 100 * total / totalBrasil
    })
  ).sort((a, b) => d3.descending(a.participacao, b.participacao));

  return Plot.plot({
    width,
    height: 320,

    marginTop: 25,
    marginRight: 80,
    marginBottom: 50,
    marginLeft: 110,

    x: {
      label: "Participação na radiância total do Brasil (%) →",
      grid: true
    },

    y: {
      label: null,
      domain: regioes.map((d) => d.regiao)
    },

    marks: [
      Plot.barX(regioes, {
        y: "regiao",
        x: "participacao",
        fill: "regiao",
        title: (d) =>
          `${d.regiao}\n` +
          `Participação: ${d.participacao.toFixed(1)}%\n` +
          `Radiância total: ${d3.format(".3s")(d.total)}`
      }),

      Plot.text(regioes, {
        y: "regiao",
        x: "participacao",
        text: (d) => `${d.participacao.toFixed(1)}%`,
        dx: 6,
        fill: "currentColor",
        textAnchor: "start"
      })
    ]
  });
}