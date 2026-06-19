import * as vega from "npm:vega";
import * as vegaLite from "npm:vega-lite";
import * as vegaLiteApi from "npm:vega-lite-api";

const vl = vegaLiteApi.register(vega, vegaLite);

export function radianciaMedia(brazilStates, {width = 900} = {}) {
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
        // labels: [27.0, 46.2, 79.0, 135.0, 230.9, 400.0, 680.0, 1150.0, 2000.0], // Não funciona...
        // labelExpr: "datum.value >= 1000000 ? format(datum.value / 1000000, '.1f') + 'M' : format(datum.value / 1000, '.0f') + 'k'",
        gradientLength: width,
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
  .height(650)
  .config({
    view: {stroke: null},
    background: "transparent"
  })
  .render();
}