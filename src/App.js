import React, { useState } from "react";

export default function App() {
  // --- State ---
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
  const [sonuc, setSonuc] = useState(null);
  const [uyari, setUyari] = useState(null);

  // --- Yardımcı fonksiyonlar ---
  const toFloat = (val) => parseFloat(val.replace(",", ".")) || 0;
  const toInt = (val) => parseInt(val) || 0;

  const hesapla = () => {
    setUyari(null);
    setSonuc(null);

    const arsa = toFloat(arsaM2);
    const taksVal = toFloat(taks);
    const kaksVal = toFloat(kaks);
    const co = toFloat(cekmeOn);
    const cy = toFloat(cekmeYan);
    const ca = toFloat(cekmeArka);

    // Geçerlilik kontrolü
    if (!arsa || !taksVal || !kaksVal) {
      setUyari("Lütfen Arsa, TAKS ve KAKS değerlerini doğru giriniz.");
      return;
    }

    // Yönetmelik Örnek Kontrol: TAKS <= 0.4 ve KAKS <= 1.6 olsun
    if (taksVal > 0.4) {
      setUyari("TAKS değeri 0.40'dan yüksek olamaz (Yönetmelik 3. maddesi).");
      return;
    }
    if (kaksVal > 1.6) {
      setUyari("KAKS değeri 1.60'dan yüksek olamaz (Yönetmelik 4. maddesi).");
      return;
    }

    // Çekme mesafeleri toplamı arsa boyutuna göre mantıklı mı?
    const arsaKenar = Math.sqrt(arsa);
    const cekmeAlan = (co + ca) * arsaKenar + 2 * cy * arsaKenar;
    if (cekmeAlan >= arsa) {
      setUyari("Çekme mesafeleri arsa alanından büyük veya eşit olamaz.");
      return;
    }

    // Net arsa alanı (çekme mesafeleri düştükten sonra)
    const netArsa = arsa - cekmeAlan;

    // Brüt inşaat alanı
    const brutInsaat = arsa * kaksVal;

    // Net inşaat alanı ortak alan düşülerek (%10 ortak alan varsayıldı)
    const netInsaat = brutInsaat * 0.9;

    // Daire adetleri ve m2
    const d2Adet = toInt(daire2Adet);
    const d2M2 = toFloat(daire2M2);
    const d3Adet = toInt(daire3Adet);
    const d3M2 = toFloat(daire3M2);

    // Daire sayısı ve m2 opsiyonel kontrol: 0 veya boş ise yok sayılır
    const aktifDaireSayisi = (d2M2 > 0 ? d2Adet : 0) + (d3M2 > 0 ? d3Adet : 0);
    if (aktifDaireSayisi === 0) {
      setUyari("En az bir tip daire için adet ve m² giriniz.");
      return;
    }

    // Toplam daire m2 (kullanılan tipler üzerinden)
    const toplamDaireM2 = (d2M2 > 0 ? d2Adet * d2M2 : 0) + (d3M2 > 0 ? d3Adet * d3M2 : 0);

    // Hmax Kat kontrolü
    const maxKat = toInt(hmaxKat);
    if (maxKat <= 0) {
      setUyari("Geçerli Hmax kat sayısı giriniz.");
      return;
    }

    // Ortalama daire m2
    const ortDaireM2 = toplamDaireM2 / aktifDaireSayisi;

    // Maks kat sayısı ve kat başına 4 daire varsayalım
    const katBasinaDaire = 4;
    const maxDaireKatSiniri = maxKat * katBasinaDaire;

    // Yönetmelik uyumu: Daire sayısı max kat ve kat başına daire sınırına uyacak
    let toplamDaire = aktifDaireSayisi;
    if (toplamDaire > maxDaireKatSiniri) {
      setUyari(`Daire sayısı Hmax kat sınırını aşıyor! Maks: ${maxDaireKatSiniri} adet.`);
      toplamDaire = maxDaireKatSiniri;
    }

    // Otopark hesabı: her 3 daireye 1 araç
    const otoparkGerekli = Math.ceil(toplamDaire / 3);

    // Su deposu: 30 daire üzeri 10 tonluk su deposu zorunlu
    const suDeposuGerekli = toplamDaire > 30;

    // Ticari alan kontrolü
    let ticariAlanM2 = 0;
    let konutAlanM2 = 0;
    if (ticariIstiyorum) {
      ticariAlanM2 = netInsaat * 0.2;
      konutAlanM2 = netInsaat * 0.8;
    } else {
      konutAlanM2 = netInsaat;
    }

    // Plan notları
    const planNotlari = [];
    if (arsa >= 1000) planNotlari.push("Sarnıç kurulması gerekir (arsa ≥ 1000 m²).");
    if (otoparkGerekli > 0) planNotlari.push(`Otopark ihtiyacı: ${otoparkGerekli} araç.`);
    if (suDeposuGerekli) planNotlari.push("10 tonluk su deposu zorunlu (30 daire üzeri).");
    if (arsa >= 500) planNotlari.push("En az 2 ağaç dikimi gereklidir (arsa ≥ 500 m²).");
    planNotlari.push("Yapı yaklaşma mesafeleri belediye takdirindedir.");

    // Sonuçları set et
    setSonuc({
      arsa,
      netArsa: netArsa.toFixed(2),
      brutInsaat: brutInsaat.toFixed(2),
      netInsaat: netInsaat.toFixed(2),
      toplamDaire,
      maxKat,
      otoparkGerekli,
      suDeposuGerekli,
      ticariAlanM2: ticariAlanM2.toFixed(2),
      konutAlanM2: konutAlanM2.toFixed(2),
      planNotlari,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="max-w-xl w-full bg-white p-8 rounded-3xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">İmar Hesaplama Modülü</h1>

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            id="ticari-checkbox"
            checked={ticariIstiyorum}
            onChange={() => setTicariIstiyorum(!ticariIstiyorum)}
            className="checkbox-style"
          />
          <label htmlFor="ticari-checkbox" className="text-gray-700 font-medium">
            Ticari alan ister misiniz?
          </label>
        </div>

        {uyari && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{uyari}</div>
        )}

        <button
          onClick={hesapla}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold rounded-xl transition"
        >
          Hesapla
        </button>

        {sonuc && (
          <div className="mt-8 p-5 bg-gray-100 rounded-xl text-gray-800">
            <h2 className="text-xl font-bold mb-4">Sonuçlar</h2>
            <p>
              <strong>Brüt İnşaat Alanı:</strong> {sonuc.brutInsaat} m²
            </p>
            <p>
              <strong>Net Arsa Alanı (Çekme Mesafeleri sonrası):</strong> {sonuc.netArsa} m²
            </p>
            <p>
              <strong>Net İnşaat Alanı (Ortak Alan %10 sonrası):</strong> {sonuc.netInsaat} m²
            </p>
            <p>
              <strong>Toplam Daire Sayısı (max Hmax sınırı ile):</strong> {sonuc.toplamDaire}
            </p>
            <p>
              <strong>Maksimum Kat Sayısı:</strong> {sonuc.maxKat}
            </p>
            <p>
              <strong>Otopark Gereksinimi:</strong> {sonuc.otoparkGerekli} araç
            </p>
            <p>
              <strong>Su Deposu Gerekli mi?:</strong> {sonuc.suDeposuGerekli ? "Evet" : "Hayır"}
            </p>
            {ticariIstiyorum && (
              <>
                <p>
                  <strong>Ticari Alan (Net İnşaatın %20'si):</strong> {sonuc.ticariAlanM2} m²
                </p>
                <p>
                  <strong>Konut Alanı (Net İnşaatın %80'i):</strong> {sonuc.konutAlanM2} m²
                </p>
              </>
            )}
            <div className="mt-4">
              <strong>Plan Notları:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                {sonuc.planNotlari.map((not, i) => (
                  <li key={i}>{not}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <style>{`
          .input-style {
            padding: 10px 12px;
            border-radius: 8px;
            border: 1.5px solid #cbd5e1;
            outline: none
