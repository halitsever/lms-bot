/*  
==============================Util==============================
*/
const events = require("events");
const aplikasyon = new events.EventEmitter();
const figlet = require("figlet");
const fs = require("fs");
const chromesurumubul = require("find-chrome-version");
/*  
==============================Util==============================
*/

/*  
===========================Degiskenler===========================
*/
var sayidegeri = 0;
/*  
===========================Degiskenler===========================
*/

aplikasyon.on("ready", () => {
  const chrome_driveri_dosyakonumu = "./chromedriver.exe";
  fs.access(chrome_driveri_dosyakonumu, err => {
    if (err) {
      (async function chrome_driveri_surumkontrol() {
        const chrome_driveri_surum = await chromesurumubul();
        var e = new Error(
          "Chrome driver bulunamadı!\nBu linke gidin: http://chromedriver.storage.googleapis.com/index.html\n" +
            chrome_driveri_surum +
            " numaralı sürümü indirin ve projenin ana klasörüne paslayın.\n\n"
        );
        e.name = "Chrome_driver_hatasi";
        throw e;
      })();
    } else {
      konsolbaslangic("Otomatik Ders");
    }
  });
});
aplikasyon.on("stop", () => {
  process.exit();
});

exports.on = function(event_adi) {
  if (!event_adi) throw new Error("Event adı boş kalamaz!");
  aplikasyon.emit(event_adi);
};

function konsolbaslangic(deger) {
  function anliksayi() {
    sayidegeri = sayidegeri + 1;
    return "\n[" + sayidegeri + "] ";
  }
  figlet(deger, function(err, data) {
    let cizgi = function() {
      figlet("============", (err, data) => {
        console.log(data);
      });
    };
    cizgi();
    console.log(data);
    console.log(
      anliksayi() +
        "Hata ve bug bildirimi için: github.com/murathasev" +
        anliksayi() +
        "Programı kullanarak sorumluluğun sizde olduğunu kabul etmiş sayılırsınız" +
        anliksayi() +
        "CTRL + C tuşlarına basarak anlık olarak tüm işlemleri sonlandırabilirsiniz" +
        anliksayi() +
        "Bir bardak çay ısmarlamak için: <sponsor linki>"
    );
    cizgi();
  });
}
