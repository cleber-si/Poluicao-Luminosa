import * as Plot from "../../_npm/@observablehq/plot@0.6.17/a96a6bbb.js";

export function scatterPaises(data, {width = 900} = {}) {
  const xCol = "area_pct_≤1.7_µcd_m2";
  const yCol = "population_pct_>1.7_µcd_m2";

  return Plot.plot({
    width,
    height: width*0.35,
    marginTop: 35,
    x: {
      domain: [0, 100],
      grid: [50],
      label: "Área escura: área com luz artificial ≤1.7 μcd/m² (%)"
    },
    y: {
      domain: [0, 100],
      grid: [50],
      label: "População Exposta à Luz Artificial >1.7 μcd/m² (%)"
    },
    marks: [
      Plot.dot(data, {
        x: xCol,
        y: yCol,
        r: 3,
        stroke: "currentColor",
        fill: "none",
        title: (d) => `${d.country_or_region}`
      }),

      Plot.image(data, {
        x: xCol,
        y: yCol,
        src: "flag_URL",
        width: 32,
        height: 22,
        title: (d) => `${d.country_or_region}`
      })
    ]
  });
}