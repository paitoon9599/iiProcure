import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  ArrowRightLeft,
  Crown,
  Package,
  CircleDollarSign,
  Search,
  GraduationCap,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { StaffPersonnel, ProcurementRole, ROLE_DEFINITIONS } from '../types';

interface RoleBannerProps {
  currentUser: StaffPersonnel;
  onOpenSwitchRole: () => void;
  onQuickSwitchRole: (role: ProcurementRole) => void;
  onLogout?: () => void;
}

export const RoleBanner: React.FC<RoleBannerProps> = ({
  currentUser,
  onOpenSwitchRole,
  onQuickSwitchRole,
  onLogout,
}) => {
  const roleDef = ROLE_DEFINITIONS[currentUser.procurementRole];

  const getRoleIcon = (role: ProcurementRole) => {
    switch (role) {
      case 'approver':
        return <Crown className="w-4 h-4 text-purple-700" />;
      case 'procurement_officer':
        return <Package className="w-4 h-4 text-emerald-700" />;
      case 'finance_officer':
        return <CircleDollarSign className="w-4 h-4 text-blue-700" />;
      case 'inspector':
        return <Search className="w-4 h-4 text-amber-700" />;
      default:
        return <GraduationCap className="w-4 h-4 text-slate-700" />;
    }
  };

  const rolesList: ProcurementRole[] = [
    'approver',
    'procurement_officer',
    'finance_officer',
    'inspector',
    'teacher',
  ];

  return (
    <div className="mb-5 bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
          {getRoleIcon(currentUser.procurementRole)}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">เข้าสู่ระบบในบทบาท:</span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${roleDef.badgeClass} flex items-center gap-1`}
            >
              <span>{roleDef.label}</span>
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-2 flex-wrap">
            <span>
              {currentUser.title}{currentUser.fullName}
            </span>
            <span className="text-xs font-normal text-slate-500">
              ({currentUser.position} • {currentUser.departmentName})
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
        <span className="text-[11px] text-slate-400 mr-1 hidden lg:inline">สลับบทบาท:</span>
        {rolesList.map((r) => {
          const isSelected = r === currentUser.procurementRole;
          const rDef = ROLE_DEFINITIONS[r];
          return (
            <button
              key={r}
              onClick={() => onQuickSwitchRole(r)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white font-bold shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
              }`}
              title={rDef.label}
            >
              {rDef.shortLabel}
            </button>
          );
        })}

        <button
          onClick={onOpenSwitchRole}
          className="ml-1 inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          title="สลับบัญชีผู้ใช้ หรือ ดูรายละเอียดสิทธิ์"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>บัญชีอื่น</span>
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium cursor-pointer transition-colors"
            title="ออกจากระบบ"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ออก</span>
          </button>
        )}
      </div>
    </div>
  );
};

