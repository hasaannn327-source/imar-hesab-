import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function App() {
  const [arsaM2, setArsaM2] = useState("");
  const [taks, setTaks] = useState("");
  const [kaks, setKaks] = useState("");
  const [cekme, setCekme] = useState({ ust: 5, alt: 5, sol: 5, sag: 5 });
  const [planNotlariGoster, setPlanNotlariGoster] = useState(false);
  const [ortalamaDaire, setOrtalamaDaire] = useState(100);

  const [sonuclar, setSonuclar] = useState(null);
  const pdfRef = useRef();

  const hesapla = () => {
    const arsa = parseFloat(arsaM2);
    const t = parseFloat(taks);
    const k = parseFloat(kaks);
    const ortDaire = parseFloat(ortalamaDaire);

    if (!arsa || !t || !k || !ortDaire) {
      alert("Tüm değerleri eksiksiz giriniz.");
      return;
    }

    const insaatAlani = arsa * k;
    const netTicari = insaatAlani * 0.2;
    const netKonut = insaatAlani * 0.8;
    const toplamDaire = Math.floor(netKonut / ortDaire);
    const otopark = Math.ceil(toplamDaire / 3);
    const suDeposu = toplamDaire > 30;

    setSonuclar({
      insaatAlani,
      netTicari,
      netKonut,
      toplamDaire,
      otopark,
      suDeposu,
    });
  };

  const pdfOlustur = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("imar_raporu.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-indigo-600">İmar Hesap Modülü</h1>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Arsa m²"
            value={arsaM2}
            onChange={(e) => setArsaM2(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="TAKS"
            value={taks}
            onChange={(e) => setTaks(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="KAKS"
            value={kaks}
            onChange={(e) => setKaks(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Ortalama Daire m²"
            value={ortalamaDaire}
            onChange={(e) => setOrtalamaDaire(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-4 gap-2 text-sm">
          {["ust", "alt", "sol", "sag"].map((key) => (
            <input
              key={key}
              type="number"
              placeholder={`${key} çekme`}
              value={cekme[key]}
              onChange={(e) =>
                setCekme((prev) => ({ ...prev, [key]: parseFloat(e.target.value) }))
              }
              className="p-1 border rounded"
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={hesapla}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Hesapla
          </button>
          <button
            onClick={pdfOlustur}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            PDF'e Aktar
          </button>
          <label className="ml-auto flex items-center gap-2">
            <input
              type="checkbox"
              checked={planNotlariGoster}
              onChange={() => setPlanNotlariGoster(!planNotlariGoster)}
            />
            Plan Notları
          </label>
        </div>

        <div ref={pdfRef} className="space-y-4">
          {sonuclar && (
            <div className="bg-blue-50 p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Sonuçlar</h2>
              <p>Net İnşaat Alanı: {sonuclar.insaatAlani.toFixed(2)} m²</p>
              <p>Konut Alanı (%80): {sonuclar.netKonut.toFixed(2)} m²</p>
              <p>Ticari Alan (%20): {sonuclar.netTicari.toFixed(2)} m²</p>
              <p>Toplam Daire: {sonuclar.toplamDaire}</p>
              <p>Otopark Sayısı (3 daireye 1): {sonuclar.otopark}</p>
              {sonuclar.suDeposu && (
                <p className="text-red-600 font-semibold">→ 10 tonluk su deposu gerekli</p>
              )}
            </div>
          )}

          {/* Çekme Mesafeli Temsili Yerleşim */}
          <div className="bg-gray-200 p-4 rounded shadow text-center">
            <h3 className="font-medium mb-2">Temsili Arsa Yerleşimi</h3>
            <div
              className="relative bg-white mx-auto"
              style={{ width: 300, height: 300, border: "2px solid #333" }}
            >
              <div
                className="absolute bg-indigo-400"
                style={{
                  top: cekme.ust * 2,
                  left: cekme.sol * 2,
                  width: 300 - (cekme.sol + cekme.sag) * 2,
                  height: 300 - (cekme.ust + cekme.alt) * 2,
                }}
              ></div>
            </div>
            <p className="text-xs mt-1 text-gray-600">
              Bu projede çekme mesafeleri belediye takdirindedir. Tasarım temsili yerleşimdir.
            </p>
          </div>

          {planNotlariGoster && (
            <div className="bg-yellow-100 p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Plan Notları Özeti</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>TAKS/KAKS net parsel üzerinden hesaplanır.</li>
                <li>3 daireye 1 otopark zorunluluğu vardır.</li>
                <li>Bodrum kat emsale dahildir.</li>
                <li>Zemin kat ticari olabilir (isteğe bağlıdır).</li>
                <li>1000 m² üzeri parsellerde otopark zorunludur.</li>
                <li>Çekme mesafeleri belediyece belirlenir.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
              }
