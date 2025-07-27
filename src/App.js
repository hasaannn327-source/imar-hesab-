import React, { useState } from "react";

const ortakAlanOrani = 0.10;
const maxKatYonetmelik = 5;

export default function App() {
  const [arsaM2, setArsaM2] = useState("");
  const [taks, setTaks] = useState("");
  const [kaks, setKaks] = useState("");
  const [yolCephe, setYolCephe] = useState("1");
  const [ikiArtibirNetM2, setIkiArtibirNetM2] = useState("");
  const [ucArtibirNetM2, setUcArtibirNetM2] = useState("");
  const [katBasinaDaire, setKatBasinaDaire] = useState(4);
  const [ticariAlanVar, setTicariAlanVar] = useState(false);
  const [zeminTicari, setZeminTicari] = useState(false);
  const [cekmeMesafeleri, setCekmeMesafeleri] = useState({
    onBahce: 5,
    yanBahce: 3,
    arkaBahce: 4,
  });

  const [sonuclar, setSonuclar] = useState(null);

  function yonetmelikKontrol(arsa, taksVal, kaksVal, cekmeler) {
    const errors = [];
    if (taksVal > 0.5) errors.push("TAKS 0.5'ten büyük olamaz (Madde X).");
    if (kaksVal > 3) errors.push("KAKS 3'ten büyük olamaz (Madde Y).");
    if (arsa < 100) errors.push("Arsa alanı 100 m²'den küçük olamaz (Madde Z).");
    if (cekmeler.onBahce < 5) errors.push("Ön bahçe çekme mesafesi en az 5 m olmalı (Madde A).");
    if (cekmeler.arkaBahce < 3) errors.push("Arka bahçe çekme mesafesi en az 3 m olmalı (Madde B).");
    if (cekmeler.yanBahce < 3) errors.push("Yan bahçe çekme mesafesi en az 3 m olmalı (Madde C).");
    return errors;
  }

  const hesapla = () => {
    const arsa = parseFloat(arsaM2);
    const taksVal = parseFloat(taks);
    const kaksVal = parseFloat(kaks);
    const ikiNet = parseFloat(ikiArtibirNetM2);
    const ucNet = parseFloat(ucArtibirNetM2);
    const katDaire = katBasinaDaire;

    if (isNaN(arsa) || isNaN(taksVal) || isNaN(kaksVal)) {
      alert("Arsa, TAKS ve KAKS değerlerini doğru giriniz.");
      return;
    }
    if ((!ikiNet || ikiNet <= 0) && (!ucNet || ucNet <= 0) && !ticariAlanVar && !zeminTicari) {
      alert("En az bir daire tipi seçilmeli veya ticari alan işaretlenmeli.");
      return;
    }

    const errors = yonetmelikKontrol(arsa, taksVal, kaksVal, cekmeMesafeleri);
    if (errors.length > 0) {
      alert("Yönetmelik Hataları:\n" + errors.join("\n"));
      return;
    }

    // Arsa kenarı (kare varsayıyoruz)
    const arsaKenari = Math.sqrt(arsa);

    // Çekme mesafeleri sonrası net arsa alanı
    const cekmeToplam = (cekmeMesafeleri.onBahce || 0) + (cekmeMesafeleri.arkaBahce || 0);
    const netArsaEni = Math.max(arsaKenari - 2 * (cekmeMesafeleri.yanBahce || 0), 0);
    const netArsaBoyu = Math.max(arsaKenari - cekmeToplam, 0);
    const netArsa = netArsaEni * netArsaBoyu;

    // Maksimum taban alanı arsa * TAKS
    const maxTabanAlani = arsa * taksVal;
    // Taban alanı, çekme mesafesi sonrası net arsa ve TAKS'in küçük olanı
    const efektifTabanAlani = Math.min(maxTabanAlani, netArsa);

    // Brüt ve net inşaat alanları
    const brutInsaat = arsa * kaksVal;
    const netInsaat = brutInsaat * (1 - ortakAlanOrani);

    // Ticari alan hesaplama
    let netTicariAlani = 0;
    if (zeminTicari) {
      netTicariAlani = efektifTabanAlani * (1 - ortakAlanOrani);
    } else if (ticariAlanVar) {
      netTicariAlani = netInsaat * 0.2;
    }
    const netKonutAlani = netInsaat - netTicariAlani;

    // Daire sayıları
    let ikiAdet = 0,
      ucAdet = 0;
    if (ikiNet > 0 && ucNet > 0) {
      ikiAdet = Math.floor((netKonutAlani * 0.5) / ikiNet);
      ucAdet = Math.floor((netKonutAlani * 0.5) / ucNet);
    } else if (ikiNet > 0) {
      ikiAdet = Math.floor(netKonutAlani / ikiNet);
    } else if (ucNet > 0) {
      ucAdet = Math.floor(netKonutAlani / ucNet);
    }
    const toplamDaire = ikiAdet + ucAdet;

    // Blok sayısı yol cephesi sayısına göre
    let blokSayisi = 1;
    if (parseInt(yolCephe) === 2) blokSayisi = 2;
    else if (parseInt(yolCephe) >= 3) blokSayisi = 3;

    // Kat sayısı max 5, blok ve daire sayısına göre
    let katSayisi = Math.ceil(toplamDaire / (katDaire * blokSayisi));
    if (katSayisi > maxKatYonetmelik) {
      while (katSayisi > maxKatYonetmelik) {
        blokSayisi++;
        katSayisi = Math.ceil(toplamDaire / (katDaire * blokSayisi));
      }
    }
    if (katSayisi > maxKatYonetmelik) katSayisi = maxKatYonetmelik;

    // Otopark ihtiyacı
    const otoparkIhtiyaci = Math.ceil(toplamDaire / 3);

    // Su deposu gerekliliği
    const suDeposuGereklilik = toplamDaire > 30 ? "10 tonluk su deposu gereklidir." : "";

    // Ağaç ihtiyacı
    const agacIhtiyaci = arsa >= 500 ? "En az 2 ağaç dikimi gereklidir." : "";

    // Sarnıç zorunluluğu
    const sarnicZorunlu = arsa >= 1000 ? "Sarnıç zorunludur." : "";

    setSonuclar({
      arsa,
      taksVal,
      kaksVal,
      netArsa,
      brutInsaat,
      netInsaat,
      netTicariAlani,
      netKonutAlani,
      ikiAdet,
      ucAdet,
      toplamDaire,
      blokSayisi,
      katSayisi,
      otoparkIhtiyaci,
      suDeposuGereklilik,
      agacIhtiyaci,
      sarnicZorunlu,
      ticariAlanVar,
      zeminTicari,
      cekmeMesafeleri,
      efektifTabanAlani,
      ikiArtibirNetM2,
      ucArtibirNetM2,
    });
  };

  // Stil
  const containerStyle = {
    maxWidth: 520,
    margin: "20px auto",
    padding: 24,
    backgroundColor: "#e9f1f7",
    borderRadius: 14,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: "0 6px 20px rgb(0 0 0 / 0.1)",
  };
  const labelStyle = { display: "block", marginBottom: 8, fontWeight: "600", color: "#222" };
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    marginBottom: 18,
    borderRadius: 8,
    border: "1.7px solid #999",
    fontSize: 16,
  };
  const checkboxStyle = { marginLeft: 10, transform: "scale(1.3)", cursor: "pointer" };
  const btnStyle = {
    width: "100%",
    padding: "14px 0",
    backgroundColor: "#0c5db0",
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    marginTop: 14,
  };
  const resultStyle = {
    marginTop: 30,
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 12,
    boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
    color: "#222",
    lineHeight: 1.6,
  };
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 14,
  };
  const thTdStyle = {
    borderBottom: "2px solid #0c5db0",
    padding: 8,
    textAlign: "right",
  };
  const thTdLeft = {
    ...thTdStyle,
    textAlign: "left",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: 28, color: "#FF0000" }}>
        İmar Hesaplama
      </h2>

      <label style={labelStyle}>
        Arsa Alanı (m²) <small>(Örnek: 500)</small>:
        <input
          type="number"
          value={arsaM2}
          onChange={(e) => setArsaM2(e.target.value)}
          style={inputStyle}
          placeholder="Arsa alanını girin"
          min={0}
        />
      </label>

      <label style={labelStyle}>
        TAKS <small>(Örnek: 0.40)</small>:
        <input
          type="number"
          step="0.01"
          value={taks}
          onChange={(e) => setTaks(e.target.value)}
          style={inputStyle}
          placeholder="TAKS değerini girin"
          min={0}
          max={1}
        />
      </label>

      <label style={labelStyle}>
        KAKS <small>(Örnek: 1.20)</small>:
        <input
          type="number"
          step="0.01"
          value={kaks}
          onChange={(e) => setKaks(e.target.value)}
          style={inputStyle}
          placeholder="KAKS değerini girin"
          min={0}
          max={10}
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

      <label style={labelStyle}>
        2+1 Daire Ortalama Net M² <small>(0 ise hesaplamaya dahil edilmez)</small>:
        <input
          type="number"
          value={ikiArtibirNetM2}
          onChange={(e) => setIkiArtibirNetM2(e.target.value)}
          style={inputStyle}
          min={0}
          placeholder="Örnek: 75"
        />
      </label>

      <label style={labelStyle}>
        3+1 Daire Ortalama Net M² <small>(0 ise hesaplamaya dahil edilmez)</small>:
        <input
          type="number"
          value={ucArtibirNetM2}
          onChange={(e) => setUcArtibirNetM2(e.target.value)}
          style={inputStyle}
          min={0}
          placeholder="Örnek: 110"
        />
      </label>

      <label style={labelStyle}>
        Bir Katta Kaç Daire Olsun?:
        <select
          value={katBasinaDaire}
          onChange={(e) => setKatBasinaDaire(Number(e.target.value))}
          style={inputStyle}
        >
          {[2, 3, 4, 5].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>

      <label style={{ ...labelStyle, display: "flex", alignItems: "center" }}>
        Ticari Alan İstiyorum
        <input
          type="checkbox"
          checked={ticariAlanVar}
          onChange={() => setTicariAlanVar(!ticariAlanVar)}
          style={checkboxStyle}
        />
      </label>

      <label style={{ ...labelStyle, display: "flex", alignItems: "center" }}>
        Zemin Kat Ticari Olsun
        <input
          type="checkbox"
          checked={zeminTicari}
          onChange={() => setZeminTicari(!zeminTicari)}
          style={checkboxStyle}
        />
      </label>

      <h3 style={{ marginTop: 20, marginBottom: 14, color: "#0c5db0" }}>
        Çekme Mesafeleri (metre)
      </h3>

      <label style={labelStyle}>
        Ön Bahçe:
        <input
          type="number"
          value={cekmeMesafeleri.onBahce}
          onChange={(e) =>
            setCekmeMesafeleri((prev) => ({
              ...prev,
              onBahce: Number(e.target.value),
            }))
          }
          style={inputStyle}
          min={0}
        />
      </label>

      <label style={labelStyle}>
        Yan Bahçe:
        <input
          type="number"
          value={cekmeMesafeleri.yanBahce}
          onChange={(e) =>
            setCekmeMesafeleri((prev) => ({
              ...prev,
              yanBahce: Number(e.target.value),
            }))
          }
          style={inputStyle}
          min={0}
        />
      </label>

      <label style={labelStyle}>
        Arka Bahçe:
        <input
          type="number"
          value={cekmeMesafeleri.arkaBahce}
          onChange={(e) =>
            setCekmeMesafeleri((prev) => ({
              ...prev,
              arkaBahce: Number(e.target.value),
            }))
          }
          style={inputStyle}
          min={0}
        />
      </label>

      <button onClick={hesapla} style={btnStyle}>
        Hesapla
      </button>

      {sonuclar && (
        <div style={resultStyle}>
          <h3>Sonuçlar</h3>
          <p>
            Arsa Alanı: <b>{sonuclar.arsa.toFixed(2)} m²</b>
          </p>
          <p>
            Çekme Mesafeleri Sonrası Net Arsa Alanı: <b>{sonuclar.netArsa.toFixed(2)} m²</b>
          </p>
          <p>
            Maksimum Taban Alanı (TAKS ve Çekmelerle):{" "}
            <b>{sonuclar.efektifTabanAlani.toFixed(2)} m²</b>
          </p>
          <p>
            TAKS: <b>{sonuclar.taksVal}</b>, KAKS: <b>{sonuclar.kaksVal}</b>
          </p>
          <p>
            Toplam Brüt İnşaat Alanı: <b>{sonuclar.brutInsaat.toFixed(2)} m²</b>
          </p>
          <p>
            Toplam Net İnşaat Alanı (Ortak Alan %10): <b>{sonuclar.netInsaat.toFixed(2)} m²</b>
          </p>
          <p>
            Ticari Alan: <b>{sonuclar.netTicariAlani.toFixed(2)} m²</b>
          </p>
          <p>
            Konut Alanı: <b>{sonuclar.netKonutAlani.toFixed(2)} m²</b>
          </p>
          <p>
            2+1 Daire Sayısı: <b>{sonuclar.ikiAdet}</b>
          </p>
          <p>
            3+1 Daire Sayısı: <b>{sonuclar.ucAdet}</b>
          </p>
          <p>
            Toplam Daire Sayısı: <b>{sonuclar.toplamDaire}</b>
          </p>
          <p>
            Blok Sayısı: <b>{sonuclar.blokSayisi}</b>
          </p>
          <p>
            Kat Sayısı (Max {maxKatYonetmelik}): <b>{sonuclar.katSayisi}</b>
          </p>
          <p>
            Otopark İhtiyacı (1 otopark / 3 daire): <b>{sonuclar.otoparkIhtiyaci} araç</b>
          </p>
          {sonuclar.suDeposuGereklilik && (
            <p style={{ color: "green" }}>{sonuclar.suDeposuGereklilik}</p>
          )}
          {sonuclar.agacIhtiyaci && (
            <p style={{ color: "green" }}>{sonuclar.agacIhtiyaci}</p>
          )}
          {sonuclar.sarnicZorunlu && (
            <p style={{ color: "green" }}>{sonuclar.sarnicZorunlu}</p>
          )}
          <hr style={{ margin: "20px 0" }} />
          <h4>Daire Dağılım Tablosu</h4>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdLeft}>Daire Tipi</th>
                <th style={thTdStyle}>Ortalama Net M²</th>
                <th style={thTdStyle}>Adet</th>
                <th style={thTdStyle}>Toplam Net M²</th>
              </tr>
            </thead>
            <tbody>
              {sonuclar.ikiAdet > 0 && (
                <tr>
                  <td style={thTdLeft}>2+1</td>
                  <td style={thTdStyle}>{sonuclar.ikiArtibirNetM2}</td>
                  <td style={thTdStyle}>{sonuclar.ikiAdet}</td>
                  <td style={thTdStyle}>
                    {(sonuclar.ikiAdet * sonuclar.ikiArtibirNetM2).toFixed(2)}
                  </td>
                </tr>
              )}
              {sonuclar.ucAdet > 0 && (
                <tr>
                  <td style={thTdLeft}>3+1</td>
                  <td style={thTdStyle}>{sonuclar.ucArtibirNetM2}</td>
                  <td style={thTdStyle}>{sonuclar.ucAdet}</td>
                  <td style={thTdStyle}>
                    {(sonuclar.ucAdet * sonuclar.ucArtibirNetM2).toFixed(2)}
                  </td>
                </tr>
              )}
              <tr>
                <td style={thTdLeft}><b>Toplam</b></td>
                <td style={thTdStyle}>-</td>
                <td style={thTdStyle}><b>{sonuclar.toplamDaire}</b></td>
                <td style={thTdStyle}>
                  <b>
                    {(
                      sonuclar.ikiAdet * sonuclar.ikiArtibirNetM2 +
                      sonuclar.ucAdet * sonuclar.ucArtibirNetM2
                    ).toFixed(2)}
                  </b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
              }
