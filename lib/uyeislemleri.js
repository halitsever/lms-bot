"use strict";
/*  
==============================Selenium============================
*/
const {
  Builder,
  By,
  Key,
  until,
  Capabilities,
  WebDriver
} = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chrome_ayarlari = new chrome.Options();

chrome_ayarlari
  .addArguments("--no-sandbox")
  .addArguments("--lang=tr")
  .addArguments("--disable-gpu")
  .addArguments("--log-level=3")
  .addArguments("--autoplay-policy=no-user-gesture-required");

const driver = new Builder()
  .forBrowser("chrome")
  .setChromeOptions(chrome_ayarlari)
  .build();
/*  
==============================Selenium==========================
*/

/*  
==============================Util==============================
*/
const zamanlama = require("util").promisify(setTimeout);
const ayarlar = require("../veri/ayarlar.json");
/*  
==============================Util==============================
*/

module.exports = class Hesap {
  constructor(kullaniciadi, sifre, dersadi) {
    this.kullaniciadi = kullaniciadi;
    this.sifre = sifre;
    this.dersadi = dersadi;
  }
  /**
   * Kullanıcının hesabını sisteme girdirmek için kullandığımız fonksiyon.
   * @param {String} öğrenci no aldirmak icin 
   * @param {String} kullanıcı sifresini aldirmak icin
   * @return Giriş yapılıp-yapılmadığına konsol çıktısı, hata verirse durdur.
  
  */
  async oturumac() {
    try {
      await driver.get(`${ayarlar.site}`);
      await driver.findElement(By.name("UserName")).sendKeys(this.kullaniciadi);
      await driver.findElement(By.id("btnLoginName")).click();
    } catch (e) {
      throw new Error("HATA:" + e);
    } finally {
      await driver.findElement(By.name("Password")).sendKeys(this.sifre);
      await driver.findElement(By.id("btnLoginPass")).click();
      await console.log(
        `${this.kullaniciadi} numaralı öğrenci no ve ${this.sifre} adlı şifre ile giriş denemesi yapıldı.`
      );
      var that = this;
      await driver.getTitle().then(function(baslik) {
        console.log(
          "Ayarlar.json dosyasından verilmiş olan kullanıcı adı ve şifre ile giriş yapılıyor..."
        );
        if (baslik.includes("Giriş - ALMS") === true)
          throw new Error(
            `${that.kullaniciadi} numaralı öğrenci no veya ${that.sifre} şifresi yanlış! `
          );
        console.log(
          `${that.kullaniciadi} numaralı öğrenci no ve ${that.sifre} adlı şifre ile giriş denemesi başarılı şekilde sonuçlandı, ders sayfasına aktarılıyor...`
        );
      });
    }
  }
  /**
   * Kullanıcının derse girmesi için kullandığımız fonksiyon.
   * @param {String} öğrenci no aldirmak icin 
   * @param {String} kullanıcı sifresini aldirmak icin
   * @param {String} belirlenmiş ders adını aldırmak için.
   * @return Derse giriş yapıldığına dair konsol çıktısı veya hata mesajı, hata mesajı verilirse program çalışmaya devam eder.
  
  */
  async dersegir() {
    try {
      console.log("Derse giriş sağlanıyor...");
      await driver.wait(
        until.elementLocated(
          By.className(
            "table table-striped table-bordered table-advance table-hover"
          )
        ),
        10000
      );

      await driver.findElement(By.linkText(`${this.dersadi}`)).catch(err => {
        throw new Error(
          "Derse bağlanılamadı, böyle bir ders bulunamadı ayarlar.json üzerinden kontrol edin!\nHata raporu:  " +
            err
        );
      });
      await driver.findElement(By.linkText(`${this.dersadi}`)).click();
      await driver.wait(
        until.elementLocated(By.className("page-content")),
        3000
      );
      await driver.findElement(By.linkText("Başladı")).catch(err => {
        throw new Error(
          "Derse bağlanılamadı, ders başlamamış olabilir!\nHata raporu:  " + err
        );
      });
      await driver.findElement(By.linkText("Başladı")).click();
      await console.log("Ders ile ilgili bağlantı yapılyıor...");
    } catch (e) {
      throw new Error("HATA:" + e);
    }
  }
  /**
   * Kullanıcının hesabını sistemden çıkarmak için kullandığımız kod.
   * @return Çıkış yapılıp-yapılmadığına konsol çıktısı.
  
  */
  async oturumukapat() {
    await driver.quit().catch(err => {
      if (err) throw new Error("Aktif bir oturum bulunamadı.");
    });
  }
};
