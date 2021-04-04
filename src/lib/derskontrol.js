"use strict";
/*  
=================================Util==================================
*/
const Hesap = require("./uyeislemleri.js");
const zamanlama = require("util").promisify(setTimeout);
const ayarlar = require("../veri/ayarlar.json");
const path = require("path");
const dbPath = path.join(__dirname, "../bilgiler.sqlite");
const sqlite3 = require("sqlite-y");
const {
  BrowserWindow,
  webContents
} = require("electron");
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
//   const db = await sqlite3(dbPath);
var ders_aktif;
/*  
==============================Degiskenler==============================
*/

module.exports = class Ders {
  kontrol() {
    /**
   * Kullanıcının derse bağlantısı için gerekli kısımlar.
   * @param {String} Kontrol fonksiyonu ile döndürdüğümüz ders adı  
   * @return Giriş yapılıp-yapılmadığına dair konsol çıktısı, hata verirse durdur.
  
  */
    async function girisyap(dersadi) {
      const db = await sqlite3(dbPath);
      db.bilgi.find({ _orderBy: "id" }).then(ogrenci => {
        giris(ogrenci);
        async function giris(ogrenciveri) {
          var uye = new Hesap("", "", ders_aktif);

          await uye
            .dersegir()
            .then(() => {
              console.log(
                "Derse giriş sağlandı! Aktif oturum: " +
                  ders_aktif +
                  "\nSayfanın açık kalacağı süre: 1 saat, o süreç içerisinde diğer derslerinizde kontrol altında olacak.\n"
              );
            })
            .catch(function(err) {
              console.log(
                "Derse giriş sağlanamadı, ders saatleri ve ders adını ayarlar.json üzerinden kontrol edin. Dersin başlamamış olabilir veya ertelenmiş olabilir.\nHata raporu:\n" +
                  err
              );
              uye.oturumukapat();
            })
            .finally(async () => {
              clearInterval(dongu);
              await zamanlama(3600000);
              await setInterval(dongu, 10000);
            });
        }
      });
    }
    /**
     * Kullanıcının derse bağlantısından önce saat, gün ve ad kontrolü ve clienta loglama
     * @return ders_aktif, void girisyap
     */
    function kontrol() {
      const tarih = new Date();

      gun = tarih.getDay();

      var saat, gun;

      var saat = tarih.getHours();

      saat = (saat < 10 ? "0" : "") + saat;

      var dakika = tarih.getMinutes();

      dakika = (dakika < 10 ? "0" : "") + dakika;

      var saat_toplam = saat + ":" + dakika;
      (async () => {
        const db = await sqlite3(dbPath);

        db.dersler.find({ _orderBy: "id" }).then(dersler => {
          if (ayarlar.anliklog === true)
          BrowserWindow.getAllWindows()[0].webContents.send(
            "mesaj::log",
 `[${saat_toplam}] : [${gunler[gun]}] sunucu ders kontrolü yaptı, sunucu aktif ve kontrol yapmaya devam edecek, aktif ders oturumunda otomatik olarak bağlanacaksınız.`
          );
          if (dersler.length === 0)
            throw new Error(
              "Hata! Dersler ve ders saatleri eş değiller, lütfen ayarlar.json dosyanızı kontrol edin."
            );
            //eski lib için düzeltme.

          console.info("Ders kayitlari: ", dersler);
          for (var i = 0; i < dersler.length; i++) {
            if (dersler[i].ders_saati === saat_toplam) {
              if (
                dersler[i].dersgunu.toLowerCase() === gunler[gun].toLowerCase()
              ) {
                BrowserWindow.getAllWindows()[0].webContents.send(
                  "mesaj::log",
                  `${dersler[i].dersadi} adlı dersinizin başlama saati geldi, sisteme giriş için istek gönderiliyor...`
                );
                ders_aktif = dersler[i].dersadi;
                girisyap(ders_aktif);
              }
            }
          }
        });
      })();
    }
    var dongu = setInterval(kontrol, 10000);
  }
};
