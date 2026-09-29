-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPERADMIN', 'ADMIN', 'STAFF') NOT NULL DEFAULT 'STAFF',
    `passwordHash` VARCHAR(255) NOT NULL,
    `plainPasswordEnc` TEXT NULL,
    `salt` VARCHAR(191) NOT NULL DEFAULT '',
    `version` VARCHAR(191) NOT NULL DEFAULT 'v1',
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `permissions` JSON NULL,
    `allowedModules` JSON NULL,
    `creatorId` VARCHAR(191) NULL,
    `lastLogin` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Staff` (
    `id` VARCHAR(191) NOT NULL,
    `staffCode` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `designation` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `salary` DOUBLE NOT NULL DEFAULT 0,
    `shift` VARCHAR(191) NOT NULL DEFAULT 'Day',
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `joinedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Staff_staffCode_key`(`staffCode`),
    UNIQUE INDEX `Staff_email_key`(`email`),
    UNIQUE INDEX `Staff_userId_key`(`userId`),
    INDEX `Staff_department_idx`(`department`),
    INDEX `Staff_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient` (
    `id` VARCHAR(191) NOT NULL,
    `patientCode` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `bloodGroup` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `condition` VARCHAR(191) NOT NULL,
    `allergies` VARCHAR(191) NOT NULL DEFAULT 'None reported',
    `status` ENUM('admitted', 'outpatient', 'discharged') NOT NULL DEFAULT 'outpatient',
    `consentPhotoBlob` LONGTEXT NULL,
    `consentCapturedAt` DATETIME(3) NULL,
    `consentStaffId` VARCHAR(191) NULL,
    `isErased` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Patient_patientCode_key`(`patientCode`),
    INDEX `Patient_patientCode_idx`(`patientCode`),
    INDEX `Patient_bloodGroup_idx`(`bloodGroup`),
    INDEX `Patient_status_idx`(`status`),
    INDEX `Patient_phone_idx`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admission` (
    `id` VARCHAR(191) NOT NULL,
    `admissionCode` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `admittedOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dischargedOn` DATETIME(3) NULL,
    `status` ENUM('admitted', 'discharged') NOT NULL DEFAULT 'admitted',
    `ward` VARCHAR(191) NOT NULL DEFAULT 'Daycare Transfusion Ward',
    `bed` VARCHAR(191) NOT NULL DEFAULT 'Bed-01',
    `attendingDoctor` VARCHAR(191) NOT NULL DEFAULT 'Dr. Narayana Murthy, MD',
    `diagnosis` VARCHAR(191) NOT NULL,
    `dischargeSummary` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admission_admissionCode_key`(`admissionCode`),
    INDEX `Admission_patientId_idx`(`patientId`),
    INDEX `Admission_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClinicalReading` (
    `id` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `admissionId` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `time` VARCHAR(191) NOT NULL DEFAULT '10:00 AM',
    `timeSlot` VARCHAR(191) NOT NULL DEFAULT 'Morning',
    `bloodSugarFasting` DOUBLE NULL,
    `bloodSugarPP` DOUBLE NULL,
    `bloodSugarRandom` DOUBLE NULL,
    `hba1c` DOUBLE NULL,
    `bpSystolic` INTEGER NULL,
    `bpDiastolic` INTEGER NULL,
    `haemoglobin` DOUBLE NULL,
    `ferritin` DOUBLE NULL,
    `spo2` INTEGER NULL,
    `temperature` DOUBLE NULL,
    `pulse` INTEGER NULL,
    `notes` TEXT NULL,
    `recordedBy` VARCHAR(191) NOT NULL DEFAULT 'Dr. Narayana Murthy',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ClinicalReading_patientId_idx`(`patientId`),
    INDEX `ClinicalReading_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BloodInventory` (
    `id` VARCHAR(191) NOT NULL,
    `group` VARCHAR(191) NOT NULL,
    `units` INTEGER NOT NULL DEFAULT 0,
    `reservedUnits` INTEGER NOT NULL DEFAULT 0,
    `threshold` INTEGER NOT NULL DEFAULT 10,
    `capacity` INTEGER NOT NULL DEFAULT 30,
    `expiryDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BloodInventory_group_key`(`group`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryLog` (
    `id` VARCHAR(191) NOT NULL,
    `logCode` VARCHAR(191) NOT NULL,
    `bloodGroup` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `units` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiryDate` DATETIME(3) NULL,
    `performedBy` VARCHAR(191) NOT NULL,
    `notes` TEXT NULL,
    `patientId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `InventoryLog_logCode_key`(`logCode`),
    INDEX `InventoryLog_bloodGroup_idx`(`bloodGroup`),
    INDEX `InventoryLog_type_idx`(`type`),
    INDEX `InventoryLog_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` VARCHAR(191) NOT NULL,
    `apptCode` VARCHAR(191) NOT NULL,
    `patientName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `age` INTEGER NULL,
    `gender` VARCHAR(191) NULL,
    `bloodGroup` VARCHAR(191) NULL,
    `specialty` VARCHAR(191) NOT NULL DEFAULT 'General Medicine',
    `doctorName` VARCHAR(191) NOT NULL DEFAULT 'Dr. Narayana Murthy, MD',
    `preferredDate` DATETIME(3) NOT NULL,
    `preferredTimeSlot` VARCHAR(191) NOT NULL DEFAULT 'Morning (10:00 AM - 01:00 PM)',
    `reason` TEXT NULL,
    `status` ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Appointment_apptCode_key`(`apptCode`),
    INDEX `Appointment_phone_idx`(`phone`),
    INDEX `Appointment_status_idx`(`status`),
    INDEX `Appointment_preferredDate_idx`(`preferredDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL DEFAULT 'Dr. Narayana Murthy, MD',
    `date` VARCHAR(191) NOT NULL DEFAULT 'Updated Weekly',
    `readTime` VARCHAR(191) NOT NULL DEFAULT '5 min overview',
    `status` ENUM('published', 'draft') NOT NULL DEFAULT 'published',
    `summary` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `coverImage` VARCHAR(1000) NOT NULL,
    `galleryImages` JSON NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Service_slug_key`(`slug`),
    INDEX `Service_slug_idx`(`slug`),
    INDEX `Service_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Blog` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL DEFAULT 'Dr. Narayana Murthy, MD',
    `date` VARCHAR(191) NOT NULL DEFAULT 'Recently Published',
    `readTime` VARCHAR(191) NOT NULL DEFAULT '4 min read',
    `status` ENUM('published', 'draft') NOT NULL DEFAULT 'published',
    `summary` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `coverImage` VARCHAR(1000) NOT NULL,
    `tags` JSON NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Blog_slug_key`(`slug`),
    INDEX `Blog_slug_idx`(`slug`),
    INDEX `Blog_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Specialist` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `designation` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `qualifications` TEXT NOT NULL,
    `registrationNumber` VARCHAR(191) NULL,
    `experience` VARCHAR(191) NOT NULL DEFAULT '15+ Years',
    `opdTimings` VARCHAR(191) NOT NULL DEFAULT 'Mon - Sat: 11:00 AM - 5:00 PM',
    `image` VARCHAR(1000) NOT NULL,
    `bio` TEXT NOT NULL,
    `content` LONGTEXT NULL,
    `availableDays` JSON NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Specialist_slug_key`(`slug`),
    INDEX `Specialist_slug_idx`(`slug`),
    INDEX `Specialist_department_idx`(`department`),
    INDEX `Specialist_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Treatment` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL DEFAULT 'General Medicine & Diabetology',
    `doctorName` VARCHAR(191) NOT NULL DEFAULT 'Dr. Narayana Murthy, MD',
    `duration` VARCHAR(191) NOT NULL DEFAULT '45 - 90 mins',
    `indications` TEXT NULL,
    `summary` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `coverImage` VARCHAR(1000) NOT NULL,
    `videoUrl` VARCHAR(1000) NULL,
    `procedures` JSON NULL,
    `tag` VARCHAR(191) NULL,
    `status` ENUM('published', 'draft') NOT NULL DEFAULT 'published',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Treatment_slug_key`(`slug`),
    INDEX `Treatment_slug_idx`(`slug`),
    INDEX `Treatment_status_idx`(`status`),
    INDEX `Treatment_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductPackage` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `originalPrice` DOUBLE NULL,
    `discountText` VARCHAR(191) NULL,
    `summary` TEXT NOT NULL,
    `features` JSON NULL,
    `tag` VARCHAR(191) NULL,
    `image` VARCHAR(1000) NOT NULL,
    `videoUrl` VARCHAR(1000) NULL,
    `content` LONGTEXT NULL,
    `stock` INTEGER NOT NULL DEFAULT 50,
    `inStock` BOOLEAN NOT NULL DEFAULT true,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ProductPackage_slug_key`(`slug`),
    INDEX `ProductPackage_slug_idx`(`slug`),
    INDEX `ProductPackage_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductInquiry` (
    `id` VARCHAR(191) NOT NULL,
    `orderCode` VARCHAR(191) NULL,
    `packageId` VARCHAR(191) NULL,
    `packageName` VARCHAR(191) NOT NULL,
    `items` JSON NULL,
    `totalAmount` DOUBLE NOT NULL DEFAULT 0,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `city` VARCHAR(191) NULL,
    `pincode` VARCHAR(191) NULL,
    `message` TEXT NULL,
    `status` ENUM('new', 'contacted', 'converted', 'closed') NOT NULL DEFAULT 'new',
    `orderStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `followUpNotes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProductInquiry_status_idx`(`status`),
    INDEX `ProductInquiry_phone_idx`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GalleryItem` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(1000) NOT NULL,
    `mediaType` VARCHAR(191) NOT NULL DEFAULT 'IMAGE',
    `embedUrl` TEXT NULL,
    `caption` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `GalleryItem_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MediaAsset` (
    `id` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `url` VARCHAR(1000) NOT NULL,
    `dimensions` VARCHAR(191) NULL,
    `fileData` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BloodReservation` (
    `id` VARCHAR(191) NOT NULL,
    `reservationCode` VARCHAR(191) NOT NULL,
    `bloodGroup` VARCHAR(191) NOT NULL,
    `units` INTEGER NOT NULL DEFAULT 1,
    `patientId` VARCHAR(191) NULL,
    `patientName` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `reservedBy` VARCHAR(191) NOT NULL DEFAULT 'Chief Physician',
    `notes` TEXT NULL,
    `holdHours` INTEGER NOT NULL DEFAULT 24,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BloodReservation_reservationCode_key`(`reservationCode`),
    INDEX `BloodReservation_bloodGroup_idx`(`bloodGroup`),
    INDEX `BloodReservation_status_idx`(`status`),
    INDEX `BloodReservation_patientId_idx`(`patientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BloodBagUnit` (
    `id` VARCHAR(191) NOT NULL,
    `bagId` VARCHAR(191) NOT NULL,
    `bloodGroup` VARCHAR(191) NOT NULL,
    `componentType` VARCHAR(191) NOT NULL DEFAULT 'Packed Red Cells (PRBC)',
    `bagType` VARCHAR(191) NOT NULL DEFAULT 'Triple 3D',
    `volumeMl` INTEGER NOT NULL DEFAULT 350,
    `donorCode` VARCHAR(191) NOT NULL DEFAULT 'DNR-LOCAL',
    `donorName` VARCHAR(191) NULL,
    `collectionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiryDate` DATETIME(3) NOT NULL,
    `stage` VARCHAR(191) NOT NULL DEFAULT 'QUARANTINE',
    `serologyStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `hivResult` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `hcvResult` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `hbsagResult` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `vdrlResult` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `screenedBy` VARCHAR(191) NULL,
    `screenedAt` DATETIME(3) NULL,
    `location` VARCHAR(191) NOT NULL DEFAULT 'Refrigerated Unit A (2°C - 6°C)',
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BloodBagUnit_bagId_key`(`bagId`),
    INDEX `BloodBagUnit_bloodGroup_idx`(`bloodGroup`),
    INDEX `BloodBagUnit_stage_idx`(`stage`),
    INDEX `BloodBagUnit_serologyStatus_idx`(`serologyStatus`),
    INDEX `BloodBagUnit_expiryDate_idx`(`expiryDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmptyBagStock` (
    `id` VARCHAR(191) NOT NULL,
    `bagType` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `volume` VARCHAR(191) NOT NULL DEFAULT '450ml',
    `anticoagulant` VARCHAR(191) NOT NULL DEFAULT 'CPDA-1',
    `currentStock` INTEGER NOT NULL DEFAULT 50,
    `minThreshold` INTEGER NOT NULL DEFAULT 15,
    `unitCost` DOUBLE NOT NULL DEFAULT 0,
    `lastRestocked` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EmptyBagStock_bagType_key`(`bagType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SerologyTestKit` (
    `id` VARCHAR(191) NOT NULL,
    `assayName` VARCHAR(191) NOT NULL,
    `manufacturer` VARCHAR(191) NOT NULL DEFAULT 'Transasia / J. Mitra',
    `lotNumber` VARCHAR(191) NOT NULL DEFAULT 'LOT-2026-A1',
    `totalTestsKit` INTEGER NOT NULL DEFAULT 100,
    `testsRemaining` INTEGER NOT NULL DEFAULT 100,
    `minThreshold` INTEGER NOT NULL DEFAULT 20,
    `expiryDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SerologyTestKit_assayName_key`(`assayName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReagentUsageLog` (
    `id` VARCHAR(191) NOT NULL,
    `kitId` VARCHAR(191) NOT NULL,
    `assayName` VARCHAR(191) NOT NULL,
    `testsUsed` INTEGER NOT NULL DEFAULT 1,
    `batchNumber` VARCHAR(191) NOT NULL,
    `technician` VARCHAR(191) NOT NULL DEFAULT 'Lab Officer',
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ReagentUsageLog_kitId_idx`(`kitId`),
    INDEX `ReagentUsageLog_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaffPayroll` (
    `id` VARCHAR(191) NOT NULL,
    `payrollMonth` VARCHAR(191) NOT NULL,
    `staffId` VARCHAR(191) NOT NULL,
    `staffCode` VARCHAR(191) NOT NULL,
    `staffName` VARCHAR(191) NOT NULL,
    `designation` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `fixedMonthlySalary` DOUBLE NOT NULL DEFAULT 0,
    `totalCalendarDays` INTEGER NOT NULL DEFAULT 30,
    `actualWorkingDays` INTEGER NOT NULL DEFAULT 26,
    `lopDays` DOUBLE NOT NULL DEFAULT 0,
    `paidDays` DOUBLE NOT NULL DEFAULT 30,
    `perDayRate` DOUBLE NOT NULL DEFAULT 0,
    `lopDeduction` DOUBLE NOT NULL DEFAULT 0,
    `allowances` DOUBLE NOT NULL DEFAULT 0,
    `otherDeductions` DOUBLE NOT NULL DEFAULT 0,
    `netPayableSalary` DOUBLE NOT NULL DEFAULT 0,
    `staffAcknowledged` BOOLEAN NOT NULL DEFAULT false,
    `staffSignature` LONGTEXT NULL,
    `staffSignedAt` DATETIME(3) NULL,
    `supervisorApproved` BOOLEAN NOT NULL DEFAULT false,
    `supervisorName` VARCHAR(191) NULL,
    `supervisorSignedAt` DATETIME(3) NULL,
    `directorApproved` BOOLEAN NOT NULL DEFAULT false,
    `directorName` VARCHAR(191) NULL DEFAULT 'Dr. Narayana Murthy, MD',
    `directorSignature` LONGTEXT NULL,
    `directorSignedAt` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
    `paymentMode` VARCHAR(191) NOT NULL DEFAULT 'Bank Transfer',
    `paymentReference` VARCHAR(191) NULL,
    `disbursedAt` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `StaffPayroll_payrollMonth_idx`(`payrollMonth`),
    INDEX `StaffPayroll_staffId_idx`(`staffId`),
    INDEX `StaffPayroll_status_idx`(`status`),
    UNIQUE INDEX `StaffPayroll_payrollMonth_staffId_key`(`payrollMonth`, `staffId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OperationalExpenseLine` (
    `id` VARCHAR(191) NOT NULL,
    `payrollMonth` VARCHAR(191) NOT NULL,
    `expenseName` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'Facility Rent',
    `vendorOrPayee` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `paymentMethod` VARCHAR(191) NOT NULL DEFAULT 'Cheque / NEFT',
    `invoiceRef` VARCHAR(191) NULL,
    `approvedBy` VARCHAR(191) NOT NULL DEFAULT 'Dr. Narayana Murthy',
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `OperationalExpenseLine_payrollMonth_idx`(`payrollMonth`),
    INDEX `OperationalExpenseLine_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expense` (
    `id` VARCHAR(191) NOT NULL,
    `expenseCode` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `vendor` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'paid',
    `invoiceRef` VARCHAR(191) NULL,
    `receiptUrl` VARCHAR(1000) NULL,
    `paymentMethod` VARCHAR(191) NOT NULL DEFAULT 'Bank NEFT',
    `approvalStage` VARCHAR(191) NOT NULL DEFAULT 'PENDING_REVIEW',
    `supervisorApproved` BOOLEAN NOT NULL DEFAULT false,
    `supervisorName` VARCHAR(191) NULL,
    `supervisorSignedAt` DATETIME(3) NULL,
    `directorApproved` BOOLEAN NOT NULL DEFAULT false,
    `directorName` VARCHAR(191) NULL,
    `directorSignedAt` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Expense_expenseCode_key`(`expenseCode`),
    INDEX `Expense_category_idx`(`category`),
    INDEX `Expense_date_idx`(`date`),
    INDEX `Expense_approvalStage_idx`(`approvalStage`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HospitalSetting` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` JSON NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `HospitalSetting_key_key`(`key`),
    INDEX `HospitalSetting_key_idx`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ErasureRequest` (
    `id` VARCHAR(191) NOT NULL,
    `patientName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `identifierLast4` VARCHAR(191) NULL,
    `patientCode` VARCHAR(191) NULL,
    `reason` TEXT NOT NULL,
    `status` ENUM('pending', 'approved', 'rejected', 'completed') NOT NULL DEFAULT 'pending',
    `requestedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processedAt` DATETIME(3) NULL,
    `processedBy` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ErasureRequest_status_idx`(`status`),
    INDEX `ErasureRequest_phone_idx`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `actorName` VARCHAR(191) NOT NULL DEFAULT 'System',
    `actorRole` VARCHAR(191) NOT NULL DEFAULT 'SYSTEM',
    `action` VARCHAR(191) NOT NULL,
    `module` VARCHAR(191) NOT NULL,
    `recordId` VARCHAR(191) NULL,
    `ipAddress` VARCHAR(191) NULL,
    `details` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_actorId_idx`(`actorId`),
    INDEX `AuditLog_module_idx`(`module`),
    INDEX `AuditLog_action_idx`(`action`),
    INDEX `AuditLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Staff` ADD CONSTRAINT `Staff_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admission` ADD CONSTRAINT `Admission_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClinicalReading` ADD CONSTRAINT `ClinicalReading_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClinicalReading` ADD CONSTRAINT `ClinicalReading_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `Admission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryLog` ADD CONSTRAINT `InventoryLog_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReagentUsageLog` ADD CONSTRAINT `ReagentUsageLog_kitId_fkey` FOREIGN KEY (`kitId`) REFERENCES `SerologyTestKit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

