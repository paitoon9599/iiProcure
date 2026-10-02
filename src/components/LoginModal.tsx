import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  School,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  KeyRound,
  Users,
  ChevronRight,
  Info,
  LogOut,
  X,
  Search,
  Check,
} from 'lucide-react';
import { StaffPersonnel, ProcurementRole, ROLE_DEFINITIONS, SchoolProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  staffList: StaffPersonnel[];
  schoolProfile: SchoolProfile;
  currentUser: StaffPersonnel | null;
  onLogin: (staff: StaffPersonnel) => void;
  onLogout?: () => void;
  isFullScreen?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  staffList,
  schoolProfile,
  currentUser,
  onLogin,
  onLogout,
  isFullScreen = false,
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    currentUser?.id || staffList[1]?.id || staffList[0]?.id || ''
  );
  const [password, setPassword] = useState('1234');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'quick_role' | 'all_staff'>('quick_role');
  const [staffSearchQuery, setStaffSearchQuery] = useState('');

  if (!isOpen) return null;

  // Find 1 representative for each of the 5 roles
  const roleRepresentatives: Array<{
    role: ProcurementRole;
    staff: StaffPersonnel;
    icon: string;
    dutyHighlight: string;
  }> = [
    {
      role: 'approver',
      staff: staffList.find((s) => s.procurementRole === 'approver') || staffList[0],
      icon: '👑',
      dutyHighlight: 'อนุมัติงบโครงการ, อนุมัติจัดซื้อจัดจ้างทุกวิธี, อนุมัติใบเบิกพัสดุ',
    },
    {
      role: 'procurement_officer',
      staff: staffList.find((s) => s.procurementRole === 'procurement_officer') || staffList[1] || staffList[0],
      icon: '📦',
      dutyHighlight: 'จัดทำสัญญา PO/จ้าง, คุมทะเบียนพัสดุ, ว.804/ว.119, ประกาศผล สขร.1',
    },
    {
      role: 'finance_officer',
      staff: staffList.find((s) => s.procurementRole === 'finance_officer') || staffList[2] || staffList[0],
      icon: '💰',
      dutyHighlight: 'ตรวจสอบงบประมาณโครงการ, บันทึกการจ่ายเงิน, รายงานการเงิน',
    },
    {
      role: 'inspector',
      staff: staffList.find((s) => s.procurementRole === 'inspector') || staffList[3] || staffList[0],
      icon: '🔍',
      dutyHighlight: 'ตรวจรับพัสดุตาม PO/สัญญา, กรรมการตรวจสอบพัสดุประจำปี',
    },
    {
      role: 'teacher',
      staff: staffList.find((s) => s.procurementRole === 'teacher') || staffList[5] || staffList[0],
      icon: '👩‍🏫',
      dutyHighlight: 'ขอเบิกวัสดุการสอน, ยืม-คืนอุปกรณ์, ดูรายการแบบเรียน 15 ปี',
    },
  ];

  const handleSelectRole = (staff: StaffPersonnel) => {
    setSelectedStaffId(staff.id);
    onLogin(staff);
    if (onClose) onClose();
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = staffList.find((s) => s.id === selectedStaffId);
    if (!found) {
      setErrorMessage('กรุณาเลือกบุคลากร');
      return;
    }

    onLogin(found);
    if (onClose) onClose();
  };

  const filteredStaff = staffList.filter((s) => {
    if (!staffSearchQuery.trim()) return true;
    const q = staffSearchQuery.toLowerCase();
    const roleDef = ROLE_DEFINITIONS[s.procurementRole];
    return (
      s.fullName.toLowerCase().includes(q) ||
      s.position.toLowerCase().includes(q) ||
      s.staffCode.toLowerCase().includes(q) ||
      s.departmentName.toLowerCase().includes(q) ||
      roleDef.label.toLowerCase().includes(q)
    );
  });

  const selectedStaffObj = staffList.find((s) => s.id === selectedStaffId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-auto max-h-[92vh]">
        {/* Header with School Branding */}
        <div className="relative p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col justify-between overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
          <div className="absolute left-1/3 -top-10 w-32 h-32 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-950/30 font-bold text-xl border border-white/20">
                <School className="w-6 h-6" />
              </div>
              <div>
                <div className="text-emerald-400 font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ระบบเข้าใช้งานตามบทบาทหน้าที่ (Role-Based Access Control)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Kanit',sans-serif] mt-0.5 text-white">
                  {schoolProfile.schoolName || 'โรงเรียนบ้านนิคมสายโท 12 เหนือ'}
                </h2>
                <p className="text-xs text-slate-300">
                  {schoolProfile.districtOffice || 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษาบุรีรัมย์ เขต 2'}
                </p>
              </div>
            </div>

            {onClose && !isFullScreen && (
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                title="ปิด"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {currentUser && (
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-300 relative z-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>เข้าสู่ระบบอยู่โดย:</span>
                <strong className="text-white">
                  {currentUser.title}{currentUser.fullName}
                </strong>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ROLE_DEFINITIONS[currentUser.procurementRole].badgeClass}`}>
                  {ROLE_DEFINITIONS[currentUser.procurementRole].shortLabel}
                </span>
              </div>
              {onLogout && (
                <button
                  onClick={() => {
                    onLogout();
                    if (onClose) onClose();
                  }}
                  className="inline-flex items-center gap-1 text-red-300 hover:text-red-200 hover:underline cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>ออกจากระบบ</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 text-xs font-semibold px-4 pt-2">
          <button
            onClick={() => setActiveTab('quick_role')}
            className={`pb-2.5 px-4 cursor-pointer transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'quick_role'
                ? 'border-indigo-600 text-indigo-700 font-bold bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>เข้าสู่ระบบด่วนตามบทบาท (5 บทบาทหน้าที่)</span>
          </button>
          <button
            onClick={() => setActiveTab('all_staff')}
            className={`pb-2.5 px-4 cursor-pointer transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'all_staff'
                ? 'border-indigo-600 text-indigo-700 font-bold bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>เลือกบุคลากรรายบุคคล ({staffList.length} ท่าน)</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'quick_role' ? (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 flex items-center justify-between flex-wrap gap-1">
                <span>คลิกเลือกบทบาทหน้าที่เพื่อเข้าสู่ระบบทันที:</span>
                <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  สิทธิ์การใช้งานและเมนูจะปรับตามบทบาทอัตโนมัติ
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {roleRepresentatives.map(({ role, staff, icon, dutyHighlight }) => {
                  const roleDef = ROLE_DEFINITIONS[role];
                  const isCurrent = currentUser?.id === staff.id;

                  return (
                    <div
                      key={role}
                      onClick={() => handleSelectRole(staff)}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:shadow-md ${
                        isCurrent
                          ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-400/30'
                          : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl p-2 rounded-xl bg-slate-100 border border-slate-200 group-hover:scale-105 transition-transform shrink-0">
                          {icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm font-['Kanit',sans-serif]">
                              {roleDef.label}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleDef.badgeClass}`}
                            >
                              {roleDef.shortLabel}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                                ใช้งานอยู่ขณะนี้
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-slate-700 mt-1">
                            {staff.title}{staff.fullName}{' '}
                            <span className="text-slate-400 font-normal">({staff.position})</span>
                          </div>
                          <p className="text-[11px] text-indigo-700 font-medium mt-0.5">
                            หน้าที่หลัก: {dutyHighlight}
                          </p>
                          <p className="text-[10.5px] text-slate-500 mt-0.5 line-clamp-1">
                            {roleDef.description}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectRole(staff);
                        }}
                        className={`inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          isCurrent
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        <span>{isCurrent ? 'ใช้งานอยู่' : 'เข้าสู่ระบบ'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* Search bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={staffSearchQuery}
                  onChange={(e) => setStaffSearchQuery(e.target.value)}
                  placeholder="ค้นหาชื่อ, รหัส, ตำแหน่ง หรือบทบาทหน้าที่..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              {/* Staff Cards List */}
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {filteredStaff.map((staff) => {
                  const roleDef = ROLE_DEFINITIONS[staff.procurementRole];
                  const isCurrent = currentUser?.id === staff.id;
                  const isSelected = selectedStaffId === staff.id;

                  return (
                    <div
                      key={staff.id}
                      onClick={() => setSelectedStaffId(staff.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-500'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {staff.fullName.slice(0, 1)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-slate-900 text-xs truncate">
                              {staff.title}{staff.fullName}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${roleDef.badgeClass}`}>
                              {roleDef.shortLabel}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-md">
                                ปัจจุบัน
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {staff.position} • {staff.departmentName}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectRole(staff);
                          }}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          เข้าใช้งาน
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleManualLogin} className="space-y-3 pt-2 border-t border-slate-100">
                {selectedStaffObj && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">
                        บุคลากรที่เลือก: {selectedStaffObj.title}{selectedStaffObj.fullName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ROLE_DEFINITIONS[selectedStaffObj.procurementRole].badgeClass}`}
                      >
                        {ROLE_DEFINITIONS[selectedStaffObj.procurementRole].label}
                      </span>
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      ตำแหน่ง: {selectedStaffObj.position} ({selectedStaffObj.departmentName})
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">
                      รหัสผ่าน
                    </label>
                    <button
                      type="button"
                      onClick={() => setPassword('1234')}
                      className="text-[11px] text-indigo-600 hover:underline cursor-pointer"
                    >
                      ใช้รหัสผ่านทดสอบ (1234)
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="รหัสผ่านเข้าใช้งาน"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-red-600 text-xs font-medium">{errorMessage}</div>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    เข้าสู่ระบบ
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Role duty reference cards */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>สรุปขอบเขตอำนาจหน้าที่ตามบทบาทในงานพัสดุสถานศึกษา</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
              <div className="p-2 bg-white rounded-lg border border-slate-100">
                <strong className="text-purple-700">1. ผู้อนุมัติ (ผอ.):</strong> อนุมัติแผนงานโครงการ, อนุมัติการจัดซื้อจัดจ้างทุกวิธี, อนุมัติใบเบิกพัสดุ
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-100">
                <strong className="text-emerald-700">2. จนท.พัสดุ:</strong> จัดทำเอกสาร PO, คุมทะเบียน, ว.804, ว.119, บัญชีวัสดุ, สรุป สขร.1
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-100">
                <strong className="text-blue-700">3. จนท.การเงิน:</strong> ตรวจงบประมาณ, บันทึกการเบิกจ่าย, รายงานยอดเงินคงเหลือ
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-100">
                <strong className="text-amber-700">4. กรรมการตรวจรับ:</strong> ตรวจรับพัสดุตามสัญญา/PO, ดำเนินการตรวจสอบพัสดุประจำปี
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-100 sm:col-span-2">
                <strong className="text-slate-700">5. ครูผู้สอน / ผู้ขอเบิก:</strong> ขอเบิกวัสดุการสอน, ยืม-คืนอุปกรณ์, ดูแบบเรียน 15 ปี, ติดตามโครงการ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
