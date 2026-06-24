import * as Plot from "npm:@observablehq/plot";

export function temperaturePlot(data, {width} = {}) {
  return Plot.plot({
    title: "Hourly temperature forecast",
    width,
    x: {type: "utc", ticks: "day", label: null},
    y: {grid: true, inset: 10, label: "Degrees (F)"},
    marks: [
      Plot.lineY(data.properties.periods, {
        x: "startTime",
        y: "temperature",
        z: null, // varying color, not series
        stroke: "temperature",
        curve: "step-after"
      })
    ]
  });
}


export function populationExposurePlot(data, {width} = {}) {
  const xCol = "area_pct_≤1.7_µcd_m2";
  const yCol = "population_pct_>1.7_µcd_m2";

  const isTerritory = (d) =>
    d.is_nonindependent_territory === true ||
    String(d.is_nonindependent_territory).toLowerCase() === "true";

  const df = data
    .filter((d) => !isTerritory(d))
    .filter((d) => Number.isFinite(+d[xCol]) && Number.isFinite(+d[yCol]));

  const countriesToLabel = new Set([
    "Brazil",
    "Argentina",
    "Australia",
    "United States",
    "China",
    "India",
    "Russia",
    "Canada"
  ]);

  const labeledData = df.filter((d) =>
    countriesToLabel.has(d.country_or_region)
  );

  return Plot.plot({
    title: "Population exposure versus remaining dark area",
    subtitle: "Falchi et al. (2016), Table 2",
    width,
    height: 560,
    marginLeft: 75,
    marginBottom: 65,
    x: {
      domain: [0, 100],
      grid: true,
      label: "Dark area, ≤1.7 μcd/m² (%)"
    },
    y: {
      domain: [0, 100],
      grid: true,
      label: "Population exposed, >1.7 μcd/m² (%)"
    },
    marks: [
      Plot.ruleX([50], {
        stroke: "currentColor",
        strokeOpacity: 0.35,
        strokeDasharray: "4 4"
      }),

      Plot.ruleY([50], {
        stroke: "currentColor",
        strokeOpacity: 0.35,
        strokeDasharray: "4 4"
      }),

      Plot.dot(df, {
        x: (d) => +d[xCol],
        y: (d) => +d[yCol],
        r: 4,
        fill: "steelblue",
        fillOpacity: 0.75,
        stroke: "white",
        title: (d) =>
          `${d.country_or_region}
Dark area: ${d[xCol]}%
Population exposed: ${d[yCol]}%`
      }),

      Plot.dot(labeledData, {
        x: (d) => +d[xCol],
        y: (d) => +d[yCol],
        r: 6,
        fill: "orange",
        stroke: "black"
      }),

      Plot.text(labeledData, {
        x: (d) => +d[xCol],
        y: (d) => +d[yCol],
        text: "country_or_region",
        dx: 8,
        dy: -8,
        fontSize: 11,
        fill: "currentColor",
        stroke: "white",
        strokeWidth: 3
      })
    ]
  });
}


export function populationExposureFlagsPlot(
  data,
  {
    width,
    xDomain = [0, 100],
    yDomain = [0, 100]
  } = {}
) {
  const xCol = "area_pct_≤1.7_µcd_m2";
  const yCol = "population_pct_>1.7_µcd_m2";

  const highlightCountries = new Set([
    "Brazil",
    "Uruguay",
    "Argentina",
    "Australia",
    "United States",
    "China",
    "India",
    "Russia",
    "Canada"
  ]);

  const isTerritory = (d) =>
    d.is_nonindependent_territory === true ||
    String(d.is_nonindependent_territory).toLowerCase() === "true";

  const rows = data
    .filter((d) => !isTerritory(d))
    .filter((d) => d.flag_URL && d.flag_URL.trim() !== "")
    .filter((d) => Number.isFinite(+d[xCol]) && Number.isFinite(+d[yCol]))
    .map((d) => ({
      ...d,
      x: +d[xCol],
      y: +d[yCol]
    }));

  const background = rows.filter(
    (d) => !highlightCountries.has(d.country_or_region)
  );

  const highlighted = rows.filter((d) =>
    highlightCountries.has(d.country_or_region)
  );

  return Plot.plot({
    title: "Population exposure versus remaining dark area",
    subtitle: "Falchi et al. (2016), Table 2",
    width,
    height: 650,
    marginLeft: 80,
    marginBottom: 70,
    x: {
      domain: xDomain,
      grid: true,
      label: "Dark area, ≤1.7 μcd/m² (%)"
    },
    y: {
      domain: yDomain,
      grid: true,
      label: "Population exposed, >1.7 μcd/m² (%)"
    },
    marks: [
      Plot.ruleX([50], {
        stroke: "currentColor",
        strokeOpacity: 0.3,
        strokeDasharray: "4 4"
      }),

      Plot.ruleY([50], {
        stroke: "currentColor",
        strokeOpacity: 0.3,
        strokeDasharray: "4 4"
      }),

      // light background dots just to anchor image positions
      Plot.dot(background, {
        x: "x",
        y: "y",
        r: 2,
        fill: "#bbb",
        fillOpacity: 0.35
      }),

      // all non-highlighted countries first
      Plot.image(background, {
        x: "x",
        y: "y",
        src: "flag_URL",
        width: 18,
        height: 12,
        title: (d) =>
          `${d.country_or_region}
Dark area: ${d.x.toFixed(1)}%
Population exposed: ${d.y.toFixed(1)}%`
      }),

      // ring around highlighted countries
      Plot.dot(highlighted, {
        x: "x",
        y: "y",
        r: 12,
        fill: "none",
        stroke: "orange",
        strokeWidth: 2.5
      }),

      // highlighted countries on top, larger
      Plot.image(highlighted, {
        x: "x",
        y: "y",
        src: "flag_URL",
        width: 28,
        height: 18,
        title: (d) =>
          `${d.country_or_region}
Dark area: ${d.x.toFixed(1)}%
Population exposed: ${d.y.toFixed(1)}%`
      }),

      // labels for highlighted countries
      // Plot.text(highlighted, {
      //   x: "x",
      //   y: "y",
      //   text: "country_or_region",
      //   dx: 15,
      //   dy: -12,
      //   fontSize: 12,
      //   fontWeight: "bold",
      //   fill: "currentColor",
      //   stroke: "white",
      //   strokeWidth: 4
      // })
    ]
  });
}





import * as d3 from "npm:d3";

export function populationExposureFlagsD3Zoom(
  data,
  {
    width = 900,
    height = 650
  } = {}
) {
  const xCol = "area_pct_≤1.7_µcd_m2";
  const yCol = "population_pct_>1.7_µcd_m2";

  const highlightCountries = new Set([
    "Brazil",
    "Uruguay",
    "Argentina",
    "Australia",
    "United States",
    "China",
    "India",
    "Russia",
    "Canada"
  ]);

  const isTerritory = (d) =>
    d.is_nonindependent_territory === true ||
    String(d.is_nonindependent_territory).toLowerCase() === "true";

  const rows = data
    .filter((d) => !isTerritory(d))
    .filter((d) => d.flag_URL && String(d.flag_URL).trim() !== "")
    .filter((d) => Number.isFinite(+d[xCol]) && Number.isFinite(+d[yCol]))
    .map((d) => ({
      country: d.country_or_region,
      x: +d[xCol],
      y: +d[yCol],
      flag_URL: d.flag_URL,
      highlighted: highlightCountries.has(d.country_or_region)
    }));

  const background = rows.filter((d) => !d.highlighted);
  const highlighted = rows.filter((d) => d.highlighted);

  const margin = {
    top: 72,
    right: 35,
    bottom: 78,
    left: 84
  };

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const x0 = d3.scaleLinear()
    .domain([0, 100])
    .range([margin.left, width - margin.right]);

  const y0 = d3.scaleLinear()
    .domain([0, 110])
    .range([height - margin.bottom, margin.top]);

  const clipId = `clip-${Math.random().toString(16).slice(2)}`;

  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.width = "100%";

  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset zoom";
  Object.assign(resetButton.style, {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 1,
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #aaa",
    background: "white",
    cursor: "pointer"
  });

  const svg = d3.create("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", width)
    .attr("height", height)
    .style("max-width", "100%")
    .style("height", "auto")
    .style("font-family", "system-ui, -apple-system, BlinkMacSystemFont, sans-serif")
    .style("touch-action", "none")
    .style("cursor", "grab");

  svg.append("defs")
    .append("clipPath")
    .attr("id", clipId)
    .append("rect")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .attr("width", plotWidth)
    .attr("height", plotHeight);

  svg.append("text")
    .attr("x", margin.left)
    .attr("y", 28)
    .attr("font-size", 18)
    .attr("font-weight", 700)
    .text("Population exposure versus remaining dark area");

  svg.append("text")
    .attr("x", margin.left)
    .attr("y", 50)
    .attr("font-size", 13)
    .attr("fill", "currentColor")
    .attr("opacity", 0.75)
    .text("Falchi et al. (2016), Table 2");

  const xGrid = svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`);

  const yGrid = svg.append("g")
    .attr("transform", `translate(${margin.left},0)`);

  const gx = svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`);

  const gy = svg.append("g")
    .attr("transform", `translate(${margin.left},0)`);

  svg.append("text")
    .attr("x", margin.left + plotWidth / 2)
    .attr("y", height - 24)
    .attr("text-anchor", "middle")
    .attr("font-size", 13)
    .text("Dark area, ≤1.7 μcd/m² (%)");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(margin.top + plotHeight / 2))
    .attr("y", 22)
    .attr("text-anchor", "middle")
    .attr("font-size", 13)
    .text("Population exposed, >1.7 μcd/m² (%)");

  const reference = svg.append("g")
    .attr("clip-path", `url(#${clipId})`);

  const refX50 = reference.append("line")
    .attr("y1", margin.top)
    .attr("y2", height - margin.bottom)
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.35)
    .attr("stroke-dasharray", "4 4");

  const refY50 = reference.append("line")
    .attr("x1", margin.left)
    .attr("x2", width - margin.right)
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.35)
    .attr("stroke-dasharray", "4 4");

  const markG = svg.append("g")
    .attr("clip-path", `url(#${clipId})`);

  const backgroundDots = markG.selectAll(".background-dot")
    .data(background)
    .join("circle")
    .attr("r", 2.2)
    .attr("fill", "currentColor")
    .attr("opacity", 0.22);

  const backgroundFlags = markG.selectAll(".background-flag")
    .data(background)
    .join("image")
    .attr("href", (d) => d.flag_URL)
    .attr("width", 18)
    .attr("height", 12)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("opacity", 0.82);

  backgroundFlags.append("title")
    .text((d) =>
      `${d.country}
Dark area: ${d.x.toFixed(1)}%
Population exposed: ${d.y.toFixed(1)}%`
    );

  const highlightRings = markG.selectAll(".highlight-ring")
    .data(highlighted)
    .join("circle")
    .attr("r", 15)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 2.5);

  const highlightFlags = markG.selectAll(".highlight-flag")
    .data(highlighted)
    .join("image")
    .attr("href", (d) => d.flag_URL)
    .attr("width", 32)
    .attr("height", 21)
    .attr("preserveAspectRatio", "xMidYMid meet");

  highlightFlags.append("title")
    .text((d) =>
      `${d.country}
Dark area: ${d.x.toFixed(1)}%
Population exposed: ${d.y.toFixed(1)}%`
    );

  const labels = markG.selectAll(".highlight-label")
    .data(highlighted)
    .join("text")
    .attr("font-size", 12)
    .attr("font-weight", 700)
    .attr("fill", "currentColor")
    .attr("stroke", "white")
    .attr("stroke-width", 4)
    .attr("paint-order", "stroke")
    .text((d) => d.country);

  function cleanGrid(g) {
    g.selectAll(".domain").remove();
    g.selectAll("line")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.12);
    g.selectAll("text").remove();
  }

  function cleanAxis(g) {
    g.selectAll(".domain")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.5);
    g.selectAll("line")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.5);
    g.selectAll("text")
      .attr("fill", "currentColor")
      .attr("font-size", 11);
  }

  function update(x, y) {
    xGrid.call(
      d3.axisBottom(x)
        .ticks(10)
        .tickSize(-plotHeight)
        .tickFormat("")
    );
    cleanGrid(xGrid);

    yGrid.call(
      d3.axisLeft(y)
        .ticks(10)
        .tickSize(-plotWidth)
        .tickFormat("")
    );
    cleanGrid(yGrid);

    gx.call(
      d3.axisBottom(x)
        .ticks(10)
        .tickSizeOuter(0)
    );
    cleanAxis(gx);

    gy.call(
      d3.axisLeft(y)
        .ticks(10)
        .tickSizeOuter(0)
    );
    cleanAxis(gy);

    refX50
      .attr("x1", x(50))
      .attr("x2", x(50));

    refY50
      .attr("y1", y(50))
      .attr("y2", y(50));

    backgroundDots
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y));

    backgroundFlags
      .attr("x", (d) => x(d.x) - 9)
      .attr("y", (d) => y(d.y) - 6);

    highlightRings
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y));

    highlightFlags
      .attr("x", (d) => x(d.x) - 16)
      .attr("y", (d) => y(d.y) - 10.5);

    labels
      .attr("x", (d) => x(d.x) + 18)
      .attr("y", (d) => y(d.y) - 14);
  }

  update(x0, y0);

  const zoom = d3.zoom()
    .scaleExtent([1, 40])
    .extent([
      [margin.left, margin.top],
      [width - margin.right, height - margin.bottom]
    ])
    .translateExtent([
      [margin.left, margin.top],
      [width - margin.right, height - margin.bottom]
    ])
    .on("start", () => {
      svg.style("cursor", "grabbing");
    })
    .on("end", () => {
      svg.style("cursor", "grab");
    })
    .on("zoom", (event) => {
      const zx = event.transform.rescaleX(x0);
      const zy = event.transform.rescaleY(y0);
      update(zx, zy);
    });

  svg.call(zoom);

  resetButton.addEventListener("click", () => {
    svg.transition()
      .duration(500)
      .call(zoom.transform, d3.zoomIdentity);
  });

  wrapper.appendChild(resetButton);
  wrapper.appendChild(svg.node());

  return wrapper;
}