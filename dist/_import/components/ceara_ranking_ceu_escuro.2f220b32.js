import * as Plot from "../../_npm/@observablehq/plot@0.6.17/a96a6bbb.js";
import * as d3 from "../../_npm/d3@7.9.0/66d82917.js";

// Gráfico 5
// Ranking exploratório de municípios candidatos a céu mais escuro.
// Espera receber o arquivo:
// src/data/ceara_residuo_luminoso_municipios.csv
//
// Importante: este gráfico NÃO é uma recomendação turística pronta.
// Ele usa apenas dados de radiância VIIRS. Para planejar uma observação real,
// ainda seria necessário verificar segurança, acesso, hospedagem, clima,
// fase da Lua e autorização de entrada em propriedades ou unidades de conservação.
export function cearaRankingCeuEscuro(data, {width = 900, n = 12} = {}) {
  const maxLogMedia = d3.max(data, (d) => Math.log1p(d.mean_radiance));

  const candidatos = data
    .map((d) => ({
      ...d,
      // Índice simples: quanto menor, melhor para céu escuro.
      // 70% vem da radiância média e 30% vem da área iluminada.
      indice_ceu_escuro:
        0.7 * Math.log1p(d.mean_radiance) / maxLogMedia +
        0.3 * d.percent_area_above_1 / 100
    }))
    .sort((a, b) => d3.ascending(a.indice_ceu_escuro, b.indice_ceu_escuro))
    .slice(0, n);

  return Plot.plot({
    width,
    height: 38 * candidatos.length + 90,

    marginTop: 30,
    marginRight: 90,
    marginBottom: 55,
    marginLeft: 135,

    style: {
      background: "transparent",
      color: "currentColor",
      fontSize: "13px"
    },

    x: {
      label: "Índice exploratório de céu escuro: menor é melhor →",
      grid: true
    },

    y: {
      label: null,
      domain: candidatos.map((d) => d.name_muni)
    },

    marks: [
      Plot.barX(candidatos, {
        y: "name_muni",
        x: "indice_ceu_escuro",
        fill: "#4c1d95",
        title: (d) =>
          `${d.name_muni}\n` +
          `Índice: ${d.indice_ceu_escuro.toFixed(3)}\n` +
          `Radiância média: ${d.mean_radiance.toFixed(3)}\n` +
          `Área acima do limiar: ${d.percent_area_above_1.toFixed(1)}%\n` +
          `Radiância máxima: ${d.max_radiance.toFixed(2)}`
      }),

      Plot.text(candidatos, {
        y: "name_muni",
        x: "indice_ceu_escuro",
        text: (d) => d.indice_ceu_escuro.toFixed(2),
        dx: 6,
        fill: "currentColor",
        textAnchor: "start"
      })
    ]
  });
}
