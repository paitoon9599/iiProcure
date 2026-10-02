import React from 'react';
import {
  Home,
  FileText,
  Briefcase,
  BookOpen,
  ShoppingBag,
  Receipt,
  BookMarked,
  Megaphone,
  Archive,
  FileCheck2,
  ArrowLeftRight,
  LineChart,
  Monitor,
  ShieldCheck,
  DownloadCloud,
  X,
  FolderKanban,
  Users,
  School,
} from 'lucide-react';
import { ModuleId } from '../types';

interface SidebarProps {
  activeModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
  isOpen: boolean;
  onClose: () => void;
  overdueCount?: number;
  pendingRequisitionCount?: number;
  schoolName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  isOpen,
  onClose,
  overdueCount = 2,
  pendingRequisitionCount = 1,
  schoolName,
}) => {
  const sections = [
    {
      title: 'งานจัดซื้อจัดจ้าง',
      items: [
        { id: 'purchase' as ModuleId, label: 'งานซื้อ', icon: FileText },
        { id: 'hire' as ModuleId, label: 'งานจ้าง', icon: Briefcase },
        { id: 'procurement_register' as ModuleId, label: 'ทะเบียนคุมจัดซื้อจัดจ้าง', icon: BookOpen },
        { id: 'w804' as ModuleId, label: 'ว.804 ซื้อไม่เกิน 50,000', icon: ShoppingBag },
        { id: 'w119' as ModuleId, label: 'ว.119 ค่าใช้จ่ายบริหารงาน', icon: Receipt },
        { id: 'textbooks' as ModuleId, label: 'หนังสือเรียน (เรียนฟรี 15 ปี)', icon: BookMarked },
        { id: 'quarterly_announcement' as ModuleId, label: 'ประกาศผลรายไตรมาส', icon: Megaphone },
      ],
    },
    {
      title: 'แผนงานและโครงการ',
      items: [
        { id: 'projects' as ModuleId, label: 'โครงการที่ได้รับอนุมัติ', icon: FolderKanban },
      ],
    },
    {
      title: 'คลังและการเบิก',
      items: [
        { id: 'inventory_ledger' as ModuleId, label: 'บัญชีวัสดุ', icon: Archive },
        { id: 'requisition' as ModuleId, label: 'ใบเบิกพัสดุ', icon: FileCheck2, badge: pendingRequisitionCount },
        { id: 'borrow_return' as ModuleId, label: 'ยืม-คืนพัสดุ', icon: ArrowLeftRight, badge: overdueCount, badgeColor: 'bg-red-500 text-white' },
        { id: 'material_report' as ModuleId, label: 'รายงานวัสดุ', icon: LineChart },
      ],
    },
    {
      title: 'ทรัพย์สิน',
      items: [
        { id: 'asset_register' as ModuleId, label: 'ทะเบียนคุมทรัพย์สิน', icon: Monitor },
        { id: 'annual_audit' as ModuleId, label: 'ตรวจสอบพัสดุประจำปี', icon: ShieldCheck },
      ],
    },
    {
      title: 'การตั้งค่าและบุคลากร',
      items: [
        { id: 'personnel' as ModuleId, label: 'บุคลากรแต่ละตำแหน่ง', icon: Users },
        { id: 'school_settings' as ModuleId, label: 'กำหนดค่าหน่วยงาน', icon: School },
      ],
    },
  ];

  const handleItemClick = (id: ModuleId) => {
    onSelectModule(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f533a] flex items-center justify-center text-white font-bold text-xl shadow-xs">
              W
            </div>
            <div>
              <div className="font-bold text-slate-800 text-[15px] leading-tight">พัสดุ</div>
              <div className="text-xs text-slate-500 font-medium truncate max-w-[155px]" title={schoolName || 'ระบบงานพัสดุ'}>
                {schoolName || 'ระบบงานพัสดุ'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 text-[13.5px]">
          {/* หน้าแรก */}
          <button
            onClick={() => handleItemClick('home')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-colors ${
              activeModule === 'home'
                ? 'bg-[#e7eee7] text-[#166534]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Home className={`w-4 h-4 shrink-0 ${activeModule === 'home' ? 'text-[#166534]' : 'text-slate-500'}`} />
            <span>หน้าแรก</span>
          </button>

          {/* Grouped Sections */}
          {sections.map((sec) => (
            <div key={sec.title} className="pt-3">
              <div className="pb-1 px-3 text-[11px] font-semibold text-slate-400 tracking-wider">
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl font-medium transition-colors ${
                      isActive
                        ? 'bg-[#e7eee7] text-[#166534]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#166534]' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.badgeColor || 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Item: สำรองข้อมูล */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={() => handleItemClick('backup_restore')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] font-medium transition-colors ${
              activeModule === 'backup_restore'
                ? 'bg-[#e7eee7] text-[#166534]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <DownloadCloud className="w-4 h-4 text-slate-500" />
            <span>สำรองข้อมูล</span>
          </button>
        </div>
      </aside>
    </>
  );
};
