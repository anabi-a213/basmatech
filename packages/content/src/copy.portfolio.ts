/**
 * Site 2 (portfolio walking-tour) bilingual copy. Same voice rules as
 * copy.home.ts. Paired AR/EN meanings, never literal translations.
 *
 * 11 phases: foyer + 9 projects (one per BRIEF.md category, with two each
 * for Walls/Games/Kinetic and one for Screens/Immersive/Operations) +
 * closing.
 */

import type { Lang } from './copy.home';

export type ProjectCopy = {
  number: string;
  slug: string;
  category: 'walls' | 'games' | 'kinetic' | 'screens' | 'immersive' | 'operations';
  categoryLabel: string;
  title: string;
  subtitle: string;
  city: string;
  year: string;
  outcome: string;
  stats: { label: string; value: string }[];
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
  body?: string;
  cta: string;
  ctaSecondary: string;
  bandLabel: string;
};

export type PortfolioCopy = {
  meta: { title: string; description: string };
  brand: { wordmark: string };
  nav: { href: string; label: string }[];
  foyer: FoyerCopy;
  projects: ProjectCopy[];
  closing: ClosingCopy;
  ui: { progressOf: string; nextProject: string; finalProject: string };
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

const ar: PortfolioCopy = {
  meta: {
    title: 'بصمة تك. جولة الأعمال.',
    description: 'تسعة تركيبات حقيقية في مدن سعودية. تَمشي من واحد إلى الآخر، بلا حواجز عرض.',
  },
  brand: { wordmark: 'بصمة تك' },
  nav: [
    { href: 'https://basmatech.sa/ar', label: 'الموقع الرئيسي' },
  ],
  foyer: {
    eyebrowOverline: 'الجولة',
    eyebrow: 'تسعة تركيبات. سبع مدن. سقف واحد.',
    headline: 'ادخل. سترى عملنا، ليس صور عملنا.',
    subhead: 'كل تركيب هنا يَعمل اليوم. الزيارة تأخذ خمس دقائق.',
    scrollHint: 'اسحب للأسفل لتبدأ',
  },
  projects: [
    {
      number: '٠١',
      slug: 'tour-01-hotel-jeddah',
      category: 'walls',
      categoryLabel: 'جدران تفاعلية',
      title: 'لوبي فندق على البحر الأحمر',
      subtitle: 'كل بلاطة تَحمل اسم زائرها.',
      city: 'جدة',
      year: '٢٠٢٥',
      outcome: 'وقت مكوث الزائر تَضاعف ثلاث مرات في الأسبوع الأول.',
      stats: [
        { label: 'البلاطات', value: '٣١٢' },
        { label: 'المحركات', value: '٢٦٤' },
        { label: 'الإضاءة', value: 'سبع طبقات' },
        { label: 'التشغيل', value: '١٢ أسبوعاً' },
      ],
    },
    {
      number: '٠٢',
      slug: 'tour-02-retail-riyadh',
      category: 'walls',
      categoryLabel: 'جدران تفاعلية',
      title: 'متجر علامة عالمية',
      subtitle: 'مرايا تَتذكّر من اقترب.',
      city: 'الرياض',
      year: '٢٠٢٥',
      outcome: 'مشاركات إنستجرام تَجاوزت ثمانية آلاف في الشهر الأول.',
      stats: [
        { label: 'المرايا', value: '٢٥٦' },
        { label: 'الحساسات', value: '٢٤' },
        { label: 'العرض', value: 'سبعة أمتار' },
        { label: 'التشغيل', value: 'تسعة أسابيع' },
      ],
    },
    {
      number: '٠٣',
      slug: 'tour-03-arena-dammam',
      category: 'games',
      categoryLabel: 'ألعاب تفاعلية',
      title: 'صالة ألعاب تنافسية',
      subtitle: 'الفريقان يَعرفان من سَبَق إلى البلاطة.',
      city: 'الدمام',
      year: '٢٠٢٤',
      outcome: 'متوسط الجلسة ٢٢ دقيقة. متوسط الإقبال ٤٠٠ زائر يومياً.',
      stats: [
        { label: 'البلاطات', value: '٥٤٠' },
        { label: 'لاعبون', value: '٣٢ معاً' },
        { label: 'تحديثات', value: 'عن بُعد' },
        { label: 'التشغيل', value: '١٤ أسبوعاً' },
      ],
    },
    {
      number: '٠٤',
      slug: 'tour-04-stadium-riyadh',
      category: 'games',
      categoryLabel: 'ألعاب تفاعلية',
      title: 'تفعيل فعالية رياضية',
      subtitle: 'باب يَفتح على ملعب صغير.',
      city: 'الرياض',
      year: '٢٠٢٥',
      outcome: 'الزوار المُقاسون تَجاوزوا ١٢٠ ألفاً خلال أسبوعين.',
      stats: [
        { label: 'الحضور', value: '١٢٠ ألف' },
        { label: 'الفترة', value: 'أسبوعان' },
        { label: 'الفريق', value: 'ثلاثة' },
        { label: 'التشغيل', value: '٢٤ ساعة' },
      ],
    },
    {
      number: '٠٥',
      slug: 'tour-05-atrium-riyadh',
      category: 'kinetic',
      categoryLabel: 'تركيب حركي',
      title: 'بهو شركة طاقة',
      subtitle: 'سقف يَتنفّس مع الضوء.',
      city: 'الرياض',
      year: '٢٠٢٤',
      outcome: 'تركيب ١٢ متراً. ١٤٠ عنصراً مستقلاً. حركة لا تَتكرّر يومياً.',
      stats: [
        { label: 'العناصر', value: '١٤٠' },
        { label: 'الطول', value: '١٢ متر' },
        { label: 'الوزن', value: '٣٢٠ كغ' },
        { label: 'التشغيل', value: '١٦ أسبوعاً' },
      ],
    },
    {
      number: '٠٦',
      slug: 'tour-06-cultural-alula',
      category: 'kinetic',
      categoryLabel: 'تركيب حركي',
      title: 'قاعة ثقافية في العلا',
      subtitle: 'السقف يَستمع للموسيقى أولاً.',
      city: 'العلا',
      year: '٢٠٢٥',
      outcome: 'سقف ٢٤٠ متراً مربعاً يَتحرّك مع الموسيقى الحية.',
      stats: [
        { label: 'المساحة', value: '٢٤٠ م²' },
        { label: 'القنوات', value: 'ثلاث وستون' },
        { label: 'تأخير', value: 'دون ٢٠ مللي' },
        { label: 'التشغيل', value: '١٨ أسبوعاً' },
      ],
    },
    {
      number: '٠٧',
      slug: 'tour-07-plaza-riyadh',
      category: 'screens',
      categoryLabel: 'شاشات وخرائط ضوئية',
      title: 'صف مطاعم على الواجهة',
      subtitle: 'الشاشة تَستجيب للزائر، لا للعكس.',
      city: 'الرياض',
      year: '٢٠٢٥',
      outcome: 'سبع عشرة شاشة. شبكة محتوى واحدة. بلا انقطاع منذ الافتتاح.',
      stats: [
        { label: 'الشاشات', value: '١٧' },
        { label: 'دقة', value: '٢ مم' },
        { label: 'احتياط', value: '4G' },
        { label: 'التشغيل', value: 'ثمانية أسابيع' },
      ],
    },
    {
      number: '٠٨',
      slug: 'tour-08-immersive-riyadh',
      category: 'immersive',
      categoryLabel: 'بيئة غامرة',
      title: 'إطلاق منتج علامة سعودية',
      subtitle: 'الجدار يَختفي. تَبقى الصورة.',
      city: 'الرياض',
      year: '٢٠٢٥',
      outcome: 'غرفة ٣٢٠ متراً مربعاً. ٢٢٠ ضيفاً في ليلة واحدة.',
      stats: [
        { label: 'المساحة', value: '٣٢٠ م²' },
        { label: 'الإسقاط', value: '٣٦٠°' },
        { label: 'الصوت', value: 'مكاني' },
        { label: 'التشغيل', value: '٢٠ أسبوعاً' },
      ],
    },
    {
      number: '٠٩',
      slug: 'tour-09-operations',
      category: 'operations',
      categoryLabel: 'تشغيل وإدارة',
      title: 'محفظة تشغيل لمالك متعدد',
      subtitle: 'تسعة فضاءات تَعمل في الخلفية، بلا انقطاع.',
      city: 'الرياض، جدة، الدمام',
      year: '٢٠٢٥',
      outcome: 'متوسط زمن الاستجابة ١١ دقيقة عبر تسعة تركيبات.',
      stats: [
        { label: 'المواقع', value: 'تسعة' },
        { label: 'العملاء', value: 'أربعة' },
        { label: 'الاستجابة', value: '١١ دقيقة' },
        { label: 'العقد', value: 'سنوي' },
      ],
    },
  ],
  closing: {
    eyebrow: 'نهاية الجولة',
    headline: 'رأيت تسعة. التالي يَحمل اسمك.',
    subhead: 'أرسل المساحة. أرسل الميزانية. أرسل الموعد.',
    body: 'خلال خمسة أيام عمل، تَعود إليك ثلاث لوحات تصميم، وموعد لقاء.',
    cta: 'ابدأ مشروعاً',
    ctaSecondary: 'العودة إلى الموقع الرئيسي',
    bandLabel: 'صُنِع في المملكة العربية السعودية',
  },
  ui: { progressOf: 'من', nextProject: 'الجولة تَكمل', finalProject: 'آخر تركيب' },
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

const en: PortfolioCopy = {
  meta: {
    title: 'Basma Tech. The Tour.',
    description: 'Nine real installations in Saudi cities. Walk from one to the next, no gates between rooms.',
  },
  brand: { wordmark: 'Basma Tech' },
  nav: [
    { href: 'https://basmatech.sa/en', label: 'Main site' },
  ],
  foyer: {
    eyebrowOverline: 'The tour',
    eyebrow: 'Nine installations. Seven cities. One roof.',
    headline: 'Step in. You will see our work, not pictures of our work.',
    subhead: 'Every installation here runs today. The walk takes five minutes.',
    scrollHint: 'Scroll to begin',
  },
  projects: [
    {
      number: '01',
      slug: 'tour-01-hotel-jeddah',
      category: 'walls',
      categoryLabel: 'Interactive walls',
      title: 'Red Sea hotel lobby',
      subtitle: 'Each tile carries the name of its visitor.',
      city: 'Jeddah',
      year: '2025',
      outcome: 'Visitor dwell time tripled in the first week.',
      stats: [
        { label: 'Tiles', value: '312' },
        { label: 'Motors', value: '264' },
        { label: 'Light layers', value: '7' },
        { label: 'Lead time', value: '12 weeks' },
      ],
    },
    {
      number: '02',
      slug: 'tour-02-retail-riyadh',
      category: 'walls',
      categoryLabel: 'Interactive walls',
      title: 'Global retail flagship',
      subtitle: 'Mirrors that remember who came near.',
      city: 'Riyadh',
      year: '2025',
      outcome: 'Eight thousand visitor-tagged Instagram posts in the first month.',
      stats: [
        { label: 'Mirrors', value: '256' },
        { label: 'Sensors', value: '24' },
        { label: 'Width', value: '7 meters' },
        { label: 'Lead time', value: '9 weeks' },
      ],
    },
    {
      number: '03',
      slug: 'tour-03-arena-dammam',
      category: 'games',
      categoryLabel: 'Interactive games',
      title: 'Competitive game arena',
      subtitle: 'The two teams know who reached the tile first.',
      city: 'Dammam',
      year: '2024',
      outcome: 'Average session 22 minutes. Average daily footfall 400.',
      stats: [
        { label: 'Tiles', value: '540' },
        { label: 'Co-players', value: '32' },
        { label: 'Updates', value: 'Remote' },
        { label: 'Lead time', value: '14 weeks' },
      ],
    },
    {
      number: '04',
      slug: 'tour-04-stadium-riyadh',
      category: 'games',
      categoryLabel: 'Interactive games',
      title: 'Stadium activation pavilion',
      subtitle: 'A door that opens onto a small playing field.',
      city: 'Riyadh',
      year: '2025',
      outcome: 'Measured visitors crossed 120,000 over a two-week run.',
      stats: [
        { label: 'Visitors', value: '120K' },
        { label: 'Run', value: '2 weeks' },
        { label: 'Crew', value: '3 ops' },
        { label: 'Live', value: '24h' },
      ],
    },
    {
      number: '05',
      slug: 'tour-05-atrium-riyadh',
      category: 'kinetic',
      categoryLabel: 'Kinetic installation',
      title: 'Energy company atrium',
      subtitle: 'A ceiling that breathes with the daylight.',
      city: 'Riyadh',
      year: '2024',
      outcome: 'A 12-meter installation. 140 independent elements. Motion that does not repeat in a day.',
      stats: [
        { label: 'Elements', value: '140' },
        { label: 'Length', value: '12 m' },
        { label: 'Mass', value: '320 kg' },
        { label: 'Lead time', value: '16 weeks' },
      ],
    },
    {
      number: '06',
      slug: 'tour-06-cultural-alula',
      category: 'kinetic',
      categoryLabel: 'Kinetic installation',
      title: 'AlUla cultural hall',
      subtitle: 'The ceiling listens to the music first.',
      city: 'AlUla',
      year: '2025',
      outcome: 'A 240-square-meter ceiling that moves with live music.',
      stats: [
        { label: 'Area', value: '240 m²' },
        { label: 'Channels', value: '63' },
        { label: 'Latency', value: 'Below 20 ms' },
        { label: 'Lead time', value: '18 weeks' },
      ],
    },
    {
      number: '07',
      slug: 'tour-07-plaza-riyadh',
      category: 'screens',
      categoryLabel: 'Screens and light maps',
      title: 'Waterfront restaurant row',
      subtitle: 'The screen answers the visitor, not the other way round.',
      city: 'Riyadh',
      year: '2025',
      outcome: 'Seventeen displays. One content network. No downtime since opening.',
      stats: [
        { label: 'Screens', value: '17' },
        { label: 'Pitch', value: '2 mm' },
        { label: 'Failover', value: '4G' },
        { label: 'Lead time', value: '8 weeks' },
      ],
    },
    {
      number: '08',
      slug: 'tour-08-immersive-riyadh',
      category: 'immersive',
      categoryLabel: 'Immersive room',
      title: 'Saudi brand product launch',
      subtitle: 'The wall disappears. The image stays.',
      city: 'Riyadh',
      year: '2025',
      outcome: 'A 320-square-meter room. 220 guests in one night.',
      stats: [
        { label: 'Area', value: '320 m²' },
        { label: 'Projection', value: '360°' },
        { label: 'Audio', value: 'Spatial' },
        { label: 'Lead time', value: '20 weeks' },
      ],
    },
    {
      number: '09',
      slug: 'tour-09-operations',
      category: 'operations',
      categoryLabel: 'Operations and management',
      title: 'Multi-site operations portfolio',
      subtitle: 'Nine spaces running in the background, without a pause.',
      city: 'Riyadh, Jeddah, Dammam',
      year: '2025',
      outcome: 'Average response time 11 minutes across nine installations.',
      stats: [
        { label: 'Sites', value: '9' },
        { label: 'Owners', value: '4' },
        { label: 'Response', value: '11 min' },
        { label: 'Term', value: 'Annual' },
      ],
    },
  ],
  closing: {
    eyebrow: 'End of the walk',
    headline: 'You saw nine. The next one carries your name.',
    subhead: 'Send the space. Send the budget. Send the date.',
    body: 'Within five working days, you receive three concept boards back and a meeting on the calendar.',
    cta: 'Start a project',
    ctaSecondary: 'Back to main site',
    bandLabel: 'Made in Saudi Arabia',
  },
  ui: { progressOf: 'of', nextProject: 'The walk continues', finalProject: 'Final installation' },
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

export const portfolio = { ar, en } as const;

export function getPortfolioCopy(lang: Lang): PortfolioCopy {
  return portfolio[lang];
}
