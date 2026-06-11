export type Language = "en" | "fr" | "rw" | "sw";

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  access_level: number; // 1 = Super Admin, 2 = VVIP, 4 = Premium User, 5 = Standard, 6 = Guest
  google_id?: string;
  momo_number?: string;
  account_name?: string;
  created_at: string;
  is_verified: boolean;
}

export interface InteractionEvent {
  id: string;
  timestamp: string;
  user_id?: string;
  user_email?: string;
  type: "click" | "mousemove" | "navigation" | "auth" | "login" | "logout" | "custom";
  page: string;
  target: string;
  x?: number;
  y?: number;
  metadata?: Record<string, any>;
}

export interface MomoPayment {
  id: string;
  user_id: string;
  user_email: string;
  amount: number;
  currency: string;
  momo_number: string;
  transaction_id: string;
  plan: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  component: string;
  message: string;
}

export interface Telemetry {
  totalRequests: number;
  tokensUsed: number;
  totalLatencyMs: number;
  successCount: number;
  failCount: number;
  totalClicks?: number;
  totalMouseMoves?: number;
}

export interface TVChannel {
  id: string;
  name: string;
  category: "local" | "news" | "sports" | "entertainment" | "regional";
  stream_url: string;
  logo_url: string;
  description: string;
  quality: "1080p HD" | "720p HD" | "SD";
  language: string;
  min_level: number; // minimum access level required (e.g. 5 for Standard, 4 for Premium, 1 for Admin)
  fallback_url?: string;
  external_url?: string;
}

export interface TVRecording {
  id: string;
  channelName: string;
  startTime: string;
  durationSec: number;
  fileSizeMb: number;
  downloadUrl: string;
}

// Translations structure
export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    title: "Empire AI Platform",
    subtitle: "Divine AI Assistant, Live TV Streaming & Global Accessibility Suite",
    created_by: "Designed by Emperor KAZENEZA RWEMA Sostene",
    dashboard: "Dashboard",
    ai_assistant: "Divine AI Chat",
    creative_hub: "Creative Hub",
    live_tv: "Live TV Channels",
    accessibility: "Accessibility Suite",
    billing: "Premium Billing",
    admin_panel: "Emperor's Command Center",
    metrics_telemetry: "Telemetry & Evaluation",
    welcome: "Welcome back",
    login: "Log In",
    logout: "Exit Session",
    guest_view: "Guest Access Mode",
    active_subscription: "Status",
    free_tier: "Free Citizen Tier",
    standard_tier: "Royal Standard Partner",
    premium_tier: "Empire Pro Elite",
    super_admin_tier: "Emperor Supreme",
    credits: "Estimated Tokens Used",
    prompt_placeholder: "Converse with Gemini 3.5 Core with absolute fidelity...",
    generate: "Execute Command",
    clear: "Purge Context",
    recording_tv: "Stream Recorder",
    recording_active: "REC",
    contrast_theme: "Contrast Shift",
    text_size: "Text Size Booster",
    voice_feedback: "Screen Reader Sim",
    voice_on: "Voice On",
    voice_off: "Voice Off",
    momo_payment_title: "MTN Mobile Money Secure Gateway",
    momo_payee_info: "Verify MTN MoMo Registry details",
    momo_registry_name: "KAZENEZA RWEMA Sostene",
    momo_registry_number: "0796931165",
    momo_guide: "Step-by-step transaction walkthrough:",
    momo_step1: "1. Transfer subscription amount directly via MTN Mobile Money to the Registered Merchant: 0796931165 (KAZENEZA RWEMA Sostene).",
    momo_step2: "2. Input the transaction code reference (TxID) and your sender phone number below.",
    momo_step3: "3. Submit transaction. Emperor Sostene will quickly audit the payment log to activate your Tier.",
    sender_number: "My Sender MoMo Number (+250)",
    tx_code: "10-Digit Transaction ID (TxID)",
    pay_amount: "Amount to Send",
    submit_trans: "Submit Transaction ID",
    pending_approval: "Awaiting Emperor's confirmation",
    payment_approved: "Approved and Active!",
    language_select: "Locale Selector",
  },
  fr: {
    title: "Plateforme Empire AI",
    subtitle: "Assistant IA divin, streaming TV en direct et suite d'accessibilité mondiale",
    created_by: "Conçu par l'Empereur KAZENEZA RWEMA Sostene",
    dashboard: "Tableau de Bord",
    ai_assistant: "Chat Divine IA",
    creative_hub: "Hub Créatif",
    live_tv: "Chaînes TV en Direct",
    accessibility: "Suite d'Accessibilité",
    billing: "Facturation Premium",
    admin_panel: "Centre de Commandement du Souverain",
    metrics_telemetry: "Télémétrie et Évaluation",
    welcome: "Bon retour",
    login: "Se Connecter",
    logout: "Déconnexion",
    guest_view: "Mode Invité",
    active_subscription: "Statut",
    free_tier: "Niveau Citoyen Gratuit",
    standard_tier: "Partenaire Royal Standard",
    premium_tier: "Élite Empire Pro",
    super_admin_tier: "Empereur Suprême",
    credits: "Jetons Estimés Utilisés",
    prompt_placeholder: "Discutez avec Gemini 3.5 Core avec une fidélité absolue...",
    generate: "Exécuter l'Ordre",
    clear: "Purger le Contexte",
    recording_tv: "Enregistreur de Flux",
    recording_active: "ENR",
    contrast_theme: "Changement de Contraste",
    text_size: "Agrandisseur de Police",
    voice_feedback: "Simulateur de Lecteur d'Écran",
    voice_on: "Voix Activée",
    voice_off: "Voix Désactivée",
    momo_payment_title: "Passerelle Sécurisée MTN Mobile Money",
    momo_payee_info: "Vérifier les détails du registre MTN MoMo",
    momo_registry_name: "KAZENEZA RWEMA Sostene",
    momo_registry_number: "0796931165",
    momo_guide: "Procédure étape par étape :",
    momo_step1: "1. Transférez le montant de l'abonnement par MTN Mobile Money au marchand agréé : 0796931165 (KAZENEZA RWEMA Sostene).",
    momo_step2: "2. Saisissez le code de transaction (TxID) et votre numéro de téléphone d'expéditeur ci-dessous.",
    momo_step3: "3. Soumettez le paiement. L'Empereur Sostene validera le reçu pour activer votre compte.",
    sender_number: "Mon Numéro Expéditeur (+250)",
    tx_code: "ID de la Transaction (TxID)",
    pay_amount: "Montant à Envoyer",
    submit_trans: "Soumettre l'ID de Transaction",
    pending_approval: "En attente de confirmation souveraine",
    payment_approved: "Approuvé et Activé !",
    language_select: "Sélecteur de Langue",
  },
  rw: {
    title: "Empire AI Platform",
    subtitle: "Umuhuza w'ubwenge w'indashyikirwa, Amatangazo y'imbona-nkubone & Serivisi z'Aboroherwaye",
    created_by: "Cyafashwe bikozwe n'Umwami KAZENEZA RWEMA Sostene",
    dashboard: "Ibiro Bikuru",
    ai_assistant: "Ikiganiro cy'Ubwenge",
    creative_hub: "Agasanduku k'Ibihangano",
    live_tv: "Amatemu ya TV Azima",
    accessibility: "Aboroherantambwe",
    billing: "Kwishura Umusanzu",
    admin_panel: "Ubutegetsi Bikuru bw'Umwami",
    metrics_telemetry: "Ibipimo by'Imikorere y'Ibyuma",
    welcome: "Murakaza neza",
    login: "Yinjire",
    logout: "Sohoka",
    guest_view: "Urugero rw'Abashyitsi",
    active_subscription: "Imiterere",
    free_tier: "Ubuntu bw'Abaturage",
    standard_tier: "Icyubahiro Standard",
    premium_tier: "Gisanzwe Cy'Icyitegererezo",
    super_admin_tier: "Umwami Mukuru",
    credits: "Tokens zagereranijwe",
    prompt_placeholder: "Baza Gemini 3.5 Core mu bwizerane busesuye...",
    generate: "Tanga Itegeko",
    clear: "Kura amakuru",
    recording_tv: "Udufata Amashusho",
    recording_active: "FATA",
    contrast_theme: "Guhindura Ibyerekanwa",
    text_size: "Gukuza Inyandiko",
    voice_feedback: "Gusoma mu majwi",
    voice_on: "Amajwi Ariko",
    voice_off: "Afuditse",
    momo_payment_title: "MTN Mobile Money Iburyo",
    momo_payee_info: "Reba Umwirondoro w'Uhagarariye MoMo",
    momo_registry_name: "KAZENEZA RWEMA Sostene",
    momo_registry_number: "0796931165",
    momo_guide: "Inzira yo kwishyura intambwe ku yindi:",
    momo_step1: "1. Yoherereza umusanzu ukoresheje MTN Mobile Money kuri nimero y'Umuyobozi: 0796931165 (KAZENEZA RWEMA Sostene).",
    momo_step2: "2. Shyiramo nimero y'amasezerano (TxID) ndetse na nimero yawe yoherereje.",
    momo_step3: "3. Ohereza. Umwami Sostene aragenzura kuri sisitemu ahite aguha urwego rwisumbuye.",
    sender_number: "Nomero nkoherereje (+250)",
    tx_code: "Inomero ya TxID (Imibare 10)",
    pay_amount: "Amafaranga yoherezwa",
    submit_trans: "Ohereza Umwirondoro wa Cyishyurwa",
    pending_approval: "Tegereze kwemezwa n'Umwami",
    payment_approved: "Yemejwe! Urwego Rukora",
    language_select: "Guhitamo Ururimi",
  },
  sw: {
    title: "Empire AI Platform",
    subtitle: "Msaidizi Mtakatifu wa AI, Utiririshaji wa Runinga Moja kwa Moja na Huduma ya Ufikiaji",
    created_by: "Imeundwa na Mfalme KAZENEZA RWEMA Sostene",
    dashboard: "Kituo Kikuu",
    ai_assistant: "Mazungumzo ya AI",
    creative_hub: "Kituo cha Ubunifu",
    live_tv: "Televisheni Moja kwa Moja",
    accessibility: "Kipengele cha Ufikiaji",
    billing: "Malipo ya Premium",
    admin_panel: "Kituo Kikuu cha Mfalme",
    metrics_telemetry: "Vipimo vya Telemetria na Tathmini",
    welcome: "Karibu tena",
    login: "Ingia",
    logout: "Ondoka",
    guest_view: "Hali ya Mgeni",
    active_subscription: "Hali",
    free_tier: "Kiwango cha Mwananchi Bure",
    standard_tier: "Mshirika wa Kifalme Standard",
    premium_tier: "Kiwango cha Juu cha Elite",
    super_admin_tier: "Mfalme Mkuu",
    credits: "Makadirio ya Ishara Zilizotumika",
    prompt_placeholder: "Zungumza na Gemini 3.5 kwa uaminifu kamili...",
    generate: "Tekeleza Amri",
    clear: "Safisha Mazungumzo",
    recording_tv: "Kurekodi Televisheni",
    recording_active: "REKODI",
    contrast_theme: "Badilisha Tofauti",
    text_size: "Kuza Ukubwa wa Maandishi",
    voice_feedback: "Soma kwa Sauti",
    voice_on: "Sauti Imewashwa",
    voice_off: "Sauti Imezimwa",
    momo_payment_title: "Njia salama ya MTN Mobile Money",
    momo_payee_info: "Thibitisha Maelezo ya Mpokeaji MoMo",
    momo_registry_name: "KAZENEZA RWEMA Sostene",
    momo_registry_number: "0796931165",
    momo_guide: "Mwongozo wa hatua kwa hatua wa kulipa:",
    momo_step1: "1. Tuma kiasi cha usajili moja kwa moja kupitia MTN Mobile Money kwa Mfanyabiashara: 0796931165 (KAZENEZA RWEMA Sostene).",
    momo_step2: "2. Jaza msimbo wa muamala (TxID) na nambari yako ya simu ya mtumaji hapo chini.",
    momo_step3: "3. Tuma muamala. Mfalme Sostene atathibitisha malipo ili kukuza kiwango cha usajili wako.",
    sender_number: "Nambari yangu ya Mtumaji (+250)",
    tx_code: "ID ya Muamala (TxID)",
    pay_amount: "Kiasi cha Kutuma",
    submit_trans: "Tuma ID ya Muamala",
    pending_approval: "Inasubiri uthibitisho wa Mfalme",
    payment_approved: "Imeidhinishwa na Iko Tayari!",
    language_select: "Chagua Lugha",
  }
};

// Seed outstanding high-quality Rwandan and international live TV channels
export const SEED_TV_CHANNELS: TVChannel[] = [
  {
    id: "rba-1",
    name: "RBA - Rwanda Broadcasting Agency",
    category: "local",
    stream_url: "https://www.youtube.com/embed/live_stream?channel=UCXb68U0Gv1SgE_5wGZInE1A",
    logo_url: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=120&h=120&q=80",
    description: "The primary state broadcaster of the Republic of Rwanda, broadcasting direct news, state programs and local features in Kinyarwanda, English, and French.",
    quality: "1080p HD",
    language: "Kinyarwanda / English",
    min_level: 6, // Everyone
    fallback_url: "https://assets.mixkit.co/videos/preview/mixkit-downtown-city-intersection-with-busy-traffic-40049-large.mp4",
    external_url: "https://www.youtube.com/@rbarwandatv/live"
  },
  {
    id: "kc2-1",
    name: "KC2 Rwanda (RBA Entertainment)",
    category: "local",
    stream_url: "https://www.youtube.com/embed/live_stream?channel=UCm8B_EWhbCg196hE290tvyg",
    logo_url: "https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=120&h=120&q=80",
    description: "RBA's secondary channel dedicated to youth empowerment, top visual music, Rwandan sports highlights, dramas, and highly compelling entertainment programs.",
    quality: "720p HD",
    language: "Kinyarwanda / French",
    min_level: 5, // Standard
    fallback_url: "https://assets.mixkit.co/videos/preview/mixkit-african-woman-smiling-with-traditional-makeup-41984-large.mp4",
    external_url: "https://www.youtube.com/channel/UCm8B_EWhbCg196hE290tvyg/live"
  },
  {
    id: "flash-tv",
    name: "Flash TV Rwanda",
    category: "local",
    stream_url: "https://www.youtube.com/embed/live_stream?channel=UChrDbyV6hO7pPGr8Qk343HA",
    logo_url: "https://images.unsplash.com/photo-1610116306796-6ebd30d779c6?auto=format&fit=crop&w=120&h=120&q=80",
    description: "Vibrant independent local radio and TV broadcaster in Kigali, delivering high contrast local political commentaries, townhalls, and popular Rwandan culture.",
    quality: "720p HD",
    language: "Kinyarwanda",
    min_level: 5, // Standard
    fallback_url: "https://assets.mixkit.co/videos/preview/mixkit-drone-shot-of-a-serene-river-running-through-trees-43282-large.mp4",
    external_url: "https://www.youtube.com/channel/UChrDbyV6hO7pPGr8Qk343HA/live"
  },
  {
    id: "france24-en",
    name: "France 24 English",
    category: "news",
    stream_url: "https://www.youtube.com/embed/live_stream?channel=UC8AMAsv_35t7_9fSmv6-gLw",
    logo_url: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=120&h=120&q=80",
    description: "24-hour global news channel broadcasting international news bulletins, interviews, features, and detailed reports directly from Paris, France.",
    quality: "1080p HD",
    language: "English",
    min_level: 6, // Free
    fallback_url: "https://assets.mixkit.co/videos/preview/mixkit-business-news-graphics-background-34674-large.mp4",
    external_url: "https://www.youtube.com/c/FRANCE24English/live"
  },
  {
    id: "dw-news",
    name: "Deutsche Welle (DW) International",
    category: "news",
    stream_url: "https://www.youtube.com/embed/live_stream?channel=UCknLrEdhRCp1gB_R9qiAnpA",
    logo_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=120&h=120&q=80",
    description: "Germany's major global news broadcast serving deep analyses of world politics, global economics, digital solutions, and environmental science documentaries.",
    quality: "1080p HD",
    language: "English",
    min_level: 4, // Premium Elite
    fallback_url: "https://assets.mixkit.co/videos/preview/mixkit-under-the-world-map-rotating-globe-background-34747-large.mp4",
    external_url: "https://www.youtube.com/c/dwnews/live"
  },
  {
    id: "redbull-tv",
    name: "Red Bull Extreme Sports TV",
    category: "sports",
    stream_url: "https://www.youtube.com/embed/live_stream?channel=UC8zR7M7_6sA605Sndg_g73w",
    logo_url: "https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?auto=format&fit=crop&w=120&h=120&q=80",
    description: "Thrilling extreme sports, mountain biking, cliff diving, esports, live championship tournaments, formula drifts, and premium sports coverage worldwide.",
    quality: "1080p HD",
    language: "English",
    min_level: 4, // Premium Elite Only
    fallback_url: "https://assets.mixkit.co/videos/preview/mixkit-cyclist-riding-on-a-mountain-road-40051-large.mp4",
    external_url: "https://www.youtube.com/c/redbull/live"
  }
];
