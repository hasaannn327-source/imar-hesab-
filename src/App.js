import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function App() {
  const [arsaM2, setArsaM2] = useState("");
  const [taks, setTaks] = useState("");
  const [kaks, setKaks] = useState("");
  const [kat, setKat] = useState("");
  const [zeminTicari, setZeminTicari] = useState(false);
  const [planNotu, setPlanNotu] = useState(false);
  const hesapRef = useRef();

  const handlePDF = () => {
    html2canvas(hesapRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("imar_hesap_raporu.pdf");
    });
  };

  const hesapla = () => {
    const arsa = parseFloat(arsaM2);
    const emsal = parseFloat(kaks);
    const toplamInsaatAlani = arsa * emsal;

    const zeminKatAlani = zeminTicari ? arsa * parseFloat(taks) : 0;
    const konutAlani = toplamInsaatAlani - zeminKatAlani;

    const ikiArtıBirM2 = 90;
    const üçArtıBirM2 = 120;

    const max3plus1 = Math.floor(konutAlani / üçArtıBirM2);
    const kalanAlan = konutAlani - max3plus1 * üçArtıBirM2;
    const max2plus1 = Math.floor(kalanAlan / ikiArtıBirM2);

    const daireSayisi = max3plus1 + max2plus1;
    const otopark = Math.ceil(daireSayisi / 3);
    const suKuyusu = daireSayisi > 30 ? "10 tonluk su deposu gerekli" : "Gerekli değil";

    return {
      toplamInsaatAlani,
      zeminKatAlani,
      konutAlani,
      max2plus1,
      max3plus1,
      daireSayisi,
      otopark,
      suKuyusu,
    };
  };

  const sonuc = arsaM2 && kaks && taks && kat ? hesapla() : null;

  return (
    <div className="p-4 max-w-3xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">İmar Hesaplama Modülü</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="number"
          placeholder="Arsa m²"
          className="p-2 border"
          value={arsaM2}
          onChange={(e) => setArsaM2(e.target.value)}
        />
        <input
          type="number"
          placeholder="TAKS"
          className="p-2 border"
          value={taks}
          onChange={(e) => setTaks(e.target.value)}
        />
        <input
          type="number"
          placeholder="KAKS (Emsal)"
          className="p-2 border"
          value={kaks}
          onChange={(e) => setKaks(e.target.value)}
        />
        <input
          type="number"
          placeholder="Kat Sayısı"
          className="p-2 border"
          value={kat}
          onChange={(e) => setKat(e.target.value)}
        />
        <label className="col-span-2">
          <input
            type="checkbox"
            checked={zeminTicari}
            onChange={() => setZeminTicari(!zeminTicari)}
          />
          <span className="ml-2">Zemin kat ticari mi?</span>
        </label>
        <label className="col-span-2">
          <input
            type="checkbox"
            checked={planNotu}
            onChange={() => setPlanNotu(!planNotu)}
          />
          <span className="ml-2">Plan notlarını göster</span>
        </label>
      </div>

      {sonuc && (
        <div ref={hesapRef} className="border p-4 bg-white shadow">
          <h2 className="text-xl font-semibold mb-2">📊 Hesap Sonuçları</h2>
          <p>Toplam inşaat alanı: {sonuc.toplamInsaatAlani.toFixed(2)} m²</p>
          <p>Ticari alan (zemin): {sonuc.zeminKatAlani.toFixed(2)} m²</p>
          <p>Konut alanı: {sonuc.konutAlani.toFixed(2)} m²</p>
          <p>3+1 daire sayısı: {sonuc.max3plus1}</p>
          <p>2+1 daire sayısı: {sonuc.max2plus1}</p>
          <p>Toplam daire sayısı: {sonuc.daireSayisi}</p>
          <p>Otopark ihtiyacı: {sonuc.otopark} araçlık</p>
          <p>Su deposu: {sonuc.suKuyusu}</p>
        </div>
      )}

      <div className="mt-4 flex gap-4">
        <button
          onClick={handlePDF}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          PDF Oluştur
        </button>
      </div>

      {planNotu && (
        <div className="mt-8 p-4 border bg-gray-50 text-sm max-h-[400px] overflow-auto">
          <h3 className="font-bold text-lg mb-2">📘 Plan Notları Özeti</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Eğimden kazanılan bodrum katlar emsale dahildir.</li>
            <li>TAKS/KAKS net parsel üzerinden hesaplanır.</li>
            <li>Otopark: 3 daireye 1 otopark (bina altı da olabilir).</li>
            <li>1000 m² üzeri parsellerde otopark zorunludur.</li>
            <li>Zemin ticari kullanım isteğe bağlıdır.</li>
            <li>Kişi başı inşaat alanı 35 m² esas alınmıştır.</li>
            <li>Dere yapı yaklaşma mesafesi: 10 metre (her iki yan).</li>
            <li>VOR alanlarında yükseklik sınırı formülle belirlenir.</li>
            <li>Yapı yasağı alanlarında yapılamaz (dere, içme suyu havzası vs.).</li>
          </ul>
        </div>
      )}
    </div>
  );
        }
