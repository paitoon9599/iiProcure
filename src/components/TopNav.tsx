import React from 'react';
import { Menu, School, UserCheck } from 'lucide-react';
import { ModuleId } from '../types';

interface TopNavProps {
  onToggleSidebar: () => void;
  activeModule: ModuleId;
  fiscalYear: number;
  onFiscalYearChange: (year: number) => void;
  schoolName?: string;
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
}) => {
  const current = MODULE_TITLES[activeModule] || { parent: 'ภาพรวม', title: 'หน้าแรก' };

  return (
    <header className="h-14 border-b border-slate-200/80 bg-white/95 backdrop-blur-xs px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
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

      <div className="flex items-center gap-3">
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
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg">
          <School className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-medium truncate max-w-[200px]">{schoolName || 'ร.ร.บ้านนิคมสายโท 12 เหนือ'}</span>
        </div>

        {/* User tag */}
        <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-medium">ครูทัศน์พล (จนท.พัสดุ)</span>
        </div>
      </div>
    </header>
  );
};
