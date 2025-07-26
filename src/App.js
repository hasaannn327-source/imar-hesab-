import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function App() {
  const [arsaM2, setArsaM2] = useState("");
  const [taks, setTaks] = useState("");
  const [kaks, setKaks] = useState("");
  const [ortalamaDaire, setOrtalamaDaire] = useState(100);
  const [cekme, setCekme] = useState({ ust: 5, alt: 5, sol: 5, sag: 5 });
  const [planNotlariGoster, setPlanNotlariGoster] = useState(false);
  const [sonuclar, setSonuclar] = useState(null);
  const pdfRef = useRef();

  const hesapla = () => {
    const arsa = parseFloat(arsaM2);
    const t = parseFloat(taks);
    const k = parseFloat(kaks);
    const ortDaire = parseFloat(ortalamaDaire);

    if (isNaN(arsa) || isNaN(t) || isNaN(k) || isNaN(ortDaire)) {
      alert("Lütfen tüm alanları doğru girin.");
      return;
    }

    const insaatAlani = arsa * k;
    const netTicari = insaatAlani * 0.2;
    const netKonut = insaatAlani * 0.8;
    const toplamDaire = Math.floor(netKonut / ortDaire);
    const otopark = Math.ceil(toplamDaire / 3);
    const suDeposu = toplamDaire > 30;

    setSonuclar({
      insaatAlani,
      netTicari,
      netKonut,
      toplamDaire,
      otopark,
      suDeposu,
    });
  };

  const pdfOlustur = async () => {
    if (!pdfRef.current) return;
    const element = pdfRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("imar_raporu.pdf");
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "2rem", background: "#f8f9fa" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", background: "#fff", padding: 24, borderRadius: 8, boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>İmar Hesap Modülü</h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          <input
            type="number"
            placeholder="Arsa m²"
            value={arsaM2}
            onChange={(e) => setArsaM2(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="TAKS"
            value={taks}
            onChange={(e) => setTaks(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="KAKS"
            value={kaks}
            onChange={(e) => setKaks(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Ortalama Daire m²"
            value={ortalamaDaire}
            onChange={(e) => setOrtalamaDaire(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {["ust", "alt", "sol", "sag"].map((key) => (
            <input
              key={key}
              type="number"
              placeholder={`${key} çekme`}
              value={cekme[key]}
              onChange={(e) =>
                setCekme((prev) => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))
              }
              style={{ ...inputStyle, width: "100%" }}
            />
          ))}
        </div>

        <div style={{ display: "flex", marginTop: 16, gap: 8 }}>
          <button onClick={hesapla} style={buttonStyle}>Hesapla</button>
          <button onClick={pdfOlustur} style={{ ...buttonStyle, background: "#28a745" }}>PDF Oluştur</button>
          <label style={{ marginLeft: "auto" }}>
            <input type="checkbox" checked={planNotlariGoster} onChange={() => setPlanNotlariGoster(!planNotlariGoster)} />
            Plan Notları
          </label>
        </div>

        <div ref={pdfRef} style={{ marginTop: 24 }}>
          {sonuclar && (
            <div style={{ background: "#e9ecef", padding: 16, borderRadius: 6 }}>
              <h2 style={{ fontWeight: "bold", marginBottom: 8 }}>Sonuçlar</h2>
              <p>Net İnşaat Alanı: {sonuclar.insaatAlani.toFixed(2)} m²</p>
              <p>Konut Alanı: {sonuclar.netKonut.toFixed(2)} m²</p>
              <p>Ticari Alan: {sonuclar.netTicari.toFixed(2)} m²</p>
              <p>Toplam Daire: {sonuclar.toplamDaire}</p>
              <p>Otopark Sayısı: {sonuclar.otopark}</p>
              {sonuclar.suDeposu && <p style={{ color: "red" }}>→ 10 tonluk su deposu zorunlu</p>}
            </div>
          )}

          {/* Arsa Çizimi */}
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <h3>Temsili Arsa Yerleşimi</h3>
            <div style={{ position: "relative", width: 300, height: 300, margin: "0 auto", background: "#dee2e6", border: "2px solid #000" }}>
              <div style={{
                position: "absolute",
                top: cekme.ust * 2,
                left: cekme.sol * 2,
                width: 300 - (cekme.sol + cekme.sag) * 2,
                height: 300 - (cekme.ust + cekme.alt) * 2,
                background: "#6c757d"
              }} />
            </div>
          </div>

          {planNotlariGoster && (
            <div style={{ marginTop: 20, background: "#fff3cd", padding: 12, borderRadius: 6 }}>
              <h4>Plan Notları Özeti</h4>
              <ul style={{ paddingLeft: 20 }}>
                <li>TAKS/KAKS net parsel üzerinden hesaplanır.</li>
                <li>3 daireye 1 otopark zorunludur.</li>
                <li>Zemin kat ticari olabilir.</li>
                <li>30+ dairede 10 tonluk su deposu zorunludur.</li>
                <li>Çekme mesafeleri tasarıma yansıtılmıştır.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: 4,
};

const buttonStyle = {
  background: "#007bff",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: 4,
  cursor: "pointer",
};
