import React, { useState } from "react";
import jsPDF from "jspdf";

function App() {
  const [arsa, setArsa] = useState({ alan: "", taks: "", kaks: "" });
  const [sonuc, setSonuc] = useState(null);

  const hesapla = () => {
    const alan = parseFloat(arsa.alan);
    const taks = parseFloat(arsa.taks) / 100;
    const kaks = parseFloat(arsa.kaks) / 100;

    const tabanAlani = alan * taks;
    const toplamInsaatAlani = alan * kaks;

    setSonuc({ tabanAlani, toplamInsaatAlani });
  };

  const pdfOlustur = () => {
    if (!sonuc) return;
    const doc = new jsPDF();
    doc.text(`Arsa Alanı: ${arsa.alan} m²`, 10, 10);
    doc.text(`TAKS: %${arsa.taks}`, 10, 20);
    doc.text(`KAKS: %${arsa.kaks}`, 10, 30);
    doc.text(`Taban Alanı: ${sonuc.tabanAlani.toFixed(2)} m²`, 10, 40);
    doc.text(`Toplam İnşaat Alanı: ${sonuc.toplamInsaatAlani.toFixed(2)} m²`, 10, 50);
    doc.save("imar-hesabi.pdf");
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>İmar Hesaplama</h1>
      <input
        type="number"
        placeholder="Arsa Alanı (m²)"
        onChange={(e) => setArsa({ ...arsa, alan: e.target.value })}
      />
      <input
        type="number"
        placeholder="TAKS (%)"
        onChange={(e) => setArsa({ ...arsa, taks: e.target.value })}
      />
      <input
        type="number"
        placeholder="KAKS (%)"
        onChange={(e) => setArsa({ ...arsa, kaks: e.target.value })}
      />
      <button onClick={hesapla}>Hesapla</button>

      {sonuc && (
        <div>
          <p>Taban Alanı: {sonuc.tabanAlani.toFixed(2)} m²</p>
          <p>Toplam İnşaat Alanı: {sonuc.toplamInsaatAlani.toFixed(2)} m²</p>
          <button onClick={pdfOlustur}>PDF Oluştur</button>
        </div>
      )}
    </div>
  );
}

export default App;
