import React, { useState } from 'react';
import {
  ShoppingCart,
  Wrench,
  Building2,
  FileText,
  FileSpreadsheet,
  Receipt,
  Layers,
  DownloadCloud,
  CreditCard,
  Megaphone,
  ArrowRight,
  Plus,
  SlidersHorizontal,
  ChevronRight,
  CheckCircle2,
  Clock,
  Search,
  Edit2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { ModuleId, ProcurementTask, TaskType, SchoolProfile, StaffPersonnel, ROLE_DEFINITIONS } from '../types';

interface HomeDashboardProps {
  tasks: ProcurementTask[];
  onSelectModule: (module: ModuleId) => void;
  onOpenWizard: () => void;
  onOpenAlerts: () => void;
  onSelectTask: (task: ProcurementTask) => void;
  fiscalYear: number;
  schoolProfile?: SchoolProfile;
  currentUser?: StaffPersonnel | null;
  onOpenLogin?: () => void;
  onEditTask?: (task: ProcurementTask) => void;
  onDeleteTask?: (taskId: string) => void;
  onAddNewTask?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  tasks,
  onSelectModule,
  onOpenWizard,
  onOpenAlerts,
  onSelectTask,
  fiscalYear,
  schoolProfile,
  currentUser,
  onOpenLogin,
  onEditTask,
  onDeleteTask,
  onAddNewTask,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | TaskType>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering tasks
  const filteredTasks = tasks
    .filter((task) => {
      if (activeFilter !== 'all' && task.type !== activeFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.vendorName.toLowerCase().includes(query) ||
          task.categoryName.toLowerCase().includes(query) ||
          task.poNumber.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'desc') {
        return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
      }
      return new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime();
    });

  // Calculate statistics
  const totalAmountDisbursed = tasks
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  // Quick menu configuration matching screenshot colors and icons
  const quickMenu = [
    {
      id: 'purchase' as ModuleId,
      name: 'งานซื้อ',
      icon: ShoppingCart,
      bgColor: 'bg-[#1877f2]', // Bright Blue
    },
    {
      id: 'hire' as ModuleId,
      name: 'งานจ้าง',
      icon: Wrench,
      bgColor: 'bg-[#f97316]', // Orange
    },
    {
      id: 'construction' as ModuleId,
      name: 'งานก่อสร้าง',
      icon: Building2,
      bgColor: 'bg-[#8d5b4c]', // Brown/Copper
    },
    {
      id: 'requisition' as ModuleId,
      name: 'ใบเบิก',
      icon: FileText,
      bgColor: 'bg-[#0284c7]', // Teal/Cyan
    },
    {
      id: 'w804' as ModuleId,
      name: 'ว.804',
      icon: FileSpreadsheet,
      bgColor: 'bg-[#a855f7]', // Purple
    },
    {
      id: 'w119' as ModuleId,
      name: 'ว.119',
      icon: Receipt,
      bgColor: 'bg-[#4f46e5]', // Indigo
    },
    {
      id: 'inventory_ledger' as ModuleId,
      name: 'บัญชีวัสดุ',
      icon: Layers,
      bgColor: 'bg-[#10b981]', // Emerald
    },
    {
      id: 'backup_restore' as ModuleId,
      name: 'สำรองข้อมูล',
      icon: DownloadCloud,
      bgColor: 'bg-[#64748b]', // Slate gray
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Greeting & New Work Wizard Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
        <div>
          <div className="text-[13px] text-slate-500 font-normal">
            วันพฤหัสบดีที่ 1 ตุลาคม {fiscalYear}
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-['Kanit',sans-serif]">
              สวัสดี{currentUser?.title?.includes('นาย') ? 'ครับ' : 'ค่ะ'} {currentUser ? `${currentUser.title}${currentUser.fullName}` : 'คุณครู'}
            </h1>
            {currentUser && (
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${ROLE_DEFINITIONS[currentUser.procurementRole].badgeClass}`}
              >
                {ROLE_DEFINITIONS[currentUser.procurementRole].label}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 font-medium">
            {schoolProfile?.schoolName || 'โรงเรียนบ้านนิคมสายโท 12 เหนือ'}
            {schoolProfile?.districtOffice ? ` • ${schoolProfile.districtOffice}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenLogin && (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium text-[13px] transition-colors cursor-pointer"
              title="สลับบทบาทหน้าที่"
            >
              <span>สลับบทบาท</span>
            </button>
          )}
          {onAddNewTask && (
            <button
              onClick={onAddNewTask}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium text-[13.5px] shadow-xs hover:shadow transition-all active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ เพิ่มรายการจัดซื้อ</span>
            </button>
          )}
          <button
            onClick={onOpenWizard}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1d72f2] hover:bg-[#155ec4] text-white rounded-full font-medium text-[14px] shadow-sm hover:shadow transition-all active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>งานใหม่แบบถามทีละข้อ</span>
          </button>
        </div>
      </div>

      {/* Alert Banner matching screenshot */}
      <div className="bg-[#fef2f2] border border-[#fed7d7] rounded-xl px-4 py-3 text-[13.5px] flex flex-col md:flex-row items-start md:items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2 text-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
          <span className="font-semibold text-red-950">มี 2 เรื่องต้องติดตาม</span>
          <span className="text-slate-400">—</span>
          <span className="text-slate-700">พัสดุยืมเกินกำหนด: นางมาลี ตั้งใจ และอีก 1 เรื่อง</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-xs font-semibold text-indigo-600">
          <button
            onClick={onOpenAlerts}
            className="hover:text-indigo-800 transition-colors cursor-pointer"
          >
            จัดการเรื่องแรก &gt;
          </button>
          <button
            onClick={onOpenAlerts}
            className="hover:text-indigo-800 transition-colors cursor-pointer"
          >
            ดูทั้งหมด &gt;
          </button>
        </div>
      </div>

      {/* Main Grid: Left Budget Gauge (38%) + Right Shortcuts & Counters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Year Budget Donut Rings Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium mb-1">
              ปีงบประมาณ {fiscalYear}
            </div>

            {/* Triple Concentric SVG Donut Rings */}
            <div className="my-5 flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  {/* Outer Ring: Orange (Year elapsed: 100%) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#fed7aa"
                    strokeWidth="11"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#f97316"
                    strokeWidth="11"
                    strokeDasharray={2 * Math.PI * 70}
                    strokeDashoffset={2 * Math.PI * 70 * (1 - 1.0)}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />

                  {/* Middle Ring: Green (Budget spent: 90%) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="54"
                    stroke="#bbf7d0"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="54"
                    stroke="#22c55e"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={2 * Math.PI * 54 * (1 - 0.9)}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />

                  {/* Inner Ring: Blue (Completed tasks: 4 of 8 = 50%) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="38"
                    stroke="#bfdbfe"
                    strokeWidth="9"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="38"
                    stroke="#2563eb"
                    strokeWidth="9"
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={2 * Math.PI * 38 * (1 - 0.5)}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
              </div>

              {/* Legend matching screenshot */}
              <div className="space-y-3.5 text-[13px]">
                <div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                    <span>ปีงบประมาณผ่านไป</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900 ml-4 font-['Kanit',sans-serif]">
                    100<span className="text-sm font-normal text-slate-500 ml-1">%</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                    <span>ใช้งบประมาณไป</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900 ml-4 font-['Kanit',sans-serif]">
                    90<span className="text-sm font-normal text-slate-500 ml-1">%</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                    <span>งานซื้อจ้างเสร็จแล้ว</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900 ml-4 font-['Kanit',sans-serif]">
                    4 <span className="text-sm font-normal text-slate-500">จาก 8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
            เหลืออีก <span className="font-semibold text-slate-800">0 วัน</span> จะสิ้นปีงบประมาณ ยังมีงบคงเหลือ{' '}
            <span className="font-semibold text-emerald-700">12,055 บาท</span>
          </div>
        </div>

        {/* Right Column: Shortcuts & Mini Cards */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5">
          {/* Shortcuts Grid Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>เมนูลัด</span>
            </div>

            <div className="grid grid-cols-4 gap-4 sm:gap-6 text-center">
              {quickMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectModule(item.id)}
                    className="group flex flex-col items-center gap-2 transition-transform active:scale-95 cursor-pointer"
                  >
                    <div
                      className={`w-13 h-13 rounded-2xl ${item.bgColor} flex items-center justify-center text-white shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two Side-by-Side Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Card 1: เบิกจ่ายแล้ว */}
            <div
              onClick={() => onSelectModule('procurement_register')}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 mb-1">
                <CreditCard className="w-4 h-4" />
                <span>เบิกจ่ายแล้ว</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-['Kanit',sans-serif] tracking-tight my-1">
                {totalAmountDisbursed.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                บาท • งานซื้อจ้าง 4 งาน กับ ว.804 / ว.119 7 รายการ
              </div>
            </div>

            {/* Card 2: ประกาศผลไตรมาส */}
            <div
              onClick={() => onSelectModule('quarterly_announcement')}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-amber-700 mb-1">
                <Megaphone className="w-4 h-4" />
                <span>ประกาศผลไตรมาส</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-['Kanit',sans-serif] tracking-tight my-1">
                10 <span className="text-lg font-normal text-slate-600">รายการ</span>
              </div>
              <div className="text-xs text-slate-500">
                ไตรมาสที่ 4 ยังไม่ได้ประกาศ • ประกาศภายใน 30 ต.ค. 69
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Task Tracking Center */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        {/* Header & Filter Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900 font-['Kanit',sans-serif]">
              ศูนย์ติดตามงาน
            </h2>
            <span className="text-xs font-normal text-slate-400">
              {filteredTasks.length} งาน
            </span>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหางาน, ร้านค้า, เลขที่..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 w-36 sm:w-48 bg-slate-50/50"
              />
            </div>

            {/* Filter Tabs matching screenshot */}
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs">
              {(
                [
                  { id: 'all', label: 'ทั้งหมด' },
                  { id: 'purchase', label: 'ซื้อ' },
                  { id: 'hire', label: 'จ้าง' },
                  { id: 'construction', label: 'ก่อสร้าง' },
                  { id: 'w804', label: 'ว.804' },
                  { id: 'w119', label: 'ว.119' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
              title="สลับลำดับเวลา"
            >
              <span>{sortOrder === 'desc' ? 'ใหม่ → เก่า' : 'เก่า → ใหม่'}</span>
            </button>
          </div>
        </div>

        {/* Task List Rows */}
        <div className="divide-y divide-slate-100">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              ไม่พบรายการที่ตรงกับการค้นหา
            </div>
          ) : (
            filteredTasks.map((task) => {
              // Icon according to type
              const getIconInfo = (type: TaskType) => {
                switch (type) {
                  case 'purchase':
                    return { icon: ShoppingCart, bg: 'bg-[#1877f2]', text: 'text-white' };
                  case 'hire':
                    return { icon: Wrench, bg: 'bg-[#f97316]', text: 'text-white' };
                  case 'construction':
                    return { icon: Building2, bg: 'bg-[#8d5b4c]', text: 'text-white' };
                  case 'w804':
                    return { icon: FileSpreadsheet, bg: 'bg-[#a855f7]', text: 'text-white' };
                  case 'w119':
                    return { icon: Receipt, bg: 'bg-[#4f46e5]', text: 'text-white' };
                  default:
                    return { icon: ShoppingCart, bg: 'bg-slate-600', text: 'text-white' };
                }
              };

              const iconInfo = getIconInfo(task.type);
              const ItemIcon = iconInfo.icon;

              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* Left: Icon & Title info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl ${iconInfo.bg} flex items-center justify-center shrink-0 ${iconInfo.text} shadow-2xs`}
                    >
                      <ItemIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-800">
                          {task.categoryName}
                        </span>
                        <span className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                          {task.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>{task.vendorName}</span>
                        <span>•</span>
                        <span>{task.budgetSource}</span>
                        {task.projectName && (
                          <>
                            <span>•</span>
                            <span className="text-indigo-800 bg-indigo-50 px-1.5 py-0.2 rounded-sm border border-indigo-100 font-medium">
                              {task.projectCode || 'โครงการ'}: {task.projectName}
                              {task.activityName ? ` > ${task.activityName}` : ''}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Date, Amount, Status Badge, Chevron */}
                  <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                    <div className="text-xs text-slate-400 hidden sm:block">
                      {task.dateStr}
                    </div>

                    <div className="text-sm font-semibold text-slate-900 font-['Kanit',sans-serif] text-right min-w-16">
                      {task.amount.toLocaleString()}
                    </div>

                    <div className="shrink-0 min-w-20 text-right">
                      {task.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>เสร็จแล้ว</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{task.statusText}</span>
                        </span>
                      )}
                    </div>

                    {/* Actions: Edit & Delete buttons */}
                    <div className="flex items-center gap-1">
                      {onEditTask && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditTask(task);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="แก้ไขรายการนี้"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteTask && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`คุณต้องการลบรายการ "${task.title}" หรือไม่?`)) {
                              onDeleteTask(task.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="ลบรายการนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
