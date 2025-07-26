import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function App() {
  // Temel inputlar
  const [arsaM2, setArsaM2] = useState("");
  const [taks, setTaks] = useState("");
  const [kaks, setKaks] = useState("");
  const [yolCephe, setYolCephe] = useState("1");

  // Net daire alanları
  const [ikiArtibirNetM2, setIkiArtibirNetM2] = useState("");
  const [ucArtibirNetM2, setUcArtibirNetM2] = useState("");

  // Ticari alan seçeneği
  const [ticariIstegi, setTicariIstegi] = useState(true);

  // Kat başına daire
  const [katBasinaDaire, setKatBasinaDaire] = useState(4);

  // Çekme mesafeleri (varsayılan, opsiyonel değişebilir)
  const [cekmeYol, setCekmeYol] = useState(3); // m
  const [cekmeYan, setCekmeYan] = useState(2); // m
  const [cekmeArka, setCekmeArka] = useState(2); // m

  // Yönetmelikten gelen max kat (Hmax)
  const [maxKat, setMaxKat] = useState(5); // Örnek sabit 5, istersen input ekleyebilirsin

  // İç durumlar
  const [toplamInsaat, setToplamInsaat] = useState(0);
  const [blokSayisi, setBlokSayisi] = useState(1);

  const [ikiArtibir, setIkiArtibir] = useState(0);
  const [ucArtibir, setUcArtibir] = useState(0);
  const [ticariBirim, setTicariBirim] = useState(0);

  const [uygunlukDurumu, setUygunlukDurumu] = useState(""); // Yönetmelik sonucu mesajı

  const ortakAlanOrani = 0.1;
  const planRef = useRef();

  // Yönetmelik kontrolü fonksiyonu
  function yonetmelikKontrol(arsa, taksVal, kaksVal, katSayisi) {
    // Basit örnek kontroller, istediğin kadar geliştirilebilir:
    if (taksVal > 0.6) return "TAKS 0.6'dan büyük olamaz!";
    if (kaksVal > 2.0) return "KAKS 2.0'dan büyük olamaz!";
    if (katSayisi > maxKat) return `Kat sayısı ${maxKat}’dan fazla olamaz!`;
    if (arsa < 100) return "Arsa çok küçük (min 100 m² olmalı).";
    return ""; // Uygun
  }

  // Hesaplama fonksiyonu
  const hesapla = () => {
    const arsa = parseFloat(arsaM2);
    const taksVal = parseFloat(taks);
    const kaksVal = parseFloat(kaks);

    if (isNaN(arsa) || isNaN(taksVal) || isNaN(kaksVal)) {
      alert("Lütfen Arsa, TAKS ve KAKS değerlerini doğru girin!");
      return;
    }

    // Çekme mesafelerine göre efektif arsa alanı hesapla
    // Basitçe: Çekme mesafeleri toplamını 2 ile çarp, dikdörtgen varsayımıyla
    // Arsa kare varsayımı olmadığından, en azından % olarak gösterelim

    const toplamCekme = cekmeYol + cekmeYan * 2 + cekmeArka;
    // Burada biraz basitleştiriyoruz:
    // Arsa eni ve boyu bilinmediği için yaklaşık % çekme mesafesi alan kaybı hesaplanıyor
    // Gerçek proje için arsa eni-boyu girilmeli
    const cekmeAlanKaybiOrani = toplamCekme / Math.sqrt(arsa); // Yaklaşık

    let efektifArsa = arsa * (1 - cekmeAlanKaybiOrani);
    if (efektifArsa < 0) efektifArsa = 0;

    // Brüt inşaat
    const brutInsaat = efektifArsa * kaksVal;
    setToplamInsaat(brutInsaat);

    // Blok sayısı yola cepheye göre
    let blok;
    if (yolCephe === "1") blok = 1;
    else if (yolCephe === "2") blok = 2;
    else blok = 3;
    setBlokSayisi(blok);

    // Net inşaat alanı (ortak alan hariç)
    const netInsaat = brutInsaat * (1 - ortakAlanOrani);

    // Ticari ve konut alanları
    let ticariNetAlani = 0;
    let konutNetAlani = 0;

    if (ticariIstegi) {
      ticariNetAlani = netInsaat * 0.2;
      konutNetAlani = netInsaat * 0.8;
    } else {
      ticariNetAlani = 0;
      konutNetAlani = netInsaat;
    }

    // 2+1 ve 3+1 daire adetleri
    const ikiNet = parseFloat(ikiArtibirNetM2);
    const ucNet = parseFloat(ucArtibirNetM2);

    const daire2Adet = ikiNet > 0 ? Math.floor(konutNetAlani / ikiNet) : 0;
    const daire3Adet = ucNet > 0 ? Math.floor(konutNetAlani / ucNet) : 0;

    setIkiArtibir(daire2Adet);
    setUcArtibir(daire3Adet);

    // Ticari dükkan sayısı
    const ticariAdet = ticariNetAlani > 0 ? Math.floor(ticariNetAlani / 100) : 0;
    setTicariBirim(ticariAdet);

    // Tahmini kat sayısı (daha önce hesaplanır, maxKat'ı aşamaz)
    const toplamDaire = daire2Adet + daire3Adet;
    const toplamKat = Math.ceil(toplamDaire / (katBasinaDaire * blok));
    const katSayisi = Math.min(toplamKat, maxKat);

    // Yönetmelik kontrolü yap
    const yonetmelikMesaj = yonetmelikKontrol(arsa, taksVal, kaksVal, katSayisi);
    setUygunlukDurumu(yonetmelikMesaj);
  };

  // PDF oluşturma fonksiyonu (aynı önceki gibi)
  const pdfOlustur = () => {
    if (!planRef.current) return;
    html2canvas(planRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.setFontSize(16);
      pdf.text("İmar Hesaplama Raporu", 10, 20);
      pdf.setFontSize(12);
      pdf.text(`Arsa Alanı: ${arsaM2} m²`, 10, 30);
      pdf.text(`TAKS: ${taks}`, 10, 40);
      pdf.text(`KAKS: ${kaks}`, 10, 50);
      pdf.text(`Yola Cephe Sayısı: ${yolCephe}`, 10, 60);
      pdf.text(`Toplam Brüt İnşaat Alanı: ${toplamInsaat.toFixed(2)} m²`, 10, 70);
      pdf.text(
        `Toplam Net İnşaat Alanı (Ortak Alan %10): ${(toplamInsaat * (1 - ortakAlanOrani)).toFixed(2)} m²`,
        10,
        80
      );
      pdf.text(`Önerilen Blok Sayısı: ${blokSayisi}`, 10, 90);
      pdf.text(
        `2+1 Daire Sayısı: ${ikiArtibir} (Ortalama Net: ${ikiArtibirNetM2 || 0} m²)`,
        10,
        100
      );
      pdf.text(
        `3+1 Daire Sayısı: ${ucArtibir} (Ortalama Net: ${ucArtibirNetM2 || 0} m²)`,
        10,
        110
      );
      pdf.text(`Tahmini Dükkan Sayısı: ${ticariBirim}`, 10, 120);
      pdf.text(`Kat Başına Daire Sayısı: ${katBasinaDaire}`, 10, 130);
      pdf.text(`Maksimum Kat Sayısı (Yönetmelik): ${maxKat}`, 10, 140);
      pdf.text(
        uygunlukDurumu ? `UYARI: ${uygunlukDurumu}` : "Yönetmelik Uygunluğu: TAMAM",
        10,
        150
      );

      pdf.addImage(imgData, "PNG", 10, 160, 180, 100);
      pdf.save("imar_raporu.pdf");
    });
  };

  // Blok çizimi
  const BlokYerlesimSVG = () => {
    const width = 300;
    const height = 200;
    const blokWidth = blokSayisi === 1 ? 250 : blokSayisi === 2 ? 120 : 80;
    const blokHeight = 150;
    const blokGap = 10;

    return (
      <svg width={width} height={height} style={{ border: "1px solid #aaa", borderRadius: 8, marginTop: 20 }}>
        {[...Array(blokSayisi)].map((_, i) => {
          const x = i * (blokWidth + blokGap);
          const y = 20;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={blokWidth}
              height={blokHeight}
              fill="#4a90e2"
              stroke="#003366"
              strokeWidth={2}
              rx={10}
              ry={10}
            />
          );
        })}
        <text x="10" y="15" fontSize="14" fill="#333">
          Blok Yerleşim Planı
        </text>
      </svg>
    );
  };

  const [btnHover, setBtnHover] = useState(false);

  const btnStyle = {
    width: "100%",
    padding: 14,
    fontSize: 18,
    borderRadius: 10,
    border: "none",
    backgroundColor: btnHover ? "#0056b3" : "#007bff",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: 15,
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 15px",
    marginBottom: 15,
    borderRadius: 8,
    border: "1.8px solid #ccc",
    fontSize: 16,
    outline: "none",
  };

  const labelStyle = {
    fontWeight: "600",
    display: "block",
    marginBottom: 6,
    color: "#333",
  };

  const containerStyle = {
    maxWidth: 470,
    margin: "40px auto",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f7f9fc",
    padding: 25,
    borderRadius: 15,
    boxShadow: "0 12px 25px rgba(0,0,0,0.12)",
  };

  const resultsStyle = {
    marginTop: 30,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };

  const toplamDaire = ikiArtibir + ucArtibir;
  const toplamKat = Math.ceil(toplamDaire / (katBasinaDaire * blokSayisi));

  // Gösterilecek efektif arsa alanı
  const cekmeYuzdesi = Math.min(cekmeYol + cekmeYan * 2 + cekmeArka, Math.sqrt(arsaM2 || 0));
  let efektifArsaAlan = 0;
  if (arsaM2 && cekmeYuzdesi > 0) {
    let oran = cekmeYuzdesi / Math.sqrt(arsaM2);
    efektifArsaAlan = arsaM2 * (1 - oran);
    if (efektifArsaAlan < 0) efektifArsaAlan = 0;
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", color: "#222", marginBottom: 25 }}>
        İmar Hesaplama ve Yönetmelik Kontrolü
      </h2>

      <label style={labelStyle}>
        Arsa Alanı (m²):
        <input
          type="number"
          value={arsaM2}
          onChange={(e) => setArsaM2(e.target.value)}
          style={inputStyle}
          placeholder="Örnek: 500"
        />
      </label>

      <label style={labelStyle}>
        TAKS:
        <input
          type="number"
          step="0.01"
          value={taks}
          onChange={(e) => setTaks(e.target.value)}
          style={inputStyle}
          placeholder="Örnek: 0.40"
        />
      </label>

      <label style={labelStyle}>
        KAKS:
        <input
          type="number"
          step="0.01"
          value={kaks}
          onChange={(e) => setKaks(e.target.value)}
          style={inputStyle}
          placeholder="Örnek: 1.20"
        />
      </label>

      <label style={labelStyle}>
        Yola Cephe Sayısı:
        <select
          value={yolCephe}
          onChange={(e) => setYolCephe(e.target.value)}
          style={{ ...inputStyle, padding: "12px 10px" }}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3+</option>
        </select>
      </label>

      <label style={labelStyle}>
        2+1 Daire Ortalama Net M² (0 ise hesaplanmaz):
        <input
          type="number"
          min={0}
          value={ikiArtibirNetM2}
          onChange={(e) => setIkiArtibirNetM2(e.target.value)}
          style={inputStyle}
          placeholder="Örnek: 75"
        />
      </label>

      <label style={labelStyle}>
        3+1 Daire Ortalama Net M² (0 ise hesaplanmaz):
        <input
          type="number"
          min={0}
          value={ucArtibirNetM2}
          onChange={(e) => setUcArtibirNetM2(e.target.value)}
          style={inputStyle}
          placeholder="Örnek: 110"
        />
      </label>

      <label
        style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 10 }}
      >
        Ticari İster misiniz?
        <input
          type="checkbox"
          checked={ticariIstegi}
          onChange={() => setTicariIstegi(!ticariIstegi
