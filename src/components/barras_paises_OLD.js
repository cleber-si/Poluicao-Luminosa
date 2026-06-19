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

  const selected = data.filter((d) =>
    countries.includes(d.country_or_region)
  );

  const plotData = selected.flatMap((d) => [
    {
      country: d.country_or_region,
      band: "≤1.7",
      value: d["population_pct_≤1.7_µcd_m2"]
    },
    {
      country: d.country_or_region,
      band: "1.7–14",
      value: d["population_pct_>1.7_µcd_m2"] - d["population_pct_>14_µcd_m2"]
    },
    {
      country: d.country_or_region,
      band: "14–87",
      value: d["population_pct_>14_µcd_m2"] - d["population_pct_>87_µcd_m2"]
    },
    {
      country: d.country_or_region,
      band: "87–688",
      value: d["population_pct_>87_µcd_m2"] - d["population_pct_>688_µcd_m2"]
    },
    {
      country: d.country_or_region,
      band: "688–3000",
      value: d["population_pct_>688_µcd_m2"] - d["population_pct_>3000_µcd_m2"]
    },
    {
      country: d.country_or_region,
      band: ">3000",
      value: d["population_pct_>3000_µcd_m2"]
    }
  ]);

  return Plot.plot({
    title: "Distribuição populacional por faixa artificial de brilho do céu",
    subtitle: "Cores indicam faixas de brilho em µcd/m²",
    width,
    height: 350,
    marginLeft: 75,
    marginTop: -10,
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
      legend: true
    },

    marks: [
      Plot.barX(
        plotData,
        Plot.stackX({
          y: "country",
          x: "value",
          fill: "band",
          title: (d) => `${d.country} - ${d.band} µcd/m²: ${d.value.toFixed(1)}%`
        })
      )
    ]
  });
}