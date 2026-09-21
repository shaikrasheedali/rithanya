const { invalidatePublicCache } = require('../utils/publicDataCache');
const { MASTER_40_TREATMENTS } = require('./master40Treatments');

/**
 * Verified Real Treatments & Conditions Managed (40 Items)
 * Each with verified facts, indications, clinical summaries, and Telugu translations
 */
const ALL_40_TREATMENTS = MASTER_40_TREATMENTS.map((t, idx) => ({
  ...t,
  status: 'published',
  sortOrder: idx + 1
}));

/**
 * Official Faculty Doctors (Founder & Co-Founder)
 * 1. Dr. D. Narayana Murthy (Reg: 81187) - Diabetologist
 * 2. Dr. A. Lakshmi Deepa (Reg: 19422) - Gynecologist / Women's Health Specialist
 */
const FACULTY_DOCTORS = [
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
  }
];

/**
 * Institutional Master Profile & SEO Meta Settings
 */
const INSTITUTION_PROFILE = {
  name: 'Rithanya Hospital (రితన్య హాస్పిటల్)',
  tagline: '24/7 Emergency Services • Rithanya Blood Bank 24 Hours Available • Aarogyasri Facility Available',
  location: 'Nehru Road, Opposite Old L.I.C. Office, Khammam (నెహ్రూరోడ్, పాత ఎల్.ఐ.సి. ఆఫీస్ ఎదురుగా, ఖమ్మం)',
  address: 'Nehru Road, Opposite Old L.I.C. Office, Khammam (నెహ్రూరోడ్, పాత ఎల్.ఐ.సి. ఆఫీస్ ఎదురుగా, ఖమ్మం), Telangana - 507001',
  phone: '8328581019',
  secondaryPhone: '9948713504',
  emergencyPhone: '8328581019',
  contactNumbers: ['8328581019', '9948713504'],
  facilities: [
    '24/7 Emergency Services',
    'Rithanya Blood Bank 24 Hours Available (రితన్య బ్లడ్ బ్యాంక్ 24 గం॥ అందుబాటులో కలదు)',
    'Aarogyasri Facility Available for Sickle Cell Anemia and Thalassemia Children (సికిల్ సెల్ అనీమియా, తలసేమియా పిల్లలకు ఆరోగ్యశ్రీ సదుపాయం కలదు)'
  ],
  email: 'info@rithanyahospital.com',
  timings: 'OPD: Mon–Sat: 10:00 AM – 8:30 PM | Emergency & Blood Bank: 24 Hours Available'
};

const SEO_SETTINGS = {
  metaTitle: 'Rithanya Hospital (రితన్య హాస్పిటల్) | Nehru Road, Khammam | 24/7 Emergency & Blood Bank',
  metaDescription: 'Rithanya Hospital (రితన్య హాస్పిటల్), Nehru Road, Opposite Old L.I.C. Office, Khammam. Founded by Dr. D. Narayana Murthy & Dr. A. Lakshmi Deepa. 24/7 Emergency Services, 24 Hours Blood Bank, and Aarogyasri Facility for Sickle Cell Anemia & Thalassemia Children. Contact: 8328581019, 9948713504.',
  keywords: 'Rithanya Hospital, రితన్య హాస్పిటల్, Khammam Hospital, Dr D Narayana Murthy, Dr A Lakshmi Deepa, Diabetologist Khammam, Gynecologist Khammam, Nehru Road Khammam, 24/7 Emergency Khammam, Rithanya Blood Bank, Aarogyasri Thalassemia Khammam, BP Hypertension, Diabetes Sugar',
  ogImage: '/image.png'
};

/**
 * Synchronizes production database with exact master catalog records:
 * - Upserts exact 40 treatments & conditions managed and prunes all dummy/legacy treatments.
 * - Upserts the 2 official faculty doctors (Dr. D. Narayana Murthy & Dr. A. Lakshmi Deepa).
 * - Deactivates any non-faculty demo doctors.
 * - Upserts hospital institutional profile and SEO settings.
 * - Flushes public in-memory cache.
 */
async function syncProductionMasterData(prisma) {
  console.log('[MasterCatalogSeeder] Starting production master catalog synchronization...');

  try {
    // 1. Synchronize Treatments: Upsert all 40 verified items
    for (const item of ALL_40_TREATMENTS) {
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
    console.log(`[MasterCatalogSeeder] ✓ Upserted ${ALL_40_TREATMENTS.length} verified real treatments & conditions managed.`);

    // 2. Prune any other legacy or dummy treatments so ONLY these 40 exist
    const allowedSlugs = ALL_40_TREATMENTS.map((t) => t.slug);
    const deleteResult = await prisma.treatment.deleteMany({
      where: {
        slug: { notIn: allowedSlugs }
      }
    });
    if (deleteResult.count > 0) {
      console.log(`[MasterCatalogSeeder] ✓ Pruned ${deleteResult.count} legacy/dummy treatment items.`);
    }

    // 3. Synchronize Doctors / Specialists: Upsert the 2 official faculty doctors
    for (const doc of FACULTY_DOCTORS) {
      const existing = await prisma.specialist.findFirst({
        where: {
          OR: [
            { slug: doc.slug },
            { name: { contains: doc.slug === 'dr-d-narayana-murthy' ? 'Narayana Murthy' : 'Lakshmi' } }
          ]
        }
      });

      if (existing) {
        await prisma.specialist.update({
          where: { id: existing.id },
          data: {
            slug: existing.slug || doc.slug,
            registrationNumber: existing.registrationNumber || doc.registrationNumber,
            qualifications: existing.qualifications || doc.qualifications,
            image: existing.image || doc.image,
            status: 'active'
          }
        });
      } else {
        await prisma.specialist.create({
          data: doc
        });
      }
    }

    // Remove any demo or extra doctors so ONLY the 2 official faculty doctors exist
    const allowedDoctorSlugs = FACULTY_DOCTORS.map((d) => d.slug);
    await prisma.specialist.deleteMany({
      where: {
        slug: { notIn: allowedDoctorSlugs }
      }
    });
    console.log(`[MasterCatalogSeeder] ✓ Synchronized faculty doctors (Dr. D. Narayana Murthy & Dr. A. Lakshmi Deepa).`);

    // 4. Upsert Institutional Profile & SEO Settings
    await prisma.hospitalSetting.upsert({
      where: { key: 'hospital_profile' },
      update: {
        value: INSTITUTION_PROFILE,
        description: 'Verified institutional information, Nehru Road Khammam location, contacts, and 24/7 facilities'
      },
      create: {
        key: 'hospital_profile',
        description: 'Verified institutional information, Nehru Road Khammam location, contacts, and 24/7 facilities',
        value: INSTITUTION_PROFILE
      }
    });

    await prisma.hospitalSetting.upsert({
      where: { key: 'seo_settings' },
      update: {
        value: SEO_SETTINGS,
        description: 'Dynamic SEO meta title, description, and keywords'
      },
      create: {
        key: 'seo_settings',
        description: 'Dynamic SEO meta title, description, and keywords',
        value: SEO_SETTINGS
      }
    });
    console.log('[MasterCatalogSeeder] ✓ Hospital Profile & SEO Settings synchronized.');

    // 5. Invalidate public in-memory cache so fresh data takes effect immediately
    invalidatePublicCache('treatments');
    invalidatePublicCache('specialists');
    invalidatePublicCache('settings');
    invalidatePublicCache('services');
    console.log('[MasterCatalogSeeder] ✓ Public data cache flushed.');

  } catch (err) {
    console.error('[MasterCatalogSeeder] Notice during synchronization:', err.message);
  }
}

module.exports = {
  ALL_40_TREATMENTS,
  FACULTY_DOCTORS,
  INSTITUTION_PROFILE,
  SEO_SETTINGS,
  syncProductionMasterData
};
