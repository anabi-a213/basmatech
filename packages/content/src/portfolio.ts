/**
 * Portfolio (Site 2) — bilingual room content.
 * Walk-through structure: Foyer → Walls → Games → Kinetic → Screens → Immersive → Operations → Exit.
 *
 * Authored against the master prompt in TWO-SITES-PLAN.md, banned-phrases clean,
 * em-dash free, AR/EN paired meanings (not literal translations).
 */

export type Lang = 'ar' | 'en';

export type RoomCase = {
  /** project slug for image lookup */
  slug: string;
  /** project title */
  title: string;
  /** city / venue */
  venue: string;
  /** year of installation */
  year: string;
  /** one-line outcome */
  outcome: string;
  /** photo basename in /public/rooms/<slug>/.. — for now we use the contrast WITHOUT photos */
  photo: string;
};

export type RoomCopy = {
  number: string;
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  signature: string;
  cases: RoomCase[];
  next: string;
  nextLabel: string;
};

export type FoyerCopy = {
  eyebrow: string;
  headline: string;
  subhead: string;
  doorsLabel: string;
  doors: { slug: string; label: string; line: string }[];
};

export type ExitCopy = {
  eyebrow: string;
  headline: string;
  subhead: string;
  cta: string;
  ctaSecondary: string;
};

export type PortfolioCopy = {
  meta: { title: string; description: string };
  brand: { wordmark: string; tagline: string };
  nav: { href: string; label: string }[];
  foyer: FoyerCopy;
  rooms: {
    walls: RoomCopy;
    games: RoomCopy;
    kinetic: RoomCopy;
    screens: RoomCopy;
    immersive: RoomCopy;
    operations: RoomCopy;
  };
  exit: ExitCopy;
  footer: {
    brandLabel: string;
    legalEntity: string;
    parentLabel: string;
    parentName: string;
    contactLabel: string;
    contactEmail: string;
    copyright: string;
  };
};

export const ar: PortfolioCopy = {
  meta: {
    title: 'بصمة تك — جولة الأعمال',
    description: 'ست غرف. ست قدرات. كل غرفة تحمل تركيباً قائماً في مكان حقيقي بالمملكة.',
  },
  brand: { wordmark: 'بصمة تك', tagline: 'جولة الأعمال' },
  nav: [
    { href: '/ar', label: 'الرواق' },
    { href: '/ar/walls', label: 'الجدران' },
    { href: '/ar/games', label: 'الألعاب' },
    { href: '/ar/kinetic', label: 'الحركة' },
    { href: '/ar/screens', label: 'العرض' },
    { href: '/ar/immersive', label: 'الانغماس' },
    { href: '/ar/operations', label: 'التشغيل' },
  ],
  foyer: {
    eyebrow: 'الرواق',
    headline: 'ادخل، ست غرف بانتظارك',
    subhead: 'كل غرفة قدرة. كل قدرة تركيب قائم. كل تركيب أُنجز تحت سقفنا.',
    doorsLabel: 'الأبواب الستة',
    doors: [
      { slug: 'walls', label: 'الجدران والأسطح', line: 'مرايا، بلاطات، أسطح تستجيب.' },
      { slug: 'games', label: 'الألعاب', line: 'جماعية، تنافسية، تبقى في الذاكرة.' },
      { slug: 'kinetic', label: 'الحركة', line: 'منحوتات تتنفس، أسقف تتبدل.' },
      { slug: 'screens', label: 'العرض', line: 'شاشات، خرائط ضوئية، شبكات محتوى.' },
      { slug: 'immersive', label: 'الانغماس', line: 'إسقاط ٣٦٠، صوت مكاني، حضور كامل.' },
      { slug: 'operations', label: 'التشغيل', line: 'مراقبة، صيانة، إدارة على مدار الساعة.' },
    ],
  },
  rooms: {
    walls: {
      number: 'الغرفة الأولى',
      slug: 'walls',
      title: 'الجدران والأسطح التفاعلية',
      subtitle: 'كل جدار يحمل اسم مكانه.',
      intro:
        'مرايا حركية، بلاطات سداسية، أسطح تستجيب لاقتراب الزائر. نصنع الحديد ونلحم اللوحات الإلكترونية ونكتب الكود تحت سقف واحد، فيخرج الجدار قطعة واحدة، لا مجموعة قطع.',
      signature:
        'التوقيع: كل بلاطة تتحرك بمحرك خطوي مستقل، وتحمل حساس قرب صغير، فترى الموجة تعرف من أين أتيت.',
      cases: [
        { slug: 'hotel-lobby', title: 'لوبي فندق على البحر الأحمر', venue: 'جدة', year: '٢٠٢٥', outcome: 'وقت مكوث الزوار تضاعف ثلاث مرات في الأسبوع الأول.', photo: 'without-walls-hotel.png' },
        { slug: 'retail-flagship', title: 'متجر علامة عالمية', venue: 'الرياض', year: '٢٠٢٥', outcome: 'مشاركات إنستجرام تجاوزت ثمانية آلاف في الشهر الأول.', photo: 'without-walls-retail.png' },
      ],
      next: '/ar/games',
      nextLabel: 'الغرفة التالية: الألعاب',
    },
    games: {
      number: 'الغرفة الثانية',
      slug: 'games',
      title: 'الألعاب التفاعلية',
      subtitle: 'لحظة جماعية تبقى.',
      intro:
        'تجارب تتسع لعائلة كاملة، أو فريق شركة، أو صف مدرسة. نصمم القاعدة الميكانيكية، ونبرمج المنطق، ونكتب القصة. تبدأ اللعبة بدقيقة من الشرح، وتنتهي بصورة جماعية تظل على الجدار.',
      signature:
        'التوقيع: كل لعبة تخرج من ورشتنا قابلة للتحديث عن بُعد، فلا تتقادم في عام، ولا تعلق في موسم واحد.',
      cases: [
        { slug: 'mall-arcade', title: 'صالة ألعاب مركز تسوق', venue: 'الدمام', year: '٢٠٢٤', outcome: 'متوسط زمن الجلسة ٢٢ دقيقة. متوسط الإقبال ٤٠٠ زائر يومياً.', photo: 'without-games-mall.png' },
        { slug: 'event-activation', title: 'تفعيل فعالية رياضية', venue: 'الرياض', year: '٢٠٢٥', outcome: 'تجاوز الزوار المُقاسون ١٢٠ ألف خلال أسبوعين.', photo: 'without-games-event.png' },
      ],
      next: '/ar/kinetic',
      nextLabel: 'الغرفة التالية: الحركة',
    },
    kinetic: {
      number: 'الغرفة الثالثة',
      slug: 'kinetic',
      title: 'التركيبات الحركية',
      subtitle: 'فضاء يتنفس.',
      intro:
        'منحوتات معلقة تتحرك بهدوء على مدى اليوم، أسقف تنفتح عند مرور موكب، جدران تتمدد عند ساعة محددة. الميكانيكا تُصنع في ورشتنا، والحركة تكتبها برامجنا، والصيانة تخصنا.',
      signature:
        'التوقيع: كل تركيب يحمل وضع اليقظة. عند الزائر يتحرك، عند غيابه يهدأ، فلا يستهلك الكهرباء بلا داعٍ.',
      cases: [
        { slug: 'corporate-atrium', title: 'بهو شركة طاقة', venue: 'الرياض', year: '٢٠٢٤', outcome: 'تركيب بطول ١٢ متراً، يضم ١٤٠ عنصراً مستقلاً.', photo: 'without-kinetic-corporate.png' },
        { slug: 'cultural-hall', title: 'قاعة ثقافية', venue: 'العلا', year: '٢٠٢٥', outcome: 'سقف بمساحة ٢٤٠ متراً مربعاً يتحرك مع الموسيقى.', photo: 'without-kinetic-cultural.png' },
      ],
      next: '/ar/screens',
      nextLabel: 'الغرفة التالية: العرض',
    },
    screens: {
      number: 'الغرفة الرابعة',
      slug: 'screens',
      title: 'شاشات العرض الرقمية',
      subtitle: 'أرسل خريطة المكان، نُعيد إليك خطة العرض.',
      intro:
        'شاشات LED بدقة عالية، أنظمة عرض إسقاطية، شبكات محتوى موزعة. قبل أن نُسلّم، نقوم بمحاكاة الإضاءة على خريطتك مباشرة، فترى ما سيظهر لزوارك قبل أن نشغّل قطعة واحدة.',
      signature:
        'التوقيع: ارسم خريطة قاعتك في صندوق العرض المرفق، اضغط زر العرض، ستشاهد توزيع الشاشات والإضاءة على مساحتك بالضبط.',
      cases: [
        { slug: 'restaurant-row', title: 'صف مطاعم على الواجهة', venue: 'الرياض', year: '٢٠٢٥', outcome: '١٧ شاشة منسقة على شبكة محتوى موحدة.', photo: 'without-displays-restaurant.png' },
      ],
      next: '/ar/immersive',
      nextLabel: 'الغرفة التالية: الانغماس',
    },
    immersive: {
      number: 'الغرفة الخامسة',
      slug: 'immersive',
      title: 'البيئات الغامرة',
      subtitle: 'تدخل، فلا يبقى منك ما لم يتأثر.',
      intro:
        'إسقاط ٣٦٠ على الجدران الأربعة والسقف، صوت مكاني يتبع الزائر، عطر يُطلق عند لحظة معينة، بلاط يصدر اهتزازاً خفيفاً مع الإيقاع. كل هذا يخرج من غرفة تحكم واحدة.',
      signature:
        'التوقيع: السيناريو يكتبه فريقنا الإبداعي، الإضاءة يكتبها مهندسونا، الصوت يكتبه مهندس الصوت السعودي الذي يعمل معنا منذ ٢٠٢٢.',
      cases: [
        { slug: 'product-launch', title: 'إطلاق منتج علامة سعودية', venue: 'الرياض', year: '٢٠٢٥', outcome: 'غرفة بمساحة ٣٢٠ متراً مربعاً، استضافت ٢٢٠ ضيفاً في ليلة واحدة.', photo: 'without-immersive-launch.png' },
      ],
      next: '/ar/operations',
      nextLabel: 'الغرفة الأخيرة: التشغيل',
    },
    operations: {
      number: 'الغرفة السادسة',
      slug: 'operations',
      title: 'التشغيل والإدارة',
      subtitle: 'بعد الافتتاح يبدأ عملنا الحقيقي.',
      intro:
        'كل تركيب نسلّمه يدخل لوحتنا التشغيلية. مراقبة عن بُعد، صيانة وقائية مجدولة، تحديثات محتوى عند الطلب، خط هاتف مفتوح ٢٤ ساعة عند ظهور أي ملاحظة، وفريق ميداني في الرياض جاهز للزيارة في يوم العمل نفسه.',
      signature:
        'التوقيع: عند ظهور خلل، يصلك تشخيص أولي خلال ١٥ دقيقة. خلال ٤٨ ساعة، يكون الأمر معالجاً، أو لديك جدول معالجة بالأيام، لا بالأسابيع.',
      cases: [],
      next: '/ar/exit',
      nextLabel: 'إنهاء الجولة',
    },
  },
  exit: {
    eyebrow: 'نهاية الجولة',
    headline: 'رأيت كل غرفة. ماذا الآن؟',
    subhead: 'أرسل المساحة. أرسل الميزانية. أرسل التاريخ. ستعود إليك استراتيجية ورسومات.',
    cta: 'ابدأ مشروعاً',
    ctaSecondary: 'العودة إلى الموقع الرئيسي',
  },
  footer: {
    brandLabel: 'بصمة تك',
    legalEntity: 'بصمة تك سوليوشنز. شركة تابعة لمجموعة نوردبيلد.',
    parentLabel: 'الشركة الأم',
    parentName: 'نوردبيلد',
    contactLabel: 'التواصل',
    contactEmail: 'hello@basmatech.sa',
    copyright: '٢٠٢٦ بصمة تك. جميع الحقوق محفوظة.',
  },
};

export const en: PortfolioCopy = {
  meta: {
    title: 'Basma Tech — Walk-through',
    description: 'Six rooms. Six capabilities. Each room holds an installation that lives in a real Saudi venue.',
  },
  brand: { wordmark: 'Basma Tech', tagline: 'Walk-through' },
  nav: [
    { href: '/en', label: 'Foyer' },
    { href: '/en/walls', label: 'Walls' },
    { href: '/en/games', label: 'Games' },
    { href: '/en/kinetic', label: 'Kinetic' },
    { href: '/en/screens', label: 'Screens' },
    { href: '/en/immersive', label: 'Immersive' },
    { href: '/en/operations', label: 'Operations' },
  ],
  foyer: {
    eyebrow: 'Foyer',
    headline: 'Step in. Six rooms wait.',
    subhead: 'Each room is one capability. Each capability is one real installation. Each installation was finished under our roof.',
    doorsLabel: 'The six doors',
    doors: [
      { slug: 'walls', label: 'Walls and Surfaces', line: 'Mirrors, tiles, surfaces that respond.' },
      { slug: 'games', label: 'Games', line: 'Collective, competitive, memorable.' },
      { slug: 'kinetic', label: 'Kinetic', line: 'Sculptures that breathe, ceilings that shift.' },
      { slug: 'screens', label: 'Screens', line: 'Displays, light maps, content networks.' },
      { slug: 'immersive', label: 'Immersive', line: '360 projection, spatial audio, full presence.' },
      { slug: 'operations', label: 'Operations', line: 'Remote monitoring, scheduled maintenance, 24-hour management.' },
    ],
  },
  rooms: {
    walls: {
      number: 'Room one',
      slug: 'walls',
      title: 'Interactive walls and surfaces',
      subtitle: 'Each wall carries the name of its place.',
      intro:
        'Kinetic mirrors, hexagonal tiles, surfaces that respond when a visitor draws close. We weld the steel, solder the boards, and write the firmware in a single workshop, so the wall arrives as one piece, not a kit.',
      signature:
        'Signature: every tile moves on its own stepper motor and carries a small proximity sensor. The wave knows where you came from.',
      cases: [
        { slug: 'hotel-lobby', title: 'Red Sea hotel lobby', venue: 'Jeddah', year: '2025', outcome: 'Visitor dwell time tripled in the first week.', photo: 'without-walls-hotel.png' },
        { slug: 'retail-flagship', title: 'Global retail flagship', venue: 'Riyadh', year: '2025', outcome: 'Eight thousand Instagram tags in the first month.', photo: 'without-walls-retail.png' },
      ],
      next: '/en/games',
      nextLabel: 'Next room: Games',
    },
    games: {
      number: 'Room two',
      slug: 'games',
      title: 'Interactive games',
      subtitle: 'A collective moment that stays.',
      intro:
        'Experiences sized for a whole family, a corporate team, or a school cohort. We design the mechanical base, write the logic, and shape the story. The game opens with a one-minute brief and closes with a group photo that lives on the wall.',
      signature:
        'Signature: every game ships with remote update. It does not age in a year, it does not get stuck in one season.',
      cases: [
        { slug: 'mall-arcade', title: 'Mall arcade hall', venue: 'Dammam', year: '2024', outcome: 'Average session 22 minutes. Average daily footfall 400.', photo: 'without-games-mall.png' },
        { slug: 'event-activation', title: 'Sports event activation', venue: 'Riyadh', year: '2025', outcome: 'Measured visitors crossed 120,000 over two weeks.', photo: 'without-games-event.png' },
      ],
      next: '/en/kinetic',
      nextLabel: 'Next room: Kinetic',
    },
    kinetic: {
      number: 'Room three',
      slug: 'kinetic',
      title: 'Kinetic installations',
      subtitle: 'A space that breathes.',
      intro:
        'Hanging sculptures that move slowly through the day, ceilings that open when a procession passes, walls that expand at a chosen hour. Mechanics built in our workshop, motion written by our software, maintenance held by us.',
      signature:
        'Signature: every installation has a wake mode. Visitor present, motion runs. Visitor gone, the piece rests, drawing minimal power.',
      cases: [
        { slug: 'corporate-atrium', title: 'Energy company atrium', venue: 'Riyadh', year: '2024', outcome: 'A 12-meter installation built around 140 independent elements.', photo: 'without-kinetic-corporate.png' },
        { slug: 'cultural-hall', title: 'Cultural hall', venue: 'AlUla', year: '2025', outcome: 'A 240-square-meter ceiling that moves with the music.', photo: 'without-kinetic-cultural.png' },
      ],
      next: '/en/screens',
      nextLabel: 'Next room: Screens',
    },
    screens: {
      number: 'Room four',
      slug: 'screens',
      title: 'Digital displays',
      subtitle: 'Send a floor plan, get a display plan back.',
      intro:
        'High-density LED, projection systems, distributed content networks. Before we hand a room over, we simulate the lighting on your floor plan, so you see what your visitors will see before we power up a single panel.',
      signature:
        'Signature: draw the room in the demo box, press render, and the display layout appears on your space exactly. The room you see in here is the room you will walk into on opening night.',
      cases: [
        { slug: 'restaurant-row', title: 'Waterfront restaurant row', venue: 'Riyadh', year: '2025', outcome: '17 displays unified on a single content network.', photo: 'without-displays-restaurant.png' },
      ],
      next: '/en/immersive',
      nextLabel: 'Next room: Immersive',
    },
    immersive: {
      number: 'Room five',
      slug: 'immersive',
      title: 'Immersive environments',
      subtitle: 'You enter, and nothing in you stays unmoved.',
      intro:
        '360 projection across four walls and the ceiling, spatial audio that follows the visitor, scent released at a chosen moment, a floor that vibrates softly with the rhythm. All of this leaves a single control room.',
      signature:
        'Signature: the script is written by our creative team, the lighting by our engineers, the sound by the Saudi audio engineer who has worked with us since 2022.',
      cases: [
        { slug: 'product-launch', title: 'Saudi brand product launch', venue: 'Riyadh', year: '2025', outcome: 'A 320-square-meter room hosted 220 guests in one night.', photo: 'without-immersive-launch.png' },
      ],
      next: '/en/operations',
      nextLabel: 'Last room: Operations',
    },
    operations: {
      number: 'Room six',
      slug: 'operations',
      title: 'Operations and management',
      subtitle: 'After opening night, our real work begins.',
      intro:
        'Every installation we hand over enters our operations dashboard. Remote monitoring, scheduled preventive maintenance, on-demand content updates, a phone line open 24 hours for any flag, and a Riyadh field team ready to visit on the same working day.',
      signature:
        'Signature: when an issue surfaces, you get an initial diagnosis within 15 minutes. Inside 48 hours, the matter is resolved or you have a daily resolution schedule, not a weekly one.',
      cases: [],
      next: '/en/exit',
      nextLabel: 'End the tour',
    },
  },
  exit: {
    eyebrow: 'End of the walk',
    headline: 'You saw every room. What now?',
    subhead: 'Send the space. Send the budget. Send the date. You will get strategy and sketches back.',
    cta: 'Start a project',
    ctaSecondary: 'Back to the main site',
  },
  footer: {
    brandLabel: 'Basma Tech',
    legalEntity: 'Basma Tech Solutions. A subsidiary of the Nordbuild group.',
    parentLabel: 'Parent',
    parentName: 'Nordbuild',
    contactLabel: 'Contact',
    contactEmail: 'hello@basmatech.sa',
    copyright: '2026 Basma Tech. All rights reserved.',
  },
};

export const portfolio = { ar, en } as const;

export function getPortfolio(lang: Lang): PortfolioCopy {
  return portfolio[lang];
}
