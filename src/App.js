import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { planNotuAnaliz } from "./planNotlari"; // plan notu fonksiyonları

export default function App() {
  const [arsaM2, setArsaM2] = useState("");
  const [taks, setTaks] = useState("");
  const [kaks, setKaks] = useState("");
  const [yolCephe, setYolCephe] = useState("1");
  const [egimVar, setEgimVar] = useState(false);
  const [toplamInsaat, setToplamInsaat] = useState(0);
  const [blokSayisi, setBlokSayisi] = useState(1);

  const [ikiArtibir, setIkiArtibir] = useState(0);
  const [ucArtibir, setUcArtibir] = useState(0);
  const [ticariBirim, setTicariBirim] = useState(0);

  const [ikiArtibirNetM2, setIkiArtibirNetM2] = useState(75);
  const [ucArtibirNetM2, setUcArtibirNetM2] = useState(110);

  const ortakAlanOrani = 0.10;

  // Yeni: kat başı daire sayısı (user seçebilir)
  const [katBasinaDaire, setKatBasinaDaire] = useState(4);

  const planRef = useRef();

  const hesapla = () => {
    const arsa = parseFloat(arsaM2);
    const taksVal = parseFloat(taks);
    const kaksVal = parseFloat(kaks);
    const yol = parseInt(yolCephe);

    if (isNaN(arsa) || isNaN(taksVal) || isNaN(kaksVal) || isNaN(yol)) {
      alert("Lütfen tüm alanları doğru doldur!");
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

    const daire2Adet = Math.floor((netKonutAlani * 0.5) / ikiArtibirNetM2);
    const daire3Adet = Math.floor((netKonutAlani * 0.5) / ucArtibirNetM2);
    const ticariAdet = Math.floor(netTicariAlani / 100);

    setIkiArtibir(daire2Adet);
    setUcArtibir(daire3Adet);
    setTicariBirim(ticariAdet);
  };
// --- Plan Notlarına Göre Analiz ---
const analiz = planNotuAnaliz(brütInsaat, arsa, 1200); // 1200: VOR uzaklığı örnek
console.log("Plan Notu Analizi:", analiz);

alert(
  `📋 Plan Notu Kontrolleri:\n` +
  `👤 Kişi Sayısı: ${analiz.kisiSayisi}\n` +
  `🚗 Gerekli Otopark: ${analiz.otopark} araç\n` +
  `✈️ VOR Max Yükseklik: ${analiz.maxYukseklik} m\n` +
  `🌊 Kıyıdan Uzaklık Uygun mu? ${analiz.kiyidanUzaklikUygun ? "✅ Evet" : "❌ Hayır"}\n` +
  `🏞️ Dere Mesafesi Uygun mu? ${analiz.dereMesafeUygun ? "✅ Evet" : "❌ Hayır"}`
);
  
  const pdfOlustur = () => {
    if (!planRef.current) return;
    html2canvas(planRef.current).then((canvas) => {
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
      pdf.text(
        `2+1 Daire Sayısı: ${ikiArtibir} (Ortalama Net: ${ikiArtibirNetM2} m²)`,
        10,
        110
      );
      pdf.text(
        `3+1 Daire Sayısı: ${ucArtibir} (Ortalama Net: ${ucArtibirNetM2} m²)`,
        10,
        120
      );
      pdf.text(`Tahmini Dükkan Sayısı: ${ticariBirim}`, 10, 130);
      pdf.text(`Kat Başına Daire Sayısı: ${katBasinaDaire}`, 10, 140);
      const toplamDaire = ikiArtibir + ucArtibir;
      const toplamKat = Math.ceil(toplamDaire / (katBasinaDaire * blokSayisi));
      pdf.text(`Toplam Kat Sayısı (Tahmini): ${toplamKat}`, 10, 150);

      pdf.addImage(imgData, "PNG", 10, 160, 180, 100);
      pdf.save("imar_raporu.pdf");
    });
  };

  const BlokYerlesimSVG = () => {
    const width = 300;
    const height = 200;
    const blokWidth = blokSayisi === 1 ? 250 : blokSayisi === 2 ? 120 : 80;
    const blokHeight = 150;
    const blokGap = 10;

    return (
      <svg
        width={width}
        height={height}
        style={{ border: "1px solid #aaa", borderRadius: 8 }}
      >
        {[...Array(blokSayisi)].map((_, i) => {
          const x = i * (blokWidth + blokGap) + (egimVar ? i * 10 : 0);
          const y = egimVar ? i * 5 : 20;
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
  };

  const [btnHover, setBtnHover] = useState(false);

  const btnStyle = {
    width: "100%",
    padding: 14,
    fontSize: 18,
    borderRadius: 10,
    border: "none",
    backgroundColor: btnHover ? "#0056b3" : "#007bff",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: 15,
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 15px",
    marginBottom: 15,
    borderRadius: 8,
    border: "1.8px solid #ccc",
    fontSize: 16,
    outline: "none",
  };

  const labelStyle = {
    fontWeight: "600",
    display: "block",
    marginBottom: 6,
    color: "#333",
  };

  const containerStyle = {
    maxWidth: 450,
    margin: "40px auto",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f7f9fc",
    padding: 25,
    borderRadius: 15,
    boxShadow: "0 12px 25px rgba(0,0,0,0.12)",
  };

  const resultsStyle = {
    marginTop: 30,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };

  const toplamDaire = ikiArtibir + ucArtibir;
  const toplamKat = Math.ceil(toplamDaire / (katBasinaDaire * blokSayisi));

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", color: "#222", marginBottom: 25 }}>
        İmar Hesaplama
      </h2>

      <label style={labelStyle}>
        Arsa Alanı (m²):
        <input
          type="number"
          value={arsaM2}
          onChange={(e) => setArsaM2(e.target.value)}
          style={inputStyle}
          placeholder="Örnek: 500"
        />
      </label>

      <label style={labelStyle}>
        TAKS:
        <input
          type="number"
          step="0.01"
          value={taks}
          onChange={(e) => setTaks(e.target.value)}
          style={inputStyle}
          placeholder="Örnek: 0.40"
        />
      </label>

      <label style={labelStyle}>
        KAKS:
        <input
          type="number"
          step="0.01"
          value={kaks}
          onChange={(e) => setKaks(e.target.value)}
          style={inputStyle}
          placeholder="Örnek: 1.20"
        />
      </label>

      <label style={labelStyle}>
        Yola Cephe Sayısı:
        <select
          value={yolCephe}
          onChange={(e) => setYolCephe(e.target.value)}
          style={{ ...inputStyle, padding: "12px 10px" }}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3+</option>
        </select>
      </label>

      <label
        style={{ ...labelStyle, display: "flex", alignItems: "center" }}
      >
        Eğim Var mı?
        <input
          type="checkbox"
          checked={egimVar}
          onChange={() => setEgimVar(!egimVar)}
          style={{ marginLeft: 12, width: 20, height: 20, cursor: "pointer" }}
        />
      </label>

      <label style={labelStyle}>
        2+1 Daire Ortalama Net M²:
        <input
          type="number"
          value={ikiArtibirNetM2}
          onChange={(e) => setIkiArtibirNetM2(Number(e.target.value))}
          style={inputStyle}
          min={10}
          placeholder="Örnek: 75"
        />
      </label>

      <label style={labelStyle}>
        3+1 Daire Ortalama Net M²:
        <input
          type="number"
          value={ucArtibirNetM2}
          onChange={(e) => setUcArtibirNetM2(Number(e.target.value))}
          style={inputStyle}
          min={10}
          placeholder="Örnek: 110"
        />
      </label>

      <label style={labelStyle}>
        Bir Katta Kaç Daire Olsun?
        <select
          value={katBasinaDaire}
          onChange={(e) => setKatBasinaDaire(Number(e.target.value))}
          style={{ ...inputStyle, padding: "12px 10px" }}
        >
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </label>

      <button
        style={btnStyle}
        onClick={hesapla}
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => setBtnHover(false)}
      >
        Hesapla
      </button>

      <div ref={planRef} style={resultsStyle}>
        <h3 style={{ marginBottom: 15, color: "#111" }}>Sonuçlar</h3>
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
          Bir Katta Kaç Daire: <b>{katBasinaDaire}</b>
        </p>
        <p>
          Toplam Ortak Alan: <b>{(toplamInsaat * ortakAlanOrani).toFixed(2)} m²</b>
        </p>
        <p>
          Bağımsız Bölüm Başına Ortak Alan (m²):{" "}
          <b>
            {(
              (toplamInsaat * ortakAlanOrani) /
              (ikiArtibir + ucArtibir + ticariBirim)
            ).toFixed(2)}
          </b>
        </p>

        <BlokYerlesimSVG />
      </div>

      <button
        style={btnStyle}
        onClick={pdfOlustur}
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => setBtnHover(false)}
      >
        PDF Olarak Kaydet
      </button>
    </div>
  );
    }
