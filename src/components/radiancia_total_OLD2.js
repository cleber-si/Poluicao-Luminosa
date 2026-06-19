import * as vega from "npm:vega";
import * as vegaLite from "npm:vega-lite";
import * as vegaLiteApi from "npm:vega-lite-api";

const vl = vegaLiteApi.register(vega, vegaLite);

export function radianciaTotal(brazilStates, {width = 900} = {}) {
  // A altura acompanha a largura, mantendo a proporção do mapa do Brasil.
  const height = width * 0.95;

  // Comprimento fixo da legenda (não depende mais da largura da página).
  // Isso elimina o loop de relayout que fazia a colorbar "tremer".
  const legendLength = 620;

  return vl.markGeoshape({
    stroke: "white",
    strokeWidth: 0.7
  })
  .data(brazilStates.features)
  .encode(
    vl.color()
      .fieldQ("properties.sum_radiance")
      .scale({
        type: "log",
        domain: [27000, 2000000],
        scheme: {name: "inferno"},
        clamp: true
      })
      .legend({
        title: "Radiância Total",
        values: [27000, 46170, 79000, 135000, 230859, 400000, 680000, 1150000, 2000000],
        labelExpr: "datum.value >= 1000000 ? format(datum.value / 1000000, '.1f') + 'M' : format(datum.value / 1000, '.0f') + 'k'",
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
      {field: "properties.sum_radiance", type: "quantitative", title: "Radiância Total", format: ".3f"}
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
