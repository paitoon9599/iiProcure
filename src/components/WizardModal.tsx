import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building,
  DollarSign,
  Users,
  FileCheck,
  FolderKanban,
  Layers,
  AlertCircle,
  User,
} from 'lucide-react';
import { ProcurementTask, TaskType, ApprovedProject, StaffPersonnel } from '../types';

interface WizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: ProcurementTask) => void;
  fiscalYear: number;
  projects?: ApprovedProject[];
  staffList?: StaffPersonnel[];
}

export const WizardModal: React.FC<WizardModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  fiscalYear,
  projects = [],
  staffList = [],
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [taskType, setTaskType] = useState<TaskType>('purchase');
  const [categoryName, setCategoryName] = useState('งานซื้อ');

  // Step 2: Project & Activity Reference (Core requirement)
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');

  // Step 3: Title and Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Step 4: Budget and Vendor
  const [amount, setAmount] = useState<number>(3500);
  const [budgetSource, setBudgetSource] = useState('เงินอุดหนุนรายหัว (ค่าจัดการเรียนการสอน)');
  const [vendorName, setVendorName] = useState('');

  // Step 5: Committee
  const [committee1, setCommittee1] = useState(staffList[4]?.fullName ? `${staffList[4].title}${staffList[4].fullName}` : 'นายสมศักดิ์ มุ่งมั่น');
  const [committee2, setCommittee2] = useState(staffList[6]?.fullName ? `${staffList[6].title}${staffList[6].fullName}` : 'นางสาววิไลวรรณ พรหมมา');
  const [committee3, setCommittee3] = useState(staffList[1]?.fullName ? `${staffList[1].title}${staffList[1].fullName}` : 'นายทัศน์พล เจริญสุข');

  // Set default project on open
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
      if (projects[0].activities.length > 0) {
        setSelectedActivityId(projects[0].activities[0].id);
      }
      setBudgetSource(projects[0].budgetSource);
    }
  }, [projects, isOpen]);

  if (!isOpen) return null;

  const currentProject = projects.find((p) => p.id === selectedProjectId);
  const currentActivity = currentProject?.activities.find((a) => a.id === selectedActivityId);

  const handleTypeSelect = (type: TaskType, label: string) => {
    setTaskType(type);
    setCategoryName(label);
  };

  const handleProjectChange = (projId: string) => {
    setSelectedProjectId(projId);
    const p = projects.find((x) => x.id === projId);
    if (p) {
      setBudgetSource(p.budgetSource);
      if (p.activities.length > 0) {
        setSelectedActivityId(p.activities[0].id);
      } else {
        setSelectedActivityId('');
      }
    }
  };

  const handleFinish = () => {
    const newTask: ProcurementTask = {
      id: `task-${Date.now()}`,
      type: taskType,
      title: title.trim() || `${categoryName} ประจำปีงบประมาณ ${fiscalYear}`,
      categoryName: categoryName,
      dateStr: `1 ต.ค. ${String(fiscalYear).slice(2)}`,
      rawDate: new Date().toISOString().split('T')[0],
      amount: Number(amount) || 0,
      status: 'in_progress',
      statusText: 'กำลังดำเนินการ',
      vendorName: vendorName.trim() || 'ร้านค้าทั่วไปในท้องถิ่น',
      budgetSource: budgetSource,
      poNumber: `${taskType.toUpperCase()}-${Math.floor(Math.random() * 90 + 10)}/${fiscalYear}`,
      committee: [committee1, committee2, committee3].filter(Boolean),
      description: description.trim(),
      projectId: currentProject?.id,
      projectCode: currentProject?.code,
      projectName: currentProject?.name,
      projectOwnerName: currentProject?.ownerStaffName,
      activityId: currentActivity?.id,
      activityCode: currentActivity?.code,
      activityName: currentActivity?.name,
    };

    onSaveTask(newTask);
    onClose();
    // Reset state
    setCurrentStep(1);
    setTitle('');
  };

  const activityRemaining = currentActivity ? currentActivity.allocatedBudget - currentActivity.spentBudget : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-blue-100 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ระบบจัดซื้อจัดจ้างอ้างอิงโครงการและกิจกรรมตามแผนปฏิบัติการ</span>
            </div>
            <h2 className="text-xl font-bold font-['Kanit',sans-serif] mt-0.5">
              สร้างรายการพัสดุใหม่ (ขั้นตอนที่ {currentStep}/5)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-100 w-full">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Select Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  1. เลือกประเภทการจัดซื้อจัดจ้าง
                </h3>
                <p className="text-xs text-slate-500">
                  ระเบียบหรือช่องทางการจัดซื้อจัดจ้างตามพระราชบัญญัติฯ พ.ศ. 2560
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  {
                    type: 'w804' as TaskType,
                    label: 'ว.804 (ไม่เกิน 50,000)',
                    badge: 'ยอดนิยมสำหรับโรงเรียน',
                    desc: 'จัดซื้อวัสดุจำเป็นเร่งด่วน ใช้ใบเสร็จรับเงินเป็นหลักฐาน ไม่ต้องทำใบสั่งซื้อสั่งจ้าง',
                    color: 'border-purple-200 hover:border-purple-500 hover:bg-purple-50/40',
                    activeColor: 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-500/20',
                  },
                  {
                    type: 'purchase' as TaskType,
                    label: 'งานจัดซื้อวัสดุทั่วไป',
                    badge: 'ตาม พ.ร.บ. 2560',
                    desc: 'ซื้อวัสดุการเรียนการสอน วัสดุสำนักงาน สื่อการเรียนรู้ และอุปกรณ์ทั่วไป',
                    color: 'border-blue-200 hover:border-blue-500 hover:bg-blue-50/40',
                    activeColor: 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20',
                  },
                  {
                    type: 'hire' as TaskType,
                    label: 'งานจ้างเหมาบริการ',
                    badge: 'ซ่อมแซม/บริการ',
                    desc: 'จ้างทำป้ายไวนิล จ้างเหมาซ่อมแซมแอร์ พิมพ์เอกสาร จ้างเหมารถทัศนศึกษา',
                    color: 'border-orange-200 hover:border-orange-500 hover:bg-orange-50/40',
                    activeColor: 'border-orange-600 bg-orange-50/70 ring-2 ring-orange-500/20',
                  },
                  {
                    type: 'w119' as TaskType,
                    label: 'ว.119 ค่าใช้จ่ายบริหารงาน',
                    badge: 'ดำเนินงานปกติ',
                    desc: 'ค่าน้ำดื่ม อาหารรับรองคณะกรรมการนิเทศ ค่าใช้จ่ายในการประชุม',
                    color: 'border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/40',
                    activeColor: 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20',
                  },
                  {
                    type: 'construction' as TaskType,
                    label: 'งานก่อสร้าง / ปรับปรุง',
                    badge: 'ซ่อมแซมอาคาร',
                    desc: 'ปรับปรุงอาคารเรียน ทาสี ซ่อมแซมระบบสุขาภิบาล ทางลาดคนพิการ',
                    color: 'border-amber-200 hover:border-amber-500 hover:bg-amber-50/40',
                    activeColor: 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/20',
                  },
                ].map((item) => (
                  <div
                    key={item.type}
                    onClick={() => handleTypeSelect(item.type, item.label)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      taskType === item.type ? item.activeColor : item.color
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800 text-sm">
                        {item.label}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-600 font-medium">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: PROJECT & ACTIVITY REFERENCE (Required by User!) */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-indigo-600" />
                  <span>2. อ้างอิงโครงการและกิจกรรมที่ได้รับอนุมัติ *</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  การจัดซื้อจัดจ้างภาครัฐต้องอ้างอิงว่าจัดซื้อจัดจ้างตามโครงการและกิจกรรมใดในแผนปฏิบัติการ
                </p>
              </div>

              {/* Project Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  เลือกโครงการที่ได้รับอนุมัติ *
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  className="w-full p-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                >
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.code}: {proj.name} (งบจัดสรร {proj.totalBudget.toLocaleString()} บ.)
                    </option>
                  ))}
                  <option value="none">-- รายการดำเนินงานทั่วไปนอกแผนโครงการ --</option>
                </select>
              </div>

              {/* Project Details Banner */}
              {currentProject && (
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-950 font-['Kanit',sans-serif]">
                      {currentProject.name}
                    </span>
                    <span className="font-mono text-indigo-700 font-bold bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                      {currentProject.code}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                      <span>เจ้าของโครงการ: <strong>{currentProject.ownerStaffName}</strong> ({currentProject.ownerPosition})</span>
                    </div>
                    <div>
                      <span>สังกัด: <strong>{currentProject.departmentName}</strong></span>
                    </div>
                    <div>
                      <span>งบโครงการรวม: <strong className="text-slate-900">{currentProject.totalBudget.toLocaleString()} บาท</strong></span>
                    </div>
                    <div>
                      <span>คงเหลือทั้งโครงการ: <strong className="text-emerald-700">{(currentProject.totalBudget - currentProject.spentBudget).toLocaleString()} บาท</strong></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Selection */}
              {currentProject && currentProject.activities.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>เลือกกิจกรรมภายใต้โครงการนี้ *</span>
                  </label>
                  <select
                    value={selectedActivityId}
                    onChange={(e) => setSelectedActivityId(e.target.value)}
                    className="w-full p-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                  >
                    {currentProject.activities.map((act) => (
                      <option key={act.id} value={act.id}>
                        {act.code}: {act.name} (งบกิจกรรม {act.allocatedBudget.toLocaleString()} บ. | ใช้ไป {act.spentBudget.toLocaleString()} บ.)
                      </option>
                    ))}
                  </select>

                  {/* Activity Budget Hint */}
                  {currentActivity && (
                    <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>ผู้รับผิดชอบกิจกรรม: {currentActivity.responsibleStaffName}</span>
                        <span className="text-emerald-700">
                          งบกิจกรรมคงเหลือ: {activityRemaining.toLocaleString()} บาท
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        ช่วงเวลาดำเนินงาน: {currentActivity.period}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Title and Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  3. ชื่อรายการและรายละเอียดสิ่งของที่จะจัดซื้อจัดจ้าง
                </h3>
                <p className="text-xs text-slate-500">
                  ระบุชื่อรายการและเหตุผลความจำเป็นสำหรับออกบันทึกข้อความราชการ
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อโครงการ / รายการจัดซื้อจัดจ้าง *
                </label>
                <input
                  type="text"
                  placeholder="เช่น ซื้อวัสดุอุปกรณ์วิทยาศาสตร์สำหรับการทดลองเรื่องการสังเคราะห์ด้วยแสง"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  เหตุผลและความจำเป็น / รายละเอียดสิ่งของ
                </label>
                <textarea
                  rows={3}
                  placeholder="ระบุสิ่งของ จำนวน หรือเหตุผลความจำเป็น เช่น เพื่อให้นักเรียนชั้น ป.4-6 ได้ลงมือปฏิบัติจริง..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  หมวดหมู่ย่อแสดงในหน้าแรก
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Budget and Vendor */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  4. วงเงินงบประมาณ และร้านค้าผู้เสนอราคา
                </h3>
                <p className="text-xs text-slate-500">
                  ตรวจสอบวงเงินให้สอดคล้องกับงบกิจกรรมที่ได้รับจัดสรร
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    วงเงินงบประมาณ (บาท) *
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  {currentActivity && amount > activityRemaining && (
                    <p className="text-[11px] text-amber-600 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      วงเงินเกินกว่างบกิจกรรมคงเหลือ ({activityRemaining.toLocaleString()} บ.)
                    </p>
                  )}
                  {taskType === 'w804' && amount > 50000 && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">
                      * หมายเหตุ: ระเบียบ ว.804 ใช้ได้กับวงเงินไม่เกิน 50,000 บาท
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    แหล่งเงินงบประมาณ
                  </label>
                  <select
                    value={budgetSource}
                    onChange={(e) => setBudgetSource(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="เงินอุดหนุนรายหัว (ค่าจัดการเรียนการสอน)">
                      เงินอุดหนุนรายหัว (ค่าจัดการเรียนการสอน)
                    </option>
                    <option value="เงินเรียนฟรี 15 ปี (หมวดหนังสือเรียน)">
                      เงินเรียนฟรี 15 ปี (หมวดหนังสือเรียน)
                    </option>
                    <option value="เงินเรียนฟรี 15 ปี (หมวดอุปกรณ์การเรียน)">
                      เงินเรียนฟรี 15 ปี (หมวดอุปกรณ์การเรียน)
                    </option>
                    <option value="เงินรายได้สถานศึกษา">เงินรายได้สถานศึกษา</option>
                    <option value="เงินอุดหนุนกิจกรรมพัฒนาคุณภาพผู้เรียน">
                      เงินอุดหนุนกิจกรรมพัฒนาคุณภาพผู้เรียน
                    </option>
                    <option value="เงินโครงการอาหารกลางวัน">เงินโครงการอาหารกลางวัน</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ร้านค้า / ผู้ขาย / ผู้รับจ้าง
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="เช่น ร้านเจริญภัณฑ์พาณิชย์ หรือ ห้างหุ้นส่วนจำกัด บุรีรัมย์การค้า"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Committee & Summary Confirmation */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  5. แต่งตั้งคณะกรรมการตรวจรับพัสดุ
                </h3>
                <p className="text-xs text-slate-500">
                  เลือกจากบุคลากรครูในสถานศึกษาตามระเบียบกระทรวงการคลัง
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    ประธานกรรมการตรวจรับพัสดุ
                  </label>
                  <select
                    value={committee1}
                    onChange={(e) => setCommittee1(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    {staffList.map((s) => (
                      <option key={s.id} value={`${s.title}${s.fullName}`}>
                        {s.title}{s.fullName} ({s.position})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    กรรมการตรวจรับพัสดุ
                  </label>
                  <select
                    value={committee2}
                    onChange={(e) => setCommittee2(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    {staffList.map((s) => (
                      <option key={s.id} value={`${s.title}${s.fullName}`}>
                        {s.title}{s.fullName} ({s.position})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    กรรมการและเลขานุการ
                  </label>
                  <select
                    value={committee3}
                    onChange={(e) => setCommittee3(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    {staffList.map((s) => (
                      <option key={s.id} value={`${s.title}${s.fullName}`}>
                        {s.title}{s.fullName} ({s.position})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Review Box With Explicit Project & Activity References! */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5 text-blue-700 border-b pb-2">
                  <FileCheck className="w-4 h-4" />
                  <span>สรุปรายการจัดซื้อจัดจ้างพร้อมการอ้างอิงโครงการ</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400">โครงการที่อ้างอิง:</span>
                    <div className="font-semibold text-indigo-900">
                      {currentProject ? `${currentProject.code} ${currentProject.name}` : 'ทั่วไป'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">เจ้าของโครงการ:</span>
                    <div className="font-semibold text-slate-900">
                      {currentProject?.ownerStaffName || '-'}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400">กิจกรรมที่อ้างอิง:</span>
                    <div className="font-semibold text-indigo-900">
                      {currentActivity ? `${currentActivity.code} ${currentActivity.name}` : '-'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">ผู้รับผิดชอบกิจกรรม:</span>
                    <div className="font-semibold text-slate-900">
                      {currentActivity?.responsibleStaffName || '-'}
                    </div>
                  </div>

                  <div className="col-span-2 pt-1 border-t border-slate-200">
                    <span className="text-slate-400">รายการ:</span>{' '}
                    <span className="font-bold text-slate-900">{title || 'ไม่ได้ระบุชื่อ'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">วงเงิน:</span>{' '}
                    <span className="font-bold text-emerald-700 font-['Kanit',sans-serif] text-sm">
                      {amount.toLocaleString()} บาท
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">ร้านค้า:</span>{' '}
                    <span className="font-medium text-slate-900">{vendorName || 'ร้านค้าทั่วไป'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ย้อนกลับ</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="inline-flex items-center gap-1 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>ถัดไป</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="inline-flex items-center gap-1.5 px-6 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>บันทึกและสร้างเอกสารราชการทันที</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
