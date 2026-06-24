import * as Plot from "npm:@observablehq/plot";

export function barrasPaisesSelecionados(data, {width = 900} = {}) {
  const countries = [
    "Brazil",
    "Argentina",
    "Australia",
    "United States",
    "China",
    "India",
    "Russia",
    "Canada",
    "European Union",
    "World"
  ];

  const rows = data.filter((d) => countries.includes(d.country_or_region));

  
  const bands = [
    {
      band: "≤1.7",
      value: (d) => d["population_pct_≤1.7_µcd_m2"]
    },
    {
      band: "1.7–14",
      value: (d) => d["population_pct_>1.7_µcd_m2"] - d["population_pct_>14_µcd_m2"] //Lembrar que os valores de brilho mais alto têm um valor de população mais baixo!!
    },
    {
      band: "14–87",
      value: (d) => d["population_pct_>14_µcd_m2"] - d["population_pct_>87_µcd_m2"]
    },
    {
      band: "87–688",
      value: (d) => d["population_pct_>87_µcd_m2"] - d["population_pct_>688_µcd_m2"]
    },
    {
      band: "688–3000",
      value: (d) => d["population_pct_>688_µcd_m2"] - d["population_pct_>3000_µcd_m2"]
    },
    {
      band: ">3000",
      value: (d) => d["population_pct_>3000_µcd_m2"]
    }
  ];

  const longData = [];

  for (const d of rows) {
    let x0 = 0;

    for (const b of bands) {
      const value = Math.max(0, b.value(d));
      const x1 = x0 + value;

      longData.push({
        country: d.country_or_region,
        band: b.band,
        value,
        x0,
        x1
      });

      x0 = x1;
    }
  }

  return Plot.plot({
    title: "Distribuição populacional por faixa artificial de brilho do céu",
    width,
    height: 430,
    marginLeft: 110,
    marginRight: 120,
    marginBottom: 50,
    marginTop: 45,

    x: {
      domain: [0, 100],
      grid: true,
      tickFormat: (d) => `${d}%`,
      label: "Parcela da população (%)"
    },

    y: {
      domain: countries,
      label: null
    },

    color: {
      domain: ["≤1.7", "1.7–14", "14–87", "87–688", "688–3000", ">3000"],
      range: ["#5b008b", "#1f5be3", "#3f9b3f", "#f6b15f", "#d90000", "#d9d9d9"],
      legend: true,
      label: "Banda de brilho (µcd/m²)"
    },

    marks: [
      Plot.barX(longData, {
        y: "country",
        x1: "x0",
        x2: "x1",
        fill: "band",
        title: (d) =>
          `${d.country}
${d.band} µcd/m²: ${d.value.toFixed(1)}%`
      }),

      Plot.ruleX([0, 20, 40, 60, 80, 100], {
        stroke: "currentColor",
        strokeOpacity: 0.15
      })
    ]
  });
}