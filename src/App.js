import React, { useState } from "react";

export default function App() {
  // State tanımları
  const [arsaM2, setArsaM2] = useState("");
  const [taks, setTaks] = useState("");
  const [kaks, setKaks] = useState("");
  const [cekmeOn, setCekmeOn] = useState("");
  const [cekmeYan, setCekmeYan] = useState("");
  const [cekmeArka, setCekmeArka] = useState("");
  const [daire2Adet, setDaire2Adet] = useState("");
  const [daire2M2, setDaire2M2] = useState("");
  const [daire3Adet, setDaire3Adet] = useState("");
  const [daire3M2, setDaire3M2] = useState("");
  const [hmaxKat, setHmaxKat] = useState("");
  const [ticariIstiyorum, setTicariIstiyorum] = useState(false);

  const [uyari, setUyari] = useState(null);
  const [sonuc, setSonuc] = useState(null);

  // Yardımcı fonksiyon: boş ve null kontrolü + sayıya çevirme
  const toFloat = (val) => {
    if (!val || val.trim() === "") return 0;
    return parseFloat(val.replace(",", ".")) || 0;
  };
  const toInt = (val) => {
    if (!val || val.trim() === "") return 0;
    return parseInt(val) || 0;
  };

  const hesapla = () => {
    setUyari(null);
    setSonuc(null);

    const arsa = toFloat(arsaM2);
    const taksVal = toFloat(taks);
    const kaksVal = toFloat(kaks);
    const co = toFloat(cekmeOn);
    const cy = toFloat(cekmeYan);
    const ca = toFloat(cekmeArka);

    // Kontroller
    if (arsa <= 0 || taksVal <= 0 || kaksVal <= 0) {
      setUyari("Arsa, TAKS ve KAKS pozitif ve boş olmamalıdır.");
      return;
    }
    if (taksVal > 0.4) {
      setUyari("TAKS 0.40'dan yüksek olamaz.");
      return;
    }
    if (kaksVal > 1.6) {
      setUyari("KAKS 1.60'dan yüksek olamaz.");
      return;
    }
    if (co < 0 || cy < 0 || ca < 0) {
      setUyari("Çekme mesafeleri negatif olamaz.");
      return;
    }

    // Arsa kenarı
    const arsaKenar = Math.sqrt(arsa);
    const netArsa = Math.max(0, (arsaKenar - co - ca) * (arsaKenar - 2 * cy));
    if (netArsa <= 0) {
      setUyari("Çekme mesafeleri arsa alanını sıfırlıyor veya negatif yapıyor.");
      return;
    }

    // Daire sayıları ve m2
    const d2Adet = toInt(daire2Adet);
    const d2M2 = toFloat(daire2M2);
    const d3Adet = toInt(daire3Adet);
    const d3M2 = toFloat(daire3M2);

    // En az bir daire tipi aktif olmalı
    const aktifDaireSayisi = (d2M2 > 0 ? d2Adet : 0) + (d3M2 > 0 ? d3Adet : 0);
    if (aktifDaireSayisi === 0) {
      setUyari("En az bir daire tipi için adet ve m² girin.");
      return;
    }

    const toplamDaireM2 = (d2M2 > 0 ? d2Adet * d2M2 : 0) + (d3M2 > 0 ? d3Adet * d3M2 : 0);

    const maxKat = toInt(hmaxKat);
    if (maxKat <= 0) {
      setUyari("Geçerli bir Hmax kat sayısı girin.");
      return;
    }

    const katBasinaDaire = 4;
    const maxDaireKatSiniri = maxKat * katBasinaDaire;

    let toplamDaire = aktifDaireSayisi;
    if (toplamDaire > maxDaireKatSiniri) {
      setUyari(`Daire sayısı Hmax sınırını aşıyor! Maks: ${maxDaireKatSiniri} adet.`);
      toplamDaire = maxDaireKatSiniri;
    }

    const brutInsaat = arsa * kaksVal;
    const netInsaat = brutInsaat * 0.9;

    let ticariAlanM2 = 0;
    let konutAlanM2 = netInsaat;
    if (ticariIstiyorum) {
      ticariAlanM2 = netInsaat * 0.2;
      konutAlanM2 = netInsaat * 0.8;
    }

    const otoparkAdet = Math.ceil(toplamDaire / 3);
    const suDeposuGerekli = toplamDaire > 30;

    const planNotlari = [];
    if (arsa >= 1000) planNotlari.push("Sarnıç kurulmalı (Arsa ≥ 1000 m²).");
    if (otoparkAdet > 0) planNotlari.push(`Otopark ihtiyacı: ${otoparkAdet} araç.`);
    if (suDeposuGerekli) planNotlari.push("30 daire üzeri 10 tonluk su deposu zorunlu.");
    if (arsa >= 500) planNotlari.push("En az 2 ağaç dikimi gerekir.");
    planNotlari.push("Yapı yaklaşma mesafeleri belediye takdirindedir.");

    setSonuc({
      arsa,
      netArsa: netArsa.toFixed(2),
      brutInsaat: brutInsaat.toFixed(2),
      netInsaat: netInsaat.toFixed(2),
      toplamDaire,
      maxKat,
      otoparkAdet,
      suDeposuGerekli,
      ticariAlanM2: ticariAlanM2.toFixed(2),
      konutAlanM2: konutAlanM2.toFixed(2),
      planNotlari,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-6 flex justify-center items-start">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-3xl w-full">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-8 text-center">
          İmar Hesaplama Modülü
        </h1>

        <div className="grid grid-cols-2 gap-5">
          <input
            type="number"
            placeholder="Arsa Alanı (m²) - Örn: 500"
            className="input-style"
            value={arsaM2}
            onChange={(e) => setArsaM2(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="TAKS - Örn: 0.40"
            className="input-style"
            value={taks}
            onChange={(e) => setTaks(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="KAKS - Örn: 1.60"
            className="input-style"
            value={kaks}
            onChange={(e) => setKaks(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Çekme Ön (m) - Örn: 3"
            className="input-style"
            value={cekmeOn}
            onChange={(e) => setCekmeOn(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Çekme Yan (m) - Örn: 3"
            className="input-style"
            value={cekmeYan}
            onChange={(e) => setCekmeYan(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Çekme Arka (m) - Örn: 3"
            className="input-style"
            value={cekmeArka}
            onChange={(e) => setCekmeArka(e.target.value)}
          />
          <input
            type="number"
            placeholder="2+1 Daire Adedi"
            className="input-style"
            value={daire2Adet}
            onChange={(e) => setDaire2Adet(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="2+1 Ortalama Net M²"
            className="input-style"
            value={daire2M2}
            onChange={(e) => setDaire2M2(e.target.value)}
          />
          <input
            type="number"
            placeholder="3+1 Daire Adedi"
            className="input-style"
            value={daire3Adet}
            onChange={(e) => setDaire3Adet(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="3+1 Ortalama Net M²"
            className="input-style"
            value={daire3M2}
            onChange={(e) => setDaire3M2(e.target.value)}
          />
          <input
            type="number"
            placeholder="Hmax Kat Sayısı (max kat)"
            className="input-style"
            value={hmaxKat}
            onChange={(e) => setHmaxKat(e.target.value)}
          />
          <div className="flex items-center space-x-2 ml-2">
            <input
              type="checkbox"
              id="ticari-checkbox"
              checked={ticariIstiyorum}
              onChange={() => setTicariIstiyorum(!ticariIstiyorum)}
              className="checkbox-style"
            />
            <label htmlFor="ticari-checkbox" className="text-gray-700 font-semibold">
              Ticari alan ister misiniz?
            </label>
          </div>
        </div>

        {uyari && (
          <div className="mt-6 p-4 bg-red-200 text-red-900 font-semibold rounded-md text-center">
            {uyari}
          </div>
        )}

        <button
          onClick={hesapla}
          className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition duration-300"
        >
          Hesapla
        </button>

        {sonuc && (
          <div className="mt-8 bg-indigo-50 rounded-xl p-6 text-indigo-900">
            <h2 className="text-2xl font-bold mb-4">Sonuçlar</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Brüt İnşaat Alanı: {sonuc.brutInsaat} m²</li>
              <li>Net Arsa Alanı (Çekme Mesafeleri sonrası): {sonuc.netArsa} m²</li>
              <li>Net İnşaat Alanı (Ortak Alan %10 sonrası): {sonuc.netInsaat} m²</li>
              <li>Toplam Daire Sayısı (max Hmax sınırı ile): {sonuc.toplamDaire}</li>
              <li>Maksimum Kat Sayısı: {sonuc.maxKat}</li>
              <li>Otopark Gereksinimi: {sonuc.otoparkAdet} araç</li>
              <li>Su Deposu Gerekli mi?: {sonuc.suDeposuGerekli ? "Evet" : "Hayır"}</li>
              {ticariIstiyorum && (
                <>
                  <li>Ticari Alan (Net İnşaatın %20'si): {sonuc.ticariAlanM2} m²</li>
                  <li>Konut Alanı (Net İnşaatın %80'i): {sonuc.konutAlanM2} m²</li>
                </>
              )}
            </ul>

            <div className="mt-6">
              <strong className="text-lg font-semibold">Plan Notları:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {sonuc.planNotlari.map((not, i) => (
                  <li key={i}>{not}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <style>{`
          .input-style {
            width: 100%;
            padding: 12px 14px;
            border-radius: 8px;
            border: 1.8px solid #cbd5e1;
            font-size: 16px;
            outline: none;
            transition: border-color 0.2s ease;
          }
          .input-style:focus {
            border-color: #5a67d8;
            box-shadow: 0 0 0 3px rgba(90,103,216,0.3);
          }
          .checkbox-style {
            width: 20px;
            height: 20px;
            cursor: pointer;
          }
        `}</style>
      </div>
    </div>
  );
      }
