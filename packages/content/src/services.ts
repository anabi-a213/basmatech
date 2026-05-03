/**
 * Per-service detail pages — bilingual data shape consumed by
 * apps/main/src/app/[lang]/services/[slug]/page.tsx.
 *
 * Each service mirrors the 6 capabilities but goes deeper:
 *   intro paragraph, 4-point process, materials, signature detail,
 *   typical scale, and a reference case (matches Site 2 portfolio rooms).
 */

export type Lang = 'ar' | 'en';

export type ServiceSlug = 'walls' | 'games' | 'kinetic' | 'displays' | 'immersive' | 'operations';

export type ServiceCopy = {
  slug: ServiceSlug;
  number: string;
  eyebrow: string;
  title: string;
  tagline: string;
  intro: string;
  /** "How we ship a project" — exactly four steps */
  steps: { title: string; line: string }[];
  /** Materials / hardware / software that go into a typical project */
  materials: { label: string; line: string }[];
  signature: string;
  scale: { label: string; value: string }[];
  caseStudy: { title: string; venue: string; year: string; outcome: string };
  next: { slug: ServiceSlug; label: string };
};

export type ServicesPageCopy = {
  meta: { title: string; description: string };
  index: {
    eyebrow: string;
    headline: string;
    subhead: string;
    cardCta: string;
  };
  services: Record<ServiceSlug, ServiceCopy>;
};

const ar: ServicesPageCopy = {
  meta: {
    title: 'بصمة تك — الخدمات',
    description: 'ست قدرات. سقف واحد. كل قدرة تكتمل من التصميم إلى التشغيل دون تسليم لمورّد خارجي.',
  },
  index: {
    eyebrow: 'الخدمات الست',
    headline: 'ما الذي نقدمه فعلياً؟',
    subhead: 'لا نسمي الأشياء بأسماء أكبر منها. هذه ست قدرات حقيقية، وبكل واحدة تركيب يعمل في مكان حقيقي.',
    cardCta: 'تفاصيل الخدمة',
  },
  services: {
    walls: {
      slug: 'walls',
      number: '٠١',
      eyebrow: 'الخدمة الأولى',
      title: 'الجدران والأسطح التفاعلية',
      tagline: 'كل جدار يحمل اسم مكانه.',
      intro:
        'مرايا حركية، بلاطات سداسية، أسطح تستجيب للحضور. نصنع الحديد، نلحم اللوحات الإلكترونية، ونكتب الكود تحت سقف واحد، فيخرج الجدار قطعة واحدة، لا مجموعة قطع.',
      steps: [
        { title: 'الزيارة', line: 'نزور الموقع، نقيس الجدار، نلتقط الإضاءة، نلتقي بفريق المكان.' },
        { title: 'التصميم', line: 'ثلاث لوحات تصميم في الأسبوع الأول. اختار واحدة، نكمل التفاصيل.' },
        { title: 'التنفيذ', line: 'كل بلاطة، كل محرك، كل لوحة دائرة، تصدر من ورشتنا في الرياض.' },
        { title: 'التركيب', line: 'نأتي بأنفسنا، لا متعهد فرعي. تشغيل تجريبي، تعديل، تسليم.' },
      ],
      materials: [
        { label: 'البلاطة', line: 'فولاذ مطلي، مرايا مصقولة بدقة، أو أكريليك مصبوب.' },
        { label: 'المحرك', line: 'محركات خطوية NEMA17 بعزم محدد لكل تركيب.' },
        { label: 'الإلكترونيات', line: 'لوحات دوائر مطورة داخلياً، استشعار قرب، اتصال شبكي.' },
        { label: 'البرمجيات', line: 'محرك حركة من تطويرنا، مع وضع يقظة عند غياب الزائر.' },
      ],
      signature:
        'كل بلاطة تحمل حساس قرب صغير. عندما تقترب، تعرف الموجة من أين أتيت، فتتحرك في اتجاهك.',
      scale: [
        { label: 'أصغر تركيب', value: '٤ × ٢ متر' },
        { label: 'أكبر تركيب', value: '١٢ × ٤ متر' },
        { label: 'وقت التنفيذ', value: '٨ إلى ١٢ أسبوعاً' },
      ],
      caseStudy: {
        title: 'لوبي فندق على البحر الأحمر',
        venue: 'جدة',
        year: '٢٠٢٥',
        outcome: 'وقت مكوث الزوار تضاعف ثلاث مرات في الأسبوع الأول.',
      },
      next: { slug: 'games', label: 'الخدمة التالية: الألعاب' },
    },
    games: {
      slug: 'games',
      number: '٠٢',
      eyebrow: 'الخدمة الثانية',
      title: 'الألعاب التفاعلية',
      tagline: 'لحظة جماعية تبقى.',
      intro:
        'تجارب تتسع لعائلة كاملة، أو فريق شركة، أو صف مدرسة. نصمم القاعدة الميكانيكية، ونبرمج المنطق، ونكتب القصة. تبدأ اللعبة بدقيقة من الشرح وتنتهي بصورة جماعية تظل على الجدار.',
      steps: [
        { title: 'القصة', line: 'نتحدث مع المسوّق والفريق التشغيلي ونكتب سيناريو اللعبة.' },
        { title: 'النموذج', line: 'نموذج أولي يشتغل خلال أسبوعين لاختبار آلية اللعب.' },
        { title: 'البناء', line: 'الميكانيكا والإلكترونيات والقاعدة الجمالية كلها داخلياً.' },
        { title: 'التدريب', line: 'يومان لتدريب الفريق التشغيلي، ودليل تشغيل مكتوب بالعربي.' },
      ],
      materials: [
        { label: 'القاعدة', line: 'هيكل فولاذي مغطى بمواد سهلة التنظيف ومقاومة للخدش.' },
        { label: 'الحساسات', line: 'كاميرات عمق، حساسات وزن، أو شاشات لمسية بحسب اللعبة.' },
        { label: 'الإلكترونيات', line: 'وحدة تحكم مركزية، اتصال سحابي للتحديثات والتقارير.' },
        { label: 'البرمجيات', line: 'محرك ألعاب من تطويرنا، إمكانية تحديث المحتوى عن بُعد.' },
      ],
      signature:
        'كل لعبة تخرج من ورشتنا قابلة للتحديث عن بُعد. لا تتقادم في عام، ولا تعلق في موسم واحد.',
      scale: [
        { label: 'أصغر لعبة', value: '٤ لاعبين' },
        { label: 'أكبر لعبة', value: '٣٢ لاعباً متزامناً' },
        { label: 'وقت التنفيذ', value: '١٠ إلى ١٤ أسبوعاً' },
      ],
      caseStudy: {
        title: 'صالة ألعاب مركز تسوق',
        venue: 'الدمام',
        year: '٢٠٢٤',
        outcome: 'متوسط زمن الجلسة ٢٢ دقيقة. متوسط الإقبال ٤٠٠ زائر يومياً.',
      },
      next: { slug: 'kinetic', label: 'الخدمة التالية: الحركة' },
    },
    kinetic: {
      slug: 'kinetic',
      number: '٠٣',
      eyebrow: 'الخدمة الثالثة',
      title: 'التركيبات الحركية',
      tagline: 'فضاء يتنفس.',
      intro:
        'منحوتات معلقة تتحرك بهدوء على مدى اليوم، أسقف تنفتح عند مرور موكب، جدران تتمدد عند ساعة محددة. الميكانيكا تُصنع في ورشتنا، والحركة تكتبها برامجنا.',
      steps: [
        { title: 'القراءة', line: 'نقرأ المساحة، نتفهم النشاط اليومي، نختار اللحظات الحرجة.' },
        { title: 'الكوريغرافيا', line: 'كل تركيب له جدول حركة بحسب وقت اليوم وعدد الزوار.' },
        { title: 'البناء', line: 'تصنيع داخلي، اختبار حركة لمدة ٧٢ ساعة قبل الشحن.' },
        { title: 'التركيب', line: 'تركيب على ارتفاع، اختبار حمل، تشغيل تجريبي مع المالك.' },
      ],
      materials: [
        { label: 'الهيكل', line: 'فولاذ هندسي بمواصفات حمل محسوبة لكل تركيب على حدة.' },
        { label: 'المحركات', line: 'محركات خطوية أو سيرفو، اختيار يعتمد على نوع الحركة.' },
        { label: 'الإلكترونيات', line: 'تحكم موزع، حساسات وزن، اتصال شبكي للمراقبة.' },
        { label: 'البرمجيات', line: 'محرك كوريغرافيا، وضع يقظة عند الحضور، تقارير يومية.' },
      ],
      signature:
        'كل تركيب يحمل وضع اليقظة. عند الزائر يتحرك، عند غيابه يهدأ، فلا يستهلك الكهرباء بلا داعٍ.',
      scale: [
        { label: 'أصغر تركيب', value: '٤ عناصر مستقلة' },
        { label: 'أكبر تركيب', value: '١٤٠ عنصراً متزامناً' },
        { label: 'وقت التنفيذ', value: '١٢ إلى ١٨ أسبوعاً' },
      ],
      caseStudy: {
        title: 'بهو شركة طاقة',
        venue: 'الرياض',
        year: '٢٠٢٤',
        outcome: 'تركيب بطول ١٢ متراً، يضم ١٤٠ عنصراً مستقلاً.',
      },
      next: { slug: 'displays', label: 'الخدمة التالية: العرض' },
    },
    displays: {
      slug: 'displays',
      number: '٠٤',
      eyebrow: 'الخدمة الرابعة',
      title: 'شاشات العرض الرقمية',
      tagline: 'أرسل خريطة، نُعيد إليك خطة عرض.',
      intro:
        'شاشات LED بدقة عالية، أنظمة عرض إسقاطية، شبكات محتوى موزعة. قبل أن نُسلّم، نقوم بمحاكاة الإضاءة على خريطتك مباشرة، فترى ما سيظهر لزوارك قبل أن نشغّل قطعة واحدة.',
      steps: [
        { title: 'الخريطة', line: 'ترسل خريطة المساحة، نُجري محاكاة، نستعرض النتائج.' },
        { title: 'الاختيار', line: 'تختار من ثلاث خطط عرض، كل خطة بميزانيتها الخاصة.' },
        { title: 'التركيب', line: 'تركيب الشاشات والإسقاط والشبكة، اختبار تكامل.' },
        { title: 'المحتوى', line: 'كتابة المحتوى الافتتاحي، تدريب الفريق على إدارة الشبكة.' },
      ],
      materials: [
        { label: 'الشاشات', line: 'LED بنقطة ٢ أو ٣ ملم، أو شاشات ميكرو-LED للمسافات القريبة.' },
        { label: 'الإسقاط', line: 'بروجكتورات ليزر بسطوع ١٢٠٠٠ لومن، عدسات قصيرة المدى.' },
        { label: 'الشبكة', line: 'خادم محتوى مركزي، توزيع IP، نسخ احتياطي ٤G.' },
        { label: 'البرمجيات', line: 'نظام إدارة محتوى من تطويرنا، إحصاءات استخدام وتقارير.' },
      ],
      signature:
        'ارسم خريطة قاعتك في صندوق العرض المرفق، اضغط زر العرض، ستشاهد توزيع الشاشات والإضاءة على مساحتك بالضبط.',
      scale: [
        { label: 'أصغر مشروع', value: '٢ شاشة منسقة' },
        { label: 'أكبر مشروع', value: '١٧ شاشة موزعة' },
        { label: 'وقت التنفيذ', value: '٦ إلى ١٠ أسابيع' },
      ],
      caseStudy: {
        title: 'صف مطاعم على الواجهة',
        venue: 'الرياض',
        year: '٢٠٢٥',
        outcome: '١٧ شاشة منسقة على شبكة محتوى موحدة.',
      },
      next: { slug: 'immersive', label: 'الخدمة التالية: الانغماس' },
    },
    immersive: {
      slug: 'immersive',
      number: '٠٥',
      eyebrow: 'الخدمة الخامسة',
      title: 'البيئات الغامرة',
      tagline: 'تدخل، فلا يبقى منك ما لم يتأثر.',
      intro:
        'إسقاط ٣٦٠ على الجدران الأربعة والسقف، صوت مكاني يتبع الزائر، عطر يُطلق عند لحظة معينة، بلاط يصدر اهتزازاً خفيفاً مع الإيقاع. كل هذا يخرج من غرفة تحكم واحدة.',
      steps: [
        { title: 'السيناريو', line: 'فريقنا الإبداعي يكتب رحلة الزائر دقيقة بدقيقة.' },
        { title: 'البناء', line: 'جدران إسقاط، نظام صوت مكاني، محركات حسية، توزيع عطور.' },
        { title: 'التزامن', line: 'برمجة لحظات التزامن بين الصوت والصورة والاهتزاز والعطر.' },
        { title: 'التشغيل', line: 'فريق ثلاثة أشخاص يدير ٤ جلسات يومياً مع جدول صيانة.' },
      ],
      materials: [
        { label: 'الإسقاط', line: 'بروجكتورات ليزر متعددة، خلط حدود لتغطية ٣٦٠ كاملة.' },
        { label: 'الصوت', line: 'مصفوفة سماعات Dolby Atmos، تتبع موقع الزائر.' },
        { label: 'الحس', line: 'بلاط اهتزاز، ضباب خفيف، توزيع عطور بضغط هواء.' },
        { label: 'البرمجيات', line: 'محرك تجارب من تطويرنا، تحكم بكل الحواس من لوحة واحدة.' },
      ],
      signature:
        'السيناريو يكتبه فريقنا الإبداعي، الإضاءة يكتبها مهندسونا، الصوت يكتبه مهندس الصوت السعودي الذي يعمل معنا منذ ٢٠٢٢.',
      scale: [
        { label: 'أصغر غرفة', value: '٨٠ متراً مربعاً' },
        { label: 'أكبر غرفة', value: '٣٢٠ متراً مربعاً' },
        { label: 'وقت التنفيذ', value: '١٤ إلى ٢٠ أسبوعاً' },
      ],
      caseStudy: {
        title: 'إطلاق منتج علامة سعودية',
        venue: 'الرياض',
        year: '٢٠٢٥',
        outcome: 'غرفة بمساحة ٣٢٠ متراً مربعاً، استضافت ٢٢٠ ضيفاً في ليلة واحدة.',
      },
      next: { slug: 'operations', label: 'الخدمة الأخيرة: التشغيل' },
    },
    operations: {
      slug: 'operations',
      number: '٠٦',
      eyebrow: 'الخدمة السادسة',
      title: 'التشغيل والإدارة',
      tagline: 'بعد الافتتاح يبدأ عملنا الحقيقي.',
      intro:
        'كل تركيب نسلّمه يدخل لوحتنا التشغيلية. مراقبة عن بُعد، صيانة وقائية مجدولة، تحديثات محتوى عند الطلب، خط هاتف مفتوح ٢٤ ساعة، وفريق ميداني في الرياض جاهز للزيارة في يوم العمل نفسه.',
      steps: [
        { title: 'الربط', line: 'كل تركيب يرتبط بلوحتنا منذ يوم التسليم.' },
        { title: 'المراقبة', line: 'فحص يومي عن بُعد، تقرير أسبوعي، تنبيهات فورية على أي خلل.' },
        { title: 'الصيانة', line: 'زيارة وقائية كل ٩٠ يوماً. زيارة تصحيحية خلال ٤٨ ساعة عند الحاجة.' },
        { title: 'التحديث', line: 'تحديثات محتوى وبرامج عند الطلب، بدون توقف للتركيب.' },
      ],
      materials: [
        { label: 'اللوحة', line: 'لوحة تشغيل سحابية من تطويرنا، تعرض كل تركيب على الخريطة.' },
        { label: 'الفريق', line: 'فريق ميداني في الرياض، فريق دعم على الهاتف ٢٤ ساعة.' },
        { label: 'العقد', line: 'عقد سنوي ثابت، أو عقد مكالمة مفتوحة بحسب الحجم.' },
        { label: 'التقارير', line: 'تقرير شهري مكتوب، اجتماع ربع سنوي، مراجعة أداء سنوية.' },
      ],
      signature:
        'عند ظهور خلل، يصلك تشخيص أولي خلال ١٥ دقيقة. خلال ٤٨ ساعة، يكون الأمر معالجاً، أو لديك جدول معالجة بالأيام، لا بالأسابيع.',
      scale: [
        { label: 'الحد الأدنى', value: 'تركيب واحد' },
        { label: 'الحد الأعلى', value: 'محفظة كاملة لمالك مدن' },
        { label: 'مدة العقد', value: 'سنوي قابل للتجديد' },
      ],
      caseStudy: {
        title: 'محفظة تشغيل لمالك متعدد',
        venue: 'الرياض، جدة، الدمام',
        year: '٢٠٢٥',
        outcome: 'متوسط زمن استجابة ١١ دقيقة عبر ٩ تركيبات لأربعة عملاء.',
      },
      next: { slug: 'walls', label: 'العودة إلى الخدمة الأولى' },
    },
  },
};

const en: ServicesPageCopy = {
  meta: {
    title: 'Basma Tech — Services',
    description: 'Six capabilities. One roof. Each one finishes from design to operations without a hand-off to an outside vendor.',
  },
  index: {
    eyebrow: 'The six capabilities',
    headline: 'What do we actually do?',
    subhead: 'We do not give things bigger names than they deserve. These are six real capabilities, each one with an installation that runs in a real venue.',
    cardCta: 'Service detail',
  },
  services: {
    walls: {
      slug: 'walls',
      number: '01',
      eyebrow: 'Capability one',
      title: 'Interactive walls and surfaces',
      tagline: 'Each wall carries the name of its place.',
      intro:
        'Kinetic mirrors, hexagonal tiles, surfaces that respond when a visitor draws close. We weld the steel, solder the boards, and write the firmware in a single workshop. The wall arrives as one piece, not a kit.',
      steps: [
        { title: 'Visit', line: 'We visit the site, measure the wall, capture the lighting, meet the team.' },
        { title: 'Design', line: 'Three concept boards in the first week. Pick one, we go deeper.' },
        { title: 'Build', line: 'Every tile, every motor, every board, ships from our Riyadh workshop.' },
        { title: 'Install', line: 'We install ourselves, no subcontract. Soak test, tune, hand over.' },
      ],
      materials: [
        { label: 'Tile', line: 'Coated steel, polished mirror, or cast acrylic.' },
        { label: 'Motor', line: 'NEMA17 stepper motors, torque sized to each installation.' },
        { label: 'Electronics', line: 'In-house PCB, proximity sensing, networked control.' },
        { label: 'Software', line: 'Our motion engine, with a wake mode when no visitor is present.' },
      ],
      signature:
        'Every tile carries a small proximity sensor. As you draw close, the wave knows where you came from and moves toward you.',
      scale: [
        { label: 'Smallest', value: '4 by 2 meters' },
        { label: 'Largest', value: '12 by 4 meters' },
        { label: 'Lead time', value: '8 to 12 weeks' },
      ],
      caseStudy: {
        title: 'Red Sea hotel lobby',
        venue: 'Jeddah',
        year: '2025',
        outcome: 'Visitor dwell time tripled in the first week.',
      },
      next: { slug: 'games', label: 'Next capability: Games' },
    },
    games: {
      slug: 'games',
      number: '02',
      eyebrow: 'Capability two',
      title: 'Interactive games',
      tagline: 'A collective moment that stays.',
      intro:
        'Experiences sized for a whole family, a corporate team, or a school cohort. We design the mechanical base, write the logic, and shape the story. The game opens with a one-minute brief and closes with a group photo on the wall.',
      steps: [
        { title: 'Story', line: 'We talk with marketing and operations, then write the game scenario.' },
        { title: 'Prototype', line: 'A working prototype in two weeks to test the play loop.' },
        { title: 'Build', line: 'Mechanics, electronics, finish surfaces — all in-house.' },
        { title: 'Train', line: 'Two days of training for the operations team, plus an Arabic ops manual.' },
      ],
      materials: [
        { label: 'Base', line: 'Steel frame finished in clean, scratch-resistant materials.' },
        { label: 'Sensors', line: 'Depth cameras, weight pads, or capacitive touch by game.' },
        { label: 'Electronics', line: 'Central controller, cloud link for updates and analytics.' },
        { label: 'Software', line: 'Our game engine, remote content updates always available.' },
      ],
      signature:
        'Every game ships with remote update. It does not age in a year. It does not stall in one season.',
      scale: [
        { label: 'Smallest', value: '4 simultaneous players' },
        { label: 'Largest', value: '32 simultaneous players' },
        { label: 'Lead time', value: '10 to 14 weeks' },
      ],
      caseStudy: {
        title: 'Mall arcade hall',
        venue: 'Dammam',
        year: '2024',
        outcome: 'Average session 22 minutes. Average daily footfall 400.',
      },
      next: { slug: 'kinetic', label: 'Next capability: Kinetic' },
    },
    kinetic: {
      slug: 'kinetic',
      number: '03',
      eyebrow: 'Capability three',
      title: 'Kinetic installations',
      tagline: 'A space that breathes.',
      intro:
        'Hanging sculptures that move slowly through the day, ceilings that open when a procession passes, walls that expand at a chosen hour. Mechanics built in our workshop. Motion written by our software.',
      steps: [
        { title: 'Read', line: 'Read the room, understand the daily activity, pick the moments that matter.' },
        { title: 'Choreography', line: 'Every installation has a motion schedule by time of day and footfall.' },
        { title: 'Build', line: 'In-house fabrication, 72-hour soak test before shipping.' },
        { title: 'Install', line: 'Rigged install, load test, soak run with the owner present.' },
      ],
      materials: [
        { label: 'Frame', line: 'Engineered steel calculated for the load of each installation.' },
        { label: 'Motors', line: 'Stepper or servo, picked by motion type.' },
        { label: 'Electronics', line: 'Distributed control, weight sensing, networked monitoring.' },
        { label: 'Software', line: 'Choreography engine, wake mode at presence, daily reports.' },
      ],
      signature:
        'Every installation has a wake mode. Visitor present, motion runs. Visitor gone, the piece rests, drawing minimal power.',
      scale: [
        { label: 'Smallest', value: '4 independent elements' },
        { label: 'Largest', value: '140 synchronized elements' },
        { label: 'Lead time', value: '12 to 18 weeks' },
      ],
      caseStudy: {
        title: 'Energy company atrium',
        venue: 'Riyadh',
        year: '2024',
        outcome: 'A 12-meter installation built around 140 independent elements.',
      },
      next: { slug: 'displays', label: 'Next capability: Screens' },
    },
    displays: {
      slug: 'displays',
      number: '04',
      eyebrow: 'Capability four',
      title: 'Digital displays',
      tagline: 'Send a floor plan, get a display plan back.',
      intro:
        'High-density LED, projection systems, distributed content networks. Before we hand the room over, we simulate the lighting on your floor plan. You see what your visitors will see before we power up a single panel.',
      steps: [
        { title: 'Plan', line: 'Send the floor plan, we simulate, we present the result.' },
        { title: 'Pick', line: 'Pick from three display plans, each with its own budget.' },
        { title: 'Install', line: 'Install screens, projectors, network, integration test.' },
        { title: 'Content', line: 'Write the opening content, train your team to manage the network.' },
      ],
      materials: [
        { label: 'Screens', line: 'LED at 2 or 3 mm pitch, or micro-LED for close-quarter rooms.' },
        { label: 'Projection', line: '12,000-lumen laser projectors, short-throw lenses.' },
        { label: 'Network', line: 'Central content server, IP distribution, 4G failover.' },
        { label: 'Software', line: 'Our content management, usage analytics, scheduling.' },
      ],
      signature:
        'Draw the room in the demo box, press render, and the display layout appears on your space exactly. The room you see in here is the room you will walk into on opening night.',
      scale: [
        { label: 'Smallest', value: '2 coordinated screens' },
        { label: 'Largest', value: '17 distributed screens' },
        { label: 'Lead time', value: '6 to 10 weeks' },
      ],
      caseStudy: {
        title: 'Waterfront restaurant row',
        venue: 'Riyadh',
        year: '2025',
        outcome: '17 displays unified on a single content network.',
      },
      next: { slug: 'immersive', label: 'Next capability: Immersive' },
    },
    immersive: {
      slug: 'immersive',
      number: '05',
      eyebrow: 'Capability five',
      title: 'Immersive environments',
      tagline: 'You enter, and nothing in you stays unmoved.',
      intro:
        '360 projection across four walls and the ceiling, spatial audio that follows the visitor, scent released at a chosen moment, a floor that vibrates softly with the rhythm. All of this leaves a single control room.',
      steps: [
        { title: 'Script', line: 'Our creative team writes the visitor journey minute by minute.' },
        { title: 'Build', line: 'Projection walls, spatial audio, haptic flooring, scent distribution.' },
        { title: 'Sync', line: 'Programming the synchrony moments between sound, image, haptics, scent.' },
        { title: 'Operate', line: 'A three-person team runs four sessions a day with a maintenance schedule.' },
      ],
      materials: [
        { label: 'Projection', line: 'Multi-laser projector mesh, edge-blended for full 360 coverage.' },
        { label: 'Audio', line: 'Dolby Atmos speaker array, visitor-position tracking.' },
        { label: 'Haptics', line: 'Vibrating floor tiles, low-throw fog, compressed-air scent diffusers.' },
        { label: 'Software', line: 'Our experience engine, every sense controlled from one console.' },
      ],
      signature:
        'The script is written by our creative team, the lighting by our engineers, the sound by the Saudi audio engineer who has worked with us since 2022.',
      scale: [
        { label: 'Smallest', value: '80 square meters' },
        { label: 'Largest', value: '320 square meters' },
        { label: 'Lead time', value: '14 to 20 weeks' },
      ],
      caseStudy: {
        title: 'Saudi brand product launch',
        venue: 'Riyadh',
        year: '2025',
        outcome: 'A 320-square-meter room hosted 220 guests in one night.',
      },
      next: { slug: 'operations', label: 'Last capability: Operations' },
    },
    operations: {
      slug: 'operations',
      number: '06',
      eyebrow: 'Capability six',
      title: 'Operations and management',
      tagline: 'After opening night, our real work begins.',
      intro:
        'Every installation we hand over enters our operations dashboard. Remote monitoring, scheduled preventive maintenance, on-demand content updates, a phone line open 24 hours, and a Riyadh field team ready to visit on the same working day.',
      steps: [
        { title: 'Connect', line: 'Every installation links to our dashboard from the day it goes live.' },
        { title: 'Monitor', line: 'Daily remote check, weekly report, instant alert on any flag.' },
        { title: 'Maintain', line: 'A preventive visit every 90 days. A corrective visit inside 48 hours when needed.' },
        { title: 'Update', line: 'Content and software updates on demand, no downtime to the installation.' },
      ],
      materials: [
        { label: 'Dashboard', line: 'Our cloud operations dashboard, every installation pinned to the map.' },
        { label: 'Team', line: 'Riyadh field team, 24-hour phone support staff.' },
        { label: 'Contract', line: 'Annual fixed-fee contract, or open-call by-the-visit by scale.' },
        { label: 'Reports', line: 'Monthly written report, quarterly meeting, annual performance review.' },
      ],
      signature:
        'When an issue surfaces, you get an initial diagnosis within 15 minutes. Inside 48 hours, the matter is resolved or you have a daily resolution schedule, not a weekly one.',
      scale: [
        { label: 'Floor', value: 'A single installation' },
        { label: 'Ceiling', value: 'Full portfolio for a city-scale owner' },
        { label: 'Term', value: 'Annual, renewable' },
      ],
      caseStudy: {
        title: 'Multi-site portfolio',
        venue: 'Riyadh, Jeddah, Dammam',
        year: '2025',
        outcome: 'Average response time 11 minutes across 9 installations for four owners.',
      },
      next: { slug: 'walls', label: 'Back to the first capability' },
    },
  },
};

export const services = { ar, en } as const;

export function getServices(lang: Lang): ServicesPageCopy {
  return services[lang];
}
