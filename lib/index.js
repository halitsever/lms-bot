// Derse giriş ve kullanıcı giriş işlevleri, tarayıcı ayarları ve işlevleri
const Hesap = require("./uyeislemleri");
// Derslerin anlık kontrolü yapılması ve ana üye işlemlerinden fonksiyonların çağırılması
const Ders = require("./derskontrol");
// Aplikasyon eventları, dosya kontrolü
const Aplikasyon = require("./events");
module.exports = {
    Hesap: Hesap,
    Ders: Ders.prototype,
    Aplikasyon: Aplikasyon
}
