import React, { useState, useRef } from "react"; import jsPDF from "jspdf"; import html2canvas from "html2canvas";

export default function App() { const [arsaM2, setArsaM2] = useState(0); const [taks, setTaks] = useState(0); const [kaks, setKaks] = useState(0); const [zeminTicari, setZeminTicari] = useState(false); const [cekme, setCekme] = useState({ on: 5, yan: 3, arka: 3 }); const [planNotuGoster, setPlanNotuGoster] = useState(false); const [ilce, setIlce] = useState("default"); const pdfRef = useRef();

const emsalAlan = arsaM2 * kaks; const toplamInsaatAlani = emsalAlan; const netTicariAlani = zeminTicari ? toplamInsaatAlani * 0.2 : 0; const netKonutAlani = toplamInsaatAlani - netTicariAlani; const ortDaireM2 = 120; const daireSayisi = Math.floor(netKonutAlani / ortDaireM2); const otoparkSayisi = Math.ceil(daireSayisi / 3); const suDeposu = daireSayisi > 30 ? "10 tonluk su deposu gerekli" : "Yeterli";

const handleDownloadPDF = () => { html2canvas(pdfRef.current).then((canvas) => { const imgData = canvas.toDataURL("image/png"); const pdf = new jsPDF(); const imgProps = pdf.getImageProperties(imgData); const pdfWidth = pdf.internal.pageSize.getWidth(); const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); pdf.save("imar-hesabi.pdf"); }); };

const handleCekmeChange = (e) => { const { name, value } = e.target; setCekme({ ...cekme, [name]: parseFloat(value) }); };

return ( <div className="p-4 font-sans" style={{ maxWidth: "800px", margin: "auto" }}> <h1 className="text-2xl font-bold mb-4">İmar Hesap Modülü</h1> <div className="grid grid-cols-2 gap-4"> <input type="number" placeholder="Arsa m²" onChange={(e) => setArsaM2(Number(e.target.value))} /> <input type="number" step="0.01" placeholder="TAKS" onChange={(e) => setTaks(Number(e.target.value))} /> <input type="number" step="0.01" placeholder="KAKS" onChange={(e) => setKaks(Number(e.target.value))} /> <label> <input type="checkbox" checked={zeminTicari} onChange={(e) => setZeminTicari(e.target.checked)} /> Zemin Kat Ticari </label> <div> <label>İlçe:</label> <select value={ilce} onChange={(e) => setIlce(e.target.value)}> <option value="default">Belediye Seçiniz</option> <option value="buyukcekmece">Büyükçekmece</option> <option value="avcilar">Avcılar</option> </select> </div> </div>

<hr className="my-4" />

  <h2 className="text-lg font-semibold">Çekme Mesafeleri (metre)</h2>
  <div className="grid grid-cols-3 gap-2">
    <div>
      <label>Ön (Yoldan):</label>
      <input type="number" name="on" value={cekme.on} onChange={handleCekmeChange} />
    </div>
    <div>
      <label>Yan:</label>
      <input type="number" name="yan" value={cekme.yan} onChange={handleCekmeChange} />
    </div>
    <div>
      <label>Arka:</label>
      <input type="number" name="arka" value={cekme.arka} onChange={handleCekmeChange} />
    </div>
  </div>

  <div className="mt-4" ref={pdfRef}>
    <h2 className="text-xl font-bold">Hesap Sonuçları</h2>
    <p><strong>Emsal Alan:</strong> {emsalAlan.toFixed(2)} m²</p>
    <p><strong>Konut Alanı:</strong> {netKonutAlani.toFixed(2)} m² (%80)</p>
    <p><strong>Ticaret Alanı:</strong> {netTicariAlani.toFixed(2)} m² (%20)</p>
    <p><strong>Daire Sayısı:</strong> {daireSayisi} adet</p>
    <p><strong>Otopark:</strong> {otoparkSayisi} araç</p>
    <p><strong>Su Deposu:</strong> {suDeposu}</p>
  </div>

  <button onClick={handleDownloadPDF} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">PDF Oluştur</button>

  <div className="mt-4">
    <label>
      <input type="checkbox" checked={planNotuGoster} onChange={(e) => setPlanNotuGoster(e.target.checked)} /> Plan Notlarını Göster
    </label>
    {planNotuGoster && (
      <div className="mt-2 p-2 border border-gray-400">
        <p>• TAKS/KAKS net parsel üzerinden hesaplanır.</p>
        <p>• 3 daireye 1 otopark zorunluluğu vardır.</p>
        <p>• Bodrum kat emsale dahildir.</p>
        <p>• Zemin kat ticari olabilir (isteğe bağlı).</p>
        <p>• 1000 m² üzeri parsellerde otopark zorunludur.</p>
        <p>• Çekme mesafeleri belediye takdirindedir.</p>
      </div>
    )}
  </div>
</div>

); }

