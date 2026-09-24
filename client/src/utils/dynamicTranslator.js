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
  },

  // Footer & Compliance
  'Privacy Notice': {
    te: 'గోప్యతా విధానం (Privacy Notice)',
    hi: 'गोपनीयता नीति (Privacy Notice)'
  },
  'Terms of Clinical Service': {
    te: 'వైద్య సేవా నిబంధనలు (Terms of Service)',
    hi: 'चिकित्सा सेवा की शर्तें (Terms of Service)'
  },
  'Patient Rights & Facilities': {
    te: 'రోగుల హక్కులు & సదుపాయాలు',
    hi: 'मरीजों के अधिकार एवं सुविधाएं'
  },
  'Request Erasure (DPDP Act)': {
    te: 'డేటా తొలగింపు అభ్యర్థన (DPDP Act)',
    hi: 'डेटा हटाने का अनुरोध (DPDP Act)'
  },

  // Hero Video Slider
  'Centre of Excellence': {
    te: 'సెంటర్ ఆఫ్ ఎక్సలెన్స్ (విశిష్ట సేవా కేంద్రం)',
    hi: 'उत्कृष्टता केंद्र'
  },
  'Thalassemia & Sickle Cell Warriors': {
    te: 'తలసేమియా & సికిల్ సెల్ యోధుల సంరక్షణ',
    hi: 'थैलेसीमिया एवं सिकल सेल योद्धा'
  },
  "Khammam's dedicated Daycare Transfusion Centre providing leukodepleted packed red cell transfusions and advanced iron chelation therapy.": {
    te: 'ఖమ్మంలో ల్యూకోడెప్లీటెడ్ ప్యాక్డ్ రెడ్ సెల్స్ మరియు అధునాతన ఐరన్ చిలేషన్ థెరపీని అందించే ఏకైక డేకేర్ ట్రాన్స్‌ఫ్యూజన్ కేంద్రం.',
    hi: 'ल्यूकोडेप्लेटेड पैक्ड रेड सेल और उन्नत आयरन कीलेशन थेरेपी प्रदान करने वाला खम्मम का समर्पित डेकेयर ट्रांसफ्यूजन केंद्र।'
  },
  'Book appointment': {
    te: 'అపాయింట్‌మెంట్ బుక్ చేసుకోండి',
    hi: 'अपॉइंटमेंट बुक करें'
  },
  'Daycare Services': {
    te: 'డేకేర్ సేవలు',
    hi: 'डेकेयर सेवाएं'
  },
  'Senior Diabetologist': {
    te: 'సీనియర్ డయాబెటాలజిస్ట్',
    hi: 'वरिष्ठ मधुमेह विशेषज्ञ'
  },
  'Clinical Diabetology & Endocrine Care': {
    te: 'క్లినికల్ డయాబెటాలజీ & ఎండోక్రైన్ కేర్',
    hi: 'क्लीनिकल डायबेटोलॉजी एवं एंडोक्राइन केयर'
  },
  'Under Dr. Narayana Murthy M.D., delivering longitudinal glycemic management, diabetic neuropathy diagnostics, and vascular wellness.': {
    te: 'డాక్టర్ నారాయణ మూర్తి M.D. పర్యవేక్షణలో దీర్ఘకాలిక రక్తంలో గ్లూకోజ్ నియంత్రణ, డయాబెటిక్ న్యూరోపతి నిర్ధారణ మరియు వాస్కులర్ ఆరోగ్యం.',
    hi: 'डॉ. नारायण मूर्ति एम.डी. के मार्गदर्शन में निरंतर ब्लड शुगर प्रबंधन, डायबिटिक न्यूरोपैथी जांच एवं संवहनी स्वास्थ्य देखभाल।'
  },
  'Consult Specialists': {
    te: 'స్పెషలిస్ట్ వైద్యులను సంప్రదించండి',
    hi: 'विशेषज्ञ डॉक्टरों से परामर्श लें'
  },
  'Health Packages': {
    te: 'ఆరోగ్య ప్యాకేజీలు',
    hi: 'स्वास्थ्य पैकेज'
  },
  'Automated Laboratory': {
    te: 'ఆటోమేటెడ్ క్లినికల్ లేబొరేటరీ',
    hi: 'ऑटोमेटेड प्रयोगशाला'
  },
  'Precision Pathology & HPLC Diagnostics': {
    te: 'ఖచ్చితమైన పాథాలజీ & HPLC డయాగ్నోస్టిక్స్',
    hi: 'सटीक पैथोलॉजी एवं HPLC डायग्नोस्टिक्स'
  },
  'Fully automated clinical laboratory featuring HPLC hemoglobin electrophoresis, automated biochemistry, and rapid-turnaround diagnostics.': {
    te: 'HPLC హిమోగ్లోబిన్ ఎలక్ట్రోఫోరేసిస్, ఆటోమేటెడ్ బయోకెమిస్ట్రీ మరియు వేగవంతమైన ల్యాబ్ పరీక్షలతో కూడిన పూర్తి ఆటోమేటెడ్ లేబొరేటరీ.',
    hi: 'HPLC हीमोग्लोबिन इलेक्ट्रोफोरेसिस, ऑटोमेटेड बायोकैमिस्ट्री और त्वरित जांच से सुसज्जित पूरी तरह से स्वचालित प्रयोगशाला।'
  },
  'Explore Diagnostics': {
    te: 'డయాగ్నోస్టిక్స్ వివరాలు',
    hi: 'डायग्नोस्टिक्स देखें'
  },
  'View Facility': {
    te: 'హాస్పిటల్ సౌకర్యాలు',
    hi: 'सुविधाएं देखें'
  },
  'Patient Trust & Ethics': {
    te: 'రోగుల విశ్వాసం & వైద్య నైతికత',
    hi: 'मरीजों का विश्वास एवं चिकित्सा नैतिकता'
  },
  'Compassionate Care with Digital Ethics': {
    te: 'డిజిటల్ నైతికతతో కూడిన నిస్వార్థ వైద్య సేవలు',
    hi: 'डिजिटल नैतिकता के साथ संवेदनशील देखभाल'
  },
  'Multi-specialty emergency care with DPDP Act 2023 digital privacy, web camera consent, and patient-first medical integrity.': {
    te: 'DPDP చట్టం 2023 డిజిటల్ గోప్యత, రోగుల సమ్మతి మరియు విశ్వసనీయతతో కూడిన అత్యవసర మరియు స్పెషాలిటీ వైద్య సేవలు.',
    hi: 'DPDP अधिनियम 2023 डिजिटल गोपनीयता, वेब कैमरा सहमति और मरीज-प्रथम चिकित्सा सत्यनिष्ठा के साथ आपातकालीन देखभाल।'
  },
  'Emergency & OPD': {
    te: 'అత్యవసర విభాగం & OPD',
    hi: 'आपातकालीन एवं ओपीडी'
  },
  'About Hospital': {
    te: 'ఆసుపత్రి గురించి',
    hi: 'अस्पताल के बारे में'
  },

  // Treatments (Titles, Summaries, Indications, Durations, Protocols)
  'Thalassemia Daycare Transfusion & Leukodepletion': {
    te: 'తలసేమియా డేకేర్ రక్త మార్పిడి & ల్యూకోడెప్లీషన్',
    hi: 'थैलेसीमिया डेकेयर रक्त आधान एवं ल्यूकोडेप्लेशन'
  },
  "Khammam's dedicated day-care transfusion unit delivering triple-crossmatched, micro-aggregate leukodepleted packed red cells under continuous hemodynamic monitoring.": {
    te: 'నిరంతర రక్తపోటు మరియు నాడి పర్యవేక్షణలో ట్రిపుల్-క్రాస్‌మ్యాచ్డ్, మైక్రో-అగ్రిగేట్ ల్యూకోడెప్లీటెడ్ ప్యాక్డ్ రెడ్ సెల్స్ అందించే ఖమ్మం డేకేర్ ట్రాన్స్‌ఫ్యూజన్ యూనిట్.',
    hi: 'निरंतर हेमोडायनामिक निगरानी में ट्रिपल-क्रॉस-मैच्ड, ल्यूकोडेप्लेटेड पैक्ड रेड सेल्स प्रदान करने वाला खम्मम का समर्पित डेकेयर ट्रांसफ्यूजन केंद्र।'
  },
  'Severe chronic hemolytic anemia, Hb < 9.0 g/dL, Beta-Thalassemia Major, Sickle-Cell Disease crises.': {
    te: 'తీవ్రమైన క్రానిక్ హెమోలిటిక్ ఎనీమియా, Hb < 9.0 g/dL, బీటా-తలసేమియా మేజర్, సికిల్-సెల్ వ్యాధి సమస్యలు.',
    hi: 'गंभीर क्रोनिक हेमोलिटिक एनीमिया, Hb < 9.0 g/dL, बीटा-थैलेसीमिया मेजर, सिकल-सेल रोग संकट।'
  },
  'Oral & Infusion Iron Chelation Therapy': {
    te: 'ఓరల్ & ఇన్ఫ్యూషన్ ఐరన్ చిలేషన్ థెరపీ',
    hi: 'ओरल एवं इन्फ्यूजन आयरन कीलेशन थेरेपी'
  },
  'Systematic organ-protective iron chelation regimens utilizing Deferasirox, Deferiprone, and Desferrioxamine to protect myocardial, hepatic, and pancreatic tissue.': {
    te: 'గుండె, కాలేయం మరియు క్లోమ గ్రంథి అవయవ రక్షణ కోసం డెఫెరాసిరాక్స్, డెఫెరిప్రోన్ మరియు డెస్ఫెర్రియోక్సమైన్ ద్వారా క్రమబద్ధమైన ఐరన్ చిలేషన్ చికిత్స.',
    hi: 'हृदय, लिवर और अग्न्याशय की सुरक्षा के लिए डेफेरासिरॉक्स, डेफेरीप्रोन और डेसफेरियोक्सामाइन का उपयोग कर व्यवस्थित ऑर्गन-प्रोटेक्टिव आयरन कीलेशन।'
  },
  'Serum Ferritin > 1000 mcg/L, cumulative transfusion units > 15-20, myocardial or hepatic iron overload risk.': {
    te: 'సీరమ్ ఫెర్రిటిన్ > 1000 mcg/L, మొత్తం రక్త మార్పిడి యూనిట్లు > 15-20, గుండె లేదా కాలేయంలో ఐరన్ అధిక నిల్వ ప్రమాదం.',
    hi: 'सीरम फेरिटिन > 1000 mcg/L, कुल रक्त आधान > 15-20 यूनिट, हृदय या लिवर में आयरन ओवरलोड का जोखिम।'
  },
  'Clinical Diabetology & Glycemic Regulation': {
    te: 'క్లినికల్ డయాబెటాలజీ & గ్లూకోజ్ నియంత్రణ',
    hi: 'क्लीनिकल डायबेटोलॉजी एवं ग्लाइसेमिक विनियमन'
  },
  'Evidence-based longitudinal diabetes treatment focusing on glycemic variability stabilization, early nephropathy detection, and patient empowerment.': {
    te: 'రక్తంలో గ్లూకోజ్ హెచ్చుతగ్గుల నియంత్రణ, ముందస్తు మూత్రపిండాల రక్షణ మరియు రోగి అవగాహనపై దృష్టి సారించిన సాక్ష్యాధారిత డయాబెటిస్ చికిత్స.',
    hi: 'ब्लड शुगर स्थिरता, प्रारंभिक गुर्दे की सुरक्षा और रोगी सशक्तिकरण पर केंद्रित साक्ष्य-आधारित मधुमेह उपचार।'
  },
  'Type 1 Diabetes, Type 2 Diabetes Mellitus, Gestational Diabetes, Brittle Diabetes, Metabolic Syndrome.': {
    te: 'టైప్ 1 డయాబెటిస్, టైప్ 2 డయాబెటిస్ మెల్లిటస్, గర్భధారణ మధుమేహం, మెటబాలిక్ సిండ్రోమ్.',
    hi: 'टाइप 1 मधुमेह, टाइप 2 मधुमेह, गर्भावधि मधुमेह, मेटाबॉलिक सिंड्रोम।'
  },
  'Diabetic Neuropathy Diagnostics & Podiatry': {
    te: 'డయాబెటిక్ న్యూరోపతి డయాగ్నోస్టిక్స్ & పోడియాట్రీ (పాదాల సంరక్షణ)',
    hi: 'डायबिटिक न्यूरोपैथी डायग्नोस्टिक्स एवं पोडियाट्री'
  },
  'Advanced biothesiometry, monofilament tactile sensitivity, and Doppler vascular mapping preventing lower limb complications.': {
    te: 'పాదాల సమస్యలు మరియు పుండ్లను నివారించడానికి అధునాతన బయోథీసియోమెట్రీ, మోనోఫిలమెంట్ స్పర్శ పరీక్ష మరియు డాప్లర్ రక్తనాళాల మ్యాపింగ్.',
    hi: 'पैरों के छालों और जटिलताओं की रोकथाम हेतु उन्नत बायोथिसियोमेट्री, मोनोफिलामेंट संवेदनशीलता और डॉपलर वैस्कुलर मैपिंग।'
  },
  'Peripheral numbness, tingling, burning feet sensation, loss of protective sensation, diabetic foot ulcer risk.': {
    te: 'పాదాల్లో తిమ్మిర్లు, సూదులతో గుచ్చినట్లు అనిపించడం, అరికాళ్ళ మంటలు, స్పర్శ తగ్గడం, డయాబెటిక్ అల్సర్ ప్రమాదం.',
    hi: 'पैरों में सुन्नपन, झनझनाहट, पैरों में जलन, स्पर्श संवेदनशीलता में कमी, डायबिटिक फुट अल्सर का जोखिम।'
  },
  'Automated HPLC Hemoglobin Electrophoresis': {
    te: 'ఆటోమేటెడ్ HPLC హిమోగ్లోబిన్ ఎలక్ట్రోఫోరేసిస్',
    hi: 'स्वचालित HPLC हीमोग्लोबिन इलेक्ट्रोफोरेसिस'
  },
  'Gold-standard high-performance liquid chromatography providing definitive automated quantification of HbA2, HbF, HbS, and variant hemoglobin peaks.': {
    te: 'HbA2, HbF, HbS మరియు ఇతర హిమోగ్లోబిన్ వేరియంట్ల ఖచ్చితమైన ఆటోమేటెడ్ లెక్కింపును అందించే గోల్డ్-స్టాండర్డ్ హై-పెర్ఫార్మెన్స్ లిక్విడ్ క్రోమాటోగ్రఫీ.',
    hi: 'HbA2, HbF, HbS और अन्य हीमोग्लोबिन वेरिएंट्स के सटीक स्वचालित मात्रा निर्धारण हेतु गोल्ड-स्टैंडर्ड हाई-परफॉर्मेंस लिक्विड क्रोमैटोग्राफी।'
  },
  'Differential diagnosis of microcytic anemia, pre-marital screening, carrier detection of Thalassemia trait, HbS verification.': {
    te: 'రక్తహీనత నిర్ధారణ, వివాహానికి పూర్వ పరీక్షలు, తలసేమియా క్యారియర్ గుర్తింపు, HbS నిర్ధారణ.',
    hi: 'माइक्रोसाइटिक एनीमिया का विभेदक निदान, विवाह पूर्व जांच, थैलेसीमिया वाहक की पहचान, HbS सत्यापन।'
  },
  '24/7 Automated Pathology & Metabolic Diagnostics': {
    te: '24/7 ఆటోమేటెడ్ పాథాలజీ & మెటబాలిక్ డయాగ్నోస్టిక్స్',
    hi: '24/7 स्वचालित पैथोलॉजी एवं मेटाबॉलिक डायग्नोस्टिक्स'
  },
  'Fully automated biochemistry, 5-part hematology, and arterial blood gas testing with rapid clinical turnaround and computerized verification.': {
    te: 'కంప్యూటరీకరించిన వేగవంతమైన ల్యాబ్ ఫలితాలతో కూడిన పూర్తి ఆటోమేటెడ్ బయోకెమిస్ట్రీ, 5-పార్ట్ హెమటాలజీ మరియు రక్త పరీక్షలు.',
    hi: 'त्वरित कम्प्यूटरीकृत सत्यापन के साथ पूरी तरह से स्वचालित बायोकैमिस्ट्री, 5-पार्ट हेमेटोलॉजी और रक्त गैस परीक्षण।'
  },
  'Routine inpatient vitals, pre-transfusion profiles, emergency electrolyte imbalances, acute infections.': {
    te: 'ఇన్‌పేషెంట్ వైటల్స్, బ్లడ్ ట్రాన్స్‌ఫ్యూజన్‌కు ముందు పరీక్షలు, ఎలక్ట్రోలైట్ అసమతుల్యత, తీవ్రమైన ఇన్ఫెక్షన్లు.',
    hi: 'रूटीन इनपेशेंट जांच, रक्त आधान से पूर्व परीक्षण, इलेक्ट्रोलाइट असंतुलन, तीव्र संक्रमण।'
  },
  '3 - 4 Hours': {
    te: '3 - 4 గంటలు',
    hi: '3 - 4 घंटे'
  },
  '60 mins Clinical Audit': {
    te: '60 నిమిషాల క్లినికల్ ఆడిట్',
    hi: '60 मिनट का क्लीनिकल ऑडिट'
  },
  '45 mins Consultation': {
    te: '45 నిమిషాల కన్సల్టేషన్',
    hi: '45 मिनट का परामर्श'
  },
  '45 mins Evaluation': {
    te: '45 నిమిషాల సమగ్ర పరీక్ష',
    hi: '45 मिनट का मूल्यांकन'
  },
  'Same-Day Automated Report': {
    te: 'అదే రోజు ఆటోమేటెడ్ నివేదిక',
    hi: 'उसी दिन स्वचालित रिपोर्ट'
  },
  '2 Hours Automated Turnaround': {
    te: '2 గంటల్లో ఆటోమేటెడ్ రిపోర్ట్',
    hi: '2 घंटे में स्वचालित रिपोर्ट'
  },
  'Standard Session': {
    te: 'ప్రామాణిక సెషన్',
    hi: 'मानक सत्र'
  },
  'Clinical Indications & Eligibility': {
    te: 'క్లినికల్ లక్షణాలు & అర్హత',
    hi: 'नैदानिक संकेत एवं पात्रता'
  },
  'Clinical Procedures & Safety Protocol': {
    te: 'చికిత్సా విధానాలు & భద్రతా నియమావళి',
    hi: 'नैदानिक प्रक्रियाएं एवं सुरक्षा प्रोटोकॉल'
  },
  'Book This Treatment': {
    te: 'ఈ చికిత్సను బుక్ చేసుకోండి',
    hi: 'यह उपचार बुक करें'
  },
  'Consult directly with': {
    te: 'నేరుగా సంప్రదించండి',
    hi: 'सीधे परामर्श करें'
  },
  'for customized pre-assessment and daycare bed reservation.': {
    te: 'వ్యక్తిగత ముందస్తు అంచనా మరియు డేకేర్ బెడ్ రిజర్వేషన్ కొరకు.',
    hi: 'अनुकूलित पूर्व-मूल्यांकन एवं डेकेयर बेड आरक्षण के लिए।'
  },
  'Typical Duration': {
    te: 'సగటు సమయం',
    hi: 'अनुमानित समय'
  },
  'Safety Standard': {
    te: 'భద్రతా ప్రమాణం',
    hi: 'सुरक्षा मानक'
  },
  'Leukodepleted Blood Unit': {
    te: 'ల్యూకోడెప్లీటెడ్ బ్లడ్ యూనిట్',
    hi: 'ल्यूकोडेप्लेटेड रक्त इकाई'
  },
  'Clinical Safety Standard': {
    te: 'క్లినికల్ భద్రతా ప్రమాణాలు',
    hi: 'नैदानिक सुरक्षा मानक'
  },
  'Supervised by Dr. Narayana Murthy M.D. (Senior Diabetologist)': {
    te: 'డాక్టర్ నారాయణ మూర్తి M.D. (సీనియర్ డయాబెటాలజిస్ట్) పర్యవేక్షణలో',
    hi: 'डॉ. नारायण मूर्ति एम.डी. (वरिष्ठ मधुमेह विशेषज्ञ) की देखरेख में'
  },
  'Treatment Not Found': {
    te: 'చికిత్స కనుగొనబడలేదు',
    hi: 'उपचार नहीं मिला'
  },
  'The requested clinical procedure or treatment could not be found.': {
    te: 'అభ్యర్థించిన వైద్య విధానం లేదా చికిత్స వివరాలు లభ్యం కాలేదు.',
    hi: 'अनुरोधित प्रक्रिया या उपचार विवरण उपलब्ध नहीं है।'
  },
  'Back to Treatments Catalog': {
    te: 'చికిత్సల జాబితాకు తిరిగి వెళ్లండి',
    hi: 'उपचार सूची पर वापस जाएं'
  },
  'Back to All Treatments': {
    te: 'అన్ని చికిత్సలకు తిరిగి వెళ్లండి',
    hi: 'सभी उपचारों पर वापस जाएं'
  },
  'Share Protocol': {
    te: 'వివరాలు షేర్ చేయండి',
    hi: 'प्रोटोकॉल साझा करें'
  },
  'Attending': {
    te: 'హాజరయ్యే వైద్యులు',
    hi: 'उपस्थित डॉक्टर'
  },

  // Doctors Page Details & Full Bios
  'Dr. D. Narayana Murthy is a premier senior physician and diabetologist in Khammam. Having trained at apex institutes including SVIMS, JIPMER, and the Royal College of Physicians (London), he founded Rithanya Hospital to bring cutting-edge diabetology, organ-protective chronic care, and dedicated 24/7 daycare blood transfusion facilities for children with Thalassemia and Sickle Cell Anemia to Khammam.': {
    te: 'డాక్టర్ డి. నారాయణ మూర్తి ఖమ్మంలో ప్రముఖ సీనియర్ ఫిజీషియన్ మరియు డయాబెటాలజిస్ట్. SVIMS, JIPMER మరియు రాయల్ కాలేజ్ ఆఫ్ ఫిజీషియన్స్ (లండన్) వంటి అగ్రశ్రేణి సంస్థలలో శిక్షణ పొందిన ఆయన, అధునాతన మధుమేహ చికిత్స, అవయవ రక్షణ మరియు తలసేమియా, సికిల్ సెల్ చిన్నారుల కోసం 24/7 డేకేర్ రక్త మార్పిడి సౌకర్యాలను ఖమ్మంలో అందించడానికి రితన్య హాస్పిటల్‌ను స్థాపించారు.',
    hi: 'डॉ. डी. नारायण मूर्ति खम्मम के प्रमुख वरिष्ठ चिकित्सक एवं मधुमेह विशेषज्ञ हैं। SVIMS, JIPMER और रॉयल कॉलेज ऑफ फिजिशियंस (लंदन) जैसे शीर्ष संस्थानों से प्रशिक्षित होकर, उन्होंने खम्मम में अत्याधुनिक मधुमेह विज्ञान, अंग-सुरक्षात्मक देखभाल और थैलेसीमिया व सिकल सेल पीड़ित बच्चों हेतु 24/7 डेकेयर रक्त आधान सुविधाएं उपलब्ध कराने के लिए रिथन्या अस्पताल की स्थापना की।'
  },
  'Renowned senior physician in Khammam known for compassionate patient care, accurate differential diagnosis, and evidence-backed diabetes management programs.': {
    te: 'రోగి-కేంద్రీకృత సేవా దృక్పథం, ఖచ్చితమైన రోగ నిర్ధారణ మరియు సాక్ష్యాధారిత డయాబెటిస్ చికిత్సలకు ఖమ్మంలో ప్రసిద్ధి చెందిన సీనియర్ ఫిజీషియన్.',
    hi: 'मरीजों के प्रति संवेदनशील दृष्टिकोण, सटीक रोग निदान और साक्ष्य-आधारित मधुमेह प्रबंधन के लिए खम्मम में प्रसिद्ध वरिष्ठ चिकित्सक।'
  },
  'Dr. A. Lakshmi Deepa is an experienced and compassionate Women\'s Health Specialist and Gynecologist. Dedicated to empowering women through proactive preventive care, adolescent health, maternal wellness, and management of complex gynecological disorders.': {
    te: 'డాక్టర్ ఎ. లక్ష్మీ దీప అనుభవజ్ఞురాలైన మరియు నిబద్ధత గల మహిళల ఆరోగ్య నిపుణులు మరియు గైనకాలజిస్ట్. నివారణ ఆరోగ్య సంరక్షణ, కౌమార బాలికల ఆరోగ్యం, ప్రసూతి సంరక్షణ మరియు సంక్లిష్ట స్త్రీ జననేంద్రియ సమస్యల నిర్వహణలో ప్రత్యేక శ్రద్ధ వహిస్తారు.',
    hi: 'डॉ. ए. लक्ष्मी दीपा एक अनुभवी एवं संवेदनशील महिला स्वास्थ्य विशेषज्ञ और स्त्री रोग विशेषज्ञ हैं। वे निवारक स्वास्थ्य देखभाल, किशोरावस्था स्वास्थ्य, मातृ कल्याण और जटिल स्त्री रोग संबंधी विकारों के प्रबंधन के माध्यम से महिलाओं को सशक्त बनाने हेतु समर्पित हैं।'
  },
  'Expert in pediatric transfusion protocols, thalassemia chelation regimens, and childhood hematological assessments.': {
    te: 'పీడియాట్రిక్ రక్త మార్పిడి నియమాలు, తలసేమియా చిలేషన్ మరియు పిల్లల రక్త సంబంధిత వ్యాధుల నిర్ధారణలో నిపుణులు.',
    hi: 'बाल रोग रक्त आधान प्रोटोकॉल, थैलेसीमिया कीलेशन और बच्चों के रक्त विकारों के मूल्यांकन में विशेषज्ञ।'
  },
  'MD (General Physician SVIMS), Ex. Senior Resident (SVIMS), Ex. Resident (JIPMER), Fellowship in Clinical Endocrinology & Diabetes RCP (London), Fellowship in Diabetes and Renal Management RCP (London)': {
    te: 'MD (జనరల్ ఫిజీషియన్ SVIMS), మాజీ సీనియర్ రెసిడెంట్ (SVIMS), మాజీ రెసిడెంట్ (JIPMER), ఫెలోషిప్ ఇన్ క్లినికల్ ఎండోక్రైనాలజీ & డయాబెటిస్ RCP (లండన్), ఫెలోషిప్ ఇన్ డయాబెటిస్ & రీనల్ మేనేజ్‌మెంట్ RCP (లండన్)',
    hi: 'MD (जनरल फिजिशियन SVIMS), पूर्व सीनियर रेजिडेंट (SVIMS), पूर्व रेजिडेंट (JIPMER), फेलोशिप इन क्लिनिकल एंडोक्रिनोलॉजी एंड डायबिटीज RCP (लंदन), फेलोशिप इन डायबिटीज एंड रीनल मैनेजमेंट RCP (लंदन)'
  },
  'MBBS, MD (General Medicine), Fellow in Diabetology': {
    te: 'MBBS, MD (జనరల్ మెడిసిన్), ఫెలో ఇన్ డయాబెటాలజీ',
    hi: 'MBBS, MD (जनरल मेडिसिन), फेलो इन डायबेटोलॉजी'
  },
  '22+ Years Clinical Excellence': {
    te: '22+ సంవత్సరాల క్లినికల్ అనుభవం',
    hi: '22+ वर्षों का क्लीनिकल अनुभव'
  },
  '16+ Years Clinical Excellence': {
    te: '16+ సంవత్సరాల క్లినికల్ అనుభవం',
    hi: '16+ वर्षों का क्लीनिकल अनुभव'
  },
  '14+ Years Experience': {
    te: '14+ సంవత్సరాల అనుభవం',
    hi: '14+ वर्षों का अनुभव'
  },
  'Mon - Sat: 11:00 AM - 5:00 PM': {
    te: 'సోమ - శని: ఉదయం 11:00 – సాయంత్రం 05:00',
    hi: 'सोम - शनि: सुबह 11:00 – शाम 05:00'
  },
  'Mon - Sat: 10:00 AM - 2:00 PM & 6:00 PM - 8:30 PM': {
    te: 'సోమ - శని: ఉదయం 10:00 – మధ్యాహ్నం 02:00 & సాయంత్రం 06:00 – రాత్రి 08:30',
    hi: 'सोम - शनि: सुबह 10:00 – दोपहर 02:00 एवं शाम 06:00 – रात 08:30'
  },
  'Tue, Thu, Sat: 2:00 PM - 6:00 PM': {
    te: 'మంగళ, గురు, శని: మధ్యాహ్నం 02:00 – సాయంత్రం 06:00',
    hi: 'मंगल, गुरु, शनि: दोपहर 02:00 – शाम 06:00'
  },
  'Qualifications & Fellowships': {
    te: 'విద్యార్హతలు & ఫెలోషిప్‌లు',
    hi: 'योग्यताएं एवं फेलोशिप'
  },
  'Medical Qualifications & Fellowships': {
    te: 'వైద్య విద్యార్హతలు & ఫెలోషిప్‌లు',
    hi: 'चिकित्सा योग्यताएं एवं फेलोशिप'
  },
  'Consultation Hours': {
    te: 'కన్సల్టేషన్ సమయాలు',
    hi: 'परामर्श का समय'
  },
  'Consultation Hours:': {
    te: 'కన్సల్టేషన్ సమయాలు:',
    hi: 'परामर्श का समय:'
  },
  'View Full Profile & Credentials': {
    te: 'పూర్తి ప్రొఫైల్ & వివరాలు చూడండి',
    hi: 'पूरी प्रोफाइल एवं विवरण देखें'
  },
  'Book Consultation': {
    te: 'కన్సల్టేషన్ బుక్ చేసుకోండి',
    hi: 'परामर्श बुक करें'
  },
  'Book OPD Consultation': {
    te: 'OPD కన్సల్టేషన్ బుక్ చేయండి',
    hi: 'ओपीडी परामर्श बुक करें'
  },
  'Regd:': {
    te: 'రిజిస్ట్రేషన్ సంఖ్య:',
    hi: 'पंजीकरण संख्या:'
  },
  'Clinical Profile & Patient Care Philosophy': {
    te: 'క్లినికల్ ప్రొఫైల్ & రోగి సంరక్షణ విధానం',
    hi: 'क्लीनिकल प्रोफाइल एवं मरीज देखभाल दर्शन'
  },
  'Direct Consultant Supervision at Rithanya Hospital': {
    te: 'రితన్య హాస్పిటల్‌లో కన్సల్టెంట్ ప్రత్యక్ష పర్యవేక్షణ',
    hi: 'रिथन्या अस्पताल में कंसल्टेंट की सीधी देखरेख'
  },
  'Every patient consultation is personally reviewed by our lead consultants. Backed by 24/7 in-house emergency support, digital diagnostic labs, and the Rithanya 24 Hours Blood Bank on Nehru Road, Khammam.': {
    te: 'ప్రతి రోగి కన్సల్టేషన్‌ను మా ప్రధాన వైద్యులు స్వయంగా పర్యవేక్షిస్తారు. ఖమ్మం నెహ్రూ రోడ్డులో 24/7 ఇన్-హౌస్ అత్యవసర సహాయం, డిజిటల్ డయాగ్నోస్టిక్ ల్యాబ్స్ మరియు రితన్య 24 గంటల బ్లడ్ బ్యాంక్ అండగా ఉన్నాయి.',
    hi: 'प्रत्येक मरीज के परामर्श की समीक्षा हमारे मुख्य डॉक्टरों द्वारा व्यक्तिगत रूप से की जाती है। 24/7 इन-हाउस आपातकालीन सहायता, डिजिटल प्रयोगशालाएं और नेहरू रोड, खम्मम पर 24 घंटे ब्लड बैंक उपलब्ध है।'
  },
  'Hospital Facilities & Contact': {
    te: 'ఆసుపత్రి సౌకర్యాలు & సంప్రదింపులు',
    hi: 'अस्पताल सुविधाएं एवं संपर्क'
  },
  'Phones': {
    te: 'ఫోన్ నంబర్లు',
    hi: 'फ़ोन नंबर'
  },
  '24/7 In-House Facilities:': {
    te: '24/7 అందుబాటులో ఉండే సౌకర్యాలు:',
    hi: '24/7 इन-हाउस सुविधाएं:'
  },
  'Morning: 10:00 AM – 01:30 PM': {
    te: 'ఉదయం: 10:00 AM – 01:30 PM',
    hi: 'सुबह: 10:00 AM – 01:30 PM'
  },
  'Evening: 05:30 PM – 08:30 PM': {
    te: 'సాయంత్రం: 05:30 PM – 08:30 PM',
    hi: 'शाम: 05:30 PM – 08:30 PM'
  },
  'Preferred Timing': {
    te: 'ప్రాధాన్యత సమయం',
    hi: 'पसंदीदा समय'
  },
  'Book Another Slot': {
    te: 'మరొక అపాయింట్‌మెంట్ బుక్ చేయండి',
    hi: 'दूसरा स्लॉट बुक करें'
  },
  'Back to All Specialists': {
    te: 'అందరు స్పెషలిస్ట్‌ల జాబితాకు తిరిగి వెళ్లండి',
    hi: 'सभी विशेषज्ञों की सूची पर वापस जाएं'
  },
  'Back to Doctors Directory': {
    te: 'వైద్యుల డైరెక్టరీకి తిరిగి వెళ్లండి',
    hi: 'डॉक्टरों की निर्देशिका पर वापस जाएं'
  },
  'Share Doctor Profile': {
    te: 'డాక్టర్ ప్రొఫైల్ షేర్ చేయండి',
    hi: 'डॉक्टर प्रोफाइल साझा करें'
  },
  'e.g. Ramesh Kumar': {
    te: 'ఉదాహరణ: రమేష్ కుమార్',
    hi: 'उदा. रमेश कुमार'
  },
  '10-digit mobile number': {
    te: '10 అంకెల మొబైల్ నంబర్',
    hi: '10 अंकों का मोबाइल नंबर'
  },
  'e.g. High blood sugar readings, chronic headache...': {
    te: 'ఉదా: రక్తంలో చక్కెర ఎక్కువ ఉండటం, తలనొప్పి...',
    hi: 'उदा. उच्च ब्लड शुगर, सिरदर्द...'
  },
  'Doctor Profile Not Found': {
    te: 'డాక్టర్ ప్రొఫైల్ కనుగొనబడలేదు',
    hi: 'डॉक्टर प्रोफाइल नहीं मिली'
  },
  'The requested medical specialist or consultant could not be found.': {
    te: 'అభ్యర్థించిన వైద్య నిపుణులు లేదా కన్సల్టెంట్ వివరాలు లభ్యం కాలేదు.',
    hi: 'अनुरोधित विशेषज्ञ डॉक्टर की जानकारी उपलब्ध नहीं है।'
  },

  // Gallery Items & Filters
  'Daycare Transfusion Ward': {
    te: 'డేకేర్ ట్రాన్స్‌ఫ్యూజన్ వార్డు',
    hi: 'डेकेयर रक्त आधान वार्ड'
  },
  'Modern, sanitized day-care beds equipped for peaceful transfusions': {
    te: 'ప్రశాంతమైన రక్త మార్పిడి కోసం ఆధునిక, పరిశుభ్రమైన డేకేర్ పడకలు',
    hi: 'शांतिपूर्ण रक्त आधान हेतु आधुनिक एवं स्वच्छ डेकेयर बेड'
  },
  'Clinical Diagnostics Lab': {
    te: 'క్లినికల్ డయాగ్నోస్టిక్స్ ల్యాబ్',
    hi: 'क्लीनिकल डायग्नोस्टिक्स लैब'
  },
  'High-precision automated haematology and biochemical analyzers': {
    te: 'అధిక ఖచ్చితత్వంతో కూడిన ఆటోమేటెడ్ హెమటాలజీ మరియు బయోకెమికల్ ఎనలైజర్లు',
    hi: 'उच्च परिशुद्धता स्वचालित हेमेटोलॉजी एवं बायोकेमिकल विश्लेषक'
  },
  'Doctor Consultation Room': {
    te: 'డాక్టర్ కన్సల్టేషన్ గది',
    hi: 'डॉक्टर परामर्श कक्ष'
  },
  'Quiet outpatient consultation chambers for unrushed patient discussions': {
    te: 'రోగులతో సమగ్ర చర్చ కోసం ప్రశాంతమైన అవుట్‌పేషెంట్ కన్సల్టేషన్ గదులు',
    hi: 'विस्तृत चर्चा हेतु शांत आउटपेशेंट परामर्श कक्ष'
  },
  'Physician In Action': {
    te: 'వైద్యుల క్లినికల్ పరీక్ష',
    hi: 'चिकित्सक परामर्श कार्य'
  },
  'Dr. Narayana Murthy conducting careful clinical examinations': {
    te: 'డాక్టర్ నారాయణ మూర్తి క్లినికల్ పరీక్షలు నిర్వహిస్తున్నారు',
    hi: 'डॉ. नारायण मूर्ति मरीजों की सावधानीपूर्वक जांच करते हुए'
  },
  'Nursing & Patient Monitoring': {
    te: 'నర్సింగ్ & రోగుల పర్యవేక్షణ',
    hi: 'नर्सिंग एवं मरीज निगरानी'
  },
  'Compassionate pediatric and geriatric nursing support': {
    te: 'పిల్లలు మరియు వృద్ధులకు ఆప్యాయతతో కూడిన నర్సింగ్ సేవలు',
    hi: 'बच्चों एवं बुजुर्गों के लिए संवेदनशील नर्सिंग सेवा'
  },
  'Facility': {
    te: 'హాస్పిటల్ సౌకర్యాలు',
    hi: 'अस्पताल परिसर'
  },
  'Daycare': {
    te: 'డేకేర్ సెంటర్',
    hi: 'डेकेयर केंद्र'
  },
  'Diagnostics': {
    te: 'డయాగ్నోస్టిక్స్',
    hi: 'डायग्नोस्टिक्स'
  },
  'Specialists': {
    te: 'స్పెషలిస్ట్‌లు',
    hi: 'विशेषज्ञ'
  },
  'Patient Care': {
    te: 'రోగుల సంరక్షణ',
    hi: 'मरीज देखभाल'
  },
  'All Media': {
    te: 'అన్ని మీడియా',
    hi: 'सभी मीडिया'
  },
  'Facility Photos': {
    te: 'హాస్పిటల్ ఫోటోలు',
    hi: 'परिसर फोटो'
  },
  'Videos & Social Media': {
    te: 'వీడియోలు & సోషల్ మీడియా',
    hi: 'वीडियो एवं सोशल मीडिया'
  },
  'Hospital Infrastructure & Media': {
    te: 'హాస్పిటల్ మౌలిక వసతులు & మీడియా',
    hi: 'अस्पताल अवसंरचना एवं मीडिया'
  },
  'Hospital Media & Facility Gallery': {
    te: 'హాస్పిటల్ మీడియా & సౌకర్యాల గ్యాలరీ',
    hi: 'अस्पताल मीडिया एवं परिसर गैलरी'
  },
  'Take a visual tour of our sanitized day-care transfusion beds, clinical bio-analyzer laboratory, outpatient chambers, and video insights from our medical consultants.': {
    te: 'మా పరిశుభ్రమైన డేకేర్ రక్త మార్పిడి పడకలు, బయో-ఎనలైజర్ లేబొరేటరీ, అవుట్‌పేషెంట్ గదులు మరియు వైద్యుల వీడియోలను ఇక్కడ చూడండి.',
    hi: 'हमारे स्वच्छ डेकेयर रक्त आधान बेड, बायो-एनालाइजर प्रयोगशाला, आउटपेशेंट कक्षों और डॉक्टरों के वीडियो का दृश्य अवलोकन करें।'
  },
  'No media items found in this section.': {
    te: 'ఈ విభాగంలో మీడియా అంశాలు ఏవీ కనుగొనబడలేదు.',
    hi: 'इस अनुभाग में कोई मीडिया आइटम नहीं मिला।'
  },
  'Hospital Media': {
    te: 'హాస్పిటల్ మీడియా',
    hi: 'अस्पताल मीडिया'
  },

  // Contact Page Labels & Messages
  'Hospital Location & Helpdesk': {
    te: 'హాస్పిటల్ లొకేషన్ & హెల్ప్‌డెస్క్',
    hi: 'अस्पताल स्थान एवं सहायता केंद्र'
  },
  'Get in Touch with Our Clinical Team': {
    te: 'మా క్లినికల్ బృందాన్ని సంప్రదించండి',
    hi: 'हमारी मेडिकल टीम से संपर्क करें'
  },
  'Located conveniently on Nehru Road, Khammam. We are open for daily OPD consultations, routine diagnostic collection, 24/7 emergency response, and 24-hour in-house blood bank support.': {
    te: 'ఖమ్మం నెహ్రూ రోడ్‌లో సౌకర్యవంతంగా ఉంది. రోజువారీ OPD కన్సల్టేషన్‌లు, డయాగ్నోస్టిక్ కలెక్షన్, 24/7 అత్యవసర సేవలు మరియు 24 గంటల ఇన్-హౌస్ బ్లడ్ బ్యాంక్ సేవలు అందుబాటులో ఉంటాయి.',
    hi: 'नेहरू रोड, खम्मम पर स्थित। दैनिक ओपीडी परामर्श, नियमित डायग्नोस्टिक संग्रह, 24/7 आपातकालीन सेवा और 24 घंटे इन-हाउस ब्लड बैंक सहायता उपलब्ध है।'
  },
  'Phone / Emergency Support': {
    te: 'ఫోన్ / అత్యవసర సంప్రదింపులు',
    hi: 'फ़ोन / आपातकालीन सहायता'
  },
  'Email Communications': {
    te: 'ఈమెయిల్ సంప్రదింపులు',
    hi: 'ईमेल संचार'
  },
  'Operating Hours & Facilities': {
    te: 'సేవా వేళలు & సౌకర్యాలు',
    hi: 'कार्य समय एवं सुविधाएं'
  },
  '24/7 Emergency Medical Response': {
    te: '24/7 అత్యవసర వైద్య సేవలు',
    hi: '24/7 आपातकालीन चिकित्सा प्रतिक्रिया'
  },
  'Rithanya Blood Bank 24 Hours Available': {
    te: 'రితన్య బ్లడ్ బ్యాంక్ 24 గంటలూ అందుబాటులో ఉంది',
    hi: 'रिथन्या ब्लड बैंक 24 घंटे उपलब्ध'
  },
  'Aarogyasri Facility for Sickle Cell & Thalassemia Children': {
    te: 'సికిల్ సెల్ & తలసేమియా చిన్నారులకు ఉచిత ఆరోగ్యశ్రీ సౌకర్యం',
    hi: 'सिकल सेल एवं थैलेसीमिया पीड़ित बच्चों हेतु आरोग्यश्री सुविधा'
  },
  'Aarogyasri Facility for Sickle Cell Anemia & Thalassemia Children': {
    te: 'సికిల్ సెల్ ఎనీమియా & తలసేమియా చిన్నారులకు ఉచిత ఆరోగ్యశ్రీ సౌకర్యం',
    hi: 'सिकल सेल एनीमिया एवं थैलेसीमिया पीड़ित बच्चों हेतु आरोग्यश्री सुविधा'
  },
  'Send a Direct Clinical Message': {
    te: 'నేరుగా సందేశం పంపండి',
    hi: 'सीधा संदेश भेजें'
  },
  'Have questions regarding blood transfusion daycare beds, lab diagnostics, or doctor consultation? Leave a message below.': {
    te: 'రక్త మార్పిడి డేకేర్ పడకలు, ల్యాబ్ డయాగ్నోస్టిక్స్ లేదా డాక్టర్ కన్సల్టేషన్ గురించి ప్రశ్నలు ఉన్నాయా? దిగువన సందేశాన్ని తెలియజేయండి.',
    hi: 'रक्त आधान डेकेयर बेड, लैब डायग्नोस्टिक्स या डॉक्टर परामर्श के बारे में प्रश्न हैं? नीचे एक संदेश छोड़ें।'
  },
  'Your Name': {
    te: 'మీ పూర్తి పేరు',
    hi: 'आपका पूरा नाम'
  },
  'Email Address (Optional)': {
    te: 'ఈమెయిల్ చిరునామా (ఐచ్ఛికం)',
    hi: 'ईमेल पता (वैकल्पिक)'
  },
  'Message / Inquiry Details': {
    te: 'సందేశం / విచారణ వివరాలు',
    hi: 'संदेश / पूछताछ विवरण'
  },
  'Please specify your query...': {
    te: 'దయచేసి మీ సందేహాన్ని ఇక్కడ రాయండి...',
    hi: 'कृपया अपना प्रश्न यहां लिखें...'
  },
  'Transmit Message': {
    te: 'సందేశాన్ని పంపండి',
    hi: 'संदेश भेजें'
  },
  'Message Sent Successfully!': {
    te: 'సందేశం విజయవంతంగా పంపబడింది!',
    hi: 'संदेश सफलतापूर्वक भेजा गया!'
  },
  'Our administrative coordinator will contact you shortly.': {
    te: 'మా అడ్మినిస్ట్రేటివ్ కోఆర్డినేటర్ త్వరలో మిమ్మల్ని సంప్రదిస్తారు.',
    hi: 'हमारे प्रशासनिक समन्वयक शीघ्र ही आपसे संपर्क करेंगे।'
  },
  'Send Another Message': {
    te: 'మరొక సందేశం పంపండి',
    hi: 'दूसरा संदेश भेजें'
  },
  'Please enter your name and phone number': {
    te: 'దయచేసి మీ పేరు మరియు ఫోన్ నంబర్‌ను నమోదు చేయండి',
    hi: 'कृपया अपना नाम और फ़ोन नंबर दर्ज करें'
  },
  'Your inquiry has been sent to Rithanya Hospital.': {
    te: 'మీ సందేశం రితన్య హాస్పిటల్‌కు చేరింది.',
    hi: 'आपकी पूछताछ रिथन्या अस्पताल को भेज दी गई है।'
  },
  'Failed to send inquiry': {
    te: 'సందేశం పంపడం విఫలమైంది',
    hi: 'पूछताछ भेजने में विफल'
  },

  // Blogs & Tags
  'Recently Published': {
    te: 'ఇటీవల ప్రచురించబడింది',
    hi: 'हाल ही में प्रकाशित'
  },
  '4 min read': {
    te: '4 నిమిషాల పఠనం',
    hi: '4 मिनट का पठन'
  },
  'Diabetes': {
    te: 'మధుమేహం / డయాబెటిస్',
    hi: 'मधुमेह'
  },
  'Thalassemia': {
    te: 'తలసేమియా',
    hi: 'थैलेसीमिया'
  },
  'Lifestyle': {
    te: 'జీవనశైలి',
    hi: 'जीवनशैली'
  },
  'Tags': {
    te: 'ట్యాగ్‌లు',
    hi: 'टैग'
  },
  'Back to Health Insights': {
    te: 'హెల్త్ లైబ్రరీకి తిరిగి వెళ్లండి',
    hi: 'हेल्थ लाइब्रेरी पर वापस जाएं'
  },
  'Article Not Found': {
    te: 'వ్యాసం కనుగొనబడలేదు',
    hi: 'लेख नहीं मिला'
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
  if (localized.caption) localized.caption = localizeText(localized.caption, lang);
  if (localized.duration) localized.duration = localizeText(localized.duration, lang);
  if (localized.author) localized.author = localizeText(localized.author, lang);
  if (localized.readTime) localized.readTime = localizeText(localized.readTime, lang);

  if (Array.isArray(localized.tags)) {
    localized.tags = localized.tags.map((t) => localizeText(t, lang));
  }
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
