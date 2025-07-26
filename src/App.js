import React, { useState } from "react";

export default function App() {
  // --- Girdi Durumları ---
  const [arsaM2, setArsaM2] = useState(500);
  const [taks, setTaks] = useState(0.4);
  const [kaks, setKaks] = useState(1.2);
  const [cekme, setCekme] = useState({ on: 3, yan: 2, arka: 5 });
  const [blokSayisi, setBlokSayisi] = useState(2);
  const [katBasinaDaire, setKatBasinaDaire] = useState(4);
  const [maxKat, setMaxKat] = useState(5);
  const [ticariAlaniKullan, setTicariAlaniKullan] = useState(true);
  const [daireNetM2, setDaireNetM2] = useState(110);

  // --- Sabitler ---
  const ortakAlanOrani = 0.1;
  const otoparkKisiBasiArac = 3; // 3 daireye 1 otopark
  const sarnicLimiti = 30; // 30 daire üstü su deposu zorunlu
  const agacOrani = 10; // 10 m2 ye 1 ağaç

  // --- Hesaplamalar ---
  const arsaKenar = Math.sqrt(arsaM2);
  const netGenislik = Math.max(0, arsaKenar - cekme.yan - cekme.yan);
  const netDerinlik = Math.max(0, arsaKenar - cekme.on - cekme.arka);
  const netArsaM2 = netGenislik * netDerinlik;

  const brütInsaat = arsaM2 * kaks;
  const netInsaat = brütInsaat * (1 - ortakAlanOrani);

  const ticariOran = ticariAlaniKullan ? 0.2 : 0;
  const konutOran = 1 - ticariOran;

  const netKonutAlani = netInsaat * konutOran;
  const netTicariAlani = netInsaat * ticariOran;

  // Daire sayısı
  const daireSayisi = Math.floor(netKonutAlani / daireNetM2);
  // Maks kat ve kat başı daireye göre max daire hesapla
  const maxDaireKatAdedi = maxKat * katBasinaDaire;

  // Yönetmelik kontrolü
  const uyumsuzluklar = [];
  if (taks > 0.4) uyumsuzluklar.push("TAKS 0.4'ü aşamaz!");
  if (maxKat > 5) uyumsuzluklar.push("Maksimum kat 5 olmalı!");
  if (netArsaM2 <= 0) uyumsuzluklar.push("Çekme mesafeleri çok yüksek, net arsa kalmadı!");

  if (daireSayisi > maxDaireKatAdedi)
    uyumsuzluklar.push(`Daire sayısı (${daireSayisi}) maksimum kat * kat başı daire (${maxDaireKatAdedi}) değerini aşıyor!`);

  // Otopark hesabı
  const otoparkAdedi = Math.ceil(daireSayisi / otoparkKisiBasiArac);

  // Su deposu
  const sarnicGereklimi = daireSayisi > sarnicLimiti;

  // Ağaç sayısı (toplam alanın %10'u ağaç alanı)
  const agacAlani = arsaM2 * 0.1;
  const agacSayisi = Math.floor(agacAlani / agacOrani);

  // SVG ölçek
  const svgSize = 400;
  const scale = svgSize / arsaKenar;

  // Blok boyutları ve konumları
  const blokGenislik = (netGenislik / blokSayisi) * scale * 0.9;
  const blokYukseklik = 50;
  const bloklar = [];
  for (let i = 0; i < blokSayisi; i++) {
    bloklar.push({
      x: cekme.yan * scale + i * (blokGenislik + 10),
      y: cekme.on * scale + 20,
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
            onChange={(e) => setArsaM2(Number(e.target.value))}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            min={50}
          />
        </label>
        <label style={{ flex: "1 1 150px" }}>
          TAKS:
          <input
            type="number"
            value={taks}
            step={0.01}
            onChange={(e) => setTaks(Number(e.target.value))}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            min={0}
            max={1}
          />
        </label>
        <label style={{ flex: "1 1 150px" }}>
          KAKS:
          <input
            type="number"
            value={kaks}
            step={0.01}
            onChange={(e) => setKaks(Number(e.target.value))}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            min={0}
            max={5}
          />
        </label>
        <label style={{ flex: "1 1 150px" }}>
          Ön Çekme (m):
          <input
            type="number"
            value={cekme.on}
            onChange={(e) => setCekme({ ...cekme, on: Number(e.target.value) })}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            min={0}
          />
        </label>
        <label style={{ flex: "1 1 150px" }}>
          Yan Çekme (m):
          <input
            type="number"
            value={cekme.yan}
            onChange={(e) => setCekme({ ...cekme, yan: Number(e.target.value) })}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            min={0}
          />
        </label>
        <label style={{ flex: "1 1 150px" }}>
          Arka Çekme (m):
          <input
            type="number"
            value={cekme.arka}
            onChange={(e) => setCekme({ ...cekme, arka: Number(e.target.value) })}
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
        <label style={{ flex: "1 1 150px", display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="checkbox"
            checked={ticariAlaniKullan}
            onChange={() => setTicariAlaniKullan(!ticariAlaniKullan)}
          />
          Ticari Alan Kullanılsın mı?
        </label>
        <label style={{ flex: "1 1 150px" }}>
          Ortalama Daire Net M²:
          <input
            type="number"
            value={daireNetM2}
            onChange={(e) => setDaireNetM2(Number(e.target.value))}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            min={10}
            max={200}
          />
        </label>
      </div>

      {/* SVG Arsa + Blok Yerleşim */}
      <svg
        width={svgSize}
        height={svgSize}
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
          width={(arsaKenar - cekme.yan - cekme.yan) * scale}
          height={(arsaKenar - cekme.on - cekme.arka) * scale}
          fill="#d4edda"
          stroke="#155724"
          strokeWidth={2}
          opacity={0.7}
        />
        <text
          x={cekme.yan * scale + 10}
          y={cekme.on * scale + 20}
          fontSize={14}
          fill="#155724"
        >
          Net Arsa (yaklaşık {Math.round(netArsaM2)} m²)
        </text>

        {/* Bloklar */}
        {bloklar.map((blok, i) => (
          <rect
            key={i}
            x={blok.x}
            y={blok.y}
            width={blok.width}
            height={blok.height}
            fill="#007bff"
            stroke="#004085"
            strokeWidth={2}
            rx={6}
            ry={6}
          />
        ))}

        {/* Blok numaraları */}
        {bloklar.map((blok, i) => (
          <text
            key={"text" + i}
            x={blok.x + blok.width / 2}
            y={blok.y + blok.height / 2 + 5}
            fontSize={16}
            fill="#fff"
            fontWeight="bold"
            textAnchor="middle"
          >
            {i + 1}
          </text>
        ))}
      </svg>

      {/* Sonuçlar */}
      <div style={{ background: "#f9f9f9", padding: 20, borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h3>Hesap Sonuçları</h3>
        {uyumsuzluklar.length === 0 ? (
          <>
            <p>Brüt İnşaat Alanı: <b>{brütInsaat.toFixed(2)} m²</b></p>
            <p>Net İnşaat Alanı (Ortak Alan %10 çıkarıldı): <b>{netInsaat.toFixed(2)} m²</b></p>
            <p>Konut Alanı: <b>{netKonutAlani.toFixed(2)} m²</b></p>
            <p>Ticari Alanı: <b>{netTicariAlani.toFixed(2)} m²</b></p>
            <p>Daire Sayısı (Ortalama {daireNetM2} m²): <b>{daireSayisi}</b></p>
            <p>Maksimum Kat * Kat Başına Daire: <b>{maxDaireKatAdedi}</b></p>
            <p>Otopark Gereksinimi (3 daire / 1 araç): <b>{otoparkAdedi} araç</b></p>
            <p>Su Deposu Gerekliliği: <b>{sarnicGereklimi ? "Evet (30 daire üstü zorunlu)" : "Hayır"}</b></p>
            <p>Ağaç Sayısı (Arsanın %10'u ağaç alanı): <b>{agacSayisi} adet</b></p>
          </>
        ) : (
          <div style={{ color: "red" }}>
            <h4>UYARI - Yönetmelik Uygun Değil!</h4>
            <ul>
              {uyumsuzluklar.map((u, i) => (
                <li key={i}>{u}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
              }
