import React, { useState } from "react";

export default function App() { const [arsaM2, setArsaM2] = useState(0); const [taks, setTaks] = useState(0); const [kaks, setKaks] = useState(0); const [cekmeOn, setCekmeOn] = useState(0); const [cekmeYan, setCekmeYan] = useState(0); const [oda2Art1, setOda2Art1] = useState(80); const [oda3Art1, setOda3Art1] = useState(120); const [oran2Art1, setOran2Art1] = useState(50); const [planNotlariGoster, setPlanNotlariGoster] = useState(false); const [uygunluk, setUygunluk] = useState(null);

const netParselAlani = arsaM2 - 2 * cekmeOn * Math.sqrt(arsaM2) - 2 * cekmeYan * Math.sqrt(arsaM2); const insaatAlani = kaks * netParselAlani; const netTicariAlani = insaatAlani * 0.2; const netKonutAlani = insaatAlani * 0.8;

const adet2Art1 = Math.round((netKonutAlani * (oran2Art1 / 100)) / oda2Art1); const adet3Art1 = Math.round((netKonutAlani * (1 - oran2Art1 / 100)) / oda3Art1); const toplamDaire = adet2Art1 + adet3Art1;

const otopark = Math.ceil(toplamDaire / 3); const suDeposu = toplamDaire > 30;

const kontrolEt = () => { const hatalar = []; if (cekmeOn <= 0 || cekmeYan <= 0) hatalar.push("Çekme mesafeleri 0 olamaz. (Yönetmelik Madde 19)"); if (arsaM2 <= 0) hatalar.push("Arsa alanı girilmelidir. (Yönetmelik Madde 4)"); if (taks <= 0 || kaks <= 0) hatalar.push("TAKS/KAKS pozitif olmalıdır. (Yönetmelik Madde 5)");

setUygunluk(hatalar.length > 0 ? hatalar : ["Girilen değerler yönetmeliğe uygundur."]);

};

return ( <div style={{ fontFamily: "sans-serif", padding: "2rem", background: "#f9f9f9", minHeight: "100vh" }}> <h1 style={{ textAlign: "center", color: "#2c3e50" }}>İmar Hesap Modülü</h1>

<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
    <input type="number" placeholder="Arsa m²" value={arsaM2} onChange={(e) => setArsaM2(+e.target.value)} style={inputStyle} />
    <input type="number" placeholder="TAKS" value={taks} onChange={(e) => setTaks(+e.target.value)} style={inputStyle} />
    <input type="number" placeholder="KAKS" value={kaks} onChange={(e) => setKaks(+e.target.value)} style={inputStyle} />
    <input type="number" placeholder="Ön çekme (m)" value={cekmeOn} onChange={(e) => setCekmeOn(+e.target.value)} style={inputStyle} />
    <input type="number" placeholder="Yan çekme (m)" value={cekmeYan} onChange={(e) => setCekmeYan(+e.target.value)} style={inputStyle} />
    <input type="number" placeholder="2+1 m²" value={oda2Art1} onChange={(e) => setOda2Art1(+e.target.value)} style={inputStyle} />
    <input type="number" placeholder="3+1 m²" value={oda3Art1} onChange={(e) => setOda3Art1(+e.target.value)} style={inputStyle} />
    <input type="number" placeholder="2+1 oranı (%)" value={oran2Art1} onChange={(e) => setOran2Art1(+e.target.value)} style={inputStyle} />
  </div>

  <button onClick={kontrolEt} style={buttonStyle}>Yönetmelik Uygunluk Kontrolü Yap</button>

  {uygunluk && (
    <div style={{ marginTop: "1rem", padding: "1rem", background: "#ecf0f1", borderRadius: "8px" }}>
      <h3>Kontrol Sonucu</h3>
      <ul>
        {uygunluk.map((u, i) => (<li key={i}>{u}</li>))}
      </ul>
    </div>
  )}

  <div style={{ marginTop: "2rem" }}>
    <h3>Hesaplanan Veriler</h3>
    <ul>
      <li>Net Parsel Alanı: {netParselAlani.toFixed(2)} m²</li>
      <li>İnşaat Alanı: {insaatAlani.toFixed(2)} m²</li>
      <li>Ticari Alan (%20): {netTicariAlani.toFixed(2)} m²</li>
      <li>Konut Alanı (%80): {netKonutAlani.toFixed(2)} m²</li>
      <li>2+1 Adet: {adet2Art1} daire</li>
      <li>3+1 Adet: {adet3Art1} daire</li>
      <li>Toplam Daire: {toplamDaire}</li>
      <li>Otopark Gerekli: {otopark} araç</li>
      {suDeposu && <li style={{ color: "red" }}>10 tonluk su deposu zorunlu!</li>}
    </ul>
  </div>

  <div style={{ marginTop: "2rem" }}>
    <label>
      <input type="checkbox" checked={planNotlariGoster} onChange={() => setPlanNotlariGoster(!planNotlariGoster)} /> Plan Notlarını Göster
    </label>
    {planNotlariGoster && (
      <div style={{ background: "#fff", padding: "1rem", marginTop: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h4>Plan Notları Özeti</h4>
        <ul>
          <li>TAKS/KAKS net parsel üzerinden hesaplanır.</li>
          <li>Her 3 daireye 1 otopark zorunlu.</li>
          <li>Bodrum kat emsale dahil.</li>
          <li>Zemin kat ticari olabilir (isteğe bağlı).</li>
          <li>1000 m² üzeri parsellerde otopark zorunludur.</li>
          <li>Çekme mesafeleri belediye takdirindedir.</li>
        </ul>
      </div>
    )}
  </div>
</div>

); }

const inputStyle = { padding: "10px", border: "1px solid #ccc", borderRadius: "6px", width: "100%", };

const buttonStyle = { marginTop: "1rem", backgroundColor: "#2ecc71", color: "white", padding: "10px 20px", border: "none", borderRadius: "6px", cursor: "pointer", };

    
