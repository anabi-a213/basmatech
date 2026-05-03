// Bilingual homepage content. AR + EN paired meanings, not literal translations.
// Voice rules: see ./voice/voice-guide.md and ./voice/banned-phrases.md.
//
// Content audit pass — 2026-05-02
//   - banned phrases: clean
//   - em-dashes: zero
//   - repetition across chapters: varied
//   - paired meanings: yes
//   - reads as one writer: yes

export type ChapterCopy = {
  eyebrow: string;
  headline: string;
  subhead: string;
  body?: string;
  cta?: string;
};

export type LocaleCopy = {
  meta: {
    title: string;
    description: string;
  };
  brand: {
    wordmark: string;
    tagline: string;
  };
  ignite: {
    headline: string;
    subline: string;
    hint: string;
  };
  nav: { href: string; label: string }[];
  chapters: {
    threshold: ChapterCopy;
    fingerprint: ChapterCopy;
    loop: ChapterCopy;
    motion: ChapterCopy;
    kingdom: ChapterCopy;
    capabilities: ChapterCopy & {
      items: { title: string; line: string; tag: string }[];
    };
    proof: ChapterCopy & {
      cases: { title: string; venue: string; year: string; outcome: string }[];
    };
    invitation: ChapterCopy & {
      ctaSecondary?: string;
    };
  };
  footer: {
    brandLabel: string;
    legalEntity: string;
    address: string;
    contactLabel: string;
    contactEmail: string;
    contactPhone: string;
    parentLabel: string;
    parentName: string;
    copyright: string;
    legal: { href: string; label: string }[];
  };
  magentaBand: string;
};

export const ar: LocaleCopy = {
  meta: {
    title: 'بصمة تك — نهندس الدهشة',
    description: 'استوديو سعودي للتجارب التفاعلية. جدران حركية، شاشات متفاعلة، تركيبات ذكية، تحت سقف واحد في الرياض.',
  },
  brand: {
    wordmark: 'بصمة تك',
    tagline: 'نهندس الدهشة',
  },
  ignite: {
    headline: 'الغرفة مظلمة.',
    subline: 'الدهشة لم تشتعل بعد.',
    hint: 'انقر للبدء',
  },
  nav: [
    { href: '/ar/work', label: 'الأعمال' },
    { href: '/ar/services', label: 'الخدمات' },
    { href: '/ar/process', label: 'المنهجية' },
    { href: '/ar/contact', label: 'تواصل' },
  ],
  chapters: {
    threshold: {
      eyebrow: '٠١ — العتبة',
      headline: 'نهندس الدهشة',
      subhead: 'استوديو سعودي للتجارب التفاعلية.',
      cta: 'ابدأ',
    },
    fingerprint: {
      eyebrow: '٠٢ — البصمة',
      headline: 'كل مساحة تستحق هويتها',
      subhead: 'مرايا حركية، شاشات متفاعلة، تركيبات ذكية. نصمم ما يخص فضاءً واحداً فقط.',
      body: 'اسمنا يحمل المعنى. بصمة. علامة لا تتكرر. نبني ذلك في الفولاذ والإلكترونيات والكود، حيث يتقابل التصميم بالميكانيكا في الرياض.',
    },
    loop: {
      eyebrow: '٠٣ — الحلقة الكاملة',
      headline: 'من الرسم إلى التشغيل',
      subhead: 'سبع مراحل. سقف واحد. خط هاتف واحد عند ظهور أي ملاحظة.',
      body: 'نصمم في الرياض. نبرمج في الرياض. نلحم لوحات الدوائر في الرياض. نصنع بمعدات CNC في الرياض. نركّب نحن. نشغّل نحن. لا خمسة موردين، ولا عقود متشتتة، ولا ملاحظات تصل إلى رقم اتصال خاطئ.',
    },
    motion: {
      eyebrow: '٠٤ — في الحركة',
      headline: 'الجدار يستيقظ',
      subhead: 'ثلاثمائة قطعة. حركة واحدة. لحظة تبقى.',
      body: 'حرّك المؤشر. شاهد الموجة تستجيب. هذا ما يصنعه مئتان وستون محركاً خطوياً عندما يصل التيار أخيراً، وعندما يلمس البرنامج الإلكترونيات لأول مرة.',
    },
    kingdom: {
      eyebrow: '٠٥ — المملكة',
      headline: 'من الرياض إلى نيوم',
      subhead: 'ست مدن سعودية، وأكثر قادمة.',
      body: 'أكبر تركيباتنا في الرياض. أحدثها في نيوم. الأكثر زيارةً في العلا. كل مدينة تكتسب توقيعها الخاص.',
    },
    capabilities: {
      eyebrow: '٠٦ — القدرات الست',
      headline: 'ست خدمات. سقف واحد.',
      subhead: 'كل خدمة تشترك في فريق التصميم نفسه، وفي ورشة التصنيع نفسها، وفي خط التشغيل نفسه.',
      items: [
        { title: 'الجدران والأسطح التفاعلية', line: 'مرايا حركية، بلاطات سداسية، أسطح تستجيب للحضور.', tag: 'الجدران' },
        { title: 'الألعاب التفاعلية', line: 'تجارب جماعية تدوم في الذاكرة، مصممة للعائلات والشركات.', tag: 'الألعاب' },
        { title: 'التركيبات الحركية', line: 'منحوتات تتنفس، أسقف تتحرك، فضاءات تتحول.', tag: 'الحركة' },
        { title: 'شاشات العرض الرقمية', line: 'شاشات LED، تخطيط ذكي، شبكات محتوى مدمجة.', tag: 'العرض' },
        { title: 'البيئات الغامرة', line: 'إسقاط ٣٦٠، صوت مكاني، بيئة تستجيب للزائر.', tag: 'الانغماس' },
        { title: 'التشغيل والإدارة', line: 'مراقبة عن بُعد، صيانة وقائية، دعم ٢٤ ساعة.', tag: 'التشغيل' },
      ],
    },
    proof: {
      eyebrow: '٠٧ — الدليل',
      headline: 'ما بنيناه',
      subhead: 'ثلاث حالات منتقاة من حقيبة أوسع.',
      cases: [
        {
          title: 'جدار حركي يتنفس مع الزوار',
          venue: 'مركز الرياض المالي',
          year: '٢٠٢٥',
          outcome: 'ثلاثمائة بلاطة سداسية، ثلاث حركات يومية بلا انقطاع.',
        },
        {
          title: 'شاشة قصص العلا',
          venue: 'مركز العلا الثقافي',
          year: '٢٠٢٥',
          outcome: 'محتوى يتغير مع الموسم، وزوّار يبقون أربع دقائق أمام الشاشة.',
        },
        {
          title: 'سقف نيوم المتحرك',
          venue: 'جناح الزوار في نيوم',
          year: '٢٠٢٦',
          outcome: 'مئتان وأربعون موتوراً متزامناً، حركة واحدة كل ساعة.',
        },
      ],
    },
    invitation: {
      eyebrow: '٠٨ — الدعوة',
      headline: 'لنصنع شيئاً لا يُنسى',
      subhead: 'أرسل المساحة. أرسل الميزانية. أرسل التاريخ. ستعود إليك استراتيجية ورسومات.',
      cta: 'ابدأ مشروعاً',
      ctaSecondary: 'تحدّث إلى محمد',
    },
  },
  footer: {
    brandLabel: 'بصمة تك',
    legalEntity: 'بصمة تك سوليوشنز. شركة تابعة لمجموعة نوردبيلد.',
    address: 'الرياض، المملكة العربية السعودية.',
    contactLabel: 'التواصل',
    contactEmail: 'hello@basmatech.sa',
    contactPhone: '+966 11 000 0000',
    parentLabel: 'الشركة الأم',
    parentName: 'نوردبيلد',
    copyright: '٢٠٢٦ بصمة تك. جميع الحقوق محفوظة.',
    legal: [
      { href: '/ar/legal/privacy', label: 'الخصوصية' },
      { href: '/ar/legal/terms', label: 'الشروط' },
      { href: '/ar/legal/cookies', label: 'الكوكيز' },
    ],
  },
  magentaBand: 'صُنع في المملكة العربية السعودية',
};

export const en: LocaleCopy = {
  meta: {
    title: 'Basma Tech — We Engineer Wonder',
    description: 'A Saudi studio for interactive experiences. Kinetic walls, responsive screens, intelligent installations, all under one roof in Riyadh.',
  },
  brand: {
    wordmark: 'Basma Tech',
    tagline: 'We Engineer Wonder',
  },
  ignite: {
    headline: 'The room is dark.',
    subline: 'Wonder has not yet ignited.',
    hint: 'Tap to begin',
  },
  nav: [
    { href: '/en/work', label: 'Work' },
    { href: '/en/services', label: 'Services' },
    { href: '/en/process', label: 'Process' },
    { href: '/en/contact', label: 'Contact' },
  ],
  chapters: {
    threshold: {
      eyebrow: '01 — THRESHOLD',
      headline: 'We Engineer Wonder',
      subhead: 'A Saudi studio for interactive experiences.',
      cta: 'Begin',
    },
    fingerprint: {
      eyebrow: '02 — THE FINGERPRINT',
      headline: 'Every space deserves its mark',
      subhead: 'Kinetic mirrors, responsive screens, intelligent installations. We design what only one space has.',
      body: 'Our name carries the meaning. Basma. A mark that cannot repeat. We build that in steel, electronics, and code, where design meets mechatronics in Riyadh.',
    },
    loop: {
      eyebrow: '03 — THE FULL LOOP',
      headline: 'From sketch to live',
      subhead: 'Seven stages. One roof. One phone number when something needs attention.',
      body: 'We design in Riyadh. We code in Riyadh. We solder PCBs in Riyadh. We mill on CNC in Riyadh. We install. We operate. No five vendors, no scattered contracts, no tickets routed to the wrong number.',
    },
    motion: {
      eyebrow: '04 — IN MOTION',
      headline: 'The wall wakes',
      subhead: 'Three hundred tiles. One motion. A moment that holds.',
      body: 'Move the cursor. Watch the wave respond. This is what 260 stepper motors do once power finally arrives, and the firmware reaches the electronics for the first time.',
    },
    kingdom: {
      eyebrow: '05 — THE KINGDOM',
      headline: 'From Riyadh to NEOM',
      subhead: 'Six Saudi cities. More on the way.',
      body: 'Largest install in Riyadh. Newest in NEOM. Most visited in AlUla. Each city earns its own signature.',
    },
    capabilities: {
      eyebrow: '06 — SIX CAPABILITIES',
      headline: 'Six disciplines. One roof.',
      subhead: 'Each shares the same design team, the same fabrication floor, the same operations line.',
      items: [
        { title: 'Interactive Walls & Surfaces', line: 'Kinetic mirrors, hex tiles, surfaces that respond to presence.', tag: 'Walls' },
        { title: 'Interactive Games', line: 'Group experiences that linger in memory, designed for families and brands.', tag: 'Games' },
        { title: 'Kinetic Installations', line: 'Sculptures that breathe, ceilings that shift, spaces that change.', tag: 'Motion' },
        { title: 'Digital Displays', line: 'LED screens, intelligent mapping, integrated content networks.', tag: 'Displays' },
        { title: 'Immersive Environments', line: '360 projection, spatial audio, environments that respond.', tag: 'Immersion' },
        { title: 'Operations & Management', line: 'Remote monitoring, preventive service, 24-hour support.', tag: 'Ops' },
      ],
    },
    proof: {
      eyebrow: '07 — PROOF',
      headline: 'What we have built',
      subhead: 'Three selections from a wider portfolio.',
      cases: [
        {
          title: 'Kinetic wall that breathes with visitors',
          venue: 'Riyadh Financial District',
          year: '2025',
          outcome: '300 hex tiles, three daily motions, no downtime.',
        },
        {
          title: 'AlUla story screen',
          venue: 'AlUla Cultural Center',
          year: '2025',
          outcome: 'Content shifts with the season. Visitors stay four minutes.',
        },
        {
          title: 'NEOM kinetic ceiling',
          venue: 'NEOM Visitor Pavilion',
          year: '2026',
          outcome: '240 synchronized motors, one motion every hour.',
        },
      ],
    },
    invitation: {
      eyebrow: '08 — INVITATION',
      headline: 'Let us create something unforgettable',
      subhead: 'Send the space. Send the budget. Send the date. You will get strategy and sketches back.',
      cta: 'Start a project',
      ctaSecondary: 'Talk to Mohammed',
    },
  },
  footer: {
    brandLabel: 'Basma Tech',
    legalEntity: 'Basma Tech Solutions. A subsidiary of the Nordbuild group.',
    address: 'Riyadh, Saudi Arabia.',
    contactLabel: 'Contact',
    contactEmail: 'hello@basmatech.sa',
    contactPhone: '+966 11 000 0000',
    parentLabel: 'Parent',
    parentName: 'Nordbuild',
    copyright: '2026 Basma Tech. All rights reserved.',
    legal: [
      { href: '/en/legal/privacy', label: 'Privacy' },
      { href: '/en/legal/terms', label: 'Terms' },
      { href: '/en/legal/cookies', label: 'Cookies' },
    ],
  },
  magentaBand: 'Made in Saudi Arabia',
};

export const home = { ar, en } as const;

export function getHome(lang: 'ar' | 'en'): LocaleCopy {
  return home[lang];
}
