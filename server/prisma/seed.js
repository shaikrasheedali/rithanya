const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../utils/argonHelper');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Rithanya Hospital Database Seed ---');

  // 1. Superadmin User
  const superadminHash = await hashPassword('Hameed@2026');
  const superadmin = await prisma.user.upsert({
    where: { email: 'mgrhameed@gmail.com' },
    update: {
      passwordHash: superadminHash,
      role: 'SUPERADMIN',
      name: 'Hameed',
      enabled: true
    },
    create: {
      email: 'mgrhameed@gmail.com',
      name: 'Hameed',
      role: 'SUPERADMIN',
      passwordHash: superadminHash,
      salt: 'rh_superadmin_1',
      enabled: true,
      permissions: { all: true }
    }
  });
  console.log('✓ Superadmin initialized:', superadmin.email);

  // 2. Staff User (Dr. Narayana Murthy login)
  const staffHash = await hashPassword('Staff@2026');
  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@rithanya.in' },
    update: {
      passwordHash: staffHash,
      role: 'STAFF',
      name: 'Dr. Narayana Murthy',
      enabled: true
    },
    create: {
      email: 'staff@rithanya.in',
      name: 'Dr. Narayana Murthy',
      role: 'STAFF',
      passwordHash: staffHash,
      salt: 'rh_salt_1',
      enabled: true,
      permissions: {
        dashboard: true,
        patients: true,
        clinical: true,
        admissions: true,
        inventory: true,
        appointments: true,
        services: true,
        blogs: true,
        specialists: true,
        products: true,
        productInquiries: true,
        gallery: true,
        media: true,
        credentials: true,
        staff: true,
        finance: true,
        settings: true
      }
    }
  });
  console.log('✓ Staff user initialized:', staffUser.email);

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
      email: 'sujatha.reddy@rithanya.in',
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
      email: 'venkatesh.b@rithanya.in',
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
      email: 'lakshmi.p@rithanya.in',
      status: 'active'
    }
  ];

  for (const s of staffMembers) {
    await prisma.staff.upsert({
      where: { email: s.email },
      update: s,
      create: s
    });
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
        email: 'info@rithanya.in',
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
        dpoContact: 'dpo@rithanya.in',
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

  // 8. Health Packages & Products
  const packages = [
    {
      slug: 'comprehensive-diabetic-care',
      name: 'Comprehensive Diabetic Health Package',
      category: 'Metabolic & Endocrinology',
      price: 1499,
      originalPrice: 2800,
      discountText: '46% OFF',
      summary: 'Complete blood sugar assessment, HbA1c, lipid profile, kidney panel, and specialized physician consultation.',
      features: [
        'HbA1c Glycated Haemoglobin Test',
        'Fasting & Postprandial Blood Glucose',
        'Complete Lipid Panel (Cholesterol, HDL, LDL)',
        'Kidney Function Test (Serum Creatinine, BUN)',
        'Urine Microalbumin Screening',
        'Physician Evaluation with Dr. Narayana Murthy'
      ],
      tag: 'Most Popular',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=85',
      sortOrder: 1
    },
    {
      slug: 'senior-citizen-wellness',
      name: 'Senior Citizen Comprehensive Checkup',
      category: 'Geriatric Health',
      price: 1999,
      originalPrice: 3500,
      discountText: '43% OFF',
      summary: 'Tailored diagnostics for senior citizens including cardiac markers, liver function, bone mineral profile, and doctor review.',
      features: [
        'Complete Blood Count (CBC) with ESR',
        'Liver Function & Kidney Function Profiles',
        'Serum Calcium & Vitamin D Screen',
        'Blood Pressure & ECG Recording',
        'Geriatric Mobility & Medication Review'
      ],
      tag: 'Recommended',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=85',
      sortOrder: 2
    },
    {
      slug: 'thalassemia-chelation-review',
      name: 'Thalassemia Iron Overload Monitoring Panel',
      category: 'Hematology Daycare',
      price: 1200,
      originalPrice: 2000,
      discountText: '40% OFF',
      summary: 'Serum ferritin assessment, complete hemogram, pre-transfusion cross-matching, and chelation dosage adjustment.',
      features: [
        'Serum Ferritin Chemiluminescence Test',
        'Automated CBC with Peripheral Smear',
        'Pre-transfusion Compatibility Screen',
        'Attending Daycare Physician Audit'
      ],
      tag: 'Daycare Special',
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=85',
      sortOrder: 3
    }
  ];

  for (const p of packages) {
    await prisma.productPackage.upsert({
      where: { slug: p.slug },
      update: p,
      create: p
    });
  }
  console.log('✓ Health packages seeded');

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

  console.log('🎉 Rithanya Hospital Database Seed Complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
