import { useTranslation } from 'react-i18next';

/**
 * Authoritative Multilingual Translation Dictionaries for Dynamic Items
 * Covers Doctors, Specialties, Treatments, Services, Products, Blogs, and Common Clinical Terms.
 */
const TRANSLATION_MAP = {
  // Doctor Names & Credentials
  'Dr. D. Narayana Murthy': {
    te: 'డాక్టర్ డి. నారాయణ మూర్తి',
    hi: 'डॉ. डी. नारायण मूर्ति'
  },
  'Dr. D. Narayana Murthy, MD': {
    te: 'డాక్టర్ డి. నారాయణ మూర్తి, MD',
    hi: 'डॉ. डी. नारायण मूर्ति, MD'
  },
  'Dr. Narayana Murthy, MD': {
    te: 'డాక్టర్ నారాయణ మూర్తి, MD',
    hi: 'डॉ. नारायण मूर्ति, MD'
  },
  'Dr. A. Lakshmi Deepa': {
    te: 'డాక్టర్ ఎ. లక్ష్మీ దీప',
    hi: 'डॉ. ए. लक्ष्मी दीपा'
  },
  'Dr. A. Lakshmi Deepa, MBBS, DGO': {
    te: 'డాక్టర్ ఎ. లక్ష్మీ దీప, MBBS, DGO',
    hi: 'डॉ. ए. लक्ष्मी दीपा, MBBS, DGO'
  },
  'Dr. A. Laxmi Dipa': {
    te: 'డాక్టర్ ఎ. లక్ష్మీ దీప',
    hi: 'डॉ. ए. लक्ष्मी दीपा'
  },

  // Designations & Roles
  'Consultant Diabetologist & General Physician': {
    te: 'కన్సల్టెంట్ డయాబెటాలజిస్ట్ & జనరల్ ఫిజీషియన్',
    hi: 'परामर्शदाता मधुमेह रोग विशेषज्ञ एवं जनरल फिजिशियन'
  },
  'Consultant Gynecologist & Obstetrician': {
    te: 'కన్సల్టెంట్ గైనకాలజిస్ట్ & ప్రసూతి వైద్యురాలు',
    hi: 'परामर्शदाता स्त्री एवं प्रసూति रोग विशेषज्ञ'
  },
  'Senior Consultant Diabetologist': {
    te: 'సీనియర్ కన్సల్టెంట్ డయాబెటాలజిస్ట్',
    hi: 'वरिष्ठ परामर्शदाता मधुमेह रोग विशेषज्ञ'
  },
  'Senior Consultant': {
    te: 'సీనియర్ కన్సల్టెంట్',
    hi: 'वरिष्ठ परामर्शदाता'
  },
  'General Physician': {
    te: 'జనరల్ ఫిజీషియన్',
    hi: 'जनरल फिजिशियन'
  },
  'Pediatrician & Neonatologist': {
    te: 'పీడియాట్రిషియన్ & నియోనాటాలజిస్ట్',
    hi: 'बाल रोग विशेषज्ञ'
  },

  // Clinical Departments
  'General Medicine & Diabetology': {
    te: 'జనరల్ మెడిసిన్ & డయాబెటాలజీ',
    hi: 'जनरल मेडिसिन एवं मधुमेह विज्ञान'
  },
  'General Medicine': {
    te: 'జనరల్ మెడిసిన్',
    hi: 'जनरल मेडिसिन'
  },
  'Diabetology': {
    te: 'డయాబెటాలజీ',
    hi: 'मधुमेह विज्ञान'
  },
  "Gynecology & Women's Health": {
    te: 'గైనకాలజీ & మహిళల ఆరోగ్య సంరక్షణ',
    hi: 'स्त्री रोग एवं महिला स्वास्थ्य'
  },
  'Daycare Hematology': {
    te: 'డేకేర్ హెమటాలజీ (రక్త రుగ్మతల విభాగం)',
    hi: 'डेकेयर हेमेटोलॉजी'
  },
  'Emergency Medicine': {
    te: 'అత్యవసర వైద్య విభాగం',
    hi: 'आपातकालीन चिकित्सा'
  },
  'Clinical Diagnostics': {
    te: 'క్లినికల్ డయాగ్నోస్టిక్స్ & ల్యాబ్',
    hi: 'क्लिनिकल डायग्नोस्टिक्स'
  },
  'Pediatrics & Thalassemia Care': {
    te: 'పీడియాట్రిక్స్ & తలసేమియా సంరక్షణ',
    hi: 'बाल रोग एवं थैलेसीमिया देखभाल'
  },
  'Endocrinology': {
    te: 'ఎండోక్రినాలజీ',
    hi: 'एंडोक्रिनोलॉजी'
  },

  // OPD Schedules & Timings
  'Morning: 10:00 AM – 02:00 PM | Evening: 06:00 PM – 09:00 PM': {
    te: 'ఉదయం: 10:00 AM – 02:00 PM | సాయంత్రం: 06:00 PM – 09:00 PM',
    hi: 'सुबह: 10:00 AM – 02:00 PM | शाम: 06:00 PM – 09:00 PM'
  },
  'Mon - Sat: 11:00 AM - 5:00 PM': {
    te: 'సోమ - శని: ఉదయం 11:00 AM – సాయంత్రం 5:00 PM',
    hi: 'सोम - शनि: सुबह 11:00 AM – शाम 5:00 PM'
  },
  '24/7 Emergency Transfusion': {
    te: '24/7 అత్యవసర రక్త మార్పిడి అందుబాటులో ఉంది',
    hi: '24/7 आपातकालीन रक्त आधान सेवा'
  },
  'Updated Weekly': {
    te: 'వారానికొకసారి అప్‌డేట్ చేయబడుతుంది',
    hi: 'साप्ताहिक अपडेट'
  },
  'Recently Published': {
    te: 'ఇటీవల ప్రచురించబడింది',
    hi: 'हाल ही में प्रकाशित'
  },

  // Experience & Qualifications
  '15+ Years': {
    te: '15+ సంవత్సరాల విశేష అనుభవం',
    hi: '15+ वर्षों का समृद्ध अनुभव'
  },
  '12+ Years': {
    te: '12+ సంవత్సరాల విశేష అనుభవం',
    hi: '12+ वर्षों का समृद्ध अनुभव'
  },
  'MD (SVIMS), Specialist in Diabetology & Critical Care': {
    te: 'MD (స్విమ్స్), డయాబెటాలజీ & క్రిటికల్ కేర్ నిపుణులు',
    hi: 'MD (स्विम्स), मधुमेह एवं क्रिटिकल केयर विशेषज्ञ'
  },
  "MBBS, DGO (SVMC), Women's Health & High-Risk Pregnancy Specialist": {
    te: 'MBBS, DGO (SVMC), మహిళల ఆరోగ్యం & హై-రిస్క్ ప్రెగ్నెన్సీ నిపుణులు',
    hi: 'MBBS, DGO (SVMC), महिला स्वास्थ्य एवं उच्च जोखिम गर्भावस्था विशेषज्ञ'
  },

  // Treatments
  'Daycare Blood Transfusion Protocol': {
    te: 'డేకేర్ రక్త మార్పిడి చికిత్సా విధానం',
    hi: 'डेकेयर रक्त आधान प्रोटोकॉल'
  },
  'Advanced Chelation Therapy & Iron Monitoring': {
    te: 'అధునాతన కిలేషన్ థెరపీ & ఐరన్ పర్యవేక్షణ',
    hi: 'उन्नत केलेशन थेरेपी एवं आयरन निगरानी'
  },
  'Comprehensive Diabetic Foot Care': {
    te: 'సమగ్ర డయాబెటిక్ ఫుట్ కేర్ & అల్సర్ నివారణ',
    hi: 'व्यापक डायबिटिक फुट केयर एवं अल्सर प्रबंधन'
  },
  'Automated HbA2 HPLC Screening': {
    te: 'ఆటోమేటెడ్ HbA2 HPLC తలసేమియా స్క్రీనింగ్',
    hi: 'स्वचालित HbA2 एचपीएलसी थैलेसीमिया स्क्रीनिंग'
  },
  'Acute Poisoning & Toxin Elimination Protocol': {
    te: 'తీవ్రమైన విషప్రభావం & టాక్సిన్ నివారణ చికిత్స',
    hi: 'विषाक्तता एवं विष उन्मूलन आपातकालीन प्रोटोकॉल'
  },
  'Emergency Snake & Scorpion Envenomation Care': {
    te: 'పాము కాటు & తేలు కాటు అత్యవసర చికిత్స',
    hi: 'सर्पदंश एवं बिच्छू डंक आपातकालीन देखभाल'
  },

  // Services
  '24/7 Emergency & Critical Care': {
    te: '24/7 అత్యవసర వైద్య సేవలు & క్రిటికల్ కేర్',
    hi: '24/7 आपातकालीन एवं क्रिटिकल केयर सेवाएं'
  },
  'Diabetology & Endocrinology Care': {
    te: 'డయాబెటాలజీ & ఎండోక్రినాలజీ కేర్',
    hi: 'मधुमेह एवं एंडोक्रिनोलॉजी देखभाल'
  },
  'Daycare Blood Transfusions': {
    te: 'డేకేర్ బ్లడ్ ట్రాన్స్‌ఫ్యూజన్స్ (రక్త మార్పిడి)',
    hi: 'डेकेयर रक्त आधान सेवाएं'
  },
  'Automated HPLC Diagnostics & HbA2 Testing': {
    te: 'ఆటోమేటెడ్ HPLC డయాగ్నోస్టిక్స్ & HbA2 టెస్టింగ్',
    hi: 'स्वचालित एचपीएलसी निदान एवं HbA2 परीक्षण'
  },
  'General Medicine & Acute Inpatient Care': {
    te: 'జనరల్ మెడిసిన్ & ఇన్‌పేషెంట్ సంరక్షణ',
    hi: 'जनरल मेडिसिन एवं इनपेशेंट देखभाल'
  },
  'Obstetrics & Gynecology': {
    te: 'ప్రసూతి & స్త్రీ జననేంద్రియ వైద్యం',
    hi: 'प्रसूति एवं स्त्री रोग चिकित्सा'
  },

  // Products & Categories
  'Diagnostic Kits & Monitoring': {
    te: 'డయాగ్నోస్టిక్ కిట్లు & మానిటరింగ్ పరికరాలు',
    hi: 'डायग्नोस्टिक किट और निगरानी उपकरण'
  },
  'Clinical Consumables': {
    te: 'క్లినికల్ వినియోగ వస్తువులు',
    hi: 'क्लिनिकल उपभोग्य वस्तुएं'
  },
  'Hospital Certified': {
    te: 'హాస్పిటల్ సర్టిఫైడ్',
    hi: 'अस्पताल प्रमाणित'
  },
  'Popular': {
    te: 'ప్రజాదరణ పొందినది',
    hi: 'लोकप्रिय'
  },
  'Essential': {
    te: 'అత్యవసరమైనది',
    hi: 'आवश्यक'
  },
  'Recommended': {
    te: 'వైద్యుల సిఫార్సు',
    hi: 'अनुशंसित'
  },
  'HbA2 HPLC Thalassemia Screening Package': {
    te: 'HbA2 HPLC తలసేమియా స్క్రీనింగ్ ప్యాకేజీ',
    hi: 'HbA2 एचपीएलसी थैलेसीमिया स्क्रीनिंग पैकेज'
  },
  'Comprehensive Diabetic Screening Package': {
    te: 'సమగ్ర డయాబెటిక్ స్క్రీనింగ్ ప్యాకేజీ',
    hi: 'व्यापक डायबिटिक स्क्रीनिंग पैकेज'
  },
  'Essential Iron Profile & Ferritin Test Kit': {
    te: 'ఐరన్ ప్రొఫైల్ & ఫెరిటిన్ టెస్ట్ కిట్',
    hi: 'आयरन प्रोफाइल और फेरिटिन टेस्ट किट'
  },
  'Digital Blood Glucose Monitoring Kit': {
    te: 'డిజిటల్ బ్లడ్ గ్లూకోజ్ మానిటరింగ్ కిట్',
    hi: 'डिजिटल ब्लड ग्लूकोज मॉनिटरिंग किट'
  },
  'Continuous Glucose Sensor (14-Day)': {
    te: 'నిరంతర గ్లూకోజ్ సెన్సార్ (14 రోజుల మానిటర్)',
    hi: 'कंटीन्यूअस ग्लूकोज सेंसर (14-दिवसीय मॉनिटर)'
  },

  // Common UI Buttons & Badges
  'Book Appointment': {
    te: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
    hi: 'अपॉइंटमेंट बुक करें'
  },
  'Book Now': {
    te: 'ఇప్పుడే బుక్ చేయండి',
    hi: 'अभी बुक करें'
  },
  'View Details': {
    te: 'వివరాలు చూడండి',
    hi: 'विवरण देखें'
  },
  'Read More': {
    te: 'మరింత చదవండి',
    hi: 'अधिक पढ़ें'
  },
  'Enquire Now': {
    te: 'ఇప్పుడే విచారించండి',
    hi: 'पूछताछ करें'
  },
  'Available': {
    te: 'అందుబాటులో ఉంది',
    hi: 'उपलब्ध है'
  },
  'In Stock': {
    te: 'స్టాక్‌లో ఉంది',
    hi: 'स्टॉक में उपलब्ध'
  },
  'Out of Stock': {
    te: 'స్టాక్ ముగిసింది',
    hi: 'स्टॉक में नहीं'
  },
  'Emergency Care': {
    te: 'అత్యవసర చికిత్స',
    hi: 'आपातकालीन देखभाल'
  },
  'Call Emergency': {
    te: 'అత్యవసర కాల్',
    hi: 'आपातकालीन कॉल'
  },
  'Our Doctors': {
    te: 'మా నిపుణులైన వైద్యులు',
    hi: 'हमारे विशेषज्ञ डॉक्टर'
  },
  'Specialist Doctors': {
    te: 'స్పెషలిస్ట్ వైద్యులు',
    hi: 'विशेषज्ञ डॉक्टर'
  },
  'Clinical Treatments': {
    te: 'వైద్య చికిత్సలు',
    hi: 'क्लिनिकल उपचार'
  },
  'Healthcare Products': {
    te: 'ఆరోగ్య సంరక్షణ ఉత్పత్తులు',
    hi: 'स्वास्थ्य उत्पाद'
  },
  'Latest Medical Insights': {
    te: 'తాజా ఆరోగ్య సూచనలు & సమాచారం',
    hi: 'नवीनतम स्वास्थ्य सुझाव'
  },
  'All Categories': {
    te: 'అన్ని విభాగాలు',
    hi: 'सभी श्रेणियां'
  },
  'Track Appointment': {
    te: 'అపాయింట్‌మెంట్ ట్రాక్ చేయండి',
    hi: 'अपॉइंटमेंट ट्रैक करें'
  }
};

/**
 * Localizes any clinical or UI text according to current active language
 */
export function localizeText(text, lang = 'en') {
  if (!text || typeof text !== 'string') return text;
  if (lang === 'en') return text;

  const trimmed = text.trim();
  const entry = TRANSLATION_MAP[trimmed];
  if (entry && entry[lang]) {
    return entry[lang];
  }

  // Check prefix or partial phrase matches
  for (const [key, translations] of Object.entries(TRANSLATION_MAP)) {
    if (trimmed.toLowerCase() === key.toLowerCase() && translations[lang]) {
      return translations[lang];
    }
  }

  return text;
}

/**
 * Localizes a dynamic database record (doctor, treatment, service, product, blog)
 */
export function localizeItem(item, lang = 'en') {
  if (!item || typeof item !== 'object' || lang === 'en') return item;

  const localized = { ...item };

  if (localized.name) localized.name = localizeText(localized.name, lang);
  if (localized.title) localized.title = localizeText(localized.title, lang);
  if (localized.designation) localized.designation = localizeText(localized.designation, lang);
  if (localized.department) localized.department = localizeText(localized.department, lang);
  if (localized.category) localized.category = localizeText(localized.category, lang);
  if (localized.opdTimings) localized.opdTimings = localizeText(localized.opdTimings, lang);
  if (localized.tag) localized.tag = localizeText(localized.tag, lang);
  if (localized.date) localized.date = localizeText(localized.date, lang);
  if (localized.experience) localized.experience = localizeText(localized.experience, lang);

  if (Array.isArray(localized.features)) {
    localized.features = localized.features.map(f => localizeText(f, lang));
  }

  return localized;
}

/**
 * React hook to access language and translation helper
 */
export function useDynamicTranslation() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  return {
    t,
    lang: currentLang,
    loc: (text) => localizeText(text, currentLang),
    locItem: (item) => localizeItem(item, currentLang),
    locItems: (items) => (Array.isArray(items) ? items.map((it) => localizeItem(it, currentLang)) : [])
  };
}

export default useDynamicTranslation;
