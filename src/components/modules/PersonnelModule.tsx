import React, { useState } from 'react';
import { Users, Plus, Printer, Search, Phone, Mail, CheckCircle2, Shield, UserCheck, Filter } from 'lucide-react';
import { StaffPersonnel, Department } from '../../types';

interface PersonnelModuleProps {
  staffList: StaffPersonnel[];
  departments: Department[];
  onAddStaff: (staff: StaffPersonnel) => void;
  onUpdateStaff: (staff: StaffPersonnel) => void;
}

export const PersonnelModule: React.FC<PersonnelModuleProps> = ({
  staffList,
  departments,
  onAddStaff,
  onUpdateStaff,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffPersonnel | null>(null);

  // Form states
  const [title, setTitle] = useState('นาย');
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('ครู');
  const [academicStanding, setAcademicStanding] = useState('วิทยฐานะชำนาญการ');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || 'dept-1');
  const [procurementRole, setProcurementRole] = useState<StaffPersonnel['procurementRole']>('teacher');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const filtered = staffList.filter((s) => {
    if (selectedDept !== 'all' && s.departmentId !== selectedDept) return false;
    if (selectedRole !== 'all' && s.procurementRole !== selectedRole) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.fullName.toLowerCase().includes(q) ||
        s.position.toLowerCase().includes(q) ||
        s.departmentName.toLowerCase().includes(q) ||
        s.phone.includes(q)
      );
    }
    return true;
  });

  const getRoleBadge = (role: StaffPersonnel['procurementRole']) => {
    switch (role) {
      case 'approver':
        return { label: 'ผู้อนุมัติ (ผอ.)', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'procurement_officer':
        return { label: 'เจ้าหน้าที่พัสดุ', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'finance_officer':
        return { label: 'เจ้าหน้าที่การเงิน', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'inspector':
        return { label: 'กรรมการตรวจรับ', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      default:
        return { label: 'ครูผู้ขอเบิก', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const deptObj = departments.find((d) => d.id === departmentId);
    const newStaff: StaffPersonnel = {
      id: `staff-${Date.now()}`,
      staffCode: `ครู-${String(staffList.length + 1).padStart(3, '0')}`,
      title,
      fullName: fullName.trim(),
      position,
      academicStanding,
      departmentId,
      departmentName: deptObj?.name || 'กลุ่มบริหารงานวิชาการ',
      procurementRole,
      phone,
      email,
      active: true,
    };

    onAddStaff(newStaff);
    setIsAddOpen(false);
    setFullName('');
    setPhone('');
    setEmail('');
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                บุคลากรและตำแหน่งงานในสถานศึกษา
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                รายชื่อคณะครูและบุคลากรทางการศึกษา ตำแหน่ง วิทยฐานะ และบทบาทในงานจัดซื้อจัดจ้าง
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
            <span>พิมพ์ทำเนียบบุคลากร</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ เพิ่มบุคลากร</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">บุคลากรทั้งหมด</div>
          <div className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif] mt-0.5">
            {staffList.length} <span className="text-xs font-normal text-slate-500">คน</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">งานพัสดุและการเงิน</div>
          <div className="text-2xl font-bold text-emerald-700 font-['Kanit',sans-serif] mt-0.5">
            {staffList.filter((s) => s.procurementRole === 'procurement_officer' || s.procurementRole === 'finance_officer').length}{' '}
            <span className="text-xs font-normal text-slate-500">คน</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">กรรมการตรวจรับพัสดุ</div>
          <div className="text-2xl font-bold text-amber-700 font-['Kanit',sans-serif] mt-0.5">
            {staffList.filter((s) => s.procurementRole === 'inspector').length}{' '}
            <span className="text-xs font-normal text-slate-500">คน</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">สถานะปฏิบัติงาน</div>
          <div className="text-2xl font-bold text-blue-700 font-['Kanit',sans-serif] mt-0.5">
            100% <span className="text-xs font-normal text-slate-500">พร้อมปฏิบัติงาน</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, ตำแหน่ง, สังกัด, เบอร์โทร..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto">
          {/* Dept filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
          >
            <option value="all">ทุกกลุ่มงาน/ฝ่าย</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Role filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
          >
            <option value="all">ทุกบทบาทงานพัสดุ</option>
            <option value="approver">ผู้อนุมัติ</option>
            <option value="procurement_officer">เจ้าหน้าที่พัสดุ</option>
            <option value="finance_officer">เจ้าหน้าที่การเงิน</option>
            <option value="inspector">กรรมการตรวจรับ</option>
            <option value="teacher">ครูผู้สอน/ผู้ขอเบิก</option>
          </select>
        </div>
      </div>

      {/* Personnel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((staff) => {
          const roleBadge = getRoleBadge(staff.procurementRole);
          return (
            <div
              key={staff.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-blue-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                    {staff.fullName.slice(0, 2)}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadge.color}`}
                  >
                    {roleBadge.label}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-bold text-slate-900 text-base font-['Kanit',sans-serif]">
                    {staff.title}{staff.fullName}
                  </h3>
                  <div className="text-xs text-blue-700 font-medium mt-0.5">{staff.position}</div>
                  {staff.academicStanding && (
                    <div className="text-[11px] text-slate-500">{staff.academicStanding}</div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <div>
                    <span className="text-slate-400">สังกัด:</span>{' '}
                    <span className="font-medium text-slate-800">{staff.departmentName}</span>
                  </div>
                  {staff.phone && (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{staff.phone}</span>
                    </div>
                  )}
                  {staff.email && (
                    <div className="flex items-center gap-1.5 text-slate-500 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{staff.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  ปฏิบัติงานปกติ
                </span>
                <span className="font-mono text-[11px] text-slate-400">{staff.staffCode}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Staff Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-['Kanit',sans-serif]">
              เพิ่มบุคลากรใหม่ในสถานศึกษา
            </h3>
            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block font-semibold mb-1">คำนำหน้า</label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="นาย">นาย</option>
                    <option value="นาง">นาง</option>
                    <option value="นางสาว">นางสาว</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block font-semibold mb-1">ชื่อ - นามสกุล *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="เช่น สมพร ชัยชนะ"
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">ตำแหน่ง *</label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="เช่น ครู, ผู้อำนวยการ, ธุรการ"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">วิทยฐานะ</label>
                  <input
                    type="text"
                    value={academicStanding}
                    onChange={(e) => setAcademicStanding(e.target.value)}
                    placeholder="เช่น ชำนาญการ, ชำนาญการพิเศษ"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">สังกัดกลุ่มงาน / ฝ่าย</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">บทบาทในงานพัสดุ</label>
                  <select
                    value={procurementRole}
                    onChange={(e) => setProcurementRole(e.target.value as StaffPersonnel['procurementRole'])}
                    className="w-full p-2 border border-slate-300 rounded-lg font-semibold"
                  >
                    <option value="teacher">ครูผู้สอน / ผู้ขอเบิก</option>
                    <option value="inspector">กรรมการตรวจรับพัสดุ</option>
                    <option value="procurement_officer">เจ้าหน้าที่พัสดุ</option>
                    <option value="finance_officer">เจ้าหน้าที่การเงิน</option>
                    <option value="approver">ผู้อนุมัติ (ผู้อำนวยการ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08X-XXX-XXXX"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">อีเมล</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teacher@school.ac.th"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  บันทึกบุคลากร
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
