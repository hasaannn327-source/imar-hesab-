import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function App() {
  const [arsaM2, setArsaM2] = useState("");
  const [taks, setTaks] = useState("");
  const [kaks, setKaks] = useState("");
  const [yolCephe, setYolCephe] = useState("1");
  const [egimVar, setEgimVar] = useState(false);

  const [ikiArtibirNetM2, setIkiArtibirNetM2] = useState(75);
  const [ucArtibirNetM2, setUcArtibirNetM2] = useState(110);
  const [katBasinaDaire, setKatBasinaDaire] = useState(4);

  const [cekmeOnBahce, setCekmeOnBahce] = useState("");
  const [cekmeYanBahce, setCekmeYanBahce] = useState("");
  const [cekmeArkaBahce, setCekmeArkaBahce] = useState("");

  const [toplamInsaat, setToplamInsaat] = useState(0);
  const [blokSayisi, setBlokSayisi] = useState(1);
  const [ikiArtibir, setIkiArtibir] = useState(0);
  const [ucArtibir, setUcArtibir] = useState(0);
  const [ticariBirim, setTicariBirim] = useState(0);
  const [otoparkSayisi, setOtoparkSayisi] = useState(0);
  const [suDeposuMesaji, setSuDeposuMesaji] = useState("");

  const planRef = useRef();

  const ortakAlanOrani = 0.1;

  const hesapla = () => {
    const arsa = parseFloat(arsaM2);
    const taksVal = parseFloat(taks);
    const kaksVal = parseFloat(kaks);
    const yol = parseInt(yolCephe);

    if (
      isNaN(arsa) ||
      isNaN(taksVal) ||
      isNaN(kaksVal) ||
      isNaN(yol) ||
      arsa <= 0 ||
      taksVal <= 0 ||
      kaksVal <= 0
    ) {
      alert("Lütfen tüm alanları doğru ve pozitif giriniz!");
      return;
    }

    const onBahce = parseFloat(cekmeOnBahce) || 0;
    const yanBahce = parseFloat(cekmeYanBahce) || 0;
    const arkaBahce = parseFloat(cekmeArkaBahce) || 0;

    const arsaKenar = Math.sqrt(arsa);

    const kullanilabilirKenarX = Math.max(arsaKenar - 2 * yanBahce, 0);
    const kullanilabilirKenarY = Math.max(arsaKenar - onBahce - arkaBahce, 0);

    const kullanilabilirArsa = kullanilabilirKenarX * kullanilabilirKenarY;

    let blok = 1;
    if (yol === 1) blok = 1;
    else if (yol === 2) blok = 2;
    else if (yol >= 3) blok = 3;
    setBlokSayisi(blok);

    // TAKS ve KAKS hesaplaması sadece kullanılabilir arsaya göre
    const taksAlani = kullanilabilirArsa * taksVal;
    const kaksAlani = kullanilabilirArsa * kaksVal;

    const brütInsaat = kaksAlani;
    setToplamInsaat(brütInsaat);

    const netInsaat = brütInsaat * (1 - ortakAlanOrani);
    const netTicariAlani = netInsaat * 0.2;
    const netKonutAlani = netInsaat * 0.8;

    const daire2Adet = Math.floor((netKonutAlani * 0.5) / ikiArtibirNetM2);
    const daire3Adet = Math.floor((netKonutAlani * 0.5) / ucArtibirNetM2);
    const ticariAdet = Math.floor(netTicariAlani / 100);

    setIkiArtibir(daire2Adet);
    setUcArtibir(daire3Adet);
    setTicariBirim(ticariAdet);

    const toplamDaire = daire2Adet + daire3Adet;
    const otopark = Math.ceil(toplamDaire / 3);
    setOtoparkSayisi(otopark);

    if (toplamDaire > 30) {
      setSuDeposuMesaji("⚠️ 30 daireyi aştığı için 10 tonluk su deposu gereklidir.");
    } else {
      setSuDeposuMesaji("");
    }
  };

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

      const ortakAlan = toplamInsaat * ortakAlanOrani;
      pdf.text(
        `Toplam Net İnşaat Alanı (Ortak Alan %10): ${(toplamInsaat - ortakAlan).toFixed(2)} m²`,
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
      pdf.text(`Gerekli Otopark Sayısı: ${otoparkSayisi}`, 10, 160);
      if (suDeposuMesaji) {
        pdf.text(`Su Deposu Notu: ${suDeposuMesaji}`, 10, 170);
      }

      pdf.addImage(imgData, "PNG", 10, 180, 180, 100);
      pdf.save("imar_raporu.pdf");
    });
  };

  const ArsaSVG = () => {
    const canvasSize = 250;
    const arsaKenar = Math.sqrt(parseFloat(arsaM2) || 1000);
    const scale = canvasSize / arsaKenar;

    const onBahcePx = (parseFloat(cekmeOnBahce) || 0) * scale;
    const yanBahcePx = (parseFloat(cekmeYanBahce) || 0) * scale;
    const arkaBahcePx = (parseFloat(cekmeArkaBahce) || 0) * scale;

    const usableWidth = canvasSize - 2 * yanBahcePx;
    const usableHeight = canvasSize - onBahcePx - arkaBahcePx;

    return (
      <svg
        width={canvasSize}
        height={canvasSize}
        style={{ border: "2px solid #444", borderRadius: 12, margin: "20px auto", display: "block" }}
      >
        {/* Arsa sınırı */}
        <rect
          x={0}
          y={0}
          width={canvasSize}
          height={canvasSize}
          fill="#e3f2fd"
          stroke="#1976d2"
          strokeWidth="3"
          rx={15}
        />

        {/* Çekme mesafeleri bölgesi */}
        <rect
          x={yanBahcePx}
          y={onBahcePx}
          width={usableWidth}
          height={usableHeight}
          fill="#bbdefb"
          stroke="#0d47a1"
          strokeWidth="2"
          rx={10}
        />

        <text x={canvasSize / 2} y={15} fontSize="14" fill="#0d47a1" textAnchor="middle" fontWeight="600">
          Arsa ve Çekme Mesafeleri
        </text>
        <text x={canvasSize / 2} y={canvasSize - 5} fontSize="12" fill="#0d47a1" textAnchor="middle">
          Mavi dış çerçeve: Arsa sınırı
        </text>
        <text x={canvasSize / 2} y={canvasSize - 20} fontSize="12" fill="#0d47a1" textAnchor="middle">
          Açık mavi: İnşaat yapılabilir alan
        </text>
      </svg>
    );
  };

  const containerStyle = {
    maxWidth: 600,
    margin: "40px auto",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f7f9fc",
    padding: 30,
    borderRadius: 20,
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
  };

  const sectionStyle = {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  };

  const labelStyle = {
    fontWeight: "600",
    marginBottom: 6,
    color: "#222",
    display: "block",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 15px",
    marginBottom: 15,
    borderRadius: 8,
    border: "1.5px solid #bbb",
    fontSize: 16,
    outline: "none",
  };

  const btnStyle = {
    width: "100%",
    padding: 15,
    fontSize: 18,
    borderRadius: 10,
    border: "none",
    backgroundColor: "#1976d2",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  };

  const toplamDaire = ikiArtibir + ucArtibir;
  const toplamKat = Math.ceil(toplamDaire / (katBasinaDaire * blokSayisi));

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center", marginBottom: 30, color: "#0d47a1" }}>İmar Hesaplama Modülü</h1>

      <section style={sectionStyle}>
        <h2 style={{ marginBottom: 20, color: "#1976d2" }}>Proje Bilgileri</h2>
        <label style={labelStyle}>
          Arsa Alanı (m²)
          <input
            style={inputStyle}
            type="number"
            value={arsaM2}
            onChange={(e) => setArsaM2(e.target.value)}
            placeholder="Örn: 500"
          />
        </label>

        <label style={labelStyle}>
          TAKS (0 - 1 arası)
          <input
            style={inputStyle}
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={taks}
            onChange={(e) => setTaks(e.target.value)}
            placeholder="Örn: 0.40"
          />
        </label>

        <label style={labelStyle}>
          KAKS (0 - 3 arası)
          <input
            style={inputStyle}
            type="number"
            step="0.01"
            min="0"
            max="3"
            value={kaks}
            onChange={(e) => setKaks(e.target.value)}
            placeholder="Örn: 1.20"
          />
        </label>

        <label style={labelStyle}>
          Yola Cephe Sayısı
          <select
            style={inputStyle}
            value={yolCephe}
            onChange={(e) => setYolCephe(e.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3+</option>
          </select>
        </label>

        <label style={{ ...labelStyle, display: "flex", alignItems: "center" }}>
          Eğim Var mı?
          <input
            type="checkbox"
            checked={egimVar}
            onChange={() => setEgimVar(!egimVar)}
            style={{ marginLeft: 12, width: 20, height: 20, cursor: "pointer" }}
          />
        </label>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ marginBottom: 20, color: "#1976d2" }}>Çekme Mesafeleri (m)</h2>
        <label style={labelStyle}>
          Ön Bahçe Çekme Mesafesi
          <input
            style={inputStyle}
            type="number"
            step="0.1"
            min="0"
            value={cekmeOnBahce}
            onChange={(e) => setCekmeOnBahce(e.target.value)}
            placeholder="Örn: 5"
          />
        </label>
        <label style={labelStyle}>
          Yan Bahçe Çekme Mesafesi
          <input
            style={inputStyle}
            type="number"
            step="0.1"
            min="0"
            value={cekmeYanBahce}
            onChange={(e) => setCekmeYanBahce(e.target.value)}
            placeholder="Örn: 3"
          />
        </label>
        <label style={labelStyle}>
          Arka Bahçe Çekme Mesafesi
          <input
            style={inputStyle}
            type="number"
            step="0.1"
            min="0"
            value={cekmeArkaBahce}
            onChange={(e) => setCekmeArkaBahce(e.target.value)}
            placeholder="Örn: 5"
          />
        </label>

        <ArsaSVG />
      </section>

      <section style={sectionStyle}>
        <h2 style={{ marginBottom: 20, color: "#1976d2" }}>Daire Bilgileri</h2>
        <label style={labelStyle}>
          2+1 Ortalama Net M²
          <input
            style={inputStyle}
            type="number"
            min="10"
            value={ikiArtibirNetM2}
            onChange={(e) => setIkiArtibirNetM2(Number(e.target.value))}
            placeholder="Örn: 75"
          />
        </label>
        <label style={labelStyle}>
          3+1 Ortalama Net M²
          <input
            style={inputStyle}
            type="number"
            min="10"
            value={ucArtibirNetM2}
            onChange={(e) => setUcArtibirNetM2(Number(e.target.value))}
            placeholder="Örn: 110"
          />
        </label>
        <label style={labelStyle}>
          Kat Başına Daire Sayısı
          <select
            style={inputStyle}
            value={katBasinaDaire}
            onChange={(e) => setKatBasinaDaire(Number(e.target.value))}
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </label>
      </section>

      <button style={btnStyle} onClick={hesapla}>
        Hesapla
      </button>

      <section ref={planRef} style={{ ...sectionStyle, marginTop: 30 }}>
        <h2 style={{ color: "#1976d2" }}>Sonuçlar</h2>
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
          2+1 Daire Sayısı: <b>{ikiArtibir}</b>
        </p>
        <p>
          3+1 Daire Sayısı: <b>{ucArtibir}</b>
        </p>
        <p>
          Tahmini Dükkan Sayısı: <b>{ticariBirim}</b>
        </p>
        <p>
          Toplam Daire
