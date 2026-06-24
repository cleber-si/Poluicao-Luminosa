import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

// Gráfico 4
// Resíduo luminoso versus porcentagem da área municipal iluminada.
// Espera receber o arquivo:
// src/data/ceara_residuo_luminoso_municipios.csv
export function cearaResiduoVsAreaIluminada(data, {width = 900} = {}) {
  const rotulos = data.filter((d) =>
    Math.abs(d.residuo_luminoso_log) > 0.65 ||
    d.percent_area_above_1 > 85 ||
    ["Fortaleza", "Juazeiro do Norte", "Sobral", "São Gonçalo do Amarante"].includes(d.name_muni)
  );

  return Plot.plot({
    width,
    height: width * 0.35,

    marginTop: 30,
    marginRight: 40,
    marginBottom: 60,
    marginLeft: 70,

    style: {
      background: "transparent",
      color: "currentColor",
      fontSize: "13px"
    },

    x: {
      label: "Área municipal acima do limiar de radiância (%) →",
      domain: [0, 100],
      grid: true
    },

    y: {
      label: "↑ Resíduo luminoso",
      grid: true
    },

    r: {
      range: [3, 12]
    },

    color: {
      type: "linear",
      domain: [-1, 0, 1],
      range: ["#2166ac", "#f7f7f7", "#b2182b"],
      clamp: true,
      legend: true,
      label: "Resíduo luminoso"
    },

    marks: [
      Plot.ruleY([0], {stroke: "currentColor", strokeOpacity: 0.6}),

      Plot.dot(data, {
        x: "percent_area_above_1",
        y: "residuo_luminoso_log",
        r: (d) => Math.sqrt(d.share_radiancia_total_ce_pct),
        fill: "residuo_luminoso_log",
        stroke: "currentColor",
        strokeWidth: 0.5,
        opacity: 0.85,
        title: (d) =>
          `${d.name_muni}\n` +
          `Resíduo luminoso: ${d.residuo_luminoso_log.toFixed(3)}\n` +
          `Área acima do limiar: ${d.percent_area_above_1.toFixed(1)}%\n` +
          `Participação no Ceará: ${d.share_radiancia_total_ce_pct.toFixed(2)}%`
      }),
    ]
  });
}
