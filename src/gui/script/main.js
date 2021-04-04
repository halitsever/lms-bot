window.api.receive("mesaj::log", data => {
  let kayitli_loglar = document.querySelector(".log-kutusu").value;
  
  document.querySelector(".log-kutusu").innerHTML = kayitli_loglar + "\n" + data;
});

window.api.receive("bilgi::girisbilgileri", data => {
  document.querySelector(".adi").innerHTML = data.kullaniciadi;
});


window.api.receive("bilgi::kayitligirisbilgileri", data => {
  document.querySelector("#isim").value = data;
});

window.api.receive("bilgi::unisite", data => {
  document.querySelector("#siteadresi").value = data;
});

window.api.receive("veri::tumdersler", data => {
  var dersadi = document.createElement("p");
  dersadi.innerHTML =
    data.id + "" + data.dersadi + " " + data.ders_saati + " " + data.dersgunu;
  document.getElementById("dersler").appendChild(dersadi);
  var kaldirbutonu = document.createElement("a");
  kaldirbutonu.innerHTML =
    '<a style="color:red; font-size:10px; text-decoration:none;" href="#" onclick="kaldir(' +
    data.id +
    ')"><i class="fas fa-times-circle"></i></a>';
  document.getElementById("dersler").appendChild(kaldirbutonu);
});


function kapat() {
  window.api.send("istek::kapat");
}

function kaldir(dersid) {
  alert("Ders başarıyla kaldırıldı.");
  window.api.send("istek::derskaldirma", dersid);
}

function geridon() {
  window.api.send("istek::geridonus");
}

function guncelle() {
  window.api.send("istek::guncelleme");
}

function uniayarla() {
  window.api.send("istek::uniayarla");
}

function uniayarlagonder() {
  var data = document.querySelector("#siteadresi").value;
  if (!data.startsWith("http") === true)
    return alert("Geçerli bir website adresi girmeniz gerekir!");
  window.api.send("istek::uniayarlagonder", data);
  alert("Başarılı bir şekilde website adresi kaydedildi.");
}

function dersekle() {
  window.api.send("istek::dersekle");
}

function ayarlar() {
  window.api.send("istek::ayarlar");
}

function dersekle_input() {
  window.api.send("istek::dersekle_input");
}

function dersekle_input_verigir() {
  let dersadi = document.querySelector("#dersadi").value;
  let ders_saati = document.querySelector("#dersvakti").value;
  let dersgunu = document.querySelector("#dersgunu").value;
  let veriler = {
    dersadi: dersadi,
    ders_saati: ders_saati,
    dersgunu: dersgunu
  };
  if (
    veriler.dersadi === "" ||
    veriler.dersgunu === "" ||
    veriler.ders_saati === ""
  )
    return alert(
      "Bilgilerini hiç biri boş kalamaz! Örnek kullanım: Ders adı(Güz Dönemi) 11:00 Pazartesi"
    );
  window.api.send("veri::dersekle_input_verigir", veriler);
  veriler = null;
}

async function gonder() {
  let buton = document.getElementById("buton");
  let isim = document.querySelector("#isim");
  let sifre = document.querySelector("#sifre");

  if (isim.value === "" || sifre.value === "") {
    alert("Şifre ve kullanıcı adı boş kalamaz!");
    throw new Error();
  }
  var bilgiler = {
    kullaniciadi: isim.value,
    kullanicisifre: sifre.value
  };

  window.api.send("bilgiler::isim", bilgiler);
}

window.api.receive("mesaj::giris", data => {
  if (data === "giris_hata") {
    var mesaj_yazisi = document.querySelector(".mesaj");
    mesaj_yazisi.style.color = "red";
    mesaj_yazisi.innerHTML =
      "● Giriş yapılamadı!<br>Ayarlar üzerinden öğrenci no, şifre ve siteyi kontrol edin!";
    window.api.send("mesaj::girisbilgileri", "giris_hata");
  }
  if (data === "giris_basari") {
    var mesaj_yazisi = document.querySelector(".mesaj");
    mesaj_yazisi.style.color = "green";
    mesaj_yazisi.innerHTML =
      "● Giriş başarılı sonuçlandı<br>aktif ders olduğunda program yerinize otomatik bağlanacak.";
    window.api.send("mesaj::girisbilgileri", "giris_basari");
  }
});
