import * as Plot from "../../_npm/@observablehq/plot@0.6.17/a96a6bbb.js";
import * as d3 from "../../_npm/d3@7.9.0/66d82917.js";

export function rankingRadianciaTotal(data, {width = 900, n = 12} = {}) {
  const ranking = data
    .slice()
    .sort((a, b) => d3.descending(a.sum_radiance, b.sum_radiance))
    .slice(0, n);

  return Plot.plot({
    width,
    height: 36 * ranking.length + 70,

    marginTop: 25,
    marginRight: 80,
    marginBottom: 50,
    marginLeft: 70,

    x: {
      label: "Radiância total →",
      grid: true,
      tickFormat: d3.format(".2s")
    },

    y: {
      label: null,
      domain: ranking.map((d) => d.abbrev_state)
    },

    color: {
      legend: true,
      label: "Região"
    },

    marks: [
      Plot.barX(ranking, {
        y: "abbrev_state",
        x: "sum_radiance",
        fill: "name_region",
        title: (d) =>
          `${d.name_state} (${d.abbrev_state})\n` +
          `Região: ${d.name_region}\n` +
          `Radiância total: ${d3.format(".3s")(d.sum_radiance)}`
      }),

      Plot.text(ranking, {
        y: "abbrev_state",
        x: "sum_radiance",
        text: (d) => d3.format(".2s")(d.sum_radiance),
        dx: 6,
        fill: "currentColor",
        textAnchor: "start"
      })
    ]
  });
}