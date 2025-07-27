import React, { useEffect, useState } from "react"; import * as docx from "docx-preview";

export default function PlanKontrol({ arsaM2, insaatM2, daireSayisi, onFeedback }) { const [planNotuMetni, setPlanNotuMetni] = useState("");

useEffect(() => { fetch("/plannotlari.docx") .then((res) => res.blob()) .then((blob) => { const container = document.createElement("div"); docx.renderAsync(blob, container).then(() => { const text = container.innerText; setPlanNotuMetni(text); }); }); }, []);

useEffect(() => { if (!planNotuMetni) return;

const feedback = [];

if (planNotuMetni.includes("sarnıç") && !planNotuMetni.includes("zorunlu değil")) {
  feedback.push("Sarnıç yapılması gerekiyor.");
}

if (planNotuMetni.includes("otopark")) {
  const gerekenOtopark = Math.ceil(parseInt(daireSayisi) / 2);
  feedback.push(`${gerekenOtopark} araçlık otopark yapılmalı.`);
}

if (planNotuMetni.includes("ağaç")) {
  const gerekenAgac = Math.ceil(parseFloat(arsaM2) / 100);
  feedback.push(`${gerekenAgac} adet ağaç dikilmeli.`);
}

if (planNotuMetni.includes("su kuyusu")) {
  feedback.push("Su kuyusu yapılması gerekiyor.");
}

if (onFeedback) {
  onFeedback(feedback);
}

}, [planNotuMetni, arsaM2, insaatM2, daireSayisi]);

return null; }

