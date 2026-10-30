const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const manifest = {
  id: "org.br.tvaberta.mobile",
  version: "1.4.0",
  name: "TV Aberta Brasil",
  description: "Canais abertos da TV brasileira",
  resources: ["catalog", "meta", "stream"],
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

// Canais utilizando streams mantidos por fluxos de retransmissão pública (iptv-org / feeds abertos)
const CANAIS = [
  {
    id: "tvbr_sbt",
    name: "SBT",
    poster: "https://upload.wikimedia.org/wikipedia/commons/1/14/SBT_logo_2023.png",
    url: "https://raw.githubusercontent.com/iptv-org/iptv/master/streams/br_sbt.m3u8"
  },
  {
    id: "tvbr_band",
    name: "Band",
    poster: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Rede_Bandeirantes_logo_2018.png",
    url: "https://raw.githubusercontent.com/iptv-org/iptv/master/streams/br_band.m3u8"
  },
  {
    id: "tvbr_tvcultura",
    name: "TV Cultura",
    poster: "https://upload.wikimedia.org/wikipedia/commons/6/67/TV_Cultura_logo_2018.png",
    url: "https://tvcultura.video.uol.com.br/hls/live/2093500/cultura/master.m3u8"
  },
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
    return Promise.resolve({ metas });
  }
  return Promise.resolve({ metas: [] });
});

builder.defineMetaHandler(({ type, id }) => {
  if (type === "tv") {
    const canal = CANAIS.find(c => c.id === id);
    if (canal) {
      return Promise.resolve({
        meta: {
          id: canal.id,
          type: "tv",
          name: canal.name,
          poster: canal.poster,
          description: `Transmissão ao vivo de ${canal.name}`,
          genres: ["TV", "Ao Vivo"]
        }
      });
    }
  }
  return Promise.resolve({ meta: null });
});

builder.defineStreamHandler(({ type, id }) => {
  if (type === "tv") {
    const canal = CANAIS.find(c => c.id === id);
    if (canal) {
      return Promise.resolve({
        streams: [
          {
            title: `${canal.name} - Ao Vivo`,
            url: canal.url,
            behaviorHints: {
              notWebReady: true,
              flexibleHeader: true
            }
          }
        ]
      });
    }
  }
  return Promise.resolve({ streams: [] });
});

const PORT = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port: PORT });
console.log(`Addon rodando na porta ${PORT}`);
