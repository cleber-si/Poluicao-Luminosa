import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function cearaGraficoResiduoLuminoso(data, {width = 900} = {}) {
  // Primeiro, preparamos os dados.
  // Aqui eu assumo que o CSV já tem as colunas necessárias.
  const dados = data.map((d) => ({
    municipio: d.name_muni,
    densidade: Number(d.densidade_2022_ibge_hab_km2),
    radianciaMedia: Number(d.mean_radiance),

    // Valores que serão usados diretamente no gráfico.
    x: Number(d.log1p_densidade_2022),
    y: Number(d.log1p_radiancia_media),

    // Valor esperado pelo modelo.
    yModelo: Number(d.radiancia_media_esperada_log),

    // Resíduo luminoso.
    residuo: Number(d.residuo_luminoso_log),

    classe: d.classe_residuo_luminoso,
    perfil: d.perfil_luminoso
  }));

  // Municípios que queremos destacar com rótulos.
  const destaques = dados.filter((d) =>
    [
      "Fortaleza",
      "Maracanaú",
      "Eusébio",
      "Sobral",
      "Juazeiro do Norte",
      "Aquiraz",
      "São Gonçalo do Amarante"
    ].includes(d.municipio)
  );

  // Dados usados para desenhar a linha do modelo.
  const linhaModelo = dados
    .map((d) => ({
      x: d.x,
      y: d.yModelo
    }))
    .sort((a, b) => a.x - b.x);

  // A legenda vertical vai ocupar um espaço à direita.
  const larguraLegenda = 80;
  const larguraGrafico = width - larguraLegenda;
  const altura = 500;

  // Criamos o gráfico principal.
  const grafico = Plot.plot({
    width: larguraGrafico,
    height: altura,

    marginTop: 40,
    marginRight: 30,
    marginBottom: 60,
    marginLeft: 70,

    style: {
      background: "transparent",
      color: "currentColor",
      fontSize: "13px"
    },

    x: {
      label: "log(1 + densidade demográfica) →",
      grid: true
    },

    y: {
      label: "↑ log(1 + radiância média)",
      grid: true
    },

    color: {
      type: "linear",
      domain: [-1, 0, 1],
      range: ["#2c7bb6", "#f7f7f7", "#d7191c"],
      clamp: true,
      legend: false
    },

    marks: [
      Plot.line(linhaModelo, {
        x: "x",
        y: "y",
        stroke: "currentColor",
        strokeWidth: 2
      }),

      Plot.dot(dados, {
        x: "x",
        y: "y",
        fill: "residuo",
        stroke: "currentColor",
        strokeWidth: 0.5,
        r: 5,
        opacity: 0.9,

        title: (d) =>
          `${d.municipio}\n` +
          `Radiância média: ${d.radianciaMedia.toFixed(2)}\n` +
          `Densidade: ${d.densidade.toFixed(1)} hab/km²\n` +
          `Resíduo luminoso: ${d.residuo.toFixed(3)}\n` +
          `Classe: ${d.classe}\n` +
          `Perfil: ${d.perfil}`
      }),

      Plot.text(destaques, {
        x: "x",
        y: "y",
        text: "municipio",
        dx: 7,
        dy: -7,
        fill: "currentColor",
        fontSize: 12
      })
    ]
  });

  // Agora criamos a legenda vertical separadamente.
  const legenda = criarLegendaVertical({
    height: altura,
    min: -1,
    max: 1
  });

  // Por fim, colocamos o gráfico e a legenda lado a lado.
  const container = document.createElement("div");

  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.gap = "16px";

  container.append(grafico);
  container.append(legenda);

  return container;
}

function criarLegendaVertical({height = 500, min = -1, max = 1} = {}) {
  const width = 70;

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .style("overflow", "visible")
    .style("font", "12px sans-serif")
    .style("color", "currentColor");

  const margemTopo = 50;
  const margemBaixo = 50;
  const alturaBarra = height - margemTopo - margemBaixo;

  const xBarra = 10;
  const larguraBarra = 18;

  // Criamos o gradiente da barra.
  const defs = svg.append("defs");

  const gradiente = defs
    .append("linearGradient")
    .attr("id", "gradiente-residuo")
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("y1", "100%")
    .attr("y2", "0%");

  gradiente.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#2c7bb6");

  gradiente.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", "#f7f7f7");

  gradiente.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#d7191c");

  // Desenhamos a barra.
  svg.append("rect")
    .attr("x", xBarra)
    .attr("y", margemTopo)
    .attr("width", larguraBarra)
    .attr("height", alturaBarra)
    .attr("fill", "url(#gradiente-residuo)")
    .attr("stroke", "currentColor")
    .attr("stroke-width", 0.5);

  // Criamos a escala numérica da legenda.
  const escala = d3
    .scaleLinear()
    .domain([min, max])
    .range([margemTopo + alturaBarra, margemTopo]);

  // Criamos o eixo da legenda.
  const eixo = d3
    .axisRight(escala)
    .tickValues([-1, -0.5, 0, 0.5, 1])
    .tickFormat(d3.format("+.1f"));

  svg.append("g")
    .attr("transform", `translate(${xBarra + larguraBarra}, 0)`)
    .call(eixo)
    .call((g) => g.select(".domain").remove());

  // Título da legenda.
  svg.append("text")
    .attr("x", xBarra)
    .attr("y", 30)
    .attr("fill", "currentColor")
    .attr("font-weight", "bold")
    .text("Resíduo");

  svg.append("text")
    .attr("x", xBarra)
    .attr("y", 45)
    .attr("fill", "currentColor")
    .attr("font-weight", "bold")
    .text("luminoso");

  return svg.node();
}