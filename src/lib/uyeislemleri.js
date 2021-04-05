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
const edge = require("selenium-webdriver/edge");
var path = require('msedgedriver');
const edge_ayarlari = new edge.Options();
const dir = require("path");
edge_ayarlari.addArguments("--lang=tr")

const driver = edge.Driver.createSession(edge_ayarlari);
/*  
==============================Selenium==========================
*/

/*  
==============================Util==============================
*/
const zamanlama = require("util").promisify(setTimeout);
const ayarlar = require("../veri/ayarlar.json");
const sqlite3 = require("sqlite-y");
const dbPath = dir.join(__dirname, "../bilgiler.sqlite");
const {
  BrowserWindow,
  webContents
} = require("electron");
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
      BrowserWindow.getAllWindows()[0].webContents.send(
        "mesaj::log",
        "Oturum lms ağına veri gönderildi. Deneme yapılıyor..."
      );
      const db = await sqlite3(dbPath);
      await db.unisite.find({ _orderBy: "id" }).then(records => {
        driver.get(records[0].unisite);
      });

      await driver.findElement(By.name("UserName")).sendKeys(this.kullaniciadi);
      await driver.findElement(By.id("btnLoginName")).click();
    } catch (e) {
      BrowserWindow.getAllWindows()[0].webContents.send(
        "mesaj::log",
        "Hata alındı duruyor: " + e
      );
      throw new Error("HATA:" + e);
    } finally {
      await driver.findElement(By.name("Password")).sendKeys(this.sifre);
      await driver.findElement(By.id("btnLoginPass")).click();
      BrowserWindow.getAllWindows()[0].webContents.send(
        "mesaj::log",
        "Oturum denemesi sonlandı, sonuçlar getiriliyor..."
      );
      await console.log(
        `${this.kullaniciadi} numaralı öğrenci no ve ${this.sifre} adlı şifre ile giriş denemesi yapıldı.`
      );
      var that = this;
      await driver.getTitle().then(function(baslik) {
        console.log(
          "Ayarlar.json dosyasından verilmiş olan kullanıcı adı ve şifre ile giriş yapılıyor..."
        );
        if (baslik.includes("Giriş - ALMS") === true) {
          BrowserWindow.getAllWindows()[0].webContents.send(
            "mesaj::log",
            "Şifre yanlış."
          );
          throw new Error(
            `${that.kullaniciadi} numaralı öğrenci no veya ${that.sifre} şifresi yanlış! `
          );
        }
        BrowserWindow.getAllWindows()[0].webContents.send(
          "mesaj::log",
          "Giriş başarılı!"
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
      BrowserWindow.getAllWindows()[0].webContents.send(
        "mesaj::log",
        "Ders algılandı, derse giriş yapılıyor..."
      );
      await driver.wait(
        until.elementLocated(
          By.className(
            "table table-striped table-bordered table-advance table-hover"
          )
        ),
        10000
      );

      await driver.findElement(By.linkText(`${this.dersadi}`)).catch(err => {
        BrowserWindow.getAllWindows()[0].webContents.send(
          "mesaj::log",
          "Derse bağlanılamadı hata raporu: " + err
        );
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
        BrowserWindow.getAllWindows()[0].webContents.send(
          "mesaj::log",
          "Ders adı doğru saat veya günde yanlışlık bulundu, çünkü ders başlamamış: " + err
        );
        throw new Error(
          "Derse bağlanılamadı, ders başlamamış olabilir!\nHata raporu:  " + err
        );
      });
      await driver.findElement(By.partialLinkText("Başladı")).click();
      await console.log("Ders ile ilgili bağlantı yapılyıor...");
      BrowserWindow.getAllWindows()[0].webContents.send(
        "mesaj::log",
        "Ders için bağlantı isteği gerçekleşti aktif derse giriş sağlanıyor..."
      );
    } catch (e) {
      BrowserWindow.getAllWindows()[0].webContents.send(
        "mesaj::log",
        "Hata alındı: " + e
      );
      throw new Error("HATA:" + e);
    }
  }
  /**
   * Kullanıcının hesabını sistemden çıkarmak için kullandığımız kod.
   * @return Çıkış yapılıp-yapılmadığına konsol çıktısı.
  
  */
  async oturumukapat() {
    await driver.quit().catch(err => {
      BrowserWindow.getAllWindows()[0].webContents.send(
        "mesaj::log",
        "Aktif oturum bulunmuyor, sekmeyi kapatırken bir sorun oluşmuş olabilir. Bu hatanın bir çok nedeni var, issue açmayı unutmayın!."
      );
      if (err) throw new Error("Aktif bir oturum bulunamadı.");
    });
  }
};
