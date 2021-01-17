"use strict";
/*  
=================================Util==================================
*/
const Hesap = require("./uyeislemleri.js");
const ayarlar = require("../veri/ayarlar.json");
const zamanlama = require("util").promisify(setTimeout);
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
const dersler = ayarlar.dersler;
var ogrencino, ogrencisifre, ders_aktif;
ogrencino = ayarlar.kullanicibilgi.ogrencino;
ogrencisifre = ayarlar.kullanicibilgi.ogrencisifre;

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
      var uye = new Hesap(ogrencino, ogrencisifre, dersadi);
      await uye.oturumac();

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
    /**
     * Kullanıcının derse bağlantısından önce saat, gün ve ad kontrolü
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

      if (ayarlar.anliklog === true)
        console.log(
          `[${saat_toplam}] : [${gunler[gun]}] sunucu ders kontrolü yaptı, sunucu aktif ve kontrol yapmaya devam edecek, aktif ders oturumunda otomatik olarak bağlanacaksınız.`
        );
      if (dersler.length === 0)
        throw new Error(
          "Hata! Dersler ve ders saatleri eş değiller, lütfen ayarlar.json dosyanızı kontrol edin."
        );
      for (var i = 0; i < dersler.length; i++) {
        if (dersler[i].saat === saat_toplam) {
          if (dersler[i].gunu.toLowerCase() === gunler[gun].toLowerCase()) {
            console.log(
              `${dersler[i].adi} adlı dersinizin başlama saati geldi, sisteme giriş için istek gönderiliyor...`
            );
            ders_aktif = dersler[i].adi;
            girisyap(ders_aktif);
          }
        }
      }
    }
    var dongu = setInterval(kontrol, 10000);
  }
};
