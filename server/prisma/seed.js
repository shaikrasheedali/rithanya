const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../utils/argonHelper');
const { encrypt } = require('../utils/encryption');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Rithanya Hospital Database Seed ---');

  // 1. Superadmin User ("Hameed")
  const superadminPlain = 'Hameed@2026';
  const superadminHash = await hashPassword(superadminPlain);
  const superadminEnc = encrypt(superadminPlain);

  const superadmin = await prisma.user.upsert({
    where: { email: 'mgrhameed@gmail.com' },
    update: {
      passwordHash: superadminHash,
      plainPasswordEnc: superadminEnc,
      role: 'SUPERADMIN',
      name: 'Hameed (Superadmin)',
      enabled: true,
      allowedModules: [
        'dashboard', 'patients', 'clinical', 'admissions', 'inventory',
        'appointments', 'treatments', 'services', 'blogs', 'specialists',
        'products', 'orders', 'gallery', 'media', 'credentials', 'staff',
        'finance', 'erasure', 'settings'
      ]
    },
    create: {
      email: 'mgrhameed@gmail.com',
      name: 'Hameed (Superadmin)',
      role: 'SUPERADMIN',
      passwordHash: superadminHash,
      plainPasswordEnc: superadminEnc,
      salt: 'rh_superadmin_1',
      enabled: true,
      permissions: { all: true },
      allowedModules: [
        'dashboard', 'patients', 'clinical', 'admissions', 'inventory',
        'appointments', 'treatments', 'services', 'blogs', 'specialists',
        'products', 'orders', 'gallery', 'media', 'credentials', 'staff',
        'finance', 'erasure', 'settings'
      ]
    }
  });
  console.log('✓ Superadmin initialized: Hameed (mgrhameed@gmail.com)');

  // Migrate legacy user emails to rithanyahospital.com if present
  try {
    await prisma.user.updateMany({
      where: { email: 'admin@rithanya.in' },
      data: { email: 'admin@rithanyahospital.com' }
    });
    await prisma.user.updateMany({
      where: { email: 'staff@rithanya.in' },
      data: { email: 'staff@rithanyahospital.com' }
    });
  } catch (e) {
    // ignore
  }

  // 2. Admin User ("Dr. Narayana Murthy")
  const adminPlain = 'Admin@2026';
  const adminHash = await hashPassword(adminPlain);
  const adminEnc = encrypt(adminPlain);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@rithanyahospital.com' },
    update: {
      passwordHash: adminHash,
      plainPasswordEnc: adminEnc,
      role: 'ADMIN',
      name: 'Dr. Narayana Murthy (Admin)',
      enabled: true,
      allowedModules: [
        'dashboard', 'patients', 'clinical', 'admissions', 'inventory',
        'appointments', 'treatments', 'services', 'blogs', 'specialists',
        'products', 'orders', 'gallery', 'media', 'credentials', 'staff',
        'finance', 'erasure', 'settings'
      ]
    },
    create: {
      email: 'admin@rithanyahospital.com',
      name: 'Dr. Narayana Murthy (Admin)',
      role: 'ADMIN',
      passwordHash: adminHash,
      plainPasswordEnc: adminEnc,
      salt: 'rh_admin_1',
      enabled: true,
      permissions: { all: true },
      allowedModules: [
        'dashboard', 'patients', 'clinical', 'admissions', 'inventory',
        'appointments', 'treatments', 'services', 'blogs', 'specialists',
        'products', 'orders', 'gallery', 'media', 'credentials', 'staff',
        'finance', 'erasure', 'settings'
      ]
    }
  });
  console.log('✓ Admin user initialized: Dr. Narayana Murthy (admin@rithanyahospital.com)');

  // 3. Clinical Staff User
  const staffPlain = 'StaffNurse@2026';
  const staffHash = await hashPassword(staffPlain);
  const staffEnc = encrypt(staffPlain);

  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@rithanyahospital.com' },
    update: {
      passwordHash: staffHash,
      plainPasswordEnc: staffEnc,
      role: 'STAFF',
      name: 'Clinical Staff Nurse',
      enabled: true,
      allowedModules: ['dashboard', 'patients', 'clinical', 'admissions', 'inventory', 'appointments']
    },
    create: {
      email: 'staff@rithanyahospital.com',
      name: 'Clinical Staff Nurse',
      role: 'STAFF',
      passwordHash: staffHash,
      plainPasswordEnc: staffEnc,
      salt: 'rh_staff_1',
      enabled: true,
      allowedModules: ['dashboard', 'patients', 'clinical', 'admissions', 'inventory', 'appointments'],
      permissions: {
        dashboard: true,
        patients: true,
        clinical: true,
        admissions: true,
        inventory: true,
        appointments: true
      }
    }
  });
  console.log('✓ Staff user initialized: Clinical Staff (staff@rithanyahospital.com)');

  // 3. Staff Profiles
  const staffMembers = [
    {
      staffCode: 'RH-101',
      name: 'Dr. Narayana Murthy',
      designation: 'Chief Physician & Diabetologist',
      department: 'General Medicine',
      salary: 145000,
      shift: 'Day',
      phone: '+91 83285 81019',
      email: 'dr.narayana5@gmail.com',
      status: 'active',
      userId: staffUser.id
    },
    {
      staffCode: 'RH-103',
      name: 'Sujatha Reddy',
      designation: 'Senior Transfusion Nurse',
      department: 'Day-care',
      salary: 38000,
      shift: 'Day',
      phone: '+91 98480 11223',
      email: 'sujatha.reddy@rithanyahospital.com',
      status: 'active'
    },
    {
      staffCode: 'RH-104',
      name: 'Venkatesh Babu',
      designation: 'Clinical Lab Technician',
      department: 'Diagnostics',
      salary: 32000,
      shift: 'Rotational',
      phone: '+91 99890 33445',
      email: 'venkatesh.b@rithanyahospital.com',
      status: 'active'
    },
    {
      staffCode: 'RH-105',
      name: 'Lakshmi Priya',
      designation: 'Patient Care Coordinator',
      department: 'Reception',
      salary: 26000,
      shift: 'Morning',
      phone: '+91 91210 55667',
      email: 'lakshmi.p@rithanyahospital.com',
      status: 'active'
    }
  ];

  for (const s of staffMembers) {
    const existing = await prisma.staff.findFirst({
      where: {
        OR: [
          { staffCode: s.staffCode },
          { email: s.email },
          { email: s.email.replace('@rithanyahospital.com', '@rithanya.in') }
        ]
      }
    });
    if (existing) {
      await prisma.staff.update({
        where: { id: existing.id },
        data: s
      });
    } else {
      await prisma.staff.create({ data: s });
    }
  }
  console.log('✓ Staff profiles seeded');

  // 4. Hospital Settings
  const settingsData = [
    {
      key: 'hospital_profile',
      description: 'Main hospital general info and contact details',
      value: {
        name: 'Rithanya Hospital & Diagnostics',
        tagline: 'Care with precision — Diabetology & Thalassemia Daycare Centre',
        phone: '+91 83285 81019',
        emergencyPhone: '+91 83285 81019',
        email: 'info@rithanyahospital.com',
        address: 'Wyra Road, opposite Old LIC Office, Nehru Nagar, Khammam, Telangana - 507001',
        timings: 'OPD: Mon-Sat 11:00 AM - 5:00 PM | Daycare: 24/7 Support',
        currency: 'INR',
        bloodThreshold: 10
      }
    },
    {
      key: 'dpdp_policy',
      description: 'DPDP Act Compliance & Data Retention Policies',
      value: {
        consentRequired: true,
        cameraConsentEnabled: true,
        dataRetentionYears: 10,
        dpoContact: 'dpo@rithanyahospital.com',
        erasureProcessingDays: 3
      }
    }
  ];

  for (const set of settingsData) {
    await prisma.hospitalSetting.upsert({
      where: { key: set.key },
      update: { value: set.value, description: set.description },
      create: set
    });
  }
  console.log('✓ Hospital settings seeded');

  // 5. Blood Bank Inventory
  const bloodGroups = [
    { group: 'A+', units: 14, reservedUnits: 2, threshold: 10, capacity: 30, daysValid: 28 },
    { group: 'A-', units: 6, reservedUnits: 1, threshold: 8, capacity: 20, daysValid: 19 },
    { group: 'B+', units: 18, reservedUnits: 3, threshold: 10, capacity: 35, daysValid: 32 },
    { group: 'B-', units: 5, reservedUnits: 1, threshold: 8, capacity: 20, daysValid: 15 },
    { group: 'O+', units: 22, reservedUnits: 4, threshold: 12, capacity: 40, daysValid: 34 },
    { group: 'O-', units: 4, reservedUnits: 2, threshold: 8, capacity: 20, daysValid: 12 },
    { group: 'AB+', units: 9, reservedUnits: 1, threshold: 8, capacity: 25, daysValid: 24 },
    { group: 'AB-', units: 3, reservedUnits: 0, threshold: 6, capacity: 15, daysValid: 11 }
  ];

  for (const b of bloodGroups) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + b.daysValid);
    await prisma.bloodInventory.upsert({
      where: { group: b.group },
      update: {
        units: b.units,
        reservedUnits: b.reservedUnits,
        threshold: b.threshold,
        capacity: b.capacity,
        expiryDate: expiry
      },
      create: {
        group: b.group,
        units: b.units,
        reservedUnits: b.reservedUnits,
        threshold: b.threshold,
        capacity: b.capacity,
        expiryDate: expiry
      }
    });
  }
  console.log('✓ Blood inventory seeded');

  // 6. Services
  const services = [
    {
      slug: 'general-medicine',
      category: 'Clinical Specialty',
      title: 'General Medicine & Physician Consultation',
      author: 'Dr. Narayana Murthy, MD',
      date: 'Updated Weekly',
      readTime: '5 min overview',
      status: 'published',
      summary: 'Evidence-based diagnosis and ongoing physician care for fevers, infections, metabolic disorders, and chronic conditions.',
      coverImage: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85'
      ],
      content: `<h2>Overview of Physician Care</h2><p>At Rithanya Hospital, General Medicine forms the foundational bedrock of all outpatient and inpatient care. Under the clinical leadership of <strong>Dr. Narayana Murthy (MBBS, MD)</strong>, patients receive attentive, unrushed evaluations where every symptom is contextualized within their long-term health history.</p><div class="article-highlight-box"><strong>Our Core Clinical Approach:</strong> We avoid unnecessary polypharmacy and fragmented testing. We prioritize accurate clinical examination, baseline blood profiling, and structured follow-up so treatment plans adapt to patient progress.</div><h2>Conditions Treated</h2><ul><li><strong>Acute Febrile Illnesses:</strong> Precise differential diagnosis for viral fevers, seasonal typhoid, dengue, and urinary tract infections.</li><li><strong>Cardiovascular & Hypertension Management:</strong> Longitudinal blood pressure tracking, echocardiography referrals, and kidney function monitoring.</li><li><strong>Respiratory Ailments:</strong> Bronchitis, chronic cough, COPD stabilization, and post-viral pulmonary recovery.</li><li><strong>Gastrointestinal & Liver Health:</strong> Peptic disease, acute gastroenteritis, non-alcoholic fatty liver disease (NAFLD), and metabolic liver screening.</li></ul><h2>Consultation Timings & OPD Details</h2><p>Outpatient consultations are available <strong>Monday through Saturday from 11:00 AM to 5:00 PM</strong>. Walk-ins are accommodated promptly, and priority queues are maintained for elderly patients and emergency assessments.</p>`,
      sortOrder: 1
    },
    {
      slug: 'diabetes-care',
      category: 'Endocrinology & Diabetology',
      title: 'Comprehensive Diabetes & Metabolic Care',
      author: 'Dr. Narayana Murthy, MD (Diabetologist)',
      date: 'Updated Weekly',
      readTime: '6 min overview',
      status: 'published',
      summary: 'Comprehensive blood glucose monitoring, HbA1c reviews, diabetic foot care, and customized lifestyle and medication management.',
      coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=85'
      ],
      content: `<h2>Modern Diabetes Management in Khammam</h2><p>Diabetes is not merely an elevated blood sugar number; it is a vascular condition that requires holistic protection of the heart, kidneys, retinas, and peripheral nerves. Dr. Narayana Murthy brings specialized diabetology focus to ensure patients manage life with vitality and confidence.</p><h2>Structured Care Protocols</h2><ul><li><strong>Quarterly HbA1c Monitoring:</strong> Laboratory assessment coupled with home blood glucose meter reconciliation.</li><li><strong>Diabetic Neuropathy & Foot Screen:</strong> Monofilament sensation testing, peripheral pulse examination, and footwear education to avert diabetic foot complications.</li><li><strong>Cardio-Renal Risk Profiling:</strong> Urine microalbumin-to-creatinine ratio (ACR) and lipid panel testing to protect kidney filtration.</li><li><strong>Diet & Nutrition Counseling:</strong> Practical regional dietary guidelines adapted to South Indian culinary preferences.</li></ul><div class="article-highlight-box"><strong>Patient First Philosophy:</strong> We empower patients with direct knowledge of hypoglycemia warning signs, safe carbohydrate distribution, and insulin injection techniques.</div>`,
      sortOrder: 2
    },
    {
      slug: 'transfusion-daycare',
      category: 'Hematology & Day-Care',
      title: 'Thalassemia & Sickle-Cell Transfusion Day-care',
      author: 'Clinical Day-Care Team',
      date: 'Continuous Program',
      readTime: '7 min overview',
      status: 'published',
      summary: 'Specialized day-care transfusion beds with certified blood filtration, pre-transfusion cross-matching, and routine iron chelation follow-up.',
      coverImage: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=85'
      ],
      content: `<h2>Dedicated Day-Care Transfusion Support</h2><p>Rithanya Hospital is widely recognized across Khammam for its dedicated day-care support for young individuals and adults living with <strong>Beta Thalassemia Major</strong> and <strong>Sickle-Cell Disease</strong>. Transfusions should never feel like an intimidating hospital admission—they are conducted in a peaceful, supportive day-care setting.</p><h2>Safety & Protocol Checklist</h2><ul><li><strong>Pre-Transfusion Blood Cross-Matching:</strong> Rigorous ABO and Rh(D) verification, saline cross-matching, and complete blood count (CBC) prior to every unit.</li><li><strong>Leukodepletion Micro-filtration:</strong> Transfusions utilize modern micro-aggregate blood filters to prevent febrile non-hemolytic transfusion reactions (FNHTR).</li><li><strong>Regular Iron Chelation Auditing:</strong> Monitoring of serum ferritin levels and coordinating oral chelation dosages to protect cardiac and hepatic tissues.</li><li><strong>Compassionate Pediatric Support:</strong> Dedicated nursing team trained in sensitive venous access for young warriors.</li></ul><div class="article-highlight-box"><strong>Emergency Blood Bank Coordination:</strong> Our in-house refrigerated blood reserve collaborates closely with the Khammam Red Cross and District Blood Center for timely blood availability.</div>`,
      sortOrder: 3
    },
    {
      slug: 'diagnostics',
      category: 'Laboratory Services',
      title: 'Diagnostics & Laboratory Services',
      author: 'Diagnostic Laboratory Team',
      date: 'Open 24/7',
      readTime: '4 min overview',
      status: 'published',
      summary: 'Automated haematology, complete lipid panels, liver & renal profiles, glucose monitoring, and rapid febrile antigen screening.',
      coverImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=85'
      ],
      content: `<h2>Diagnostic Precision at Rithanya</h2><p>Accurate clinical treatment depends on dependable laboratory diagnostics. Our facility features calibrated analyzers operating with strict internal controls to deliver timely reports for outpatients, emergency walk-ins, and day-care visitors.</p><h2>Key Diagnostic Panels Available</h2><ul><li><strong>Complete Blood Count (CBC) & ESR:</strong> 3-part automated differential profiling of haemoglobin, haematocrit, platelets, and white blood cells.</li><li><strong>Metabolic & Organ Panels:</strong> Fasting & postprandial glucose, Serum Creatinine, Blood Urea Nitrogen (BUN), and Liver Function Tests (LFT).</li><li><strong>Lipid & Cardiovascular Markers:</strong> Total Cholesterol, Triglycerides, HDL, LDL, and VLDL ratios.</li><li><strong>Infectious Serology:</strong> Rapid Dengue NS1 & IgM/IgG, Malarial Antigen (Pv/Pf), Typhoid Widal/TyphiDot, and viral hepatitis screens.</li></ul>`,
      sortOrder: 4
    },
    {
      slug: 'pediatric-care',
      category: 'Child Health',
      title: 'Pediatric Consultation & Child Health',
      author: 'Visiting Pediatric Specialists',
      date: 'Mon–Sat OPD',
      readTime: '5 min overview',
      status: 'published',
      summary: 'Dedicated physician reviews for childhood infections, seasonal fevers, nutritional guidance, and preventive pediatric health checks.',
      coverImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=85'
      ],
      content: `<h2>Attentive Pediatric Care</h2><p>Children require specialized physiological attention, weight-tailored medication dosing, and a gentle clinic atmosphere that eases medical anxiety.</p>`,
      sortOrder: 5
    },
    {
      slug: 'health-checks',
      category: 'Preventive Medicine',
      title: 'Senior Citizen & Preventive Health Checks',
      author: 'Preventive Care Team',
      date: 'Daily Booking',
      readTime: '5 min overview',
      status: 'published',
      summary: 'Structured annual and bi-annual wellness evaluations targeting cardiovascular health, diabetes screening, and geriatric mobility.',
      coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=85'
      ],
      content: `<h2>Proactive Wellness vs. Reactive Treatment</h2><p>Preventive health checks detect metabolic risk factors—such as border-line hypertension, silent dyslipidemia, and pre-diabetes—years before clinical symptoms manifest.</p>`,
      sortOrder: 6
    }
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s
    });
  }
  console.log('✓ Services seeded');

  // 7. Specialists
  const specialists = [
    {
      name: 'Dr. Narayana Murthy',
      designation: 'Chief Consultant Physician & Diabetologist',
      department: 'General Medicine & Diabetology',
      qualifications: 'MBBS, MD (General Medicine), Fellow in Diabetology',
      experience: '22+ Years Clinical Excellence',
      opdTimings: 'Mon - Sat: 11:00 AM - 5:00 PM',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=85',
      bio: 'Renowned senior physician in Khammam known for compassionate patient care, accurate differential diagnosis, and evidence-backed diabetes management programs.',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      status: 'active',
      sortOrder: 1
    },
    {
      name: 'Dr. K. Srinivas Rao',
      designation: 'Consultant Hematologist & Pediatric Specialist',
      department: 'Hematology & Daycare',
      qualifications: 'MBBS, MD (Pediatrics), Clinical Fellow Hematology',
      experience: '14+ Years Experience',
      opdTimings: 'Tue, Thu, Sat: 2:00 PM - 6:00 PM',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=1200&q=85',
      bio: 'Expert in pediatric transfusion protocols, thalassemia chelation regimens, and childhood hematological assessments.',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      status: 'active',
      sortOrder: 2
    }
  ];

  for (const doc of specialists) {
    const existing = await prisma.specialist.findFirst({ where: { name: doc.name } });
    if (existing) {
      await prisma.specialist.update({ where: { id: existing.id }, data: doc });
    } else {
      await prisma.specialist.create({ data: doc });
    }
  }
  console.log('✓ Specialists seeded');

  // 8. Clinical Treatments (Individual Detailed Pages)
  const treatments = [
    {
      slug: 'thalassemia-daycare-transfusion',
      title: 'Thalassemia Daycare Transfusion & Leukodepletion',
      category: 'Daycare Hematology',
      department: 'Hematology & Transfusion Centre',
      doctorName: 'Dr. Narayana Murthy, MD',
      duration: '3 - 4 Hours',
      indications: 'Severe chronic hemolytic anemia, Hb < 9.0 g/dL, Beta-Thalassemia Major, Sickle-Cell Disease crises.',
      summary: "Khammam's dedicated day-care transfusion unit delivering triple-crossmatched, micro-aggregate leukodepleted packed red cells under continuous hemodynamic monitoring.",
      content: `<h2>Daycare Transfusion Excellence Without Hospital Fatigue</h2>
<p>At Rithanya Hospital's dedicated Daycare Transfusion Centre, pediatric and adult thalassemia warriors receive routine life-sustaining packed red blood cell (PRBC) transfusions in an infection-controlled, comforting daycare environment. Under the clinical oversight of <strong>Dr. Narayana Murthy M.D.</strong>, every unit undergoes triple cross-matching and is transfused using certified leukodepletion micro-filters to prevent febrile non-hemolytic transfusion reactions (FNHTR) and HLA alloimmunization.</p>
<h3>Key Clinical Protocols</h3>
<ul>
<li><strong>Triple Compatibility Testing:</strong> Saline, albumin, and indirect antiglobulin test (IAT) screening on fresh pre-transfusion samples.</li>
<li><strong>Leukodepleted Filtration:</strong> 3rd-generation bedside micro-aggregate filters removing >99.9% of donor white cells.</li>
<li><strong>Hemodynamic Profiling:</strong> Automated continuous SpO2, blood pressure, temperature, and pulse rate logging.</li>
<li><strong>Volume Titration:</strong> Strict weight-adjusted pediatric volume calculations (10-15 mL/kg) delivered via precision infusion pumps.</li>
</ul>
<h3>Post-Transfusion Care & Iron Management</h3>
<p>Each session concludes with saline line clearing, post-transfusion vitals verification, and an updated hemoglobin and ferritin tracking chart to adjust oral chelation dosages seamlessly.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85',
      videoUrl: '/assets/1.mp4',
      procedures: [
        'Pre-transfusion saline & IAT compatibility crossmatching',
        'Leukodepletion micro-aggregate filtration',
        'Weight-adjusted infusion pump titration (10-15 mL/kg)',
        'Continuous multiparameter bedside vitals monitoring',
        'Longitudinal pre/post Hb and serum ferritin charting'
      ],
      tag: 'Daycare Special',
      sortOrder: 1
    },
    {
      slug: 'iron-chelation-therapy',
      title: 'Oral & Infusion Iron Chelation Therapy',
      category: 'Hematology & Chelation',
      department: 'Hematology & Endocrinology',
      doctorName: 'Dr. Narayana Murthy, MD',
      duration: '60 mins Clinical Audit',
      indications: 'Serum Ferritin > 1000 mcg/L, cumulative transfusion units > 15-20, myocardial or hepatic iron overload risk.',
      summary: 'Systematic organ-protective iron chelation regimens utilizing Deferasirox, Deferiprone, and Desferrioxamine to protect myocardial, hepatic, and pancreatic tissue.',
      content: `<h2>Preventing Hemosiderosis and End-Organ Damage</h2>
<p>Because the human body lacks an active physiological mechanism to excrete excess iron derived from repeated blood transfusions, each unit adds approximately 200-250 mg of elemental iron. Without effective chelation, iron progressively deposits in the myocardium, liver parenchyma, and endocrine glands, leading to cardiac arrhythmias, cirrhosis, and diabetes.</p>
<h3>Structured Chelation Program</h3>
<ul>
<li><strong>Biochemical Monitoring:</strong> Serial serum ferritin assays, liver function tests, and renal function profiling every 4 to 8 weeks.</li>
<li><strong>Advanced Chelation Agents:</strong> Tailored once-daily oral Deferasirox (dispersible/film-coated) or Deferiprone with Desferrioxamine combination therapy.</li>
<li><strong>Endocrine Assessment:</strong> Annual screening for growth deceleration, hypogonadism, hypoparathyroidism, and secondary hemochromatosis.</li>
<li><strong>Safety Monitoring:</strong> Routine audiometric and ophthalmic evaluations to ensure therapeutic index safety.</li>
</ul>`,
      coverImage: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=85',
      videoUrl: null,
      procedures: [
        'Chemiluminescent serum ferritin quantitation',
        'Hepatic and renal safety biochemical markers',
        'Customized oral chelation titration (Deferasirox / Deferiprone)',
        'Audiometry and slit-lamp ophthalmic safety audits',
        'Iron dietary restriction counseling'
      ],
      tag: 'Organ Protection',
      sortOrder: 2
    },
    {
      slug: 'longitudinal-diabetology',
      title: 'Clinical Diabetology & Glycemic Regulation',
      category: 'Endocrinology',
      department: 'General Medicine & Diabetology',
      doctorName: 'Dr. Narayana Murthy, MD',
      duration: '45 mins Consultation',
      indications: 'Type 1 Diabetes, Type 2 Diabetes Mellitus, Gestational Diabetes, Brittle Diabetes, Metabolic Syndrome.',
      summary: 'Evidence-based longitudinal diabetes treatment focusing on glycemic variability stabilization, early nephropathy detection, and patient empowerment.',
      content: `<h2>Personalized Metabolic Care by Dr. Narayana Murthy</h2>
<p>With over 22 years of clinical excellence in diabetology, <strong>Dr. Narayana Murthy M.D.</strong> leads a patient-centric, longitudinal treatment protocol for diabetic individuals. Rather than relying on sporadic fasting glucose checks, our center focuses on long-term time-in-range (TIR) metrics, cardiovascular risk mitigation, and early microvascular protection.</p>
<h3>Comprehensive Care Spectrum</h3>
<ul>
<li><strong>Targeted Glycemic Control:</strong> HbA1c optimization tailored to patient age, comorbidities, and hypoglycemia risk.</li>
<li><strong>Continuous Glucose Monitoring (CGM):</strong> Sensor placement and ambulatory glucose profile (AGP) pattern analysis.</li>
<li><strong>Cardio-Renal Protection:</strong> SGLT2 inhibitor and GLP-1 receptor agonist integration to protect renal glomeruli and cardiac ejection fraction.</li>
<li><strong>Nutritional Coaching:</strong> Tailored Indian carbohydrate-exchange diets and lifestyle counseling.</li>
</ul>`,
      coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=85',
      videoUrl: '/assets/2.mp4',
      procedures: [
        'Automated HPLC HbA1c glycated hemoglobin assessment',
        'Fasting & 2-hour postprandial glucose tracking',
        'Microalbuminuria urine creatinine ratio (ACR)',
        'Individualized basal-bolus insulin titration',
        'Dietary carbohydrate-exchange planning'
      ],
      tag: 'Most Requested',
      sortOrder: 3
    },
    {
      slug: 'diabetic-neuropathy-foot-care',
      title: 'Diabetic Neuropathy Diagnostics & Podiatry',
      category: 'Neuropathy & Podiatry',
      department: 'Diabetic Foot & Vascular Care',
      doctorName: 'Dr. Narayana Murthy, MD',
      duration: '45 mins Evaluation',
      indications: 'Peripheral numbness, tingling, burning feet sensation, loss of protective sensation, diabetic foot ulcer risk.',
      summary: 'Advanced biothesiometry, monofilament tactile sensitivity, and Doppler vascular mapping preventing lower limb complications.',
      content: `<h2>Preventing Diabetic Foot Complications and Amputations</h2>
<p>Diabetic peripheral neuropathy is often silent until sensory loss leads to unnoticed trauma, non-healing neuropathic ulcers, and osteomyelitis. Our specialized diabetic podiatry clinic conducts quantitative electrodiagnostic evaluations to detect small and large fiber nerve injury at the earliest reversible stages.</p>
<h3>Diagnostic & Therapeutic Modalities</h3>
<ul>
<li><strong>Vibration Perception Threshold (VPT):</strong> Quantitative biothesiometry measuring tactile nerve conduction loss.</li>
<li><strong>10g Semmes-Weinstein Monofilament:</strong> Objective assessment of loss of protective sensation (LOPS).</li>
<li><strong>Peripheral Arterial Doppler:</strong> Ankle-Brachial Index (ABI) to differentiate neuropathic vs ischemic foot disease.</li>
<li><strong>Therapeutic Orthotics:</strong> Prescription of custom-molded, dual-density diabetic footwear to redistribute plantar pressure.</li>
</ul>`,
      coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=85',
      videoUrl: null,
      procedures: [
        'Quantitative biothesiometry vibration perception threshold (VPT)',
        '10-point monofilament tactile mapping',
        'Handheld acoustic vascular Doppler Ankle-Brachial Index (ABI)',
        'Plantar high-pressure ulcer point inspection',
        'Therapeutic soft-sole footwear prescription'
      ],
      tag: 'Specialized',
      sortOrder: 4
    },
    {
      slug: 'hplc-hemoglobin-electrophoresis',
      title: 'Automated HPLC Hemoglobin Electrophoresis',
      category: 'Laboratory Diagnostics',
      department: 'Clinical Pathology',
      doctorName: 'Dr. K. Srinivas Rao',
      duration: 'Same-Day Automated Report',
      indications: 'Differential diagnosis of microcytic anemia, pre-marital screening, carrier detection of Thalassemia trait, HbS verification.',
      summary: 'Gold-standard high-performance liquid chromatography providing definitive automated quantification of HbA2, HbF, HbS, and variant hemoglobin peaks.',
      content: `<h2>Gold-Standard Hemoglobinopathy Screening</h2>
<p>Accurate identification of hemoglobin variants is essential for differentiating iron deficiency anemia from Beta-Thalassemia trait and diagnosing complex hemoglobinopathies like HbE, HbD-Punjab, and Sickle-Cell trait. Rithanya Hospital operates gold-standard automated HPLC chromatography.</p>
<h3>Why Automated HPLC?</h3>
<ul>
<li><strong>High Resolution:</strong> Crisp chromatographic separation of HbA, HbA2, and HbF with exact retention windows.</li>
<li><strong>Exact Quantification:</strong> Precise determination of HbA2 values (>3.5% indicative of beta-thalassemia carrier status).</li>
<li><strong>Differential Specificity:</strong> Eliminates misdiagnosis of thalassemia minor as simple refractory iron deficiency.</li>
<li><strong>Family Counseling:</strong> Comprehensive genetic screening for prospective couples to eradicate homozygous major births.</li>
</ul>`,
      coverImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=85',
      videoUrl: '/assets/3.mp4',
      procedures: [
        'Automated EDTA whole-blood aspiration',
        'Cation-exchange HPLC chromatographic separation',
        'Percentage quantitation of HbA0, HbA2, HbF, and HbS',
        'Chromatographic curve and retention time validation',
        'Genetic counseling and family carrier pedigree chart'
      ],
      tag: 'Gold Standard',
      sortOrder: 5
    },
    {
      slug: 'precision-clinical-pathology',
      title: '24/7 Automated Pathology & Metabolic Diagnostics',
      category: 'Clinical Pathology',
      department: '24/7 Diagnostic Centre',
      doctorName: 'Dr. Narayana Murthy, MD',
      duration: '2 Hours Automated Turnaround',
      indications: 'Routine inpatient vitals, pre-transfusion profiles, emergency electrolyte imbalances, acute infections.',
      summary: 'Fully automated biochemistry, 5-part hematology, and arterial blood gas testing with rapid clinical turnaround and computerized verification.',
      content: `<h2>Clinical Accuracy at Any Hour</h2>
<p>Our in-house 24/7 diagnostic laboratory ensures that critical clinical decisions are backed by rapid, automated laboratory results. With continuous internal quality control and calibrated automated analyzers, test turnaround times are minimized.</p>
<h3>Automated Testing Capabilities</h3>
<ul>
<li><strong>5-Part Differential Hematology:</strong> Complete blood count, platelet parameters, absolute reticulocyte count.</li>
<li><strong>Clinical Biochemistry:</strong> Serum creatinine, urea, bilirubin, SGOT, SGPT, alkaline phosphatase, lipid panels.</li>
<li><strong>Electrolytes & Blood Gases:</strong> Direct ISE measurement of Sodium, Potassium, Chloride, and ionized Calcium.</li>
<li><strong>Emergency Cardiac Markers:</strong> Quantitative high-sensitivity Troponin and CK-MB testing.</li>
</ul>`,
      coverImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=85',
      videoUrl: null,
      procedures: [
        '5-part automated differential hemogram (CBC)',
        'Photometric clinical chemistry automated analyzer',
        'Ion-selective electrode (ISE) electrolytes panel',
        'Pre-transfusion biochemical screening',
        'Computerized automated report validation'
      ],
      tag: '24/7 Available',
      sortOrder: 6
    }
  ];

  for (const t of treatments) {
    await prisma.treatment.upsert({
      where: { slug: t.slug },
      update: t,
      create: t
    });
  }
  console.log('✓ Treatments seeded successfully');

  // 9. E-Commerce Products (Cart & Direct Checkout)
  const products = [
    {
      slug: 'accu-chek-glucometer-kit',
      name: 'Accu-Chek Active Blood Glucose Monitoring Kit',
      category: 'Diabetic Care',
      price: 1250,
      originalPrice: 1850,
      discountText: '32% OFF',
      summary: 'Accurate 5-second blood glucose testing kit with 50 sterile test strips, lancing pen, 10 lancets, and travel case.',
      features: [
        '5-Second Rapid Blood Glucose Results',
        'Includes 50 Sterile Test Strips & 10 Lancets',
        'Pre & Post Meal Marker Reminders',
        'Memory for 500 Test Results with USB Port',
        'Doctor Recommended for Home Monitoring'
      ],
      tag: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=85',
      stock: 85,
      inStock: true,
      sortOrder: 1
    },
    {
      slug: 'thalassemia-chelation-supplement',
      name: 'Calcium & Zinc Organ Support Capsules (Iron-Free)',
      category: 'Hematology Nutrition',
      price: 680,
      originalPrice: 950,
      discountText: '28% OFF',
      summary: 'Specially formulated 100% iron-free calcium, zinc, and vitamin D3 micro-nutritional capsules designed for thalassemia warriors undergoing iron chelation.',
      features: [
        '100% Guaranteed Iron-Free Formulation',
        'Fortified with Bioavailable Calcium Citrate & Zinc',
        'Vitamin D3 for Optimal Bone Density Preservation',
        '60 Vegetarian Capsules (1 Month Supply)',
        'Formulated Specifically for Multi-Transfused Patients'
      ],
      tag: 'Doctor Recommended',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=85',
      stock: 120,
      inStock: true,
      sortOrder: 2
    },
    {
      slug: 'omron-digital-bp-monitor',
      name: 'Omron Automatic Upper Arm Blood Pressure Monitor',
      category: 'Vital Monitors',
      price: 2100,
      originalPrice: 2800,
      discountText: '25% OFF',
      summary: 'Clinically validated automatic upper-arm digital blood pressure monitor with Intellisense technology and irregular heartbeat sensor.',
      features: [
        'Intellisense Automated Inflation Technology',
        'Irregular Heartbeat / Arrhythmia Indicator',
        'Large High-Contrast Digital LCD Display',
        '60-Reading Memory with Date and Time Stamp',
        'Wide Range Comfort Cuff (22-42 cm)'
      ],
      tag: 'Essential Care',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=85',
      stock: 45,
      inStock: true,
      sortOrder: 3
    },
    {
      slug: 'therapeutic-diabetic-footwear',
      name: 'Therapeutic Diabetic Soft-Sole Orthopedic Shoes',
      category: 'Footwear & Orthopedics',
      price: 1450,
      originalPrice: 2200,
      discountText: '34% OFF',
      summary: 'Seamless, extra-depth cushioned footwear designed to eliminate pressure friction points and protect diabetic feet from neuropathic ulcerations.',
      features: [
        'Dual-Density High-Rebound Micro-Cellular Foam Sole',
        'Seamless Interior Lining to Prevent Abrasion',
        'Wide Toe Box to Prevent Digital Compression',
        'Breathable Genuine Medical Grade Mesh Fabric',
        'Prescribed by Dr. Narayana Murthy for Neuropathy'
      ],
      tag: 'High Comfort',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=85',
      stock: 60,
      inStock: true,
      sortOrder: 4
    },
    {
      slug: 'hba1c-lab-sample-collection-kit',
      name: 'HbA1c Lab Sample Collection Test Pack (HPLC)',
      category: 'Diagnostics & Labs',
      price: 499,
      originalPrice: 800,
      discountText: '38% OFF',
      summary: 'Pre-sterilized venous blood collection pack for automated Bio-Rad HPLC glycated hemoglobin assessment with free doorstep Khammam pickup.',
      features: [
        'Automated HPLC Gold-Standard Testing Protocol',
        'Includes EDTA Vacuum Tube & Sterile Safety Lancet',
        'Free Doorstep Specimen Pickup in Khammam City',
        'Digital WhatsApp & PDF Report within 4 Hours',
        'Includes Physician Tele-Review with Dr. Narayana Murthy'
      ],
      tag: 'Popular',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=85',
      stock: 150,
      inStock: true,
      sortOrder: 5
    },
    {
      slug: 'pulse-oximeter-fingertip',
      name: 'Precision Fingertip Pulse Oximeter with OLED Display',
      category: 'Vital Monitors',
      price: 799,
      originalPrice: 1200,
      discountText: '33% OFF',
      summary: 'Medical-grade fingertip pulse oximeter for real-time arterial oxygen saturation (SpO2), pulse rate, and perfusion index tracking.',
      features: [
        'Dual-Color OLED Multi-Directional Display',
        'Accurate SpO2 and Pulse Rate in 6 Seconds',
        'Perfusion Index (PI) Visual Waveform Plethysmograph',
        'Auto Power-Off to Conserve Battery Life',
        'Includes Lanyard, AAA Batteries & Silicone Case'
      ],
      tag: 'Handy Device',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=85',
      stock: 75,
      inStock: true,
      sortOrder: 6
    }
  ];

  for (const p of products) {
    await prisma.productPackage.upsert({
      where: { slug: p.slug },
      update: p,
      create: p
    });
  }
  console.log('✓ E-Commerce Products seeded successfully');

  // 9. Patients & Clinical Data
  const samplePatient = await prisma.patient.upsert({
    where: { patientCode: 'RH-P24017' },
    update: {},
    create: {
      patientCode: 'RH-P24017',
      name: 'Rahul Varma',
      age: 14,
      gender: 'Male',
      bloodGroup: 'B+',
      phone: '+91 98481 22334',
      condition: 'Beta Thalassemia Major',
      allergies: 'None reported',
      status: 'admitted',
      consentCapturedAt: new Date(),
      consentStaffId: staffUser.id
    }
  });

  const sampleAdmission = await prisma.admission.upsert({
    where: { admissionCode: 'ADM-901' },
    update: {},
    create: {
      admissionCode: 'ADM-901',
      patientId: samplePatient.id,
      status: 'admitted',
      ward: 'Thalassemia Transfusion Daycare',
      bed: 'Bed-02',
      attendingDoctor: 'Dr. Narayana Murthy, MD',
      diagnosis: 'Routine 3-week Packed Red Cell Transfusion for Beta Thalassemia Major'
    }
  });

  // Clinical Readings for Rahul
  const dates = [
    { dayAgo: 21, fasting: 96, pp: 138, hba1c: 5.4, bpSys: 112, bpDia: 74, hb: 7.8, ferritin: 1420 },
    { dayAgo: 14, fasting: 98, pp: 142, hba1c: 5.5, bpSys: 115, bpDia: 76, hb: 9.4, ferritin: 1390 },
    { dayAgo: 7, fasting: 94, pp: 136, hba1c: 5.4, bpSys: 114, bpDia: 75, hb: 8.9, ferritin: 1370 },
    { dayAgo: 0, fasting: 95, pp: 140, hba1c: 5.4, bpSys: 116, bpDia: 76, hb: 7.6, ferritin: 1350 }
  ];

  for (const d of dates) {
    const readingDate = new Date();
    readingDate.setDate(readingDate.getDate() - d.dayAgo);
    await prisma.clinicalReading.create({
      data: {
        patientId: samplePatient.id,
        admissionId: sampleAdmission.id,
        date: readingDate,
        time: '11:30 AM',
        timeSlot: 'Morning',
        bloodSugarFasting: d.fasting,
        bloodSugarPP: d.pp,
        hba1c: d.hba1c,
        bpSystolic: d.bpSys,
        bpDiastolic: d.bpDia,
        haemoglobin: d.hb,
        ferritin: d.ferritin,
        spo2: 99,
        temperature: 98.4,
        pulse: 78,
        notes: d.dayAgo === 0 ? 'Pre-transfusion baseline vitals recorded. 1 unit leukodepleted B+ PRBC planned.' : 'Follow-up vitals log.'
      }
    });
  }

  // Second patient (Diabetic)
  const patient2 = await prisma.patient.upsert({
    where: { patientCode: 'RH-P24018' },
    update: {},
    create: {
      patientCode: 'RH-P24018',
      name: 'K. Ramana Rao',
      age: 58,
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+91 99480 33441',
      condition: 'Type 2 Diabetes Mellitus & Hypertension',
      allergies: 'Penicillin allergy',
      status: 'outpatient'
    }
  });

  await prisma.clinicalReading.create({
    data: {
      patientId: patient2.id,
      date: new Date(),
      time: '10:15 AM',
      timeSlot: 'Morning',
      bloodSugarFasting: 154,
      bloodSugarPP: 228,
      hba1c: 8.6,
      bpSystolic: 142,
      bpDiastolic: 88,
      haemoglobin: 13.4,
      spo2: 98,
      temperature: 98.6,
      pulse: 76,
      notes: 'OPD follow-up. Diet audit done. Metformin & lifestyle counseling prescribed.'
    }
  });
  console.log('✓ Patients and clinical logs seeded');

  // 10. Expenses
  const expenses = [
    { expenseCode: 'EXP-101', name: 'Blood Transfusion Bags & Infusion Sets', category: 'Medical supplies', vendor: 'MedTech Khammam', amount: 28500, status: 'paid', notes: 'Monthly transfusion pack replenishment' },
    { expenseCode: 'EXP-102', name: 'Diagnostic Bio-analyzer Reagents', category: 'Clinical operations', vendor: 'Apollo Diagnostic Supplies', amount: 19400, status: 'paid', notes: 'Haemoglobin and glucose test cartridges' },
    { expenseCode: 'EXP-103', name: 'Medical Oxygen Cylinder Refill', category: 'Medical supplies', vendor: 'Krishna Gas Dist.', amount: 8200, status: 'paid', notes: 'Day-care ward backup' },
    { expenseCode: 'EXP-104', name: 'Facility Electricity & Power Backup', category: 'Utilities', vendor: 'TSSPDCL', amount: 22400, status: 'paid', notes: 'Hospital premises billing' },
    { expenseCode: 'EXP-105', name: 'Bio-medical Waste Safe Disposal', category: 'Compliance', vendor: 'Telangana Enviro Waste', amount: 7500, status: 'paid', notes: 'Monthly certified pickup' }
  ];

  for (const exp of expenses) {
    await prisma.expense.upsert({
      where: { expenseCode: exp.expenseCode },
      update: exp,
      create: exp
    });
  }
  console.log('✓ Expenses seeded');

  // 11. Gallery Items
  const galleryItems = [
    { title: 'Daycare Transfusion Ward', category: 'Daycare', imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=85', caption: 'Modern, sanitized day-care beds equipped for peaceful transfusions', sortOrder: 1 },
    { title: 'Clinical Diagnostics Lab', category: 'Diagnostics', imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=85', caption: 'High-precision automated haematology and biochemical analyzers', sortOrder: 2 },
    { title: 'Doctor Consultation Room', category: 'Facility', imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85', caption: 'Quiet outpatient consultation chambers for unrushed patient discussions', sortOrder: 3 },
    { title: 'Physician In Action', category: 'Specialists', imageUrl: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1200&q=85', caption: 'Dr. Narayana Murthy conducting careful clinical examinations', sortOrder: 4 },
    { title: 'Nursing & Patient Monitoring', category: 'Patient Care', imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=85', caption: 'Compassionate pediatric and geriatric nursing support', sortOrder: 5 }
  ];

  for (const g of galleryItems) {
    const existing = await prisma.galleryItem.findFirst({ where: { title: g.title } });
    if (!existing) {
      await prisma.galleryItem.create({ data: g });
    }
  }
  console.log('✓ Gallery seeded');

  // Synchronize master treatments and doctors
  const { syncProductionMasterData } = require('../config/masterCatalogSeeder');
  await syncProductionMasterData(prisma);

  console.log('🎉 Rithanya Hospital Database Seed Complete!');
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error('Seed error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedDatabase: main };
