---
# theme: dashboard
toc: false
---

<!-- HEADER DA PÁGINA -->
<div class="hero">
  <h1>Onde Estão as Noites Escuras no Brasil?</h1>
  <h2>Por Cleber Silva e Brício Freitas</h2>
</div>

<div class="hero">
  <h2>O céu noturno natural não é apenas um recurso astronômico. Ele também faz parte da paisagem ambiental, cultural e biológica da vida humana. Um céu escuro permite que estrelas, planetas e a Via Láctea sejam vistos a olho nu. Além disso, sustenta ecossistemas noturnos, ritmos circadianos e a experiência da noite como uma condição natural distinta. Mas o avanço da tecnologia nos traz uma desconexão inconsciente com o céu. Neste artigo, vamos explorar como isso se dá.</h2>
</div>


<!-- SCATTER PLOT DOS PAÍSES -->
```js
import {scatterPaises} from "./components/scatter_paises.js";

const falchi_raw = await FileAttachment("./data/falchi_2016_table2_light_pollution_selected_flags.csv").csv({typed: true});
const earthIconURL = FileAttachment("./images/mundo.png").href;
const falchi = falchi_raw.map((d) => ({...d, flag_URL: d.country_or_region === "World" ? earthIconURL : d.flag_URL}));
```
<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => scatterPaises(falchi, {width}))}
  </div>
</div>


<!-- ANÁLISE FOCADA NOS PAÍSES DE INTERESSE -->
```js
import {barrasPaisesSelecionados} from "./components/barras_paises.js";
```
<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => barrasPaisesSelecionados(falchi, {width}))}
  </div>
</div>


<!-- 
CARREGA AS IMAGENS PRÉ-PROCESSADAS DOS RASTERS DO MAPA DO BRASIL

Ia ser muito legal achar algma forma de deixar isso aqui mais dinâmico
-->
<!-- <div class="grid grid-cols-1">
  <div class="card">
    <img src="images/brasil_luzes.png" style="width: {width}; height: auto;">
  </div>
</div> -->

<!-- Colocar aqui uma explicação conceitual de como sair de um mapa para o outro -->

<!-- <div class="grid grid-cols-1">
  <div class="card">
    <img src="images/brazil_falchi_map_2015_tranparent.png" style="width: {width}; height: auto;">
  </div>
</div> -->



```js
import {RasterTileMap} from "./components/RasterTileMap.js";
const viirsPng = await FileAttachment("assets/viirs_brazil_2024.png").href;
const falchiPng = await FileAttachment("assets/falchi_brazil_2015.png").href;

const siteBase = new URL(".", document.baseURI);

const viirsTilesMeta = new URL("assets/tiles/viirs/metadata.json", siteBase).href;
const falchiTilesMeta = new URL("assets/tiles/falchi/metadata.json", siteBase).href;
```

<div class="section" style="padding-top:0">
  ${RasterTileMap({
    metadataUrl: viirsTilesMeta,
    fallbackImage: viirsPng,
    boundaries: brazilStates,
    width: 820,
    height: 760,
    attribution: "VIIRS/VNL 2024 · Earth Observation Group"
  })}
  <div class="caption">
    Radiância de subida (escala log + paleta viridis).
  </div>
</div>

<div class="section" style="padding-top:0">
  ${RasterTileMap({
    metadataUrl: falchiTilesMeta,
    fallbackImage: falchiPng,
    boundaries: brazilStates,
    width: 820,
    height: 760,
    attribution: "Falchi et al. (2016), World Atlas 2015"
  })}
  <div class="caption">
    Brilho artificial do céu (razão sobre o brilho natural), Atlas Mundial 2015.
    Compare com o mapa VIIRS acima: os mesmos núcleos urbanos, agora cercados
    por halos de luz espalhada. Este mapa mostra o que o observador realmente perde de céu.
  </div>
</div>




<!-- MAPAS DOS ESTADOS DO BRASIL -->
```js
import {radianciaTotal} from "./components/radiancia_total.js";
import {radianciaMedia} from "./components/radiancia_media.js";

const brazilStates = FileAttachment("./data/brazil-states.json").json({typed: true});
```

<div class="grid grid-cols-1">
  <div class="card">
    <!-- Tem um bug ao tentar executar o comando comentado abaixo. Engraçado que nos outros casos não dava bug... 
    Fazendo alguns testes aqui depois, acho que isso tem relação com a legenda do colorbar, que fica atualizando a
    posição cada vez que o width é atualizado.-->
    <!-- ${resize((width) => radianciaTotal(brazilStates, {width}))} -->
    <!-- ${resize((width) => radianciaMedia(brazilStates, {width: Math.min(width, 850)}))} -->
    ${radianciaMedia(brazilStates)}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    <!-- Tem um bug ao tentar executar o comando comentado abaixo. Engraçado que nos outros casos não dava bug... 
    Fazendo alguns testes aqui depois, acho que isso tem relação com a legenda do colorbar, que fica atualizando a
    posição cada vez que o width é atualizado.-->
    <!-- ${resize((width) => radianciaTotal(brazilStates, {width}))} -->
    <!-- ${resize((width) => radianciaTotal(brazilStates, {width: Math.min(width, 850)}))} -->
    ${radianciaTotal(brazilStates)}
  </div>
</div>




---

## Next steps

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>
