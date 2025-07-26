import React, { useState } from "react";

const ortakAlanOrani = 0.10;
const maxKatYonetmelik = 5; // Örnek maksimum kat Hmax yönetmelikten alınacak şekilde
const defaultCekmeMesafeleri = {
  onBahce: 5,
  yanBahce: 3,
  arkaBahce: 4,
};

export default function App() {
  // Girdiler
  const [arsaM2, setArsaM2] = useState("");
  const [taks, setTaks] = useState("");
  const [kaks, setKaks] = useState("");
  const [yolCephe, setYolCephe] = useState("1");
  const [ikiArtibirNetM2, setIkiArtibirNetM2] = useState("");
  const [ucArtibirNetM2, setUcArtibirNetM2] = useState("");
  const [katBasinaDaire, setKatBasinaDaire] = useState(4);
  const [ticariAlanVar, setTicariAlanVar] = useState(false);

  // Çekme mesafeleri (opsiyonel kullanıcı girişi veya default)
  const [cekmeMesafeleri, setCekmeMesafeleri] = useState(defaultCekmeMesafeleri);

  // Sonuçlar
  const [sonuclar, setSonuclar] = useState(null);

  // Yönetmelik kontrolü fonksiyonu (basit örnek, gerektiği kadar detay eklenebilir)
  function yonetmelikKontrol(arsa, taksVal, kaksVal) {
    const errors = [];
    if (taksVal > 0.5) errors.push("TAKS 0.5'ten büyük olamaz (Madde X).");
    if (kaksVal > 3) errors.push("KAKS 3'ten büyük olamaz (Madde Y).");
    if (arsa < 100) errors.push("Arsa alanı 100 m²'den küçük olamaz (Madde Z).");
    // Buraya gerçek maddeler eklenmeli
    return errors;
  }

  // Hesaplama fonksiyonu
  const hesapla = () => {
    const arsa = parseFloat(arsaM2);
    const taksVal = parseFloat(taks);
    const kaksVal = parseFloat(kaks);
    const ikiNet = parseFloat(ikiArtibirNetM2);
    const ucNet = parseFloat(ucArtibirNetM2);
    const katDaire = katBasinaDaire;

    // Zorunlu alanları kontrol et
    if (isNaN(arsa) || isNaN(taksVal) || isNaN(kaksVal)) {
      alert("Lütfen Arsa, TAKS ve KAKS değerlerini doğru giriniz.");
      return;
    }
    if (
      (isNaN(ikiNet) || ikiNet <= 0) &&
      (isNaN(ucNet) || ucNet <= 0) &&
      !ticariAlanVar
    ) {
      alert("En az bir daire tipi seçilmeli veya ticari alan işaretlenmeli.");
      return;
    }

    // Yönetmelik kontrolü
    const errors = yonetmelikKontrol(arsa, taksVal, kaksVal);
    if (errors.length > 0) {
      alert("Yönetmelik Hataları:\n" + errors.join("\n"));
      return;
    }

    // Çekme mesafeleri nedeniyle net arsa alanı hesapla
    // Burada basitçe kenarlardan toplam çekme mesafesi ile hesap yapıyoruz
    const toplamCekme =
      cekmeMesafeleri.onBahce * arsa ** 0 +
      cekmeMesafeleri.yanBahce * 2 +
      cekmeMesafeleri.arkaBahce;

    // Burada 10 ile çarptım ki alan olarak azaltsın, istersen burayı sen düzenle
    const netArsa = Math.max(arsa - toplamCekme * 10, 0);

    // Brüt ve net inşaat alanları
    const brutInsaat = arsa * kaksVal;
    const netInsaat = brutInsaat * (1 - ortakAlanOrani);

    // Ticari ve konut alanları
    const netTicariAlani = ticariAlanVar ? netInsaat * 0.2 : 0;
    const netKonutAlani = netInsaat - netTicariAlani;

    // Daire adetleri (opsiyonel olarak 0 ise o daire tipi yok sayılır)
    let ikiAdet = 0,
      ucAdet = 0;

    if (ikiNet > 0) ikiAdet = Math.floor((netKonutAlani * 0.5) / ikiNet);
    if (ucNet > 0) ucAdet = Math.floor((netKonutAlani * 0.5) / ucNet);
    const toplamDaire = ikiAdet + ucAdet;

    // Otopark hesabı: her 3 daire için 1 araç
    const otoparkIhtiyaci = Math.ceil(toplamDaire / 3);

    // Su deposu gereklilik: 30+ daire için 10 tonluk depo örnek
    const suDeposuGereklilik =
      toplamDaire > 30 ? "10 tonluk su deposu gereklidir." : "";

    // Ağaç hesabı: arsa 500+ ise 2 ağaç örneği
    const agacIhtiyaci = arsa >= 500 ? "En az 2 ağaç dikimi gereklidir." : "";

    // Sarnıç zorunluluğu: 1000+ arsa alanı için örnek
    const sarnicZorunlu = arsa >= 1000 ? "Sarnıç zorunludur." : "";

    // Blok sayısı ve kat hesabı (max kat: maxKatYonetmelik)
    let blokSayisi = 1;
    if (parseInt(yolCephe) === 2) blokSayisi = 2;
    else if (parseInt(yolCephe) >= 3) blokSayisi = 3;

    // Kat sayısı, daire sayısı ve blok sayısına göre
    let katSayisi = Math.ceil(toplamDaire / (katDaire * blokSayisi));
    if (katSayisi > maxKatYonetmelik) {
      // Kat sayısı fazla ise blok sayısını artırarak kat sayısını azaltmaya çalış
      while (katSayisi > maxKatYonetmelik) {
        blokSayisi++;
        katSayisi = Math.ceil(toplamDaire / (katDaire * blokSayisi));
      }
    }

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
      otoparkIhtiyaci,
      suDeposuGereklilik,
      agacIhtiyaci,
      sarnicZorunlu,
      blokSayisi,
      katSayisi,
      ticariAlanVar,
      cekmeMesafeleri,
    });
  };

  // Arayüz stilleri (temel)
  const containerStyle = {
    maxWidth: 500,
    margin: "20px auto",
    padding: 20,
    backgroundColor: "#f0f4f8",
    borderRadius: 12,
    fontFamily: "'Poppins', sans-serif",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  };
  const labelStyle = { display: "block", marginBottom: 6, fontWeight: "600", color: "#222" };
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 14,
    borderRadius: 8,
    border: "1.5px solid #bbb",
    fontSize: 16,
  };
  const checkboxStyle = { marginLeft: 8, transform: "scale(1.3)", cursor: "pointer" };
  const btnStyle = {
    width: "100%",
    padding: "12px 0",
    backgroundColor: "#0069d9",
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    marginTop: 10,
  };
  const resultStyle = {
    marginTop: 30,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    color: "#111",
    lineHeight: 1.5,
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>İmar Hesaplama Modülü</h2>

      <label style={labelStyle}>
        Arsa Alanı (m²) <small>(Örnek: 500)</small>:
        <input
          type="number"
          value={arsaM2}
          onChange={(e) => setArsaM2(e.target.value)}
          style={inputStyle}
          placeholder="Arsa alanını girin"
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

      <h3 style={{ marginTop: 20, marginBottom: 12 }}>Çekme Mesafeleri (metre)</h3>

      <label style={labelStyle}>
        Ön Bahçe:
        <input
          type="number"
          value={cekmeMesafeleri.onBahce}
          onChange={(e) =>
            setCekmeMesafeleri((prev) => ({ ...prev, onBahce: Number(e.target.value) }))
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
            setCekmeMesafeleri((prev) => ({ ...prev, yanBahce: Number(e.target.value) }))
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
            setCekmeMesafeleri((prev) => ({ ...prev, arkaBahce: Number(e.target.value) }))
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
            Kat Sayısı: <b>{sonuclar.katSayisi}</b>
          </p>
          <p>
            Otopark İhtiyacı (Her 3 daire için 1 araç): <b>{sonuclar.otoparkIhtiyaci}</b>
          </p>
          <p>{sonuclar.suDeposuGereklilik}</p>
          <p>{sonuclar.agacIhtiyaci}</p>
          <p>{sonuclar.sarnicZorunlu}</p>
          <hr style={{ margin: "20px 0" }} />
          <p style={{ fontStyle: "italic", color: "#666" }}>
            Çekme mesafeleri belediye takdirine bırakılmıştır. Tasarım temsili yerleşimdir.
          </p>
        </div>
      )}
    </div>
  );
            }
