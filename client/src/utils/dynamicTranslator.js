import { useTranslation } from 'react-i18next';

/**
 * Authoritative Multilingual Translation Dictionaries for Dynamic Items
 * Covers Doctors, Specialties, Treatments, Services, Products, Blogs, Blood Bank, and Common Clinical Terms.
 */
const TRANSLATION_MAP = {
  // Doctor Names & Credentials
  'Dr. D. Narayana Murthy': {
    te: 'డాక్టర్ డి. నారాయణ మూర్తి',
    hi: 'डॉ. डी. नारायण मूर्ति'
  },
  'Dr. D. Narayana Murthy (డా॥ డి. నారాయణమూర్తి)': {
    te: 'డా॥ డి. నారాయణమూర్తి',
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
  'Dr. A. Lakshmi Deepa (డా॥ ఎ. లక్ష్మీదీప)': {
    te: 'డా॥ ఎ. లక్ష్మీదీప',
    hi: 'डॉ. ए. लक्ष्मी दीपा'
  },
  'Dr. A. Lakshmi Deepa, MBBS, DGO': {
    te: 'డాక్టర్ ఎ. లక్ష్మీ దీప, MBBS, DGO',
    hi: 'डॉ. ए. लक्ष्मी दीपा, MBBS, DGO'
  },

  // Designations & Roles
  'Founder, Chief Consultant Physician & Diabetologist': {
    te: 'వ్యవస్థాపకులు, చీఫ్ కన్సల్టెంట్ ఫిజీషియన్ & డయాబెటాలజిస్ట్',
    hi: 'संस्थापक, मुख्य परामर्शदाता फिजिशियन एवं मधुमेह विशेषज्ञ'
  },
  'Co-Founder & Consultant Gynecologist / Women\'s Health Specialist (స్త్రీల వైద్య నిపుణులు)': {
    te: 'సహ-వ్యవస్థాపకురాలు & కన్సల్టెంట్ గైనకాలజిస్ట్ / స్త్రీల వైద్య నిపుణులు',
    hi: 'सह-संस्थापक एवं परामर्शदाता स्त्री रोग एवं महिला स्वास्थ्य विशेषज्ञ'
  },
  'Consultant Diabetologist & General Physician': {
    te: 'కన్సల్టెంట్ డయాబెటాలజిస్ట్ & జనరల్ ఫిజీషియన్',
    hi: 'परामर्शदाता मधुमेह रोग विशेषज्ञ एवं जनरल फिजिशियन'
  },
  'Consultant Gynecologist & Obstetrician': {
    te: 'కన్సల్టెంట్ గైనకాలజిస్ట్ & ప్రసూతి వైద్యురాలు',
    hi: 'परामर्शदाता स्त्री एवं प्रसूति रोग विशेषज्ञ'
  },
  'Senior Consultant Diabetologist': {
    te: 'సీనియర్ కన్సల్టెంట్ డయాబెటాలజిస్ట్',
    hi: 'वरिष्ठ परामर्शदाता मधुमेह रोग विशेषज्ञ'
  },

  // Clinical Departments & Categories
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
  'Gynecology & Women\'s Health': {
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
  'Vital Monitors': {
    te: 'జీవ రక్షణ పర్యవేక్షణ పరికరాలు',
    hi: 'महत्वपूर्ण स्वास्थ्य मॉनिटर्स'
  },
  'Diabetic Care': {
    te: 'డయాబెటిక్ కేర్ (మధుమేహ సంరక్షణ)',
    hi: 'मधुमेह देखभाल'
  },
  'Metabolic & Endocrinology': {
    te: 'మెటబాలిక్ & ఎండోక్రినాలజీ',
    hi: 'चयापचय एवं एंडोक्रिनोलॉजी'
  },
  'Hematology Daycare': {
    te: 'హెమటాలజీ డేకేర్ సెంటర్',
    hi: 'हेमेटोलॉजी डेकेयर'
  },
  'Footwear & Orthopedics': {
    te: 'ఆర్థోపెడిక్ పాదరక్షలు & సంరక్షణ',
    hi: 'फुटवियर एवं ऑर्थोपेडिक्स'
  },
  'Diagnostics & Labs': {
    te: 'డయాగ్నోస్టిక్స్ & ల్యాబ్ పరీక్షలు',
    hi: 'डायग्नोस्टिक्स एवं लैब्स'
  },
  'Hematology Nutrition': {
    te: 'హెమటాలజీ పోషకాహార మద్దతు',
    hi: 'हेमेटोलॉजी पोषण'
  },
  'Geriatric Health': {
    te: 'సీనియర్ సిటిజన్ (వృద్ధుల) ఆరోగ్యం',
    hi: 'वृद्धजन स्वास्थ्य'
  },
  'Endocrinology': {
    te: 'ఎండోక్రినాలజీ',
    hi: 'एंडोक्रिनोलॉजी'
  },
  'Monitoring Devices': {
    te: 'పర్యవేక్షణ పరికరాలు',
    hi: 'निगरानी उपकरण'
  },

  // Products (All 9 live items)
  'Precision Fingertip Pulse Oximeter with OLED Display': {
    te: 'ఖచ్చితమైన ఫింగర్‌టిప్ పల్స్ ఆక్సిమీటర్ (OLED డిస్ప్లే)',
    hi: 'सटीक फिंगरटिप पल्स ऑक्सीमीटर (OLED डिस्प्ले)'
  },
  'Medical-grade fingertip pulse oximeter for real-time arterial oxygen saturation (SpO2), pulse rate, and perfusion index tracking.': {
    te: 'రక్తంలో ఆక్సిజన్ సంతృప్తత (SpO2), నాడి రేటు మరియు పెర్‌ఫ్యూజన్ ఇండెక్స్ నిజ-సమయ పర్యవేక్షణ కోసం వైద్య-స్థాయి పల్స్ ఆక్సిమీటర్.',
    hi: 'रक्त ऑक्सीजन (SpO2), पल्स रेट और परफ्यूजन इंडेक्स की सटीक रियल-टाइम निगरानी हेतु मेडिकल-ग्रेड पल्स ऑक्सीमीटर।'
  },
  'Omron Automatic Upper Arm Blood Pressure Monitor': {
    te: 'ఓమ్రాన్ ఆటోమేటిక్ అప్పర్ ఆర్మ్ రక్తపోటు మానిటర్ (BP Monitor)',
    hi: 'ओमरॉन ऑटोमैटिक अपर आर्म ब्लड प्रेशर मॉनिटर'
  },
  'Clinically validated automatic upper-arm digital blood pressure monitor with Intellisense technology and irregular heartbeat sensor.': {
    te: 'ఇంటెల్లిసెన్స్ టెక్నాలజీ మరియు గుండె లయ హెచ్చుతగ్గుల గుర్తింపుతో కూడిన ఆటోమేటిక్ డిజిటల్ రక్తపోటు మానిటర్.',
    hi: 'इंटेलिसेंस तकनीक और अनियमित दिल की धड़कन संवेदक के साथ क्लीनिकली प्रमाणित डिजिटल बीपी मॉनिटर।'
  },
  'Accu-Chek Active Blood Glucose Monitoring Kit': {
    te: 'ఆక్యు-చెక్ యాక్టివ్ బ్లడ్ గ్లూకోజ్ మానిటరింగ్ కిట్ (షుగర్ టెస్ట్ కిట్)',
    hi: 'एक्यू-चेक एक्टिव ब्लड ग्लूकोज मॉनिटरिंग किट'
  },
  'Accurate 5-second blood glucose testing kit with 50 sterile test strips, lancing pen, 10 lancets, and travel case.': {
    te: '50 టెస్ట్ స్ట్రిప్స్, లాన్సింగ్ పెన్, 10 లాన్సెట్స్ మరియు ట్రావెల్ పౌచ్‌తో కూడిన 5-సెకన్ల ఖచ్చితమైన రక్తంలో చక్కెర పరీక్ష కిట్.',
    hi: '50 टेस्ट स्ट्रिप्स, लांसिंग पेन, 10 लैंसेट और ट्रैवल केस के साथ 5-सेकंड की सटीक ब्लड ग्लूकोज टेस्टिंग किट।'
  },
  'Comprehensive Diabetic Health Package': {
    te: 'సమగ్ర డయాబెటిక్ హెల్త్ ప్యాకేజీ (షుగర్ పరీక్షల ప్యాకేజీ)',
    hi: 'व्यापक मधुमेह स्वास्थ्य परीक्षण पैकेज'
  },
  'Complete blood sugar assessment, HbA1c, lipid profile, kidney panel, and specialized physician consultation.': {
    te: 'పూర్తి రక్తంలో చక్కెర పరీక్ష, HbA1c, లిపిడ్ ప్రొఫైల్, కిడ్నీ ఫంక్షన్ పరీక్ష మరియు స్పెషలిస్ట్ వైద్యుల కన్సల్టేషన్.',
    hi: 'पूर्ण ब्लड शुगर जांच, HbA1c, लिपिड प्रोफाइल, किडनी जांच और विशेषज्ञ डॉक्टर परामर्श।'
  },
  'Thalassemia Iron Overload Monitoring Panel': {
    te: 'తలసేమియా ఐరన్ ఓవర్‌లోడ్ మానిటరింగ్ ప్యానెల్ (సీరమ్ ఫెర్రిటిన్ టెస్ట్)',
    hi: 'थैलेसीमिया आयरन ओवरलोड निगरानी पैनल'
  },
  'Serum ferritin assessment, complete hemogram, pre-transfusion cross-matching, and chelation dosage adjustment.': {
    te: 'సీరమ్ ఫెర్రిటిన్ పరీక్ష, కంప్లీట్ హీమోగ్రామ్, ట్రాన్స్‌ఫ్యూజన్ క్రాస్-మ్యాచింగ్ మరియు ఐరన్ చిలేషన్ మోతాదు మార్గదర్శనం.',
    hi: 'सीरम फेरिटिन जांच, पूर्ण हीमोग्राम, ट्रांसफ्यूजन क्रॉस-मैचिंग और कीलेशन खुराक परामर्श।'
  },
  'Therapeutic Diabetic Soft-Sole Orthopedic Shoes': {
    te: 'థెరపీటిక్ డయాబెటిక్ సాఫ్ట్-సోల్ ఆర్థోపెడిక్ పాదరక్షలు',
    hi: 'थेराप्यूटिक डायबिटिक सॉफ्ट-सोल ऑर्थोपेडिक जूते'
  },
  'Seamless, extra-depth cushioned footwear designed to eliminate pressure friction points and protect diabetic feet from neuropathic ulcerations.': {
    te: 'డయాబెటిక్ నరాల బలహీనత మరియు పుండ్ల నుండి పాదాలను రక్షించడానికి ప్రత్యేకంగా రూపొందించిన కుషన్డ్ ఆర్థోపెడిక్ పాదరక్షలు.',
    hi: 'डायबिटिक न्यूरोपैथी और छालों से पैरों की सुरक्षा के लिए विशेष रूप से डिज़ाइन किए गए कुशन वाले ऑर्थोपेडिक जूते।'
  },
  'HbA1c Lab Sample Collection Test Pack (HPLC)': {
    te: 'HbA1c ల్యాబ్ శాంపిల్ కలెక్షన్ టెస్ట్ ప్యాక్ (HPLC పద్ధతి)',
    hi: 'HbA1c लैब सैंपल कलेक्शन टेस्ट पैक (HPLC)'
  },
  'Pre-sterilized venous blood collection pack for automated Bio-Rad HPLC glycated hemoglobin assessment with free doorstep Khammam pickup.': {
    te: 'ఖమ్మంలో ఉచిత హోమ్ కలెక్షన్‌తో బయో-రాడ్ HPLC ఆటోమేటెడ్ గ్లైకేటెడ్ హిమోగ్లోబిన్ పరీక్ష కోసం ప్రత్యేక ప్యాక్.',
    hi: 'खम्मम में मुफ्त होम पिकअप के साथ ऑटोमेटेड Bio-Rad HPLC ग्लाइकेटेड हीमोग्लोबिन जांच पैक।'
  },
  'Calcium & Zinc Organ Support Capsules (Iron-Free)': {
    te: 'కాల్షియం & జింక్ ఆర్గాన్ సపోర్ట్ క్యాప్సూల్స్ (ఐరన్-రహితం)',
    hi: 'कैल्शियम एवं जिंक ऑर्गन सपोर्ट कैप्सूल (आयरन-मुक्त)'
  },
  'Specially formulated 100% iron-free calcium, zinc, and vitamin D3 micro-nutritional capsules designed for thalassemia warriors undergoing iron chelation.': {
    te: 'ఐరన్ చిలేషన్ చికిత్స తీసుకునే తలసేమియా యోధుల కోసం ప్రత్యేకంగా రూపొందించిన 100% ఐరన్-రహిత కాల్షియం, జింక్ మరియు విటమిన్ D3 క్యాప్సూల్స్.',
    hi: 'आयरन कीलेशन थेरेपी ले रहे थैलेसीमिया मरीजों हेतु विशेष 100% आयरन-मुक्त कैल्शियम, जिंक और विटामिन D3 कैप्सूल।'
  },
  'Senior Citizen Comprehensive Checkup': {
    te: 'సీనియర్ సిటిజన్ సమగ్ర ఆరోగ్య పరీక్ష (వృద్ధుల హెల్త్ చెకప్)',
    hi: 'वरिष्ठ नागरिक समग्र स्वास्थ्य परीक्षण'
  },
  'Tailored diagnostics for senior citizens including cardiac markers, liver function, bone mineral profile, and doctor review.': {
    te: 'గుండె, కాలేయం, కిడ్నీ మరియు ఎముకల దృఢత్వ పరీక్షలతో కూడిన సీనియర్ సిటిజన్స్ ప్రత్యేక ఆరోగ్య ప్యాకేజీ.',
    hi: 'हृदय, लिवर, किडनी और हड्डियों की जांच सहित वरिष्ठ नागरिकों हेतु विशेष स्वास्थ्य पैकेज।'
  },

  // Services (All 6 live items)
  'Comprehensive Diabetes & Metabolic Care': {
    te: 'సమగ్ర డయాబెటిస్ & మెటబాలిక్ కేర్ (మధుమేహ సంరక్షణ)',
    hi: 'व्यापक मधुमेह एवं चयापचय देखभाल'
  },
  'Comprehensive blood glucose monitoring, HbA1c reviews, diabetic foot care, and customized lifestyle and medication management.': {
    te: 'రక్తంలో గ్లూకోజ్ పర్యవేక్షణ, HbA1c సమీక్షలు, డయాబెటిక్ పాదాల సంరక్షణ మరియు జీవనశైలి, ఔషధాల మార్గదర్శకత్వం.',
    hi: 'ब्लड शुगर की नियमित जांच, HbA1c समीक्षा, डायबिटिक फुट केयर और जीवनशैली व दवाओं का मार्गदर्शन।'
  },
  'Senior Citizen & Preventive Health Checks': {
    te: 'సీనియర్ సిటిజన్ & ప్రివెంటివ్ హెల్త్ చెకప్స్',
    hi: 'वरिष्ठ नागरिक एवं निवारक स्वास्थ्य जांच'
  },
  'Structured annual and bi-annual wellness evaluations targeting cardiovascular health, diabetes screening, and geriatric mobility.': {
    te: 'గుండె ఆరోగ్యం, మధుమేహం మరియు వృద్ధాప్య చలనశీలతను లక్ష్యంగా చేసుకున్న వార్షిక ఆరోగ్య పరీక్షలు.',
    hi: 'हृदय स्वास्थ्य, मधुमेह और वरिष्ठ गतिशीलता को ध्यान में रखकर तैयार किए गए स्वास्थ्य मूल्यांकन।'
  },
  'Thalassemia & Sickle-Cell Transfusion Day-care': {
    te: 'తలసేమియా & సికిల్-సెల్ డేకేర్ రక్త మార్పిడి కేంద్రం',
    hi: 'थैलेसीमिया एवं सिकल-सेल डेकेयर रक्त आधान केंद्र'
  },
  'Specialized day-care transfusion beds with certified blood filtration, pre-transfusion cross-matching, and routine iron chelation follow-up.': {
    te: 'రక్త వడపోత, క్రాస్-మ్యాచింగ్ మరియు ఐరన్ చిలేషన్ ఫాలో-అప్‌తో కూడిన ప్రత్యేక డేకేర్ ట్రాన్స్‌ఫ్యూజన్ పడకలు.',
    hi: 'प्रमाणित रक्त निस्पंदन, क्रॉस-मैचिंग और नियमित आयरन कीलेशन फॉलो-अप के साथ डेकेयर बेड।'
  },
  'Diagnostics & Laboratory Services': {
    te: 'క్లినికల్ డయాగ్నోస్టిక్స్ & లేబొరేటరీ సేవలు',
    hi: 'नैदानिक एवं प्रयोगशाला सेवाएं'
  },
  'Automated haematology, complete lipid panels, liver & renal profiles, glucose monitoring, and rapid febrile antigen screening.': {
    te: 'ఆటోమేటెడ్ హెమటాలజీ, పూర్తి లిపిడ్ ప్రొఫైల్, లివర్ మరియు కిడ్నీ పరీక్షలు, మరియు జ్వరాల నిర్ధారణ స్క్రీనింగ్.',
    hi: 'ऑटोमेटेड हेमेटोलॉजी, पूर्ण लिपिड प्रोफाइल, लिवर व रीनल प्रोफाइल और त्वरित बुखार परीक्षण।'
  },
  'Pediatric Consultation & Child Health': {
    te: 'పీడియాట్రిక్ కన్సల్టేషన్ & శిశు ఆరోగ్య సంరక్షణ',
    hi: 'बाल रोग परामर्श एवं शिशु स्वास्थ्य'
  },
  'Dedicated physician reviews for childhood infections, seasonal fevers, nutritional guidance, and preventive pediatric health checks.': {
    te: 'పిల్లల ఇన్‌ఫెక్షన్లు, కాలానుగుణ జ్వరాలు, పోషకాహార సలహాలు మరియు నివారణ ఆరోగ్య పరీక్షల కోసం ప్రత్యేక వైద్యుల సమీక్ష.',
    hi: 'बच्चों के संक्रमण, मौसमी बुखार, पोषण संबंधी मार्गदर्शन और निवारक स्वास्थ्य जांच हेतु समर्पित डॉक्टर।'
  },
  'General Medicine & Physician Consultation': {
    te: 'జనరల్ మెడిసిన్ & స్పెషలిస్ట్ ఫిజీషియన్ కన్సల్టేషన్',
    hi: 'जनरल मेडिसिन एवं फिजिशियन परामर्श'
  },
  'Evidence-based diagnosis and ongoing physician care for fevers, infections, metabolic disorders, and chronic conditions.': {
    te: 'జ్వరాలు, ఇన్‌ఫెక్షన్లు, మెటబాలిక్ వ్యాధులు మరియు దీర్ఘకాలిక సమస్యల కోసం సాక్ష్యాధారిత చికిత్స.',
    hi: 'बुखार, संक्रमण, चयापचय विकारों और पुरानी बीमारियों के लिए साक्ष्य-आधारित सतत देखभाल।'
  },

  // Blogs (All live items)
  'Diabetes, Thalassemia, Lifestyle': {
    te: 'డయాబెటిస్, తలసేమియా మరియు జీవనశైలి మార్పులు',
    hi: 'मधुमेह, थैलेसीमिया एवं जीवनशैली प्रबंधन'
  },

  // Treatments & Clinical Conditions
  'Sugar / Diabetes (షుగర్ / డయాబెటిస్)': {
    te: 'షుగర్ / డయాబెటిస్',
    hi: 'मधुमेह / शुगर'
  },
  'Blood Pressure / BP (బి.పి / రక్తపోటు)': {
    te: 'బి.పి / రక్తపోటు',
    hi: 'रक्तचाप / हाई बीपी'
  },
  'Chest Pain / Heart Pain (గుండెనొప్పి)': {
    te: 'గుండెనొప్పి / ఛాతీ నొప్పి',
    hi: 'सीने में दर्द / हृदय दर्द'
  },
  'Viral Fevers (వైరల్ జ్వరాలు)': {
    te: 'వైరల్ జ్వరాలు',
    hi: 'वायरल बुखार'
  },
  'Anemia / Blood Deficiency (రక్త హీనత)': {
    te: 'రక్త హీనత (ఎనీమియా)',
    hi: 'रक्त की कमी / एनीमिया'
  },
  'Jaundice (కామెర్లు)': {
    te: 'కామెర్లు (జాండిస్)',
    hi: 'पीलिया / जॉन्डिस'
  },
  'Gas Trouble (గ్యాస్ ట్రబుల్)': {
    te: 'గ్యాస్ ట్రబుల్ / ఎసిడిటీ',
    hi: 'गैस की समस्या / एसिडिटी'
  },
  'Knee Pain (మోకాళ్ళ నొప్పి)': {
    te: 'మోకాళ్ళ నొప్పి',
    hi: 'घुटनों का दर्द'
  },
  'Snake Bite, Scorpion Sting (పాముకాటు, తేలుకాటు)': {
    te: 'పాముకాటు, తేలుకాటు అత్యవసర చికిత్స',
    hi: 'सर्पदंश एवं बिच्छू डंक आपातकालीन उपचार'
  },
  'Burning Sensation in Urination (మూత్రం మంట)': {
    te: 'మూత్రంలో మంట (యూరిన్ ఇన్ఫెక్షన్)',
    hi: 'पेशाब में जलन / यूटीआई'
  },
  'Rheumatism / Arthritis (కీళ్లవాతం)': {
    te: 'కీళ్లవాతం (ఆర్థరైటిస్)',
    hi: 'गठिया / जोड़ों का दर्द'
  },
  'Fits / Epilepsy (ఫిట్స్ (మూర్ఛవ్యాధి))': {
    te: 'ఫిట్స్ (మూర్ఛవ్యాధి)',
    hi: 'दौरे / मिर्गी'
  },
  'Paralysis (పక్షవాతం)': {
    te: 'పక్షవాతం (పక్షవాత చికిత్స)',
    hi: 'लकवा / पैरालिसिस'
  },
  'Sleep Disorders / Insomnia (నిద్ర సమస్యలు)': {
    te: 'నిద్రలేమి / నిద్ర సమస్యలు',
    hi: 'अनिद्रा / नींद के विकार'
  },
  'Loss of / Decreased Libido (సెక్స్ కోరికలు తగ్గిపోవడం)': {
    te: 'సెక్స్ కోరికలు తగ్గిపోవడం (లైంగిక సమస్యలు)',
    hi: 'कामेच्छा में कमी'
  },
  'Chikungunya (చికెన్ గున్యా)': {
    te: 'చికెన్ గున్యా చికిత్స',
    hi: 'चिकनगुनिया उपचार'
  },

  // Blood Bank Terms & UI Badges
  'Units Available:': {
    te: 'లభ్యమయ్యే యూనిట్లు:',
    hi: 'उपलब्ध इकाइयाँ:'
  },
  'Units Available': {
    te: 'లభ్యమయ్యే యూనిట్లు',
    hi: 'उपलब्ध इकाइयाँ'
  },
  'Threshold:': {
    te: 'కనిష్ట పరిమితి:',
    hi: 'न्यूनतम सीमा:'
  },
  'Unreserved & Ready': {
    te: 'అన్‌రిజర్వ్‌డ్ & సిద్ధంగా ఉంది',
    hi: 'अनरिजर्व्ड एवं तैयार'
  },
  'Optimal': {
    te: 'సరైన నిల్వ (Optimal)',
    hi: 'इष्टतम'
  },
  'Near Low': {
    te: 'తక్కువ నిల్వ (Near Low)',
    hi: 'न्यूनतम के करीब'
  },
  'Critical Alert': {
    te: 'అత్యవసర హెచ్చరిక',
    hi: 'गंभीर चेतावनी'
  },
  'units': {
    te: 'యూనిట్లు',
    hi: 'इकाइयाँ'
  },
  'Live Blood Bank Registry': {
    te: 'లైవ్ బ్లడ్ బ్యాంక్ రిజిస్ట్రీ',
    hi: 'लाइव ब्लड बैंक रजिस्ट्री'
  },
  'Live Blood Bank Stock Status': {
    te: 'లైవ్ బ్లడ్ బ్యాంక్ నిల్వల స్థితి',
    hi: 'లైవ్ బ్లడ్ బ్యాంక్ నిల్వల స్థితి'
  },
  '24/7 Daycare Transfusion': {
    te: '24/7 డేకేర్ రక్త మార్పిడి కేంద్రం',
    hi: '24/7 डेकेयर रक्त आधान'
  },
  'Nehru Road 24-Hour Transfusion & Thalassemia Daycare Support': {
    te: 'నెహ్రూ రోడ్ 24 గంటల రక్త మార్పిడి & తలసేమియా డేకేర్ మద్దతు',
    hi: 'नेहरू रोड 24 घंटे रक्त आधान एवं थैलेसीमिया डेकेयर सहायता'
  },

  // Common UI Buttons & Badges
  'View Details': {
    te: 'పూర్తి వివరాలు',
    hi: 'विवरण देखें'
  },
  'Read Article': {
    te: 'వ్యాసం చదవండి',
    hi: 'लेख पढ़ें'
  },
  'Read More': {
    te: 'మరింత చదవండి',
    hi: 'अधिक पढ़ें'
  },
  'View Cart': {
    te: 'కార్ట్ చూడండి',
    hi: 'कार्ट देखें'
  },
  'Add to Cart': {
    te: 'కార్ట్‌కు జోడించండి',
    hi: 'कार्ट में जोड़ें'
  },
  'In Stock': {
    te: 'స్టాక్‌లో ఉంది',
    hi: 'स्टॉक में उपलब्ध'
  },
  'Out of Stock': {
    te: 'స్టాక్ ముగిసింది',
    hi: 'स्टॉक में नहीं'
  },
  'Free Home Delivery': {
    te: 'ఉచిత డోర్ డెలివరీ (ఖమ్మం పరిధిలో)',
    hi: 'मुफ्त होम डिलीवरी (खम्मम में)'
  },
  'Hospital Address': {
    te: 'హాస్పిటల్ చిరునామా',
    hi: 'अस्पताल का पता'
  },
  'Hospital Contact Details': {
    te: 'హాస్పిటల్ సంప్రదింపు వివరాలు',
    hi: 'अस्पताल संपर्क विवरण'
  },
  'Send Message': {
    te: 'సందేశం పంపండి',
    hi: 'संदेश भेजें'
  },
  'Submit Inquiry': {
    te: 'విచారణను పంపండి',
    hi: 'पूछताछ सबमिट करें'
  },
  'Lifelong vascular and organ protection for every diabetic individual': {
    te: 'ప్రతి మధుమేహ రోగికి దీర్ఘకాలిక రక్తనాళ మరియు అవయవ రక్షణ',
    hi: 'प्रत्येक मधुमेह रोगी के लिए आजीवन संवहनी एवं अंग सुरक्षा'
  },
  'Elimination of transfusion complications through 100% leukodepletion': {
    te: '100% ల్యూకోడెప్లీషన్ ద్వారా రక్త మార్పిడి సమస్యల నిర్మూలన',
    hi: '100% ल्यूकोडेप्लेशन के माध्यम से रक्त आधान जटिलताओं की रोकथाम'
  },
  'A peaceful, child-friendly healing atmosphere in Khammam': {
    te: 'ఖమ్మంలో ఆహ్లాదకరమైన, పిల్లలకు అనుకూలమైన ఆరోగ్య వాతావరణం',
    hi: 'खम्मम में एक शांत, बाल-अनुकूल आरोग्यकारी वातावरण'
  },
  'Deliver 24/7 Emergency and Blood Bank services with speed and precision': {
    te: '24/7 అత్యవసర సేవలు మరియు బ్లడ్ బ్యాంక్ సేవలను వేగంగా మరియు ఖచ్చితత్వంతో అందించడం',
    hi: '24/7 आपातकालीन एवं ब्लड बैंक सेवाएं तत्परता एवं सटीकता के साथ प्रदान करना'
  },
  'Administer free Aarogyasri daycare transfusions for thalassemia children': {
    te: 'తలసేమియా చిన్నారులకు ఉచిత ఆరోగ్యశ్రీ డేకేర్ రక్త మార్పిడి నిర్వహణ',
    hi: 'थैलेसीमिया पीड़ित बच्चों हेतु निःशुल्क आरोग्यश्री डेकेयर रक्त आधान'
  },
  'Support women\'s health and family wellness through specialized care': {
    te: 'ప్రత్యేక వైద్య సంరక్షణ ద్వారా మహిళల ఆరోగ్యం మరియు కుటుంబ శ్రేయస్సుకు తోడ్పాటు',
    hi: 'विशेष देखभाल के माध्यम से महिला स्वास्थ्य एवं पारिवारिक कल्याण को सहयोग'
  },
  'Nehru Road Campus • Khammam': {
    te: 'నెహ్రూ రోడ్ క్యాంపస్ • ఖమ్మం',
    hi: 'नेहरू रोड परिसर • खम्मम'
  },
  'Diabetology, Daycare Transfusion & 24/7 Diagnostics': {
    te: 'డయాబెటాలజీ, డేకేర్ బ్లడ్ ట్రాన్స్‌ఫ్యూజన్ & 24/7 డయాగ్నోస్టిక్స్',
    hi: 'डायबेटोलॉजी, डेकेयर रक्त आधान एवं 24/7 डायग्नोस्टिक्स'
  }
};

/**
 * Universal text localizer
 */
export function localizeText(text, lang = 'en') {
  if (!text || typeof text !== 'string') return text;
  if (lang === 'en') {
    // If text is in the format "English / Alternate (తెలుగు)", clean it for English view
    const parenIndex = text.indexOf('(');
    if (parenIndex > 0 && /[\u0C00-\u0C7F]/.test(text)) {
      return text.slice(0, parenIndex).trim();
    }
    return text;
  }

  const trimmed = text.trim();

  // 1. Direct dictionary lookup
  if (TRANSLATION_MAP[trimmed] && TRANSLATION_MAP[trimmed][lang]) {
    return TRANSLATION_MAP[trimmed][lang];
  }

  // 2. Case-insensitive dictionary lookup
  for (const [key, map] of Object.entries(TRANSLATION_MAP)) {
    if (trimmed.toLowerCase() === key.toLowerCase() && map[lang]) {
      return map[lang];
    }
  }

  // 3. For Telugu: if text contains Telugu characters in parentheses (e.g. "Sugar (షుగర్)"), extract the Telugu
  if (lang === 'te') {
    const match = text.match(/\(([\u0C00-\u0C7F\s\/,-]+)\)/);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // 4. Substring / sentence-level keyword translation for descriptions and summaries
  let result = text;
  if (lang === 'te' || lang === 'hi') {
    for (const [key, map] of Object.entries(TRANSLATION_MAP)) {
      if (key.length > 5 && result.includes(key) && map[lang]) {
        result = result.replaceAll(key, map[lang]);
      }
    }
  }

  return result;
}

/**
 * Localizes a dynamic database record (doctor, treatment, service, product, blog, blood stock)
 */
export function localizeItem(item, lang = 'en') {
  if (!item || typeof item !== 'object' || lang === 'en') return item;

  const localized = { ...item };

  if (localized.name) localized.name = localizeText(localized.name, lang);
  if (localized.title) localized.title = localizeText(localized.title, lang);
  if (localized.designation) localized.designation = localizeText(localized.designation, lang);
  if (localized.department) localized.department = localizeText(localized.department, lang);
  if (localized.category) localized.category = localizeText(localized.category, lang);
  if (localized.summary) localized.summary = localizeText(localized.summary, lang);
  if (localized.bio) localized.bio = localizeText(localized.bio, lang);
  if (localized.description) localized.description = localizeText(localized.description, lang);
  if (localized.content) localized.content = localizeText(localized.content, lang);
  if (localized.qualifications) localized.qualifications = localizeText(localized.qualifications, lang);
  if (localized.opdTimings) localized.opdTimings = localizeText(localized.opdTimings, lang);
  if (localized.tag) localized.tag = localizeText(localized.tag, lang);
  if (localized.date) localized.date = localizeText(localized.date, lang);
  if (localized.experience) localized.experience = localizeText(localized.experience, lang);
  if (localized.indications) localized.indications = localizeText(localized.indications, lang);

  if (Array.isArray(localized.features)) {
    localized.features = localized.features.map((f) => localizeText(f, lang));
  }
  if (Array.isArray(localized.procedures)) {
    localized.procedures = localized.procedures.map((p) => localizeText(p, lang));
  }

  return localized;
}

/**
 * React hook for dynamic multilingual translation
 */
export function useDynamicTranslation() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  return {
    t,
    i18n,
    lang: currentLang,
    loc: (text) => localizeText(text, currentLang),
    locItem: (item) => localizeItem(item, currentLang),
    locItems: (items) => (Array.isArray(items) ? items.map((it) => localizeItem(it, currentLang)) : [])
  };
}

export default useDynamicTranslation;
