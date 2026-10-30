const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const manifest = {
  id: "org.br.tvaberta.mobile",
  version: "1.0.0",
  name: "TV Aberta Brasil",
  description: "Canais abertos da TV brasileira",
  resources: ["catalog", "stream"],
  types: ["tv"],
  catalogs: [
    {
      type: "tv",
      id: "tv_aberta_br",
      name: "TV Aberta Brasil"
    }
  ],
  idPrefixes: ["tvbr_"]
};

const builder = new addonBuilder(manifest);

const CANAIS = [
  {
    id: "tvbr_tvbrasil",
    name: "TV Brasil",
    poster: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Logo_TV_Brasil.png",
    url: "https://ebc-tvbrasil.cdn.imagem.ebc.com.br/hls/tvbrasil/main.m3u8"
  },
  {
    id: "tvbr_recordnews",
    name: "Record News",
    poster: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Record_News_2021.png",
    url: "https://m3u.cl/chs/32.m3u8"
  }
];

builder.defineCatalogHandler(({ type, id }) => {
  if (type === "tv" && id === "tv_aberta_br") {
    const metas = CANAIS.map(c => ({
      id: c.id,
      type: "tv",
      name: c.name,
      poster: c.poster
    }));
    return Promise
    
