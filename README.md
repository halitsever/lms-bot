<p align="center">
<p align="center" href="#">
 <img alt="lms otomatik ders" src="https://i.ibb.co/sjPG3ZV/Yeni-Proje.png">
</p>

<h1 align="center">
Lms Otomatik Ders
<br>
<a target="_blank" href="https://www.codefactor.io/repository/github/murathasev/lms-otomatik-ders/issues"><img src="https://img.shields.io/codefactor/grade/github/murathasev/lms-otomatik-ders"></a>
<img src="https://img.shields.io/badge/Version-0.0.1-blue">
</h1> 

## Sorumluluk
Bu proje eğitim adına daha efektif düşünmek amacıyla yapılmıştır, kullanılmasından dolayı oluşabilecek sorumluluk yine kullanıcının kendisindedir.
<br>Herhangi bir rahatsızlık duyulması halinde dunyayuvarlakmuratbabandir@gmail.com adresinden iletişime geçerseniz yayından kaldırılacaktır.

## Ayarlar

Kurulum ve çalıştırmadan önce dersleri, derslerin saatlerini ve derslerin günlerini ayarlar.json dosyasından tanımlamanız gerekmekte.
````json
{
  "site": "https://lms.universitem.com",
  "anliklog": true,
  "kullanicibilgi": {
    "ogrencino": "31000031",
    "ogrencisifre": "guvenilirsifrem123456789"
  },
  "dersler": [
  {"adi":"Fizik", "saat":"18:49", "gunu":"Salı" },
  {"adi":"Matematik", "saat":"14:12", "gunu":"Cumartesi"}
  ]
}

````

Örnek bir ders girdisi bu şekilde sırasıyla olmalıdır.
````json
 {"adi":"Fizik (2020-2021 Uzaktan Eğitim Güz Dönemi)", "saat":"18:49", "gunu":"Salı" },
 {"adi":"Matematik (2020-2021 Uzaktan Eğitim Güz Dönemi)", "saat":"14:12", "gunu":"Pazartesi"},
 {"adi":"Türk Dili ve Edebiyatı (2020-2021 Uzaktan Eğitim Güz Dönemi)", "saat":"14:12", "gunu":"Cumartesi"},
 {"adi":"Yabancı Dil-I (2020-2021 Uzaktan Eğitim Güz Dönemi)"}

````

eğer başka bir ders eklemek isterseniz 
````json
{
"adi":"Fizik (2020-2021 Uzaktan Eğitim Güz Dönemi)", 
"saat":"00:00", 
"gunu":"Pazartesi" 
} 

````
```adi``` Dersinizin sistemde görünen tam adı, ders programınızdaki değil<br>
```saat``` Dersinizin saati, sisteme göre 2 dakika geç girmeniz daha iyi olur hocalar kaynaklı gecikme yaşanabilir<br>
```gunu``` Dersinizin verildiği gün<br>
şeklinde ekleyebilirsiniz, sadece sondaki değere virgül gelmeyecek aynı şeyler parantez dışı içinde geçerli örneğin<br>
````json

{"adi":"a", "saat":"00:00", "gunu":"Pazar"}, Virgül var
{"adi":"b", "saat":"01:00", "gunu":"Pazar"}, Virgül var
{"adi":"c", "saat":"02:00", "gunu":"Pazar"} Son satırda virgül yok
````
Eğer nasıl yapılacağından hala emin değilseniz proje içerisindeki [ornek_sema.json](https://github.com/murathasev/lms-otomatik-ders/blob/main/veri/ornek_sema.json) 'a bakabilirsiniz.

## Windows 
Şuanlık yok, geliştirme sürecine destek vermek istiyorsanız forklayıp electron/formapplication ile bir gui hazırlayarak işe başlayabilirsiniz :) Sonra merge isteği atarsınız ve projeye dahil olursunuz.

Yine de buna rağmen CLI olarak kullanmak isterseniz projeyi bilgisayarınıza indirip `node index.js` komutu ile çalıştırmanız yeterli olacaktır. 


## 7/24 çalışması için Heroku üzerinde kurulumu

Eğer ki projenin sürekli olarak aktif kalmasını istiyorsanız ve bilgisayarınızda kullanmak istemiyorsanız bunun için heroku üzerinden hostlamanız gerekmekte.<br>
[Create New App | Heroku](https://dashboard.heroku.com/new-app)<br>
adresine kayıt olun ardından new-create app adımlarını izleyin, isime herhangi bir içerik girebilirsiniz region kısmını Europe olarak ayarlayın ve create app butonuna tıklatın.<br>
[Personal apps | Heroku](https://dashboard.heroku.com/apps)<br>
Bu linkten kendi belirlemiş olduğunuz uygulamaya tıklatın, bu github reposunu forklayın ve gizliye alın **(şifre güvenliği için şart!)** 

Deploy sekmesinden github'ı seçin ve çubuğa repo adını yazın. 
Settings sekmesine gelin ve buildpacks kısmından add buildpack basın<br>
https://github.com/heroku/heroku-buildpack-chromedriver <br>
https://github.com/heroku/heroku-buildpack-google-chrome <br>
repolarının linklerini kutucuğa yapıştırın (2 tane olacak)

Aynı sekmeden config vars kısmına gelin ve Reveal config vars butonuna basın 
Add seçeneğine basıp name kısmına TZ tam karşısındaki kutucuğa da Europe/Istanbul yazın (Heroku'nun saat dilimini TR ile değiştiriyoruz.)
![lms otomatik derse katılım](https://i.ibb.co/B4q9Zks/Ekran-Al-nt-s.png)
ayarlarınız bu şekilde olmalı.

Ardından deploy sekmesine tekrar girin ve tekrardan deploy app diyin, artık üst sekmeden More > view logs üzerinden uygulamanızın çalışıp/çalışmadığını kontrol edebilirsiniz.


## Notlar
Derse bağlantı yaşandıktan sonra siz tekrardan girmeyin, sistem oturumunuzu iptal ediyor ve sizi sistemden atıyor. <br>
Kullanılan teknolojiler: <br>Node.js<br>Selenium<br>Chrome Web Driver<br>

<p align="center">;)</p>
<p align="center">
<img src="https://i.ibb.co/XSgGwc1/tumblr-8889736458387c9182f7c74fc0118e8e-f6b2fd11-640.png" alt="lms online class meme">
</p>
</p>
