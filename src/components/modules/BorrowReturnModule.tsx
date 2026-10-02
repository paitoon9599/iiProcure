import React, { useState } from 'react';
import { ArrowLeftRight, Plus, Printer, CheckCircle2, AlertCircle, Phone, Calendar, Search, Edit2, Trash2, X } from 'lucide-react';
import { BorrowRecord, SchoolProfile } from '../../types';

interface BorrowReturnModuleProps {
  borrows: BorrowRecord[];
  onAddBorrow: (rec: BorrowRecord) => void;
  onUpdateBorrow?: (rec: BorrowRecord) => void;
  onDeleteBorrow?: (id: string) => void;
  onReturnBorrow: (id: string) => void;
  schoolProfile?: SchoolProfile;
}

export const BorrowReturnModule: React.FC<BorrowReturnModuleProps> = ({
  borrows,
  onAddBorrow,
  onUpdateBorrow,
  onDeleteBorrow,
  onReturnBorrow,
  schoolProfile,
}) => {
  const [filter, setFilter] = useState<'all' | 'overdue' | 'borrowed' | 'returned'>('all');
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBorrow, setEditingBorrow] = useState<BorrowRecord | null>(null);

  // New borrow form
  const [assetName, setAssetName] = useState('เครื่องฉายโปรเจคเตอร์ Epson EB-X06');
  const [borrowerName, setBorrowerName] = useState('');
  const [department, setDepartment] = useState('สายชั้นประถมศึกษาปีที่ 3');
  const [borrowDate, setBorrowDate] = useState('1 ต.ค. 69');
  const [dueDate, setDueDate] = useState('3 ต.ค. 69');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  const filtered = borrows.filter((b) => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.borrowerName.toLowerCase().includes(q) ||
        b.assetName.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const overdueCount = borrows.filter((b) => b.status === 'overdue').length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowerName.trim()) return;

    const newBorrow: BorrowRecord = {
      id: `borrow-${Date.now()}`,
      code: `ยพ-69/${Math.floor(Math.random() * 900 + 100)}`,
      assetName,
      borrowerName: borrowerName.trim(),
      department,
      borrowDate,
      dueDate,
      status: 'borrowed',
      phone,
      note,
    };

    onAddBorrow(newBorrow);
    setIsAddOpen(false);
    setBorrowerName('');
    setPhone('');
    setNote('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBorrow || !editingBorrow.borrowerName.trim() || !onUpdateBorrow) return;

    onUpdateBorrow(editingBorrow);
    setEditingBorrow(null);
  };

  const handleDelete = (borrow: BorrowRecord) => {
    if (!onDeleteBorrow) return;
    if (confirm(`คุณต้องการลบรายการยืม "${borrow.assetName}" ของ ${borrow.borrowerName} หรือไม่?`)) {
      onDeleteBorrow(borrow.id);
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-700">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                  ยืม-คืนพัสดุ (Equipment Loan)
                </h2>
                {schoolProfile && (
                  <span className="hidden sm:inline-block text-[11px] font-semibold text-orange-800 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                    {schoolProfile.schoolName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ติดตามการยืม-คืนอุปกรณ์โสตทัศนูปกรณ์ เครื่องเสียง คอมพิวเตอร์ และพัสดุส่วนกลาง • {schoolProfile?.schoolName || 'โรงเรียนบ้านนิคมสายโท 12 เหนือ'}
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
            <span>พิมพ์รายงานยืม-คืน</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ บันทึกการยืมพัสดุ</span>
          </button>
        </div>
      </div>

      {/* Overdue Warning Alert */}
      {overdueCount > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-xs text-red-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              มีพัสดุที่ <strong>เกินกำหนดส่งคืน {overdueCount} รายการ</strong> โปรดติดตามประสานงานผู้ยืมเพื่อส่งมอบคืนคลัง
            </span>
          </div>
          <button
            onClick={() => setFilter('overdue')}
            className="font-bold underline hover:text-red-700 cursor-pointer"
          >
            กรองดูเฉพาะเกินกำหนด
          </button>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อผู้ยืม, รายการ, รหัส..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 mr-1">สถานะ:</span>
          {(['all', 'borrowed', 'overdue', 'returned'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === s
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'all'
                ? 'ทั้งหมด'
                : s === 'borrowed'
                ? 'กำลังยืม'
                : s === 'overdue'
                ? 'เกินกำหนด'
                : 'คืนแล้ว'}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Records */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">รหัสการยืม</th>
              <th className="p-3.5">รายการพัสดุ / ครุภัณฑ์</th>
              <th className="p-3.5">ผู้ยืม / หน่วยงาน</th>
              <th className="p-3.5">วันที่ยืม - กำหนดคืน</th>
              <th className="p-3.5 text-center">สถานะ</th>
              <th className="p-3.5 text-center">การส่งคืน</th>
              <th className="p-3.5 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  ไม่พบรายการยืม-คืนพัสดุ
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono text-slate-600 font-semibold whitespace-nowrap">
                    {item.code}
                  </td>
                  <td className="p-3.5 font-medium text-slate-900">
                    <div>{item.assetName}</div>
                    {item.note && (
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.note}</div>
                    )}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="font-semibold text-slate-800">{item.borrowerName}</div>
                    <div className="text-[11px] text-slate-400">{item.department}</div>
                    {item.phone && (
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-2.5 h-2.5" />
                        <span>{item.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <div>ยืม: {item.borrowDate}</div>
                    <div className="text-slate-500 font-medium">กำหนด: {item.dueDate}</div>
                    {item.returnDate && (
                      <div className="text-[11px] text-emerald-700">คืนเมื่อ: {item.returnDate}</div>
                    )}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    {item.status === 'overdue' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3" /> เกินกำหนด
                      </span>
                    )}
                    {item.status === 'borrowed' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                        กำลังยืม
                      </span>
                    )}
                    {item.status === 'returned' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> คืนแล้ว
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    {item.status !== 'returned' ? (
                      <button
                        onClick={() => onReturnBorrow(item.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      >
                        รับคืนพัสดุ
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">เรียบร้อย</span>
                    )}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {onUpdateBorrow && (
                        <button
                          onClick={() => setEditingBorrow(item)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="แก้ไขรายการยืม"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteBorrow && (
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="ลบรายการยืม"
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
                บันทึกการยืมพัสดุ
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">รายการพัสดุที่ยืม *</label>
                <input
                  type="text"
                  required
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="เช่น กล้องถ่ายรูป, โปรเจคเตอร์, ลำโพงบลูทูธ"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">ชื่อผู้ยืม *</label>
                <input
                  type="text"
                  required
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="เช่น ครูสมหมาย หรือ นางสาววรรณา"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">กลุ่มงาน / สายชั้น</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">วันที่ยืม</label>
                  <input
                    type="text"
                    value={borrowDate}
                    onChange={(e) => setBorrowDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">กำหนดส่งคืน</label>
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">หมายเหตุ / วัตถุประสงค์</label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="ระบุสถานที่นำไปใช้ หรือกิจกรรม"
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  บันทึกการยืม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingBorrow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-['Kanit',sans-serif]">
                แก้ไขรายการยืม ({editingBorrow.code})
              </h3>
              <button onClick={() => setEditingBorrow(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">รายการพัสดุที่ยืม *</label>
                <input
                  type="text"
                  required
                  value={editingBorrow.assetName}
                  onChange={(e) => setEditingBorrow({ ...editingBorrow, assetName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">ชื่อผู้ยืม *</label>
                <input
                  type="text"
                  required
                  value={editingBorrow.borrowerName}
                  onChange={(e) => setEditingBorrow({ ...editingBorrow, borrowerName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">กลุ่มงาน / สายชั้น</label>
                  <input
                    type="text"
                    value={editingBorrow.department}
                    onChange={(e) => setEditingBorrow({ ...editingBorrow, department: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={editingBorrow.phone || ''}
                    onChange={(e) => setEditingBorrow({ ...editingBorrow, phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">กำหนดส่งคืน</label>
                  <input
                    type="text"
                    value={editingBorrow.dueDate}
                    onChange={(e) => setEditingBorrow({ ...editingBorrow, dueDate: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">สถานะ</label>
                  <select
                    value={editingBorrow.status}
                    onChange={(e) => setEditingBorrow({ ...editingBorrow, status: e.target.value as BorrowRecord['status'] })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="borrowed">กำลังยืม</option>
                    <option value="overdue">เกินกำหนด</option>
                    <option value="returned">คืนแล้ว</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">หมายเหตุ / วัตถุประสงค์</label>
                <textarea
                  rows={2}
                  value={editingBorrow.note || ''}
                  onChange={(e) => setEditingBorrow({ ...editingBorrow, note: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleDelete(editingBorrow);
                    setEditingBorrow(null);
                  }}
                  className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  ลบรายการนี้
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBorrow(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
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
