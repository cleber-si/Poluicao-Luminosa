// RasterTileMap.js
// Mapa interativo (pan/zoom) que exibe uma pirâmide de tiles XYZ gerada em
// tempo de build por scripts/build_tiles.py, usando Leaflet.
//
// MUDANÇA IMPORTANTE: o caminho dos tiles é derivado do href real do
// metadata.json (resolvido pelo Framework via FileAttachment). Caminhos
// "crus" como "assets/tiles/viirs" NÃO funcionam no site publicado, porque o
// Framework renomeia/realoca os arquivos estáticos no build. Por isso passamos
// `metadataUrl` (um FileAttachment.href) em vez de uma string fixa.
//
// Uso em index.md:
//   const viirsMeta = await FileAttachment("assets/tiles/viirs/metadata.json").href;
//   RasterTileMap({ metadataUrl: viirsMeta, fallbackImage: viirsPng, ... })
//
// Se metadataUrl for nulo/inacessível, faz fallback para o PNG estático.

import L from "npm:leaflet";

const LEAFLET_CSS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";

function ensureLeafletCss() {
  if (document.querySelector(`link[href="${LEAFLET_CSS}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = LEAFLET_CSS;
  document.head.appendChild(link);
}

export function RasterTileMap({
  metadataUrl = null,
  fallbackImage = null,
  fallbackBounds = null, // [[s,w],[n,e]] — só usado se não houver metadata
  boundaries = null, // GeoJSON (FeatureCollection) de limites para sobrepor
  width = 760,
  height = 720,
  attribution = "",
  baseTiles = "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
  opacity = 0.92
} = {}) {
  ensureLeafletCss();

  const container = document.createElement("div");
  container.className = "raster-map";
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.maxWidth = "100%";

  // Inicializa após entrar no DOM (Leaflet precisa de tamanho medido).
  requestAnimationFrame(() => {
    const map = L.map(container, {
      center: [-15, -54],
      zoom: 4,
      minZoom: 3,
      maxZoom: 9,
      scrollWheelZoom: false,
      attributionControl: Boolean(attribution)
    });

    L.tileLayer(baseTiles, {
      subdomains: "abcd",
      attribution: "© OpenStreetMap, © CARTO"
    }).addTo(map);

    // Sobreposição de limites (estados/país) para realçar fronteiras.
    // Adicionada DEPOIS do tile-base mas o pane abaixo garante que fique
    // acima do raster (que é inserido no pane de tiles padrão).
    function addBoundaries() {
      if (!boundaries) return;
      // Halo largo e tênue por baixo, para destacar a linha sobre o raster escuro.
      L.geoJSON(boundaries, {
        style: {
          color: "#05060a",
          weight: 3.2,
          opacity: 0.55,
          fill: false,
          interactive: false
        }
      }).addTo(map);
      // Linha nítida por cima.
      L.geoJSON(boundaries, {
        style: {
          color: "#f7f7f2",
          weight: 1,
          opacity: 0.9,
          fill: false,
          interactive: false
        }
      }).addTo(map);
    }

    // Caminho ideal: tiles XYZ via metadata.json resolvido pelo Framework.
    if (metadataUrl) {
      fetch(metadataUrl)
        .then((r) => {
          if (!r.ok) throw new Error(`metadata HTTP ${r.status}`);
          return r.json();
        })
        .then((meta) => {
          // Base dos tiles = diretório do metadata.json.
          const base = metadataUrl.replace(/\/metadata\.json.*$/, "");
          L.tileLayer(`${base}/{z}/{x}/{y}.png`, {
            minZoom: meta.minzoom ?? 3,
            maxZoom: meta.maxzoom ?? 8,
            tms: meta.tileScheme === "tms",
            opacity,
            attribution
          }).addTo(map);
          const [w, s, e, n] = meta.bounds;
          map.fitBounds([
            [s, w],
            [n, e]
          ]);
          addBoundaries();
        })
        .catch((err) => {
          console.warn("[RasterTileMap] metadata indisponível, usando fallback:", err);
          addFallback(map, fallbackImage, fallbackBounds, opacity);
          addBoundaries();
        });
    } else {
      addFallback(map, fallbackImage, fallbackBounds, opacity);
      addBoundaries();
    }

    // Scroll-zoom só após clicar (boa prática em artigos longos).
    map.on("click", () => map.scrollWheelZoom.enable());
    map.on("mouseout", () => map.scrollWheelZoom.disable());
  });

  return container;
}

function addFallback(map, image, bounds, opacity) {
  if (!image) return;
  const b = bounds ?? [
    [-34, -74],
    [6, -34]
  ];
  L.imageOverlay(image, b, {opacity}).addTo(map);
  map.fitBounds(b);
  const note = L.control({position: "bottomleft"});
  note.onAdd = () => {
    const div = L.DomUtil.create("div", "raster-fallback-note");
    div.innerHTML =
      "imagem estática · gere os tiles com <code>build_tiles.py</code> para zoom total";
    return div;
  };
  note.addTo(map);
}
