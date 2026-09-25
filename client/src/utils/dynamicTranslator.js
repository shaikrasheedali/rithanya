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

  // Gallery & Media Labels
  'Gallery': {
    te: 'గ్యాలరీ',
    hi: 'गैलरी'
  },
  'Hospital Infrastructure & Facilities': {
    te: 'హాస్పిటల్ మౌలిక సదుపాయాలు & సదుపాయాలు',
    hi: 'अस्पताल के बुनियादी ढांचे और सुविधाएं'
  },
  'All Media': {
    te: 'అన్ని మీడియా',
    hi: 'सभी मीडिया'
  },
  'Facility Photos': {
    te: 'హాస్పిటల్ ఫోటోలు',
    hi: 'परिसर की तस्वीरें'
  },
  'Videos & Social Media': {
    te: 'వీడియోలు & సోషల్ మీడియా',
    hi: 'वीडियो एवं सोशल मीडिया'
  },
  'Photos & Videos': {
    te: 'ఫోటోలు & వీడియోలు',
    hi: 'तस्वीरें एवं वीडियो'
  },
  'Carousel': {
    te: 'క్యారౌసెల్',
    hi: 'हिंडोला (कैरोज़ल)'
  },
  'Single Video': {
    te: 'సింగిల్ వీడియో',
    hi: 'एकल वीडियो'
  },
  'Single Image': {
    te: 'సింగిల్ చిత్రం',
    hi: 'एकल छवि'
  },
  'Open on Social Platform': {
    te: 'సోషల్ ప్లాట్‌ఫారమ్‌లో చూడండి',
    hi: 'सोशल प्लेटफॉर्म पर देखें'
  },
  'Loading hospital gallery items...': {
    te: 'హాస్పిటల్ గ్యాలరీ అంశాలు లోడ్ అవుతున్నాయి...',
    hi: 'अस्पताल गैलरी लोड हो रही है...'
  },
  'No media items found in this section.': {
    te: 'ఈ విభాగంలో మీడియా అంశాలేవీ కనుగొనబడలేదు.',
    hi: 'इस अनुभाग में कोई मीडिया आइटम नहीं मिला।'
  },
  'Photo': {
    te: 'ఫోటో',
    hi: 'फोटो'
  },
  'Video': {
    te: 'వీడియో',
    hi: 'वीडियो'
  },

  
  // Database Treatment Title Exact Matches (including Telugu parentheticals)
  'Malaria (మలేరియా)': {
    te: 'మలేరియా',
    hi: 'मलेरिया'
  },
  'Dengue (డెంగ్యూ)': {
    te: 'డెంగ్యూ',
    hi: 'डेंगू'
  },
  'Dizziness / Vertigo (తల తిరుగుట)': {
    te: 'తల తిరుగుట (వెర్టిగో)',
    hi: 'चक्कर आना (वर्टिगो)'
  },
  'Muscle Cramps/Pains in Sleep (నిద్రలో కండరాల నొప్పులు)': {
    te: 'నిద్రలో కండరాల నొప్పులు',
    hi: 'नींद में मांसपेशियों में ऐंठन और दर्द'
  },
  'Asthma (అస్తమా (ఉబ్బసం))': {
    te: 'అస్తమా (ఉబ్బసం)',
    hi: 'अस्थमा (दमा)'
  },
  'BP / Hypertension (బి.పి.)': {
    te: 'బి.పి. / అధిక రక్తపోటు',
    hi: 'बीपी / उच्च रक्तचाप (हाइपरटेंशन)'
  },
  'Nerve Weakness (నరముల బలహీనత)': {
    te: 'నరముల బలహీనత',
    hi: 'नसों की कमजोरी (न्यूरोपैथी)'
  },
  'Headache (తలనొప్పి)': {
    te: 'తలనొప్పి',
    hi: 'सिरदर्द'
  },
  'Constipation (మలబద్ధకం)': {
    te: 'మలబద్ధకం',
    hi: 'कब्ज (कॉन्स्टिपेशन)'
  },
  'Erectile Dysfunction (అంగస్తంభన లేకపోవడం)': {
    te: 'అంగస్తంభన లోపం / లైంగిక బలహీనత',
    hi: 'स्तंभन दोष (इरेक्टाइल डिसफंक्शन)'
  },
  'Forgetfulness, Anxiety (మతిమరుపు, ఆందోళన)': {
    te: 'మతిమరుపు, ఆందోళన & డిప్రెషన్',
    hi: 'भूलने की बीमारी एवं चिंता (एंग्जायटी)'
  },
  'COVID-19 (కోవిడ్-19)': {
    te: 'కోవిడ్-19 & వైరల్ ఇన్ఫెక్షన్లు',
    hi: 'कोविड-19 एवं वायरल संक्रमण'
  },
  'Numbness, Allergy (తిమ్మిర్లు, ఎలర్జీ)': {
    te: 'తిమ్మిర్లు & అలర్జీలు',
    hi: 'सुन्नता एवं एलर्जी'
  },
  'Mental / Psychological Issues (మానసిక సమస్యలు)': {
    te: 'మానసిక సమస్యలు & ఒత్తిడి నివారణ',
    hi: 'मानसिक एवं मनोवैज्ञानिक समस्याएं'
  },
  'Poisoning (పాయిజనింగ్)': {
    te: 'విష ప్రభావం / పాయిజనింగ్ అత్యవసర చికిత్స',
    hi: 'विषाक्तता (पॉइजनिंग) आपातकालीन उपचार'
  },
  'Typhoid (టైఫాయిడ్)': {
    te: 'టైఫాయిడ్ జ్వరం',
    hi: 'टाइफाइड बुखार'
  },
  'Breathlessness / Fatigue (ఆయాసం)': {
    te: 'ఆయాసం & తీవ్ర నీరసం',
    hi: 'सांस फूलना एवं अत्यधिक थकान'
  },
  'Cough, Cold (దగ్గు, జలుబు)': {
    te: 'దగ్గు, జలుబు & శ్వాసకోశ ఇన్ఫెక్షన్లు',
    hi: 'खांसी, जुकाम एवं श्वसन संक्रमण'
  },
  'Migraine Headache (మైగ్రెయిన్ తలనొప్పి)': {
    te: 'మైగ్రెయిన్ తలనొప్పి',
    hi: 'माइग्रेन सिरदर्द'
  },
  'Kidney Stones, Kidney Diseases (కిడ్నీలో రాళ్లు, కిడ్నీ వ్యాధులు)': {
    te: 'కిడ్నీలో రాళ్లు & కిడ్నీ వ్యాధులు',
    hi: 'गुर्दे की पथरी एवं गुर्दे के रोग'
  },
  'Neck Pains (మెడనొప్పులు)': {
    te: 'మెడనొప్పులు & సర్వైకల్ స్పాండిలైటిస్',
    hi: 'गर्दन का दर्द एवं सर्वाइकल'
  },
  'Thyroid (థైరాయిడ్)': {
    te: 'థైరాయిడ్ సమస్యలు (హైపో/హైపర్ థైరాయిడిజం)',
    hi: 'थायराइड विकार (हाइपो/हाइपर)'
  },
  'Sugar / Diabetes (షుగర్)': {
    te: 'షుగర్ వ్యాధి / డయాబెటిస్ సంరక్షణ',
    hi: 'शुगर / मधुमेह (डायबिटीज) व्यापक देखभाल'
  },
  'Stomach Burning / Acidity (కడుపులో మంట)': {
    te: 'కడుపులో మంట, అసిడిటీ & గ్యాస్ సమస్యలు',
    hi: 'पेट में जलन, एसिडिटी एवं गैस्ट्रिक समस्याएं'
  },
  'Phlegm / Fluid in Lungs (ఊపిరితిత్తులలో నెమ్ము)': {
    te: 'ఊపిరితిత్తులలో నెమ్ము / కఫం',
    hi: 'फेफड़ों में कफ / पानी का जमाव'
  },
  'Joint Pains (జాయింట్ నొప్పులు)': {
    te: 'కీళ్ల నొప్పులు & ఆర్థరైటిస్',
    hi: 'जोड़ों का दर्द एवं गठिया (आर्थराइटिस)'
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
  'Nehru nagar Road 24-Hour Transfusion & Thalassemia Daycare Support': {
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
  'Nehru nagar Road Campus • Khammam': {
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
  'Every patient consultation is personally reviewed by our lead consultants. Backed by 24/7 in-house emergency support, digital diagnostic labs, and the Rithanya 24 Hours Blood Bank on Nehru nagar Road, Khammam.': {
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
  'Located conveniently on Nehru nagar Road, Khammam. We are open for daily OPD consultations, routine diagnostic collection, 24/7 emergency response, and 24-hour in-house blood bank support.': {
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


  // Comprehensive Treatment Categories, Blog Sentences, 40 Summaries, UI Actions
  "Infectious Diseases": {
    te: "ఇన్‌ఫెక్షన్లు & అంటువ్యాధులు",
    hi: "संक्रामक रोग"
  },
  "Infectious Diseases & Daycare": {
    te: "అంటువ్యాధులు & డేకేర్ సెంటర్",
    hi: "संक्रामक रोग एवं डेकेयर"
  },
  "ENT & Neurology": {
    te: "ఈఎన్‌టీ & న్యూరాలజీ (చెవి, గొంతు & నరాలు)",
    hi: "ईएनटी एवं न्यूरोलॉजी"
  },
  "Neuromuscular Medicine": {
    te: "న్యూరోమస్కులర్ మెడిసిన్ (కండరాలు & నరాలు)",
    hi: "न्यूरोमस्कुलर मेडिसिन"
  },
  "Pulmonology & Respiratory": {
    te: "పల్మోనాలజీ & శ్వాసకోశ విభాగం",
    hi: "श्वसन एवं फेफड़े रोग"
  },
  "Cardiovascular & Metabolic": {
    te: "కార్డియోవాస్కులర్ & మెటబాలిక్ (గుండె & జీవక్రియ)",
    hi: "हृदय एवं चयापचय रोग"
  },
  "Neurology & Diabetology": {
    te: "న్యూరాలజీ & డయాబెటాలజీ (నరాలు & మధుమేహం)",
    hi: "न्यूरोलॉजी एवं मधुमेह"
  },
  "Neurology": {
    te: "న్యూరాలజీ (నరాల వ్యాధులు)",
    hi: "न्यूरोलॉजी (तंत्रिका रोग)"
  },
  "Gastroenterology": {
    te: "గ్యాస్ట్రోఎంటరాలజీ (జీర్ణకోశ వ్యాధులు)",
    hi: "गैस्ट्रोएंटरोलॉजी (पेट व पाचन रोग)"
  },
  "Men's Health & Diabetology": {
    te: "పురుషుల ఆరోగ్యం & డయాబెటాలజీ",
    hi: "पुरुष स्वास्थ्य एवं मधुमेह"
  },
  "Neurology & Geriatrics": {
    te: "న్యూరాలజీ & వృద్ధుల సంరక్షణ",
    hi: "न्यूरोलॉजी एवं वृद्धावस्था देखभाल"
  },
  "Respiratory & Infectious Diseases": {
    te: "శ్వాసకోశ & అంటువ్యాధులు",
    hi: "श्वसन एवं संक्रामक रोग"
  },
  "Immunology & Allergy": {
    te: "ఇమ్యునాలజీ & అలర్జీ",
    hi: "इम्यूनोलॉजी एवं एलर्जी"
  },
  "Behavioral Health": {
    te: "బిహేవియరల్ హెల్త్ (మానసిక ఆరోగ్యం)",
    hi: "मानसिक एवं व्यवहार स्वास्थ्य"
  },
  "Emergency Toxicology": {
    te: "ఎమర్జెన్సీ టాక్సికాలజీ (విష చికిత్స)",
    hi: "आपातकालीन विष विज्ञान"
  },
  "Nephrology & Urology": {
    te: "నెఫ్రాలజీ & యూరాలజీ (కిడ్నీ & మూత్రనాళం)",
    hi: "नेफ्रोलॉजी एवं यूरोलॉजी"
  },
  "Orthopedics & Spine": {
    te: "ఆర్థోపెడిక్స్ & వెన్నెముక సంరక్షణ",
    hi: "ऑर्थोपेडिक्स एवं स्पाइन"
  },
  "Clinical Diabetology": {
    te: "క్లినికల్ డయాబెటాలజీ (మధుమేహ వైద్యం)",
    hi: "क्लिनिकल मधुमेह विज्ञान"
  },
  "Pulmonology & Critical Care": {
    te: "పల్మోనాలజీ & క్రిటికల్ కేర్",
    hi: "पल्मोनोलॉजी एवं क्रिटिकल केयर"
  },
  "Rheumatology & Orthopedics": {
    te: "రుమటాలజీ & ఆర్థోపెడిక్స్ (కీళ్ళు & ఎముకలు)",
    hi: "रूमेटोलॉजी एवं हड्डी रोग"
  },
  "Neurology & Sleep Medicine": {
    te: "న్యూరాలజీ & నిద్ర రుగ్మతల వైద్యం",
    hi: "न्यूरोलॉजी एवं स्लीप मेडिसिन"
  },
  "Emergency Cardiology": {
    te: "ఎమర్జెన్సీ కార్డియాలజీ (అత్యవసర గుండె చికిత్స)",
    hi: "आपातकालीन कार्डियोलॉजी"
  },
  "Neurology & Rehabilitation": {
    te: "న్యూరాలజీ & పునరావాసం (రీహ్యాబిలిటేషన్)",
    hi: "न्यूरोलॉजी एवं पुनर्वास"
  },
  "Hepatology & Gastroenterology": {
    te: "హెపటాలజీ & గ్యాస్ట్రోఎంటరాలజీ (కాలేయం & జీర్ణకోశం)",
    hi: "हेपेटोलॉजी एवं गैस्ट्रोएंटरोलॉजी"
  },
  "Hematology & Daycare": {
    te: "హెమటాలజీ & డేకేర్ సెంటర్",
    hi: "हेमेटोलॉजी एवं डेकेयर"
  },
  "Emergency & Critical Toxicology": {
    te: "ఎమర్జెన్సీ & క్రిటికల్ టాక్సికాలజీ (విష చికిత్స)",
    hi: "आपातकालीन एवं विष विज्ञान"
  },
  "Rheumatology & Autoimmune": {
    te: "రుమటాలజీ & ఆటో ఇమ్యూన్ వ్యాధులు",
    hi: "रूमेटोलॉजी एवं ऑटोइम्यून रोग"
  },
  "Endocrinology & Men's Health": {
    te: "ఎండోక్రినాలజీ & పురుషుల ఆరోగ్యం",
    hi: "एंडोक्रिनोलॉजी एवं पुरुष स्वास्थ्य"
  },
  "Rheumatology & Infectious Diseases": {
    te: "రుమటాలజీ & అంటువ్యాధులు",
    hi: "रूमेटोलॉजी एवं संक्रामक रोग"
  },
  "Orthopedics & Geriatrics": {
    te: "ఆర్థోపెడిక్స్ & వృద్ధుల సంరక్షణ",
    hi: "ऑर्थोपेडिक्स एवं वृद्धावस्था देखभाल"
  },
  "Urology & Infection Care": {
    te: "యూరాలజీ & ఇన్‌ఫెక్షన్ కేర్",
    hi: "यूरोलॉजी एवं संक्रमण देखभाल"
  },
  "Clinical డయాబెటాలజీ": {
    te: "క్లినికల్ డయాబెటాలజీ (మధుమేహ వైద్యం)",
    hi: "क्लिनिकल मधुमेह विज्ञान"
  },
  "Neurology & డయాబెటాలజీ": {
    te: "న్యూరాలజీ & డయాబెటాలజీ (నరాలు & మధుమేహం)",
    hi: "न्यूरोलॉजी एवं मधुमेह"
  },
  "Men's Health & డయాబెటాలజీ": {
    te: "పురుషుల ఆరోగ్యం & డయాబెటాలజీ",
    hi: "पुरुष स्वास्थ्य एवं मधुमेह"
  },
  "Infectious Diseases & డేకేర్ సెంటర్": {
    te: "అంటువ్యాధులు & డేకేర్ సెంటర్",
    hi: "संक्रामक रोग एवं डेकेयर"
  },
  "Hematology & డేకేర్ సెంటర్": {
    te: "హెమటాలజీ & డేకేర్ సెంటర్",
    hi: "हेमेटोलॉजी एवं डेकेयर"
  },
  "ఎండోక్రినాలజీ & Men's Health": {
    te: "ఎండోక్రినాలజీ & పురుషుల ఆరోగ్యం",
    hi: "एंडोक्रिनोलॉजी एवं पुरुष स्वास्थ्य"
  },
  "Diabetic & Hypertension Management at Rithanya Hospital, Khammam": {
    te: "రితన్య హాస్పిటల్, ఖమ్మంలో మధుమేహం & రక్తపోటు సమగ్ర నిర్వహణ",
    hi: "रिथन्या अस्पताल, खम्मम में मधुमेह एवं उच्च रक्तचाप प्रबंधन"
  },
  "మధుమేహం / డయాబెటిస్ and hypertension (high blood pressure) are two common health conditions that require consistent medical care, regular monitoring, and lifestyle management. When they occur together, they can increase the risk of complications affecting the heart, kidneys, eyes, nerves, and blood vessels.": {
    te: "మధుమేహం / డయాబెటిస్ మరియు అధిక రక్తపోటు (హైపర్‌టెన్షన్) అనేవి నిరంతర వైద్య సంరక్షణ, క్రమబద్ధమైన పర్యవేక్షణ మరియు జీవనశైలి నిర్వహణ అవసరమయ్యే రెండు సాధారణ ఆరోగ్య సమస్యలు. ఇవి రెండూ కలిసి సంభవించినప్పుడు, గుండె, మూత్రపిండాలు, కళ్ళు, నరాలు మరియు రక్తనాళాలపై తీవ్రమైన సమస్యల ప్రమాదాన్ని పెంచుతాయి.",
    hi: "मधुमेह और उच्च रक्तचाप दो सामान्य स्वास्थ्य स्थितियां हैं जिनके लिए निरंतर चिकित्सा देखभाल, नियमित निगरानी और जीवनशैली प्रबंधन की आवश्यकता होती है। जब ये एक साथ होते हैं, तो हृदय, गुर्दे, आंखें, तंत्रिकाओं और रक्त वाहिकाओं को प्रभावित करने वाली जटिलताओं के जोखिम को बढ़ा सकते हैं।"
  },
  "is a chronic condition in which blood glucose (blood sugar) levels become elevated because the body does not produce enough insulin, does not use insulin effectively, or both.": {
    te: "అనేది శరీరం తగినంత ఇన్సులిన్‌ను ఉత్పత్తి చేయకపోవడం, ఇన్సులిన్‌ను సమర్థవంతంగా ఉపయోగించలేకపోవడం లేదా రెండింటి వల్ల రక్తంలో గ్లూకోజ్ (రక్తంలో చక్కెర) స్థాయిలు పెరిగే దీర్ఘకాలిక పరిస్థితి.",
    hi: "एक क्रोनिक स्थिति है जिसमें रक्त शर्करा का स्तर बढ़ जाता है क्योंकि शरीर पर्याप्त इंसुलिन का उत्पादन नहीं करता है, इंसुलिन का प्रभावी ढंग से उपयोग नहीं करता है, या दोनों।"
  },
  "Over time, uncontrolled diabetes may affect blood vessels and nerves, increasing the risk of heart disease, kidney disease, vision problems, and other complications.": {
    te: "సమయం గడిచేకొద్దీ, నియంత్రణ లేని మధుమేహం రక్తనాళాలు మరియు నరాలను ప్రభావితం చేస్తుంది, గుండె జబ్బులు, మూత్రపిండాల వ్యాధి, దృష్టి సమస్యలు మరియు ఇతర దుష్ప్రభావాల ప్రమాదాన్ని పెంచుతుంది.",
    hi: "समय के साथ, अनियंत्रित मधुमेह रक्त वाहिकाओं और नसों को प्रभावित कर सकता है, जिससे हृदय रोग, गुर्दे की बीमारी, दृष्टि की समस्याएं और अन्य जटिलताओं का खतरा बढ़ जाता है।"
  },
  "management focuses on:": {
    te: "నిర్వహణ ప్రధానంగా వీటిపై దృష్టి పెడుతుంది:",
    hi: "प्रबंधन इन बातों पर केंद्रित है:"
  },
  "Monitoring blood glucose levels.": {
    te: "రక్తంలో గ్లూకోజ్ స్థాయిలను క్రమం తప్పకుండా పర్యవేక్షించడం.",
    hi: "रक्त शर्करा के स्तर की नियमित निगरानी करना।"
  },
  "Following prescribed medications or insulin treatment.": {
    te: "వైద్యులు సూచించిన మందులు లేదా ఇన్సులిన్ చికిత్సను ఖచ్చితంగా పాటించడం.",
    hi: "निर्धारित दवाओं या इंसुलिन उपचार का नियमित पालन करना।"
  },
  "Maintaining a balanced diet.": {
    te: "సమతుల్య మరియు పోషకమైన ఆహారాన్ని తీసుకోవడం.",
    hi: "संतुलित और पौष्टिक आहार बनाए रखना।"
  },
  "Engaging in suitable physical activity.": {
    te: "తగిన శారీరక శ్రమ మరియు వ్యాయామాల్లో పాల్గొనడం.",
    hi: "उचित शारीरिक गतिविधि और व्यायाम में संलग्न होना।"
  },
  "Regular medical check-ups and complication screening.": {
    te: "క్రమబద్ధమైన వైద్య పరీక్షలు మరియు అవయవ దుష్ప్రభావాల స్క్రీనింగ్ చేయించుకోవడం.",
    hi: "नियमित स्वास्थ्य जांच और जटिलताओं की प्रारंभिक स्क्रीनिंग कराना।"
  },
  "Rapid antigen testing, peripheral blood smear Giemsa stain, Artemisinin-based combination therapy (ACT), and relapse eradication.": {
    te: "రాపిడ్ యాంటిజెన్ పరీక్ష, జిమ్సా స్టెయిన్ పెరిఫెరల్ బ్లడ్ స్మియర్, ఆర్టెమిసినిన్ ఆధారిత కాంబినేషన్ థెరపీ (ACT) మరియు వ్యాధి తిరగబెట్టకుండా సమగ్ర నివారణ.",
    hi: "रैपिड एंटीजन परीक्षण, परिधीय रक्त स्मीयर, आर्टेमिसिनिन-आधारित संयोजन चिकित्सा (ACT) और पुनः संक्रमण उन्मूलन।"
  },
  "Strict hematocrit hemoconcentration tracking, precision IV fluid titration, and 24/7 in-house Rithanya Blood Bank platelet standby.": {
    te: "హెమటోక్రిట్ రక్త సాంద్రత ఖచ్చితమైన ట్రాకింగ్, నియంత్రిత IV ఫ్లూయిడ్ టైట్రేషన్ మరియు 24/7 రితన్య బ్లడ్ బ్యాంక్ ప్లేట్‌లెట్ మద్దతు.",
    hi: "सटीक हेमेटोक्रिट ट्रैकिंग, नियंत्रित IV फ्लुइड्स और 24/7 रिथन्या ब्लड बैंक प्लेटलेट बैकअप।"
  },
  "Dix-Hallpike diagnostic test, Epley canalith repositioning, vestibular suppressant titration, and orthostatic BP screening.": {
    te: "డిక్స్-హాల్‌పైక్ నిర్ధారణ పరీక్ష, ఎప్లే కెనాలిత్ రీపొజిషనింగ్, వెస్టిబ్యులర్ థెరపీ మరియు ఆర్థోస్టాటిక్ రక్తపోటు స్క్రీనింగ్.",
    hi: "डिक्स-हॉलपाइक परीक्षण, एपले पैंतरेबाज़ी, वेस्टिबुलर थेरेपी और ऑर्थोस्टैटिक बीपी स्क्रीनिंग।"
  },
  "Electrolyte optimization, correction of occult magnesium and Vitamin D3 deficiency, and peripheral circulatory support.": {
    te: "ఎలక్ట్రోలైట్ల సమతుల్యత, మెగ్నీషియం మరియు విటమిన్ D3 లోపాల సవరణ మరియు రక్తప్రసరణ మెరుగుదల చికిత్స.",
    hi: "इलेक्ट्रोलाइट संतुलन, मैग्नीशियम व विटामिन D3 की कमी का सुधार और रक्त परिसंचरण समर्थन।"
  },
  "Airway hyperresponsiveness evaluation, metered-dose inhaler spacer coaching, and step-up/step-down long-term controller therapy.": {
    te: "శ్వాసనాళాల సున్నితత్వ పరీక్ష, సరైన ఇన్‌హేలర్ వాడకంపై శిక్షణ మరియు దీర్ఘకాలిక శ్వాసకోశ నియంత్రణ చికిత్స.",
    hi: "वायुमार्ग संवेदनशीलता मूल्यांकन, इनहेलर स्पेसर मार्गदर्शन और दीर्घकालिक नियंत्रक उपचार।"
  },
  "Evidence-based blood pressure profiling, ambulatory continuous monitoring, end-organ vascular protection, and customized dietary sodium management.": {
    te: "సాక్ష్యాధారిత రక్తపోటు ప్రొఫైలింగ్, నిరంతర ఆంబులేటరీ పర్యవేక్షణ, అవయవ రక్తనాళాల రక్షణ మరియు ఉప్పు నియంత్రణ ఆహార ప్రణాళిక.",
    hi: "साक्ष्य-आधारित रक्तचाप प्रोफाइलिंग, निरंतर निगरानी, अंग सुरक्षा और व्यक्तिगत आहार योजना।"
  },
  "Quantitative biothesiometry, 10-point monofilament testing, neurotrophic pharmacological support, and diabetic foot protection.": {
    te: "క్వాంటిటేటివ్ బయోథీసియోమెట్రీ, 10-పాయింట్ మోనోఫిలమెంట్ పరీక్ష, న్యూరోట్రోఫిక్ మందుల మద్దతు మరియు డయాబెటిక్ పాద రక్షణ.",
    hi: "मात्रात्मक बायोथिसियोमेट्री, 10-बिंदु मोनोफिलामेंट परीक्षण, न्यूरोट्रॉफिक दवाएं और पैर सुरक्षा।"
  },
  "Cranial nerve neurological evaluation, exclusion of secondary hypertension or intracranial causes, and ergonomic therapy.": {
    te: "క్రేనియల్ నరాల పరీక్ష, అధిక రక్తపోటు లేదా ఇతర తీవ్ర సమస్యల పరిశీలన మరియు ఎర్గోనామిక్ జీవనశైలి చికిత్స.",
    hi: "कपालीय तंत्रिका मूल्यांकन, माध्यमिक कारणों का बहिष्कार और एर्गोनोमिक थेरेपी।"
  },
  "Dietary soluble/insoluble fiber optimization, metabolic motility evaluation (thyroid, diabetes), and safe non-habit-forming laxatives.": {
    te: "పీచు పదార్థాల ఆహార మార్గదర్శనం, థైరాయిడ్ మరియు మధుమేహ జీర్ణకోశ పనితీరు విశ్లేషణ మరియు అలవాటుకాని సురక్షిత మందులు.",
    hi: "आहार में फाइबर अनुकूलन, मेटाबॉलिक गतिशीलता मूल्यांकन और सुरक्षित गैर-आदतकारी दवाएं।"
  },
  "Discreet confidential consultation addressing endothelial function, testosterone levels, glycemic control, and safe PDE-5 inhibitors.": {
    te: "రహస్యమైన వ్యక్తిగత సంప్రదింపులు, టెస్టోస్టెరాన్ స్థాయిలు, రక్తనాళాల పనితీరు, షుగర్ నియంత్రణ మరియు సురక్షిత వైద్య చికిత్స.",
    hi: "गोपनीय परामर्श, टेस्टोस्टेरोन स्तर, एंडोथेलियल कार्य, रक्त शर्करा नियंत्रण और सुरक्षित उपचार।"
  },
  "Cognitive mental status examination (MMSE), ruling out pseudodementia from B12 deficiency, and neuro-calming therapies.": {
    te: "కాగ్నిటివ్ మెంటల్ స్టేటస్ పరీక్ష (MMSE), విటమిన్ B12 లోపం పరిశీలన మరియు నరాల ఉపశమన చికిత్సలు.",
    hi: "संज्ञानात्मक मानसिक स्थिति परीक्षण (MMSE), बी12 की कमी की जांच और तंत्रिका-शांत करने वाली चिकित्सा।"
  },
  "Rapid antigen testing, SpO2 monitoring, inflammatory marker evaluation, and evidence-based post-viral recovery rehabilitation.": {
    te: "రాపిడ్ యాంటిజెన్ పరీక్ష, SpO2 పర్యవేక్షణ, ఇన్ఫ్లమేటరీ మార్కర్ల విశ్లేషణ మరియు పోస్ట్-వైరల్ రికవరీ పునరావాసం.",
    hi: "रैपिड एंटीजन परीक्षण, SpO2 निगरानी, इंफ्लेमेटरी मार्कर मूल्यांकन और रिकवरी पुनर्वास।"
  },
  "Allergen identification, non-sedating antihistamine therapy, systemic stabilization, and cutaneous sensory nerve mapping.": {
    te: "అలెర్జెన్ గుర్తింపు, మత్తు కలిగించని యాంటీహిస్టామైన్లు, శరీర స్థిరీకరణ మరియు చర్మ స్పర్శ నరాల మ్యాపింగ్.",
    hi: "एलर्जेन पहचान, गैर-शामक एंटीहिस्टामाइन थेरेपी और संवेदी तंत्रिका मैपिंग।"
  },
  "Confidential empathetic clinical consultation, ruling out organic endocrine imbalances (Thyroid, B12), and supportive therapy.": {
    te: "గోప్యమైన సానుభూతిపూర్వక కన్సల్టేషన్, థైరాయిడ్ మరియు B12 హార్మోన్ల అసమతుల్యత పరిశీలన మరియు మానసిక మద్దతు.",
    hi: "गोपनीय सहानुभूतिपूर्ण परामर्श, हार्मोनल असंतुलन की जांच और सहायक चिकित्सा।"
  },
  "Rapid gastric decontamination, targeted antidote administration (Atropine, PAM), ICU hemodynamic resuscitation, and biochemical monitoring.": {
    te: "తక్షణ గ్యాస్ట్రిక్ వాష్, నిర్దిష్ట విరుగుడు మందులు (Atropine, PAM), ICU అత్యవసర స్థిరీకరణ మరియు బయోకెమికల్ మానిటరింగ్.",
    hi: "त्वरित गैस्ट्रिक परिशोधन, लक्षित मारक दवाएं (एट्रोपिन, पीएएम), आईसीयू स्थिरीकरण और निगरानी।"
  },
  "TyphiDot IgM antibody testing, sensitive antibiotic regimens overcoming multi-drug resistance, and enteric dietary nutrition.": {
    te: "టైఫీడాట్ IgM యాంటీబాడీ పరీక్ష, ఖచ్చితమైన యాంటీబయాటిక్ చికిత్స మరియు జీర్ణకోశానికి అనువైన పోషకాహార మద్దతు.",
    hi: "टाइफीडॉट आईजीएम एंटीबॉडी परीक्षण, सटीक एंटीबायोटिक उपचार और आंत्र पोषण आहार।"
  },
  "Multisystem workup identifying occult anemia, cardiopulmonary insufficiency, electrolyte imbalances, and metabolic decompensation.": {
    te: "రక్తహీనత, గుండె-ఊపిరితిత్తుల పనితీరు, ఎలక్ట్రోలైట్ అసమతుల్యత మరియు మెటబాలిక్ లోపాలను గుర్తించే సమగ్ర పరీక్షలు.",
    hi: "एनीमिया, कार्डियोपल्मोनरी कार्यप्रणाली, इलेक्ट्रोलाइट असंतुलन और मेटाबॉलिक जांच।"
  },
  "Targeted symptomatic relief, rational antibiotic stewardship, soothing saline nebulization, and secondary infection prevention.": {
    te: "లక్షణాల ఉపశమనం, సరైన యాంటీబయాటిక్ వినియోగం, సెలైన్ నెబ్యులైజేషన్ మరియు ద్వితీయ ఇన్ఫెక్షన్ల నివారణ.",
    hi: "लक्षित लक्षणात्मक राहत, उचित एंटीबायोटिक उपयोग, सलाइन नेबुलाइजेशन और संक्रमण रोकथाम।"
  },
  "Abortive migraine therapy (triptans), evidence-based daily prophylaxis, trigger identification diary, and dark-room rest protocols.": {
    te: "మైగ్రెయిన్ నివారణ చికిత్స (ట్రిప్టాన్లు), రోజువారీ రోగనిరోధక మందులు, ట్రిగ్గర్ గుర్తింపు మరియు విశ్రాంతి ప్రణాళిక.",
    hi: "माइग्रेन निवारक चिकित्सा, दैनिक प्रोफिलैक्सिस, ट्रिगर पहचान और विश्राम प्रोटोकॉल।"
  },
  "High-resolution renal ultrasound, eGFR kidney function monitoring, stone medical expulsive therapy, and nephroprotective care.": {
    te: "హై-రిజల్యూషన్ కిడ్నీ అల్ట్రాసౌండ్, eGFR పనితీరు పర్యవేక్షణ, రాళ్లను కరిగించే వైద్య చికిత్స మరియు కిడ్నీ రక్షణ చర్యలు.",
    hi: "उच्च-रिज़ॉल्यूशन रीनल अल्ट्रासाउंड, eGFR कार्यप्रणाली निगरानी, पथरी निष्कासन थेरेपी और गुर्दा सुरक्षा।"
  },
  "Cervical spine curvature radiography, ergonomic postural corrections, targeted muscle relaxants, and cervical isometric exercises.": {
    te: "సర్వైకల్ స్పైన్ ఎక్స్-రే, పని కూర్చునే విధానం సవరణ, కండరాల రిలాక్సెంట్లు మరియు మెడ వ్యాయామాలు.",
    hi: "सर्वाइकल स्पाइन रेडियोग्राफी, एर्गोनोमिक सुधार, मांसपेशी रिलैक्सेंट और गर्दन के व्यायाम।"
  },
  "Chemiluminescent Free T3, Free T4, TSH quantitation, personalized Levothyroxine hormone titration, and metabolic balance.": {
    te: "ఫ్రీ T3, ఫ్రీ T4, TSH ఖచ్చితమైన ల్యాబ్ పరీక్షలు, వ్యక్తిగత లెవోథైరాక్సిన్ మోతాదు సర్దుబాటు మరియు జీవక్రియ సమతుల్యత.",
    hi: "फ्री T3, फ्री T4, TSH सटीक जांच, लेवोथायरोक्सिन खुराक समायोजन और चयापचय संतुलन।"
  },
  "Gold-standard HPLC glycated hemoglobin assessment, personalized insulin & oral medication titration, and early cardio-renal microvascular protection.": {
    te: "గోల్డ్-స్టాండర్డ్ HPLC హిమోగ్లోబిన్ పరీక్ష, వ్యక్తిగత ఇన్సులిన్ & మందుల సర్దుబాటు మరియు గుండె-కిడ్నీ రక్తనాళాల రక్షణ.",
    hi: "गोल्ड-स्टैंडर्ड HPLC एचबीए1सी परीक्षण, व्यक्तिगत इंसुलिन व दवाएं, और हृदय-गुर्दा सूक्ष्म संवहनी सुरक्षा।"
  },
  "Gastric acid suppression, Helicobacter pylori screening, mucosal cytoprotection, and personalized lifestyle/dietary guidance.": {
    te: "గ్యాస్ట్రిక్ యాసిడ్ నియంత్రణ, H. పైలోరీ బాక్టీరియా పరీక్ష, కడుపు పొరల రక్షణ మరియు జీవనశైలి/ఆహార మార్గదర్శకాలు.",
    hi: "गैस्ट्रिक एसिड नियंत्रण, एच. पाइलोरी स्क्रीनिंग, म्यूकोसल सुरक्षा और आहार मार्गदर्शन।"
  },
  "Clinical pulmonary auscultation, digital chest radiography, sputum cytology, and targeted antibiotic / diuretic clearing therapy.": {
    te: "ఊపిరితిత్తుల పరీక్ష, డిజిటల్ ఛాతీ ఎక్స్-రే, కఫం పరీక్ష మరియు టార్గెటెడ్ యాంటీబయాటిక్ / డయూరిటిక్ క్లియరెన్స్ చికిత్స.",
    hi: "फेफड़ों का नैदानिक परीक्षण, डिजिटल छाती एक्स-रे, बलगम जांच और एंटीबायोटिक जल निकासी उपचार।"
  },
  "Inflammatory vs degenerative joint differentiation, synovial preservation therapies, and physical rehabilitation regimens.": {
    te: "కీళ్ల వాపు మరియు అరుగుదల నిర్ధారణ, కీళ్ల ద్రవ సంరక్షణ చికిత్సలు మరియు ఫిజియోథెరపీ పునరావాసం.",
    hi: "जोड़ों की सूजन व घिसाव का विभेदन, श्लेष द्रव संरक्षण और भौतिक पुनर्वास।"
  },
  "Sleep hygiene recalibration, obstructive sleep apnea screening, circadian rhythm support, and non-addictive sleep restoration.": {
    te: "నిద్ర పరిశుభ్రత అలవాట్లు, స్లీప్ అప్నియా స్క్రీనింగ్, శరీర జీవ గడియార సమతుల్యత మరియు సురక్షిత నిద్ర పునరుద్ధరణ.",
    hi: "स्लीप हाइजीन सुधार, स्लीप एपनिया स्क्रीनिंग, सर्कैडियन लय समर्थन और सुरक्षित नींद बहाली।"
  },
  "Rapid 10-minute ECG triage, high-sensitivity cardiac troponin testing, emergency antiplatelet loading, and acute stabilization.": {
    te: "వేగవంతమైన 10 నిమిషాల ఈసీజీ, హై-సెన్సిటివిటీ ట్రోపోనిన్ రక్త పరీక్ష, అత్యవసర రక్తం పలచబడే మందులు మరియు స్థిరీకరణ.",
    hi: "त्वरित 10 मिनट ईसीजी, हाई-सेंसिटिविटी कार्डियक ट्रोपोनिन परीक्षण और आपातकालीन स्थिरीकरण।"
  },
  "Accurate differential testing excluding Dengue/Malaria, safe antipyretic titration, oral hydration, and outpatient recovery tracking.": {
    te: "డెంగ్యూ/మలేరియా కాదని నిర్ధారించే రక్త పరీక్షలు, సురక్షిత జ్వర నివారిణులు, ఓరల్ హైడ్రేషన్ మరియు అవుట్‌పేషెంట్ రికవరీ ట్రాకింగ్.",
    hi: "सटीक परीक्षण, सुरक्षित बुखार नाशक दवाएं, पर्याप्त जलयोजन और बाह्य रोगी रिकवरी।"
  },
  "Emergency stroke risk factor stabilization, secondary prevention (antiplatelet & statins), and comprehensive neuro-physiotherapy.": {
    te: "అత్యవసర స్ట్రోక్ నియంత్రణ, మళ్లీ రాకుండా రక్షణ (యాంటీప్లేట్‌లెట్ & స్టాటిన్స్) మరియు సమగ్ర న్యూరో-ఫిజియోథెరపీ.",
    hi: "आपातकालीन स्ट्रोक स्थिरीकरण, माध्यमिक रोकथाम दवाएं और व्यापक न्यूरो-फिजियोथेरेपी।"
  },
  "Direct vs indirect bilirubin profiling, viral hepatitis serology, liver enzyme tracking, and hepatobiliary ultrasound.": {
    te: "బిలిరుబిన్ రక్త ప్రొఫైల్, వైరల్ హెపటైటిస్ పరీక్షలు, లివర్ ఎంజైమ్‌ల ట్రాకింగ్ మరియు కాలేయ అల్ట్రాసౌండ్.",
    hi: "बिलीरुबिन प्रोफाइलिंग, वायरल हेपेटाइटिस सीरोलॉजी, लिवर एंजाइम और अल्ट्रासाउंड।"
  },
  "Etiological seizure evaluation, anti-epileptic drug (AED) optimization, therapeutic drug monitoring, and patient safety protocols.": {
    te: "మూర్ఛ కారణాల విశ్లేషణ, యాంటీ-ఎపిలెప్టిక్ ఔషధాల సమతుల్యత మరియు రోగి భద్రతా మార్గదర్శకాలు.",
    hi: "दौरे का कारण मूल्यांकन, मिर्गी रोधी दवा समायोजन और रोगी सुरक्षा प्रोटोकॉल।"
  },
  "HPLC hemoglobin electrophoresis differential diagnosis, IV iron sucrose infusion, and 24/7 leukodepleted blood transfusions in Khammam.": {
    te: "HPLC హిమోగ్లోబిన్ ఎలక్ట్రోఫోరేసిస్ నిర్ధారణ, IV ఐరన్ సుక్రోజ్ ఇన్ఫ్యూషన్ మరియు ఖమ్మంలో 24/7 ల్యూకోడెప్లీటెడ్ రక్త మార్పిడి.",
    hi: "HPLC हीमोग्लोबिन इलेक्ट्रोफोरेसिस निदान, IV आयरन सुक्रोज इन्फ्यूजन और 24/7 रक्त आधान।"
  },
  "24/7 immediate Polyvalent Anti-Snake Venom (ASV) administration, continuous hemodynamics, and venom crisis stabilization in Khammam.": {
    te: "ఖమ్మంలో 24/7 తక్షణ యాంటీ-స్నేక్ వెనమ్ (ASV) చికిత్స, నిరంతర రక్తపోటు పర్యవేక్షణ మరియు అత్యవసర విష స్థిరీకరణ.",
    hi: "खम्मम में 24/7 एंटी-स्नेक वेनम (ASV) प्रशासन, निरंतर निगरानी और आपातकालीन स्थिरीकरण।"
  },
  "Disease-Modifying Anti-Rheumatic Drug (DMARD) management, anti-CCP serological testing, and joint deformity prevention.": {
    te: "DMARD మందుల నిర్వహణ, యాంటీ-CCP రక్త పరీక్షలు మరియు కీళ్ల వంపులను నివారించే ఆధునిక చికిత్సలు.",
    hi: "DMARD दवा प्रबंधन, एंटी-सीसीपी परीक्षण और जोड़ों की विकृति की रोकथाम।"
  },
  "Comprehensive hormonal evaluation (Testosterone, Prolactin, Thyroid), managing medication side effects, and restoring vitality.": {
    te: "హార్మోన్ల సమగ్ర పరీక్షలు (టెస్టోస్టెరాన్, ప్రోలాక్టిన్, థైరాయిడ్), మందుల దుష్ప్రభావాల సవరణ మరియు శారీరక ఉత్తేజ పునరుద్ధరణ.",
    hi: "हार्मोनल मूल्यांकन (टेस्टोस्टेरोन, थायराइड), दवा के दुष्प्रभावों का प्रबंधन और जीवन शक्ति की बहाली।"
  },
  "Serological IgM confirmation, tailored analgesic anti-inflammatory therapy, and physical therapy preventing chronic joint stiffness.": {
    te: "IgM యాంటీబాడీ నిర్ధారణ, నొప్పి మరియు వాపు నివారణ చికిత్స మరియు కీళ్ల బిగుతును నివారించే ఫిజియోథెరపీ.",
    hi: "आईजीएम पुष्टि, दर्द निवारक एंटी-इंफ्लेमेटरी थेरेपी और जोड़ों की अकड़न रोकने हेतु फिजियोथेरेपी।"
  },
  "Weight-bearing knee radiography, chondroprotective nutrition, quadriceps isometric strengthening, and joint preservation.": {
    te: "మోకాలి బరువు మోసే ఎక్స్-రే, మృదులాస్థి పోషకాహార మద్దతు, కండరాల బలోపేత వ్యాయామాలు మరియు కీళ్ల రక్షణ.",
    hi: "घुटने की रेडियोग्राफी, कार्टिलेज सुरक्षा पोषण, क्वाड्रिसेप्स व्यायाम और जोड़ संरक्षण।"
  },
  "Gastrointestinal motility evaluation, dietary trigger elimination, eradication of gut dysbiosis, and tailored digestive enzyme therapy.": {
    te: "జీర్ణకోశ కదలికల పరీక్ష, హానికర ఆహారాల నివారణ, పేగుల్లో మంచి బాక్టీరియా పెంపు మరియు జీర్ణ ఎంజైమ్ల చికిత్స.",
    hi: "जठरांत्र गतिशीलता मूल्यांकन, आहार ट्रिगर उन्मूलन और एंजाइम थेरेपी।"
  },
  "Automated urine microscopy, pathogen-specific antibiotic regimens, urine alkalinization, and recurrent UTI prevention.": {
    te: "ఆటోమేటెడ్ మూత్ర మైక్రోస్కోపీ, బ్యాక్టీరియా నిర్దిష్ట యాంటీబయాటిక్స్, యూరిన్ ఆల్కలనైజేషన్ మరియు పునరావృత ఇన్ఫెక్షన్ల నివారణ.",
    hi: "स्वचालित मूत्र माइक्रोस्कोपी, रोगज़नक़-विशिष्ट एंटीबायोटिक्स और आवर्तक यूटीआई रोकथाम।"
  },
  "Read Article": {
    te: "వ్యాసం చదవండి",
    hi: "लेख पढ़ें"
  },
  "View Protocol": {
    te: "చికిత్స వివరాలు",
    hi: "प्रोटोकॉल देखें"
  },
  "In Stock — Dispatch": {
    te: "స్టాక్‌లో ఉంది — డెలివరీకి సిద్ధం",
    hi: "स्टॉक में उपलब्ध — प्रेषण"
  },
  "Details": {
    te: "వివరాలు",
    hi: "विवरण"
  },
  "Add": {
    te: "జోడించండి",
    hi: "जोड़ें"
  },
  "Draft": {
    te: "డ్రాఫ్ట్",
    hi: "ड्राफ्ट"
  },
  "Search clinical treatments...": {
    te: "చికిత్సలను శోధించండి...",
    hi: "उपचार व सेवाएं खोजें..."
  },
  "Search clinical conditions, medicines...": {
    te: "వ్యాధులు, మందులను శోధించండి...",
    hi: "रोग, दवाएं खोजें..."
  },
  "Gallery": {
    te: "గ్యాలరీ",
    hi: "गैलरी"
  },
  "Media Gallery": {
    te: "గ్యాలరీ",
    hi: "गैलरी"
  },
  "32% OFF": {
    te: "32% తగ్గింపు",
    hi: "32% छूट"
  },
  "28% OFF": {
    te: "28% తగ్గింపు",
    hi: "28% छूट"
  },
  "25% OFF": {
    te: "25% తగ్గింపు",
    hi: "25% छूट"
  },
  "30% OFF": {
    te: "30% తగ్గింపు",
    hi: "30% छूट"
  },
  "20% OFF": {
    te: "20% తగ్గింపు",
    hi: "20% छूट"
  },
  "15% OFF": {
    te: "15% తగ్గింపు",
    hi: "15% छूट"
  },
  "18% OFF": {
    te: "18% తగ్గింపు",
    hi: "18% छूट"
  },
  "22% OFF": {
    te: "22% తగ్గింపు",
    hi: "22% छूट"
  },
  "10% OFF": {
    te: "10% తగ్గింపు",
    hi: "10% छूट"
  },
  "Nehru nagar Road Campus • Khammam": {
    te: "నెహ్రూ నగర్ రోడ్ క్యాంపస్ • ఖమ్మం",
    hi: "नेहरू नगर रोड कैंपस • खम्मम"
  },
  "Nehru nagar Road 24-Hour Transfusion & Thalassemia Daycare Support": {
    te: "నెహ్రూ నగర్ రోడ్ 24-గంటల రక్త మార్పిడి & తలసేమియా డేకేర్ మద్దతు",
    hi: "नेहरू नगर रोड 24 घंटे रक्त आधान एवं थैलेसीमिया डेकेयर सहायता"
  },
  "Nehru nagar Road, Opp. Old L.I.C. Office, Khammam, Telangana 507001": {
    te: "నెహ్రూ నగర్ రోడ్, పాత ఎల్.ఐ.సి. ఆఫీస్ ఎదురుగా, ఖమ్మం, తెలంగాణ 507001",
    hi: "नेहरू नगर रोड, पुराने एल.आई.सी. कार्यालय के सामने, खम्मम, तेलंगाना 507001"
  },
  "Nehru nagar Road, Opposite Old L.I.C. Office, Khammam, Telangana 507001": {
    te: "నెహ్రూ నగర్ రోడ్, పాత ఎల్.ఐ.సి. ఆఫీస్ ఎదురుగా, ఖమ్మం, తెలంగాణ 507001",
    hi: "नेहरू नगर रोड, पुराने एल.आई.सी. कार्यालय के सामने, खम्मम, तेलंगाना 507001"
  },
  "Located conveniently on Nehru nagar Road, Khammam. We are open for daily OPD consultations, routine diagnostic collection, 24/7 emergency response, and 24-hour in-house blood bank support.": {
    te: "ఖమ్మంలోని నెహ్రూ నగర్ రోడ్డులో సౌకర్యవంతంగా కలదు. మేము రోజువారీ OPD సంప్రదింపులు, సాధారణ రోగనిర్ధారణ సేకరణ, 24/7 అత్యవసర స్పందన మరియు 24 గంటల ఇన్-హౌస్ బ్లడ్ బ్యాంక్ మద్దతు కోసం ఎల్లప్పుడూ అందుబాటులో ఉంటాము.",
    hi: "नेहरू नगर रोड, खम्मम पर स्थित। हम दैनिक ओपीडी परामर्श, नैदानिक संग्रह, 24/7 आपातकालीन प्रतिक्रिया और 24 घंटे ब्लड बैंक सहायता के लिए खुले हैं।"
  },
  "Every patient consultation is personally reviewed by our lead consultants. Backed by 24/7 in-house emergency support, digital diagnostic labs, and the Rithanya 24 Hours Blood Bank on Nehru nagar Road, Khammam.": {
    te: "ప్రతి రోగి సంప్రదింపులను మా ప్రధాన కన్సల్టెంట్లు వ్యక్తిగతంగా సమీక్షిస్తారు. 24/7 అత్యవసర మద్దతు, డిజిటల్ ల్యాబ్‌లు మరియు ఖమ్మం నెహ్రూ నగర్ రోడ్డులోని రితన్య 24 అవర్స్ బ్లడ్ బ్యాంక్ అండతో నడుస్తుంది.",
    hi: "प्रत्येक परामर्श की हमारे मुख्य सलाहकारों द्वारा व्यक्तिगत समीक्षा की जाती है। 24/7 आपातकालीन सहायता और नेहरू नगर रोड, खम्मम में रिथन्या 24 घंटे ब्लड बैंक का सहयोग।"
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
    "Article Not Found": {
    te: "వ్యాసం కనుగొనబడలేదు",
    hi: "लेख नहीं मिला"
  },
  "Understanding Diabetes and Hypertension": {
    te: "మధుమేహం (డయాబెటిస్) మరియు అధిక రక్తపోటు (బీపీ) సమగ్ర అవగాహన",
    hi: "मधुमेह (डायबिटीज) और उच्च रक्तचाप (बीपी) को समझना"
  },
  "What Is Diabetes?": {
    te: "మధుమేహం (డయాబెటిస్) అంటే ఏమిటి?",
    hi: "मधुमेह (डायबिटीज) क्या है?"
  },
  "What Is Hypertension?": {
    te: "అధిక రక్తపోటు (హైపర్‌టెన్షన్ / బీపీ) అంటే ఏమిటి?",
    hi: "उच्च रक्तचाप (हाइपरटेंशन / बीपी) क्या है?"
  },
  "With the right medical guidance, regular check-ups, and healthy lifestyle choices, many patients can work toward better control of blood sugar and blood pressure and reduce the risk of long-term complications.": {
    te: "సరైన వైద్య పర్యవేక్షణ, క్రమం తప్పని పరీక్షలు మరియు ఆరోగ్యకరమైన జీవనశైలితో రోగులు రక్తంలో చక్కెర మరియు రక్తపోటును చక్కగా నియంత్రణలో ఉంచుకోవచ్చు, దీర్ఘకాలిక సమస్యల ముప్పును తగ్గించుకోవచ్చు.",
    hi: "उचित चिकित्सकीय मार्गदर्शन, नियमित जांच और स्वस्थ जीवनशैली अपनाकर मरीज ब्लड शुगर और ब्लड प्रेशर को बेहतर तरीके से नियंत्रित कर सकते हैं और दीर्घकालिक जटिलताओं के जोखिम को कम कर सकते हैं।"
  },
  "Your health deserves consistent care. Manage diabetes. Control blood pressure. Protect your future.": {
    te: "మీ ఆరోగ్యం నిరంతర సంరక్షణకు అర్హమైనది. మధుమేహాన్ని నియంత్రించండి. రక్తపోటును అదుపులో ఉంచుకోండి. మీ భవిష్యత్తును రక్షించుకోండి.",
    hi: "आपका स्वास्थ्य निरंतर देखभाल का हकदार है। मधुमेह को प्रबंधित करें। रक्तचाप को नियंत्रित करें। अपने भविष्य को सुरक्षित रखें।"
  },
  "Diabetes is a chronic condition that occurs when the body either does not produce enough insulin, cannot effectively use the insulin it produces, or both, leading to elevated levels of glucose (blood sugar) in the blood.": {
    te: "మధుమేహం / డయాబెటిస్ అనేది శరీరం తగినంత ఇన్సులిన్‌ను ఉత్పత్తి చేయకపోవడం, ఇన్సులిన్‌ను సమర్థవంతంగా ఉపయోగించలేకపోవడం లేదా రెండింటి వల్ల రక్తంలో గ్లూకోజ్ (రక్తంలో చక్కెర) స్థాయిలు పెరిగే దీర్ఘకాలిక పరిస్థితి.",
    hi: "मधुमेह एक पुरानी स्थिति है जो तब होती है जब शरीर पर्याप्त इंसुलिन का उत्पादन नहीं करता है, इंसुलिन का प्रभावी ढंग से उपयोग नहीं कर पाता है, जिससे रक्त में ग्लूकोज (ब्लड शुगर) का स्तर बढ़ जाता है।"
  },
  "Diabetes, Thalassemia, Lifestyle": {
    te: "మధుమేహం, తలసేమియా మరియు ఆరోగ్యకర జీవనశైలి",
    hi: "मधुमेह, थैलेसीमिया और स्वस्थ जीवनशैली"
  },
  "Recently Published": {
    te: "ఇటీవల ప్రచురించబడింది",
    hi: "हाल ही में प्रकाशित"
  },
  "4 min read": {
    te: "4 నిమిషాల చదువు",
    hi: "4 मिनट का पठन"
  },
  "5 min read": {
    te: "5 నిమిషాల చదువు",
    hi: "5 मिनट का पठन"
  },
  "6 min read": {
    te: "6 నిమిషాల చదువు",
    hi: "6 मिनट का पठन"
  },
  "7 min read": {
    te: "7 నిమిషాల చదువు",
    hi: "7 मिनट का पठन"
  },
  "Dr D Narayana Murthy": {
    te: "డాక్టర్ డి. నారాయణ మూర్తి",
    hi: "डॉ. डी. नारायण मूर्ति"
  },
  "Dr D Narayana Murthy, MD": {
    te: "డాక్టర్ డి. నారాయణ మూర్తి, MD",
    hi: "डॉ. डी. नारायण मूर्ति, MD"
  },
  "Dr A Lakshmi Deepa": {
    te: "డాక్టర్ ఎ. లక్ష్మీ దీప",
    hi: "डॉ. ए. लक्ष्मी दीपा"
  },
  "Dr A Lakshmi Deepa, MBBS": {
    te: "డాక్టర్ ఎ. లక్ష్మీ దీప, MBBS",
    hi: "डॉ. ए. लक्ष्मी दीपा, MBBS"
  },
  "Doctor": {
    te: "వైద్యులు",
    hi: "चिकित्सक"
  },
  "GENERAL DIABETOLOGIST": {
    te: "జనరల్ డయాబెటాలజిస్ట్",
    hi: "जनरल मधुमेह विशेषज्ञ"
  },
  "General Diabetologist": {
    te: "జనరల్ డయాబెటాలజిస్ట్",
    hi: "जनरल मधुमेह विशेषज्ञ"
  },
  "18 + Years": {
    te: "18+ సంవత్సరాల అనుభవం",
    hi: "18+ वर्षों का अनुभव"
  },
  "18+ Years": {
    te: "18+ సంవత్సరాల అనుభవం",
    hi: "18+ वर्षों का अनुभव"
  },
  "18 Years": {
    te: "18 సంవత్సరాల అనుభవం",
    hi: "18 वर्षों का अनुभव"
  },
  "M.D. SVIMS": {
    te: "ఎం.డి. స్విమ్స్ (SVIMS)",
    hi: "एम.डी. स्विम्स (SVIMS)"
  },
  "MD SVIMS": {
    te: "ఎం.డి. స్విమ్స్ (SVIMS)",
    hi: "एम.डी. स्विम्स (SVIMS)"
  },
  "Qualifications & Fellowships": {
    te: "విద్యార్హతలు & ఫెలోషిప్‌లు",
    hi: "योग्यता एवं फैलोशिप"
  },
  "Consultation Hours": {
    te: "కన్సల్టేషన్ సమయాలు",
    hi: "परामर्श समय"
  },
  "Morning: 10:00 AM – 02:00 PM | Evening: 06:00 PM – 09:00 PM": {
    te: "ఉదయం: 10:00 AM – 02:00 PM | సాయంత్రం: 06:00 PM – 09:00 PM",
    hi: "सुबह: 10:00 AM – 02:00 PM | शाम: 06:00 PM – 09:00 PM"
  },
  "Mon - Sat: 11:00 AM - 5:00 PM": {
    te: "సోమ - శని: ఉదయం 11:00 - సాయంత్రం 5:00",
    hi: "सोम - शनि: सुबह 11:00 - शाम 5:00"
  },
  "Mon - Sat: 10:00 AM - 2:00 PM & 6:00 PM - 8:30 PM": {
    te: "సోమ - శని: ఉదయం 10:00 - మధ్యాహ్నం 2:00 & సాయంత్రం 6:00 - రాత్రి 8:30",
    hi: "सोम - शनि: सुबह 10:00 - दोपहर 2:00 एवं शाम 6:00 - रात 8:30"
  },
  "View Full Profile & Credentials": {
    te: "పూర్తి ప్రొఫైల్ & వివరాలు చూడండి",
    hi: "पूरा प्रोफाइल एवं साख देखें"
  },
  "Book Consultation": {
    te: "కన్సల్టేషన్ బుక్ చేసుకోండి",
    hi: "परामर्श बुक करें"
  },
  "Modern Diabetes Management in Khammam": {
    te: "ఖమ్మంలో అత్యాధునిక మధుమేహ (డయాబెటిస్) చికిత్స",
    hi: "खम्मम में आधुनिक मधुमेह (डायबिटीज) प्रबंधन"
  },
  "Diabetes is not merely an elevated blood sugar number; it is a vascular condition that requires holistic protection of the heart, kidneys, retinas, and peripheral nerves. Dr. Narayana Murthy brings specialized diabetology focus to ensure patients manage life with vitality and confidence.": {
    te: "మధుమేహం అనేది కేవలం రక్తంలో చక్కెర పెరగడం మాత్రమే కాదు; ఇది గుండె, మూత్రపిండాలు, కంటి రెటీనా మరియు నరాలను రక్షించాల్సిన ఒక రక్తనాళాల సమస్య. డాక్టర్ నారాయణ మూర్తి గారు రోగులు సంపూర్ణ ఆరోగ్యంతో, ఆత్మవిశ్వాసంతో జీవించేలా ప్రత్యేక డయాబెటాలజీ సంరక్షణను అందిస్తారు.",
    hi: "मधुमेह केवल रक्त शर्करा का बढ़ना नहीं है; यह एक संवहनी स्थिति है जिसके लिए हृदय, गुर्दे, रेटिना और परिधीय तंत्रिकाओं की समग्र सुरक्षा की आवश्यकता होती है। डॉ. नारायण मूर्ति विशेष मधुमेह प्रबंधन के साथ मरीजों को आत्मविश्वास और जीवन शक्ति प्रदान करते हैं।"
  },
  "Structured Care Protocols": {
    te: "క్రమబద్ధమైన చికిత్సా ప్రోటోకాల్స్",
    hi: "संरचित देखभाल प्रोटोकॉल"
  },
  "Quarterly HbA1c Monitoring: Laboratory assessment coupled with home blood glucose meter reconciliation.": {
    te: "త్రైమాసిక HbA1c పర్యవేక్షణ: ప్రయోగశాల పరీక్షలతో పాటు గృహ రక్త గ్లూకోజ్ రీడింగ్‌ల సమీక్ష.",
    hi: "त्रैमासिक HbA1c निगरानी: प्रयोगशाला परीक्षण के साथ घरेलू रक्त शर्करा मीटर का सामंजस्य।"
  },
  "Diabetic Neuropathy & Foot Screen: Monofilament sensation testing, peripheral pulse examination, and footwear education to avert diabetic foot complications.": {
    te: "డయాబెటిక్ న్యూరోపతి & పాదాల పరీక్ష: మోనోఫిలమెంట్ స్పర్శ పరీక్ష, నాడి పరీక్ష మరియు పాదాల పుండ్లను నివారించే పాదరక్షల అవగాహన.",
    hi: "डायबिटिक न्यूरोपैथी एवं पैर की जांच: मोनोफिलामेंट संवेदनशीलता परीक्षण, परिधीय नाड़ी परीक्षा और पैरों की जटिलताओं से बचाव हेतु मार्गदर्शन।"
  },
  "Cardio-Renal Risk Profiling: Urine microalbumin-to-creatinine ratio (ACR) and lipid panel testing to protect kidney filtration.": {
    te: "కార్డియో-రీనల్ రిస్క్ ప్రొఫైలింగ్: కిడ్నీ వడపోతను రక్షించడానికి యూరిన్ మైక్రోఅల్బుమిన్-టు-క్రియాటినిన్ రేషియో (ACR) మరియు లిపిడ్ ప్రొఫైల్ పరీక్షలు.",
    hi: "कार्डियो-रीनल रिस्क प्रोफाइलिंग: गुर्दे की सुरक्षा के लिए यूरिन माइक्रोएल्बुमिन-टू-क्रिएटिनिन अनुपात (ACR) और लिपिड प्रोफाइल परीक्षण।"
  },
  "Diet & Nutrition Counseling: Practical regional dietary guidelines adapted to South Indian culinary preferences.": {
    te: "ఆహార & పోషకాహార కౌన్సెలింగ్: మన దక్షిణాది ఆహారపు అలవాట్లకు అనుగుణమైన ఆచరణాత్మక పోషకాహార సూచనలు.",
    hi: "आहार एवं पोषण परामर्श: क्षेत्रीय खान-पान की प्राथमिकताओं के अनुकूल व्यावहारिक पोषण संबंधी दिशानिर्देश।"
  },
  "Patient First Philosophy: We empower patients with direct knowledge of hypoglycemia warning signs, safe carbohydrate distribution, and insulin injection techniques.": {
    te: "రోగి ప్రాధాన్యత విధానం: తక్కువ రక్త చక్కెర (హైపోగ్లైసీమియా) హెచ్చరిక సంకేతాలు, సురక్షితమైన కార్బోహైడ్రేట్ల పంపిణీ మరియు ఇన్సులిన్ ఇంజెక్షన్ పద్ధతులపై రోగులకు పూర్తి అవగాహన కల్పిస్తాము.",
    hi: "मरीज-प्रथम दर्शन: हम मरीजों को हाइपोग्लाइसीमिया के चेतावनी संकेत, सुरक्षित कार्बोहाइड्रेट वितरण और इंसुलिन इंजेक्शन तकनीकों की सीधी जानकारी से सशक्त बनाते हैं।"
  },
  "Call Emergency Reception": {
    te: "అత్యవసర రిసెప్షన్‌కు కాల్ చేయండి",
    hi: "आपातकालीन रिसेप्शन पर कॉल करें"
  },
  "Consult a Specialist": {
    te: "వైద్య నిపుణులను సంప్రదించండి",
    hi: "विशेषज्ञ से परामर्श लें"
  },
  "Outpatient evaluations with Dr. Narayana Murthy are available Mon - Sat (11:00 AM to 5:00 PM).": {
    te: "డాక్టర్ నారాయణ మూర్తి గారి ఓపీడీ సంప్రదింపులు సోమవారం నుండి శనివారం వరకు (ఉదయం 11:00 నుండి సాయంత్రం 5:00 వరకు) అందుబాటులో ఉంటాయి.",
    hi: "डॉ. नारायण मूर्ति के साथ बाह्यरोगी परामर्श सोम - शनि (सुबह 11:00 से शाम 5:00 बजे तक) उपलब्ध है।"
  },
  "OPD Timings": {
    te: "ఓపీడీ సమయాలు",
    hi: "ओपीडी समय"
  },
  "Mon–Sat: 11:00 AM – 5:00 PM": {
    te: "సోమ–శని: ఉదయం 11:00 – సాయంత్రం 5:00",
    hi: "सोम–शनि: सुबह 11:00 – शाम 5:00"
  },
  "Daycare Transfusions": {
    te: "డేకేర్ రక్త మార్పిడులు",
    hi: "डेकेयर रक्त आधान"
  },
  "24/7 Monitored Support": {
    te: "24/7 పర్యవేక్షించబడే సేవలు",
    hi: "24/7 निरंतर निगरानी सुविधा"
  },
  "Back to All Specialties": {
    te: "అన్ని వైద్య విభాగాలకు తిరిగి వెళ్లండి",
    hi: "सभी विशिष्टताओं पर वापस जाएं"
  },
  "Service Not Found": {
    te: "సేవ కనుగొనబడలేదు",
    hi: "सेवा नहीं मिली"
  },
  "The requested clinical specialty could not be located.": {
    te: "అభ్యర్థించిన వైద్య విభాగం అందుబాటులో లేదు.",
    hi: "अनुरोधित नैदानिक विशेषता नहीं मिली।"
  },
  "Back to Services": {
    te: "సేవలకు తిరిగి వెళ్లండి",
    hi: "सेवाओं पर वापस जाएं"
  },
  "Dedicated Day-Care Transfusion Support": {
    te: "ప్రత్యేక డేకేర్ బ్లడ్ ట్రాన్స్‌ఫ్యూజన్ సేవలు",
    hi: "समर्पित डेकेयर रक्त आधान सहायता"
  },
  "Rithanya Hospital is widely recognized across Khammam for its dedicated day-care support for young individuals and adults living with Beta Thalassemia Major and Sickle-Cell Disease. Transfusions should never feel like an intimidating hospital admission—they are conducted in a peaceful, supportive day-care setting.": {
    te: "బీటా తలసేమియా మేజర్ మరియు సికిల్-సెల్ వ్యాధితో బాధపడుతున్న చిన్నారులు మరియు పెద్దలకు అంకితభావంతో కూడిన డేకేర్ సేవలను అందించడంలో రితన్య హాస్పిటల్ ఖమ్మంలో అగ్రగామిగా నిలిచింది. రక్తమార్పిడి రోగులకు భయానక ఆసుపత్రి అనుభవంగా కాకుండా ప్రశాంతమైన డేకేర్ వాతావరణంలో నిర్వహించబడుతుంది.",
    hi: "बीटा थैलेसीमिया मेजर और सिकल-सेल रोग से पीड़ित बच्चों और वयस्कों के लिए समर्पित डेकेयर सहायता प्रदान करने में रिथन्या अस्पताल खम्मम में अग्रणी है। रक्त आधान कभी भी भयभीत करने वाला अस्पताल दाखिला नहीं लगना चाहिए - यह एक शांत, सहायक डेकेयर वातावरण में किया जाता है।"
  },
  "Safety & Protocol Checklist": {
    te: "భద్రత & ప్రోటోకాల్ చెక్‌లిస్ట్",
    hi: "सुरक्षा एवं प्रोटोकॉल चेकलिस्ट"
  },
  "Pre-Transfusion Blood Cross-Matching: Rigorous ABO and Rh(D) verification, saline cross-matching, and complete blood count (CBC) prior to every unit.": {
    te: "రక్తమార్పిడికి ముందు క్రాస్-మ్యాచింగ్: ప్రతి యూనిట్‌కు ముందు కచ్చితమైన ABO మరియు Rh(D) నిర్ధారణ, సెలైన్ క్రాస్-మ్యాచింగ్ మరియు పూర్తి రక్త పరీక్ష (CBC).",
    hi: "रक्त आधान पूर्व क्रॉस-मैचिंग: प्रत्येक यूनिट से पहले कठोर ABO और Rh(D) सत्यापन, सलाइन क्रॉस-मैचिंग और पूर्ण रक्त गणना (CBC)।"
  },
  "Leukodepletion Micro-filtration: Transfusions utilize modern micro-aggregate blood filters to prevent febrile non-hemolytic transfusion reactions (FNHTR).": {
    te: "ల్యూకోడెప్లీషన్ మైక్రో-ఫిల్ట్రేషన్: జ్వర సంబంధిత ప్రతిచర్యలను (FNHTR) నివారించడానికి ఆధునిక మైక్రో-అగ్రిగేట్ బ్లడ్ ఫిల్టర్ల ద్వారా రక్తమార్పిడి జరుగుతుంది.",
    hi: "ल्यूकोडेप्लेशन माइक्रो-फिल्ट्रेशन: गैर-हेमोलिटिक ट्रांसफ्यूजन प्रतिक्रियाओं (FNHTR) को रोकने के लिए आधुनिक माइक्रो-एग्रीगेट ब्लड फिल्टर का उपयोग।"
  },
  "Regular Iron Chelation Auditing: Monitoring of serum ferritin levels and coordinating oral chelation dosages to protect cardiac and hepatic tissues.": {
    te: "క్రమబద్ధమైన ఐరన్ చిలేషన్ ఆడిటింగ్: సీరం ఫెర్రిటిన్ స్థాయిలను పర్యవేక్షించడం మరియు గుండె, కాలేయ కణజాలాలను రక్షించడానికి ఓరల్ చిలేషన్ మోతాదులను సర్దుబాటు చేయడం.",
    hi: "नियमित आयरन कीलेशन ऑडिटिंग: सीरम फेरिटिन स्तरों की निगरानी और हृदय व यकृत के ऊतकों की सुरक्षा के लिए मौखिक कीलेशन खुराक का समायोजन।"
  },
  "Compassionate Pediatric Support: Dedicated nursing team trained in sensitive venous access for young warriors.": {
    te: "ఆత్మీయ పీడియాట్రిక్ సంరక్షణ: చిన్నారులకు నొప్పిలేకుండా సున్నితమైన వీనస్ యాక్సెస్ అందించడంలో ప్రత్యేక శిక్షణ పొందిన నర్సింగ్ బృందం.",
    hi: "संवेदनशील बाल चिकित्सा सहायता: नन्हे योद्धाओं के लिए दर्द रहित वीनस एक्सेस में प्रशिक्षित समर्पित नर्सिंग टीम।"
  },
  "Emergency Blood Bank Coordination: Our in-house refrigerated blood reserve collaborates closely with the Khammam Red Cross and District Blood Center for timely blood availability.": {
    te: "అత్యవసర బ్లడ్ బ్యాంక్ సమన్వయం: మా అంతర్గత శీతలీకృత బ్లడ్ బ్యాంక్ ఖమ్మం రెడ్ క్రాస్ మరియు జిల్లా బ్లడ్ సెంటర్‌తో సమన్వయం చేసుకుంటూ రక్తాన్ని సకాలంలో అందుబాటులో ఉంచుతుంది.",
    hi: "आपातकालीन ब्लड बैंक समन्वय: हमारा इन-हाउस रेफ्रिजरेटेड ब्लड बैंक समय पर रक्त की उपलब्धता हेतु खम्मम रेड क्रॉस और जिला ब्लड सेंटर के साथ घनिष्ठ समन्वय रखता है।"
  },
  "Diagnostic Precision at Rithanya": {
    te: "రితన్యలో ఖచ్చితమైన రోగ నిర్ధారణ (డయాగ్నోస్టిక్స్)",
    hi: "रिथन्या में सटीक नैदानिक जांच"
  },
  "Accurate clinical treatment depends on dependable laboratory diagnostics. Our facility features calibrated analyzers operating with strict internal controls to deliver timely reports for outpatients, emergency walk-ins, and day-care visitors.": {
    te: "ఖచ్చితమైన వైద్య చికిత్స అనేది నమ్మకమైన ప్రయోగశాల పరీక్షలపై ఆధారపడి ఉంటుంది. మా కేంద్రంలో క్యాలిబ్రేటెడ్ ఎనలైజర్లు మరియు అంతర్గత నియంత్రణల ద్వారా రోగులకు సకాలంలో ఖచ్చితమైన నివేదికలు అందించబడతాయి.",
    hi: "सटीक नैदानिक उपचार विश्वसनीय प्रयोगशाला निदान पर निर्भर करता है। हमारी सुविधा में बाह्यरोगियों, आपातकालीन और डेकेयर आगंतुकों के लिए समय पर सटीक रिपोर्ट प्रदान करने हेतु कैलिब्रेटेड विश्लेषक मौजूद हैं।"
  },
  "Key Diagnostic Panels Available": {
    te: "అందుబాటులో ఉన్న ముఖ్యమైన డయాగ్నోస్టిక్ ప్యానెల్స్",
    hi: "उपलब्ध प्रमुख नैदानिक पैनल"
  },
  "Complete Blood Count (CBC) & ESR: 3-part automated differential profiling of haemoglobin, haematocrit, platelets, and white blood cells.": {
    te: "కంప్లీట్ బ్లడ్ కౌంట్ (CBC) & ESR: హిమోగ్లోబిన్, ప్లేట్‌లెట్లు మరియు తెల్ల రక్త కణాల ఆటోమేటెడ్ ప్రొఫైలింగ్.",
    hi: "कम्प्लीट ब्लड काउंट (CBC) एवं ESR: हीमोग्लोबिन, प्लेटलेट्स और श्वेत रक्त कोशिकाओं का स्वचालित प्रोफाइलिंग।"
  },
  "Metabolic & Organ Panels: Fasting & postprandial glucose, Serum Creatinine, Blood Urea Nitrogen (BUN), and Liver Function Tests (LFT).": {
    te: "మెటబాలిక్ & అవయవ పరీక్షలు: ఫాస్టింగ్ మరియు పోస్ట్‌ప్రాండియల్ గ్లూకోజ్, సీరం క్రియాటినిన్, బ్లడ్ యూరియా నైట్రోజన్ (BUN) మరియు లివర్ ఫంక్షన్ పరీక్షలు (LFT).",
    hi: "मेटाबॉलिक एवं अंग पैनल: फास्टिंग व पोस्टप्रैंडियल ग्लूकोज, सीरम क्रिएटिनिन, ब्लड यूरिया नाइट्रोजन (BUN) और लिवर फंक्शन टेस्ट (LFT)।"
  },
  "Lipid & Cardiovascular Markers: Total Cholesterol, Triglycerides, HDL, LDL, and VLDL ratios.": {
    te: "లిపిడ్ & గుండె సంబంధిత మార్కర్లు: టోటల్ కొలెస్ట్రాల్, ట్రైగ్లిజరైడ్స్, HDL, LDL మరియు VLDL నిష్పత్తులు.",
    hi: "लिपिड एवं हृदय संबंधी मार्कर: कुल कोलेस्ट्रॉल, ट्राइग्लिसराइड्स, एचडीएल, एलडीएल और वीएलडीएल अनुपात।"
  },
  "Infectious Serology: Rapid Dengue NS1 & IgM/IgG, Malarial Antigen (Pv/Pf), Typhoid Widal/TyphiDot, and viral hepatitis screens.": {
    te: "ఇన్‌ఫెక్షియస్ సెరాలజీ: ర్యాపిడ్ డెంగ్యూ NS1 & IgM/IgG, మలేరియా యాంటిజెన్ (Pv/Pf), టైఫాయిడ్ వైడాల్/టైఫీడాట్ మరియు వైరల్ హెపటైటిస్ పరీక్షలు.",
    hi: "संक्रामक सीरोलॉजी: रैपिड डेंगू NS1 व IgM/IgG, मलेरिया एंटीजन (Pv/Pf), टाइफाइड विडाल/टाइफीडॉट और वायरल हेपेटाइटिस जांच।"
  },
  "Attentive Pediatric Care": {
    te: "ప్రత్యేక శ్రద్ధతో కూడిన పీడియాట్రిక్ సంరక్షణ",
    hi: "सजग एवं संवेदनशील बाल चिकित्सा देखभाल"
  },
  "Children require specialized physiological attention, weight-tailored medication dosing, and a gentle clinic atmosphere that eases medical anxiety.": {
    te: "పిల్లలకు ప్రత్యేక శారీరక శ్రద్ధ, బరువుకు తగిన ఔషధ మోతాదులు మరియు ఆసుపత్రి భయాన్ని పోగొట్టే ఆహ్లాదకరమైన వాతావరణం అవసరం.",
    hi: "बच्चों को विशेष शारीरिक ध्यान, वजन के अनुसार दवा की खुराक और एक शांत व सौम्य क्लिनिक वातावरण की आवश्यकता होती है जो चिकित्सा चिंता को कम करे।"
  },
  "Proactive Wellness vs. Reactive Treatment": {
    te: "ముందస్తు ఆరోగ్యం vs వ్యాధి అనంతర చికిత్స",
    hi: "सक्रिय स्वास्थ्य कल्याण बनाम प्रतिक्रियाशील उपचार"
  },
  "Preventive health checks detect metabolic risk factors—such as border-line hypertension, silent dyslipidemia, and pre-diabetes—years before clinical symptoms manifest.": {
    te: "ముందస్తు హెల్త్ చెకప్‌లు ప్రారంభ దశలోనే రక్తపోటు, కొలెస్ట్రాల్ మరియు ప్రి-డయాబెటిస్ వంటి ప్రమాద కారకాలను గుర్తించి భవిష్యత్ సమస్యలను నివారిస్తాయి.",
    hi: "निवारक स्वास्थ्य जांचें नैदानिक लक्षण प्रकट होने से वर्षों पहले बॉर्डर-लाइन उच्च रक्तचाप, मूक डिस्लिपिडेमिया और प्री-डायबिटीज जैसे जोखिम कारकों का पता लगाती हैं।"
  },
  "Typical Duration": {
    te: "సాధారణ వ్యవధి",
    hi: "सामान्य अवधि"
  },
  "Safety Standard": {
    te: "భద్రతా ప్రమాణం",
    hi: "सुरक्षा मानक"
  },
  "Leukodepleted Blood Unit": {
    te: "ల్యూకోడెప్లీటెడ్ బ్లడ్ యూనిట్",
    hi: "ल्यूकोडेप्लेटेड ब्लड यूनिट"
  },
  "Clinical Safety Standard": {
    te: "క్లినికల్ సేఫ్టీ స్టాండర్డ్",
    hi: "नैदानिक सुरक्षा मानक"
  },
  "Supervised by Dr. Narayana Murthy M.D. (Senior Diabetologist)": {
    te: "డాక్టర్ నారాయణ మూర్తి M.D. (సీనియర్ డయాబెటాలజిస్ట్) పర్యవేక్షణలో",
    hi: "डॉ. नारायण मूर्ति एम.डी. (वरिष्ठ मधुमेह विशेषज्ञ) द्वारा पर्यवेक्षित"
  },
  "Clinical Indications & Eligibility": {
    te: "క్లినికల్ సూచనలు & అర్హత",
    hi: "नैदानिक संकेत एवं पात्रता"
  },
  "Clinical Procedures & Safety Protocol": {
    te: "వైద్య ప్రక్రియలు & భద్రతా ప్రోటోకాల్",
    hi: "नैदानिक प्रक्रियाएं एवं सुरक्षा प्रोटोकॉल"
  },
  "Attending": {
    te: "పర్యవేక్షక వైద్యులు",
    hi: "उपस्थित चिकित्सक"
  },
  "Book This Treatment": {
    te: "ఈ చికిత్సను బుక్ చేసుకోండి",
    hi: "इस उपचार को बुक करें"
  },
  "Consult directly with": {
    te: "నేరుగా సంప్రదించండి",
    hi: "सीधे परामर्श लें"
  },
  "for customized pre-assessment and daycare bed reservation.": {
    te: "వ్యక్తిగత ముందస్తు అంచనా మరియు డేకేర్ బెడ్ రిజర్వేషన్ కోసం.",
    hi: "अनुकूलित पूर्व-मूल्यांकन एवं डेकेयर बेड आरक्षण के लिए।"
  },
  "Share Protocol": {
    te: "వివరాలను షేర్ చేయండి",
    hi: "प्रोटोकॉल साझा करें"
  },
  "Back to Treatments Catalog": {
    te: "చికిత్సల కేటలాగ్‌కు తిరిగి వెళ్లండి",
    hi: "उपचार कैटलॉग पर वापस जाएं"
  },
  "Treatment link copied to clipboard!": {
    te: "చికిత్స లింక్ క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది!",
    hi: "उपचार लिंक क्लिपबोर्ड पर कॉपी किया गया!"
  },
  "Treatment Not Found": {
    te: "చికిత్స కనుగొనబడలేదు",
    hi: "उपचार नहीं मिला"
  },
  "The requested clinical procedure or treatment could not be found.": {
    te: "అభ్యర్థించిన వైద్య చికిత్స లేదా ప్రక్రియ కనుగొనబడలేదు.",
    hi: "अनुरोधित नैदानिक प्रक्रिया या उपचार नहीं मिला।"
  },
  "Back to All Treatments": {
    te: "అన్ని చికిత్సలకు తిరిగి వెళ్లండి",
    hi: "सभी उपचारों पर वापस जाएं"
  },
  "Standard Session": {
    te: "సాధారణ సెషన్",
    hi: "मानक सत्र"
  },
  "45 - 90 mins": {
    te: "45 - 90 నిమిషాలు",
    hi: "45 - 90 मिनट"
  },
  "30 - 45 mins": {
    te: "30 - 45 నిమిషాలు",
    hi: "30 - 45 मिनट"
  },
  "3 - 4 Hours": {
    te: "3 - 4 గంటలు",
    hi: "3 - 4 घंटे"
  },
  "60 mins Clinical Audit": {
    te: "60 నిమిషాల క్లినికల్ సమీక్ష",
    hi: "60 मिनट नैदानिक समीक्षा"
  },
  "45 mins Evaluation": {
    te: "45 నిమిషాల సమగ్ర అంచనా",
    hi: "45 मिनट मूल्यांकन"
  },
  "45 mins Consultation": {
    te: "45 నిమిషాల సంప్రదింపు",
    hi: "45 मिनट परामर्श"
  },
  "Same-Day Automated Report": {
    te: "అదే రోజు ఆటోమేటెడ్ రిపోర్ట్",
    hi: "उसी दिन स्वचालित रिपोर्ट"
  },
  "2 Hours Automated Turnaround": {
    te: "2 గంటల్లో ఆటోమేటెడ్ రిపోర్ట్",
    hi: "2 घंटे में स्वचालित परिणाम"
  },
  "Daycare Transfusion Excellence Without Hospital Fatigue": {
    te: "ఆసుపత్రి అలసట లేని అత్యుత్తమ డేకేర్ రక్తమార్పిడి సేవలు",
    hi: "अस्पताल की थकान के बिना डेकेयर रक्त आधान उत्कृष्टता"
  },
  "At Rithanya Hospital's dedicated Daycare Transfusion Centre, pediatric and adult thalassemia warriors receive routine life-sustaining packed red blood cell (PRBC) transfusions in an infection-controlled, comforting daycare environment. Under the clinical oversight of Dr. Narayana Murthy M.D., every unit undergoes triple cross-matching and is transfused using certified leukodepletion micro-filters to prevent febrile non-hemolytic transfusion reactions (FNHTR) and HLA alloimmunization.": {
    te: "రితన్య హాస్పిటల్ యొక్క ప్రత్యేక డేకేర్ ట్రాన్స్‌ఫ్యూజన్ కేంద్రంలో, తలసేమియా యోధులు ఇన్ఫెక్షన్-రహిత, ఆహ్లాదకరమైన వాతావరణంలో రెగ్యులర్ ప్యాక్డ్ రెడ్ బ్లడ్ సెల్ (PRBC) రక్తమార్పిడిని పొందుతారు. డాక్టర్ నారాయణ మూర్తి M.D. గారి క్లినికల్ పర్యవేక్షణలో, ప్రతి యూనిట్ ట్రిపుల్ క్రాస్-మ్యాచింగ్ చేయబడి, జ్వరం మరియు రియాక్షన్లను నివారించడానికి సర్టిఫైడ్ ల్యూకోడెప్లీషన్ మైక్రో-ఫిల్టర్లను ఉపయోగించి ఎక్కించబడుతుంది.",
    hi: "रिथन्या अस्पताल के समर्पित डेकेयर ट्रांसफ्यूजन सेंटर में थैलेसीमिया पीड़ितों को संक्रमण-नियंत्रित, आरामदायक वातावरण में नियमित पैक्ड रेड ब्लड सेल (PRBC) रक्त आधान प्राप्त होता है। डॉ. नारायण मूर्ति एम.डी. की देखरेख में, प्रत्येक यूनिट का ट्रिपल क्रॉस-मैचिंग किया जाता है और प्रतिक्रियाओं को रोकने के लिए प्रमाणित ल्यूकोडेप्लेशन माइक्रो-फिल्टर का उपयोग करके रक्त चढ़ाया जाता है।"
  },
  "Key Clinical Protocols": {
    te: "ముఖ్యమైన వైద్య ప్రోటోకాల్స్",
    hi: "प्रमुख नैदानिक प्रोटोकॉल"
  },
  "Triple Compatibility Testing: Saline, albumin, and indirect antiglobulin test (IAT) screening on fresh pre-transfusion samples.": {
    te: "ట్రిపుల్ అనుకూలత పరీక్ష: సెలైన్, అల్బుమిన్ మరియు ఇన్‌డైరెక్ట్ యాంటిగ్లోబులిన్ టెస్ట్ (IAT) స్క్రీనింగ్.",
    hi: "ट्रिपल अनुकूलता परीक्षण: सलाइन, एल्ब्यूमिन और इनडायरेक्ट एंटीग्लोब्युलिन टेस्ट (IAT) स्क्रीनिंग।"
  },
  "Leukodepleted Filtration: 3rd-generation bedside micro-aggregate filters removing >99.9% of donor white cells.": {
    te: "ల్యూకోడెప్లీటెడ్ ఫిల్ట్రేషన్: దాత తెల్ల రక్తకణాలను 99.9% కంటే ఎక్కువ తొలగించే 3వ తరం బెడ్‌సైడ్ మైక్రో-ఫిల్టర్లు.",
    hi: "ल्यूकोडेप्लेटेड फिल्ट्रेशन: 3री पीढ़ी के बेडसाइड माइक्रो-एग्रीगेट फिल्टर जो दाता की >99.9% श्वेत कोशिकाओं को हटाते हैं।"
  },
  "Hemodynamic Profiling: Automated continuous SpO2, blood pressure, temperature, and pulse rate logging.": {
    te: "హీమోడైనమిక్ ప్రొఫైలింగ్: రక్తపోటు, ఆక్సిజన్ (SpO2), ఉష్ణోగ్రత మరియు పల్స్ రేటును నిరంతరం నమోదు చేయడం.",
    hi: "हेमोडायनामिक प्रोफाइलिंग: स्वचालित निरंतर SpO2, रक्तचाप, तापमान और नाड़ी की दर की रिकॉर्डिंग।"
  },
  "Volume Titration: Strict weight-adjusted pediatric volume calculations (10-15 mL/kg) delivered via precision infusion pumps.": {
    te: "వాల్యూమ్ టైట్రేషన్: పిల్లల బరువు ఆధారంగా లెక్కించిన పరిమాణాన్ని (10-15 mL/kg) ఖచ్చితమైన ఇన్‌ఫ్యూషన్ పంపుల ద్వారా అందించడం.",
    hi: "वॉल्यूम अनुमापन: सटीक इन्फ्यूजन पंपों के माध्यम से बाल वजन-समायोजित सटीक मात्रा (10-15 एमएल/किग्रा) वितरण।"
  },
  "Post-Transfusion Care & Iron Management": {
    te: "రక్తమార్పిడి తదుపరి సంరక్షణ & ఐరన్ నిర్వహణ",
    hi: "रक्त आधान उपरांत देखभाल एवं आयरन प्रबंधन"
  },
  "Each session concludes with saline line clearing, post-transfusion vitals verification, and an updated hemoglobin and ferritin tracking chart to adjust oral chelation dosages seamlessly.": {
    te: "ప్రతి సెషన్ సెలైన్ లైన్ క్లియరింగ్, వైటల్స్ ధృవీకరణ మరియు హిమోగ్లోబిన్, ఫెర్రిటిన్ చార్ట్ నవీకరణతో పూర్తవుతుంది.",
    hi: "प्रत्येक सत्र सलाइन लाइन क्लियरिंग, वाइटल्स सत्यापन और ओरल कीलेशन खुराक को समायोजित करने के लिए हीमोग्लोबिन व फेरिटिन ट्रैकिंग चार्ट के साथ समाप्त होता है।"
  },
  "Severe chronic hemolytic anemia, Hb < 9.0 g/dL, Beta-Thalassemia Major, Sickle-Cell Disease crises.": {
    te: "తీవ్రమైన రక్తహీనత, హిమోగ్లోబిన్ < 9.0 g/dL, బీటా-తలసేమియా మేజర్, సికిల్-సెల్ ఎనీమియా సంక్షోభాలు.",
    hi: "गंभीर क्रोनिक हेमोलिटिक एनीमिया, हीमोग्लोबिन < 9.0 g/dL, बीटा-थैलेसीमिया मेजर, सिकल-सेल रोग संकट।"
  },
  "Pre-transfusion saline & IAT compatibility crossmatching": {
    te: "రక్తమార్పిడికి ముందు సెలైన్ & IAT క్రాస్‌మ్యాచింగ్",
    hi: "ट्रांसफ्यूजन पूर्व सलाइन एवं IAT अनुकूलता क्रॉस-मैचिंग"
  },
  "Leukodepletion micro-aggregate filtration": {
    te: "ల్యూకోడెప్లీషన్ మైక్రో-అగ్రిగేట్ ఫిల్ట్రేషన్",
    hi: "ल्यूकोडेप्लेशन माइक्रो-एग्रीगेट फिल्ट्रेशन"
  },
  "Weight-adjusted infusion pump titration (10-15 mL/kg)": {
    te: "బరువు ఆధారిత ఇన్‌ఫ్యూషన్ పంప్ టైట్రేషన్ (10-15 mL/kg)",
    hi: "वजन-समायोजित इन्फ्यूजन पंप अनुमापन (10-15 मिली/किग्रा)"
  },
  "Continuous multiparameter bedside vitals monitoring": {
    te: "బెడ్‌సైడ్ వద్ద నిరంతర మల్టీపారామీటర్ వైటల్స్ పర్యవేక్షణ",
    hi: "निरंतर मल्टीपैरामीटर बेडसाइड वाइटल्स निगरानी"
  },
  "Longitudinal pre/post Hb and serum ferritin charting": {
    te: "రక్తమార్పిడి ముందు/తర్వాత హిమోగ్లోబిన్ మరియు సీరం ఫెర్రిటిన్ చార్టింగ్",
    hi: "ट्रांसफ्यूजन पूर्व/उपरांत हीमोग्लोबिन एवं सीरम फेरिटिन चार्टिंग"
  },
  "Preventing Hemosiderosis and End-Organ Damage": {
    te: "హీమోసిడెరోసిస్ మరియు అవయవ నష్టం నివారణ",
    hi: "हेमोसिडेरोसिस और अंग क्षति की रोकथाम"
  },
  "Because the human body lacks an active physiological mechanism to excrete excess iron derived from repeated blood transfusions, each unit adds approximately 200-250 mg of elemental iron. Without effective chelation, iron progressively deposits in the myocardium, liver parenchyma, and endocrine glands, leading to cardiac arrhythmias, cirrhosis, and diabetes.": {
    te: "పునరావృత రక్త మార్పిడుల వల్ల శరీరంలో చేరే అదనపు ఐరన్‌ను బయటకు పంపే సహజ వ్యవస్థ మానవ శరీరానికి లేనందున, ప్రతి యూనిట్ రక్తం సుమారు 200-250 mg ఐరన్‌ను చేరుస్తుంది. సరైన చిలేషన్ లేకపోతే, ఈ ఐరన్ గుండె, కాలేయం మరియు గ్రంథులలో పేరుకుపోయి తీవ్రమైన నష్టాన్ని కలిగిస్తుంది.",
    hi: "बार-बार रक्त चढ़ाने से शरीर में जमा होने वाले अतिरिक्त आयरन को बाहर निकालने का कोई प्राकृतिक तंत्र न होने के कारण, प्रत्येक यूनिट लगभग 200-250 मिलीग्राम आयरन जोड़ती है। प्रभावी कीलेशन के बिना, यह आयरन हृदय, यकृत और ग्रंथियों में जमा होकर गंभीर जटिलताएं पैदा करता है।"
  },
  "Structured Chelation Program": {
    te: "క్రమబద్ధమైన ఐరన్ చిలేషన్ ప్రోగ్రామ్",
    hi: "संरचित कीलेशन कार्यक्रम"
  },
  "Biochemical Monitoring: Serial serum ferritin assays, liver function tests, and renal function profiling every 4 to 8 weeks.": {
    te: "బయోకెమికల్ పర్యవేక్షణ: ప్రతి 4 నుండి 8 వారాలకు సీరం ఫెర్రిటిన్, లివర్ మరియు కిడ్నీ ఫంక్షన్ పరీక్షలు.",
    hi: "बायोकेमिकल निगरानी: प्रत्येक 4 से 8 सप्ताह में सीरम फेरिटिन, लिवर और किडनी फंक्शन प्रोफाइलिंग।"
  },
  "Advanced Chelation Agents: Tailored once-daily oral Deferasirox (dispersible/film-coated) or Deferiprone with Desferrioxamine combination therapy.": {
    te: "అధునాతన చిలేషన్ మందులు: రోజువారీ ఓరల్ డెఫెరాసిరాక్స్ లేదా డెఫెరిప్రోన్ మరియు డెస్ఫెరియోక్సమైన్ కాంబినేషన్ చికిత్స.",
    hi: "उन्नत कीलेशन दवाएं: व्यक्तिगत दैनिक मौखिक डेफेरासिरॉक्स या डेफेरिप्रोन के साथ डेसफेरियोक्सामाइन संयोजन थेरेपी।"
  },
  "Endocrine Assessment: Annual screening for growth deceleration, hypogonadism, hypoparathyroidism, and secondary hemochromatosis.": {
    te: "ఎండోక్రైన్ అంచనా: పెరుగుదల లోపం, హార్మోన్ల సమతుల్యత మరియు సంబంధిత సమస్యలపై వార్షిక పరీక్షలు.",
    hi: "अंतःस्रावी मूल्यांकन: विकास में रुकावट, हार्मोनल असंतुलन और संबंधित समस्याओं के लिए वार्षिक जांच।"
  },
  "Safety Monitoring: Routine audiometric and ophthalmic evaluations to ensure therapeutic index safety.": {
    te: "భద్రతా పర్యవేక్షణ: ఔషధాల భద్రతను నిర్ధారించడానికి క్రమం తప్పని వినికిడి మరియు కంటి పరీక్షలు.",
    hi: "सुरक्षा निगरानी: दवा की सुरक्षा सुनिश्चित करने के लिए नियमित ऑडियोमेट्रिक और नेत्र संबंधी मूल्यांकन।"
  },
  "Serum Ferritin > 1000 mcg/L, cumulative transfusion units > 15-20, myocardial or hepatic iron overload risk.": {
    te: "సీరం ఫెర్రిటిన్ > 1000 mcg/L, 15-20 యూనిట్ల కంటే ఎక్కువ రక్తమార్పిడులు, గుండె లేదా కాలేయంలో ఐరన్ ఓవర్‌లోడ్ ముప్పు.",
    hi: "सीरम फेरिटिन > 1000 एमसीजी/लीटर, संचयी ट्रांसफ्यूजन यूनिट > 15-20, हृदय या यकृत में आयरन ओवरलोड का जोखिम।"
  },
  "Chemiluminescent serum ferritin quantitation": {
    te: "కెమిలుమినిసెంట్ సీరం ఫెర్రిటిన్ పరిమాణాత్మక పరీక్ష",
    hi: "केमिल्यूमिनेसेंट सीरम फेरिटिन मात्रात्मक परीक्षण"
  },
  "Hepatic and renal safety biochemical markers": {
    te: "కాలేయ మరియు మూత్రపిండాల భద్రతా బయోకెమికల్ మార్కర్లు",
    hi: "यकृत और गुर्दे की सुरक्षा के बायोकेमिकल मार्कर"
  },
  "Customized oral chelation titration (Deferasirox / Deferiprone)": {
    te: "వ్యక్తిగతీకరించిన ఓరల్ చిలేషన్ టైట్రేషన్ (డెఫెరాసిరాక్స్ / డెఫెరిప్రోన్)",
    hi: "अनुकूलित मौखिक कीलेशन अनुमापन (डेफेरासिरॉक्स / डेफेरिप्रोन)"
  },
  "Audiometry and slit-lamp ophthalmic safety audits": {
    te: "ఆడియోమెట్రీ మరియు స్లిట్-ల్యాంప్ కంటి భద్రతా పరీక్షలు",
    hi: "ऑडियोमेट्री और स्लिट-लैंप नेत्र सुरक्षा ऑडिट"
  },
  "Iron dietary restriction counseling": {
    te: "ఐరన్ ఆహార నియంత్రణ కౌన్సెలింగ్",
    hi: "आहार में आयरन प्रतिबंध परामर्श"
  },
  "Personalized Metabolic Care by Dr. Narayana Murthy": {
    te: "డాక్టర్ నారాయణ మూర్తి గారిచే వ్యక్తిగత మెటబాలిక్ సంరక్షణ",
    hi: "डॉ. नारायण मूर्ति द्वारा व्यक्तिगत मेटाबॉलिक देखभाल"
  },
  "With over 22 years of clinical excellence in diabetology, Dr. Narayana Murthy M.D. leads a patient-centric, longitudinal treatment protocol for diabetic individuals. Rather than relying on sporadic fasting glucose checks, our center focuses on long-term time-in-range (TIR) metrics, cardiovascular risk mitigation, and early microvascular protection.": {
    te: "డయాబెటాలజీలో 22 సంవత్సరాలకు పైగా విశిష్ట అనుభవంతో, డాక్టర్ నారాయణ మూర్తి M.D. గారు మధుమేహ రోగులకు సమగ్ర చికిత్సను అందిస్తున్నారు. కేవలం చక్కెర రీడింగ్‌లపై మాత్రమే కాకుండా, గుండె, రక్తనాళాలు మరియు అవయవ రక్షణపై ప్రత్యేక దృష్టి సారిస్తారు.",
    hi: "मधुमेह विज्ञान में 22 से अधिक वर्षों की नैदानिक उत्कृष्टता के साथ, डॉ. नारायण मूर्ति एम.डी. मधुमेह रोगियों के लिए एक रोगी-केंद्रित उपचार का नेतृत्व करते हैं जो हृदय संबंधी जोखिम को कम करने और प्रारंभिक अंग सुरक्षा पर केंद्रित है।"
  },
  "Comprehensive Care Spectrum": {
    te: "సమగ్ర సంరక్షణ విధానం",
    hi: "व्यापक देखभाल स्पेक्ट्रम"
  },
  "Targeted Glycemic Control: HbA1c optimization tailored to patient age, comorbidities, and hypoglycemia risk.": {
    te: "లక్ష్యిత గ్లైసెమిక్ నియంత్రణ: రోగి వయస్సు మరియు ఆరోగ్య పరిస్థితికి అనుగుణంగా HbA1c నియంత్రణ.",
    hi: "लक्षित ग्लाइसेमिक नियंत्रण: रोगी की आयु और स्वास्थ्य के अनुरूप HbA1c अनुकूलन।"
  },
  "Continuous Glucose Monitoring (CGM): Sensor placement and ambulatory glucose profile (AGP) pattern analysis.": {
    te: "నిరంతర గ్లూకోజ్ పర్యవేక్షణ (CGM): సెన్సార్ అమరిక మరియు గ్లూకోజ్ హెచ్చుతగ్గుల విశ్లేషణ.",
    hi: "निरंतर ग्लूकोज निगरानी (CGM): सेंसर लगाना और ग्लूकोज पैटर्न का विश्लेषण।"
  },
  "Cardio-Renal Protection: SGLT2 inhibitor and GLP-1 receptor agonist integration to protect renal glomeruli and cardiac ejection fraction.": {
    te: "కార్డియో-రీనల్ రక్షణ: కిడ్నీలు మరియు గుండె పనితీరును రక్షించే ఆధునిక ఔషధాల సమన్వయం.",
    hi: "कार्डियो-रीनल सुरक्षा: गुर्दे और हृदय की कार्यप्रणाली की रक्षा हेतु आधुनिक दवाओं का एकीकरण।"
  },
  "Nutritional Coaching: Tailored Indian carbohydrate-exchange diets and lifestyle counseling.": {
    te: "పోషకాహార శిక్షణ: భారతీయ ఆహారపు అలవాట్లకు సరిపోయే సమతుల్య కార్బోహైడ్రేట్ ఆహార ప్రణాళిక.",
    hi: "पोषण संबंधी कोचिंग: भारतीय खान-पान के अनुकूल संतुलित कार्बोहाइड्रेट आहार योजना।"
  },
  "Type 1 Diabetes, Type 2 Diabetes Mellitus, Gestational Diabetes, Brittle Diabetes, Metabolic Syndrome.": {
    te: "టైప్ 1 డయాబెటిస్, టైప్ 2 డయాబెటిస్ మెల్లిటస్, గర్భధారణ మధుమేహం, మెటబాలిక్ సిండ్రోమ్.",
    hi: "टाइप 1 मधुमेह, टाइप 2 मधुमेह, गर्भावधि मधुमेह, मेटाबॉलिक सिंड्रोम।"
  },
  "Automated HPLC HbA1c glycated hemoglobin assessment": {
    te: "ఆటోమేటెడ్ HPLC HbA1c గ్లైకేటెడ్ హిమోగ్లోబిన్ పరీక్ష",
    hi: "स्वचालित HPLC HbA1c ग्लाइकेटेड हीमोग्लोबिन जांच"
  },
  "Fasting & 2-hour postprandial glucose tracking": {
    te: "ఫాస్టింగ్ మరియు 2 గంటల తిన్న తర్వాత గ్లూకోజ్ ట్రాకింగ్",
    hi: "फास्टिंग और भोजन के 2 घंटे बाद ग्लूकोज ट्रैकिंग"
  },
  "Microalbuminuria urine creatinine ratio (ACR)": {
    te: "మైక్రోఅల్బుమిన్యూరియా యూరిన్ క్రియాటినిన్ నిష్పత్తి (ACR)",
    hi: "माइक्रोएल्बुमिन्यूरिया मूत्र क्रिएटिनिन अनुपात (ACR)"
  },
  "Individualized basal-bolus insulin titration": {
    te: "వ్యక్తిగత బేసల్-బోలస్ ఇన్సులిన్ టైట్రేషన్",
    hi: "व्यक्तिगत बेसल-बोलस इंसुलिन अनुमापन"
  },
  "Dietary carbohydrate-exchange planning": {
    te: "ఆహార కార్బోహైడ్రేట్-మార్పిడి ప్రణాళిక",
    hi: "आहार कार्बोहाइड्रेट-विनिमय योजना"
  },
  "Preventing Diabetic Foot Complications and Amputations": {
    te: "డయాబెటిక్ పాదాల సమస్యలు మరియు అవయవ తొలగింపు నివారణ",
    hi: "डायबिटिक पैर की जटिलताओं और विच्छेदन की रोकथाम"
  },
  "Diabetic peripheral neuropathy is often silent until sensory loss leads to unnoticed trauma, non-healing neuropathic ulcers, and osteomyelitis. Our specialized diabetic podiatry clinic conducts quantitative electrodiagnostic evaluations to detect small and large fiber nerve injury at the earliest reversible stages.": {
    te: "డయాబెటిక్ పెరిఫెరల్ న్యూరోపతి స్పర్శ కోల్పోయే వరకు తరచుగా లక్షణాలు లేకుండా ఉంటుంది, ఇది పాదాలపై గాయాలు మరియు తీవ్రమైన పుండ్లకు దారితీస్తుంది. మా ప్రత్యేక పాదాల క్లినిక్ నరాల బలహీనతను ప్రారంభ దశలోనే గుర్తించి చికిత్స అందిస్తుంది.",
    hi: "डायबिटिक न्यूरोपैथी अक्सर तब तक मूक रहती है जब तक कि संवेदना की कमी से घाव और अल्सर न हो जाएं। हमारा विशेष पोडियाट्री क्लिनिक तंत्रिका क्षति का शुरुआती चरणों में पता लगाता है।"
  },
  "Diagnostic & Therapeutic Modalities": {
    te: "రోగ నిర్ధారణ & చికిత్సా పద్ధతులు",
    hi: "नैदानिक एवं उपचारात्मक पद्धतियां"
  },
  "Vibration Perception Threshold (VPT): Quantitative biothesiometry measuring tactile nerve conduction loss.": {
    te: "వైబ్రేషన్ పర్సెప్షన్ థ్రెషోల్డ్ (VPT): నరాల స్పర్శ వాహక నష్టాన్ని కొలిచే బయోథెసియోమెట్రీ పరీక్ష.",
    hi: "वाइब्रेशन परसेप्शन थ्रेशोल्ड (VPT): तंत्रिका चालन हानि को मापने वाला बायोथिसियोमेट्री परीक्षण।"
  },
  "10g Semmes-Weinstein Monofilament: Objective assessment of loss of protective sensation (LOPS).": {
    te: "10g సెమ్స్-వీన్‌స్టెయిన్ మోనోఫిలమెంట్: పాదాల రక్షక స్పర్శ నష్టాన్ని నిర్ధారించే పరీక్ష.",
    hi: "10 ग्राम सेमेस-वेनस्टीन मोनोफिलामेंट: सुरक्षात्मक संवेदना के नुकसान का वस्तुनिष्ठ मूल्यांकन।"
  },
  "Peripheral Arterial Doppler: Ankle-Brachial Index (ABI) to differentiate neuropathic vs ischemic foot disease.": {
    te: "పెరిఫెరల్ ఆర్టీరియల్ డాప్లర్: పాదాలకు రక్త ప్రసరణను అంచనా వేసే యాంకిల్-బ్రాకియల్ ఇండెక్స్ (ABI) పరీక్ష.",
    hi: "पेरिफेरल आर्टेरियल डॉपलर: पैर में रक्त प्रवाह का आकलन करने वाला एंकल-ब्रेकियल इंडेक्स (ABI) परीक्षण।"
  },
  "Therapeutic Orthotics: Prescription of custom-molded, dual-density diabetic footwear to redistribute plantar pressure.": {
    te: "థెరప్యూటిక్ ఆర్థోటిక్స్: పాదాలపై ఒత్తిడిని సమానంగా పంచే ప్రత్యేక డయాబెటిక్ పాదరక్షల సూచన.",
    hi: "थेराप्यूटिक ऑर्थोटिक्स: पैर के दबाव को पुनर्वितरित करने वाले विशेष डायबिटिक फुटवियर का प्रिस्क्रिप्शन।"
  },
  "Peripheral numbness, tingling, burning feet sensation, loss of protective sensation, diabetic foot ulcer risk.": {
    te: "పాదాలలో తిమ్మిర్లు, మంటలు, స్పర్శ తగ్గడం, డయాబెటిక్ పాదాల పుండ్ల ముప్పు.",
    hi: "पैरों में सुन्नता, झुनझुनी, जलन, सुरक्षात्मक संवेदना का नुकसान, पैर के अल्सर का जोखिम।"
  },
  "Quantitative biothesiometry vibration perception threshold (VPT)": {
    te: "క్వాంటిటేటివ్ బయోథెసియోమెట్రీ వైబ్రేషన్ పరీక్ష (VPT)",
    hi: "मात्रात्मक बायोथिसियोमेट्री कंपन धारणा परीक्षण (VPT)"
  },
  "10-point monofilament tactile mapping": {
    te: "10-పాయింట్ మోనోఫిలమెంట్ స్పర్శ మ్యాపింగ్",
    hi: "10-बिंदु मोनोफिलामेंट स्पर्श मैपिंग"
  },
  "Handheld acoustic vascular Doppler Ankle-Brachial Index (ABI)": {
    te: "హ్యాండ్‌హెల్డ్ వాస్కులర్ డాప్లర్ పరీక్ష (ABI)",
    hi: "हैंडहेल्ड वैस्कुलर डॉपलर एंकल-ब्रेकियल इंडेक्स (ABI)"
  },
  "Plantar high-pressure ulcer point inspection": {
    te: "అరికాలి అధిక పీడన పుండు పాయింట్ల పరీక్ష",
    hi: "तलवे के उच्च दबाव वाले अल्सर बिंदुओं का निरीक्षण"
  },
  "Therapeutic soft-sole footwear prescription": {
    te: "మృదువైన అరికాళ్ళ ప్రత్యేక డయాబెటిక్ పాదరక్షల సూచన",
    hi: "उपचारात्मक नरम तलवे वाले फुटवियर का प्रिस्क्रिप्शन"
  },
  "Gold-Standard Hemoglobinopathy Screening": {
    te: "గోల్డ్-స్టాండర్డ్ హిమోగ్లోబినోపతి స్క్రీనింగ్",
    hi: "स्वर्ण-मानक हीमोग्लोबिनोपैथी स्क्रीनिंग"
  },
  "Accurate identification of hemoglobin variants is essential for differentiating iron deficiency anemia from Beta-Thalassemia trait and diagnosing complex hemoglobinopathies like HbE, HbD-Punjab, and Sickle-Cell trait. Rithanya Hospital operates gold-standard automated HPLC chromatography.": {
    te: "ఐరన్ లోపం వల్ల వచ్చే రక్తహీనతను బీటా-తలసేమియా ట్రైట్ నుండి వేరు చేయడానికి మరియు సికిల్-సెల్ వంటి సమస్యలను గుర్తించడానికి హిమోగ్లోబిన్ వేరియంట్ల ఖచ్చితమైన నిర్ధారణ అవసరం. రితన్య హాస్పిటల్ అధునాతన ఆటోమేటెడ్ HPLC క్రోమాటోగ్రఫీని నిర్వహిస్తుంది.",
    hi: "आयरन की कमी से होने वाले एनीमिया को बीटा-थैलेसीमिया से अलग करने और सिकल-सेल जैसी जटिलताओं के निदान के लिए हीमोग्लोबिन वेरिएंट की सटीक पहचान आवश्यक है। रिथन्या अस्पताल उन्नत स्वचालित HPLC क्रोमैटोग्राफी संचालित करता है।"
  },
  "Why Automated HPLC?": {
    te: "ఆటోమేటెడ్ HPLC ఎందుకు అవసరం?",
    hi: "स्वचालित HPLC क्यों आवश्यक है?"
  },
  "High Resolution: Crisp chromatographic separation of HbA, HbA2, and HbF with exact retention windows.": {
    te: "హై రిజల్యూషన్: HbA, HbA2 మరియు HbF ల ఖచ్చితమైన క్రోమాటోగ్రాఫిక్ విభజన.",
    hi: "उच्च रिज़ॉल्यूशन: सटीक अवधारण समय के साथ HbA, HbA2 और HbF का स्पष्ट पृथक्करण।"
  },
  "Exact Quantification: Precise determination of HbA2 values (>3.5% indicative of beta-thalassemia carrier status).": {
    te: "ఖచ్చితమైన పరిమాణం: HbA2 విలువల స్పష్టమైన లెక్కింపు (>3.5% బీటా-తలసేమియా క్యారియర్‌ను సూచిస్తుంది).",
    hi: "सटीक मात्रा: HbA2 मानों का सटीक निर्धारण (>3.5% बीटा-थैलेसीमिया वाहक का संकेत)।"
  },
  "Differential Specificity: Eliminates misdiagnosis of thalassemia minor as simple refractory iron deficiency.": {
    te: "ప్రత్యేక నిర్ధారణ: తలసేమియా మైనర్‌ను సాధారణ ఐరన్ లోపంగా తప్పుగా నిర్ధారించకుండా నివారిస్తుంది.",
    hi: "सटीक विभेदन: थैलेसीमिया माइनर को साधारण आयरन की कमी समझकर गलत निदान से बचाता है।"
  },
  "Family Counseling: Comprehensive genetic screening for prospective couples to eradicate homozygous major births.": {
    te: "కుటుంబ కౌన్సెలింగ్: కాబోయే దంపతులకు జన్యు స్క్రీనింగ్ ద్వారా తలసేమియా మేజర్ పుట్టుకలను అరికట్టడం.",
    hi: "पारिवारिक परामर्श: थैलेसीमिया मेजर के जन्म को रोकने हेतु जोड़ों के लिए व्यापक आनुवंशिक स्क्रीनिंग।"
  },
  "Differential diagnosis of microcytic anemia, pre-marital screening, carrier detection of Thalassemia trait, HbS verification.": {
    te: "రక్తహీనత రకాల నిర్ధారణ, వివాహ పూర్వ స్క్రీనింగ్, తలసేమియా క్యారియర్ గుర్తింపు, HbS నిర్ధారణ.",
    hi: "माइक्रोसाइटिक एनीमिया का विभेदक निदान, विवाह पूर्व जांच, थैलेसीमिया वाहक पहचान, HbS सत्यापन।"
  },
  "Automated EDTA whole-blood aspiration": {
    te: "ఆటోమేటెడ్ EDTA రక్తం ఆస్పిరేషన్",
    hi: "स्वचालित EDTA संपूर्ण रक्त नमूना ग्रहण"
  },
  "Cation-exchange HPLC chromatographic separation": {
    te: "కాటయాన్-ఎక్స్ఛేంజ్ HPLC క్రోమాటోగ్రాఫిక్ విభజన",
    hi: "कैटायन-एक्सचेंज HPLC क्रोमैटोग्राफिक पृथक्करण"
  },
  "Percentage quantitation of HbA0, HbA2, HbF, and HbS": {
    te: "HbA0, HbA2, HbF మరియు HbS ల శాతాల ఖచ్చితమైన లెక్కింపు",
    hi: "HbA0, HbA2, HbF और HbS का प्रतिशत निर्धारण"
  },
  "Chromatographic curve and retention time validation": {
    te: "క్రోమాటోగ్రాఫిక్ కర్వ్ మరియు రిటెన్షన్ సమయం ధృవీకరణ",
    hi: "क्रोमैटोग्राफिक वक्र एवं रिटेंशन समय सत्यापन"
  },
  "Genetic counseling and family carrier pedigree chart": {
    te: "జన్యు కౌన్సెలింగ్ మరియు కుటుంబ క్యారియర్ వంశపారంపర్య చార్ట్",
    hi: "आनुवंशिक परामर्श एवं पारिवारिक वाहक चार्ट"
  },
  "Clinical Accuracy at Any Hour": {
    te: "ఏ సమయంలోనైనా అత్యున్నత క్లినికల్ ఖచ్చితత్వం",
    hi: "किसी भी समय सटीक नैदानिक परिणाम"
  },
  "Our in-house 24/7 diagnostic laboratory ensures that critical clinical decisions are backed by rapid, automated laboratory results. With continuous internal quality control and calibrated automated analyzers, test turnaround times are minimized.": {
    te: "మా అంతర్గత 24/7 డయాగ్నోస్టిక్ ల్యాబ్ ద్వారా అత్యవసర సమయాల్లో వేగవంతమైన, ఆటోమేటెడ్ ల్యాబ్ ఫలితాలతో చికిత్స అందించబడుతుంది.",
    hi: "हमारी इन-हाउस 24/7 डायग्नोस्टिक लैब त्वरित, स्वचालित परिणामों के साथ महत्वपूर्ण नैदानिक निर्णयों का समर्थन करती है।"
  },
  "Automated Testing Capabilities": {
    te: "ఆటోమేటెడ్ ల్యాబ్ సామర్థ్యాలు",
    hi: "स्वचालित परीक्षण क्षमताएं"
  },
  "5-Part Differential Hematology: Complete blood count, platelet parameters, absolute reticulocyte count.": {
    te: "5-పార్ట్ డిఫరెన్షియల్ హెమటాలజీ: పూర్తి రక్త పరీక్ష, ప్లేట్‌లెట్లు మరియు రెటిక్యులోసైట్ కౌంట్.",
    hi: "5-पार्ट डिफरेंशियल हेमेटोलॉजी: पूर्ण रक्त गणना, प्लेटलेट पैरामीटर और रेटिकुलोसाइट काउंट।"
  },
  "Clinical Biochemistry: Serum creatinine, urea, bilirubin, SGOT, SGPT, alkaline phosphatase, lipid panels.": {
    te: "క్లినికల్ బయోకెమిస్ట్రీ: సీరం క్రియాటినిన్, యూరియా, బైలిరుబిన్, SGOT, SGPT మరియు లిపిడ్ ప్రొఫైల్.",
    hi: "क्लिनिकल बायोकैमिस्ट्री: सीरम क्रिएटिनिन, यूरिया, बिलीरुबिन, SGOT, SGPT और लिपिड प्रोफाइल।"
  },
  "Electrolytes & Blood Gases: Direct ISE measurement of Sodium, Potassium, Chloride, and ionized Calcium.": {
    te: "ఎలక్ట్రోలైట్లు & రక్త వాయువులు: సోడియం, పొటాషియం, క్లోరైడ్ మరియు కాల్షియంల కొలత.",
    hi: "इलेक्ट्रोलाइट्स: सोडियम, पोटेशियम, क्लोराइड और आयनित कैल्शियम का सीधा मापन।"
  },
  "Emergency Cardiac Markers: Quantitative high-sensitivity Troponin and CK-MB testing.": {
    te: "అత్యవసర గుండె సంబంధిత మార్కర్లు: ట్రోపోనిన్ మరియు CK-MB పరీక్షలు.",
    hi: "आपातकालीन कार्डियक मार्कर: मात्रात्मक उच्च-संवेदनशीलता ट्रोपोनिन और CK-MB परीक्षण।"
  },
  "Routine inpatient vitals, pre-transfusion profiles, emergency electrolyte imbalances, acute infections.": {
    te: "ఇన్‌పేషెంట్ పరీక్షలు, ట్రాన్స్‌ఫ్యూజన్ ప్రొఫైల్స్, అత్యవసర ఎలక్ట్రోలైట్ అసమతుల్యతలు, తీవ్రమైన ఇన్ఫెక్షన్లు.",
    hi: "नियमित इनपेशेंट वाइटल्स, ट्रांसफ्यूजन पूर्व प्रोफाइल, आपातकालीन इलेक्ट्रोलाइट असंतुलन, गंभीर संक्रमण।"
  },
  "5-part automated differential hemogram (CBC)": {
    te: "5-పార్ట్ ఆటోమేటెడ్ డిఫరెన్షియల్ హెమోగ్రామ్ (CBC)",
    hi: "5-पार्ट स्वचालित डिफरेंशियल हेमोग्राम (CBC)"
  },
  "Photometric clinical chemistry automated analyzer": {
    te: "ఫోటోమెట్రిక్ క్లినికల్ కెమిస్ట్రీ ఆటోమేటెడ్ ఎనలైజర్",
    hi: "फोटोमेट्रिक क्लिनिकल केमिस्ट्री स्वचालित विश्लेषक"
  },
  "Ion-selective electrode (ISE) electrolytes panel": {
    te: "అయాన్-సెలెక్టివ్ ఎలక్ట్రోడ్ (ISE) ఎలక్ట్రోలైట్స్ ప్యానెల్",
    hi: "आयन-चयनात्मक इलेक्ट्रोड (ISE) इलेक्ट्रोलाइट्स पैनल"
  },
  "Pre-transfusion biochemical screening": {
    te: "రక్తమార్పిడికి ముందు బయోకెమికల్ స్క్రీనింగ్",
    hi: "ट्रांसफ्यूजन पूर्व बायोकेमिकल स्क्रीनिंग"
  },
  "Computerized automated report validation": {
    te: "కంప్యూటరైజ్డ్ ఆటోమేటెడ్ రిపోర్ట్ ధృవీకరణ",
    hi: "कंप्यूटरीकृत स्वचालित रिपोर्ट सत्यापन"
  },
  "Evidence-Based Hypertension Management": {
    te: "ఆధారాలతో కూడిన అధిక రక్తపోటు (బీపీ) చికిత్స",
    hi: "साक्ष्य-आधारित उच्च रक्तचाप (बीपी) प्रबंधन"
  },
  "Hypertension is a silent vascular disease that places continuous strain on the heart, cerebral arteries, and renal glomeruli. Under the direction of Dr. D. Narayana Murthy, Rithanya Hospital provides comprehensive hypertension workups to identify primary versus secondary causes and protect long-term vitality.": {
    te: "హైపర్‌టెన్షన్ అనేది గుండె, మెదడు ధమనులు మరియు మూత్రపిండాలపై నిరంతరం ఒత్తిడి తెచ్చే ఒక నిశ్శబ్ద వాస్కులర్ వ్యాధి. డాక్టర్ డి. నారాయణ మూర్తి గారి పర్యవేక్షణలో, రితన్య హాస్పిటల్ రక్తపోటుకు గల కారణాలను గుర్తించి దీర్ఘకాలిక ఆరోగ్యాన్ని కాపాడే సమగ్ర చికిత్సను అందిస్తుంది.",
    hi: "उच्च रक्तचाप एक मूक संवहनी रोग है जो हृदय, मस्तिष्क की धमनियों और गुर्दे पर निरंतर दबाव डालता है। डॉ. डी. नारायण मूर्ति के निर्देशन में, रिथन्या अस्पताल कारणों की पहचान करने और दीर्घकालिक जीवन शक्ति की रक्षा हेतु व्यापक उपचार प्रदान करता है।"
  },
  "Structured Clinical Care Protocol": {
    te: "క్రమబద్ధమైన క్లినికల్ కేర్ ప్రోటోకాల్",
    hi: "संरचित नैदानिक देखभाल प्रोटोकॉल"
  },
  "24-Hour Ambulatory Blood Pressure Monitoring: Distinguishing white-coat hypertension from nocturnal non-dipping patterns.": {
    te: "24-గంటల రక్తపోటు పర్యవేక్షణ (ABPM): సాధారణ ఒత్తిడి మరియు రాత్రి సమయాల్లో రక్తపోటు పెరుగుదలలను గుర్తించడం.",
    hi: "24 घंटे एंबुलेटरी ब्लड प्रेशर मॉनिटरिंग: सामान्य तनाव और रात के समय रक्तचाप के पैटर्न की पहचान।"
  },
  "Cardio-Renal Risk Stratification: Urine albumin-to-creatinine ratio (ACR) and 12-lead digital ECG to detect early left ventricular hypertrophy.": {
    te: "గుండె & కిడ్నీ రిస్క్ పరీక్ష: కిడ్నీ మరియు గుండె పనితీరును అంచనా వేసే యూరిన్ ACR మరియు 12-లీడ్ డిజిటల్ ECG.",
    hi: "कार्डियो-रीनल जोखिम वर्गीकरण: गुर्दे और हृदय की कार्यप्रणाली के लिए यूरिन ACR और 12-लीड डिजिटल ईसीजी।"
  },
  "Lipid & Metabolic Profiling: Assessing concurrent cardiovascular risks including dyslipidemia and insulin resistance.": {
    te: "లిపిడ్ & మెటబాలిక్ ప్రొఫైలింగ్: కొలెస్ట్రాల్ మరియు ఇన్సులిన్ రెసిస్టెన్స్‌తో కూడిన గుండె ప్రమాదాలను అంచనా వేయడం.",
    hi: "लिपिड एवं मेटाबॉलिक प्रोफाइलिंग: कोलेस्ट्रॉल और इंसुलिन प्रतिरोध से जुड़े हृदय संबंधी जोखिमों का आकलन।"
  },
  "Lifestyle & Dietary Counseling: Tailored low-sodium, potassium-rich regional dietary plans combined with optimized antihypertensive therapy.": {
    te: "జీవనశైలి & ఆహార కౌన్సెలింగ్: తక్కువ ఉప్పు, పొటాషియం సమృద్ధిగా ఉండే ప్రాంతీయ ఆహార ప్రణాళిక మరియు సరైన మందుల చికిత్స.",
    hi: "जीवनशैली एवं आहार परामर्श: कम सोडियम, पोटेशियम युक्त क्षेत्रीय आहार योजना और उचित दवा उपचार।"
  },
  "Systolic blood pressure ≥ 140 mmHg or diastolic ≥ 90 mmHg, morning occipital headaches, palpitations, dizziness, or target organ screening.": {
    te: "సిస్టోలిక్ బీపీ ≥ 140 mmHg లేదా డయాస్టోలిక్ ≥ 90 mmHg, ఉదయం తలనొప్పి, దడ, తలతిరగడం లేదా అవయవ పరీక్షలు.",
    hi: "सिस्टोलिक बीपी ≥ 140 या डायस्टोलिक ≥ 90 mmHg, सुबह सिरदर्द, घबराहट, चक्कर आना या अंग जांच।"
  },
  "Automated digital multi-reading blood pressure assessment": {
    te: "ఆటోమేటెడ్ డిజిటల్ మల్టీ-రీడింగ్ రక్తపోటు అంచనా",
    hi: "स्वचालित डिजिटल मल्टी-रीडिंग रक्तचाप मूल्यांकन"
  },
  "Resting 12-lead electrocardiogram (ECG) screening": {
    te: "రెస్టింగ్ 12-లీడ్ ఎలక్ట్రోకార్డియోగ్రామ్ (ECG) స్క్రీనింగ్",
    hi: "विश्राम 12-लीड इलेक्ट्रोकार्डियोग्राम (ईसीजी) स्क्रीनिंग"
  },
  "Urine microalbuminuria and renal function assessment": {
    te: "యూరిన్ మైక్రోఅల్బుమిన్ మరియు కిడ్నీ ఫంక్షన్ పరీక్ష",
    hi: "मूत्र माइक्रोएल्बुमिन और गुर्दे की कार्यक्षमता का आकलन"
  },
  "DASH-adapted regional Indian dietary prescription": {
    te: "DASH ఆధారిత భారతీయ ప్రాంతీయ ఆహార సూచనలు",
    hi: "DASH-अनुकूलित क्षेत्रीय भारतीय आहार योजना"
  },
  "Specialized Diabetology by Dr. D. Narayana Murthy": {
    te: "డాక్టర్ డి. నారాయణ మూర్తి గారి ఆధ్వర్యంలో ప్రత్యేక డయాబెటాలజీ",
    hi: "डॉ. डी. नारायण मूर्ति द्वारा विशेष मधुमेह विज्ञान"
  },
  "With international fellowship training in clinical endocrinology, diabetes, and renal management from the Royal College of Physicians (London), Dr. D. Narayana Murthy delivers structured, longitudinal diabetes treatment that minimizes glycemic variability and protects against microvascular complications.": {
    te: "రాయల్ కాలేజ్ ఆఫ్ ఫిజీషియన్స్ (లండన్) నుండి క్లినికల్ ఎండోక్రైనాలజీ, మధుమేహం మరియు రీనల్ మేనేజ్‌మెంట్‌లో అంతర్జాతీయ ఫెలోషిప్ శిక్షణతో, డాక్టర్ డి. నారాయణ మూర్తి గారు రక్తంలో చక్కెర హెచ్చుతగ్గులను అరికట్టి అవయవాలను రక్షించే సమగ్ర చికిత్సను అందిస్తున్నారు.",
    hi: "रॉयल कॉलेज ऑफ फिजिशियंस (लंदन) से क्लिनिकल एंडोक्रिनोलॉजी, मधुमेह और गुर्दे के प्रबंधन में अंतरराष्ट्रीय फैलोशिप के साथ, डॉ. डी. नारायण मूर्ति रक्त शर्करा के उतार-चढ़ाव को कम करने और अंगों की सुरक्षा हेतु उपचार प्रदान करते हैं।"
  },
  "Automated Bio-Rad HPLC HbA1c Testing: Certified high-performance liquid chromatography providing gold-standard 3-month glycemic averages.": {
    te: "ఆటోమేటెడ్ బయో-రాడ్ HPLC HbA1c పరీక్ష: 3 నెలల సగటు చక్కెర శాతాన్ని ఖచ్చితంగా తెలిపే గోల్డ్ స్టాండర్డ్ పరీక్ష.",
    hi: "स्वचालित बायो-रेड HPLC HbA1c परीक्षण: 3 महीने के सटीक औसत शर्करा स्तर की स्वर्ण-मानक जांच।"
  },
  "Continuous Glucose Monitoring (CGM): Identifying silent hypoglycemic spells and postprandial glucose spikes.": {
    te: "నిరంతర గ్లూకోజ్ పర్యవేక్షణ (CGM): నిశ్శబ్ద హైపోగ్లైసీమియా మరియు భోజనం తర్వాత చక్కెర పెరుగుదలను గుర్తించడం.",
    hi: "निरंतर ग्लूकोज निगरानी (CGM): मूक हाइपोग्लाइसीमिया और भोजन के बाद रक्त शर्करा में वृद्धि की पहचान।"
  },
  "Cardio-Renal Protection: SGLT2 inhibitor and GLP-1 receptor integration to preserve kidney filtration and reduce cardiovascular events.": {
    te: "కార్డియో-రీనల్ రక్షణ: కిడ్నీల వడపోతను కాపాడటానికి మరియు గుండె సంబంధిత సమస్యలను తగ్గించడానికి SGLT2 మరియు GLP-1 మందుల వినియోగం.",
    hi: "कार्डियो-रीनल सुरक्षा: गुर्दे की सुरक्षा और हृदय संबंधी घटनाओं को कम करने के लिए आधुनिक दवाओं का उपयोग।"
  },
  "Patient Empowerment: Step-by-step insulin injection technique training and hypoglycemic emergency safety kits.": {
    te: "రోగి సాధికారత: ఇన్సులిన్ ఇంజెక్షన్ పద్ధతులపై శిక్షణ మరియు లో-షుగర్ అత్యవసర సేఫ్టీ కిట్లు.",
    hi: "रोगी सशक्तिकरण: इंसुलिन इंजेक्शन तकनीक का प्रशिक्षण और हाइपोग्लाइसीमिया आपातकालीन सुरक्षा किट।"
  },
  "Type 1 and Type 2 Diabetes Mellitus, pre-diabetes, gestational diabetes, polyuria, unhealed skin lesions, or erratic glycemic variability.": {
    te: "టైప్ 1 & టైప్ 2 డయాబెటిస్, ప్రీ-డయాబెటిస్, గర్భధారణ మధుమేహం, తరచు మూత్రవిసర్జన, మానని పుండ్లు లేదా చక్కెర హెచ్చుతగ్గులు.",
    hi: "टाइप 1 और टाइप 2 मधुमेह, प्री-डायबिटीज, गर्भावधि मधुमेह, बार-बार पेशाब आना, न भरने वाले घाव या शर्करा में उतार-चढ़ाव।"
  },
  "Automated Bio-Rad HPLC HbA1c testing with same-day validation": {
    te: "అదే రోజు ఫలితాలతో ఆటోమేటెడ్ బయో-రాడ్ HPLC HbA1c పరీక్ష",
    hi: "उसी दिन सत्यापन के साथ स्वचालित बायो-रेड HPLC HbA1c परीक्षण"
  },
  "Continuous glucose sensor ambulatory glucose profiling (AGP)": {
    te: "నిరంతర గ్లూకోజ్ సెన్సార్ ఆంబులేటరీ గ్లూకోజ్ ప్రొఫైలింగ్ (AGP)",
    hi: "निरंतर ग्लूकोज सेंसर एम्बुलेटरी ग्लूकोज प्रोफाइलिंग (AGP)"
  },
  "Diabetic peripheral neuropathy 10g monofilament mapping": {
    te: "డయాబెటిక్ న్యూరోపతి 10g మోనోఫిలమెంట్ స్పర్శ మ్యాపింగ్",
    hi: "डायबिटिक न्यूरोपैथी 10 ग्राम मोनोफिलामेंट मैपिंग"
  },
  "Individualized carbohydrate-exchange nutritional counseling": {
    te: "వ్యక్తిగత కార్బోహైడ్రేట్-ఎక్స్ఛేంజ్ పోషకాహార కౌన్సెలింగ్",
    hi: "व्यक्तिगत कार्बोहाइड्रेट-विनिमय पोषण परामर्श"
  },
  "Modern Bronchial Asthma Care": {
    te: "ఆధునిక బ్రోన్కియల్ అస్తమా సంరక్షణ",
    hi: "आधुनिक ब्रोन्कियल अस्थमा देखभाल"
  },
  "Asthma is a chronic inflammatory disorder of the bronchial tree. At Rithanya Hospital, our clinical protocol focuses on identifying individual allergic triggers and controlling inflammation at the mucosal level rather than relying solely on rescue bronchodilators.": {
    te: "అస్తమా అనేది శ్వాసనాళాల దీర్ఘకాలిక వాపు సమస్య. రితన్య హాస్పిటల్‌లో, మా చికిత్స అలెర్జీ కారకాలను గుర్తించి కేవలం ఇన్‌హేలర్లపై మాత్రమే ఆధారపడకుండా శ్వాసనాళాల వాపును తగ్గించడంపై దృష్టి పెడుతుంది.",
    hi: "अस्थमा श्वसन नलियों की एक पुरानी सूजन की बीमारी है। रिथन्या अस्पताल में हमारा प्रोटोकॉल केवल इनहेलर पर निर्भर रहने के बजाय एलर्जी के कारणों की पहचान करने और सूजन को नियंत्रित करने पर केंद्रित है।"
  },
  "Treatment Pathway": {
    te: "చికిత్సా మార్గం",
    hi: "उपचार पथ"
  },
  "Peak Expiratory Flow Rate (PEFR): Quantitative monitoring of diurnal bronchial constriction.": {
    te: "పీక్ ఎక్స్‌పిరేటరీ ఫ్లో రేట్ (PEFR): శ్వాసనాళాల సంకోచాన్ని కొలిచే పీఈఎఫ్‌ఆర్ పరీక్ష.",
    hi: "पीक एक्सपाइरेटरी फ्लो रेट (PEFR): ब्रोन्कियल संकुचन की मात्रात्मक निगरानी।"
  },
  "Inhaler Technique Calibration: Hands-on training with spacer devices to guarantee lung deposition and minimize oral candidiasis.": {
    te: "ఇన్‌హేలర్ వినియోగ శిక్షణ: మందు ఊపిరితిత్తులలోకి సరిగ్గా చేరేలా స్పేసర్ పరికరాల వినియోగంపై ప్రత్యక్ష శిక్షణ.",
    hi: "इनहेलर तकनीक अंशांकन: फेफड़ों में दवा के सही अवशोषण हेतु स्पेसर उपकरणों के साथ व्यावहारिक प्रशिक्षण।"
  },
  "Step-Up & Step-Down Regimens: Tailored combination of inhaled corticosteroids (ICS) and long-acting beta-agonists (LABA).": {
    te: "స్టెప్-అప్ & స్టెప్-డౌన్ విధానం: ఇన్‌హేల్డ్ కార్టికోస్టెరాయిడ్స్ (ICS) మరియు దీర్ఘకాలిక బ్రోంకోడైలేటర్ల సమతుల్య వినియోగం.",
    hi: "स्टेप-अप एवं स्टेप-डाउन दृष्टिकोण: आवश्यकतानुसार इनहेल्ड कॉर्टिकोस्टेरॉइड्स और दवाओं का संतुलित संयोजन।"
  },
  "Recurrent wheezing, nighttime coughing, chest tightness, dyspnea triggered by dust, cold air, or seasonal pollen.": {
    te: "తరచుగా పిల్లికూతలు, రాత్రిపూట దగ్గు, ఛాతీలో బిగుతు, దుమ్ము లేదా చలిగాలి వల్ల శ్వాస ఆడకపోవడం.",
    hi: "बार-बार घरघराहट, रात में खांसी, सीने में जकड़न, धूल, ठंडी हवा या मौसमी पराग से सांस लेने में कठिनाई।"
  },
  "Peak expiratory flow rate (PEFR) spirometric assessment": {
    te: "పీక్ ఎక్స్‌పిరేటరీ ఫ్లో రేట్ (PEFR) స్పైరోమెట్రిక్ పరీక్ష",
    hi: "पीक एक्सपाइरेटरी फ्लो रेट (PEFR) स्पाइरोमेट्रिक मूल्यांकन"
  },
  "Metered-dose inhaler spacer technique calibration": {
    te: "మీటర్డ్-డోస్ ఇన్‌హేలర్ స్పేసర్ సాంకేతిక శిక్షణ",
    hi: "मीटर्ड-डोज़ इनहेलर स्पेसर तकनीक प्रशिक्षण"
  },
  "Allergic trigger identification and avoidance counseling": {
    te: "అలెర్జీ కారకాల గుర్తింపు మరియు నివారణ కౌన్సెలింగ్",
    hi: "एलर्जी कारकों की पहचान और बचाव परामर्श"
  },
  "Stepwise asthma controller medication titration": {
    te: "దశలవారీ అస్తమా నియంత్రణ ఔషధాల టైట్రేషన్",
    hi: "चरणबद्ध अस्थमा नियंत्रक दवा अनुमापन"
  },
  "MD (General Physician SVIMS) • Ex. Senior Resident (SVIMS) • Ex. Resident (JIPMER) • Fellowship in Clinical Endocrinology & Diabetes RCP (London) • Fellowship in Diabetes & Renal Management RCP (London)": {
    te: "MD (జనరల్ ఫిజీషియన్ SVIMS) • మాజీ సీనియర్ రెసిడెంట్ (SVIMS) • మాజీ రెసిడెంట్ (JIPMER) • ఫెలోషిప్ ఇన్ క్లినికల్ ఎండోక్రైనాలజీ & డయాబెటిస్ RCP (లండన్) • ఫెలోషిప్ ఇన్ డయాబెటిస్ & రీనల్ మేనేజ్‌మెంట్ RCP (లండన్)",
    hi: "MD (जनरल फिजिशियन SVIMS) • पूर्व सीनियर रेजिडेंट (SVIMS) • पूर्व रेजिडेंट (JIPMER) • फेलोशिप इन क्लिनिकल एंडोक्रिनोलॉजी एंड डायबिटीज RCP (लंदन) • फेलोशिप इन डायबिटीज एंड रीनल मैनेजमेंट RCP (लंदन)"
  },
  "Renowned senior physician in Khammam known for compassionate patient care, accurate differential diagnosis, and evidence-backed diabetes management programs.": {
    te: "ఖమ్మంలో కరుణతో కూడిన రోగి సంరక్షణ, ఖచ్చితమైన రోగ నిర్ధారణ మరియు ఆధునిక మధుమేహ నియంత్రణ చికిత్సలకు ప్రసిద్ధి చెందిన ప్రముఖ సీనియర్ వైద్యులు.",
    hi: "खम्मम में संवेदनशील रोगी देखभाल, सटीक रोग निदान और साक्ष्य-आधारित मधुमेह प्रबंधन कार्यक्रमों के लिए जाने जाने वाले प्रसिद्ध वरिष्ठ चिकित्सक।"
  },
  "Directs all inpatient, emergency, and 24/7 Daycare Transfusion protocols at Rithanya Hospital, guaranteeing scientific rigor without irrational polypharmacy.": {
    te: "రితన్య హాస్పిటల్‌లో ఇన్‌పేషెంట్, అత్యవసర మరియు 24/7 డేకేర్ రక్త మార్పిడి విభాగాలను ప్రత్యక్షంగా పర్యవేక్షిస్తూ, అనవసరమైన మందులు లేకుండా శాస్త్రీయ చికిత్సను అందిస్తున్నారు.",
    hi: "रिथन्या अस्पताल में सभी इनपेशेंट, आपातकालीन और 24/7 डेकेयर रक्त आधान प्रोटोकॉल का निर्देशन करते हैं, जिससे अनावश्यक दवाओं के बिना वैज्ञानिक उपचार सुनिश्चित होता है।"
  },
  "Over 22+ Years of tertiary clinical and diabetic excellence": {
    te: "డయాబెటాలజీ మరియు ఇంటర్నల్ మెడిసిన్‌లో 22+ సంవత్సరాల సుదీర్ఘ అనుభవం",
    hi: "मधुमेह एवं आंतरिक चिकित्सा में 22+ वर्षों का दीर्घ नैदानिक अनुभव"
  },
  "Director of Rithanya 24 Hours Blood Bank on Nehru nagar Road": {
    te: "నెహ్రూ నగర్ రోడ్డులోని రితన్య 24 గంటల బ్లడ్ బ్యాంక్ డైరెక్టర్",
    hi: "नेहरू नगर रोड स्थित रिथन्या 24 घंटे ब्लड बैंक के निदेशक"
  },
  "Lead clinician for Thalassemia Daycare Transfusions & HPLC testing": {
    te: "తలసేమియా డేకేర్ రక్త మార్పిడి మరియు HPLC పరీక్షల ముఖ్య పర్యవేక్షకులు",
    hi: "थैलेसीमिया डेकेयर रक्त आधान एवं HPLC परीक्षण के प्रमुख चिकित्सक"
  },
  "M.B.B.S. • Gynecologist & Women's Health Specialist (స్త్రీల వైద్య నిపుణులు) • Focused on comprehensive maternal care, adolescent wellness, and endocrine health.": {
    te: "M.B.B.S. • గైనకాలజిస్ట్ & స్త్రీల వైద్య నిపుణులు • సమగ్ర ప్రసూతి సంరక్షణ, కౌమార బాలికల ఆరోగ్యం మరియు హార్మోన్ల సమస్యల నివారణ.",
    hi: "M.B.B.S. • स्त्री रोग एवं महिला स्वास्थ्य विशेषज्ञ • व्यापक मातृ देखभाल, किशोर स्वास्थ्य एवं हार्मोनल संतुलन पर केंद्रित।"
  },
  "Dr. A. Lakshmi Deepa is an experienced and compassionate Women's Health Specialist and Gynecologist. Dedicated to empowering women through proactive preventive care, adolescent health, maternal wellness, and management of complex gynecological disorders.": {
    te: "డాక్టర్ ఎ. లక్ష్మీ దీప గారు అనుభవజ్ఞులైన మహిళా వైద్య నిపుణులు మరియు గైనకాలజిస్ట్. నివారణ వైద్యం, కౌమార ఆరోగ్యం, ప్రసూతి సంరక్షణ మరియు సంక్లిష్ట స్త్రీల సమస్యలకు సానుభూతితో కూడిన చికిత్స అందిస్తున్నారు.",
    hi: "डॉ. ए. लक्ष्मी दीपा एक अनुभवी और संवेदनशील महिला स्वास्थ्य विशेषज्ञ एवं स्त्री रोग विशेषज्ञ हैं। वे निवारक देखभाल, किशोर स्वास्थ्य, मातृ कल्याण और जटिल स्त्री रोगों के प्रबंधन के लिए समर्पित हैं।"
  },
  "Provides empathetic, confidential consultations in Khammam covering prenatal guidance, PCOS regulation, infertility workups, and perimenopausal wellbeing.": {
    te: "ఖమ్మంలో గర్భధారణ సంరక్షణ, పిసిఒడి/పిసిఒఎస్ నియంత్రణ, సంతానలేమి పరీక్షలు మరియు మోనోపాజ్ సమస్యలకు పూర్తి గోప్యతతో కూడిన సంప్రదింపులు అందిస్తారు.",
    hi: "खम्मम में प्रसवपूर्व मार्गदर्शन, पीसीओएस विनियमन, बांझपन जांच और रजोनिवृत्ति स्वास्थ्य पर संवेदनशील व गोपनीय परामर्श प्रदान करती हैं।"
  },
  "16+ Years of compassionate clinical care in women’s health": {
    te: "మహిళా వైద్యంలో 16+ సంవత్సరాల అంకితభావంతో కూడిన అనుభవం",
    hi: "महिला स्वास्थ्य में 16+ वर्षों का समर्पित नैदानिक अनुभव"
  },
  "Comprehensive antenatal, adolescent, and perimenopausal support": {
    te: "సమగ్ర ప్రసవపూర్వ, కౌమార మరియు మెనోపాజ్ ఆరోగ్య సంరక్షణ",
    hi: "व्यापक प्रसवपूर्व, किशोर और रजोनिवृत्ति स्वास्थ्य सहायता"
  },
  "Holistic lifestyle and endocrine care for adolescent wellness & PCOS": {
    te: "కౌమార బాలికల ఆరోగ్యం మరియు పిసిఒఎస్ కోసం సంపూర్ణ జీవనశైలి సంరక్షణ",
    hi: "किशोरियों के स्वास्थ्य एवं पीसीओएस के लिए समग्र जीवनशैली एवं हार्मोनल देखभाल"
  },
  "డా॥ డి. నారాయణమూర్తి • Regd. No. 81187": {
    te: "డా॥ డి. నారాయణమూర్తి • Regd. No. 81187",
    hi: "डॉ. डी. नारायण मूर्ति • पंजीकरण सं. 81187"
  },
  "డా॥ డి. నారాయణమూర్తి (APMC/TSMC Regn. 81187)": {
    te: "డా॥ డి. నారాయణమూర్తి (APMC/TSMC Regn. 81187)",
    hi: "डॉ. डी. नारायण मूर्ति (APMC/TSMC पंजीकरण 81187)"
  },
  "డా॥ ఎ. లక్ష్మీదీప • Regd. No. 19422": {
    te: "డా॥ ఎ. లక్ష్మీదీప • Regd. No. 19422",
    hi: "डॉ. ए. लक्ष्मी दीपा • पंजीकरण सं. 19422"
  },
  "డా॥ ఎ. లక్ష్మీదీప (Regn. 19422)": {
    te: "డా॥ ఎ. లక్ష్మీదీప (Regn. 19422)",
    hi: "डॉ. ए. लक्ष्मी दीपा (पंजीकरण 19422)"
  }
};


/**
 * Universal text localizer
 */
export function localizeText(text, lang = 'en') {
  if (!text || typeof text !== 'string') return text;
  const trimmed = text.trim();

  // 1. Direct dictionary lookup (works for en, te, hi)
  if (TRANSLATION_MAP[trimmed] && TRANSLATION_MAP[trimmed][lang]) {
    return TRANSLATION_MAP[trimmed][lang];
  }

  if (lang === 'en') {
    if (trimmed.includes('నారాయణమూర్తి')) {
      return trimmed.replace('డా॥ డి. నారాయణమూర్తి', 'Dr. D. Narayana Murthy');
    }
    if (trimmed.includes('లక్ష్మీదీప')) {
      return trimmed.replace('డా॥ ఎ. లక్ష్మీదీప', 'Dr. A. Lakshmi Deepa');
    }
    // If text is in the format "English / Alternate (తెలుగు)", clean it for English view
    const parenIndex = text.indexOf('(');
    if (parenIndex > 0 && /[\u0C00-\u0C7F]/.test(text)) {
      return text.slice(0, parenIndex).trim();
    }
    return text;
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

  // Doctor Name Normalization (handles "Dr D Narayana Murthy", "Dr. D. Narayana Murthy", "Dr Narayana Murthy", etc.)
  const cleanName = trimmed.replace(/\./g, '').replace(/\s+/g, ' ').toLowerCase();
  if (cleanName.includes('narayana murthy')) {
    if (lang === 'te') return 'డాక్టర్ డి. నారాయణ మూర్తి';
    if (lang === 'hi') return 'डॉ. डी. नारायण मूर्ति';
  }
  if (cleanName.includes('lakshmi deepa') || cleanName.includes('laxmi dipa')) {
    if (lang === 'te') return 'డాక్టర్ ఎ. లక్ష్మీ దీప';
    if (lang === 'hi') return 'डॉ. ए. लक्ष्मी दीपा';
  }

  // Doctor Role / Designation
  if (cleanName === 'doctor') {
    if (lang === 'te') return 'వైద్యులు';
    if (lang === 'hi') return 'चिकित्सक';
  }
  if (cleanName === 'general diabetologist') {
    if (lang === 'te') return 'జనరల్ డయాబెటాలజిస్ట్';
    if (lang === 'hi') return 'जनरल मधुमेह विशेषज्ञ';
  }

  // Doctor Experience pattern (e.g. "18 + Years", "18+ Years", "22+ Years Clinical Excellence")
  const expMatch = trimmed.match(/^(\d+)\s*\+?\s*years?(\s*clinical\s*excellence)?$/i);
  if (expMatch) {
    const num = expMatch[1];
    if (lang === 'te') return `${num}+ సంవత్సరాల అనుభవం`;
    if (lang === 'hi') return `${num}+ वर्षों का अनुभव`;
  }

  // Doctor Qualifications pattern (e.g. "M.D. SVIMS", "MD SVIMS", "MD (SVIMS)")
  if (/^m\.?d\.?\s*\(?svims\)?$/i.test(trimmed)) {
    if (lang === 'te') return 'ఎం.డి. స్విమ్స్ (SVIMS)';
    if (lang === 'hi') return 'एम.डी. स्विम्स (SVIMS)';
  }

  // Doctor OPD Timings / Consultation Hours pattern:
  // e.g. "Morning: 10:00 AM – 02:00 PM | Evening: 06:00 PM – 09:00 PM"
  if (/morning|evening|afternoon|mon\s*[-–]\s*sat/i.test(trimmed)) {
    let tStr = trimmed;
    if (lang === 'te') {
      tStr = tStr
        .replace(/Morning\s*:/gi, 'ఉదయం:')
        .replace(/Evening\s*:/gi, 'సాయంత్రం:')
        .replace(/Afternoon\s*:/gi, 'మధ్యాహ్నం:')
        .replace(/Mon\s*[-–]\s*Sat\s*:/gi, 'సోమ - శని:')
        .replace(/Mon\s*[-–]\s*Sat/gi, 'సోమ - శని')
        .replace(/Daily\s*:/gi, 'ప్రతిరోజూ:')
        .replace(/Daily/gi, 'ప్రతిరోజూ');
      return tStr;
    }
    if (lang === 'hi') {
      tStr = tStr
        .replace(/Morning\s*:/gi, 'सुबह:')
        .replace(/Evening\s*:/gi, 'शाम:')
        .replace(/Afternoon\s*:/gi, 'दोपहर:')
        .replace(/Mon\s*[-–]\s*Sat\s*:/gi, 'सोम - शनि:')
        .replace(/Mon\s*[-–]\s*Sat/gi, 'सोम - शनि')
        .replace(/Daily\s*:/gi, 'प्रतिदिन:')
        .replace(/Daily/gi, 'प्रतिदिन');
      return tStr;
    }
  }

  // 4. HTML tag and sentence-level replacement
  let result = text;
  if (lang === 'te' || lang === 'hi') {
    // CRITICAL: Only keys that are complete sentences, headings, or HTML tags (have spaces or are > 14 chars)
    // NEVER replace single isolated words (like "Diabetes", "Hypertension", "Asthma") inside English text,
    // because that corrupts English sentences into broken hybrids!
    const sortedKeys = Object.keys(TRANSLATION_MAP)
      .filter((k) => k.length > 14 || k.includes(' ') || k.startsWith('<'))
      .sort((a, b) => b.length - a.length);

    for (const key of sortedKeys) {
      if (result.includes(key) && TRANSLATION_MAP[key][lang]) {
        result = result.replaceAll(key, TRANSLATION_MAP[key][lang]);
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
  if (localized.doctorName) localized.doctorName = localizeText(localized.doctorName, lang);
  if (localized.discountText) localized.discountText = localizeText(localized.discountText, lang);
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
