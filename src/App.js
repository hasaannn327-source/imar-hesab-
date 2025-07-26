import React, { useState } from "react";

export default function App() {
  const [arsaM2, setArsaM2] = useState("");
  const [taks, setTaks] = useState("");
  const [kaks, setKaks] = useState("");
  const [daire2plus1m2, setDaire2plus1m2] = useState("85");
  const [daire3plus1m2, setDaire3plus1m2] = useState("120");
  const [oran2plus1, setOran2plus1] = useState("50"); // yüzde
  const [planNotlariGoster, setPlanNotlariGoster] = useState(false);

  const handleHesapla = () => {
    const netInsaatAlani = parseFloat(kaks) * parseFloat(arsaM2);
    const netTicariAlani = netInsaatAlani * 0.2;
    const netKonutAlani = netInsaatAlani * 0.8;

    const yuzde2plus1 = parseFloat(oran2plus1) / 100;
    const yuzde3plus1 = 1 - yuzde2plus1;

    const toplam2plus1 = Math.floor(
      (netKonutAlani * yuzde2plus1) / parseFloat(daire2plus1m2)
    );
    const toplam3plus1 = Math.floor(
      (netKonutAlani * yuzde3plus1) / parseFloat(daire3plus1m2)
    );

    const toplamDaire = toplam2plus1 + toplam3plus1;
    const otopark = Math.ceil(toplamDaire / 3);
    const suDeposu = toplamDaire > 30 ? "10 tonluk su deposu gerekli" : "Gerekli değil";

    alert(`
Toplam İnşaat Alanı: ${netInsaatAlani.toFixed(2)} m²

🏢 Ticari Alan (%20): ${netTicariAlani.toFixed(2)} m²
🏠 Konut Alanı (%80): ${netKonutAlani.toFixed(2)} m²

- 2+1 Daire Sayısı: ${toplam2plus1}
- 3+1 Daire Sayısı: ${toplam3plus1}
- Toplam Daire: ${toplamDaire}
🚗 Otopark: ${otopark} araçlık
💧 Su Deposu: ${suDeposu}
`);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "10px" }}>🏗️ İmar Hesap Modülü</h2>

      <label>Arsa Alanı (m²)</label>
      <input
        placeholder="Örn: 1000"
        value={arsaM2}
        onChange={(e) => setArsaM2(e.target.value)}
        type="number"
      />

      <label>TAKS (örneğin 0.4)</label>
      <input
        placeholder="Örn: 0.4"
        value={taks}
        onChange={(e) => setTaks(e.target.value)}
        type="number"
        step="0.01"
      />

      <label>KAKS (örneğin 1.6)</label>
      <input
        placeholder="Örn: 1.6"
        value={kaks}
        onChange={(e) => setKaks(e.target.value)}
        type="number"
        step="0.1"
      />

      <label>2+1 Ortalama Daire Alanı (m²)</label>
      <input
        placeholder="Örn: 85"
        value={daire2plus1m2}
        onChange={(e) => setDaire2plus1m2(e.target.value)}
        type="number"
      />

      <label>3+1 Ortalama Daire Alanı (m²)</label>
      <input
        placeholder="Örn: 120"
        value={daire3plus1m2}
        onChange={(e) => setDaire3plus1m2(e.target.value)}
        type="number"
      />

      <label>2+1 Daire Oranı (%)</label>
      <input
        placeholder="Örn: 50"
        value={oran2plus1}
        onChange={(e) => setOran2plus1(e.target.value)}
        type="number"
        min="0"
        max="100"
      />

      <button style={{ marginTop: "10px" }} onClick={handleHesapla}>
        Hesapla
      </button>

      <div style={{ marginTop: "20px" }}>
        <label>
          <input
            type="checkbox"
            checked={planNotlariGoster}
            onChange={() => setPlanNotlariGoster(!planNotlariGoster)}
          />{" "}
          Plan Notlarını Göster
        </label>

        {planNotlariGoster && (
          <div style={{ background: "#f3f4f6", padding: "15px", borderRadius: "8px", marginTop: "10px" }}>
            <b>📝 Plan Notları Özeti:</b>
            <ul>
              <li>TAKS/KAKS net parsel üzerinden hesaplanır.</li>
              <li>3 daireye 1 araç otopark zorunludur.</li>
              <li>Bodrum kat emsale dahildir.</li>
              <li>Zemin kat ticari olabilir.</li>
              <li>1000 m² üzeri parsellerde otopark zorunludur.</li>
              <li>Çekme mesafeleri belediye takdirindedir.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
            }
