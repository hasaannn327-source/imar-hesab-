import React, { useState, useEffect } from "react"; import mammoth from "mammoth";

export default function PlanKontrol({ arsaM2, insaatM2, daireSayisi, onFeedback }) { const [veriler, setVeriler] = useState([]);

useEffect(() => { const fetchPlanNotlari = async () => { try { const response = await fetch("/plannotlari.docx"); const blob = await response.blob(); const arrayBuffer = await blob.arrayBuffer(); const result = await mammoth.extractRawText({ arrayBuffer }); const text = result.value;

const uyarilar = [];

    if (text.includes("sarnıç") || text.includes("su deposu")) {
      if (insaatM2 < 100) {
        uyarilar.push("Sarnıç gerekli olabilir, inşaat alanı çok düşük.");
      }
    }

    if (text.includes("otopark")) {
      if (daireSayisi >= 5 && !text.includes("her 1 daire için 1 otopark")) {
        uyarilar.push("Otopark şartı olabilir, plan notları kontrol edilmeli.");
      }
    }

    if (text.includes("ağaç") || text.includes("yeşil alan")) {
      uyarilar.push("Ağaçlandırma ya da yeşil alan yükümlülüğü olabilir.");
    }

    if (text.includes("su kuyusu") || text.includes("artezyen")) {
      uyarilar.push("Su kuyusu zorunluluğu olabilir.");
    }

    if (text.includes("ticaret") && arsaM2 > 500) {
      uyarilar.push("Ticari kullanıma izin veriliyor olabilir.");
    }

    setVeriler(uyarilar);
    onFeedback(uyarilar);
  } catch (error) {
    console.error("Plan notları okunamadı:", error);
    onFeedback(["Plan notları dosyası okunamadı."]);
  }
};

if (arsaM2 && insaatM2 && daireSayisi !== null) {
  fetchPlanNotlari();
}

}, [arsaM2, insaatM2, daireSayisi, onFeedback]);

return null; // kullanıcı hiçbir şey görmeyecek, kontrol arkaplanda }

