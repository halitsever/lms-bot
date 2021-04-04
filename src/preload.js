const { contextBridge, ipcRenderer } = require("electron");




contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    let validChannels = [
      "istek::ayarlar",
      "istek::guncelleme",
      "istek::ayarlar",
      "istek::dersekle",
      "istek::derskaldirma",
      "istek::dersekle_input",
      "veri::dersekle_input_verigir",
      "istek::uniayarla",
      "istek::uniayarlagonder",
      "istek::geridonus",
      "bilgiler::isim",
      "mesaj::girisbilgileri",
      "istek::kapat",
      "mesaj::log"
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  receive: (channel, func) => {
    let validChannels = [
      "bilgi::kayitligirisbilgileri",
      "bilgi::girisbilgileri",
      "bilgi::kayitligirisbilgileri",
      "veri::tumdersler",
      "mesaj::giris",
      "bilgi::unisite",
      "istek::kapat",
      "mesaj::log"
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});
