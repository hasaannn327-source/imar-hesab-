import React, { useState, useEffect } from "react";

const cekmeMesafeleriOrnekVeri = {
  "İstanbul": { onBahce: 5, yanBahce: 3, arkaBahce: 4 },
  "Ankara": { onBahce: 4, yanBahce: 3, arkaBahce: 3 },
  "İzmir": { onBahce: 3, yanBahce: 3, arkaBahce: 3 },
};

export default function App() {
  const [arsaM2, setArsaM2] = useState("");
  const [taks, setTaks] = useState("");
  const [kaks, setKaks] = useState("");
  const [daire2plus1m2, setDaire2plus1m2] = useState("85");
  const [daire3plus1m2, setDaire3plus1m2] = useState("120");
  const [planNotlariGoster, setPlanNotlariGoster] = useState(false);

  const [sehir, setSehir] = useState("İstanbul");
  const [cekmeMesafeleri, setCekmeMesafeleri] = useState({});
  const [manuelCekmeMesafeleri, setManuelCekmeMesafeleri] = useState({
    onBahce: "",
    yanBahce: "",
    arkaBahce: "",
  });

  const [sonuc, setSonuc] = useState(null);

  useEffect(() => {
    setCekmeMesafeleri(cekmeMesafeleriOrnekVeri[sehir]);
    setManuelCekmeMesafeleri(cekmeMesafeleriOrnekVeri[sehir]);
  }, [sehir]);

  const handleHesapla = () => {
    if (!arsaM2 || !taks || !kaks) {
      alert("Arsa alanı, TAKS ve KAKS değerlerini doldurun!");
      return;
    }

    const netInsaatAlani = parseFloat(kaks) * parseFloat(arsaM2);
    const netTicariAlani = netInsaatAlani * 0.2;
    const netKonutAlani = netInsaatAlani * 0.8;

    let toplam2plus1 = 0;
    let toplam3plus1 = 0;

    if (parseFloat(daire2plus1m2) > 0) {
      toplam2plus1 = Math.floor(
        (netKonutAlani * 0.5) / parseFloat(daire2plus1m2)
      );
    }

    if (parseFloat(daire3plus1m2) > 0) {
      toplam3plus1 = Math.floor(
        (netKonutAlani * 0.5) / parseFloat(daire3plus1m2)
      );
    }

    const toplamDaire = toplam2plus1 + toplam3plus1;
    const otopark = Math.ceil(toplamDaire / 3);
    const suDeposu =
      toplamDaire > 30 ? "10 tonluk su deposu gerekli" : "Gerekli değil";

    setSonuc({
      netInsaatAlani,
      netTicariAlani,
      netKonutAlani,
      toplam2plus1,
      toplam3plus1,
      toplamDaire,
      otopark,
      suDeposu,
    });
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>🏗️ İmar Hesap Modülü</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label>
          Arsa Alanı (m²)
          <input
            type="number"
            placeholder="Örn: 1000"
            value={arsaM2}
            onChange={(e) => setArsaM2(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label>
          TAKS (örn: 0.4)
          <input
            type="number"
            placeholder="Örn: 0.4"
            value={taks}
            onChange={(e) => setTaks(e.target.value)}
            step="0.01"
            style={inputStyle}
          />
        </label>

        <label>
          KAKS (örn: 1.6)
          <input
            type="number"
            placeholder="Örn: 1.6"
            value={kaks}
            onChange={(e) => setKaks(e.target.value)}
            step="0.1"
            style={inputStyle}
          />
        </label>

        <label>
          2+1 Ortalama Daire Alanı (m²) (0 ise hesaplanmaz)
          <input
            type="number"
            placeholder="Örn: 85"
            value={daire2plus1m2}
            onChange={(e) => setDaire2plus1m2(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label>
          3+1 Ortalama Daire Alanı (m²) (0 ise hesaplanmaz)
          <input
            type="number"
            placeholder="Örn: 120"
            value={daire3plus1m2}
            onChange={(e) => setDaire3plus1m2(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label>
          Belediye Seçimi (Çekme Mesafeleri Otomatik Dolacak)
          <select
            value={sehir}
            onChange={(e) => setSehir(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            {Object.keys(cekmeMesafeleriOrnekVeri).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <fieldset
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 10,
            marginTop: 10,
            backgroundColor: "#fff",
          }}
        >
          <legend style={{ fontWeight: "600" }}>Çekme Mesafeleri (m)</legend>

          <label>
            Ön Bahçe:
            <input
              type="number"
              value={manuelCekmeMesafeleri.onBahce}
              onChange={(e) =>
                setManuelCekmeMesafeleri((prev) => ({
                  ...prev,
                  onBahce: e.target.value,
                }))
              }
              style={inputStyle}
            />
          </label>

          <label>
            Yan Bahçe:
            <input
              type="number"
              value={manuelCekmeMesafeleri.yanBahce}
              onChange={(e) =>
                setManuelCekmeMesafeleri((prev) => ({
                  ...prev,
                  yanBahce: e.target.value,
                }))
              }
              style={inputStyle}
            />
          </label>

          <label>
            Arka Bahçe:
            <input
              type="number"
              value={manuelCekmeMesafeleri.arkaBahce}
              onChange={(e) =>
                setManuelCekmeMesafeleri((prev) => ({
                  ...prev,
                  arkaBahce: e.target.value,
                }))
              }
              style={inputStyle}
            />
          </label>
        </fieldset>

        <button
          onClick={handleHesapla}
          style={{
            padding: 10,
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            marginTop: 10,
          }}
        >
          Hesapla
        </button>

        <label style={{ marginTop: 10 }}>
          <input
            type="checkbox"
            checked={planNotlariGoster}
            onChange={() => setPlanNotlariGoster(!planNotlariGoster)}
          />{" "}
          Plan Notlarını Göster
        </label>

        {planNotlariGoster && (
          <div
            style={{
              background: "#fff",
              padding: 10,
              borderRadius: 8,
              marginTop: 10,
              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
            }}
          >
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

        {sonuc && (
          <div
            style={{
              marginTop: 20,
              backgroundColor: "#e2e8f0",
              padding: 15,
              borderRadius: 8,
              whiteSpace: "pre-line",
              fontFamily: "monospace",
            }}
          >
            {`
Toplam İnşaat Alanı: ${sonuc.netInsaatAlani.toFixed(2)} m²

🏢 Ticari Alan (%20): ${sonuc.netTicariAlani.toFixed(2)} m²
🏠 Konut Alanı (%80): ${sonuc.netKonutAlani.toFixed(2)} m²

- 2+1 Daire Sayısı: ${sonuc.toplam2plus1}
- 3+1 Daire Sayısı: ${sonuc.toplam3plus1}
- Toplam Daire: ${sonuc.toplamDaire}
🚗 Otopark: ${sonuc.otopark} araçlık
💧 Su Deposu: ${sonuc.suDeposu}

Çekme Mesafeleri (m):
  Ön Bahçe: ${manuelCekmeMesafeleri.onBahce || "Belirtilmedi"}
  Yan Bahçe: ${manuelCekmeMesafeleri.yanBahce || "Belirtilmedi"}
  Arka Bahçe: ${manuelCekmeMesafeleri.arkaBahce || "Belirtilmedi"}
            `}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 8,
  marginTop: 4,
  marginBottom: 8,
  borderRadius: 4,
  border: "1px solid #ccc",
  boxSizing: "border-box",
};
