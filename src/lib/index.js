// Derse giriş ve kullanıcı giriş işlevleri, tarayıcı ayarları ve işlevleri
const Hesap = require("./uyeislemleri");
// Derslerin anlık kontrolü yapılması ve ana üye işlemlerinden fonksiyonların çağırılması
const Ders = require("./derskontrol");
// ID-Sifre kontrolü
const Giriskontrol = require("./auth/giriskontrol");
module.exports = {
  Hesap: Hesap.prototype,
  Ders: Ders.prototype,
  Giriskontrol: Giriskontrol.prototype
};
