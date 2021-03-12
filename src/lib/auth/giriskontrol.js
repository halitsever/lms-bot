"use strict";
/*  
=================================Util==================================
*/
const Hesap = require("../uyeislemleri");
const zamanlama = require("util").promisify(setTimeout);
const sqlite3 = require("sqlite-y");
const {
  app,
  BrowserWindow,
  ipcMain,
  remote,
  webContents,
  shell,
  ipcRenderer
} = require("electron");
const { Browser } = require("selenium-webdriver");
/*  
=================================Util==================================
*/

/*  
==============================Degiskenler==============================
*/

const gunler = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi"
];
//   const db = await sqlite3("veri/kullanicibilgi.sqlite");
var ders_aktif;
const path = require("path");

const dbPath = path.join(__dirname, "../../bilgiler.sqlite");
/*  
==============================Degiskenler==============================
*/

module.exports = class Giris {
  async girisyap() {
    console.log("Giriş denemesi yapılıyor...");
    const db = await sqlite3(dbPath);
    db.bilgi.find({ _orderBy: "id" }).then(ogrenci => {
      console.log("fc dis: " + ogrenci);
      giris(ogrenci);

      async function giris(ogrenciveri) {
        console.log("fc ic: " + ogrenciveri);
        try {
          var uye = new Hesap(
            ogrenciveri[0].ogrencino,
            ogrenciveri[0].sifre,
            "Test"
          );

          await uye.oturumac().finally(async () => {
            await zamanlama(1000);
          });
          BrowserWindow.getAllWindows()[0].webContents.send(
            "mesaj::giris",
            "giris_basari"
          );
        } catch (err) {
          console.log("Core uyeislemleri hata:" + err);
          BrowserWindow.getAllWindows()[0].webContents.send(
            "mesaj::giris",
            "giris_hata"
          );
        }
      }
    });
  }
};
