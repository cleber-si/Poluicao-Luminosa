import * as vega from "npm:vega";
import * as vegaLite from "npm:vega-lite";
import * as vegaLiteApi from "npm:vega-lite-api";

const vl = vegaLiteApi.register(vega, vegaLite);

export function radianciaMedia(brazilStates, {width = 900} = {}) {
  // A altura acompanha a largura, mantendo a proporção do mapa do Brasil.
  const height = width * 0.95;

  // O comprimento da legenda NÃO depende mais da largura da página.
  // Era isso que causava o "loop" de redimensionamento infinito:
  // a cada resize, a legenda recalculava seu tamanho e disparava
  // outro relayout. Agora ela tem um tamanho fixo e estável.
  const legendLength = 620;

  return vl.markGeoshape({
    stroke: "white",
    strokeWidth: 0.7
  })
  .data(brazilStates.features)
  .encode(
    vl.color()
      .fieldQ("properties.mean_radiance")
      .scale({
        type: "log",
        domain: [0.05, 8],
        scheme: {name: "inferno"},
        clamp: true
      })
      .legend({
        title: "Radiância Média",
        values: [0, 0.1, 0.2, 0.5, 1, 2, 4, 8],
        gradientLength: legendLength,
        labelFontSize: 14,
        titleFontSize: 15,
        offset: 30,
        labelColor: "white",
        titleColor: "white",
        orient: "top"
      }),

    vl.tooltip([
      {field: "properties.name_state", type: "nominal", title: "Estado"},
      {field: "properties.abbrev_state", type: "nominal", title: "UF"},
      {field: "properties.name_region", type: "nominal", title: "Região"},
      {field: "properties.mean_radiance", type: "quantitative", title: "Radiância Média", format: ".3f"}
    ])
  )
  .project(vl.projection("mercator"))
  .width(width)
  .height(height)
  .config({
    view: {stroke: null},
    background: "transparent",
    autosize: {type: "fit", contains: "padding"}
  })
  .render();
}
