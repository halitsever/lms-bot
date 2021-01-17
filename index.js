/*  
==============================Util==============================
*/
const ayarlar = require("./veri/ayarlar.json");
const { S_IFREG } = require("constants");
const zamanlama = require("util").promisify(setTimeout);
const { getHeapSpaceStatistics } = require("v8");
/*  
==============================Modül==============================
*/
const { Ders, Aplikasyon } = require("./lib/");
/*  
==============================Modül==============================
*/

Aplikasyon.on("ready", (() => {
    try {
      Ders.kontrol();
    } catch (err) {
      if (err) console.log(err);
    }
  })()
);
