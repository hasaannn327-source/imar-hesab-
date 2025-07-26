import React, { useState, useRef } from "react";

export default function App() {
  const [arsaM2, setArsaM2] = useState("");
  const [taks, setTaks] = useState("");
  const [kaks, setKaks] = useState("");
  const [yolCephe, setYolCephe] = useState("1");
  const [egimVar, setEgimVar] = useState(false);

  const [ucArtibirNetM2, setUcArtibirNetM2] = useState(110);
  const [katBasinaDaire, setKatBasinaDaire] = useState(4);
  const [ticariAlaniIsterMi, setTicariAlaniIsterMi] = useState(true);

  const ortakAlanOrani = 0.1;

  const [blokSayisi, setBlokSayisi] = useState(1);
  const [toplamInsaat, setToplamInsaat] = useState(0);
  const [ucArtibir, setUcArtibir] = useState(0);
  const [ticariBirim, setTicariBirim] = useState(0);
  const [toplamKat, setToplamKat] = useState(0);
  const [toplamDaire, setToplamDaire] = useState(0);

  const [uyariMesajlari, setUyariMesajlari] = useState([]);

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
      arsa <= 0
    ) {
      alert("Lütfen tüm alanları doğru doldurunuz.");
      return;
    }

    // Blok sayısı yol cephesi sayısına göre
    let blok;
    if (yol === 1) blok = 1;
    else if (yol === 2) blok = 2;
    else blok = 3;
    setBlokSayisi(blok);

    const brutInsaat = arsa * kaksVal;
    setToplamInsaat(brutInsaat);

    const netInsaat = brutInsaat * (1 - ortakAlanOrani);

    // 3+1 daire var mı, net alanı 0 ise daire yok say
    let konutNetAlani = 0;
    let ticariNetAlani = 0;
    if (ticariAlaniIsterMi) {
      ticariNetAlani = netInsaat * 0.2;
      konutNetAlani = netInsaat * 0.8;
    } else {
      ticariNetAlani = 0;
      konutNetAlani = netInsaat;
    }

    // 3+1 daire sayısı
    const daireAdet = ucArtibirNetM2 > 0 ? Math.floor(konutNetAlani / ucArtibirNetM2) : 0;
    setUcArtibir(daireAdet);

    // Ticari birim sayısı
    const ticariAdet = ticariAlaniIsterMi ? Math.floor(ticariNetAlani / 100) : 0;
    setTicariBirim(ticariAdet);

    const toplamDaireSayisi = daireAdet;
    setToplamDaire(toplamDaireSayisi);

    // Toplam kat sayısı
    const katSayisi = Math.ceil(toplamDaireSayisi / (katBasinaDaire * blok));
    setToplamKat(katSayisi);

    // Yönetmelik kontrolü
    const uyariListesi = [];

    if (taksVal > 0.4) {
      uyariListesi.push("TAKS 0.4'ten büyük olamaz.");
    }
    if (kaksVal > 1.2) {
      uyariListesi.push("KAKS 1.2'den büyük olamaz.");
    }
    if (katSayisi > 7) {
      uyariListesi.push("Toplam kat sayısı 7'yi geçemez.");
    }
    // Otopark kontrolü: 3 daireye 1 araç
    const otoparkGerekli = Math.ceil(toplamDaireSayisi / 3);
    if (ticariAdet + otoparkGerekli < otoparkGerekli) {
      uyariListesi.push("Otopark sayısı yetersiz.");
    }
    if (toplamDaireSayisi > 30) {
      uyariListesi.push("30'dan fazla daire var, 10 tonluk su deposu gerekli.");
    }

    setUyariMesajlari(uyariListesi);
  };

  // Basit stil
  const containerStyle = {
    maxWidth: 480,
    margin: "30px auto",
    padding: 25,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  };
  const labelStyle = { fontWeight: "600", marginBottom: 6, color: "#222" };
  const inputStyle = {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    borderRadius: 8,
    border: "1.5px solid #ccc",
    outline: "none",
  };
  const btnStyle = {
    width: "100%",
    padding: 14,
    backgroundColor: "#007bff",
    color: "white",
    fontWeight: "600",
    fontSize: 18,
    borderRadius: 10,
    cursor: "pointer",
    border: "none",
  };
  const warningStyle = {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#ffe0e0",
    color: "#d8000c",
    borderRadius: 8,
    fontWeight: "600",
  };
  const successStyle = {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#e0ffe0",
    color: "#0a8000",
    borderRadius: 8,
    fontWeight: "600",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: 25 }}>İmar Hesaplama ve Yönetmelik Kontrol</h2>

      <label style={labelStyle}>
        Arsa Alanı (m²):
        <input
          type="number"
          placeholder="Örnek: 500"
          value={arsaM2}
          onChange={(e) => setArsaM2(e.target.value)}
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        TAKS:
        <input
          type="number"
          step="0.01"
          placeholder="Örnek: 0.40"
          value={taks}
          onChange={(e) => setTaks(e.target.value)}
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        KAKS:
        <input
          type="number"
          step="0.01"
          placeholder="Örnek: 1.20"
          value={kaks}
          onChange={(e) => setKaks(e.target.value)}
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        Yola Cephe Sayısı:
        <select
          value={yolCephe}
          onChange={(e) => setYolCephe(e.target.value)}
          style={inputStyle}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3+</option>
        </select>
      </label>

      <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="checkbox"
          checked={egimVar}
          onChange={() => setEgimVar(!egimVar)}
          style={{ width: 20, height: 20, cursor: "pointer" }}
        />
        Arazi Eğimli mi?
      </label>

      <label style={labelStyle}>
        3+1 Daire Ortalama Net M² (0 ise yok sayılır):
        <input
          type="number"
          min="0"
          value={ucArtibirNetM2}
          onChange={(e) => setUcArtibirNetM2(Number(e.target.value))}
          style={inputStyle}
        />
      </label>

      <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="checkbox"
          checked={ticariAlaniIsterMi}
          onChange={() => setTicariAlaniIsterMi(!ticariAlaniIsterMi)}
          style={{ width: 20, height: 20, cursor: "pointer" }}
        />
        Ticari Alan İstiyorum
      </label>

      <label style={labelStyle}>
        Bir Katta Kaç Daire Olsun?
        <select
          value={katBasinaDaire}
          onChange={(e) => setKatBasinaDaire(Number(e.target.value))}
          style={inputStyle}
        >
          {[2, 3, 4, 5].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </label>

      <button onClick={hesapla} style={btnStyle}>
        Hesapla
      </button>

      {uyariMesajlari.length > 0 ? (
        <div style={warningStyle}>
          <h4>Yönetmelik Uyarıları:</h4>
          <ul>
            {uyariMesajlari.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      ) : (
        toplamInsaat > 0 && (
          <div style={successStyle}>
            <h4>Yönetmelik kurallarına uygun.</h4>
            <p>Toplam Kat Sayısı: {toplamKat}</p>
            <p>Toplam Daire Sayısı: {toplamDaire}</p>
            <p>Toplam Brüt İnşaat Alanı: {toplamInsaat.toFixed(2)} m²</p>
          </div>
        )
      )}
    </div>
  );
                 }
