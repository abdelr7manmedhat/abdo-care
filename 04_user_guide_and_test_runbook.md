# 📖 الوثيقة 4: دليل المستخدم وسيناريو التجربة الحية (Test Runbook)
## Project: AgencyCloser AI — Autonomous Agency Lead Auditor & Deal Closer

---

## 1. دليل التشغيل السريع على AiMicromind (Step-by-Step Operator Guide)

### 📌 المتطلبات الأساسية:
1. فتح مساحة العمل على منصة **AiMicromind Canvas**.
2. توفر مفتاح الـ API (مثل Gemini API Key) داخل إعدادات البيئة بالمنصة.

### 🚀 خطوات التشغيل للمستخدم:
1. **الخطوة 1:** افتح مسار العمل `AgencyCloser_v1.flow` على الـ Canvas.
2. **الخطوة 2:** انقر فوق عقدة البداية **(Input Node)**.
3. **الخطوة 3:** أدخل البيانات التالية:
   - `Target URL`: رابط موقع العميل المحتمل (مثال: `https://smilecare-dental.com`).
   - `Business Niche`: اختر مجال العميل (مثال: `Healthcare / Dental Clinic`).
   - `Target Service`: اختر الخدمة المستهدفة (مثال: `Paid Search & Conversion Rate Optimization`).
4. **الخطوة 4:** اضغط على زر **Run Flow ▶️** (أو اختبره عبر نافذة الـ Chat المدمجة بالمنصة).
5. **الخطوة 5:** انتظر 5 ثوانٍ، وستظهر لك الأصول الثلاثة جاهزة للنسخ أو التصدير كملف PDF.

---

## 2. سيناريو التجربة الحية للجنة التحكيم (Live Capstone Demo Test Case)

### 🧪 بيانات حالة الاختبار (Test Case Profile):
* **اسم العميل الافتراضي:** `SmileCare Dental Studio` (عيادة أسنان تجميلية راقية).
* **رابط الموقع المدخل:** `https://smilecare-dental-demo.com`
* **المشكلة الحقيقية المكتشفة أثناء الفحص:**
  - الموقع جميل بصرياً لكن لا يحتوي على زر حجز مباشر وثابت (Sticky Booking CTA).
  - سرعة تحميل الموقع على الجوال 5.2 ثوانٍ بسبب صور عالية الجودة غير مضغوطة.
  - لا يوجد كود Google Tag Manager أو Meta Pixel لتتبع الأشخاص الذين دخلوا صفحة الأسعار وخرجوا دون حجز.

---

## 3. نماذج المخرجات الفعلية الناتجة عن النظام (Live Output Artifacts)

### 📄 المخرج الأول: تقرير الفحص السريع (Executive 1-Page Audit)

```markdown
# 🩺 SmileCare Dental Studio — Marketing & Conversion Health Scorecard
**Audit Date:** 2026-08-25 | **Status:** ⚠️ 3 Critical Leaks Detected

---

### 🔍 Summary of Findings
SmileCare has strong visual branding and excellent doctor credentials, but technical friction and unlinked tracking tags are causing an estimated **35% to 45% leakage of potential high-ticket patients**.

### 🚨 Critical Bottlenecks & Fixes Matrix:

| # | الفجوة المكتشفة (Detected Bottleneck) | التأثير التجاري (Business Consequence) | الحل المقترح من الوكالة (Agency Prescription) |
|---|---|---|---|
| **1** | **غياب تتبع البكسل (No Retargeting Pixel)** | 90% من زوار صفحة "أسعار ابتسامة هوليوود" يغادرون دون إمكانية إعادة استهدافهم بإعلانات تذكيرية. | إعداد نظام تتبع متكامل عبر GTM وإطلاق حملة إعادة استهداف ديناميكية على Meta و Google. |
| **2** | **بطء تحميل الجوال (5.2s Load Time)** | أكثر من 40% من الباحثين عن علاج عاجل على الجوال يغلقون الصفحة قبل اكتمال التحميل. | ضغط وتحسين الصور تلقائياً ورفع سرعة الاستجابة إلى أقل من 1.4 ثانية. |
| **3** | **غياب زر الحجز السريع المباشر (No Sticky Booking CTA)** | العميل يضطر للتمرير لأسفل الصفحة للعثور على رقم الواتساب أو نموذج الموعد. | تثبيت زر حجز موعد عائم (Sticky Floating CTA) مباشر عبر الواتساب وتقويم المواعيد. |

**Estimated Revenue Uplift:** +15 إلى +25 موعد كشف شهري إضافي دون زيادة الميزانية الإعلانية.
```

---

### ✉️ المخرج الثاني: إيميل التواصل فائق التخصيص (Cold Outreach Email)

```text
Subject: quick note regarding SmileCare mobile booking flow

Hi Dr. Miller,

Compliments on the pristine design of SmileCare Dental — your before-and-after smile gallery is truly top-tier.

While reviewing your mobile patient journey today, I noticed two quick friction points: the high-res gallery takes ~5.2s to load on 4G, and there is currently no direct 1-click booking button pinned on mobile screens. In dental clinics, this usually causes about 30-40% of warm local patients to bounce to another clinic on Google Maps.

We recently helped a nearby cosmetic clinic fix this exact bottleneck, resulting in 18 additional booked consultations in their first 30 days.

I recorded a quick 60-second video walkthrough showing where patient drop-offs are happening on your site and how to fix it in under 2 hours.

Would it be okay if I sent that video over? No pitch or obligation whatsoever.

Warm regards,
[Your Name] | Growth Consultant at [Agency Name]
```

---

### 🎥 المخرج الثالث: سكريبت فيديو التدقيق السريع (60-Second Loom Script)

```markdown
**[0:00 - 0:10] Hook & Praise:**
*(افتح شاشة موقع العميل على الصفحة الرئيسية)*
"مرحباً دكتور، أنا [اسمك] من وكالة [اسم الوكالة]. كنت أتصفح موقعكم SmileCare وأعجبني جداً معرض حالات علاج الأسنان وجودة الصور..."

**[0:10 - 0:35] The Discovery (Showing the Leak):**
*(افتح وضع الجوال Mobile View واضغط على أداة فحص السرعة والبكسل)*
"لكن لاحظت شيئاً مهماً جداً يسبب ضياع مرضى محتملين: عندما يفتح المريض الموقع من هاتفه، يستغرق التحميل أكثر من 5 ثوانٍ، والأهم أنه لا يوجد زر حجز مباشر يتبعه أثناء التمرير، كما أن كود البكسل غير مفعل لإعادة تذكير من زار صفحة الأسعار..."

**[0:35 - 0:50] The Solution & Evidence:**
*(أظهر نموذجاً لزر الحجز السريع وسرعة التحميل المحسنة)*
"حل هذه النقاط الثلاث بسيط جداً ولا يستغرق سوى يومين عمل، ومن واقع خبرتنا مع عيادات الأسنان، هذا التعديل وحده يزيد الحجوزات المؤكدة بنسبة 25% على نفس عدد الزيارات الحالي."

**[0:50 - 1:00] Low-Friction Call to Action:**
"إذا أحببتم أن أرسل لكم التقرير التقني الكامل لتسليمه لمسؤول الموقع لديكم، ردوا علي فقط بكلمة 'مهتم' وسأرسله فوراً. أتمنى لكم يوماً رائعاً!"
```
