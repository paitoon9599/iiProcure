import React, { useState } from 'react';
import { ArrowLeftRight, Plus, Printer, CheckCircle2, AlertCircle, Phone, Calendar, Search } from 'lucide-react';
import { BorrowRecord } from '../../types';

interface BorrowReturnModuleProps {
  borrows: BorrowRecord[];
  onAddBorrow: (rec: BorrowRecord) => void;
  onReturnBorrow: (id: string) => void;
}

export const BorrowReturnModule: React.FC<BorrowReturnModuleProps> = ({
  borrows,
  onAddBorrow,
  onReturnBorrow,
}) => {
  const [filter, setFilter] = useState<'all' | 'overdue' | 'borrowed' | 'returned'>('all');
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

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
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                ทะเบียนยืม-คืนพัสดุและครุภัณฑ์
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ติดตามการยืมใช้อุปกรณ์ โสตทัศนูปกรณ์ และเครื่องมือการเรียนการสอนของโรงเรียน
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
            <span>พิมพ์ทะเบียนยืม-คืน</span>
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

      {/* Overdue Warning Callout */}
      {overdueCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between text-xs text-red-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>
              <strong>แจ้งเตือน:</strong> มีพัสดุเกินกำหนดส่งคืน <strong>{overdueCount} รายการ</strong> (รวมถึง ครูมาลี ตั้งใจ) กรุณาติดตามคืนพัสดุ
            </span>
          </div>
          <button
            onClick={() => setFilter('overdue')}
            className="px-3 py-1 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 cursor-pointer"
          >
            กรองดูเฉพาะที่เกินกำหนด
          </button>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อผู้ยืม, อุปกรณ์, รหัส..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs w-full sm:w-auto">
          {(
            [
              { id: 'all', label: 'ทั้งหมด' },
              { id: 'overdue', label: `เกินกำหนด (${overdueCount})` },
              { id: 'borrowed', label: 'กำลังยืม' },
              { id: 'returned', label: 'ส่งคืนแล้ว' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === tab.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">รหัสรายการ</th>
              <th className="p-3.5">รายการพัสดุ / ครุภัณฑ์</th>
              <th className="p-3.5">ผู้ยืม / กลุ่มงาน</th>
              <th className="p-3.5">วันที่ยืม</th>
              <th className="p-3.5">กำหนดส่งคืน</th>
              <th className="p-3.5 text-center">สถานะ</th>
              <th className="p-3.5 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((item) => (
              <tr
                key={item.id}
                className={`hover:bg-slate-50 transition-colors ${
                  item.status === 'overdue' ? 'bg-red-50/30' : ''
                }`}
              >
                <td className="p-3.5 font-mono text-slate-500 font-semibold whitespace-nowrap">
                  {item.code}
                </td>
                <td className="p-3.5 font-semibold text-slate-900 max-w-xs">
                  <div>{item.assetName}</div>
                  {item.note && (
                    <div className="text-[11px] text-slate-400 font-normal mt-0.5">{item.note}</div>
                  )}
                </td>
                <td className="p-3.5 whitespace-nowrap">
                  <div className="font-medium text-slate-900">{item.borrowerName}</div>
                  <div className="text-[11px] text-slate-400">{item.department}</div>
                </td>
                <td className="p-3.5 whitespace-nowrap text-slate-600">{item.borrowDate}</td>
                <td className="p-3.5 whitespace-nowrap font-medium text-slate-800">
                  {item.dueDate}
                </td>
                <td className="p-3.5 text-center whitespace-nowrap">
                  {item.status === 'overdue' && (
                    <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                      ⚠️ เกินกำหนด
                    </span>
                  )}
                  {item.status === 'borrowed' && (
                    <span className="text-[11px] font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      ⏳ กำลังยืม
                    </span>
                  )}
                  {item.status === 'returned' && (
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ คืนแล้ว
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-center whitespace-nowrap">
                  {item.status !== 'returned' ? (
                    <button
                      onClick={() => onReturnBorrow(item.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      ✓ บันทึกรับคืน
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">ส่งคืนเรียบร้อย</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-['Kanit',sans-serif]">
              บันทึกการยืมพัสดุ / ครุภัณฑ์
            </h3>
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
    </div>
  );
};
