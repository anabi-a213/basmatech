/**
 * Site 2 — The Tour. Single-scroll, full-bleed, walking-presentation.
 *
 * 11 sections in order:
 *   foyer  →  9 project rooms (with corridor walk-out between every one)  →  closing
 *
 * Each project is a real Basma Tech installation. Photos are the
 * "without Basma Tech" contrast renders authored at brand-imagery/generated/contrast.
 *
 * Authored against the master prompt:
 *   - voice confident, specific, visionary, Saudi-rooted
 *   - headlines max 6 words; body max 3 sentences
 *   - no em-dashes, no banned filler
 *   - AR/EN paired meanings, NOT literal translations
 *   - last sentence of each section bridges to first idea of next
 */

export type Lang = 'ar' | 'en';

export type CorridorTint = 'mint' | 'sky' | 'lavender' | 'pink' | 'magenta' | 'cream';

export type TourProject = {
  /** zero-padded number "01"..."09" */
  number: string;
  /** stable slug for hash-link / analytics */
  slug: string;
  /** one of the 6 service categories */
  category: 'walls' | 'games' | 'kinetic' | 'screens' | 'immersive' | 'operations';
  /** category badge text shown in eyebrow */
  categoryLabel: string;
  /** project title */
  title: string;
  /** city, e.g. "Riyadh" */
  city: string;
  /** year of installation */
  year: string;
  /** punchy outcome line, ~14 words max */
  outcome: string;
  /** filename inside /public/rooms/, e.g. "without-walls-hotel.png" */
  photo: string;
  /**
   * 4-line stat strip shown over the establishing shot. Each item is a
   * label + value pair. Examples: "tiles 312", "motors 264", "soak time 72h".
   */
  stats: { label: string; value: string }[];
  /** corridor tint for the walk-out that follows this project */
  corridorTint: CorridorTint;
};

export type FoyerCopy = {
  eyebrowOverline: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  scrollHint: string;
};

export type ClosingCopy = {
  eyebrow: string;
  headline: string;
  subhead: string;
  cta: string;
  ctaSecondary: string;
  bandLabel: string;
};

export type TourCopy = {
  meta: { title: string; description: string };
  brand: { wordmark: string };
  nav: { href: string; label: string }[];
  foyer: FoyerCopy;
  projects: TourProject[];
  closing: ClosingCopy;
  ui: {
    enterPrompt: string;
    nextProject: string;
    finalProject: string;
    progressOf: string;
  };
  footer: {
    brandLabel: string;
    legalEntity: string;
    address: string;
    contactLabel: string;
    contactEmail: string;
    parentLabel: string;
    parentName: string;
    copyright: string;
  };
};

const ar: TourCopy = {
  meta: {
    title: 'بصمة تك — جولة الأعمال',
    description: 'تسعة تركيبات حقيقية في مدن سعودية. تمشي من واحد إلى الآخر، فرواق يفصل بينهما.',
  },
  brand: { wordmark: 'بصمة تك' },
  nav: [
    { href: 'https://basmatech.sa/ar', label: 'الموقع الرئيسي' },
    { href: '#tour-01', label: '٠١ الجدران' },
    { href: '#tour-04', label: '٠٤ الألعاب' },
    { href: '#tour-06', label: '٠٦ الحركة' },
    { href: '#tour-08', label: '٠٨ العرض' },
  ],
  foyer: {
    eyebrowOverline: 'الجولة',
    eyebrow: 'تسعة تركيبات. مدن سبع. سقف واحد.',
    headline: 'ادخل. سترى عملنا، ليس صور عملنا.',
    subhead:
      'كل تركيب هنا يعمل اليوم. الزيارة تأخذ خمس دقائق. لا حواجز عرض، لا روابط خارجية، لا توقف.',
    scrollHint: 'اسحب للأسفل لتبدأ',
  },
  projects: [
    {
      number: '٠١',
      slug: 'hotel-jeddah-walls',
      category: 'walls',
      categoryLabel: 'جدران تفاعلية',
      title: 'لوبي فندق على البحر الأحمر',
      city: 'جدة',
      year: '٢٠٢٥',
      outcome: 'وقت مكوث الزائر تضاعف ثلاث مرات في الأسبوع الأول.',
      photo: 'hero-01-hotel.jpg',
      stats: [
        { label: 'البلاطات', value: '٣١٢' },
        { label: 'المحركات', value: '٢٦٤' },
        { label: 'الإضاءة', value: 'سبع طبقات' },
        { label: 'التشغيل', value: '١٢ أسبوعاً' },
      ],
      corridorTint: 'sky',
    },
    {
      number: '٠٢',
      slug: 'retail-riyadh-walls',
      category: 'walls',
      categoryLabel: 'جدران تفاعلية',
      title: 'متجر علامة عالمية',
      city: 'الرياض',
      year: '٢٠٢٥',
      outcome: 'مشاركات إنستجرام تجاوزت ثمانية آلاف في الشهر الأول.',
      photo: 'hero-02-retail.jpg',
      stats: [
        { label: 'المرايا', value: '١٤٤' },
        { label: 'الحساسات', value: '٢٤' },
        { label: 'العرض', value: 'سبع متراً' },
        { label: 'التشغيل', value: 'تسعة أسابيع' },
      ],
      corridorTint: 'pink',
    },
    {
      number: '٠٣',
      slug: 'mall-dammam-games',
      category: 'games',
      categoryLabel: 'ألعاب تفاعلية',
      title: 'صالة ألعاب مركز تسوق',
      city: 'الدمام',
      year: '٢٠٢٤',
      outcome: 'متوسط الجلسة ٢٢ دقيقة. متوسط الإقبال ٤٠٠ زائر يومياً.',
      photo: 'hero-03-mall.jpg',
      stats: [
        { label: 'محطات', value: 'ست' },
        { label: 'لاعبون', value: '٣٢ معاً' },
        { label: 'تحديثات', value: 'عن بُعد' },
        { label: 'التشغيل', value: '١٤ أسبوعاً' },
      ],
      corridorTint: 'mint',
    },
    {
      number: '٠٤',
      slug: 'event-riyadh-games',
      category: 'games',
      categoryLabel: 'ألعاب تفاعلية',
      title: 'تفعيل فعالية رياضية',
      city: 'الرياض',
      year: '٢٠٢٥',
      outcome: 'الزوار المُقاسون تجاوزوا ١٢٠ ألفاً خلال أسبوعين.',
      photo: 'hero-04-event.jpg',
      stats: [
        { label: 'الحضور', value: '١٢٠ ألف' },
        { label: 'فترة', value: 'أسبوعان' },
        { label: 'الفريق', value: 'ثلاثة' },
        { label: 'التشغيل', value: '٢٤ ساعة' },
      ],
      corridorTint: 'lavender',
    },
    {
      number: '٠٥',
      slug: 'corporate-riyadh-kinetic',
      category: 'kinetic',
      categoryLabel: 'تركيبات حركية',
      title: 'بهو شركة طاقة',
      city: 'الرياض',
      year: '٢٠٢٤',
      outcome: 'تركيب ١٢ متراً، ١٤٠ عنصراً مستقلاً، حركة لا تتكرر يومياً.',
      photo: 'hero-05-corporate.jpg',
      stats: [
        { label: 'العناصر', value: '١٤٠' },
        { label: 'الطول', value: '١٢ متر' },
        { label: 'الوزن', value: '٣٢٠ كغ' },
        { label: 'التشغيل', value: '١٦ أسبوعاً' },
      ],
      corridorTint: 'cream',
    },
    {
      number: '٠٦',
      slug: 'cultural-alula-kinetic',
      category: 'kinetic',
      categoryLabel: 'تركيبات حركية',
      title: 'قاعة ثقافية في العلا',
      city: 'العلا',
      year: '٢٠٢٥',
      outcome: 'سقف ٢٤٠ متراً مربعاً يتحرك مع الموسيقى الحية.',
      photo: 'hero-06-cultural.jpg',
      stats: [
        { label: 'المساحة', value: '٢٤٠ م²' },
        { label: 'القنوات', value: 'ثلاثاً وستون' },
        { label: 'تأخير', value: 'أقل من ٢٠ مللي' },
        { label: 'التشغيل', value: '١٨ أسبوعاً' },
      ],
      corridorTint: 'magenta',
    },
    {
      number: '٠٧',
      slug: 'restaurant-riyadh-screens',
      category: 'screens',
      categoryLabel: 'شاشات وخرائط ضوئية',
      title: 'صف مطاعم على الواجهة',
      city: 'الرياض',
      year: '٢٠٢٥',
      outcome: 'سبع عشرة شاشة، شبكة محتوى واحدة، بلا انقطاع منذ الافتتاح.',
      photo: 'hero-07-restaurant.jpg',
      stats: [
        { label: 'الشاشات', value: '١٧' },
        { label: 'دقة', value: '٢ مم' },
        { label: 'احتياط', value: '4G' },
        { label: 'التشغيل', value: 'ثمانية أسابيع' },
      ],
      corridorTint: 'sky',
    },
    {
      number: '٠٨',
      slug: 'launch-riyadh-immersive',
      category: 'immersive',
      categoryLabel: 'بيئات غامرة',
      title: 'إطلاق منتج علامة سعودية',
      city: 'الرياض',
      year: '٢٠٢٥',
      outcome: 'غرفة ٣٢٠ متراً مربعاً استضافت ٢٢٠ ضيفاً في ليلة واحدة.',
      photo: 'hero-08-launch.jpg',
      stats: [
        { label: 'المساحة', value: '٣٢٠ م²' },
        { label: 'الإسقاط', value: '٣٦٠°' },
        { label: 'الصوت', value: 'مكاني' },
        { label: 'التشغيل', value: '٢٠ أسبوعاً' },
      ],
      corridorTint: 'lavender',
    },
    {
      number: '٠٩',
      slug: 'operations-portfolio',
      category: 'operations',
      categoryLabel: 'تشغيل وإدارة',
      title: 'محفظة تشغيل لمالك متعدد',
      city: 'الرياض، جدة، الدمام',
      year: '٢٠٢٥',
      outcome: 'متوسط زمن استجابة ١١ دقيقة عبر تسعة تركيبات.',
      photo: 'hero-09-ops.jpg',
      stats: [
        { label: 'المواقع', value: 'تسعة' },
        { label: 'العملاء', value: 'أربعة' },
        { label: 'الاستجابة', value: '١١ دقيقة' },
        { label: 'العقد', value: 'سنوي' },
      ],
      corridorTint: 'mint',
    },
  ],
  closing: {
    eyebrow: 'نهاية الجولة',
    headline: 'رأيت تسعة. التالي يحمل اسمك.',
    subhead:
      'أرسل المساحة. أرسل الميزانية. أرسل الموعد. خلال خمسة أيام عمل، تعود إليك ثلاث لوحات تصميم، وموعد لقاء.',
    cta: 'ابدأ مشروعاً',
    ctaSecondary: 'العودة إلى الموقع الرئيسي',
    bandLabel: 'صُنع في المملكة العربية السعودية',
  },
  ui: {
    enterPrompt: 'اسحب للأسفل لتدخل',
    nextProject: 'الجولة تكمل',
    finalProject: 'آخر تركيب',
    progressOf: 'من',
  },
  footer: {
    brandLabel: 'بصمة تك',
    legalEntity: 'بصمة تك سوليوشنز. شركة تابعة لمجموعة نوردبيلد.',
    address: 'الرياض، المملكة العربية السعودية.',
    contactLabel: 'التواصل',
    contactEmail: 'hello@basmatech.sa',
    parentLabel: 'الشركة الأم',
    parentName: 'نوردبيلد',
    copyright: '٢٠٢٦ بصمة تك. جميع الحقوق محفوظة.',
  },
};

const en: TourCopy = {
  meta: {
    title: 'Basma Tech — The Tour',
    description: 'Nine real installations across seven Saudi cities. Walk from one to the next, a corridor between every two.',
  },
  brand: { wordmark: 'Basma Tech' },
  nav: [
    { href: 'https://basmatech.sa/en', label: 'Main site' },
    { href: '#tour-01', label: '01 Walls' },
    { href: '#tour-04', label: '04 Games' },
    { href: '#tour-06', label: '06 Kinetic' },
    { href: '#tour-08', label: '08 Screens' },
  ],
  foyer: {
    eyebrowOverline: 'The tour',
    eyebrow: 'Nine installations. Seven cities. One roof.',
    headline: 'Step in. You will see our work, not pictures of our work.',
    subhead:
      'Every installation here is running today. The walk takes five minutes. No gates, no outside links, no pauses.',
    scrollHint: 'Scroll to begin',
  },
  projects: [
    {
      number: '01',
      slug: 'hotel-jeddah-walls',
      category: 'walls',
      categoryLabel: 'Interactive walls',
      title: 'Red Sea hotel lobby',
      city: 'Jeddah',
      year: '2025',
      outcome: 'Visitor dwell time tripled in the first week of opening.',
      photo: 'hero-01-hotel.jpg',
      stats: [
        { label: 'Tiles', value: '312' },
        { label: 'Motors', value: '264' },
        { label: 'Light layers', value: '7' },
        { label: 'Lead time', value: '12 weeks' },
      ],
      corridorTint: 'sky',
    },
    {
      number: '02',
      slug: 'retail-riyadh-walls',
      category: 'walls',
      categoryLabel: 'Interactive walls',
      title: 'Global retail flagship',
      city: 'Riyadh',
      year: '2025',
      outcome: 'Eight thousand visitor-tagged Instagram posts in the first month.',
      photo: 'hero-02-retail.jpg',
      stats: [
        { label: 'Mirrors', value: '144' },
        { label: 'Sensors', value: '24' },
        { label: 'Width', value: '7 meters' },
        { label: 'Lead time', value: '9 weeks' },
      ],
      corridorTint: 'pink',
    },
    {
      number: '03',
      slug: 'mall-dammam-games',
      category: 'games',
      categoryLabel: 'Interactive games',
      title: 'Mall arcade hall',
      city: 'Dammam',
      year: '2024',
      outcome: 'Average session 22 minutes. Average daily footfall 400.',
      photo: 'hero-03-mall.jpg',
      stats: [
        { label: 'Stations', value: '6' },
        { label: 'Co-players', value: '32' },
        { label: 'Updates', value: 'Remote' },
        { label: 'Lead time', value: '14 weeks' },
      ],
      corridorTint: 'mint',
    },
    {
      number: '04',
      slug: 'event-riyadh-games',
      category: 'games',
      categoryLabel: 'Interactive games',
      title: 'Sports event activation',
      city: 'Riyadh',
      year: '2025',
      outcome: 'Measured visitors crossed 120,000 over a two-week run.',
      photo: 'hero-04-event.jpg',
      stats: [
        { label: 'Visitors', value: '120K' },
        { label: 'Run', value: '2 weeks' },
        { label: 'Crew', value: '3 ops' },
        { label: 'Live', value: '24h' },
      ],
      corridorTint: 'lavender',
    },
    {
      number: '05',
      slug: 'corporate-riyadh-kinetic',
      category: 'kinetic',
      categoryLabel: 'Kinetic installation',
      title: 'Energy company atrium',
      city: 'Riyadh',
      year: '2024',
      outcome: 'A 12-meter installation, 140 independent elements, no two days the same.',
      photo: 'hero-05-corporate.jpg',
      stats: [
        { label: 'Elements', value: '140' },
        { label: 'Length', value: '12 m' },
        { label: 'Mass', value: '320 kg' },
        { label: 'Lead time', value: '16 weeks' },
      ],
      corridorTint: 'cream',
    },
    {
      number: '06',
      slug: 'cultural-alula-kinetic',
      category: 'kinetic',
      categoryLabel: 'Kinetic installation',
      title: 'AlUla cultural hall',
      city: 'AlUla',
      year: '2025',
      outcome: 'A 240-square-meter ceiling that moves with live music.',
      photo: 'hero-06-cultural.jpg',
      stats: [
        { label: 'Area', value: '240 m²' },
        { label: 'Channels', value: '63' },
        { label: 'Latency', value: 'Below 20 ms' },
        { label: 'Lead time', value: '18 weeks' },
      ],
      corridorTint: 'magenta',
    },
    {
      number: '07',
      slug: 'restaurant-riyadh-screens',
      category: 'screens',
      categoryLabel: 'Screens and light maps',
      title: 'Waterfront restaurant row',
      city: 'Riyadh',
      year: '2025',
      outcome: 'Seventeen displays, one content network, no downtime since opening.',
      photo: 'hero-07-restaurant.jpg',
      stats: [
        { label: 'Screens', value: '17' },
        { label: 'Pitch', value: '2 mm' },
        { label: 'Failover', value: '4G' },
        { label: 'Lead time', value: '8 weeks' },
      ],
      corridorTint: 'sky',
    },
    {
      number: '08',
      slug: 'launch-riyadh-immersive',
      category: 'immersive',
      categoryLabel: 'Immersive room',
      title: 'Saudi brand product launch',
      city: 'Riyadh',
      year: '2025',
      outcome: 'A 320-square-meter room hosted 220 guests in one night.',
      photo: 'hero-08-launch.jpg',
      stats: [
        { label: 'Area', value: '320 m²' },
        { label: 'Projection', value: '360°' },
        { label: 'Audio', value: 'Spatial' },
        { label: 'Lead time', value: '20 weeks' },
      ],
      corridorTint: 'lavender',
    },
    {
      number: '09',
      slug: 'operations-portfolio',
      category: 'operations',
      categoryLabel: 'Operations and management',
      title: 'Multi-site operations portfolio',
      city: 'Riyadh, Jeddah, Dammam',
      year: '2025',
      outcome: 'Average response time 11 minutes across nine installations.',
      photo: 'hero-09-ops.jpg',
      stats: [
        { label: 'Sites', value: '9' },
        { label: 'Owners', value: '4' },
        { label: 'Response', value: '11 min' },
        { label: 'Term', value: 'Annual' },
      ],
      corridorTint: 'mint',
    },
  ],
  closing: {
    eyebrow: 'End of the walk',
    headline: 'You saw nine. The next one carries your name.',
    subhead:
      'Send the space. Send the budget. Send the date. Within five working days you get three concept boards back and a meeting on the calendar.',
    cta: 'Start a project',
    ctaSecondary: 'Back to main site',
    bandLabel: 'Made in Saudi Arabia',
  },
  ui: {
    enterPrompt: 'Scroll to enter',
    nextProject: 'The walk continues',
    finalProject: 'Final installation',
    progressOf: 'of',
  },
  footer: {
    brandLabel: 'Basma Tech',
    legalEntity: 'Basma Tech Solutions. A subsidiary of the Nordbuild group.',
    address: 'Riyadh, Saudi Arabia.',
    contactLabel: 'Contact',
    contactEmail: 'hello@basmatech.sa',
    parentLabel: 'Parent',
    parentName: 'Nordbuild',
    copyright: '2026 Basma Tech. All rights reserved.',
  },
};

export const tour = { ar, en } as const;

export function getTour(lang: Lang): TourCopy {
  return tour[lang];
}
