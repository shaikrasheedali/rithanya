import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      brand: {
        name: 'Rithanya Hospital',
        subtitle: 'Diabetology & Thalassemia Daycare'
      },
      nav: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        treatments: 'Treatments',
        doctors: 'Doctors',
        products: 'Products',
        gallery: 'Media Gallery',
        insights: 'Insights',
        contact: 'Contact',
        bookAppointment: 'Book Appointment',
        emergencyHotline: '24/7 Emergency Transfusion Hotline',
        callEmergency: 'Call Emergency',
        staffPortal: 'Staff Portal',
        menuHeading: 'Navigation Menu',
        menuSub: 'Select a department or clinical service'
      },
      marquee: {
        heading: 'Specialties & Conditions Treated:-',
        specialHighlight: 'Now, for the very first time in our Khammam, HbA2 test is available',
        conditions: [
          'Blood Pressure (BP)',
          'Sugar (Diabetes)',
          'Headache',
          'Migraine',
          'Chest Pain',
          'Asthma',
          'Jaundice',
          'Stomach Burning / Acidity',
          'Anemia',
          'Burning Sensation in Urine',
          'Nerve Weakness',
          'Thyroid',
          'Tuberculosis (TB)',
          'Dengue',
          'Typhoid',
          'Malaria',
          'Viral Fevers',
          'Kidney Diseases',
          'Snake Bite',
          'Scorpion Sting',
          'Poisoning'
        ]
      },
      common: {
        telugu: 'తెలుగు',
        hindi: 'हिन्दी',
        english: 'English',
        language: 'Language'
      }
    }
  },
  te: {
    translation: {
      brand: {
        name: 'రితన్య హాస్పిటల్',
        subtitle: 'డయాబెటాలజీ & తలసేమియా డేకేర్ సెంటర్'
      },
      nav: {
        home: 'హోమ్',
        about: 'మా గురించి',
        services: 'వైద్య సేవలు',
        treatments: 'చికిత్సలు',
        doctors: 'వైద్యులు',
        products: 'ఉత్పత్తులు',
        gallery: 'మీడియా గ్యాలరీ',
        insights: 'ఆరోగ్య సూచనలు',
        contact: 'సంప్రదించండి',
        bookAppointment: 'అపాయింట్‌మెంట్ తీసుకోండి',
        emergencyHotline: '24/7 అత్యవసర బ్లడ్ ట్రాన్స్‌ఫ్యూజన్ హెల్ప్‌లైన్',
        callEmergency: 'అత్యవసర కాల్',
        staffPortal: 'స్టాఫ్ లాగిన్',
        menuHeading: 'నావిగేషన్ మెనూ',
        menuSub: 'విభాగం లేదా వైద్య సేవను ఎంచుకోండి'
      },
      marquee: {
        heading: 'ప్రత్యేక చికిత్సలు & వ్యాధుల నివారణ:-',
        specialHighlight: 'ఇప్పుడు మన ఖమ్మంలో మొట్టమొదటిసారిగా HbA2 టెస్ట్ అందుబాటులో ఉంది',
        conditions: [
          'రక్తపోటు (BP)',
          'షుగర్ (డయాబెటిస్)',
          'తలనెప్పి',
          'మైగ్రేన్',
          'ఛాతీ నొప్పి',
          'ఉబ్బసం (ఆస్తమా)',
          'కామెర్లు (జాండిస్)',
          'కడుపులో మంట / ఎసిడిటీ',
          'రక్తహీనత (ఎనీమియా)',
          'మూత్రంలో మంట',
          'నరాల బలహీనత',
          'థైరాయిడ్',
          'క్షయ వ్యాధి (TB)',
          'డెంగ్యూ',
          'టైఫాయిడ్',
          'మలేరియా',
          'వైరల్ జ్వరాలు',
          'కిడ్నీ వ్యాధులు',
          'పాము కాటు',
          'తేలు కుట్టు',
          'విషప్రయోగం'
        ]
      },
      common: {
        telugu: 'తెలుగు',
        hindi: 'हिन्दी',
        english: 'English',
        language: 'భాష'
      }
    }
  },
  hi: {
    translation: {
      brand: {
        name: 'रिथान्या हॉस्पिटल',
        subtitle: 'डायबिटोलॉजी और थैलेसीमिया डेकेयर'
      },
      nav: {
        home: 'होम',
        about: 'हमारे बारे में',
        services: 'चिकित्सा सेवाएं',
        treatments: 'उपचार',
        doctors: 'विशेषज्ञ डॉक्टर',
        products: 'उत्पाद',
        gallery: 'मीडिया गैलरी',
        insights: 'स्वास्थ्य ब्लॉग',
        contact: 'संपर्क करें',
        bookAppointment: 'अपॉइंटमेंट बुक करें',
        emergencyHotline: '24/7 आपातकालीन रक्त आधान हेल्पलाइन',
        callEmergency: 'इमरजेंसी कॉल',
        staffPortal: 'स्टाफ पोर्टल',
        menuHeading: 'नेविगेशन मेनू',
        menuSub: 'विभाग या चिकित्सा सेवा चुनें'
      },
      marquee: {
        heading: 'विशेष उपचार एवं रोग निदान:-',
        specialHighlight: 'अब हमारे खम्मम में पहली बार HbA2 टेस्ट उपलब्ध है',
        conditions: [
          'रक्तचाप (BP)',
          'शुगर (डायबिटीज)',
          'सिरदर्द',
          'माइग्रेन',
          'सीने में दर्द',
          'अस्थमा (दमा)',
          'पीलिया (जॉन्डिस)',
          'पेट में जलन / एसिडिटी',
          'खून की कमी (एनीमिया)',
          'पेशाब में जलन',
          'नसों की कमजोरी',
          'थायराइड',
          'तपेदिक (टीबी)',
          'डेंगू',
          'टाइफाइड',
          'मलेरिया',
          'वायरल बुखार',
          'गुर्दे की बीमारियां (किडनी)',
          'सांप का काटना',
          'बिच्छू का डंक',
          'जहर का असर (पॉइजनिंग)'
        ]
      },
      common: {
        telugu: 'తెలుగు',
        hindi: 'हिन्दी',
        english: 'English',
        language: 'भाषा'
      }
    }
  }
};

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('rh_language') : null;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
