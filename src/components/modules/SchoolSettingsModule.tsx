import React, { useState } from 'react';
import { School, Building, Save, CheckCircle2, Users, Plus, Edit2, Shield, Phone, Mail, MapPin, Trash2, X } from 'lucide-react';
import { SchoolProfile, Department, StaffPersonnel } from '../../types';

interface SchoolSettingsModuleProps {
  profile: SchoolProfile;
  departments: Department[];
  staff: StaffPersonnel[];
  onUpdateProfile: (profile: SchoolProfile) => void;
  onUpdateDepartments: (departments: Department[]) => void;
}

export const SchoolSettingsModule: React.FC<SchoolSettingsModuleProps> = ({
  profile,
  departments,
  staff,
  onUpdateProfile,
  onUpdateDepartments,
}) => {
  const [formData, setFormData] = useState<SchoolProfile>(profile);
  const [deptList, setDeptList] = useState<Department[]>(departments);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  // New dept form
  const [deptCode, setDeptCode] = useState('');
  const [deptName, setDeptName] = useState('');
  const [deptHead, setDeptHead] = useState(staff[0]?.fullName || '');
  const [deptHeadPos, setDeptHeadPos] = useState(staff[0]?.position || '');
  const [deptDesc, setDeptDesc] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) return;

    const newDept: Department = {
      id: `dept-${Date.now()}`,
      code: deptCode.trim() || `วภ-0${deptList.length + 1}`,
      name: deptName.trim(),
      headStaffName: deptHead,
      headStaffPosition: deptHeadPos,
      staffCount: 1,
      description: deptDesc.trim() || 'รับผิดชอบงานตามโครงสร้างการบริหารสถานศึกษา',
    };

    const updated = [...deptList, newDept];
    setDeptList(updated);
    onUpdateDepartments(updated);
    setIsAddDeptOpen(false);
    setDeptName('');
    setDeptDesc('');
  };

  const handleSaveEditDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept || !editingDept.name.trim()) return;

    const updated = deptList.map((d) => (d.id === editingDept.id ? editingDept : d));
    setDeptList(updated);
    onUpdateDepartments(updated);
    setEditingDept(null);
  };

  const handleDeleteDept = (dept: Department) => {
    if (confirm(`คุณต้องการลบฝ่าย/กลุ่มงาน "${dept.name}" หรือไม่?`)) {
      const updated = deptList.filter((d) => d.id !== dept.id);
      setDeptList(updated);
      onUpdateDepartments(updated);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                กำหนดค่าหน่วยงานและโครงสร้างสถานศึกษา
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ตั้งค่าข้อมูลพื้นฐานของโรงเรียน รหัสสถานศึกษา และกลุ่มงานฝ่ายบริหาร 4 ฝ่าย
              </p>
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>บันทึกข้อมูลหน่วยงานสำเร็จ</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: School Profile Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base font-['Kanit',sans-serif] mb-4 pb-2 border-b border-slate-100">
            <Building className="w-4 h-4 text-emerald-700" />
            <span>ข้อมูลทั่วไปสถานศึกษา</span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  ชื่อสถานศึกษา *
                </label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  รหัสสถานศึกษา (10 หลัก)
                </label>
                <input
                  type="text"
                  value={formData.schoolCode}
                  onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  สำนักงานเขตพื้นที่การศึกษา (สพป./สพม.)
                </label>
                <input
                  type="text"
                  value={formData.districtOffice}
                  onChange={(e) => setFormData({ ...formData, districtOffice: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ตำบล / แขวง</label>
                <input
                  type="text"
                  value={formData.subdistrict}
                  onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">อำเภอ / เขต</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">จังหวัด</label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  เบอร์โทรศัพท์ติดต่อ
                </label>
                <input
                  type="text"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">อีเมลทางการ</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block font-semibold text-slate-700 mb-1">
                ผู้อำนวยการสถานศึกษา (ผู้มีอำนาจอนุมัติจัดซื้อจัดจ้าง)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="ชื่อ-นามสกุล ผู้อำนวยการ"
                  value={formData.directorName}
                  onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
                <input
                  type="text"
                  placeholder="ตำแหน่งและวิทยฐานะ"
                  value={formData.directorPosition}
                  onChange={(e) => setFormData({ ...formData, directorPosition: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl text-slate-600"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>บันทึกการตั้งค่าหน่วยงาน</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: School Departments / Structure (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base font-['Kanit',sans-serif]">
                <Users className="w-4 h-4 text-blue-600" />
                <span>ฝ่ายบริหาร / กลุ่มงาน ({deptList.length} ฝ่าย)</span>
              </div>
              <button
                onClick={() => setIsAddDeptOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มฝ่าย</span>
              </button>
            </div>

            <div className="space-y-3">
              {deptList.map((dept) => (
                <div
                  key={dept.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 text-sm font-['Kanit',sans-serif]">
                      {dept.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {dept.code}
                      </span>
                      <button
                        onClick={() => setEditingDept(dept)}
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        title="แก้ไขฝ่าย/กลุ่มงาน"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDept(dept)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="ลบฝ่าย/กลุ่มงาน"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    หัวหน้ากลุ่มงาน: <strong className="text-slate-800">{dept.headStaffName}</strong>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{dept.headStaffPosition}</div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{dept.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Department Modal */}
      {editingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-['Kanit',sans-serif]">
              แก้ไขฝ่ายบริหาร / กลุ่มงาน
            </h3>
            <form onSubmit={handleSaveEditDept} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1">รหัสกลุ่มงาน</label>
                  <input
                    type="text"
                    value={editingDept.code}
                    onChange={(e) => setEditingDept({ ...editingDept, code: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold mb-1">ชื่อกลุ่มงาน / ฝ่าย *</label>
                  <input
                    type="text"
                    required
                    value={editingDept.name}
                    onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">หัวหน้ากลุ่มงาน</label>
                <input
                  type="text"
                  value={editingDept.headStaffName}
                  onChange={(e) => setEditingDept({ ...editingDept, headStaffName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">ตำแหน่งหัวหน้ากลุ่มงาน</label>
                <input
                  type="text"
                  value={editingDept.headStaffPosition}
                  onChange={(e) => setEditingDept({ ...editingDept, headStaffPosition: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">หน้าที่ความรับผิดชอบย่อ</label>
                <textarea
                  rows={2}
                  value={editingDept.description}
                  onChange={(e) => setEditingDept({ ...editingDept, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDept(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {isAddDeptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-['Kanit',sans-serif]">
              เพิ่มฝ่ายบริหาร / กลุ่มงานในสถานศึกษา
            </h3>
            <form onSubmit={handleAddDept} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1">รหัสกลุ่มงาน</label>
                  <input
                    type="text"
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                    placeholder="วภ-05"
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold mb-1">ชื่อกลุ่มงาน / ฝ่าย *</label>
                  <input
                    type="text"
                    required
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    placeholder="เช่น กลุ่มบริหารกิจการนักเรียน"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">หัวหน้ากลุ่มงาน</label>
                <input
                  type="text"
                  value={deptHead}
                  onChange={(e) => setDeptHead(e.target.value)}
                  placeholder="ชื่อ-นามสกุล หัวหน้าฝ่าย"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">ตำแหน่งหัวหน้ากลุ่มงาน</label>
                <input
                  type="text"
                  value={deptHeadPos}
                  onChange={(e) => setDeptHeadPos(e.target.value)}
                  placeholder="เช่น ครู ชำนาญการพิเศษ"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">หน้าที่ความรับผิดชอบย่อ</label>
                <textarea
                  rows={2}
                  value={deptDesc}
                  onChange={(e) => setDeptDesc(e.target.value)}
                  placeholder="ระบุขอบข่ายภาระงานหลัก"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDeptOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  เพิ่มกลุ่มงาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
