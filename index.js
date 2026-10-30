const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const manifest = {
  id: "org.br.tvaberta.mobile",
  version: "1.2.0",
  name: "TV Aberta Brasil",
  description: "Canais abertos da TV brasileira em direto",
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

const CANAIS = [
  {
    id: "tvbr_sbt",
    name: "SBT",
    poster: "https://upload.wikimedia.org/wikipedia/commons/1/14/SBT_logo_2023.png",
    url: "https://live-sbt.akamaized.net/hls/live/2093556/sbtsp/master.m3u8"
  },
  {
    id: "tvbr_band",
    name: "Band",
    poster: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Rede_Bandeirantes_logo_2018.png",
    url: "https://live.band.uol.com.br/hls/live/2099392/bandsp/master.m3u8"
  },
  {
    id: "tvbr_redetv",
    name: "RedeTV!",
    poster: "https://upload.wikimedia.org/wikipedia/commons/9/91/RedeTV%21_logo_2019.png",
    url: "https://livestream.redetv.com.br/hls/live/2034925/redetvlive/master.m3u8"
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
          description: `Transmissão em direto de ${canal.name}`,
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
            title: `${canal.name} - HD`,
            url: canal.url,
            behaviorHints: {
              notWebReady: false,
              bingeGroup: "tv-aberta"
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
