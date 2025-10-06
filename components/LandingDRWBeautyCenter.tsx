"use client";

import React, { useEffect, useMemo, useState } from "react";
import { 
  ShieldCheckIcon, 
  BeakerIcon, 
  AcademicCapIcon, 
  PresentationChartLineIcon, 
  CurrencyDollarIcon, 
  DocumentTextIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

// TikTok & Meta Pixel Analytics type declarations
declare global {
  interface Window {
    ttq: any;
    fbq: any;
  }
}

/**
 * DRW Beauty Center – Landing Page (Kemitraan)
 * Version: v1 (Detail & Conversion-Driven)
 * Tech: React + TailwindCSS (single-file component)
 * Notes:
 * - Replace all PLACEHOLDER_... with real assets/copy.
 * - Integrate Pixels (TikTok, Meta) where marked.
 * - The lead form redirects to WhatsApp with prefilled message.
 * - Captures UTM params and passes them into the lead payload.
 */

export default function LandingDRWBeautyCenter() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [packageTier, setPackageTier] = useState("PLATINUM");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  // TikTok & Meta Pixel page tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ttq) {
      // Track page view with additional context
      window.ttq.track('ViewContent', {
        content_name: 'DRW Beauty Center Partnership Landing',
        content_category: 'Landing Page',
        content_id: 'partnership_landing_v1',
        description: 'User viewed partnership opportunity page'
      });
    }
    
    // Meta Pixel: Track ViewContent event for landing page
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: 'DRW Beauty Center Partnership Landing',
        content_category: 'Landing Page'
      });
    }
  }, []);

  // Track package selection changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ttq && packageTier) {
      window.ttq.track('ViewContent', {
        content_name: packageTier + ' Package',
        content_category: 'Partnership Package',
        content_id: packageTier.toLowerCase(),
        value: packageTier === 'PLATINUM' ? 50000000 : 25000000,
        currency: 'IDR'
      });
    }
    
    // Meta Pixel: Track package tier view
    if (typeof window !== 'undefined' && window.fbq && packageTier) {
      window.fbq('track', 'ViewContent', {
        content_name: packageTier + ' Package Details',
        content_category: 'Partnership Package',
        value: packageTier === 'PLATINUM' ? 50000000 : 25000000,
        currency: 'IDR'
      });
    }
  }, [packageTier]);

  // Grab UTM params for tracking
  const utm = useMemo(() => {
    if (typeof window === "undefined") return {} as Record<string, string>;
    const qp = new URLSearchParams(window.location.search);
    const keys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
      "ttclid"
    ];
    const obj: Record<string, string> = {};
    keys.forEach((k) => {
      const v = qp.get(k);
      if (v) obj[k] = v;
    });
    return obj;
  }, []);

  // Basic phone normalizer (IDN WhatsApp)
  function normalizePhone(p: string) {
    const digits = p.replace(/\D/g, "");
    if (digits.startsWith("62")) return digits; // already intl
    if (digits.startsWith("0")) return `62${digits.slice(1)}`;
    return `62${digits}`; // fallback
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !city || !phone) return setError("Lengkapi Nama, Kota, dan WhatsApp.");
    if (!/^\+?\d[\d\s-]{7,}$/.test(phone)) return setError("Nomor WhatsApp tidak valid.");
    if (!agree) return setError("Setujui kebijakan data terlebih dahulu.");

    // TikTok Event: Lead Generated
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track('SubmitForm', {
        content_name: 'Partnership Form',
        content_category: 'Lead Generation',
        value: packageTier === 'PLATINUM' ? 50000000 : 25000000,
        currency: 'IDR',
        contents: [{
          content_id: packageTier,
          content_name: packageTier + ' Package',
          content_category: 'Partnership Package',
          quantity: 1
        }]
      });
    }
    
    // Meta Pixel Event: Lead Generated
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: 'Partnership Form Submission',
        content_category: 'Beauty Center Partnership',
        value: packageTier === 'PLATINUM' ? 50000000 : 25000000,
        currency: 'IDR'
      });
      
      // Also track as Schedule event for consultation booking
      window.fbq('track', 'Schedule', {
        content_name: 'Free Consultation Booking',
        content_category: 'Partnership Consultation'
      });
    }

    // Build WhatsApp message
    const to = normalizePhone(process.env.NEXT_PUBLIC_WA_NUMBER || "62882005295884"); // GANTI .env

    const payload = {
      name,
      city,
      phone: normalizePhone(phone),
      packageTier,
      ...utm
    };

    const lines = [
      `Halo DRW Skincare, saya tertarik kemitraan Beauty Center.`,
      `Nama: ${payload.name}`,
      `Kota: ${payload.city}`,
      `WhatsApp: ${payload.phone}`,
      `Paket minat: ${payload.packageTier}`,
      utm.utm_source ? `UTM Source: ${utm.utm_source}` : null,
      utm.utm_campaign ? `UTM Campaign: ${utm.utm_campaign}` : null,
      utm.utm_medium ? `UTM Medium: ${utm.utm_medium}` : null,
      utm.fbclid ? `fbclid: ${utm.fbclid}` : null,
      utm.ttclid ? `ttclid: ${utm.ttclid}` : null,
      `Mohon jadwalkan konsultasi gratis.`
    ]
      .filter(Boolean)
      .join("%0A");

    const wa = `https://wa.me/${normalizePhone(String(to))}?text=${lines}`;
    // TODO: Optional – POST ke endpoint CRM di sini (before redirect)
    window.location.href = wa;
  }

  // Smooth scroll helper
  function scrollToForm() {
    // TikTok Event: User engaged with CTA
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track('ClickButton', {
        content_name: 'Scroll to Form CTA',
        content_category: 'User Engagement',
        description: 'User clicked CTA to scroll to form'
      });
    }
    
    // Meta Pixel Event: User engaged with CTA to view form
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: 'Partnership Form View',
        content_category: 'User Engagement'
      });
    }
    
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // WhatsApp popup functions
  function openWhatsAppDirect() {
    // TikTok Event: WhatsApp Chat Initiated
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track('Contact', {
        content_name: 'WhatsApp Chat',
        content_category: 'Direct Contact',
        description: 'User initiated WhatsApp chat from popup'
      });
    }
    
    // Meta Pixel Event: Contact initiated
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Contact', {
        content_name: 'WhatsApp Direct Contact',
        content_category: 'Customer Contact'
      });
    }

    const waNumber = normalizePhone(process.env.NEXT_PUBLIC_WA_NUMBER || "62882005295884");
    const message = "Halo, saya tertarik dengan program Kemitraan DRW Beauty Center";
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  }

  function toggleChat() {
    // Meta Pixel: Track chat widget interaction
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Contact', {
        content_name: 'Chat Widget Toggle',
        content_category: 'Customer Support'
      });
    }
    setIsChatOpen(!isChatOpen);
  }

  useEffect(() => {
    // PLACEHOLDER: Meta Pixel / TikTok Pixel init bisa taruh di sini
    // if (window.fbq) window.fbq("track", "PageView");
    // if (window.ttq) window.ttq.track("ViewContent");
  }, []);

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.ico" alt="DRW Beauty Center Logo" className="h-9 w-9 rounded-xl" />
            <span className="font-semibold">DRW Beauty Center</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#benefits" className="hover:text-pink-700">Benefit</a>
            <a href="#showcase" className="hover:text-pink-700">Portofolio</a>
            <a href="#packages" className="hover:text-pink-700">Paket</a>
            <a href="#faq" className="hover:text-pink-700">FAQ</a>
          </nav>
          <button onClick={scrollToForm} className="rounded-xl bg-pink-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-pink-800">Konsultasi Gratis</button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-pink-50 to-white" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Bangun Beauty Center Impianmu
              <span className="text-pink-700"> Bersama DRW Skincare</span>
            </h1>
            <p className="mt-4 text-slate-600 md:text-lg">
              Peluang bisnis kecantikan terpercaya dengan sistem kemitraan yang sudah terbukti sukses di seluruh Indonesia.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={scrollToForm} className="rounded-2xl bg-pink-700 px-6 py-3 font-semibold text-white shadow-lg hover:-translate-y-0.5 transition">
                Gabung Jadi Mitra Sekarang
              </button>
              <a href="#showcase" className="rounded-2xl px-6 py-3 font-semibold border border-slate-200 hover:bg-slate-50">
                Lihat Portofolio
              </a>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" /> Brand 10+ tahun</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" /> Produk BPOM</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" /> Support menyeluruh</div>
            </div>
          </div>
          <div className="relative">
            <img src="/images/hero.webp" alt="DRW Beauty Center Hero" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-inner" />
          </div>
        </div>
      </section>

      {/* PROBLEM → SOLUTION */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold">Kendala Memulai Bisnis Kecantikan</h2>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li>• Bingung harus mulai dari mana</li>
              <li>• Takut gagal tanpa support yang jelas</li>
              <li>• Minim pengalaman dan tim</li>
              <li>• Ragu produk yang tepat dan aman</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-pink-700 p-8 text-white shadow-lg">
            <h3 className="text-xl font-bold">Solusi DRW Beauty Center</h3>
            <p className="mt-3 opacity-95">Sistem kemitraan yang mudah, terarah, dan didampingi sampai sukses.</p>
            <ul className="mt-5 space-y-3">
              <li>✓ Sistem onboarding jelas</li>
              <li>✓ Produk teruji & repeat order tinggi</li>
              <li>✓ Training & SOP operasional</li>
              <li>✓ Promosi & materi pemasaran siap pakai</li>
            </ul>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-extrabold">Kenapa Harus Kemitraan DRW Beauty Center?</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Brand terpercaya 10+ tahun",
              desc: "Reputasi kuat dan komunitas pelanggan loyal di banyak kota.",
              icon: ShieldCheckIcon
            },
            {
              title: "Produk dermatology tested",
              desc: "Repeat order tinggi, formulasi aman & terdaftar BPOM.",
              icon: BeakerIcon
            },
            {
              title: "Training & support langsung",
              desc: "Onboarding, SOP, dan pendampingan operasional harian.",
              icon: AcademicCapIcon
            },
            {
              title: "Marketing kit siap pakai",
              desc: "Desain promosi, konten, dan campaign terintegrasi.",
              icon: PresentationChartLineIcon
            },
            {
              title: "Potensi omzet besar",
              desc: "Skalakan pendapatan hingga ratusan juta per bulan.",
              icon: CurrencyDollarIcon
            },
            {
              title: "Legalitas & keamanan",
              desc: "Perizinan jelas, tata kelola kemitraan transparan.",
              icon: DocumentTextIcon
            }
          ].map((b, i) => (
            <div key={i} className="rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-pink-100 mb-4 flex items-center justify-center">
                <b.icon className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SHOWCASE */}
      <section id="showcase" className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl md:text-3xl font-extrabold">Sudah Ratusan Mitra Bergabung</h2>
        </div>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <img key={i} src={`/showcase/${i + 1}.png`} alt={`Showcase ${i + 1}`} className="aspect-[4/3] rounded-2xl object-cover w-full" />
          ))}
        </div>
        <blockquote className="mt-6 rounded-2xl border border-slate-100 p-6 text-slate-700 italic">
          "Dulu saya hanya reseller, sekarang punya Beauty Center sendiri dengan penghasilan stabil. Pendampingan DRW itu nyata dan sistematis."
        </blockquote>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-extrabold">Pilih Paket Sesuai Target Bisnismu</h2>
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          {[
            {
              tier: "PLATINUM",
              price: "49 juta",
              description: "Kemitraan Beauty Center yang Fokus pada tindakan facial dasar dan sudah dilengkapi alat canggih standar rumah cantik",
              bullets: [
                "Alat Treatment Canggih:",
                "• Alat 8 in 1: Microdermabrasi, High Frequency, Detox, Oxy spray, Vacuum",
                "• Alat PDT Biolight, Ice Globe, Alat Vapozone, Alat Scrubber",
                "",
                "Perlengkapan Beauty Center DRW Skincare:",
                "• Bed Facial Stainless, Display Hambalan, Seragam, Kemben, Handuk Facial",
                "• Magnifying Lamp, Trolly, Stool Chair, Tripod + Ring Light (Live), Display Acrylic",
                "• Bandana, Sertifikat",
                "",
                "Produk Skincare:",
                "• 5 Paket Glow Series, 5 Paket Dark Spot/Flek Series, 5 Paket Acne Series",
                "",
                "TIDAK TERMASUK:",
                "• Manajemen Fee Per Tahun 4,5 juta",
                "• Deposit selama 2 tahun kerja sama"
              ]
            },
            {
              tier: "PROFESIONAL",
              price: "99 juta",
              description: "Kemitraan Beauty Center yang dilengkapi dengan mesin IPL dan Skin Analyzed",
              bullets: [
                "Alat Treatment Canggih:",
                "• Alat 7 in 1: Oxy Spray, Hydra peel, Detox, Radio Frequency Mata, Radio Frequency Wajah, Cooling Wajah",
                "• Biolight Topeng, Alat IPL, Alat Skin analyzer, Alat PDT, Alat Vapozone, Alat Scrubber",
                "",
                "Perlengkapan Beauty Center Skincare:",
                "• Bed Facial Stainless, Seragam, Kemben, Handuk Facial, Bandana, Sertifikat",
                "• Magnifying Lamp, Trolly, Stool Chair, Display Acrylic, Display Hambalan",
                "",
                "Produk Skincare:",
                "• 5 Paket Glow Series, 5 Paket Dark Spot/Flek Series, 5 Paket Acne Series",
                "",
                "TIDAK TERMASUK:",
                "• Manajemen Fee Per Tahun 9 juta",
                "• Deposit selama 2 tahun kerja sama"
              ]
            }
          ].map((p, i) => (
            <div key={i} className="rounded-3xl border border-slate-100 p-6 shadow-sm bg-gradient-to-br from-pink-50 to-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-pink-800">{p.tier}</h3>
                <div className="bg-pink-700 text-white px-4 py-2 rounded-full text-lg font-bold">{p.price}</div>
              </div>
              <p className="text-sm text-slate-600 mb-4 italic">{p.description}</p>
              <div className="bg-white rounded-2xl p-4 shadow-inner">
                <h4 className="font-semibold text-pink-700 mb-3">SUDAH TERMASUK:</h4>
                <div className="space-y-1 text-sm text-slate-700 max-h-96 overflow-y-auto">
                  {p.bullets.map((b, j) => (
                    <div key={j} className={b === "" ? "py-1" : b.includes(":") ? "font-semibold text-pink-700 mt-3" : b.startsWith("TIDAK TERMASUK") ? "font-semibold text-red-600 mt-3" : ""}>
                      {b}
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => { 
                // Meta Pixel: Track package selection
                if (typeof window !== 'undefined' && window.fbq) {
                  window.fbq('track', 'AddToCart', {
                    content_name: p.tier + ' Package Selection',
                    content_category: 'Partnership Package',
                    value: p.tier === 'PLATINUM' ? 50000000 : 25000000,
                    currency: 'IDR'
                  });
                }
                setPackageTier(p.tier); 
                scrollToForm(); 
              }} className="mt-6 w-full rounded-xl bg-pink-700 py-3 font-semibold text-white hover:bg-pink-800 transition-colors">
                Minta Proposal Lengkap
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORT */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-3xl bg-gradient-to-br from-pink-700 to-indigo-700 p-8 text-white">
          <h2 className="text-2xl md:text-3xl font-extrabold">Bukan Sekadar Kemitraan — Kami Dampingi Sampai Sukses</h2>
          <div className="mt-6 grid md:grid-cols-5 gap-4 text-sm">
            {[
              "Pendampingan grand opening",
              "Training staf & dokter",
              "Materi promosi siap pakai",
              "Event & kolaborasi pusat",
              "Sistem CRM pelanggan"
            ].map((s, i) => (
              <div key={i} className="rounded-xl bg-white/10 p-4">{s}</div>
            ))}
          </div>
          <div className="mt-6">
            <button onClick={scrollToForm} className="rounded-xl bg-white px-5 py-3 font-semibold text-pink-800 hover:bg-pink-50">
              Isi Form & Konsultasi Gratis
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-extrabold">Pertanyaan yang Sering Ditanyakan</h2>
        <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-100">
          {[
            {
              q: "Apakah saya harus punya pengalaman di bidang kecantikan?",
              a: "Tidak. DRW menyediakan training lengkap, SOP, dan pendampingan operasional."
            },
            {
              q: "Apakah legal dan aman?",
              a: "Ya. Produk terdaftar BPOM dan perizinan kemitraan jelas serta transparan."
            },
            {
              q: "Bagaimana cara memulai?",
              a: "Isi form di bawah. Tim kami akan menghubungi untuk konsultasi gratis dan pengiriman proposal."
            }
          ].map((f, i) => (
            <details key={i} className="group open:shadow-sm">
              <summary className="cursor-pointer list-none px-6 py-5 font-semibold hover:bg-slate-50">
                <span className="mr-3 inline-block h-5 w-5 rounded-full bg-pink-100 text-pink-700 text-center">{i + 1}</span>
                {f.q}
              </summary>
              <div className="px-6 pb-6 text-slate-600">{f.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* LEAD FORM */}
      <section id="lead-form" className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold">Isi Formulir & Mulai Konsultasi Gratis</h2>
            <p className="mt-3 text-slate-600">Tim kami akan menghubungi melalui WhatsApp untuk mengirimkan proposal kemitraan dan menjawab pertanyaan Anda.</p>
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              <li>• Respon cepat di jam kerja</li>
              <li>• Data Anda aman dan tidak dibagikan</li>
              <li>• Tanpa komitmen, konsultasi 100% gratis</li>
            </ul>
          </div>
          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium">Nama Lengkap</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-200" placeholder="Tulis nama Anda" />
              </div>
              <div>
                <label className="text-sm font-medium">Kota Domisili</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} required className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-200" placeholder="Contoh: Yogyakarta" />
              </div>
              <div>
                <label className="text-sm font-medium">Nomor WhatsApp</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-200" placeholder="Contoh: 0812xxxxxxx" />
              </div>
              <div>
                <label className="text-sm font-medium">Paket Minat</label>
                <select value={packageTier} onChange={(e) => setPackageTier(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-200">
                  <option>PLATINUM</option>
                  <option>PROFESIONAL</option>
                </select>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <input id="agree" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300" />
                <label htmlFor="agree" className="select-none">Saya setuju data saya digunakan untuk keperluan konsultasi kemitraan sesuai <a className="underline" href="#" onClick={(e)=>e.preventDefault()}>Kebijakan Privasi</a>.</label>
              </div>
              {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
              <button type="submit" className="rounded-2xl bg-pink-700 px-6 py-3 font-semibold text-white shadow-lg hover:bg-pink-800">Kirim & WhatsApp Kami</button>
              <p className="text-xs text-slate-500">Dengan menekan tombol ini Anda akan diarahkan ke WhatsApp official DRW.</p>
            </div>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/favicon.ico" alt="DRW Skincare Logo" className="h-8 w-8 rounded-lg" />
              <div>
                <div className="font-semibold text-slate-800">DRW Skincare</div>
                <div className="text-xs">Beauty Center Partnership Program</div>
              </div>
            </div>
            <div className="flex gap-6">
              <a className="hover:text-pink-700" href="#">Kebijakan Privasi</a>
              <a className="hover:text-pink-700" href="#">Syarat & Ketentuan</a>
              <a className="hover:text-pink-700" href="#">Kontak</a>
            </div>
          </div>
          <div className="mt-6 text-xs">© {new Date().getFullYear()} DRW Skincare. All rights reserved.</div>
        </div>
      </footer>

      {/* WhatsApp Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Popup */}
        {isChatOpen && (
          <div className="mb-4 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 w-80 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faWhatsapp} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">DRW Beauty Center</h3>
                  <p className="text-xs text-green-600">● Online</p>
                </div>
              </div>
              <button 
                onClick={toggleChat}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-sm text-slate-700">Halo! 👋</p>
                <p className="text-sm text-slate-700 mt-1">
                  Tertarik dengan kemitraan Beauty Center DRW? Yuk konsultasi gratis sekarang!
                </p>
              </div>
              <button 
                onClick={openWhatsAppDirect}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                Chat via WhatsApp
              </button>
            </div>
          </div>
        )}
        
        {/* Floating Action Button */}
        <button
          onClick={toggleChat}
          className="bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 animate-pulse"
        >
          {isChatOpen ? (
            <XMarkIcon className="w-7 h-7" />
          ) : (
            <FontAwesomeIcon icon={faWhatsapp} className="w-7 h-7" />
          )}
        </button>
      </div>
    </div>
  );
}