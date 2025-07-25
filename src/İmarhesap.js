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
  const [bloklar, setBloklar] = useState([]);

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

    const insaat = arsa * kaksVal;
    setToplamInsaat(insaat);

    let blok = yol >= 3 ? 3 : yol;
    setBlokSayisi(blok);

    const maxYapilanAlan = arsa * taksVal;
    const blokAlani = maxYapilanAlan / blok;

    const blokKenar = Math.sqrt(blokAlani);
    const blokGen = blokKenar * 2;
    const blokYuk = blokKenar * 1.5;

    const blokVerileri = Array.from({ length: blok }).map((_, i) => {
      const offsetX = i * (blokGen + 20);
      const offsetY = egimVar ? i * 10 : 20;
      return {
        x: offsetX,
        y: offsetY,
        width: blokGen,
        height: blokYuk,
      };
    });

    setBloklar(blokVerileri);
  };

  const BlokYerlesimSVG = () => (
    <svg width="100%" height={250} style={{ border: "1px solid #aaa" }}>
      {bloklar.map((blok, i) => (
        <rect
          key={i}
          x={blok.x}
          y={blok.y}
          width={blok.width}
          height={blok.height}
          fill="#4a90e2"
          stroke="#003366"
          strokeWidth={2}
          rx={10}
          ry={10}
        />
      ))}
      <text x="10" y="15" fontSize="14" fill="#333">Yerleşim Planı</text>
    </svg>
  );

  return (
    <div style={{ maxWidth: 450, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>İmar Hesaplama</h2>

      <label>Arsa Alanı (m²):</label>
      <input
        type="number"
        value={arsaM2}
        onChange={(e) => setArsaM2(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>TAKS:</label>
      <input
        type="number"
        step="0.01"
        value={taks}
        onChange={(e) => setTaks(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>KAKS:</label>
      <input
        type="number"
        step="0.01"
        value={kaks}
        onChange={(e) => setKaks(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>Yola Cephe Sayısı:</label>
      <select
        value={yolCephe}
        onChange={(e) => setYolCephe(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3+</option>
      </select>

      <label>
        Eğim Var mı?
        <input
          type="checkbox"
          checked={egimVar}
          onChange={() => setEgimVar(!egimVar)}
          style={{ marginLeft: 10 }}
        />
      </label>

      <button onClick={hesapla} style={{ marginTop: 15, width: "100%", padding: 10 }}>
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
        <p>Toplam İnşaat Alanı: <b>{toplamInsaat.toFixed(2)} m²</b></p>
        <p>Blok Sayısı: <b>{blokSayisi}</b></p>
        <BlokYerlesimSVG />
      </div>
    </div>
  );
}
