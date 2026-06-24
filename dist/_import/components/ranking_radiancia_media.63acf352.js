import * as Plot from "../../_npm/@observablehq/plot@0.6.17/a96a6bbb.js";

export function rankingRadianciaMedia(data, {width = 900, n = 12} = {}) {
  const ranking = data
    .slice()
    .sort((a, b) => b.mean_radiance - a.mean_radiance)
    .slice(0, n);

  return Plot.plot({
    width,
    height: 36 * ranking.length + 70,

    marginTop: 25,
    marginRight: 70,
    marginBottom: 50,
    marginLeft: 70,

    x: {
      label: "Radiância média →",
      grid: true
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
        x: "mean_radiance",
        fill: "name_region",
        title: (d) =>
          `${d.name_state} (${d.abbrev_state})\n` +
          `Região: ${d.name_region}\n` +
          `Radiância média: ${d.mean_radiance.toFixed(3)}`
      }),

      Plot.text(ranking, {
        y: "abbrev_state",
        x: "mean_radiance",
        text: (d) => d.mean_radiance.toFixed(2),
        dx: 6,
        fill: "currentColor",
        textAnchor: "start"
      })
    ]
  });
}