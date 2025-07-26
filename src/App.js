import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function App() {
  // --- State'ler ---
  const [arsaM2, setArsaM2] = useState(1000);
  const [taks, setTaks] = useState(0.4);
  const [kaks, setKaks] = useState(1.6);
  const [katBasinaDaire, setKatBasinaDaire] = useState(4);
  const [ikiArtibirNetM2, setIkiArtibirNetM2] = useState(75);
  const [ucArtibirNetM2, setUcArtibirNetM2] = useState(110);
  const [egimVar, setEgimVar] = useState(false);
  const [yolCephe, setYolCephe] = useState(1);
  const [cekme, setCekme] = useState({ ust: 5, alt: 5, sol: 5, sag: 5 });
  const [planNotlariGoster, setPlanNotlariGoster] = useState(false);

  const [ikiArtibir, setIkiArtibir] = useState(0);
  const [ucArtibir, setUcArtibir] = useState(0);
  const [ticariBirim, setTicariBirim] = useState(0);
  const [toplamInsaat, setToplamInsaat] = useState(0);
  const [blokSayisi, setBlokSayisi] = useState(1);

  const ortakAlanOrani = 0.10;
  const planRef = useRef();

  // --- Hesaplama fonksiyonu ---
  function hesapla() {
    const arsa = parseFloat(arsaM2);
    const taksVal = parseFloat(taks);
    const kaksVal = parseFloat(kaks);
    const yol = parseInt(yolCephe);

    if (isNaN(arsa) || isNaN(taksVal) || isNaN(kaksVal) || isNaN(yol)) {
      alert("Lütfen tüm alanları doğru doldurunuz!");
      return;
    }

    const brütInsaat = arsa * kaksVal;
    setToplamInsaat(brütInsaat);

    let blok;
    if (yol === 1) blok = 1;
    else if (yol === 2) blok = 2;
    else if (yol >= 3) blok = 3;
    else blok = 1;
    setBlokSayisi(blok);

    const netInsaat = brütInsaat * (1 - ortakAlanOrani);
    const netKonutAlani = netInsaat * 0.8;
    const netTicariAlani = netInsaat * 0.2;

    // 2+1 ve 3+1 daire sayıları net konut alanının yarışarına bölünüyor.
    const daire2Adet = Math.floor((netKonutAlani * 0.5) / ikiArtibirNetM2);
    const daire3Adet = Math.floor((netKonutAlani * 0.5) / ucArtibirNetM2);
    const ticariAdet = Math.floor(netTicariAlani / 100);

    setIkiArtibir(daire2Adet);
    setUcArtibir(daire3Adet);
    setTicariBirim(ticariAdet);
  }

  // --- PDF oluştur ---
  async function pdfOlustur() {
    if (!planRef.current) return;
    const canvas = await html2canvas(planRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.setFontSize(16);
    pdf.text("İmar Hesaplama Raporu", 10, 20);
    pdf.setFontSize(12);
    pdf.text(`Arsa Alanı: ${arsaM2} m²`, 10, 30);
    pdf.text(`TAKS: ${taks}`, 10, 40);
    pdf.text(`KAKS: ${kaks}`, 10, 50);
    pdf.text(`Yola Cephe Sayısı: ${yolCephe}`, 10, 60);
    pdf.text(`Eğim Durumu: ${egimVar ? "Var" : "Yok"}`, 10, 70);
    pdf.text(`Toplam Brüt İnşaat Alanı: ${toplamInsaat.toFixed(2)} m²`, 10, 80);
    pdf.text(
      `Toplam Net İnşaat Alanı (Ortak Alan %10): ${(toplamInsaat * (1 - ortakAlanOrani)).toFixed(2)} m²`,
      10,
      90
    );
    pdf.text(`Önerilen Blok Sayısı: ${blokSayisi}`, 10, 100);
    pdf.text(`2+1 Daire Sayısı: ${ikiArtibir} (Ortalama Net: ${ikiArtibirNetM2} m²)`, 10, 110);
    pdf.text(`3+1 Daire Sayısı: ${ucArtibir} (Ortalama Net: ${ucArtibirNetM2} m²)`, 10, 120);
    pdf.text(`Tahmini Dükkan Sayısı: ${ticariBirim}`, 10, 130);
    pdf.text(`Kat Başına Daire Sayısı: ${katBasinaDaire}`, 10, 140);

    const toplamDaire = ikiArtibir + ucArtibir;
    const toplamKat = Math.ceil(toplamDaire / (katBasinaDaire * blokSayisi));
    pdf.text(`Toplam Kat Sayısı (Tahmini): ${toplamKat}`, 10, 150);

    // Plan Notları
    pdf.setFontSize(10);
    pdf.text("Plan Notları:", 10, 160);
    const notlar = [
      "TAKS/KAKS net parsel üzerinden hesaplanır.",
      "Otopark: 3 daireye 1 araç.",
      "Bodrum kat emsale dahildir.",
      "Zemin kat ticari olabilir (isteğe bağlı).",
      "1000 m² üzeri parsellerde otopark zorunludur.",
      "Yapı yaklaşma mesafeleri belediye takdirindedir.",
    ];
    notlar.forEach((n, i) => pdf.text(n, 10, 170 + i * 7));

    // Otopark ve su deposu uyarısı
    const toplamDaireAdet = ikiArtibir + ucArtibir;
    const otoparkAdet = Math.ceil(toplamDaireAdet / 3);
    pdf.text(`Otopark Gereksinimi: ${otoparkAdet} araç`, 10, 220);
    if (toplamDaireAdet > 30) {
      pdf.setTextColor(255, 0, 0);
      pdf.text("30'dan fazla daire, 10 tonluk su deposu gereklidir.", 10, 230);
      pdf.setTextColor(0, 0, 0);
    }

    await pdf.save("imar_raporu.pdf");
  }

  // --- Blok Yerleşim Çizimi ---
  function BlokYerlesimSVG() {
    const width = 300;
    const height = 200;
    const blokWidth = blokSayisi === 1 ? 250 : blokSayisi === 2 ? 120 : 80;
    const blokHeight = 150;
    const blokGap = 10;

    return (
      <svg
        width={width}
        height={height}
        style={{ border: "1px solid #aaa", borderRadius: 8, background: "#f0f4f8" }}
      >
        {[...Array(blokSayisi)].map((_, i) => {
          const x = i * (blokWidth + blokGap);
          const y = 20;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={blokWidth}
              height={blokHeight}
              fill="#4a90e2"
              stroke="#003366"
              strokeWidth={2}
              rx={10}
              ry={10}
            />
          );
        })}
        <text x="10" y="15" fontSize="14" fill="#333">
          Blok Yerleşim Planı
        </text>
      </svg>
    );
  }

  // --- Toplam Daire ve Kat Hesapları ---
  const toplamDaire = ikiArtibir + ucArtibir;
  const toplamKat = Math.ceil(toplamDaire / (katBasinaDaire * blokSayisi));

  // --- Stil ---
  const style = {
    container: {
      maxWidth: 480,
      margin: "30px auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f9fafb",
      padding: 24,
      borderRadius: 12,
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      marginBottom: 16,
      borderRadius: 6,
      border: "1.5px solid #ccc",
      fontSize: 15,
    },
    label: {
      fontWeight: "600",
      marginBottom: 6,
      display: "block",
      color: "#222",
    },
    button: {
      width: "100%",
      padding: "14px 0",
      fontSize: 18,
      fontWeight: "700",
      borderRadius: 8,
      border: "none",
      backgroundColor: "#3b82f6",
      color: "white",
      cursor: "pointer",
      marginTop: 20,
      transition: "background-color 0.3s ease",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
      fontSize: 15,
      cursor: "pointer",
    },
    results: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 16,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      marginTop: 28,
      color: "#111",
    },
  };

  return (
    <div style={style.container}>
      <h2 style={{ textAlign: "center", marginBottom: 24, color: "#1e40af" }}>İmar Hesaplama</h2>

      {/* Inputs */}
      <label style={style.label}>
        Arsa Alanı (m²)
        <input
          type="number"
          style={style.input}
          value={arsaM2}
          onChange={(e) => setArsaM2(e.target.value)}
          min={10}
        />
      </label>

      <label style={style.label}>
        TAKS
        <input
          type="number"
          step="0.01"
          style={style.input}
          value={taks}
          onChange={(e) => setTaks(e.target.value)}
          min={0}
          max={1}
        />
      </label>

      <label style={style.label}>
        KAKS
        <input
          type="number"
          step="0.01"
          style={style.input}
          value={kaks}
          onChange={(e) => setKaks(e.target.value)}
          min={0}
        />
      </label>

      <label style={style.label}>
        Yola Cephe Sayısı
        <select
          style={style.input}
          value={yolCephe}
          onChange={(e) => setYolCephe(Number(e.target.value))}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3+</option>
        </select>
      </label>

      <label style={style.checkboxLabel}>
        <input
          type="checkbox"
          checked={egimVar}
          onChange={() => setEgimVar(!egimVar)}
        />
        Eğim Var mı?
      </label>

      <label style={style.label}>
        2+1 Daire Ortalama Net m²
        <input
          type="number"
          style={style.input}
          value={ikiArtibirNetM2}
          onChange={(e) => setIkiArtibirNetM2(Number(e.target.value))}
          min={10}
        />
      </label>

      <label style={style.label}>
        3+1 Daire Ortalama Net m²
        <input
          type="number"
          style={style.input}
          value={ucArtibirNetM2}
          onChange={(e) => setUcArtibirNetM2(Number(e.target.value))}
          min={10}
        />
      </label>

      <label style={style.label}>
        Kat Başına Kaç Daire Olsun?
        <select
          style={style.input}
          value={katBasinaDaire}
          onChange={(e) => setKatBasinaDaire(Number(e.target.value))}
        >
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </label>

      <label style={style.checkboxLabel}>
        <input
          type="checkbox"
          checked={planNotlariGoster}
          onChange={() => setPlanNotlariGoster(!planNotlariGoster)}
        />
        Plan Notlarını Göster
      </label>

      {planNotlariGoster && (
        <div
          style={{
            backgroundColor: "#eef2ff",
            padding: 12,
            borderRadius: 8,
            fontSize: 13,
            lineHeight: 1.4,
            marginBottom: 16,
            border: "1px solid #c7d2fe",
            color: "#1e40af",
          }}
        >
          <ul style={{ marginLeft: 16 }}>
            <li>• TAKS/KAKS net parsel üzerinden hesaplanır.</li>
            <li>• Otopark: 3 daireye 1 araç.</li>
            <li>• Bodrum kat emsale dahildir.</li>
            <li>• Zemin kat ticari olabilir (isteğe bağlı).</li>
            <li>• 1000 m² üzeri parsellerde otopark zorunludur.</li>
            <li>• Yapı yaklaşma mesafeleri belediye takdirindedir.</li>
          </ul>
        </div>
      )}

      {/* Çekme Mesafeleri */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 8, color: "#1e40af" }}>Çekme Mesafeleri (m)</h3>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="number"
            style={{ ...style.input, flex: 1 }}
            value={cekme.ust}
            onChange={(e) => setCekme({ ...cekme, ust: Number(e.target.value) })}
            placeholder="Üst"
            min={0}
          />
          <input
            type="number"
            style={{ ...style.input, flex: 1 }}
            value={cekme.alt}
            onChange={(e) => setCekme({ ...cekme, alt: Number(e.target.value) })}
            placeholder="Alt"
            min={0}
          />
          <input
            type="number"
            style={{ ...style.input, flex: 1 }}
            value={cekme.sol}
            onChange={(e) => setCekme({ ...cekme, sol: Number(e.target.value) })}
            placeholder="Sol"
            min={0}
          />
          <input
            type="number"
            style={{ ...style.input, flex: 1 }}
            value={cekme.sag}
            onChange={(e) => setCekme({ ...cekme, sag: Number(e.target.value) })}
            placeholder="Sağ"
            min={0}
          />
        </div>
        <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
          * Çekme mesafeleri belediye takdirine bırakılmıştır. Tasarım temsili yerleşimdir.
        </p>
      </div>

      {/* Hesap Sonuçları */}
      <div ref={planRef} style={style.results}>
        <h3>Sonuçlar</h3>
        {toplamInsaat > 0 ? (
          <>
            <p>
              Toplam Brüt İnşaat Alanı: <b>{toplamInsaat.toFixed(2)} m²</b>
            </p>
            <p>
              Toplam Net İnşaat Alanı (Ortak Alan %10):{" "}
              <b>{(toplamInsaat * (1 - ortakAlanOrani)).toFixed(2)} m²</b>
            </p>
            <p>
              Önerilen Blok Sayısı: <b>{blokSayisi}</b>
            </p>
            <p>
              2+1 Daire Sayısı: <b>{ikiArtibir}</b> (Toplam Net:{" "}
              <b>{(ikiArtibir * ikiArtibirNetM2).toFixed(2)} m²</b>)
            </p>
            <p>
              3+1 Daire Sayısı: <b>{ucArtibir}</b> (Toplam Net:{" "}
              <b>{(ucArtibir * ucArtibirNetM2).toFixed(2)} m²</b>)
            </p>
            <p>
              Tahmini Dükkan Sayısı: <b>{ticariBirim}</b>
            </p>
            <p>
              Toplam Daire Sayısı: <b>{toplamDaire}</b>
            </p>
            <p>
              Toplam Kat Sayısı (Tahmini): <b>{toplamKat}</b>
            </p>
            <p>
              Kat Başına Daire: <b>{
