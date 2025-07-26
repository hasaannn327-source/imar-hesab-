// ✅ Güncel App.js (eski koda yeni özellikler eklendi)

import React, { useState } from "react"; import jsPDF from "jspdf"; import html2canvas from "html2canvas";

export default function App() { const [arsaM2, setArsaM2] = useState(0); const [taks, setTaks] = useState(0); const [kaks, setKaks] = useState(0); const [cekmeOn, setCekmeOn] = useState(5); const [cekmeYan, setCekmeYan] = useState(5); const [cekmeArka, setCekmeArka] = useState(5); const [planNotlariniGoster, setPlanNotlariniGoster] = useState(false); const [uygunlukMesaji, setUygunlukMesaji] = useState("");

const netParselM2 = arsaM2 - (cekmeOn + cekmeArka) * Math.sqrt(arsaM2) - (2 * cekmeYan * Math.sqrt(arsaM2)); const insaatAlani = kaks * netParselM2; const ticariAlani = insaatAlani * 0.2; const konutAlani = insaatAlani * 0.8; const daireSayisi = Math.floor(konutAlani / 120); const otoparkIhtiyaci = Math.ceil(daireSayisi / 3); const suDeposuGerekli = daireSayisi > 30;

const uygunlukKontrol = () => { let mesaj = ""; if (taks > 0.4) mesaj += "Taks değeri %40'ı geçemez. Madde: 19\n"; if (kaks > 2) mesaj += "Kaks değeri 2'yi geçemez. Madde: 20\n"; if (arsaM2 > 1000 && otoparkIhtiyaci === 0) mesaj += "1000 m² üzerindeki arsalar için otopark zorunludur. Madde: 57\n"; if (!cekmeOn || !cekmeYan || !cekmeArka) mesaj += "Çekme mesafeleri belirtilmemiş. Belediye belirler. Madde: 44\n"; setUygunlukMesaji(mesaj || "✅ Girdiğiniz tüm değerler yönetmeliğe uygundur."); };

return ( <div className="p-4 space-y-4 max-w-xl mx-auto"> <h1 className="text-xl font-bold">İmar Hesap Modülü</h1>

<div className="grid grid-cols-2 gap-2">
    <input
      type="number"
      placeholder="Arsa m²"
      onChange={(e) => setArsaM2(Number(e.target.value))}
      className="border p-2"
    />
    <input
      type="number"
      placeholder="TAKS"
      onChange={(e) => setTaks(Number(e.target.value))}
      className="border p-2"
    />
    <input
      type="number"
      placeholder="KAKS"
      onChange={(e) => setKaks(Number(e.target.value))}
      className="border p-2"
    />
    <input
      type="number"
      placeholder="Ön Çekme (m)"
      onChange={(e) => setCekmeOn(Number(e.target.value))}
      className="border p-2"
    />
    <input
      type="number"
      placeholder="Yan Çekme (m)"
      onChange={(e) => setCekmeYan(Number(e.target.value))}
      className="border p-2"
    />
    <input
      type="number"
      placeholder="Arka Çekme (m)"
      onChange={(e) => setCekmeArka(Number(e.target.value))}
      className="border p-2"
    />
  </div>

  <button onClick={uygunlukKontrol} className="bg-blue-500 text-white px-4 py-2 rounded">
    Yönetmelik Uygunluk Kontrolü Yap
  </button>

  {uygunlukMesaji && (
    <div className="bg-gray-100 p-3 rounded border border-gray-300 whitespace-pre-wrap">
      {uygunlukMesaji}
    </div>
  )}

  <div className="bg-green-100 p-3 rounded">
    <p><strong>İnşaat Alanı:</strong> {insaatAlani.toFixed(2)} m²</p>
    <p><strong>Ticari Alan:</strong> {ticariAlani.toFixed(2)} m² (%20)</p>
    <p><strong>Konut Alanı:</strong> {konutAlani.toFixed(2)} m² (%80)</p>
    <p><strong>Daire Sayısı (120m²):</strong> {daireSayisi}</p>
    <p><strong>Otopark İhtiyacı:</strong> {otoparkIhtiyaci} araç</p>
    {suDeposuGerekli && <p className="text-red-500">10 tonluk su deposu gerekli (30+ daire).</p>}
  </div>

  <label className="flex items-center gap-2">
    <input type="checkbox" onChange={(e) => setPlanNotlariniGoster(e.target.checked)} />
    Plan Notlarını Göster
  </label>

  {planNotlariniGoster && (
    <div className="bg-yellow-100 p-3 rounded">
      <p>• TAKS/KAKS net parsel üzerinden hesaplanır.</p>
      <p>• Otopark: 3 daireye 1 araç.</p>
      <p>• Bodrum kat emsale dahildir.</p>
      <p>• Zemin kat ticari olabilir (isteğe bağlı).</p>
      <p>• 1000 m² üzeri parsellerde otopark zorunludur.</p>
      <p>• Yapı yaklaşma mesafeleri: Belediye belirler.</p>
    </div>
  )}
</div>

); }

        
