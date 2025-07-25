import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ImarHesap() {
  const [arsaM2, setArsaM2] = useState("");
  const [taks, setTaks] = useState("");
  const [kaks, setKaks] = useState("");
  const [yolCephe, setYolCephe] = useState("1");
  const [egimVar, setEgimVar] = useState(false);
  const [toplamInsaat, setToplamInsaat] = useState(0);
  const [blokSayisi, setBlokSayisi] = useState(1);

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

    // Toplam inşaat alanı = Arsa * KAKS
    const insaat = arsa * kaksVal;
    setToplamInsaat(insaat);

    // Blok sayısını yol cephe sayısına göre seçiyoruz
    let blok;
    if (yol === 1) blok = 1;
    else if (yol === 2) blok = 2;
    else if (yol >= 3) blok = 3;
    else blok = 1;
    setBlokSayisi(blok);
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
      pdf.text(`Toplam İnşaat Alanı: ${toplamInsaat.toFixed(2)} m²`, 10, 80);
      pdf.text(`Önerilen Blok Sayısı: ${blokSayisi}`, 10, 90);
      pdf.addImage(imgData, "PNG", 10, 100, 180, 100);
      pdf.save("imar_raporu.pdf");
    });
  };

  // Basit yerleşim planı SVG'si
  const BlokYerlesimSVG = () => {
    const width = 300;
    const height = 200;
    const blokWidth = blokSayisi === 1 ? 250 : blokSayisi === 2 ? 120 : 80;
    const blokHeight = 150;
    const blokGap = 10;

    return (
      <svg width={width} height={height} style={{ border: "1px solid #aaa" }}>
        {[...Array(blokSayisi)].map((_, i) => {
          // Eğim varsa blokları biraz kaydır
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

  return (
    <div style={{ maxWidth: 400, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>İmar Hesaplama</h2>
      <label>
        Arsa Alanı (m²):
        <input
          type="number"
          value={arsaM2}
          onChange={(e) => setArsaM2(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
      </label>
      <label>
        TAKS:
        <input
          type="number"
          step="0.01"
          value={taks}
          onChange={(e) => setTaks(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
      </label>
      <label>
        KAKS:
        <input
          type="number"
          step="0.01"
          value={kaks}
          onChange={(e) => setKaks(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
      </label>
      <label>
        Yola Cephe Sayısı:
        <select
          value={yolCephe}
          onChange={(e) => setYolCephe(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3+</option>
        </select>
      </label>
      <label>
        Eğim Var mı?
        <input
          type="checkbox"
          checked={egimVar}
          onChange={() => setEgimVar(!egimVar)}
          style={{ marginLeft: 10 }}
        />
      </label>
      <button
        onClick={hesapla}
        style={{ marginTop: 15, width: "100%", padding: "10px", fontSize: 16, cursor: "pointer" }}
      >
        Hesapla
      </button>

      <div
        ref={planRef}
        style={{
          marginTop: 30,
          padding: 10,
          border: "1px solid #ddd",
          borderRadius: 8,
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>Sonuçlar</h3>
        <p>
          Toplam İnşaat Alanı: <b>{toplamInsaat.toFixed(2)} m²</b>
        </p>
        <p>
          Önerilen Blok Sayısı: <b>{blokSayisi}</b>
        </p>
        <BlokYerlesimSVG />
      </div>

      <button
        onClick={pdfOlustur}
        style={{ marginTop: 15, width: "100%", padding: "10px", fontSize: 16, cursor: "pointer" }}
      >
        PDF Olarak Kaydet
      </button>
    </div>
  );
      }
