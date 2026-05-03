/**
 * Site 1 (homepage) bilingual copy. Paired AR/EN meanings, never literal
 * translations. Headlines max 6 words, subheads max 12, body max 3 sentences.
 * No em-dashes. No banned phrases (see voiceLint.ts).
 *
 * Voice samples from the planning brief, applied here:
 *   "We make rooms that hold a silence."
 *   «نَصنع فراغاً يعرف كيف يَنصِت.»
 *
 * Adapted to the actual Basma Tech brand from BRIEF.md: Saudi studio for
 * interactive experiences (kinetic walls, games, installations, screens
 * with AI mapping, immersive rooms, 24/7 operations). Where the planning
 * brief's "luxury bespoke interior" framing conflicted with BRIEF.md, the
 * brief wins and the copy reflects interactive technology, not millwork.
 */

export type Lang = 'ar' | 'en';

export type ChapterCopy = {
  eyebrow: string;
  headline: string;
  subhead: string;
  body?: string;
};

export type HomeCopy = {
  meta: { title: string; description: string };
  brand: { wordmark: string };
  ignite: {
    headline: string;
    subline: string;
    hint: string;
  };
  chapters: {
    threshold: ChapterCopy & { cta?: string };
    imprint: ChapterCopy;
    workshop: ChapterCopy;
    motion: ChapterCopy;
    kingdom: ChapterCopy;
    capabilities: ChapterCopy & {
      items: { title: string; line: string; tag: string }[];
    };
    proof: ChapterCopy & {
      cases: { title: string; venue: string; year: string; outcome: string }[];
    };
    invitation: ChapterCopy & {
      cta?: string;
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

const ar: HomeCopy = {
  meta: {
    title: 'بصمة تك. نَصنع فراغاً يعرف كيف يَنصِت.',
    description: 'استوديو سعودي للتجارب التفاعلية. جدران تتحرك، شاشات تستجيب، تركيبات تتنفس. كل ذلك تحت سقف واحد في الرياض.',
  },
  brand: { wordmark: 'بصمة تك' },
  ignite: {
    headline: 'الغرفة مظلمة.',
    subline: 'الدهشة لم تشتعل بعد.',
    hint: 'انقر للبدء',
  },
  chapters: {
    threshold: {
      eyebrow: '٠١. العتبة',
      headline: 'نَصنع فراغاً يعرف كيف يَنصِت.',
      subhead: 'استوديو سعودي للتجارب التفاعلية.',
      body: 'كل تركيب نسلّمه يَفتح غرفةً، ويُغلِق ضوضاء.',
      cta: 'ابدأ',
    },
    imprint: {
      eyebrow: '٠٢. البصمة',
      headline: 'كل فضاء يستحق توقيعه.',
      subhead: 'بلاطة سداسية واحدة. ست واجهات. توقيع لا يَتكرّر.',
      body: 'اسمنا يحمل المعنى. بصمة. علامة لا تتكرر. نَبنيها في الفولاذ، وفي اللوحة الإلكترونية، وفي السطر الأخير من الكود.',
    },
    workshop: {
      eyebrow: '٠٣. الورشة',
      headline: 'من القطعة إلى الجدار.',
      subhead: 'سبع مراحل. سقف واحد. خط هاتف واحد عند ظهور أي ملاحظة.',
      body: 'نُصمّم في الرياض. نَلحم لوحات الدوائر في الرياض. نَقطع المعدن في الرياض. نُركّب نحن. نُشغّل نحن. لا خمسة موردين، ولا عقود متشتتة، ولا ملاحظات تذهب إلى رقم خاطئ.',
    },
    motion: {
      eyebrow: '٠٤. في الحركة',
      headline: 'الجدار يستيقظ.',
      subhead: 'ثلاثمائة قطعة. حركة واحدة. لحظة تَبقى في الذاكرة.',
      body: 'حرّك المؤشر. شاهد الموجة تَستجيب. هذا ما يَصنعه مئتان وستون محركاً عندما يَصل التيار، وعندما يَلمَس البرنامج اللوحة لأول مرة.',
    },
    kingdom: {
      eyebrow: '٠٥. المملكة',
      headline: 'من الرياض إلى نيوم.',
      subhead: 'ست مدن سعودية، وأكثر قادمة.',
      body: 'أكبر تركيباتنا في الرياض. أحدثها في نيوم. الأكثر زيارةً في العلا. كل مدينة تَكتسب توقيعها الخاص.',
    },
    capabilities: {
      eyebrow: '٠٦. القدرات الست',
      headline: 'ست قدرات. سقف واحد.',
      subhead: 'كل قدرة تَشترك في فريق التصميم نفسه، وفي ورشة التصنيع نفسها.',
      items: [
        { title: 'الجدران والأسطح التفاعلية', line: 'مرايا حركية، بلاطات سداسية، أسطح تَستجيب لاقتراب الزائر.', tag: 'الجدران' },
        { title: 'الألعاب التفاعلية', line: 'تجارب جماعية تَدوم في الذاكرة، مُصمَّمة للعائلات والفرق.', tag: 'الألعاب' },
        { title: 'التركيبات الحركية', line: 'منحوتات تَتنفّس، أسقف تَتحرّك، فضاءات تَتحوّل.', tag: 'الحركة' },
        { title: 'شاشات العرض الذكية', line: 'شاشات LED، خرائط ضوئية، شبكات محتوى موزّعة.', tag: 'العرض' },
        { title: 'البيئات الغامرة', line: 'إسقاط ٣٦٠، صوت مكاني، حضور كامل من الجدار إلى السقف.', tag: 'الانغماس' },
        { title: 'التشغيل والإدارة', line: 'مراقبة عن بُعد، صيانة وقائية، دعم على مدار الساعة.', tag: 'التشغيل' },
      ],
    },
    proof: {
      eyebrow: '٠٧. الدليل',
      headline: 'ثلاثة فضاءات. ثلاثة أسماء.',
      subhead: 'كل واحد يَعمل اليوم. تَستطيع زيارته.',
      cases: [
        { title: 'لوبي فندق على البحر الأحمر', venue: 'جدة', year: '٢٠٢٥', outcome: 'وقت مكوث الزائر تَضاعف ثلاث مرات في الأسبوع الأول.' },
        { title: 'بهو شركة طاقة', venue: 'الرياض', year: '٢٠٢٤', outcome: 'سقف بطول ١٢ متراً. ١٤٠ عنصراً مستقلاً. حركة لا تَتكرّر يومياً.' },
        { title: 'قاعة ثقافية في العلا', venue: 'العلا', year: '٢٠٢٥', outcome: 'سقف ٢٤٠ متراً مربعاً يَتحرّك مع الموسيقى الحية.' },
      ],
    },
    invitation: {
      eyebrow: '٠٨. الدعوة',
      headline: 'لِنَصنع شيئاً لا يُنسى.',
      subhead: 'أرسل المساحة. أرسل الميزانية. أرسل التاريخ.',
      body: 'خلال خمسة أيام عمل، تَعود إليك ثلاث لوحات تصميم، وموعد لقاء.',
      cta: 'ابدأ مشروعاً',
      ctaSecondary: 'تَحدّث مع محمد',
    },
  },
  footer: {
    brandLabel: 'بصمة تك',
    legalEntity: 'بصمة تك سوليوشنز. شركة تابعة لمجموعة نوردبيلد.',
    address: 'الرياض، المملكة العربية السعودية.',
    contactLabel: 'التواصل',
    contactEmail: 'hello@basmatech.sa',
    contactPhone: '+٩٦٦ ١١ ٠٠٠ ٠٠٠٠',
    parentLabel: 'الشركة الأم',
    parentName: 'نوردبيلد',
    copyright: '٢٠٢٦ بصمة تك. جميع الحقوق محفوظة.',
    legal: [
      { href: '/ar/legal/privacy', label: 'الخصوصية' },
      { href: '/ar/legal/terms', label: 'الشروط' },
      { href: '/ar/legal/cookies', label: 'الكوكيز' },
    ],
  },
  magentaBand: 'صُنِع في المملكة العربية السعودية',
};

const en: HomeCopy = {
  meta: {
    title: 'Basma Tech. We make rooms that hold a silence.',
    description: 'A Saudi studio for interactive experiences. Walls that move, screens that respond, installations that breathe. All under one roof in Riyadh.',
  },
  brand: { wordmark: 'Basma Tech' },
  ignite: {
    headline: 'The room is dark.',
    subline: 'The wonder has not ignited yet.',
    hint: 'Click to begin',
  },
  chapters: {
    threshold: {
      eyebrow: '01. Threshold',
      headline: 'We make rooms that hold a silence.',
      subhead: 'A Saudi studio for interactive experiences.',
      body: 'Every installation we hand over opens a room and closes a noise.',
      cta: 'Begin',
    },
    imprint: {
      eyebrow: '02. Imprint',
      headline: 'Every space deserves a signature.',
      subhead: 'One hexagonal tile. Six facets. A mark that does not repeat.',
      body: 'Our name carries the meaning. Basma. A mark that does not repeat. We build it in steel, in the printed circuit board, and in the last line of code.',
    },
    workshop: {
      eyebrow: '03. The workshop',
      headline: 'From the part to the wall.',
      subhead: 'Seven stages. One roof. One phone line for any flag.',
      body: 'We design in Riyadh. We solder boards in Riyadh. We cut metal in Riyadh. We install ourselves. We run the room ourselves. No five vendors, no scattered contracts, no notes that go to the wrong number.',
    },
    motion: {
      eyebrow: '04. In motion',
      headline: 'The wall wakes up.',
      subhead: 'Three hundred parts. One motion. A moment that stays.',
      body: 'Move the cursor. Watch the wave answer. This is what 260 stepper motors do when current arrives, and when software touches the board for the first time.',
    },
    kingdom: {
      eyebrow: '05. The kingdom',
      headline: 'Riyadh to NEOM.',
      subhead: 'Six Saudi cities, with more arriving.',
      body: 'Our largest installation lives in Riyadh. Our newest in NEOM. The most-visited in AlUla. Every city earns its own signature.',
    },
    capabilities: {
      eyebrow: '06. Six capabilities',
      headline: 'Six capabilities. One roof.',
      subhead: 'Every capability shares the same design team and the same workshop.',
      items: [
        { title: 'Interactive walls and surfaces', line: 'Kinetic mirrors, hexagonal tiles, surfaces that respond to a visitor approaching.', tag: 'Walls' },
        { title: 'Interactive games', line: 'Group experiences that stay in memory. Sized for families and teams.', tag: 'Games' },
        { title: 'Kinetic installations', line: 'Sculptures that breathe, ceilings that move, spaces that shift.', tag: 'Kinetic' },
        { title: 'Smart display screens', line: 'LED displays, light maps, distributed content networks.', tag: 'Screens' },
        { title: 'Immersive environments', line: '360 projection, spatial audio, full presence wall to ceiling.', tag: 'Immersive' },
        { title: 'Operations and management', line: 'Remote monitoring, preventive maintenance, support around the clock.', tag: 'Operations' },
      ],
    },
    proof: {
      eyebrow: '07. The proof',
      headline: 'Three rooms. Three names.',
      subhead: 'Each one runs today. You can visit.',
      cases: [
        { title: 'Red Sea hotel lobby', venue: 'Jeddah', year: '2025', outcome: 'Visitor dwell time tripled in the first week.' },
        { title: 'Energy company atrium', venue: 'Riyadh', year: '2024', outcome: 'A 12-meter ceiling. 140 independent elements. Motion that does not repeat in a day.' },
        { title: 'AlUla cultural hall', venue: 'AlUla', year: '2025', outcome: 'A 240-square-meter ceiling that moves with live music.' },
      ],
    },
    invitation: {
      eyebrow: '08. The invitation',
      headline: 'Let us make something unforgettable.',
      subhead: 'Send the space. Send the budget. Send the date.',
      body: 'Within five working days, you receive three concept boards back and a meeting on the calendar.',
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

export function getHomeCopy(lang: Lang): HomeCopy {
  return home[lang];
}
