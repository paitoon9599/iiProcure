export type ModuleId =
  | 'home'
  | 'purchase'
  | 'hire'
  | 'construction'
  | 'procurement_register'
  | 'w804'
  | 'w119'
  | 'textbooks'
  | 'quarterly_announcement'
  | 'inventory_ledger'
  | 'requisition'
  | 'borrow_return'
  | 'material_report'
  | 'asset_register'
  | 'annual_audit'
  | 'projects'
  | 'personnel'
  | 'school_settings'
  | 'backup_restore';

export type TaskType = 'purchase' | 'hire' | 'construction' | 'w804' | 'w119';

export type TaskStatus = 'completed' | 'in_progress' | 'inspecting' | 'disbursing' | 'approved';

export interface ProcurementTask {
  id: string;
  type: TaskType;
  title: string;
  categoryName: string;
  dateStr: string;
  rawDate: string; // YYYY-MM-DD
  amount: number;
  status: TaskStatus;
  statusText: string;
  vendorName: string;
  budgetSource: string;
  poNumber: string;
  committee: string[];
  description?: string;
  projectId?: string;
  projectCode?: string;
  projectName?: string;
  projectOwnerName?: string;
  activityId?: string;
  activityCode?: string;
  activityName?: string;
  items?: Array<{ name: string; quantity: number; unit: string; unitPrice: number; total: number }>;
}

export interface MaterialItem {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  balance: number;
  minStock: number;
  unitPrice: number;
  lastUpdated: string;
}

export interface RequisitionSlip {
  id: string;
  slipNumber: string;
  date: string;
  requesterName: string;
  department: string;
  items: Array<{ name: string; quantity: number; unit: string }>;
  purpose: string;
  status: 'pending' | 'approved' | 'disbursed';
}

export interface BorrowRecord {
  id: string;
  code: string;
  assetName: string;
  borrowerName: string;
  department: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'overdue' | 'returned';
  phone?: string;
  note?: string;
}

export interface FixedAsset {
  id: string;
  assetNumber: string; // เช่น ศธ 04052.12/67/012
  name: string;
  specs: string;
  acquisitionDate: string;
  price: number;
  fundingSource: string;
  location: string;
  custodian: string;
  condition: 'good' | 'fair' | 'damaged' | 'disposed';
}

export interface TextbookRecord {
  id: string;
  grade: string;
  subject: string;
  title: string;
  publisher: string;
  studentCount: number;
  unitPrice: number;
  totalAmount: number;
  status: 'ordered' | 'received' | 'distributed';
}

export interface AuditItem {
  id: string;
  assetNumber: string;
  name: string;
  location: string;
  auditor: string;
  auditDate: string;
  status: 'verified' | 'damaged' | 'missing' | 'pending';
  notes: string;
}

// Organization / School Profile & Department Configuration
export interface SchoolProfile {
  schoolName: string;
  schoolCode: string; // รหัสสถานศึกษา 10 หลัก
  districtOffice: string; // สำนักงานเขตพื้นที่การศึกษา
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
  telephone: string;
  email: string;
  directorName: string;
  directorPosition: string;
  fiscalYear: number;
  totalStudents: number;
  totalTeachers: number;
}

export interface Department {
  id: string;
  code: string;
  name: string; // เช่น กลุ่มบริหารงานวิชาการ, กลุ่มบริหารงบประมาณและแผนงาน
  headStaffName: string;
  headStaffPosition: string;
  staffCount: number;
  description: string;
}

// Personnel by Position
export type ProcurementRole = 'approver' | 'procurement_officer' | 'finance_officer' | 'inspector' | 'teacher';

export interface RoleDefinition {
  key: ProcurementRole;
  label: string;
  shortLabel: string;
  badgeClass: string;
  headerBadgeClass: string;
  description: string;
  allowedModules: ModuleId[];
  primaryModules: ModuleId[];
}

export const ROLE_DEFINITIONS: Record<ProcurementRole, RoleDefinition> = {
  approver: {
    key: 'approver',
    label: 'ผู้อนุมัติ (ผู้อำนวยการโรงเรียน)',
    shortLabel: 'ผู้อนุมัติ (ผอ.)',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    headerBadgeClass: 'bg-purple-600 text-white',
    description: 'มีอำนาจอนุมัติโครงการ อนุมัติการจัดซื้อจัดจ้าง อนุมัติใบเบิกพัสดุ และลงนามในเอกสารราชการ',
    allowedModules: [
      'home', 'purchase', 'hire', 'construction', 'procurement_register',
      'w804', 'w119', 'textbooks', 'quarterly_announcement', 'inventory_ledger',
      'requisition', 'borrow_return', 'material_report', 'asset_register',
      'annual_audit', 'projects', 'personnel', 'school_settings', 'backup_restore'
    ],
    primaryModules: ['home', 'projects', 'requisition', 'procurement_register', 'quarterly_announcement', 'annual_audit', 'school_settings'],
  },
  procurement_officer: {
    key: 'procurement_officer',
    label: 'เจ้าหน้าที่พัสดุ',
    shortLabel: 'จนท.พัสดุ',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    headerBadgeClass: 'bg-emerald-600 text-white',
    description: 'รับผิดชอบงานจัดซื้อจัดจ้าง ว.804 ว.119 คุมทะเบียนพัสดุ บัญชีวัสดุ ตัดสต็อก และจัดทำ สขร. 1',
    allowedModules: [
      'home', 'purchase', 'hire', 'construction', 'procurement_register',
      'w804', 'w119', 'textbooks', 'quarterly_announcement', 'inventory_ledger',
      'requisition', 'borrow_return', 'material_report', 'asset_register',
      'annual_audit', 'projects', 'personnel', 'school_settings', 'backup_restore'
    ],
    primaryModules: ['home', 'purchase', 'hire', 'construction', 'procurement_register', 'w804', 'w119', 'inventory_ledger', 'requisition'],
  },
  finance_officer: {
    key: 'finance_officer',
    label: 'เจ้าหน้าที่การเงินและบัญชี',
    shortLabel: 'จนท.การเงิน',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    headerBadgeClass: 'bg-blue-600 text-white',
    description: 'ตรวจสอบความถูกต้องของงบประมาณโครงการ ตรวจสอบหลักฐานการจ่ายเงิน และสรุปรายงานการเงิน',
    allowedModules: [
      'home', 'procurement_register', 'quarterly_announcement', 'material_report',
      'projects', 'inventory_ledger', 'textbooks', 'requisition', 'borrow_return', 'backup_restore'
    ],
    primaryModules: ['home', 'projects', 'procurement_register', 'quarterly_announcement', 'material_report'],
  },
  inspector: {
    key: 'inspector',
    label: 'กรรมการตรวจรับพัสดุ',
    shortLabel: 'กรรมการตรวจรับ',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    headerBadgeClass: 'bg-amber-600 text-white',
    description: 'มีหน้าที่ตรวจรับพัสดุให้ถูกต้องตามสัญญา/ใบสั่งซื้อ และทำการตรวจสอบพัสดุประจำปี',
    allowedModules: [
      'home', 'procurement_register', 'annual_audit', 'asset_register',
      'borrow_return', 'purchase', 'hire', 'construction', 'w804', 'w119'
    ],
    primaryModules: ['home', 'annual_audit', 'asset_register', 'procurement_register'],
  },
  teacher: {
    key: 'teacher',
    label: 'ครูผู้สอน / ผู้ขอเบิก',
    shortLabel: 'ครูผู้ขอเบิก',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    headerBadgeClass: 'bg-slate-700 text-white',
    description: 'ขอเบิกวัสดุการศึกษา ยืม-คืนอุปกรณ์การสอน ดูรายการแบบเรียนฟรี 15 ปี และติดตามกิจกรรมโครงการ',
    allowedModules: [
      'home', 'requisition', 'borrow_return', 'textbooks', 'projects'
    ],
    primaryModules: ['home', 'requisition', 'borrow_return', 'textbooks'],
  },
};

export interface StaffPersonnel {
  id: string;
  staffCode: string; // เช่น บุคลากร-001
  title: string; // นาย / นาง / นางสาว
  fullName: string;
  position: string; // เช่น ผู้อำนวยการโรงเรียน, ครูชำนาญการพิเศษ, ครู คศ.1, เจ้าหน้าที่พัสดุ
  academicStanding?: string; // วิทยฐานะ (ชำนาญการ / ชำนาญการพิเศษ / เชี่ยวชาญ)
  departmentId: string;
  departmentName: string;
  procurementRole: ProcurementRole;
  phone: string;
  email: string;
  active: boolean;
  avatarUrl?: string;
  password?: string;
}

// Approved School Strategic Projects & Activities
export interface ProjectActivity {
  id: string;
  code: string; // เช่น กิจกรรมที่ 1.1
  name: string;
  responsibleStaffName: string;
  responsiblePosition: string;
  allocatedBudget: number;
  spentBudget: number;
  status: 'pending' | 'in_progress' | 'completed';
  period: string; // เช่น ต.ค. 68 - มี.ค. 69
  description?: string;
}

export interface ApprovedProject {
  id: string;
  code: string; // เช่น โครงการที่ 01/2569
  name: string;
  strategicIssue: string; // ประเด็นยุทธศาสตร์/กลยุทธ์
  fiscalYear: number;
  departmentId: string;
  departmentName: string;
  ownerStaffId: string;
  ownerStaffName: string; // เจ้าของโครงการ / ผู้รับผิดชอบ
  ownerPosition: string;
  budgetSource: string; // เงินอุดหนุนรายหัว, เงินรายได้สถานศึกษา ฯลฯ
  totalBudget: number;
  spentBudget: number;
  status: 'approved' | 'in_progress' | 'completed';
  approvalDate: string;
  objectives: string[];
  activities: ProjectActivity[];
}
