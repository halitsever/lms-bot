window.api.receive("mesaj::log", data => {
  let log_kutusu = document.querySelector(".log-kutusu");
  if (log_kutusu) {
    let kayitli_loglar = document.querySelector(".log-kutusu").value;

    document.querySelector(".log-kutusu").innerHTML =
      kayitli_loglar + "\n" + data;
  }
});

window.api.receive("bilgi::girisbilgileri", data => {
  let adi = document.querySelector(".adi");
  if (adi) {
    document.querySelector(".adi").innerHTML = data.kullaniciadi;
  }
});

window.api.receive("bilgi::kayitligirisbilgileri", data => {
  let isim = document.querySelector("#isim");
  if (isim) {
    document.querySelector("#isim").value = data;
  }
});

window.api.receive("bilgi::unisite", data => {
  let siteadresi = document.querySelector("#siteadresi");
  if (siteadresi) {
    document.querySelector("#siteadresi").value = data;
  }
});

window.api.receive("veri::tumdersler", async data => {
  var yuklenmismi = document.querySelector(".yuklendi");
  if (!yuklenmismi) {
    var dersadi = document.createElement("p");
    dersadi.innerHTML =
      data.id + "" + data.dersadi + " " + data.ders_saati + " " + data.dersgunu;
    document.getElementById("dersler-icerik").appendChild(dersadi);
    var kaldirbutonu = document.createElement("a");
    kaldirbutonu.innerHTML =
      '<a style="color:red; font-size:10px; text-decoration:none;" href="#" onclick="kaldir(' +
      data.id +
      ')"><i class="fas fa-times-circle"></i></a>';
    document.getElementById("dersler-icerik").appendChild(kaldirbutonu);
  }
});

window.api.receive("veri::yuklendi", async data => {
  var yuklendi = await document.createElement("a");
  yuklendi.classList.add("yuklendi");
  document.getElementById("dersler-icerik").appendChild(yuklendi);
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
  let siteadresi = document.querySelector("#siteadresi");
  if (siteadresi) {
    var data = document.querySelector("#siteadresi").value;
    if (!data.startsWith("http") === true)
      return alert("Geçerli bir website adresi girmeniz gerekir!");
    window.api.send("istek::uniayarlagonder", data);
    alert("Başarılı bir şekilde website adresi kaydedildi.");
  }
}

function dersekle() {
  window.api.send("istek::dersekle");
}

function ayarlar() {
  window.api.send("istek::ayarlar");
}

function dersekle_input() {
  var onay_sekme = document.querySelector("#dersekle-onay");
  if (onay_sekme) {
    window.api.send("istek::dersekle_input");
  }
}

function dersekle_input_verigir() {
  let onay = document.querySelector("#dogrula-dersekleinput");
  if (onay) {
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
    alert("Başarıyla ders kaydı eklendi!");
  }
}

async function gonder() {
  let isim_kontrol = document.querySelector("#isim");
  if (isim_kontrol) {
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
}

window.api.receive("mesaj::giris", data => {
  let mesaj_kontrol = document.querySelector(".mesaj");
  if (mesaj_kontrol) {
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
  }
});
