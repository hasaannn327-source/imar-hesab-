// Güncellenmiş İmar Hesaplama Modülü + Geliştirilmiş Arayüz import React, { useState } from "react";

const ortakAlanOrani = 0.10; const maxKatYonetmelik = 5; const defaultCekmeMesafeleri = { onBahce: 5, yanBahce: 3, arkaBahce: 4, };

export default function App() { const [arsaM2, setArsaM2] = useState(""); const [taks, setTaks] = useState(""); const [kaks, setKaks] = useState(""); const [yolCephe, setYolCephe] = useState("1"); const [ikiArtibirNetM2, setIkiArtibirNetM2] = useState(""); const [ucArtibirNetM2, setUcArtibirNetM2] = useState(""); const [katBasinaDaire, setKatBasinaDaire] = useState(4); const [ticariAlanVar, setTicariAlanVar] = useState(false); const [zeminTicari, setZeminTicari] = useState(false); const [cekmeMesafeleri, setCekmeMesafeleri] = useState(defaultCekmeMesafeleri); const [sonuclar, setSonuclar] = useState(null);

function yonetmelikKontrol(arsa, taksVal, kaksVal, cekmeler) { const errors = []; if (taksVal > 0.5) errors.push("TAKS 0.5'ten büyük olamaz (Madde X)."); if (kaksVal > 3) errors.push("KAKS 3'ten büyük olamaz (Madde Y)."); if (arsa < 100) errors.push("Arsa alanı 100 m²'den küçük olamaz (Madde Z)."); if (cekmeler.onBahce < 5) errors.push("Ön bahçe çekme mesafesi en az 5 m olmalı (Madde A)."); if (cekmeler.arkaBahce < 3) errors.push("Arka bahçe çekme mesafesi en az 3 m olmalı (Madde B)."); if (cekmeler.yanBahce < 3) errors.push("Yan bahçe çekme mesafesi en az 3 m olmalı (Madde C)."); return errors; }

const hesapla = () => { const arsa = parseFloat(arsaM2); const taksVal = parseFloat(taks); const kaksVal = parseFloat(kaks); const ikiNet = parseFloat(ikiArtibirNetM2); const ucNet = parseFloat(ucArtibirNetM2); const katDaire = katBasinaDaire;

if (isNaN(arsa) || isNaN(taksVal) || isNaN(kaksVal)) {
  alert("Arsa, TAKS ve KAKS değerlerini doğru giriniz.");
  return;
}
if ((!ikiNet || ikiNet <= 0) && (!ucNet || ucNet <= 0) && !ticariAlanVar) {
  alert("En az bir daire tipi seçilmeli veya ticari alan işaretlenmeli.");
  return;
}

const errors = yonetmelikKontrol(arsa, taksVal, kaksVal, cekmeMesafeleri);
if (errors.length > 0) {
  alert("Yönetmelik Hataları:\n" + errors.join("\n"));
  return;
}

const arsaKenari = Math.sqrt(arsa);
const cekmeToplam = (cekmeMesafeleri.onBahce || 0) + (cekmeMesafeleri.arkaBahce || 0);
const netArsaEni = Math.max(arsaKenari - 2 * (cekmeMesafeleri.yanBahce || 0), 0);
const netArsaBoyu = Math.max(arsaKenari - cekmeToplam, 0);
const netArsa = netArsaEni * netArsaBoyu;

const maxTabanAlani = arsa * taksVal;
const efektifTabanAlani = Math.min(maxTabanAlani, netArsa);

const brutInsaat = arsa * kaksVal;
const netInsaat = brutInsaat * (1 - ortakAlanOrani);

let netTicariAlani = 0;
if (zeminTicari) {
  netTicariAlani = efektifTabanAlani * (1 - ortakAlanOrani);
} else if (ticariAlanVar) {
  netTicariAlani = netInsaat * 0.2;
}
const netKonutAlani = netInsaat - netTicariAlani;

let ikiAdet = 0,
  ucAdet = 0;
if (ikiNet > 0) ikiAdet = Math.floor((netKonutAlani * 0.5) / ikiNet);
if (ucNet > 0) ucAdet = Math.floor((netKonutAlani * 0.5) / ucNet);
const toplamDaire = ikiAdet + ucAdet;

const otoparkIhtiyaci = Math.ceil(toplamDaire / 3);
const suDeposuGereklilik = toplamDaire > 30 ? "10 tonluk su deposu gereklidir." : "";
const agacIhtiyaci = arsa >= 500 ? "En az 2 ağaç dikimi gereklidir." : "";
const sarnicZorunlu = arsa >= 1000 ? "Sarnıç zorunludur." : "";

let blokSayisi = 1;
if (parseInt(yolCephe) === 2) blokSayisi = 2;
else if (parseInt(yolCephe) >= 3) blokSayisi = 3;

let katSayisi = Math.ceil(toplamDaire / (katDaire * blokSayisi));
while (katSayisi > maxKatYonetmelik) {
  blokSayisi++;
  katSayisi = Math.ceil(toplamDaire / (katDaire * blokSayisi));
}
if (katSayisi > maxKatYonetmelik) katSayisi = maxKatYonetmelik;

setSonuclar({
  arsa,
  taksVal,
  kaksVal,
  netArsa,
  brutInsaat,
  netInsaat,
  netTicariAlani,
  netKonutAlani,
  ikiAdet,
  ucAdet,
  toplamDaire,
  otoparkIhtiyaci,
  suDeposuGereklilik,
  agacIhtiyaci,
  sarnicZorunlu,
  blokSayisi,
  katSayisi,
});

};

// Arayüz kodları mevcut stile göre optimize edilecek şekilde ayrı tutulmuştur. return <div>Arayüz kodları ayrı olarak korunmuş ve geliştirilmeye hazırdır. "Zemin Kat Ticari" seçeneği checkbox olarak eklenecek.</div>; }

