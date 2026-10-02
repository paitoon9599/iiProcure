import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Printer,
  Search,
  User,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Calendar,
  Layers,
  FileText,
  Building,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { ApprovedProject, ProjectActivity, StaffPersonnel, Department, ProcurementTask, SchoolProfile } from '../../types';

interface ProjectsModuleProps {
  projects: ApprovedProject[];
  staffList: StaffPersonnel[];
  departments: Department[];
  tasks?: ProcurementTask[];
  onAddProject: (project: ApprovedProject) => void;
  onUpdateProject?: (project: ApprovedProject) => void;
  onDeleteProject?: (projectId: string) => void;
  onAddActivity: (projectId: string, activity: ProjectActivity) => void;
  onUpdateActivity?: (projectId: string, activity: ProjectActivity) => void;
  onDeleteActivity?: (projectId: string, activityId: string) => void;
  onUpdateActivityStatus: (projectId: string, activityId: string, status: ProjectActivity['status']) => void;
  fiscalYear: number;
  schoolProfile?: SchoolProfile;
}

export const ProjectsModule: React.FC<ProjectsModuleProps> = ({
  projects,
  staffList,
  departments,
  tasks = [],
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onUpdateActivityStatus,
  fiscalYear,
  schoolProfile,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [targetProjectIdForActivity, setTargetProjectIdForActivity] = useState<string | null>(null);

  // New Project Form
  const [projCode, setProjCode] = useState('');
  const [projName, setProjName] = useState('');
  const [strategicIssue, setStrategicIssue] = useState('ยุทธศาสตร์ที่ 1: พัฒนาคุณภาพและมาตรฐานการศึกษา');
  const [deptId, setDeptId] = useState(departments[0]?.id || 'dept-1');
  const [ownerStaffId, setOwnerStaffId] = useState(staffList[0]?.id || 'staff-1');
  const [budgetSource, setBudgetSource] = useState('เงินอุดหนุนรายหัว (ค่าจัดการเรียนการสอน)');
  const [totalBudget, setTotalBudget] = useState<number>(50000);

  // New Activity Form
  const [actCode, setActCode] = useState('');
  const [actName, setActName] = useState('');
  const [actRespStaff, setActRespStaff] = useState(staffList[0]?.fullName || '');
  const [actRespPos, setActRespPos] = useState(staffList[0]?.position || '');
  const [actBudget, setActBudget] = useState<number>(15000);
  const [actPeriod, setActPeriod] = useState('ต.ค. 68 - มี.ค. 69');
  const [actDesc, setActDesc] = useState('');

  const [editingProject, setEditingProject] = useState<ApprovedProject | null>(null);
  const [editingActivity, setEditingActivity] = useState<{ projectId: string; activity: ProjectActivity } | null>(null);

  const handleSaveEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.name.trim() || !onUpdateProject) return;
    onUpdateProject(editingProject);
    setEditingProject(null);
  };

  const handleDeleteProject = (proj: ApprovedProject) => {
    if (!onDeleteProject) return;
    if (confirm(`คุณต้องการลบโครงการ "${proj.name}" (${proj.code}) พร้อมกิจกรรมทั้งหมดหรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`)) {
      onDeleteProject(proj.id);
    }
  };

  const handleSaveEditActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity || !editingActivity.activity.name.trim() || !onUpdateActivity) return;
    onUpdateActivity(editingActivity.projectId, editingActivity.activity);
    setEditingActivity(null);
  };

  const handleDeleteActivity = (projectId: string, act: ProjectActivity) => {
    if (!onDeleteActivity) return;
    if (confirm(`คุณต้องการลบกิจกรรม "${act.name}" (${act.code}) หรือไม่?`)) {
      onDeleteActivity(projectId, act.id);
    }
  };

  const filtered = projects.filter((p) => {
    if (selectedDept !== 'all' && p.departmentId !== selectedDept) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.ownerStaffName.toLowerCase().includes(q) ||
        p.activities.some((a) => a.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalAllProjectsBudget = filtered.reduce((s, p) => s + p.totalBudget, 0);
  const totalAllProjectsSpent = filtered.reduce((s, p) => s + p.spentBudget, 0);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;

    const deptObj = departments.find((d) => d.id === deptId);
    const staffObj = staffList.find((s) => s.id === ownerStaffId);

    const newProject: ApprovedProject = {
      id: `proj-${Date.now()}`,
      code: projCode.trim() || `โครงการที่ 0${projects.length + 1}/${fiscalYear}`,
      name: projName.trim(),
      strategicIssue,
      fiscalYear,
      departmentId: deptId,
      departmentName: deptObj?.name || 'กลุ่มบริหารงานวิชาการ',
      ownerStaffId,
      ownerStaffName: staffObj ? `${staffObj.title}${staffObj.fullName}` : 'ไม่ระบุ',
      ownerPosition: staffObj?.position || 'ครู',
      budgetSource,
      totalBudget: Number(totalBudget) || 0,
      spentBudget: 0,
      status: 'approved',
      approvalDate: `1 ต.ค. ${fiscalYear - 1}`,
      objectives: ['เพื่อพัฒนาศักยภาพผู้เรียนและสถานศึกษาตามแผนปฏิบัติการประจำปี'],
      activities: [],
    };

    onAddProject(newProject);
    setIsAddProjectOpen(false);
    setProjName('');
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProjectIdForActivity || !actName.trim()) return;

    const targetProject = projects.find((p) => p.id === targetProjectIdForActivity);
    const actCount = (targetProject?.activities?.length || 0) + 1;

    const newActivity: ProjectActivity = {
      id: `act-${Date.now()}`,
      code: actCode.trim() || `กิจกรรมที่ ${actCount}`,
      name: actName.trim(),
      responsibleStaffName: actRespStaff,
      responsiblePosition: actRespPos,
      allocatedBudget: Number(actBudget) || 0,
      spentBudget: 0,
      status: 'pending',
      period: actPeriod,
      description: actDesc.trim(),
    };

    onAddActivity(targetProjectIdForActivity, newActivity);
    setIsAddActivityOpen(false);
    setActName('');
    setActDesc('');
  };

  const openAddActivityFor = (projId: string) => {
    setTargetProjectIdForActivity(projId);
    const proj = projects.find((p) => p.id === projId);
    if (proj) {
      setActRespStaff(proj.ownerStaffName);
      setActRespPos(proj.ownerPosition);
    }
    setIsAddActivityOpen(true);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                  โครงการที่ได้รับอนุมัติและกิจกรรมประจำปี {fiscalYear}
                </h2>
                {schoolProfile && (
                  <span className="hidden sm:inline-block text-[11px] font-semibold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                    {schoolProfile.schoolName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                แผนปฏิบัติการประจำปีสถานศึกษา ติดตามเจ้าของโครงการ วงเงินจัดสรร และกิจกรรมย่อย • {schoolProfile?.schoolName || 'โรงเรียนบ้านนิคมสายโท 12 เหนือ'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์แผนโครงการ</span>
          </button>
          <button
            onClick={() => setIsAddProjectOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ เพิ่มโครงการที่ได้รับอนุมัติ</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">โครงการทั้งหมด</div>
          <div className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif] mt-0.5">
            {filtered.length} <span className="text-xs font-normal text-slate-500">โครงการ</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">งบประมาณโครงการรวม</div>
          <div className="text-2xl font-bold text-indigo-700 font-['Kanit',sans-serif] mt-0.5">
            {totalAllProjectsBudget.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-500">บาท</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">เบิกจ่ายไปแล้ว</div>
          <div className="text-2xl font-bold text-emerald-700 font-['Kanit',sans-serif] mt-0.5">
            {totalAllProjectsSpent.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-500">บาท</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">งบประมาณคงเหลือรวม</div>
          <div className="text-2xl font-bold text-slate-800 font-['Kanit',sans-serif] mt-0.5">
            {(totalAllProjectsBudget - totalAllProjectsSpent).toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-500">บาท</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อโครงการ, เจ้าของโครงการ, กิจกรรม..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 text-xs w-full md:w-auto">
          <span className="text-slate-400">กลุ่มงาน/ฝ่าย:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium"
          >
            <option value="all">ทุกกลุ่มงาน/ฝ่าย</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects List with Expandable Activities */}
      <div className="space-y-4">
        {filtered.map((project) => {
          const isExpanded = expandedProjectId === project.id;
          const spentPct = Math.round((project.spentBudget / (project.totalBudget || 1)) * 100);
          const remaining = project.totalBudget - project.spentBudget;

          return (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
            >
              {/* Project Card Header */}
              <div
                onClick={() => setExpandedProjectId(isExpanded ? null : project.id)}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 font-bold border border-indigo-100">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        {project.code}
                      </span>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {project.departmentName}
                      </span>
                      <span className="text-xs text-slate-400">• อนุมัติเมื่อ {project.approvalDate}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 font-['Kanit',sans-serif] mt-1">
                      {project.name}
                    </h3>

                    {/* Owner Highlight */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                      <span className="text-slate-400">เจ้าของโครงการ:</span>
                      <strong className="text-slate-900 font-semibold flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200/60">
                        <User className="w-3 h-3 text-amber-600" />
                        {project.ownerStaffName} ({project.ownerPosition})
                      </strong>
                      <span className="text-slate-400 hidden sm:inline">• แหล่งเงิน: {project.budgetSource}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Budget metrics and toggle */}
                <div className="flex items-center gap-4 shrink-0 self-end lg:self-center">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">งบประมาณจัดสรร</div>
                    <div className="text-lg font-extrabold text-slate-900 font-['Kanit',sans-serif]">
                      {project.totalBudget.toLocaleString()} <span className="text-xs font-normal text-slate-500">บาท</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      ใช้ไปแล้ว {project.spentBudget.toLocaleString()} บาท ({spentPct}%)
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {onUpdateProject && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProject(project);
                        }}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                        title="แก้ไขโครงการ"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {onDeleteProject && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project);
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="ลบโครงการ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-500">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
                <div
                  className={`h-full ${spentPct > 90 ? 'bg-amber-500' : 'bg-indigo-600'} transition-all`}
                  style={{ width: `${Math.min(100, spentPct)}%` }}
                />
              </div>

              {/* Expanded Activity Drawer */}
              {isExpanded && (
                <div className="p-5 bg-slate-50/70 border-t border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 font-['Kanit',sans-serif] flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-indigo-600" />
                        <span>กิจกรรมภายใต้โครงการ ({project.activities.length} กิจกรรม)</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        {project.strategicIssue} • งบคงเหลือ {remaining.toLocaleString()} บาท
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddActivityFor(project.id);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ เพิ่มกิจกรรมย่อย</span>
                    </button>
                  </div>

                  {/* Activities Table */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3 w-28">รหัสกิจกรรม</th>
                          <th className="p-3">ชื่อกิจกรรมและรายละเอียด</th>
                          <th className="p-3">ผู้รับผิดชอบกิจกรรม</th>
                          <th className="p-3">ช่วงเวลาดำเนินงาน</th>
                          <th className="p-3 text-right">งบจัดสรร (บาท)</th>
                          <th className="p-3 text-right">ใช้จ่ายจริง</th>
                          <th className="p-3 text-center">สถานะ</th>
                          <th className="p-3 text-center">ปรับสถานะ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {project.activities.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-6 text-center text-slate-400">
                              ยังไม่มีกิจกรรมย่อยภายใต้โครงการนี้ กดปุ่ม "+ เพิ่มกิจกรรมย่อย" เพื่อเริ่มบันทึก
                            </td>
                          </tr>
                        ) : (
                          project.activities.map((act) => (
                            <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 font-mono font-bold text-indigo-700 whitespace-nowrap">
                                {act.code}
                              </td>
                              <td className="p-3 max-w-xs">
                                <div className="font-semibold text-slate-900">{act.name}</div>
                                {act.description && (
                                  <div className="text-[11px] text-slate-400 mt-0.5">{act.description}</div>
                                )}
                                {(() => {
                                  const linked = tasks.filter((t) => t.activityId === act.id);
                                  if (linked.length === 0) return null;
                                  return (
                                    <div className="mt-2 p-2 bg-indigo-50/80 rounded-lg border border-indigo-100/80 space-y-1">
                                      <div className="text-[10px] font-bold text-indigo-900 flex items-center gap-1">
                                        <FileText className="w-3 h-3 text-indigo-600" />
                                        <span>รายการจัดซื้อจัดจ้างที่อ้างอิงกิจกรรมนี้ ({linked.length} รายการ):</span>
                                      </div>
                                      {linked.map((lt) => (
                                        <div key={lt.id} className="text-[10px] bg-white p-1 rounded border border-indigo-100 flex items-center justify-between gap-1">
                                          <span className="font-mono text-indigo-700 font-bold">{lt.poNumber}</span>
                                          <span className="truncate max-w-[140px] text-slate-700">{lt.title}</span>
                                          <span className="font-bold text-slate-900 shrink-0 font-['Kanit',sans-serif]">{lt.amount.toLocaleString()} บ.</span>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                })()}
                              </td>
                              <td className="p-3 whitespace-nowrap font-medium text-slate-800">
                                <div>{act.responsibleStaffName}</div>
                                <div className="text-[11px] text-slate-400">{act.responsiblePosition}</div>
                              </td>
                              <td className="p-3 whitespace-nowrap text-slate-600">{act.period}</td>
                              <td className="p-3 text-right font-bold text-slate-900 font-['Kanit',sans-serif] whitespace-nowrap">
                                {act.allocatedBudget.toLocaleString()}
                              </td>
                              <td className="p-3 text-right font-bold text-emerald-700 font-['Kanit',sans-serif] whitespace-nowrap">
                                {act.spentBudget.toLocaleString()}
                              </td>
                              <td className="p-3 text-center whitespace-nowrap">
                                {act.status === 'completed' && (
                                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> เสร็จสิ้น
                                  </span>
                                )}
                                {act.status === 'in_progress' && (
                                  <span className="text-[11px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> ดำเนินการ
                                  </span>
                                )}
                                {act.status === 'pending' && (
                                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                                    รอดำเนินการ
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">
                                  <select
                                    value={act.status}
                                    onChange={(e) =>
                                      onUpdateActivityStatus(
                                        project.id,
                                        act.id,
                                        e.target.value as ProjectActivity['status']
                                      )
                                    }
                                    className="text-xs bg-slate-50 border border-slate-200 rounded-md p-1 cursor-pointer"
                                  >
                                    <option value="pending">รอดำเนินการ</option>
                                    <option value="in_progress">กำลังดำเนินการ</option>
                                    <option value="completed">เสร็จสิ้น</option>
                                  </select>
                                  {onUpdateActivity && (
                                    <button
                                      type="button"
                                      onClick={() => setEditingActivity({ projectId: project.id, activity: { ...act } })}
                                      className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                                      title="แก้ไขกิจกรรม"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {onDeleteActivity && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteActivity(project.id, act)}
                                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                      title="ลบกิจกรรม"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Project Modal */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-['Kanit',sans-serif]">
              เพิ่มโครงการที่ได้รับอนุมัติในแผนปฏิบัติการ
            </h3>
            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1">รหัสโครงการ</label>
                  <input
                    type="text"
                    value={projCode}
                    onChange={(e) => setProjCode(e.target.value)}
                    placeholder="โครงการที่ 06/2569"
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold mb-1">ชื่อโครงการ *</label>
                  <input
                    type="text"
                    required
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    placeholder="เช่น โครงการส่งเสริมประชาธิปไตยในโรงเรียน"
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">ประเด็นยุทธศาสตร์ / กลยุทธ์</label>
                <input
                  type="text"
                  value={strategicIssue}
                  onChange={(e) => setStrategicIssue(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">กลุ่มงาน / ฝ่ายรับผิดชอบ</label>
                  <select
                    value={deptId}
                    onChange={(e) => setDeptId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">เจ้าของโครงการ (ผู้รับผิดชอบหลัก) *</label>
                  <select
                    value={ownerStaffId}
                    onChange={(e) => setOwnerStaffId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  >
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}{s.fullName} ({s.position})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">วงเงินงบประมาณรวม (บาท) *</label>
                  <input
                    type="number"
                    required
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">แหล่งเงินงบประมาณ</label>
                  <select
                    value={budgetSource}
                    onChange={(e) => setBudgetSource(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="เงินอุดหนุนรายหัว (ค่าจัดการเรียนการสอน)">เงินอุดหนุนรายหัว</option>
                    <option value="เงินเรียนฟรี 15 ปี (หมวดหนังสือเรียน)">เงินเรียนฟรี 15 ปี</option>
                    <option value="เงินรายได้สถานศึกษา">เงินรายได้สถานศึกษา</option>
                    <option value="เงินอุดหนุนกิจกรรมพัฒนาคุณภาพผู้เรียน">เงินกิจกรรมพัฒนาผู้เรียน</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProjectOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  บันทึกโครงการ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {isAddActivityOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-['Kanit',sans-serif]">
              เพิ่มกิจกรรมย่อยในโครงการ
            </h3>
            <form onSubmit={handleCreateActivity} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1">รหัสกิจกรรม</label>
                  <input
                    type="text"
                    value={actCode}
                    onChange={(e) => setActCode(e.target.value)}
                    placeholder="กิจกรรมที่ 1.4"
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold mb-1">ชื่อกิจกรรม *</label>
                  <input
                    type="text"
                    required
                    value={actName}
                    onChange={(e) => setActName(e.target.value)}
                    placeholder="เช่น จัดซื้อสื่อการสอนภาษาไทย"
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">ผู้รับผิดชอบกิจกรรม</label>
                  <input
                    type="text"
                    value={actRespStaff}
                    onChange={(e) => setActRespStaff(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ตำแหน่ง</label>
                  <input
                    type="text"
                    value={actRespPos}
                    onChange={(e) => setActRespPos(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">งบประมาณจัดสรร (บาท) *</label>
                  <input
                    type="number"
                    required
                    value={actBudget}
                    onChange={(e) => setActBudget(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ช่วงเวลาดำเนินงาน</label>
                  <input
                    type="text"
                    value={actPeriod}
                    onChange={(e) => setActPeriod(e.target.value)}
                    placeholder="ต.ค. 68 - มี.ค. 69"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">รายละเอียดกิจกรรม / สิ่งของที่ต้องจัดหา</label>
                <textarea
                  rows={2}
                  value={actDesc}
                  onChange={(e) => setActDesc(e.target.value)}
                  placeholder="ระบุรายละเอียดการปฏิบัติงาน"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddActivityOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  บันทึกกิจกรรม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
