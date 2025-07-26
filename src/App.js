import React, { useState } from "react";

export default function App() {
  // Sabitler / yönetmelik varsayımları
  const HMAX = 5; // maksimum kat sayısı (yönetmelikten çekilmiş gibi sabit)
  const TAKS_MAX = 0.4; // örnek maksimum TAKS
  const KAKS_MAX = 1.2; // örnek maksimum KAKS
  const ortakAlanOrani = 0.1; // %10 ortak alan
  const daireBasinaOrtalamaOtopark = 1 / 3; // 3 daireye 1 araç
  const suDeposuDaireSiniri = 30; // 30 dan sonra su deposu gerekli

  // State'ler
  const [arsaM2, setArsaM2] = useState("");
  const [taks, setTaks] = useState("");
  const [kaks, setKaks] = useState("");
  const [yolCephe, setYolCephe] = useState("1");

  const [cekmeler, setCekmeler] = useState({
    onBahce: 3, // default 3 m belediye çekme mesafesi
    yanBahce: 2,
    arkaBahce: 3,
  });

  const [ikiArtibirNetM2, setIkiArtibirNetM2] = useState("");
  const [ucArtibirNetM2, setUcArtibirNetM2] = useState("");

  const [ticariIstek, setTicariIstek] = useState(false);

  const [sonuclar, setSonuclar] = useState(null);
  const [uyari, setUyari] = useState(null);

  // Yönetmelik temel kontrol fonksiyonu
  function yonetmelikKontrol(arsa, taksVal, kaksVal) {
    if (taksVal > TAKS_MAX)
      return `TAKS değeri yönetmelik maksimumu olan ${TAKS_MAX}'i aşıyor!`;
    if (kaksVal > KAKS_MAX)
      return `KAKS değeri yönetmelik maksimumu olan ${KAKS_MAX}'i aşıyor!`;
    if (arsa < 100) return "Arsa alanı 100 m²'den küçük olamaz!";
    if (arsa > 10000) return "Arsa alanı 10,000 m²'den büyük olamaz!";
    return null;
  }

  // Hesapla butonu fonksiyonu
  function hesapla() {
    setUyari(null);
    setSonuclar(null);

    // Sayısal değerler
    const arsa = parseFloat(arsaM2);
    const taksVal = parseFloat(taks);
    const kaksVal = parseFloat(kaks);
    const ikiNet = parseFloat(ikiArtibirNetM2);
    const ucNet = parseFloat(ucArtibirNetM2);

    if (
      isNaN(arsa) ||
      isNaN(taksVal) ||
      isNaN(kaksVal) ||
      isNaN(ikiNet) ||
      isNaN(ucNet)
    ) {
      setUyari("Lütfen tüm sayısal alanları doğru ve boş bırakmadan doldurun.");
      return;
    }

    // Yönetmelik kontrolü
    const yonetmelikHata = yonetmelikKontrol(arsa, taksVal, kaksVal);
    if (yonetmelikHata) {
      setUyari(yonetmelikHata);
      return;
    }

    // Çekme mesafeleri toplamı
    const cekmeToplam =
      cekmeler.onBahce + cekmeler.yanBahce * 2 + cekmeler.arkaBahce;

    if (cekmeToplam * (arsa ** 0.5) > arsa) {
      setUyari(
        "Çekme mesafeleri toplamı arsa alanına göre çok yüksek, lütfen azaltın."
      );
      return;
    }

    // Net arsa alanı (çekmelerden kalan)
    // Basit yaklaşık hesap: arsa - (ön + arka) * yan genişlik - 2 * yan çekmeler * ön arka genişlik
    // Daha doğru alan hesaplaması için geometrik detay lazım, burada basitleştiriyoruz.

    const netArsa = Math.max(arsa - arsa * 0.2, 0); // varsayılan %20 kayıp çekme mesafeleri nedeniyle

    // Brüt ve net inşaat alanı
    const brutInsaat = arsa * kaksVal;
    const netInsaat = brutInsaat * (1 - ortakAlanOrani);

    // Net ticari ve konut alanları
    const netTicari = ticariIstek ? netInsaat * 0.2 : 0;
    const netKonut = ticariIstek ? netInsaat * 0.8 : netInsaat;

    // Daire adetleri
    const daireUc = ucNet > 0 ? Math.floor(netKonut / ucNet) : 0;
    const daireIki = ikiNet > 0 ? Math.floor(netKonut / ikiNet) : 0;

    // Toplam daire
    const toplamDaire = daireUc + daireIki;

    // Maks kat sınırı ve kat sayısı kontrolü
    const maxDaireKatSiniri = HMAX * 4; // örn 4 daire kat başı limit
    let kullanilabilirDaire = toplamDaire;

    if (toplamDaire > maxDaireKatSiniri) {
      kullanilabilirDaire = maxDaireKatSiniri;
      setUyari(
        `Toplam daire sayısı (${toplamDaire}) Hmax kat sınırına (${HMAX}) göre azaltıldı. Yeni toplam: ${kullanilabilirDaire}`
      );
    }

    // Otopark hesaplama
    const otoparkAdet = Math.ceil(kullanilabilirDaire * daireBasinaOrtalamaOtopark);
    const suDeposuGerekli = kullanilabilirDaire > suDeposuDaireSiniri;

    // Sonuç set et
    setSonuclar({
      brutInsaat,
      netInsaat,
      netTicari,
      netKonut,
      daireUc,
      daireIki,
      toplamDaire: kullanilabilirDaire,
      otoparkAdet,
      suDeposuGerekli,
      netArsa,
      cekmeler,
      hmax: HMAX,
    });
  }

  // Arayüz stil objeleri (basit)
  const containerStyle = {
    maxWidth: 500,
    margin: "30px auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  };

  const labelStyle = {
    display: "block",
    marginTop: 10,
    marginBottom: 6,
    fontWeight: "600",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    fontSize: 16,
    borderRadius: 6,
    border: "1.5px solid #ccc",
  };

  const checkboxStyle = {
    marginLeft: 10,
    transform: "scale(1.2)",
  };

  const buttonStyle = {
    marginTop: 20,
    width: "100%",
    padding: 12,
    fontSize: 18,
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  };

  const errorStyle = {
    marginTop: 15,
    color: "red",
    fontWeight: "700",
  };

  const resultBoxStyle = {
    marginTop: 25,
    padding: 15,
    backgroundColor: "#e9f5ff",
    borderRadius: 8,
    border: "1.5px solid #007bff",
  };

  // Çekme mesafeleri güncelleme fonksiyonu
  function cekmeDegistir(e) {
    const { name, value } = e.target;
    setCekmeler((prev) => ({
      ...prev,
      [name]: value === "" ? "" : parseFloat(value),
    }));
  }

  // SVG Basit çizim - arsa ve çekme mesafeleri alanı
  function ArsaSVG() {
    if (!sonuclar) return null;

    const width = 300;
    const height = 200;

    // Oranlar
    const arsaKenar = Math.sqrt(arsaM2);
    const netKenar = Math.sqrt(sonuclar.netArsa);

    // Ölçek hesaplama (maks 280 px genişlik)
    const scale = 280 / arsaKenar;

    const arsaPixel = arsaKenar * scale;
    const netPixel = netKenar * scale;

    const margin = 10;

    return (
      <svg width={width} height={height} style={{ border: "1px solid #007bff", borderRadius: 8 }}>
        {/* Arsa dış çerçeve */}
        <rect
          x={margin}
          y={margin}
          width={arsaPixel}
          height={arsaPixel}
          fill="#cce5ff"
          stroke="#007bff"
          strokeWidth="2"
          rx="10"
          ry="10"
        />
        {/* Net arsa (çekme mesafeleri sonrası) */}
        <rect
          x={margin + (arsaPixel - netPixel) / 2}
          y={margin + (arsaPixel - netPixel) / 2}
          width={netPixel}
          height={netPixel}
          fill="#007bff"
          opacity="0.3"
          rx="6"
          ry="6"
        />
        <text x={margin + 5} y={margin + 20} fill="#003366" fontWeight="700" fontSize="14">
          Arsa (m²): {arsaM2}
        </text>
        <text x={margin + 5} y={margin + 40} fill="#003366" fontWeight="700" fontSize="14">
          Net Arsa (m²): {sonuclar.netArsa.toFixed(2)}
        </text>
        <text x={margin + 5} y={margin + 60} fill="#003366" fontWeight="700" fontSize="14">
          Çekme Mesafeleri Uygulandı
        </text>
      </svg>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>İmar Hesaplama Modülü</h2>

      <label style={labelStyle}>
        Arsa Alanı (m²) <br />
        <input
          type="number"
          placeholder="Örnek: 500"
          style={inputStyle}
          value={arsaM2}
          onChange={(e) => setArsaM2(e.target.value)}
        />
      </label>

      <label style={labelStyle}>
        TAKS (max {TAKS_MAX}) <br />
        <input
          type="number"
          step="0.01"
          placeholder="Örnek: 0.40"
          style={inputStyle}
          value={taks}
          onChange={(e) => setTaks(e.target.value)}
        />
      </label>

      <label style={labelStyle}>
        KAKS (max {KAKS_MAX}) <br />
        <input
          type="number"
          step="0.01"
          placeholder="Örnek: 1.20"
          style={inputStyle}
          value={kaks}
          onChange={(e) => setKaks(e.target.value)}
        />
      </label>

      <label style={labelStyle}>
        Yol Cephe Sayısı <br />
        <select
          style={inputStyle}
          value={yolCephe}
          onChange={(e) => setYolCephe(e.target.value)}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3+</option>
        </select>
      </label>

      <fieldset
        style={{
          border: "1.5px solid #007bff",
          borderRadius: 8,
          padding: 15,
          marginTop: 20,
        }}
      >
        <legend style={{ fontWeight: "700", color: "#007bff" }}>
          Çekme Mesafeleri (m)
        </legend>
        <label style={labelStyle}>
          Ön Bahçe
          <input
            name="onBahce"
            type="number"
            min={0}
            step={0.1}
            style={{ ...inputStyle, marginTop: 5 }}
            value={cekmeler.onBahce}
            onChange={cekmeDegistir}
          />
        </label>
        <label style={labelStyle}>
          Yan Bahçe
          <input
            name="yanBahce"
            type="number"
            min={0}
            step={0.1}
            style={{ ...inputStyle, marginTop: 5 }}
            value={cekmeler.yanBahce}
            onChange={cekmeDegistir}
          />
        </label>
        <label style={labelStyle}>
          Arka Bahçe
          <input
            name="arkaBahce"
            type="number"
            min={0}
            step={0.1}
            style={{ ...inputStyle, marginTop: 5 }}
            value={cekmeler.arkaBahce}
            onChange={cekmeDegistir}
          />
        </label>
      </fieldset>

      <label style={labelStyle}>
        2+1 Daire Ortalama Net M² (0 girersen kullanılmaz) <br />
        <input
          type="number"
          min={0}
          placeholder="Örnek: 75"
          style={inputStyle}
          value={ikiArtibirNetM2}
          onChange={(e) => setIkiArtibirNetM2(e.target.value)}
        />
      </label>

      <label style={labelStyle}>
        3+1 Daire Ortalama Net M² (0 girersen kullanılmaz) <br />
        <input
          type="number"
          min={0}
          placeholder="Örnek: 110"
          style={inputStyle}
          value={ucArtibirNetM2}
          onChange={(e) => setUcArtibirNetM2(e.target.value)}
        />
      </label>

      <label style={{ ...labelStyle, display: "flex", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={ticariIstek}
          onChange={() => setTicariIstek(!ticariIstek)}
          style={checkboxStyle}
        />
        <span style={{ marginLeft: 8 }}>Ticari Alan İstiyorum</span>
      </label>

      <button style={buttonStyle} onClick={hesapla}>
        Hesapla
      </button>

      {uyari && <div style={errorStyle}>{uyari}</div>}

      {sonuclar && (
        <div style={resultBoxStyle}>
          <h3>Sonuçlar</h3>
          <p>Toplam Brüt İnşaat Alanı: {sonuclar.brutInsaat.toFixed(2)} m²</p>
          <p>Toplam Net İnşaat Alanı (Ortak Alan %10): {sonuclar.netInsaat.toFixed(2)} m²</p>
          {ticariIstek && <p>Ticari Alan: {sonuclar.netTicari.toFixed(2)} m²</p>}
          <p>Konut Alanı: {sonuclar.netKonut.toFixed(2)} m²</p>
          <p>2+1 Daire Sayısı: {sonuclar.daireIki}</p>
          <p>3+1 Daire Sayısı: {sonuclar.daireUc}</p>
          <p>Toplam Daire Sayısı (Hmax sınırına göre): {sonuclar.toplamDaire}</p>
          <p>Önerilen Otopark Adedi (3 daireye 1 araç): {sonuclar.otoparkAdet}</p>
          {sonuclar.suDeposuGerekli && (
            <p style={{ color: "red", fontWeight: "700" }}>
              30 daireyi geçtiğiniz için 10 tonluk su deposu gereklidir!
            </p>
          )}
          <hr />
          <p>Arsa Alanı: {arsaM2} m²</p>
          <p>Çekme Mesafeleri Uygulandı</p>
          <p>Net Arsa Alanı (çekme mesafeleri sonrası tahmini): {sonuclar.netArsa.toFixed(2)} m²</p>
          <p>Hmax Kat Sayısı: {sonuclar.hmax}</p>
          <ArsaSVG />
          <hr />
          <h4>Plan Notları</h4>
