import React, { useState } from "react";

export default function App() {
  // --- Girdi Durumları ---
  const [arsaM2, setArsaM2] = useState("");
  const [taks, setTaks] = useState("");
  const [kaks, setKaks] = useState("");
  const [cekme, setCekme] = useState({ on: 3, yan: 2, arka: 5 });
  const [blokSayisi, setBlokSayisi] = useState(2);
  const [katBasinaDaire, setKatBasinaDaire] = useState(4);
  const [maxKat, setMaxKat] = useState(5);
  const [ticariAlaniKullan, setTicariAlaniKullan] = useState(true);
  const [daireNetM2_2plus1, setDaireNetM2_2plus1] = useState("");
  const [daireNetM2_3plus1, setDaireNetM2_3plus1] = useState("");

  // --- Sabitler ---
  const ortakAlanOrani = 0.1;
  const otoparkKisiBasiArac = 3; // 3 daireye 1 otopark
  const sarnicLimiti = 30; // 30 daire üstü su deposu zorunlu
  const agacOrani = 10; // 10 m2 ye 1 ağaç

  // --- Sonuç Durumları ---
  const [hesaplandi, setHesaplandi] = useState(false);
  const [sonuc, setSonuc] = useState({
    netArsaM2: 0,
    brütInsaat: 0,
    netInsaat: 0,
    konutAlani: 0,
    ticariAlani: 0,
    daireSayisi2plus1: 0,
    daireSayisi3plus1: 0,
    toplamDaire: 0,
    maxDaireKatAdedi: 0,
    uyumsuzluklar: [],
    otoparkAdedi: 0,
    sarnicGereklimi: false,
    agacSayisi: 0,
  });

  // --- Hesapla fonksiyonu ---
  function hesapla() {
    // Inputlar sayı olarak alınır, boş veya NaN ise 0 yapılır
    const arsa = parseFloat(arsaM2) || 0;
    const taksVal = parseFloat(taks) || 0;
    const kaksVal = parseFloat(kaks) || 0;
    const onCekme = parseFloat(cekme.on) || 0;
    const yanCekme = parseFloat(cekme.yan) || 0;
    const arkaCekme = parseFloat(cekme.arka) || 0;
    const blok = blokSayisi || 1;
    const katDaire = katBasinaDaire || 1;
    const maxKatSayisi = maxKat || 1;
    const daireM2_2 = parseFloat(daireNetM2_2plus1) || 0;
    const daireM2_3 = parseFloat(daireNetM2_3plus1) || 0;

    if (!arsa || !taksVal || !kaksVal) {
      alert("Lütfen Arsa Alanı, TAKS ve KAKS değerlerini giriniz!");
      setHesaplandi(false);
      return;
    }

    // Arsa kenar varsayımı (kare arsa)
    const arsaKenar = Math.sqrt(arsa);

    // Net arsa ölçümü çekme mesafeleri dikkate alınarak
    const netGenislik = Math.max(0, arsaKenar - yanCekme * 2);
    const netDerinlik = Math.max(0, arsaKenar - onCekme - arkaCekme);
    const netArsa = netGenislik * netDerinlik;

    // Brüt ve net inşaat alanları
    const brutInsaat = arsa * kaksVal;
    const netInsaat = brutInsaat * (1 - ortakAlanOrani);

    // Ticari alan oranı opsiyonel
    const ticariOran = ticariAlaniKullan ? 0.2 : 0;
    const konutOran = 1 - ticariOran;

    const netKonutAlani = netInsaat * konutOran;
    const netTicariAlani = netInsaat * ticariOran;

    // Daire sayısı hesaplama
    // Eğer 2+1 m2 sıfır veya boş ise 0 daire say
    const daire2Adet = daireM2_2 > 0 ? Math.floor(netKonutAlani * 0.5 / daireM2_2) : 0;
    const daire3Adet = daireM2_3 > 0 ? Math.floor(netKonutAlani * 0.5 / daireM2_3) : 0;

    const toplamDaire = daire2Adet + daire3Adet;

    const maxDaireKatAdedi = maxKatSayisi * katDaire;

    // Yönetmelik kontrolü
    const uyumsuzluklar = [];
    if (taksVal > 0.4) uyumsuzluklar.push("TAKS 0.4'ü aşamaz!");
    if (maxKatSayisi > 5) uyumsuzluklar.push("Maksimum kat 5 olmalı!");
    if (netArsa <= 0) uyumsuzluklar.push("Çekme mesafeleri çok yüksek, net arsa kalmadı!");
    if (toplamDaire > maxDaireKatAdedi)
      uyumsuzluklar.push(
        `Toplam daire sayısı (${toplamDaire}) maksimum kat * kat başı daire (${maxDaireKatAdedi}) değerini aşıyor!`
      );

    // Otopark hesabı
    const otoparkAdedi = Math.ceil(toplamDaire / otoparkKisiBasiArac);

    // Su deposu gerekliliği
    const sarnicGereklimi = toplamDaire > sarnicLimiti;

    // Ağaç sayısı (toplam arsanın %10'u)
    const agacAlani = arsa * 0.1;
    const agacSayisi = Math.floor(agacAlani / agacOrani);

    setSonuc({
      netArsaM2: netArsa,
      brütInsaat: brutInsaat,
      netInsaat: netInsaat,
      konutAlani: netKonutAlani,
      ticariAlani: netTicariAlani,
      daireSayisi2plus1: daire2Adet,
      daireSayisi3plus1: daire3Adet,
      toplamDaire: toplamDaire,
      maxDaireKatAdedi: maxDaireKatAdedi,
      uyumsuzluklar: uyumsuzluklar,
      otoparkAdedi: otoparkAdedi,
      sarnicGereklimi: sarnicGereklimi,
      agacSayisi: agacSayisi,
    });
    setHesaplandi(true);
  }

  // --- SVG hesaplamalar ---
  const arsaKenar = Math.sqrt(parseFloat(arsaM2) || 0);
  const scale = 400 / (arsaKenar || 1);

  const netGenislik = Math.max(0, arsaKenar - 2 * (parseFloat(cekme.yan) || 0));
  const netDerinlik = Math.max(0, arsaKenar - (parseFloat(cekme.on) || 0) - (parseFloat(cekme.arka) || 0));

  const blokGenislik = (netGenislik / (blokSayisi || 1)) * scale * 0.9;
  const blokYukseklik = 50;
  const bloklar = [];
  for (let i = 0; i < blokSayisi; i++) {
    bloklar.push({
      x: (parseFloat(cekme.yan) || 0) * scale + i * (blokGenislik + 10),
      y: (parseFloat(cekme.on) || 0) * scale + 20,
      width: blokGenislik,
      height: blokYukseklik,
    });
  }

  return (
    <div style={{ maxWidth: 700, margin: "auto", fontFamily: "Arial, sans-serif", padding: 20 }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>İmar Hesaplama Modülü</h1>

      {/* Girdi alanları */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 15, marginBottom: 25 }}>
        <label style={{ flex: "1 1 200px" }}>
          Arsa Alanı (m²):
          <input
            type="number"
            value={arsaM2}
            onChange={(e) => setArsaM2(e.target.value)}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            min={50}
            placeholder="Örnek: 500"
          />
        </label>
        <label style={{ flex: "1 1 150px" }}>
          TAKS:
          <input
            type="number"
            value={taks}
            step={0.01}
            onChange={(e) => setTaks(e.target.value)}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            min={0}
            max={1}
            placeholder="Örnek: 0.40"
          />
        </label>
        <label style={{ flex: "1 1 150px" }}>
          KAKS:
          <input
            type="number"
            value={kaks}
            step={0.01}
            onChange={(e) => setKaks(e.target.value)}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            min={0}
            max={5}
            placeholder="Örnek: 1.20"
          />
        </label>

        <label style={{ flex: "1 1 150px" }}>
          Ön Çekme (m):
          <input
            type="number"
            value={cekme.on}
            onChange={(e) => setCekme({ ...cekme, on: e.target.value })}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            min={0}
          />
        </label>
        <label style={{ flex: "1 1 150px" }}>
          Yan Çekme (m):
          <input
            type="number"
            value={cekme.yan}
            onChange={(e) => setCekme({ ...cekme, yan: e.target.value })}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            min={0}
          />
        </label>
        <label style={{ flex: "1 1 150px" }}>
          Arka Çekme (m):
          <input
            type="number"
            value={cekme.arka}
            onChange={(e) => setCekme({ ...cekme, arka: e.target.value })}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            min={0}
          />
        </label>

        <label style={{ flex: "1 1 150px" }}>
          Blok Sayısı:
          <input
            type="number"
            value={blokSayisi}
            onChange={(e) => setBlokSayisi(Number(e.target.value))}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            min={1}
            max={5}
          />
        </label>
        <label style={{ flex: "1 1 150px" }}>
          Kat Başına Daire:
          <input
            type="number"
            value={katBasinaDaire}
            onChange={(e) => setKatBasinaDaire(Number(e.target.value))}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            min={1}
            max={8}
          />
        </label>
        <label style={{ flex: "1 1 150px" }}>
          Maksimum Kat:
          <input
            type="number"
            value={maxKat}
            onChange={(e) => setMaxKat(Number(e.target.value))}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            min={1}
            max={10}
          />
        </label>

        <label style={{ flex: "1 1 200px", display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="checkbox"
            checked={ticariAlaniKullan}
            onChange={() => setTicariAlaniKullan(!ticariAlaniKullan)}
          />
          Ticari Alan Kullanılsın mı?
        </label>

        <label style={{ flex: "1 1 200px" }}>
          2+1 Daire Ortalama Net M²:
          <input
            type="number"
            value={daireNetM2_2plus1}
            onChange={(e) => setDaireNetM2_2plus1(e.target.value)}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            min={0}
            placeholder="Boşsa 2+1 daire yok sayılır"
          />
        </label>

        <label style={{ flex: "1 1 200px" }}>
          3+1 Daire Ortalama Net M²:
          <input
            type="number"
            value={daireNetM2_3plus1}
            onChange={(e) => setDaireNetM2_3plus1(e.target.value)}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            min={0}
            placeholder="Boşsa 3+1 daire yok sayılır"
          />
        </label>
      </div>

      {/* Hesapla Butonu */}
      <button
        onClick={hesapla}
        style={{
          width: "100%",
          padding: 15,
          fontSize: 18,
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 10,
          cursor: "pointer",
          marginBottom: 30,
        }}
      >
        Hesapla
      </button>

      {/* SVG Arsa + Blok Yerleşim */}
      {arsaM2 && (
        <svg
          width={400}
          height={400}
          style={{ border: "2px solid #333", borderRadius: 8, background: "#fafafa", marginBottom: 25 }}
        >
          {/* Arsa sınırı */}
          <rect
            x={0}
            y={0}
            width={arsaKenar * scale}
            height={arsaKenar * scale}
            fill="#cce5ff"
            stroke="#004085"
            strokeWidth={2}
          />
          <text x={10} y={20} fontSize={14} fill="#004085">
            Arsa (Toplam {arsaM2} m²)
          </text>

          {/* Çekme mesafeleri */}
          <rect
            x={cekme.yan * scale}
            y={cekme.on * scale}
            width={(arsaKenar - 2 * cekme.yan) * scale}
            height={(arsaKenar - cekme.on - cekme.arka) * scale}
            fill="#d4edda"
            stroke="#155724"
            strokeWidth={2}
            opacity={0.7}
          />
          <text x={cekme.yan * scale
