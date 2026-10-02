import React, { useState, useRef, useEffect } from 'react';
import { Menu, School, UserCheck, ChevronDown, LogOut, ArrowRightLeft, Shield, User } from 'lucide-react';
import { ModuleId, StaffPersonnel, ROLE_DEFINITIONS } from '../types';

interface TopNavProps {
  onToggleSidebar: () => void;
  activeModule: ModuleId;
  fiscalYear: number;
  onFiscalYearChange: (year: number) => void;
  schoolName?: string;
  currentUser: StaffPersonnel | null;
  onOpenLogin: () => void;
  onLogout?: () => void;
}

const MODULE_TITLES: Record<ModuleId, { parent: string; title: string }> = {
  home: { parent: 'ภาพรวม', title: 'หน้าแรก' },
  purchase: { parent: 'งานจัดซื้อจัดจ้าง', title: 'งานซื้อ' },
  hire: { parent: 'งานจัดซื้อจัดจ้าง', title: 'งานจ้าง' },
  construction: { parent: 'งานจัดซื้อจัดจ้าง', title: 'งานก่อสร้าง' },
  procurement_register: { parent: 'งานจัดซื้อจัดจ้าง', title: 'ทะเบียนคุมจัดซื้อจัดจ้าง' },
  w804: { parent: 'งานจัดซื้อจัดจ้าง', title: 'ว.804 ซื้อไม่เกิน 50,000' },
  w119: { parent: 'งานจัดซื้อจัดจ้าง', title: 'ว.119 ค่าใช้จ่ายบริหารงาน' },
  textbooks: { parent: 'งานจัดซื้อจัดจ้าง', title: 'หนังสือเรียน (เรียนฟรี 15 ปี)' },
  quarterly_announcement: { parent: 'งานจัดซื้อจัดจ้าง', title: 'ประกาศผลรายไตรมาส' },
  inventory_ledger: { parent: 'คลังและการเบิก', title: 'บัญชีวัสดุ' },
  requisition: { parent: 'คลังและการเบิก', title: 'ใบเบิกพัสดุ' },
  borrow_return: { parent: 'คลังและการเบิก', title: 'ยืม-คืนพัสดุ' },
  material_report: { parent: 'คลังและการเบิก', title: 'รายงานวัสดุ' },
  asset_register: { parent: 'ทรัพย์สิน', title: 'ทะเบียนคุมทรัพย์สิน' },
  annual_audit: { parent: 'ทรัพย์สิน', title: 'ตรวจสอบพัสดุประจำปี' },
  projects: { parent: 'แผนงานและโครงการ', title: 'โครงการที่ได้รับอนุมัติ' },
  personnel: { parent: 'การตั้งค่าและบุคลากร', title: 'บุคลากรแต่ละตำแหน่ง' },
  school_settings: { parent: 'การตั้งค่าและบุคลากร', title: 'กำหนดค่าหน่วยงาน' },
  backup_restore: { parent: 'ระบบ', title: 'สำรองข้อมูล' },
};

export const TopNav: React.FC<TopNavProps> = ({
  onToggleSidebar,
  activeModule,
  fiscalYear,
  onFiscalYearChange,
  schoolName,
  currentUser,
  onOpenLogin,
  onLogout,
}) => {
  const current = MODULE_TITLES[activeModule] || { parent: 'ภาพรวม', title: 'หน้าแรก' };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleDef = currentUser ? ROLE_DEFINITIONS[currentUser.procurementRole] : null;

  return (
    <header className="h-14 border-b border-slate-200/80 bg-white/95 backdrop-blur-xs px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          title="ย่อ/ขยายเมนู"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb matching screenshot style */}
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 font-normal leading-tight">
            {current.parent}
          </span>
          <span className="text-[13.5px] font-semibold text-slate-800 leading-tight">
            {current.title}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Fiscal Year Pill */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
          <span className="text-slate-500">ปีงบฯ:</span>
          <select
            value={fiscalYear}
            onChange={(e) => onFiscalYearChange(Number(e.target.value))}
            className="font-semibold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
          >
            <option value={2568}>2568</option>
            <option value={2569}>2569</option>
            <option value={2570}>2570</option>
          </select>
        </div>

        {/* School tag */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg">
          <School className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-medium truncate max-w-[200px]">{schoolName || 'ร.ร.บ้านนิคมสายโท 12 เหนือ'}</span>
        </div>

        {/* User tag & Role Menu */}
        {currentUser ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1 transition-all cursor-pointer shadow-2xs"
            >
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                {currentUser.fullName.slice(0, 1)}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-slate-800 text-[12px] leading-tight truncate max-w-[140px] sm:max-w-[180px]">
                  {currentUser.title}{currentUser.fullName}
                </span>
                <span className="text-[10px] text-slate-500 leading-tight">
                  {roleDef?.shortLabel || 'ผู้ใช้งาน'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* Profile Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 px-3 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                  <div className="font-bold text-slate-900 text-sm">
                    {currentUser.title}{currentUser.fullName}
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {currentUser.position}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {currentUser.departmentName}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-slate-400 text-[10px]">บทบาทปัจจุบัน:</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleDef?.badgeClass}`}>
                      {roleDef?.label}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenLogin();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl font-medium transition-colors cursor-pointer"
                  >
                    <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                    <span>สลับบทบาทหน้าที่ / เปลี่ยนบัญชี</span>
                  </button>

                  {onLogout && (
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>ออกจากระบบ</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-3 py-1.5 font-bold shadow-xs transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>เข้าสู่ระบบ</span>
          </button>
        )}
      </div>
    </header>
  );
};

