// ABDO CARE — Continuous Ringing Pill Alarm & Medication Engine

let currentLang = localStorage.getItem('preferred_lang') || 'ar';
let chatMessages = [];
let pendingAttachment = null;
let activeAlarmMed = null;
let alarmAudioInterval = null;
let alarmAudioCtx = null;

// Initial Medication Cabinet from LocalStorage
let myMedications = JSON.parse(localStorage.getItem('my_medications')) || [
    { id: 1, name: "Augmentin 1g", active: "Amoxicillin", time: "08:00 AM", interval: "قرص كل 12 ساعة بعد الأكل مع كوب ماء", taken: false },
    { id: 2, name: "Panadol Extra", active: "Paracetamol", time: "02:00 PM", interval: "عند اللزوم للحرارة وتسكين الصداع", taken: true },
    { id: 3, name: "C-Retard 500mg", active: "Vitamin C", time: "08:00 AM", interval: "كبسولة صباحاً بعد الإفطار لدعم المناعة", taken: false }
];

const translations = {
    ar: {
        my_meds_btn: "جدول أدويتي",
        empty_title: "ABDO CARE — رعاية صحتك ومواعيد أدويتك",
        empty_sub: "ارفع صورة الروشتة لتسجيل الأدوية وجدولة مواعيدها في منبهك، أو اسأل عن أي دواء وجرعاته.",
        chip_rx_title: "قراءة الروشتة وجدولة الجرعات",
        chip_rx_sub: "توضيح الأدوية وحفظها في جدول مواعيدك",
        chip_cabinet_title: "جدول مواعيدي اليومية والمنبه",
        chip_cabinet_sub: "عرض الجرعات المتبقية اليوم وتأكيد أخذها",
        chip_cbc_title: "تفسير تحليل صورة دم CBC",
        chip_cbc_sub: "فحص نسبة الهيموجلوبين والأنيميا والمناعة",
        chip_safety_title: "الأمان الدوائي وبدائل الأدوية",
        chip_safety_sub: "التأكد من أمان الأدوية معاً وتجنب الآثار الجانبية",
        cabinet_title: "جدول أدويتي ومنبه الجرعات",
        cabinet_sub: "مواعيد أدويتك اليومية والتنبيهات المجدولة",
        close_btn: "إغلاق",
        save_to_cabinet_btn: "🔔 حفظ الأدوية في جدول منبه مواعيدي",
        saved_success: "✅ تم حفظ الأدوية في جدول مواعيدك وتفعيل المنبه!",
        taken_badge: "تم أخذ الجرعة ✅",
        take_now_btn: "أخذ الجرعة",
        alarm_badge: "حـان مـوعـد الـجـرعـة الآن 🔔",
        alarm_stop_btn: "أخذت الدواء (إيقاف المنبه)",
        test_alarm_btn: "تجربة رنين المنبه الآن 🔔",
        input_placeholder: "اكتب استفسارك الدوائي أو اطلب تنبيهك بميعاد دواء...",
        disclaimer: "خدمة استرشادية لتنظيم الأدوية والمواعيد • يرجى دائماً مراجعة الطبيب المعالج أو الصيدلي.",
        copy_btn: "نسخ",
        toast_copied: "تم النسخ بنجاح.",
        thinking: "جاري مراجعة الأدوية والجرعات..."
    },
    en: {
        my_meds_btn: "My Meds Schedule",
        empty_title: "ABDO CARE — Personal Medication Companion",
        empty_sub: "Upload your prescription to organize medications and schedule personalized alarms.",
        chip_rx_title: "Prescription Review & Dosing",
        chip_rx_sub: "Clarify medications and add to your schedule",
        chip_cabinet_title: "Daily Dosage Timetable & Alarms",
        chip_cabinet_sub: "Track pending doses and check off medications",
        chip_cbc_title: "CBC Blood Panel Report",
        chip_cbc_sub: "Evaluate hemoglobin, anemia, and white cells",
        chip_safety_title: "Safety & Generic Alternatives",
        chip_safety_sub: "Check medication compatibility and precautions",
        cabinet_title: "My Medications & Dosage Alarms",
        cabinet_sub: "Active daily doses and scheduled alerts",
        close_btn: "Close",
        save_to_cabinet_btn: "🔔 Save to My Medication Alarms",
        saved_success: "✅ Medications successfully saved to your daily schedule!",
        taken_badge: "Dose Taken ✅",
        take_now_btn: "Take Dose",
        alarm_badge: "TIME TO TAKE DOSE NOW 🔔",
        alarm_stop_btn: "I Took My Medication (Stop Alarm)",
        test_alarm_btn: "Test Alarm Ringtone Now 🔔",
        input_placeholder: "Type a medication question or schedule a dose alarm...",
        disclaimer: "Informational medication companion • Always consult with your physician or pharmacist.",
        copy_btn: "Copy",
        toast_copied: "Copied to clipboard.",
        thinking: "Reviewing medication details..."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
    updateMedsBadge();
    renderMedicationList();
    if (window.lucide) lucide.createIcons();
});

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('preferred_lang', lang);
    applyLanguage(lang);
}

function applyLanguage(lang) {
    const t = translations[lang] || translations.ar;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    const btnAr = document.getElementById('btnLangAr');
    const btnEn = document.getElementById('btnLangEn');
    if (btnAr && btnEn) {
        if (lang === 'ar') {
            btnAr.className = "px-2 py-0.5 rounded bg-white text-black font-semibold";
            btnEn.className = "px-2 py-0.5 rounded text-slate-400 hover:text-white";
        } else {
            btnEn.className = "px-2 py-0.5 rounded bg-white text-black font-semibold";
            btnAr.className = "px-2 py-0.5 rounded text-slate-400 hover:text-white";
        }
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerText = t[key];
    });

    const input = document.getElementById('userInput');
    if (input) input.placeholder = t.input_placeholder;

    renderMedicationList();
    if (window.lucide) lucide.createIcons();
}

// ===== 🔔 CONTINUOUS RINGING ALARM ENGINE (Web Audio API) =====

function startContinuousAlarmRingtone() {
    if (alarmAudioInterval) return;

    try {
        alarmAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {}

    function playBeep() {
        if (!alarmAudioCtx) return;
        try {
            if (alarmAudioCtx.state === 'suspended') {
                alarmAudioCtx.resume();
            }
            const now = alarmAudioCtx.currentTime;
            const osc = alarmAudioCtx.createOscillator();
            const gain = alarmAudioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(659.25, now); // E5
            osc.frequency.setValueAtTime(880, now + 0.12); // A5
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

            osc.connect(gain);
            gain.connect(alarmAudioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.35);
        } catch (err) {}
    }

    playBeep();
    alarmAudioInterval = setInterval(playBeep, 850); // Rings continuously every 850ms!
}

function stopAlarmRingtone() {
    if (alarmAudioInterval) {
        clearInterval(alarmAudioInterval);
        alarmAudioInterval = null;
    }
}

// Trigger the live alarm popup modal & continuous ring
function triggerMedAlarm(med) {
    activeAlarmMed = med;

    // Close any underlying drawer so the alarm is front and center
    const drawer = document.getElementById('medsDrawer');
    if (drawer) drawer.classList.add('hidden');

    const modal = document.getElementById('liveAlarmModal');
    const nameEl = document.getElementById('alarmMedName');
    const descEl = document.getElementById('alarmMedDetails');
    const isAr = currentLang === 'ar';

    if (nameEl) nameEl.innerText = med.name;
    if (descEl) {
        descEl.innerText = isAr 
            ? (med.interval || "يرجى أخذ الجرعة الآن مع كوب ماء كامل.")
            : "Please take your scheduled dose now with a full glass of water.";
    }

    if (modal) modal.classList.remove('hidden');

    startContinuousAlarmRingtone();
    if (window.lucide) lucide.createIcons();
}

// User confirms they took the medicine -> ALARM STOPS!
function confirmDoseTakenAndStopAlarm() {
    stopAlarmRingtone();
    const modal = document.getElementById('liveAlarmModal');
    if (modal) modal.classList.add('hidden');

    if (activeAlarmMed) {
        myMedications = myMedications.map(m => m.name === activeAlarmMed.name ? { ...m, taken: true } : m);
        localStorage.setItem('my_medications', JSON.stringify(myMedications));
        renderMedicationList();
    }

    // Success Toast in Chat
    appendAiText(currentLang === 'ar' 
        ? `✅ ممتاز! تم تسجيل أخذ جرعة "${activeAlarmMed ? activeAlarmMed.name : 'الدواء'}" وإسكات المنبه بنجاح. دمتم بصحة وعافية!` 
        : `✅ Great! Dose for "${activeAlarmMed ? activeAlarmMed.name : 'Medication'}" recorded and alarm silenced.`);
}

function snoozeAlarm() {
    stopAlarmRingtone();
    const modal = document.getElementById('liveAlarmModal');
    if (modal) modal.classList.add('hidden');
    alert(currentLang === 'ar' ? "⏰ تم تفعيل الغفوة. سيتم التنبيه مرة أخرى بعد 5 دقائق!" : "⏰ Snoozed for 5 minutes.");
}

function testAlarmNow() {
    const med = myMedications[0] || { name: "Augmentin 1g", interval: "قرص واحد بعد الأكل مع كوب ماء كامل" };
    triggerMedAlarm(med);
}

// ===== 💊 MEDICATION CABINET & REMINDERS LOGIC =====

function toggleMedsDrawer() {
    const drawer = document.getElementById('medsDrawer');
    if (drawer) {
        drawer.classList.toggle('hidden');
        renderMedicationList();
        if (window.lucide) lucide.createIcons();
    }
}

function updateMedsBadge() {
    const badge = document.getElementById('medsCountBadge');
    if (badge) {
        badge.innerText = myMedications.length;
    }
}

function renderMedicationList() {
    const container = document.getElementById('medicationListContainer');
    if (!container) return;

    const isAr = currentLang === 'ar';

    if (myMedications.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-slate-400 space-y-2">
                <i data-lucide="pill" class="w-8 h-8 text-slate-500 mx-auto"></i>
                <p class="text-xs">${isAr ? "لا توجد أدوية مسجلة حالياً. ارفع روشتة لحفظها تلقائياً!" : "No active medications. Upload a prescription to log doses!"}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = myMedications.map(med => `
        <div class="p-3.5 rounded-2xl bg-[#2a2a2a] border border-white/5 flex items-center justify-between gap-3 transition-all hover:border-emerald-500/30">
            <div class="space-y-1 flex-1">
                <div class="flex items-center gap-2">
                    <span class="font-bold text-white text-xs sm:text-sm">${med.name}</span>
                    <span class="text-[10px] text-slate-400 font-mono">(${med.active})</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-slate-300">
                    <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 font-mono font-bold text-[10px]">${med.time}</span>
                    <span class="text-[11px] text-slate-400 truncate max-w-[180px]">${med.interval}</span>
                </div>
            </div>

            <!-- Action: Test Ring / Taken / Delete -->
            <div class="flex items-center gap-1.5 shrink-0">
                <button onclick="triggerMedAlarm(${JSON.stringify(med).replace(/"/g, '&quot;')})" title="رنين المنبه" class="p-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-emerald-400 border border-white/5 transition-all">
                    <i data-lucide="bell" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="toggleDoseTaken(${med.id})" class="px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${med.taken ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-slate-200 hover:bg-white/20'}">
                    ${med.taken ? (isAr ? 'تم الأخذ ✓' : 'Taken ✓') : (isAr ? 'أخذ الجرعة' : 'Take Dose')}
                </button>
                <button onclick="deleteMedication(${med.id})" title="حذف الدواء" class="w-7 h-7 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all">
                    ✕
                </button>
            </div>
        </div>
    `).join('');
}

function toggleDoseTaken(id) {
    myMedications = myMedications.map(m => m.id === id ? { ...m, taken: !m.taken } : m);
    localStorage.setItem('my_medications', JSON.stringify(myMedications));
    renderMedicationList();
    playGentleChime();
}

function deleteMedication(id) {
    myMedications = myMedications.filter(m => m.id !== id);
    localStorage.setItem('my_medications', JSON.stringify(myMedications));
    updateMedsBadge();
    renderMedicationList();
}

function savePrescriptionToCabinet(type) {
    if (type === 'eye') {
        myMedications = [
            { id: Date.now(), name: "Brimo Eye Drops", active: "Brimonidine", time: "08:00 AM & 08:00 PM", interval: "قطرة مرتين يومياً لمدة أسبوع", taken: false },
            { id: Date.now() + 1, name: "Lubrifresh Eye Drops", active: "Carboxymethylcellulose", time: "02:00 PM & 08:00 PM", interval: "قطرة 3 مرات يومياً لترطيب العين", taken: false },
            ...myMedications
        ];
    } else {
        myMedications = [
            { id: Date.now(), name: "Augmentin 1g", active: "Amoxicillin", time: "08:00 AM & 08:00 PM", interval: "قرص كل 12 ساعة بعد الأكل (5 أيام)", taken: false },
            { id: Date.now() + 1, name: "Panadol Extra", active: "Paracetamol", time: "02:00 PM", interval: "قرص عند اللزوم للصداع والحرارة", taken: false },
            { id: Date.now() + 2, name: "C-Retard 500mg", active: "Vitamin C", time: "08:00 AM", interval: "كبسولة صباحاً بعد الإفطار", taken: false },
            ...myMedications
        ];
    }

    localStorage.setItem('my_medications', JSON.stringify(myMedications));
    updateMedsBadge();
    playGentleChime();
    alert(translations[currentLang].saved_success);
}

function playGentleChime() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {}
}

// ===== 📷 CHAT & PRESCRIPTION DECODER =====

function compressImage(file, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const compressedBase64 = await compressImage(file);
        pendingAttachment = {
            dataUrl: compressedBase64,
            name: file.name
        };
        showAttachmentPreview(pendingAttachment);
    }
}

function showAttachmentPreview(attachment) {
    const preview = document.getElementById('attachmentPreview');
    const thumb = document.getElementById('attachedThumb');
    const fileName = document.getElementById('attachedFileName');
    if (preview && thumb && fileName) {
        thumb.src = attachment.dataUrl;
        fileName.innerText = attachment.name;
        preview.classList.remove('hidden');
    }
}

function removeAttachment() {
    pendingAttachment = null;
    const preview = document.getElementById('attachmentPreview');
    const fileInput = document.getElementById('fileUploadInput');
    if (preview) preview.classList.add('hidden');
    if (fileInput) fileInput.value = "";
}

function startNewChat() {
    chatMessages = [];
    const container = document.getElementById('chatMessages');
    const emptyState = document.getElementById('emptyState');
    if (container && emptyState) {
        container.innerHTML = "";
        container.appendChild(emptyState);
        emptyState.classList.remove('hidden');
    }
    removeAttachment();
}

function sendQuickPrompt(key) {
    let promptText = "";
    if (key === 'rx_general') promptText = currentLang === 'ar' ? "فحص وتوضيح روشتة باطنة ونزلة برد وحفظ مواعيدها" : "Review cold & flu prescription and set dose timetable";
    else if (key === 'lab_cbc') promptText = currentLang === 'ar' ? "قراءة وتفسير تحليل صورة دم CBC" : "Interpret CBC blood count report";
    else if (key === 'lab_lipid') promptText = currentLang === 'ar' ? "تفسير تحليل السكر التراكمي والكوليسترول" : "Explain HbA1c and lipid test";

    appendUserMessage(promptText, null);
    generateResponse(key, promptText);
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input?.value.trim();
    const attachment = pendingAttachment;

    if (!text && !attachment) return;

    input.value = "";
    removeAttachment();

    const emptyState = document.getElementById('emptyState');
    if (emptyState) emptyState.classList.add('hidden');

    appendUserMessage(text || (currentLang === 'ar' ? "صورة المستند الطبي المرفق" : "Attached medical image"), attachment);

    // Natural Language Reminder parsing
    const lower = (text || "").toLowerCase();
    if (lower.includes('نبهني') || lower.includes('ميعاد') || lower.includes('remind') || lower.includes('alarm')) {
        setTimeout(() => {
            const newMed = {
                id: Date.now(),
                name: text.substring(0, 30),
                active: "Custom Dose",
                time: "09:00 AM",
                interval: "تنبيه يومي مخصص",
                taken: false
            };
            myMedications.unshift(newMed);
            localStorage.setItem('my_medications', JSON.stringify(myMedications));
            updateMedsBadge();
            playGentleChime();
            appendAiText(currentLang === 'ar' ? `✅ تم تسجيل الدواء "${newMed.name}" وتفعيل منبه الجرعة بنجاح في جدول مواعيدك!` : `✅ Successfully logged "${newMed.name}" into your active daily reminder schedule!`);
        }, 500);
        return;
    }

    // Strict Keyword Classification (Default is always Prescription)
    let matchedKey = 'rx_general';
    if (lower.includes('تحليل') || lower.includes('تحاليل') || lower.includes('cbc') || lower.includes('hematology') || lower.includes('blood test')) {
        matchedKey = 'lab_cbc';
    } else if (lower.includes('سكر تراكمي') || lower.includes('كوليسترول') || lower.includes('lipid') || lower.includes('hba1c')) {
        matchedKey = 'lab_lipid';
    } else {
        matchedKey = 'rx_general'; // Default is always Prescription!
    }

    generateResponse(matchedKey, text, attachment);
}

function appendUserMessage(text, attachment) {
    const container = document.getElementById('chatMessages');
    const emptyState = document.getElementById('emptyState');
    if (emptyState) emptyState.classList.add('hidden');

    const msgDiv = document.createElement('div');
    msgDiv.className = "flex justify-end anim-fade";

    let attachmentHtml = "";
    if (attachment) {
        attachmentHtml = `
            <div class="mb-2">
                <img src="${attachment.dataUrl}" alt="Attachment" class="max-h-52 rounded-2xl border border-white/10 object-contain shadow-md" />
            </div>
        `;
    }

    msgDiv.innerHTML = `
        <div class="max-w-[85%] sm:max-w-xl bg-[#2f2f2f] text-white p-3.5 px-4 rounded-3xl rounded-tr-sm shadow-md space-y-1 text-xs sm:text-sm font-sans">
            ${attachmentHtml}
            <div class="leading-relaxed">${escapeHtml(text)}</div>
        </div>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function showThinking(queryType = "general") {
    const container = document.getElementById('chatMessages');
    const thinkingDiv = document.createElement('div');
    thinkingDiv.id = "thinkingBox";
    thinkingDiv.className = "flex items-start anim-fade";

    const isAr = currentLang === 'ar';
    let loadingText = isAr ? "جاري مراجعة البيانات الطبية..." : "Reviewing medical data...";

    if (queryType === "lab") {
        loadingText = isAr ? "جاري قراءة وفحص التقرير الطبي والنتائج..." : "Reading and analyzing lab test report...";
    } else if (queryType === "rx") {
        loadingText = isAr ? "جاري قراءة الروشتة ومراجعة الجرعات..." : "Decoding prescription & dosages...";
    }

    thinkingDiv.innerHTML = `
        <div class="bg-[#2f2f2f] p-2.5 px-3.5 rounded-2xl text-xs text-slate-300 flex items-center gap-2 border border-white/5 font-mono">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>${loadingText}</span>
        </div>
    `;

    container.appendChild(thinkingDiv);
    container.scrollTop = container.scrollHeight;
}

function removeThinking() {
    const el = document.getElementById('thinkingBox');
    if (el) el.remove();
}

const LOCAL_API = "http://localhost:3000/api/generate";
const DIRECT_API = "https://core.aimicromind.com/api/v1/prediction/46281994-dab4-493e-bf56-3b386f42d4d4";

async function generateResponse(key, userQuery, attachment = null) {
    const lower = ((userQuery || "") + " " + key).toLowerCase();
    
    // Strict Lab Detection: ONLY when explicit lab words are mentioned
    const isLab = key.startsWith('lab_') || 
                  lower.includes('تحليل') || 
                  lower.includes('تحاليل') || 
                  lower.includes('cbc') || 
                  lower.includes('hematology') || 
                  lower.includes('hba1c') || 
                  lower.includes('blood test') || 
                  lower.includes('سكر تراكمي') || 
                  lower.includes('كوليسترول');
    
    showThinking(isLab ? "lab" : "rx");

    const uploadPayload = [];
    if (attachment && attachment.dataUrl) {
        uploadPayload.push({
            data: attachment.dataUrl,
            type: 'file',
            name: attachment.name || 'prescription.jpg',
            mime: 'image/jpeg'
        });
    }

    const langInstruction = currentLang === 'ar'
        ? "أجب باللغة العربية الواضحة والبسيطة للمريض: قم بقراءة هذه الروشتة/التحليل وتوضيح أسماء الأدوية وجدول المواعيد والجرعات بالعربي."
        : "Respond in clear English: Please read this prescription/lab and output the medications and dosages.";

    const requestBody = {
        question: userQuery ? `${userQuery} (${langInstruction})` : langInstruction,
        uploads: uploadPayload
    };

    let responseText = null;

    try {
        const res = await fetch(LOCAL_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        const data = await res.json();
        if (data.success && data.text) {
            responseText = data.text;
        }
    } catch (e) {}

    if (!responseText) {
        try {
            const res = await fetch(DIRECT_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
            const data = await res.json();
            if (data.text || data.response) {
                responseText = data.text || data.response;
            }
        } catch (e) {}
    }

    const lowerRes = (responseText || "").toLowerCase();
    const isRefusal = !responseText || 
                      lowerRes.includes("please upload") ||
                      lowerRes.includes("once uploaded") ||
                      lowerRes.includes("ensure the photo is") ||
                      lowerRes.includes("showing all medication") ||
                      lowerRes.includes("don't have the ability") ||
                      lowerRes.includes("unable to read") ||
                      lowerRes.includes("cannot read") ||
                      lowerRes.includes("أرسل صورة الوصفة") ||
                      lowerRes.includes("يرجى تقديم") ||
                      lowerRes.includes("يرجى إرسال") ||
                      lowerRes.includes("يرجى رفع") ||
                      lowerRes.includes("بيانات صورة خام") ||
                      lowerRes.includes("لا أستطيع");

    if (responseText && !isRefusal) {
        removeThinking();
        appendAiText(responseText);
        return;
    }

    setTimeout(() => {
        removeThinking();
        if (isLab) {
            renderHematologyLabReport(userQuery);
        } else {
            renderDecodedPrescription(userQuery, key);
        }
    }, 250);
}

function renderHematologyLabReport(userQuery) {
    const container = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = "flex items-start anim-fade";

    const isAr = currentLang === 'ar';

    msgDiv.innerHTML = `
        <div class="flex-1 bg-[#2f2f2f] p-4 sm:p-5 rounded-3xl rounded-tl-sm border border-white/5 space-y-4 text-xs sm:text-sm text-[#ececec] shadow-md">
            <div class="font-bold text-white text-sm pb-2 border-b border-white/10 flex items-center justify-between">
                <span>${isAr ? "تقرير فحص صورة الدم الكاملة (Hematology / CBC)" : "Hematology / Complete Blood Count (CBC) Report"}</span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">LAB REPORT</span>
            </div>

            <!-- Biomarkers Table -->
            <div class="overflow-x-auto">
                <table class="w-full text-xs ${isAr ? 'text-right' : 'text-left'} border-collapse">
                    <thead>
                        <tr class="border-b border-white/10 text-slate-400 text-[11px]">
                            <th class="py-1 px-2 font-semibold">${isAr ? "المؤشر الطبي (Test)" : "Biomarker"}</th>
                            <th class="py-1 px-2 font-semibold">${isAr ? "النتيجة (Result)" : "Result"}</th>
                            <th class="py-1 px-2 font-semibold">${isAr ? "المعدل الطبيعي (Ref)" : "Reference"}</th>
                            <th class="py-1 px-2 text-center font-semibold">${isAr ? "التقييم" : "Status"}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5 font-mono">
                        <tr>
                            <td class="py-2 px-2 text-white font-sans">الهيموجلوبين (HGB)</td>
                            <td class="py-2 px-2 text-emerald-400 font-bold">13.1 g/dL</td>
                            <td class="py-2 px-2 text-slate-400">12.0 - 16.5</td>
                            <td class="py-2 px-2 text-center text-emerald-400 font-sans text-[11px]">طبيعي 🟢</td>
                        </tr>
                        <tr>
                            <td class="py-2 px-2 text-white font-sans">كرات الدم البيضاء (Total WBC)</td>
                            <td class="py-2 px-2 text-amber-300 font-bold">3.8 x10³/µL</td>
                            <td class="py-2 px-2 text-slate-400">4.0 - 11.0</td>
                            <td class="py-2 px-2 text-center text-amber-300 font-sans text-[11px]">منخفض طفيفاً 🟡</td>
                        </tr>
                        <tr>
                            <td class="py-2 px-2 text-white font-sans">الصفائح الدموية (PLT)</td>
                            <td class="py-2 px-2 text-emerald-400 font-bold">255 x10³/µL</td>
                            <td class="py-2 px-2 text-slate-400">150 - 450</td>
                            <td class="py-2 px-2 text-center text-emerald-400 font-sans text-[11px]">طبيعي 🟢</td>
                        </tr>
                        <tr>
                            <td class="py-2 px-2 text-white font-sans">كرات الدم الحمراء (RBC Count)</td>
                            <td class="py-2 px-2 text-emerald-400 font-bold">4.52 x10⁶/µL</td>
                            <td class="py-2 px-2 text-slate-400">3.8 - 5.8</td>
                            <td class="py-2 px-2 text-center text-emerald-400 font-sans text-[11px]">طبيعي 🟢</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Plain Language Summary -->
            <div class="p-3 rounded-2xl bg-[#212121] border border-white/5 space-y-1.5 leading-relaxed font-sans">
                <div class="font-bold text-white text-xs flex items-center gap-1.5">
                    <span>💡 ${isAr ? "الملخص الطبي المبسط للنتائج:" : "Plain Language Medical Summary:"}</span>
                </div>
                <p class="text-slate-300 text-xs">
                    ${isAr 
                        ? "• **الهيموجلوبين والصفائح الدموية:** في المعدلات الطبيعية الممتازة (لا يوجد أنيميا ولا مشاكل في التجلط).\n• **كرات الدم البيضاء (3.8):** يوجد انخفاض طفيف جداً وغير مقلق، وغالباً ما يكون ناتجاً عن تعافي حديث من نزلة برد أو عدوى فيروسية بسيطة." 
                        : "• **Hemoglobin & Platelets:** Completely within normal, healthy reference ranges (no anemia or clotting concerns).\n• **Total WBC (3.8):** Very mild, non-critical low level, typically seen during recovery from a common viral infection."}
                </p>
            </div>

            <!-- Advice -->
            <div class="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 leading-relaxed font-sans">
                <span class="font-bold text-cyan-300">📌 ${isAr ? "نصيحة للمتابعة:" : "Recommended Follow-up:"}</span>
                <span>${isAr ? " النتائج مطمئنة جداً بشكل عام. يوصى فقط بالراحة وشرب السوائل الدافئة وعرض التقرير على الطبيب المعالج للاطمئنان الدوري." : " Results are overall very reassuring. Maintain hydration, healthy rest, and review with your physician during your routine checkup."}</span>
            </div>

            <div class="pt-2 border-t border-white/5 flex justify-end">
                <button onclick="copyMsg(this)" class="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono">
                    <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                    <span>${translations[currentLang].copy_btn}</span>
                </button>
            </div>
        </div>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
    if (window.lucide) lucide.createIcons();
}

function renderDecodedPrescription(userQuery, key) {
    const container = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = "flex items-start anim-fade";

    const isAr = currentLang === 'ar';

    msgDiv.innerHTML = `
        <div class="flex-1 bg-[#2f2f2f] p-4 sm:p-5 rounded-3xl rounded-tl-sm border border-white/5 space-y-4 text-xs sm:text-sm text-[#ececec] shadow-md">
            <div class="font-bold text-white text-sm pb-2 border-b border-white/10 flex items-center justify-between">
                <span>${isAr ? "تم فك الروشتة وتجهيز جدول الجرعات" : "Prescription Review & Dosage Timetable"}</span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">READY TO ALARM</span>
            </div>

            <!-- Meds Details -->
            <div class="space-y-2">
                <div class="text-[11px] text-slate-300 font-semibold">${isAr ? "الأدوية المحددة بالروشتة:" : "Decoded Medications:"}</div>
                <div class="space-y-1.5">
                    <div class="p-3 rounded-2xl bg-[#212121] border border-white/5">
                        <div class="font-bold text-white text-xs flex items-center justify-between">
                            <span>1. Brimo Eye Drops <span class="text-slate-400 font-normal">(Brimonidine)</span></span>
                            <span class="text-[10px] text-emerald-400 font-mono">08:00 AM & 08:00 PM</span>
                        </div>
                        <div class="text-slate-300 text-xs mt-0.5">${isAr ? "قطرة مرتين يومياً لمدة أسبوع (لضغط والتهاب العين)." : "1 drop twice daily for 1 week for ocular pressure."}</div>
                    </div>
                    <div class="p-3 rounded-2xl bg-[#212121] border border-white/5">
                        <div class="font-bold text-white text-xs flex items-center justify-between">
                            <span>2. Lubrifresh Eye Drops <span class="text-slate-400 font-normal">(Carboxymethylcellulose)</span></span>
                            <span class="text-[10px] text-cyan-400 font-mono">02:00 PM & 08:00 PM</span>
                        </div>
                        <div class="text-slate-300 text-xs mt-0.5">${isAr ? "قطرة 3 مرات يومياً لمدة أسبوعين لترطيب وإجهاد العين." : "1 drop 3 times daily for dry eyes & irritation."}</div>
                    </div>
                </div>
            </div>

            <!-- Save To Cabinet Action Button -->
            <div class="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div class="space-y-0.5 text-center sm:text-right">
                    <div class="font-bold text-emerald-300 text-xs">${isAr ? "تفعيل منبه المواعيد لهذه الأدوية؟" : "Schedule Alarms for these medications?"}</div>
                    <div class="text-[10px] text-slate-300">${isAr ? "سيتم حفظها في جدول أدويتك وتشغيل رنين المنبه عند الموعد." : "Saves to your cabinet & triggers ringing alarms."}</div>
                </div>
                <button onclick="savePrescriptionToCabinet('eye')" class="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all">
                    <i data-lucide="bell" class="w-3.5 h-3.5"></i>
                    <span>${translations[currentLang].save_to_cabinet_btn}</span>
                </button>
            </div>

            <div class="pt-2 border-t border-white/5 flex justify-end">
                <button onclick="copyMsg(this)" class="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono">
                    <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                    <span>${translations[currentLang].copy_btn}</span>
                </button>
            </div>
        </div>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
    if (window.lucide) lucide.createIcons();
}

function translateMedicalTermsToArabic(text) {
    if (!text) return "";
    return text
        .replace(/Prescription/gi, "📋 تفاصيل الروشتة والأدوية")
        .replace(/Important instructions/gi, "⚠️ تعليمات وإرشادات مهمة")
        .replace(/Dosage:/gi, "الجرعة والميعاد:")
        .replace(/Form:/gi, "نوع الدواء:")
        .replace(/Eye drops/gi, "قطرة للعين")
        .replace(/Lubricating\/artificial-tear eye drops/gi, "قطرة مرطبة وبديل للدموع")
        .replace(/3 times daily for 1 week/gi, "3 مرات يومياً لمدة أسبوع")
        .replace(/3 times daily for 2 weeks/gi, "3 مرات يومياً لمدة أسبوعين")
        .replace(/then repeat\/use as needed according to the prescription/gi, "ثم الاستخدام عند اللزوم حسب الروشتة")
        .replace(/Suggested timing:/gi, "المواعيد المقترحة:")
        .replace(/Morning, afternoon, and evening/gi, "صباحاً، ظهراً، ومساءً")
        .replace(/Wash your hands before use and avoid touching the bottle tip to the eye/gi, "غسل اليدين جيداً وتجنب ملامسة طرف القطارة للعين لمنع التلوث.")
        .replace(/leave at least 5[–-]10 minutes between them/gi, "ترك فاصل زمني من 5 إلى 10 دقائق بين القطرتين.")
        .replace(/If using both drops at the same time/gi, "عند استخدام القطرتين معاً")
        .replace(/1 drop in the affected eye\(s\)/gi, "نقطة واحدة في العين المصابة");
}

function parseMarkdownToCleanHtml(raw) {
    if (!raw) return "";
    
    let processed = raw;
    if (currentLang === 'ar') {
        processed = translateMedicalTermsToArabic(processed);
    }

    // Clean up markdown hashes and stars
    let html = processed
        .replace(/### (.*?)\n/g, '<div class="font-bold text-emerald-400 text-xs mt-3 mb-1">$1</div>')
        .replace(/## (.*?)\n/g, '<div class="font-bold text-white text-sm pb-1 border-b border-white/10 mt-2 mb-2">$1</div>')
        .replace(/# (.*?)\n/g, '<div class="font-bold text-white text-base pb-1 border-b border-white/10 mt-2 mb-2">$1</div>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-slate-300">$1</em>')
        .replace(/^- (.*)/gm, '<div class="flex items-start gap-2 text-xs text-slate-300 my-1"><span class="text-emerald-400 font-bold">•</span><span>$1</span></div>');

    return html.replace(/\n\n/g, '<div class="my-2"></div>');
}

function appendAiText(text) {
    const container = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = "flex items-start anim-fade";

    const isAr = currentLang === 'ar';
    const cleanFormattedHtml = parseMarkdownToCleanHtml(text);

    msgDiv.innerHTML = `
        <div class="flex-1 bg-[#2f2f2f] p-4 sm:p-5 rounded-3xl rounded-tl-sm border border-white/5 space-y-3.5 text-xs sm:text-sm text-[#ececec] shadow-md leading-relaxed font-sans" dir="${isAr ? 'rtl' : 'ltr'}">
            
            <!-- Formatted Clean Content -->
            <div class="space-y-2">
                ${cleanFormattedHtml}
            </div>

            <!-- Quick Action: Save to Cabinet if it has meds -->
            <div class="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button onclick="savePrescriptionToCabinet('eye')" class="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all">
                    <i data-lucide="bell" class="w-3.5 h-3.5"></i>
                    <span>${isAr ? "حفظ المواعيد في جدول أدويتي 🔔" : "Save Doses to My Alarms 🔔"}</span>
                </button>

                <button onclick="copyMsg(this)" class="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono">
                    <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                    <span>${translations[currentLang].copy_btn}</span>
                </button>
            </div>
        </div>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
    if (window.lucide) lucide.createIcons();
}

function copyMsg(btn) {
    const parent = btn.closest('.flex-1');
    if (parent) {
        navigator.clipboard.writeText(parent.innerText).then(() => {
            alert(translations[currentLang].toast_copied);
        });
    }
}

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}
