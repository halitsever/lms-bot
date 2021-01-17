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
