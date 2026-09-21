const { invalidatePublicCache } = require('../utils/publicDataCache');

/**
 * Exact 6 Clinical Treatments for Rithanya Hospital
 * Master verified data synchronized on production startup
 */
const EXACT_6_TREATMENTS = [
  {
    slug: 'thalassemia-daycare-transfusion-leukodepletion',
    title: 'Thalassemia Daycare Transfusion & Leukodepletion',
    department: 'Hematology & Transfusion Centre',
    category: 'Daycare Hematology',
    doctorName: 'Dr. Narayana Murthy, MD',
    duration: '3 - 4 Hours',
    status: 'draft',
    tag: 'Comprehensive Daycare Protocol',
    sortOrder: 1,
    coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85',
    summary: 'Comprehensive protocol-driven daycare packed red blood cell transfusion utilizing in-line 3rd generation leukodepletion filtration, rigorous pre-transfusion crossmatching, bedside vitals monitoring, and adverse reaction prophylaxis for pediatric and adult thalassemia patients.',
    indications: 'Beta Thalassemia Major, HbE Thalassemia, severe transfusion-dependent thalassemia with pre-transfusion Hb < 9.0–9.5 g/dL, Sickle Cell Anemia requiring periodic top-up transfusions or acute splenic sequestration management.',
    content: `<h2>Daycare Transfusion & Leukodepletion Clinical Protocol</h2>
<p>At Rithanya Hospital, Khammam, under the clinical leadership of <strong>Dr. Narayana Murthy, MD</strong>, our dedicated Daycare Transfusion Centre provides comprehensive, child-friendly blood transfusion therapy designed to minimize alloimmunization and febrile non-hemolytic transfusion reactions (FNHTR).</p>
<h3>Key Clinical Steps</h3>
<ul>
  <li><strong>Pre-Transfusion Compatibility Testing:</strong> Rigorous ABO, Rh(D), and extended minor antigen crossmatching verified in our 24/7 licensed in-house blood bank.</li>
  <li><strong>Third-Generation Leukodepletion Filtration:</strong> Pre-storage or bedside leukocyte reduction filters removing >99.9% of white blood cells to prevent HLA alloimmunization, CMV transmission, and febrile reactions.</li>
  <li><strong>Supervised Hemodynamic Monitoring:</strong> Continuous baseline and 15-minute interval pulse, blood pressure, temperature, and SpO2 recording by specialized oncology-trained nurses.</li>
  <li><strong>Volume & Infusion Rate Regulation:</strong> Precise pediatric volume calculation (10–15 mL/kg) administered via automated volumetric infusion pumps to prevent circulatory volume overload.</li>
  <li><strong>Aarogyasri Cashless Daycare Coverage:</strong> Fully supported under Telangana state Aarogyasri health scheme for eligible thalassemia and sickle cell children.</li>
</ul>
<h3>Post-Transfusion Care & Iron Management</h3>
<p>Each daycare cycle concludes with post-transfusion hemoglobin monitoring, iron burden tracking, and timely coordination with oral or subcutaneous iron chelation therapy.</p>`,
    procedures: [
      'Comprehensive pre-transfusion cross-matching and phenotype verification',
      'Continuous bedside vital sign and pulse oximetry monitoring',
      'In-line 3rd-generation leukocyte reduction (leukodepletion) filtration',
      'Automated volumetric infusion rate calibration (10-15 mL/kg)',
      'Slow-rate normal saline flush and 30-minute post-transfusion observation',
      'Free Aarogyasri daycare documentation and dietary nutritional guidance'
    ]
  },
  {
    slug: 'oral-infusion-iron-chelation-therapy',
    title: 'Oral & Infusion Iron Chelation Therapy',
    department: 'Hematology & Endocrinology',
    category: 'Hematology & Chelation',
    doctorName: 'Dr. Narayana Murthy, MD',
    duration: '60 mins Clinical Audit',
    status: 'published',
    tag: 'Organ-Protective Chelation',
    sortOrder: 2,
    coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=85',
    summary: 'Structured systemic iron burden assessment and multi-agent chelation protocols (Deferasirox, Deferiprone, Deferoxamine) protecting hepatic, cardiac, and endocrine organs against chronic transfusional hemosiderosis.',
    indications: 'Transfusional iron overload in thalassemia and sickle cell anemia with serum ferritin > 1000 ng/mL, cumulative transfusion history > 10–20 packed RBC units, or elevated hepatic/cardiac T2* MRI iron concentration.',
    content: `<h2>Systemic Iron Burden Management & Chelation Protocol</h2>
<p>Repeated blood transfusions inevitably deposit toxic unliganded iron into the liver parenchyma, myocardium, and endocrine glands. Under <strong>Dr. Narayana Murthy, MD</strong>, Rithanya Hospital conducts routine longitudinal iron audits to individualize chelation regimens and preserve vital organ architecture.</p>
<h3>Structured Clinical Regimen</h3>
<ul>
  <li><strong>Ferritin & Metabolic Auditing:</strong> Monthly to quarterly serum ferritin tracking combined with complete liver and renal function profiling.</li>
  <li><strong>Oral Chelation Titration (Deferasirox / Deferiprone):</strong> Weight-based daily oral monotherapy or synergistic dual combination therapy to clear circulating non-transferrin-bound iron (NTBI).</li>
  <li><strong>Parenteral Desferrioxamine Infusions:</strong> Subcutaneous or intravenous infusion pump protocols for high-burden systemic iron overload or patients requiring intensified negative iron balance.</li>
  <li><strong>Endocrine & Cardiac Protection:</strong> Periodic echocardiography, cardiac T2* correlation, growth velocity charting, and screening for iron-induced hypogonadism and diabetes.</li>
  <li><strong>Safety Monitoring:</strong> Routine audiometric and ophthalmological slit-lamp screenings to rule out rare chelator-associated toxicities.</li>
</ul>`,
    procedures: [
      'Serum ferritin, transferrin saturation, and complete metabolic profile analysis',
      'Liver enzymes (ALT/AST) and serum creatinine baseline clearance calculation',
      'Customized oral chelation dose titration (Deferasirox / Deferiprone)',
      'Subcutaneous Desferrioxamine ambulatory infusion pump calibration and caregiver training',
      'Periodic audiometry, ophthalmology, and bone mineral density surveillance',
      'Dietary counseling on iron absorption inhibitors (tea, dairy) and vitamin C timing'
    ]
  },
  {
    slug: 'clinical-diabetology-glycemic-regulation',
    title: 'Clinical Diabetology & Glycemic Regulation',
    department: 'General Medicine & Diabetology',
    category: 'Endocrinology',
    doctorName: 'Dr. Narayana Murthy, MD',
    duration: '45 mins Consultation',
    status: 'published',
    tag: 'Longitudinal Glycemic Control',
    sortOrder: 3,
    coverImage: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=1200&q=85',
    summary: 'Advanced glycemic stabilization, continuous glucose monitoring (CGM), customized insulin titration, and cardiorenal-protective diabetes care guided by Royal College of Physicians (London) fellowship protocols.',
    indications: 'Type 2 Diabetes Mellitus, Type 1 Diabetes, brittle glycemic fluctuations, uncontrolled HbA1c > 8.0%, Gestational Diabetes Mellitus (GDM), metabolic syndrome, and early diabetic microvascular complications.',
    content: `<h2>Comprehensive Diabetology & Cardiorenal Protection</h2>
<p>Guided by <strong>Dr. D. Narayana Murthy</strong> (MD SVIMS, Fellowship in Clinical Endocrinology & Diabetes RCP London, Fellowship in Diabetes and Renal Management RCP London), our diabetology department moves beyond simple blood sugar suppression toward comprehensive cardio-renal-metabolic longevity.</p>
<h3>Clinical Capabilities</h3>
<ul>
  <li><strong>Precision Glycemic Profiling:</strong> Combining rapid in-clinic automated HbA1c testing with 14-day continuous glucose monitoring (CGM) for ambulatory glucose profile (AGP) analytics.</li>
  <li><strong>Insulin Regimen Customization:</strong> Tailored basal, bolus, and premix insulin initiation using precision pen devices, carbohydrate counting, and hypoglycemia prevention strategies.</li>
  <li><strong>Organ-Protective Pharmacotherapy:</strong> Evidence-based integration of modern SGLT2 inhibitors and GLP-1 receptor agonists for cardiovascular and diabetic kidney disease protection.</li>
  <li><strong>Gestational Diabetes Protocols:</strong> Close maternal and fetal glycemic regulation in collaboration with our women\'s health team.</li>
  <li><strong>Diabetes Self-Management Education:</strong> Structured patient counseling covering sick-day rules, home glucometer calibration, and foot hygiene.</li>
</ul>`,
    procedures: [
      'Point-of-care HbA1c and multi-point fasting & postprandial glucose profiling',
      'Real-time Continuous Glucose Monitoring (CGM) sensor application and AGP analysis',
      'Basal-bolus and premix insulin regimen calculation with patient pen technique audit',
      'Cardiorenal risk assessment (Urine Albumin-to-Creatinine Ratio, lipid fractionation)',
      'Individualized regional low-glycemic medical nutrition therapy plan',
      'Hypoglycemia risk education and rescue management training'
    ]
  },
  {
    slug: 'diabetic-neuropathy-diagnostics-podiatry',
    title: 'Diabetic Neuropathy Diagnostics & Podiatry',
    department: 'Diabetic Foot & Vascular Care',
    category: 'Neuropathy & Podiatry',
    doctorName: 'Dr. Narayana Murthy, MD',
    duration: '45 mins Evaluation',
    status: 'published',
    tag: 'Microvascular & Podiatric Care',
    sortOrder: 4,
    coverImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=85',
    summary: 'Comprehensive diabetic foot risk stratification utilizing 10g Semmes-Weinstein monofilaments, digital biothesiometry, handheld vascular Doppler ABI, callus debridement, and prophylactic ulcer prevention.',
    indications: 'Diabetic peripheral neuropathy, tingling or numbness in toes/feet, loss of protective sensation, burning paresthesia, non-healing calluses, peripheral arterial disease, and high-risk diabetic foot screening.',
    content: `<h2>Diabetic Neuropathy Diagnostics & Podiatric Salvage</h2>
<p>Diabetic peripheral neuropathy and microvascular insufficiency are the leading non-traumatic causes of lower extremity amputations. Under <strong>Dr. Narayana Murthy, MD</strong>, Rithanya Hospital provides early sensory-vascular diagnostics and podiatric interventions to safeguard foot integrity.</p>
<h3>Diagnostic & Treatment Battery</h3>
<ul>
  <li><strong>Loss of Protective Sensation (LOPS) Testing:</strong> Systematic 10-point plantar evaluation using 10g Semmes-Weinstein calibrated monofilament.</li>
  <li><strong>Quantitative Vibration Perception Threshold (VPT):</strong> High-precision digital biothesiometry detecting subclinical large-fiber sensory degradation before ulceration occurs.</li>
  <li><strong>Vascular Perfusion Assessment:</strong> Bidirectional handheld Doppler ultrasound calculation of the Ankle-Brachial Index (ABI) to diagnose peripheral arterial disease (PAD).</li>
  <li><strong>Clinical Podiatry & Debridement:</strong> Aseptic reduction of hyperkeratotic calluses, corns, and nail dystrophies to relieve focal peak plantar pressures.</li>
  <li><strong>Therapeutic Footwear Guidance:</strong> Custom orthotic shoe recommendations with extra-depth rocker soles and seamless pressure-dispersing insoles.</li>
</ul>`,
    procedures: [
      '10-point calibrated Semmes-Weinstein 10g monofilament sensory mapping',
      'Digital biothesiometry quantitative vibration perception threshold (VPT) testing',
      'Bidirectional vascular Doppler evaluation with Ankle-Brachial Index (ABI)',
      'Podiatric aseptic callus reduction and nail pathology care',
      'Plantar pressure hotspot identification and off-loading recommendations',
      'Prescription of customized diabetic protective footwear and daily self-inspection checklist'
    ]
  },
  {
    slug: 'automated-hplc-hemoglobin-electrophoresis',
    title: 'Automated HPLC Hemoglobin Electrophoresis',
    department: 'Clinical Pathology',
    category: 'Laboratory Diagnostics',
    doctorName: 'Dr. K. Srinivas Rao',
    duration: 'Same-Day Automated Report',
    status: 'published',
    tag: 'Gold Standard Chromatography',
    sortOrder: 5,
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85',
    summary: 'Gold-standard high-performance liquid chromatography (HPLC) quantitative hemoglobin fraction determination for the accurate diagnosis of Beta Thalassemia traits, Sickle Cell hemoglobinopathy, and structural Hb variants.',
    indications: 'Unexplained microcytic hypochromic anemia unresponsive to oral iron therapy, premarital and antenatal thalassemia trait screening, family history of hemoglobinopathies, and abnormal peripheral blood smear.',
    content: `<h2>Automated HPLC Hemoglobin Electrophoresis</h2>
<p>High-Performance Liquid Chromatography (HPLC) is the international gold standard for separating and quantifying human hemoglobin fractions. At Rithanya Hospital\'s clinical pathology division, supervised by <strong>Dr. K. Srinivas Rao</strong>, our automated cation-exchange HPLC system provides rapid, definitive diagnostic reporting.</p>
<h3>Diagnostic Advantages</h3>
<ul>
  <li><strong>Exact Quantitation:</strong> High-resolution quantification of HbA2, HbF, and adult HbA with coefficient of variation < 2%.</li>
  <li><strong>Thalassemia Minor Differentiation:</strong> Unequivocally differentiates Beta Thalassemia Trait (elevated HbA2 > 3.5%) from nutritional iron deficiency anemia.</li>
  <li><strong>Hemoglobin Variant Detection:</strong> Precise identification and retention time window quantification of HbS (Sickle Cell), HbD-Punjab, HbE, and HbC variants.</li>
  <li><strong>Antenatal & Premarital Carrier Screening:</strong> Critical genetic counseling for carrier couples to eliminate the transmission of Thalassemia Major.</li>
  <li><strong>Integrated Hematology Correlation:</strong> Correlated directly with automated 5-part CBC red cell indices (MCV, MCH, RDW) for unambiguous clinical diagnosis.</li>
</ul>`,
    procedures: [
      'Automated cation-exchange HPLC analyzer chromatography run',
      'Precise quantitative determination of HbA2, HbF, and normal HbA percentages',
      'Window identification for structural hemoglobin variants (HbS, HbE, HbD, HbC)',
      'Laboratory Director interpretation and chromatogram curve verification',
      'Integration with complete red cell indices (MCV, MCH, Mentzer Index)',
      'Confidential premarital and antenatal genetic counseling'
    ]
  },
  {
    slug: '24-7-automated-pathology-metabolic-diagnostics',
    title: '24/7 Automated Pathology & Metabolic Diagnostics',
    department: '24/7 Diagnostic Centre',
    category: 'Clinical Pathology',
    doctorName: 'Dr. Narayana Murthy, MD',
    duration: '2 Hours Automated Turnaround',
    status: 'published',
    tag: 'Emergency STAT Diagnostics',
    sortOrder: 6,
    coverImage: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1200&q=85',
    summary: 'Round-the-clock automated biochemistry, 5-part hematology cell counter, serum electrolyte panel, and emergency cardiac/metabolic diagnostics with rapid automated turnaround.',
    indications: 'Acute febrile illnesses, metabolic emergencies, diabetic ketoacidosis (DKA), sepsis screening, pre-transfusion complete blood counts, emergency electrolytes, and routine preventive health evaluations.',
    content: `<h2>24/7 Fully Automated Pathology & Metabolic Diagnostics</h2>
<p>Clinical decisions in critical care and acute medicine depend on fast, uncompromised diagnostic accuracy. Operating 24 hours a day, 365 days a year under <strong>Dr. Narayana Murthy, MD</strong>, Rithanya Hospital\'s automated laboratory delivers rapid turnaround STAT testing for Khammam and surrounding districts.</p>
<h3>Emergency & Routine Test Spectrum</h3>
<ul>
  <li><strong>Automated 5-Part Differential Hematology:</strong> Rapid complete blood count (CBC), absolute neutrophil count, and automated ESR for infection and anemia triage.</li>
  <li><strong>Fully Automated Clinical Biochemistry:</strong> High-throughput liver function tests (LFT), renal function tests (RFT / Creatinine / Urea), and lipid panels.</li>
  <li><strong>Electrolytes & Acid-Base Diagnostics:</strong> Rapid ion-selective electrode (ISE) determination of Serum Sodium, Potassium, and Chloride for acute dehydrations and toxicities.</li>
  <li><strong>Emergency Cardiac & Inflammatory Markers:</strong> High-sensitivity Troponin-I, CK-MB, Quantitative C-Reactive Protein (hs-CRP), and Serum Ferritin.</li>
  <li><strong>Quality Control & Barcode Integrity:</strong> Bi-level daily internal quality controls (IQC) with barcoded vacuum tube sample tracking eliminating pre-analytical errors.</li>
</ul>`,
    procedures: [
      'Barcoded vacuum tube specimen accession and positive patient identification',
      '5-part automated differential hematology analysis (CBC, Platelets, Absolute Counts)',
      'Automated clinical chemistry panel (Liver enzymes, Kidney function, Serum Electrolytes)',
      'Point-of-care cardiac biomarker quantification (Troponin-I, CK-MB)',
      'Standardized automated internal quality control (IQC) calibration run',
      'Digital LIS results verification with immediate SMS / online report availability'
    ]
  }
];

/**
 * Official Faculty Doctors
 * Founder: Dr. D. Narayana Murthy (Reg: 81187)
 * Co-Founder: Dr. A. Lakshmi Deepa (Reg: 19422)
 * Consultant: Dr. K. Srinivas Rao
 */
const MASTER_DOCTORS = [
  {
    slug: 'dr-d-narayana-murthy',
    name: 'Dr. D. Narayana Murthy (డా॥ డి. నారాయణమూర్తి)',
    designation: 'Founder, Chief Consultant Physician & Diabetologist',
    department: 'General Medicine & Diabetology',
    qualifications: 'MD (General Physician SVIMS), Ex. Senior Resident (SVIMS), Ex. Resident (JIPMER), Fellowship in Clinical Endocrinology & Diabetes RCP (London), Fellowship in Diabetes and Renal Management RCP (London)',
    registrationNumber: '81187',
    experience: '22+ Years Clinical Excellence',
    opdTimings: 'Mon - Sat: 11:00 AM - 5:00 PM',
    image: '/Dr Narayana Murthy-Rithanya Hospital-Khammam.png',
    bio: 'Dr. D. Narayana Murthy is the Founder and Chief Physician & Diabetologist at Rithanya Hospital, Khammam. With prestigious clinical qualifications from SVIMS (MD & Ex. Senior Resident), JIPMER, and the Royal College of Physicians (London), he has spearheaded advanced evidence-based diabetology, chronic disease management, and Khammam\'s premier 24/7 Daycare Transfusion Centre for Thalassemia and Sickle Cell Anemia.',
    content: `<h2>Founder & Chief Physician Profile</h2>
<p><strong>Dr. D. Narayana Murthy, M.D. (Registration No. 81187)</strong> brings over 22 years of elite clinical expertise to Khammam and neighboring districts. His academic and clinical foundation stems from premier national and international centers of excellence:</p>
<ul>
  <li><strong>MD (General Physician)</strong> – Sri Venkateswara Institute of Medical Sciences (SVIMS, Tirupati)</li>
  <li><strong>Ex. Senior Resident</strong> – SVIMS (Tirupati)</li>
  <li><strong>Ex. Resident</strong> – Jawaharlal Institute of Postgraduate Medical Education & Research (JIPMER, Puducherry)</li>
  <li><strong>Fellowship in Clinical Endocrinology & Diabetes</strong> – Royal College of Physicians (RCP, London)</li>
  <li><strong>Fellowship in Diabetes and Renal Management</strong> – Royal College of Physicians (RCP, London)</li>
</ul>
<h3>Institutional Mission & Practice Philosophy</h3>
<p>At Rithanya Hospital, Dr. Narayana Murthy emphasizes holistic, guideline-directed medical therapy. His practice focuses on early organ protection in patients with diabetes, hypertension, and metabolic syndrome. Recognizing the immense challenges faced by families of children with Thalassemia and Sickle Cell Anemia, he established Rithanya Hospital\'s dedicated Daycare Transfusion Centre and 24/7 Blood Bank with full Aarogyasri cashless coverage.</p>
<h3>Areas of Clinical Focus</h3>
<ul>
  <li>Complex Diabetes Management & Continuous Glucose Monitoring (CGM)</li>
  <li>Diabetic Nephropathy, Retinopathy, and Diabetic Foot Neuropathy Salvage</li>
  <li>Daycare Blood Transfusion Protocols for Thalassemia Major</li>
  <li>Cardio-Renal Risk Profiling and Refractory Hypertension Care</li>
  <li>24/7 Acute Medical Emergencies & Triage</li>
</ul>`,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    status: 'active',
    sortOrder: 1
  },
  {
    slug: 'dr-a-lakshmi-deepa',
    name: 'Dr. A. Lakshmi Deepa (డా॥ ఎ. లక్ష్మీదీప)',
    designation: 'Co-Founder & Consultant Gynecologist / Women\'s Health Specialist (స్త్రీల వైద్య నిపుణులు)',
    department: 'Gynecology & Women\'s Health',
    qualifications: 'M.B.B.S.',
    registrationNumber: '19422',
    experience: '16+ Years Clinical Excellence',
    opdTimings: 'Mon - Sat: 10:00 AM - 2:00 PM & 6:00 PM - 8:30 PM',
    image: '/Dr A Laxmi Dipa-Rithanya Hospital-Khammam.png',
    bio: 'Dr. A. Lakshmi Deepa is the Co-Founder and Senior Consultant Gynecologist & Women\'s Health Specialist at Rithanya Hospital. Dedicated to compassionate, confidential, and comprehensive healthcare for women at every stage of life, from adolescent health and PCOS management to antenatal care and perimenopausal support.',
    content: `<h2>Co-Founder & Women's Health Specialist Profile</h2>
<p><strong>Dr. A. Lakshmi Deepa, M.B.B.S. (Registration No. 19422)</strong> serves as Co-Founder and Lead Consultant for Women\'s Health at Rithanya Hospital, Khammam. With over 16 years of devoted clinical service, her practice is centered on empathetic, ethical, and evidence-guided care tailored to women\'s unique physiological needs.</p>
<h3>Core Clinical Specialties</h3>
<ul>
  <li><strong>Antenatal & Maternal Health:</strong> Comprehensive prenatal screenings, gestational diabetes surveillance in coordination with diabetology, and maternal nutritional optimization.</li>
  <li><strong>Menstrual & Endocrine Disorders:</strong> Holistic management of Polycystic Ovarian Syndrome (PCOS/PCOD), irregular cycles, dysmenorrhea, and hormonal imbalances.</li>
  <li><strong>Adolescent Reproductive Guidance:</strong> Nutritional anemia prevention, pubertal transitions, and health literacy counseling for adolescent girls.</li>
  <li><strong>Perimenopausal & Menopausal Health:</strong> Bone density preservation, hormonal transition support, and holistic wellness for mature women.</li>
  <li><strong>Preventive Cervical & Breast Screenings:</strong> Early detection protocols, Pap smears, and routine preventive wellness checkups.</li>
</ul>`,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    status: 'active',
    sortOrder: 2
  },
  {
    slug: 'dr-k-srinivas-rao',
    name: 'Dr. K. Srinivas Rao, MD',
    designation: 'Consultant Clinical Pathologist & Laboratory Director',
    department: 'Clinical Pathology & Diagnostics',
    qualifications: 'MD (Pathology), DCP',
    registrationNumber: '47219',
    experience: '18+ Years Diagnostic Excellence',
    opdTimings: 'Mon - Sat: 08:00 AM - 04:00 PM',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    bio: 'Dr. K. Srinivas Rao oversees Rithanya Hospital\'s 24/7 automated clinical pathology laboratory, HPLC hemoglobin electrophoresis analytics, and critical diagnostic crossmatching protocols.',
    content: `<h2>Consultant Clinical Pathologist Profile</h2>
<p><strong>Dr. K. Srinivas Rao, MD (Pathology)</strong> directs the diagnostic pathology division at Rithanya Hospital. His expertise includes automated high-performance liquid chromatography (HPLC) for hemoglobinopathies, 5-part hematology counters, and stringent internal quality control assurance.</p>`,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    status: 'active',
    sortOrder: 3
  }
];

/**
 * Synchronizes production database with exact master catalog records:
 * - Upserts exact 6 treatments and prunes all legacy treatments.
 * - Upserts official faculty doctors and ensures working detail pages.
 * - Flushes public in-memory cache.
 */
async function syncProductionMasterData(prisma) {
  console.log('[MasterCatalogSeeder] Starting production master catalog synchronization...');

  try {
    // 1. Synchronize Treatments: Upsert the exact 6 items
    for (const item of EXACT_6_TREATMENTS) {
      const existing = await prisma.treatment.findFirst({
        where: {
          OR: [
            { slug: item.slug },
            { title: item.title }
          ]
        }
      });

      if (existing) {
        await prisma.treatment.update({
          where: { id: existing.id },
          data: item
        });
      } else {
        await prisma.treatment.create({
          data: item
        });
      }
    }
    console.log(`[MasterCatalogSeeder] ✓ Upserted ${EXACT_6_TREATMENTS.length} master clinical treatments.`);

    // 2. Prune any other legacy treatments so ONLY these 6 exist in the treatments page!
    const allowedSlugs = EXACT_6_TREATMENTS.map((t) => t.slug);
    const deleteResult = await prisma.treatment.deleteMany({
      where: {
        slug: { notIn: allowedSlugs }
      }
    });
    if (deleteResult.count > 0) {
      console.log(`[MasterCatalogSeeder] ✓ Pruned ${deleteResult.count} legacy treatment items.`);
    }

    // 3. Synchronize Doctors / Specialists
    for (const doc of MASTER_DOCTORS) {
      const existing = await prisma.specialist.findFirst({
        where: {
          OR: [
            { slug: doc.slug },
            { name: { contains: doc.slug === 'dr-d-narayana-murthy' ? 'Narayana Murthy' : doc.slug === 'dr-a-lakshmi-deepa' ? 'Lakshmi' : 'Srinivas' } }
          ]
        }
      });

      if (existing) {
        await prisma.specialist.update({
          where: { id: existing.id },
          data: doc
        });
      } else {
        await prisma.specialist.create({
          data: doc
        });
      }
    }

    // Deactivate demo doctors so only verified faculty doctors are active
    const allowedDoctorSlugs = MASTER_DOCTORS.map((d) => d.slug);
    await prisma.specialist.updateMany({
      where: {
        slug: { notIn: allowedDoctorSlugs }
      },
      data: { status: 'inactive' }
    });
    console.log(`[MasterCatalogSeeder] ✓ Synchronized faculty doctors (Dr. D. Narayana Murthy, Dr. A. Lakshmi Deepa, Dr. K. Srinivas Rao).`);

    // 4. Invalidate public in-memory cache so fresh data takes effect immediately
    invalidatePublicCache('treatments');
    invalidatePublicCache('specialists');
    invalidatePublicCache('services');
    console.log('[MasterCatalogSeeder] ✓ Public data cache flushed.');

  } catch (err) {
    console.error('[MasterCatalogSeeder] Notice during synchronization:', err.message);
  }
}

module.exports = {
  EXACT_6_TREATMENTS,
  MASTER_DOCTORS,
  syncProductionMasterData
};
