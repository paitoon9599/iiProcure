import React, { useState } from 'react';
import { ShieldCheck, Printer, CheckCircle2, Clock, AlertTriangle, FileSpreadsheet, Users, Plus, Edit2, Trash2, X } from 'lucide-react';
import { AuditItem, SchoolProfile } from '../../types';

interface AnnualAuditModuleProps {
  auditItems: AuditItem[];
  onUpdateAuditStatus: (id: string, status: AuditItem['status']) => void;
  onAddAuditItem?: (item: AuditItem) => void;
  onUpdateAuditItem?: (item: AuditItem) => void;
  onDeleteAuditItem?: (id: string) => void;
  fiscalYear: number;
  schoolProfile?: SchoolProfile;
}

export const AnnualAuditModule: React.FC<AnnualAuditModuleProps> = ({
  auditItems,
  onUpdateAuditStatus,
  onAddAuditItem,
  onUpdateAuditItem,
  onDeleteAuditItem,
  fiscalYear,
  schoolProfile,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AuditItem | null>(null);

  // Form states
  const [assetNumber, setAssetNumber] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('ห้องพัสดุและพัสดุกลาง');
  const [auditor, setAuditor] = useState('นายธีรพล สินธุ');
  const [notes, setNotes] = useState('สภาพสมบูรณ์ พร้อมใช้งาน');

  const verifiedCount = auditItems.filter((i) => i.status === 'verified').length;
  const pendingCount = auditItems.filter((i) => i.status === 'pending').length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !onAddAuditItem) return;

    const newItem: AuditItem = {
      id: `aud-${Date.now()}`,
      assetNumber: assetNumber.trim() || `ศธ 04052.12/${String(fiscalYear).slice(2)}/${Math.floor(Math.random() * 900 + 100)}`,
      name: name.trim(),
      location: location.trim(),
      auditor: auditor.trim(),
      auditDate: `30 ก.ย. ${String(fiscalYear).slice(2)}`,
      status: 'verified',
      notes: notes.trim(),
    };

    onAddAuditItem(newItem);
    setIsAddOpen(false);
    setName('');
    setAssetNumber('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name.trim() || !onUpdateAuditItem) return;

    onUpdateAuditItem(editingItem);
    setEditingItem(null);
  };

  const handleDelete = (item: AuditItem) => {
    if (!onDeleteAuditItem) return;
    if (confirm(`คุณต้องการลบรายการตรวจนับ "${item.name}" (${item.assetNumber}) หรือไม่?`)) {
      onDeleteAuditItem(item.id);
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                  การตรวจสอบพัสดุประจำปี {fiscalYear}
                </h2>
                {schoolProfile && (
                  <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {schoolProfile.schoolName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                การตรวจสอบการรับจ่ายพัสดุงวด 1 ปี ตามระเบียบกระทรวงการคลังว่าด้วยการจัดซื้อจัดจ้างฯ ข้อ 213 • {schoolProfile?.schoolName || 'โรงเรียนบ้านนิคมสายโท 12 เหนือ'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์รายงานผลการตรวจสอบ</span>
          </button>
          {onAddAuditItem && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ เพิ่มรายการตรวจนับ</span>
            </button>
          )}
        </div>
      </div>

      {/* Audit Committee Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <Users className="w-4 h-4 text-emerald-700" />
          <span>
            คณะกรรมการตรวจสอบพัสดุประจำปี {fiscalYear} ({schoolProfile?.schoolName || 'ร.ร.บ้านนิคมสายโท 12 เหนือ'})
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-slate-600">
          <div className="p-2 bg-slate-50 rounded-lg">1. นายธีรพล สินธุ (ประธานกรรมการ)</div>
          <div className="p-2 bg-slate-50 rounded-lg">2. นางสาวรัตนา สว่างศรี (กรรมการ)</div>
          <div className="p-2 bg-slate-50 rounded-lg">3. นายประดิษฐ์ ใจงาม (กรรมการ)</div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">รายการครุภัณฑ์ทั้งหมด</div>
          <div className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif] mt-0.5">
            {auditItems.length} <span className="text-xs font-normal text-slate-500">รายการ</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">ตรวจนับแล้วครบถ้วน</div>
          <div className="text-2xl font-bold text-emerald-700 font-['Kanit',sans-serif] mt-0.5">
            {verifiedCount} <span className="text-xs font-normal text-slate-500">รายการ</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">อยู่ระหว่างตรวจสอบ</div>
          <div className="text-2xl font-bold text-amber-600 font-['Kanit',sans-serif] mt-0.5">
            {pendingCount} <span className="text-xs font-normal text-slate-500">รายการ</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">หมายเลขครุภัณฑ์</th>
              <th className="p-3.5">รายการพัสดุ</th>
              <th className="p-3.5">สถานที่ตรวจสอบ</th>
              <th className="p-3.5">ผู้ตรวจนับ / วันที่</th>
              <th className="p-3.5">ผลการตรวจนับ</th>
              <th className="p-3.5 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {auditItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  ไม่พบรายการตรวจสอบ
                </td>
              </tr>
            ) : (
              auditItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono text-slate-600 font-semibold">{item.assetNumber}</td>
                  <td className="p-3.5 font-medium text-slate-900">{item.name}</td>
                  <td className="p-3.5 text-slate-500">{item.location}</td>
                  <td className="p-3.5 whitespace-nowrap">
                    <div>{item.auditor}</div>
                    <div className="text-[11px] text-slate-400">{item.auditDate}</div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    {item.status === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> ถูกต้อง ครบถ้วน
                      </span>
                    ) : item.status === 'damaged' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> ชำรุด (เสนอซ่อม/จำหน่าย)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" /> รอตรวจนับ
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() =>
                          onUpdateAuditStatus(
                            item.id,
                            item.status === 'verified' ? 'pending' : 'verified'
                          )
                        }
                        className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {item.status === 'verified' ? 'ปรับเป็นรอตรวจ' : 'ยืนยันครบถ้วน'}
                      </button>
                      {onUpdateAuditItem && (
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="แก้ไขการตรวจนับ"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteAuditItem && (
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="ลบรายการตรวจนับ"
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

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-['Kanit',sans-serif]">
                เพิ่มรายการตรวจนับพัสดุ
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">หมายเลขครุภัณฑ์</label>
                <input
                  type="text"
                  value={assetNumber}
                  onChange={(e) => setAssetNumber(e.target.value)}
                  placeholder={`ศธ 04052.12/${String(fiscalYear).slice(2)}/...`}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">รายการพัสดุ / ครุภัณฑ์ *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">สถานที่ตรวจสอบ</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ผู้ตรวจนับ</label>
                  <input
                    type="text"
                    value={auditor}
                    onChange={(e) => setAuditor(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">หมายเหตุ / ผลการตรวจ</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-['Kanit',sans-serif]">
                แก้ไขผลการตรวจสอบพัสดุ
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">หมายเลขครุภัณฑ์</label>
                <input
                  type="text"
                  required
                  value={editingItem.assetNumber}
                  onChange={(e) => setEditingItem({ ...editingItem, assetNumber: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">รายการพัสดุ *</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">สถานที่ตรวจสอบ</label>
                  <input
                    type="text"
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">สถานะ</label>
                  <select
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as AuditItem['status'] })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                  >
                    <option value="verified">ถูกต้อง ครบถ้วน</option>
                    <option value="damaged">ชำรุด</option>
                    <option value="missing">สูญหาย</option>
                    <option value="pending">รอตรวจนับ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">ผู้ตรวจนับ</label>
                <input
                  type="text"
                  value={editingItem.auditor}
                  onChange={(e) => setEditingItem({ ...editingItem, auditor: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">หมายเหตุ / ผลการตรวจ</label>
                <textarea
                  rows={2}
                  value={editingItem.notes}
                  onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleDelete(editingItem);
                    setEditingItem(null);
                  }}
                  className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  ลบรายการนี้
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    บันทึกการแก้ไข
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
