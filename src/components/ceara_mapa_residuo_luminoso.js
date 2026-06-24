import * as Plot from "npm:@observablehq/plot";

export function cearaMapaResiduoLuminoso(geojson, data, {width = 900} = {}) {
  // Criamos um dicionário: código do município -> linha da tabela CSV.
  const dadosPorCodigo = new Map(
    data.map((d) => [String(Math.trunc(d.code_muni)), d])
  );

  // Para cada polígono do GeoJSON, procuramos a linha correspondente no CSV.
  const features = geojson.features.map((feature) => {
    const p = feature.properties;

    const codigo = String(
      p.code_muni ??
      p.CD_MUN ??
      p.CD_MUN_7 ??
      p.id ??
      p.geocodigo
    );

    const dados = dadosPorCodigo.get(codigo);

    return {
      ...feature,
      properties: {
        ...p,
        dados
      }
    };
  });

  const geoComDados = {
    type: "FeatureCollection",
    features
  };

  return Plot.plot({
    width,
    height: width * 1.1,

    marginTop: 20,
    marginRight: 20,
    marginBottom: 50,
    marginLeft: 20,

    projection: {
      type: "mercator",
      domain: geoComDados
    },

    style: {
      background: "transparent",
      color: "currentColor",
      fontSize: "13px"
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
      Plot.geo(geoComDados, {
        fill: (d) => d.properties.dados?.residuo_luminoso_log,
        stroke: "currentColor",
        strokeOpacity: 0.45,
        strokeWidth: 0.45,
        title: (d) => {
          const row = d.properties.dados;

          if (!row) return "Município sem dados";

          return `${row.name_muni}\n` +
            `Resíduo luminoso: ${row.residuo_luminoso_log.toFixed(3)}\n` +
            `Radiância média: ${row.mean_radiance.toFixed(3)}\n` +
            `Área acima do limiar: ${row.percent_area_above_1.toFixed(1)}%`;
        }
      })
    ]
  });
}
