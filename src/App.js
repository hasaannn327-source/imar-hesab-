import React, { useState } from "react"; import jsPDF from "jspdf"; import html2canvas from "html2canvas";

export default function App() { const [arsaM2, setArsaM2] = useState(0); const [taks, setTaks] = useState(0); const [kaks, setKaks] = useState(0); const [cekmeOn, setCekmeOn] = useState(0); const [cekmeYan, setCekmeYan] = useState(0); const [cekmeArka, setCekmeArka] = useState(0); const [toplamDaire, setToplamDaire] = useState(0); const [netInsaatAlani, setNetInsaatAlani] = useState(0); const [uygunlukMesaji, setUygunlukMesaji] = useState("");

const kontrolEt = () => { let hatalar = [];

// TAKS KAKS sınırı kontrol
if (taks > 0.40) hatalar.push("TAKS değeri maksimum %40 olabilir (Madde 19)");
if (kaks > 2.50) hatalar.push("KAKS değeri maksimum 2.50 olabilir (Madde 19)");

// Çekme mesafesi kontrolü
if (cekmeOn < 5) hatalar.push("Ön bahçe mesafesi minimum 5 m olmalıdır (Madde 19)");
if (cekmeYan < 3) hatalar.push("Yan bahçe mesafesi minimum 3 m olmalıdır (Madde 19)");
if (cekmeArka < 3) hatalar.push("Arka bahçe mesafesi minimum 3 m olmalıdır (Madde 19)");

// Otopark kontrolü
if (toplamDaire >= 1 && Math.ceil(toplamDaire / 3) < 1)
  hatalar.push("Her 3 daireye 1 otopark gereklidir (Madde 34)");

// Su deposu kontrolü
if (toplamDaire > 30)
  hatalar.push("30 daireyi aşıyorsa 10 tonluk su deposu zorunludur (Yönetmelik Eki)");

// Ticari/Konut oranı kontrolü
const netTicari = netInsaatAlani * 0.20;
const netKonut = netInsaatAlani * 0.80;
if (netTicari + netKonut !== netInsaatAlani)
  hatalar.push("Ticari ve konut alanı toplamı inşaat alanını aşmamalı (Yönetmelik Madde 21)");

if (hatalar.length > 0) {
  setUygunlukMesaji("❌ Uygun değil:\n" + hatalar.join("\n"));
} else {
  setUygunlukMesaji("✅ Girdiğiniz değerler yönetmeliğe uygundur.");
}

};

return ( <div className="p-6 max-w-xl mx-auto"> <h1 className="text-xl font-bold mb-4">İmar Yönetmeliği Kontrolü</h1>

<div className="grid gap-3">
    <input
      type="number"
      placeholder="Arsa m²"
      onChange={(e) => setArsaM2(Number(e.target.value))}
      className="border p-2"
    />
    <input
      type="number"
      placeholder="TAKS (örnek: 0.40)"
      onChange={(e) => setTaks(Number(e.target.value))}
      className="border p-2"
    />
    <input
      type="number"
      placeholder="KAKS (örnek: 2.00)"
      onChange={(e) => setKaks(Number(e.target.value))}
      className="border p-2"
    />
    <input
      type="number"
      placeholder="Ön çekme mesafesi (m)"
      onChange={(e) => setCekmeOn(Number(e.target.value))}
      className="border p-2"
    />
    <input
      type="number"
      placeholder="Yan çekme mesafesi (m)"
      onChange={(e) => setCekmeYan(Number(e.target.value))}
      className="border p-2"
    />
    <input
      type="number"
      placeholder="Arka çekme mesafesi (m)"
      onChange={(e) => setCekmeArka(Number(e.target.value))}
      className="border p-2"
    />
    <input
      type="number"
      placeholder="Toplam Daire Sayısı"
      onChange={(e) => setToplamDaire(Number(e.target.value))}
      className="border p-2"
    />
    <input
      type="number"
      placeholder="Toplam Net İnşaat Alanı (m²)"
      onChange={(e) => setNetInsaatAlani(Number(e.target.value))}
      className="border p-2"
    />
    <button
      onClick={kontrolEt}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Yönetmelik Uygunluk Kontrolü Yap
    </button>
  </div>

  {uygunlukMesaji && (
    <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
      <pre>{uygunlukMesaji}</pre>
    </div>
  )}
</div>

); }

        
