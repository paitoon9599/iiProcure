import React, { useState, useEffect } from 'react';
import { X, Check, Building, DollarSign, FolderKanban, Layers, User, Trash2 } from 'lucide-react';
import { ProcurementTask, TaskType, ApprovedProject, StaffPersonnel } from '../types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: ProcurementTask | null; // null = Add, non-null = Edit
  onSave: (task: ProcurementTask) => void;
  onDelete?: (taskId: string) => void;
  fiscalYear: number;
  projects?: ApprovedProject[];
  staffList?: StaffPersonnel[];
  defaultType?: TaskType;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  task,
  onSave,
  onDelete,
  fiscalYear,
  projects = [],
  staffList = [],
  defaultType = 'purchase',
}) => {
  const [taskType, setTaskType] = useState<TaskType>(defaultType);
  const [categoryName, setCategoryName] = useState('งานซื้อ');
  const [poNumber, setPoNumber] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [budgetSource, setBudgetSource] = useState('เงินอุดหนุนรายหัว (ค่าจัดการเรียนการสอน)');
  const [vendorName, setVendorName] = useState('');
  const [dateStr, setDateStr] = useState('1 ต.ค. 69');
  const [status, setStatus] = useState<ProcurementTask['status']>('in_progress');
  const [statusText, setStatusText] = useState('กำลังดำเนินการ');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  const [committee1, setCommittee1] = useState(staffList[4]?.fullName ? `${staffList[4].title}${staffList[4].fullName}` : 'นายสมศักดิ์ มุ่งมั่น');
  const [committee2, setCommittee2] = useState(staffList[6]?.fullName ? `${staffList[6].title}${staffList[6].fullName}` : 'นางสาววิไลวรรณ พรหมมา');
  const [committee3, setCommittee3] = useState(staffList[1]?.fullName ? `${staffList[1].title}${staffList[1].fullName}` : 'นายทัศน์พล เจริญสุข');

  useEffect(() => {
    if (task) {
      setTaskType(task.type);
      setCategoryName(task.categoryName);
      setPoNumber(task.poNumber);
      setTitle(task.title);
      setDescription(task.description || '');
      setAmount(task.amount);
      setBudgetSource(task.budgetSource);
      setVendorName(task.vendorName);
      setDateStr(task.dateStr);
      setStatus(task.status);
      setStatusText(task.statusText);
      setSelectedProjectId(task.projectId || '');
      setSelectedActivityId(task.activityId || '');
      setCommittee1(task.committee[0] || '');
      setCommittee2(task.committee[1] || '');
      setCommittee3(task.committee[2] || '');
    } else {
      setTaskType(defaultType);
      const catMap: Record<TaskType, string> = {
        purchase: 'งานซื้อ',
        hire: 'งานจ้าง',
        construction: 'ก่อสร้าง',
        w804: 'ว.804',
        w119: 'ว.119',
      };
      setCategoryName(catMap[defaultType] || 'งานซื้อ');
      setPoNumber(`${defaultType.toUpperCase()}-${Math.floor(Math.random() * 90 + 10)}/${fiscalYear}`);
      setTitle('');
      setDescription('');
      setAmount(3500);
      setVendorName('');
      setDateStr(`1 ต.ค. ${String(fiscalYear).slice(2)}`);
      setStatus('in_progress');
      setStatusText('กำลังดำเนินการ');
      if (projects.length > 0) {
        setSelectedProjectId(projects[0].id);
        setSelectedActivityId(projects[0].activities[0]?.id || '');
        setBudgetSource(projects[0].budgetSource);
      }
    }
  }, [task, isOpen, defaultType, fiscalYear, projects]);

  if (!isOpen) return null;

  const currentProject = projects.find((p) => p.id === selectedProjectId);

  const handleProjectSelect = (pId: string) => {
    setSelectedProjectId(pId);
    const p = projects.find((x) => x.id === pId);
    if (p) {
      setBudgetSource(p.budgetSource);
      if (p.activities.length > 0) {
        setSelectedActivityId(p.activities[0].id);
      } else {
        setSelectedActivityId('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedProject = projects.find((p) => p.id === selectedProjectId);
    const matchedActivity = matchedProject?.activities.find((a) => a.id === selectedActivityId);

    const savedTask: ProcurementTask = {
      id: task ? task.id : `task-${Date.now()}`,
      type: taskType,
      title: title.trim(),
      categoryName,
      dateStr,
      rawDate: task ? task.rawDate : new Date().toISOString().split('T')[0],
      amount: Number(amount) || 0,
      status,
      statusText: status === 'completed' ? 'เสร็จแล้ว' : statusText || 'กำลังดำเนินการ',
      vendorName: vendorName.trim() || 'ร้านค้าทั่วไป',
      budgetSource,
      poNumber: poNumber.trim() || `${taskType.toUpperCase()}-${Math.floor(Math.random() * 90 + 10)}/${fiscalYear}`,
      committee: [committee1, committee2, committee3].filter(Boolean),
      description: description.trim(),
      projectId: matchedProject?.id,
      projectCode: matchedProject?.code,
      projectName: matchedProject?.name,
      projectOwnerName: matchedProject?.ownerStaffName,
      activityId: matchedActivity?.id,
      activityCode: matchedActivity?.code,
      activityName: matchedActivity?.name,
      items: task?.items,
    };

    onSave(savedTask);
    onClose();
  };

  const handleDelete = () => {
    if (!task || !onDelete) return;
    if (confirm(`คุณต้องการลบรายการ "${task.title}" หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`)) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-['Kanit',sans-serif]">
              {task ? 'แก้ไขรายการจัดซื้อจัดจ้าง' : 'เพิ่มรายการจัดซื้อจัดจ้างใหม่'}
            </h3>
            <p className="text-xs text-slate-400">
              {task ? `เลขที่ ${task.poNumber}` : 'บันทึกข้อมูลและอ้างอิงโครงการตามระเบียบ'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ประเภทงาน *</label>
              <select
                value={taskType}
                onChange={(e) => {
                  const t = e.target.value as TaskType;
                  setTaskType(t);
                  const catMap: Record<TaskType, string> = {
                    purchase: 'งานซื้อ',
                    hire: 'งานจ้าง',
                    construction: 'ก่อสร้าง',
                    w804: 'ว.804',
                    w119: 'ว.119',
                  };
                  setCategoryName(catMap[t] || 'งานซื้อ');
                }}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="purchase">งานจัดซื้อวัสดุทั่วไป</option>
                <option value="hire">งานจ้างเหมาบริการ</option>
                <option value="construction">งานก่อสร้าง/ปรับปรุง</option>
                <option value="w804">ว.804 (ไม่เกิน 50,000)</option>
                <option value="w119">ว.119 ค่าใช้จ่ายบริหารงาน</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">เลขที่อ้างอิง / ใบสั่ง *</label>
              <input
                type="text"
                required
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">วันที่เอกสาร</label>
              <input
                type="text"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Project and Activity Reference */}
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2.5">
            <div className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
              <FolderKanban className="w-4 h-4 text-indigo-600" />
              <span>อ้างอิงโครงการและกิจกรรมตามแผนปฏิบัติการประจำปี *</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  โครงการที่ได้รับอนุมัติ
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => handleProjectSelect(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- ไม่ระบุโครงการ (ดำเนินงานทั่วไป) --</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.code}: {proj.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>กิจกรรมภายใต้โครงการ</span>
                </label>
                <select
                  value={selectedActivityId}
                  onChange={(e) => setSelectedActivityId(e.target.value)}
                  disabled={!currentProject || currentProject.activities.length === 0}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100"
                >
                  <option value="">-- เลือกกิจกรรมย่อย --</option>
                  {currentProject?.activities.map((act) => (
                    <option key={act.id} value={act.id}>
                      {act.code}: {act.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {currentProject && (
              <div className="text-[11px] text-slate-600 flex items-center justify-between">
                <span>เจ้าของโครงการ: <strong>{currentProject.ownerStaffName}</strong> ({currentProject.ownerPosition})</span>
                <span className="text-emerald-700 font-semibold">
                  งบคงเหลือ: {(currentProject.totalBudget - currentProject.spentBudget).toLocaleString()} บ.
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ชื่อรายการจัดซื้อจัดจ้าง *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ระบุชื่อรายการที่จะซื้อหรือจ้าง"
              className="w-full p-2.5 text-sm border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">วงเงิน (บาท) *</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 p-2 border border-slate-300 rounded-lg font-bold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ร้านค้า / ผู้รับจ้าง *</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="ชื่อร้านค้า"
                  className="w-full pl-8 p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">สถานะโครงการ</label>
              <select
                value={status}
                onChange={(e) => {
                  const s = e.target.value as ProcurementTask['status'];
                  setStatus(s);
                  setStatusText(s === 'completed' ? 'เสร็จแล้ว' : 'กำลังดำเนินการ');
                }}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                <option value="in_progress">⏳ กำลังดำเนินการ</option>
                <option value="completed">✓ เสร็จสิ้น (เบิกจ่ายแล้ว)</option>
                <option value="inspecting">📝 รอตรวจรับ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">แหล่งเงินงบประมาณ</label>
            <select
              value={budgetSource}
              onChange={(e) => setBudgetSource(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="เงินอุดหนุนรายหัว (ค่าจัดการเรียนการสอน)">เงินอุดหนุนรายหัว (ค่าจัดการเรียนการสอน)</option>
              <option value="เงินเรียนฟรี 15 ปี (หมวดหนังสือเรียน)">เงินเรียนฟรี 15 ปี (หมวดหนังสือเรียน)</option>
              <option value="เงินเรียนฟรี 15 ปี (หมวดอุปกรณ์การเรียน)">เงินเรียนฟรี 15 ปี (หมวดอุปกรณ์การเรียน)</option>
              <option value="เงินรายได้สถานศึกษา">เงินรายได้สถานศึกษา</option>
              <option value="เงินอุดหนุนกิจกรรมพัฒนาคุณภาพผู้เรียน">เงินอุดหนุนกิจกรรมพัฒนาคุณภาพผู้เรียน</option>
              <option value="เงินโครงการอาหารกลางวัน">เงินโครงการอาหารกลางวัน</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">รายละเอียด / เหตุผลความจำเป็น</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุรายละเอียดเพื่อใช้ในการออกบันทึกข้อความ"
              className="w-full p-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="pt-2 border-t border-slate-200">
            <label className="block font-semibold text-slate-700 mb-1">
              คณะกรรมการตรวจรับพัสดุ (3 ท่าน)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={committee1}
                onChange={(e) => setCommittee1(e.target.value)}
                placeholder="ประธานกรรมการ"
                className="w-full p-1.5 border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                value={committee2}
                onChange={(e) => setCommittee2(e.target.value)}
                placeholder="กรรมการ"
                className="w-full p-1.5 border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                value={committee3}
                onChange={(e) => setCommittee3(e.target.value)}
                placeholder="กรรมการ/เลขานุการ"
                className="w-full p-1.5 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            {task && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>ลบรายการนี้</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{task ? 'บันทึกการแก้ไข' : 'บันทึกรายการ'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
