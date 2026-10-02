import React, { useState } from 'react';
import { BookMarked, Plus, Printer, CheckCircle2, Clock, Truck, Search } from 'lucide-react';
import { TextbookRecord } from '../../types';

interface TextbooksModuleProps {
  textbooks: TextbookRecord[];
  onAddTextbook: (book: TextbookRecord) => void;
  onUpdateStatus: (id: string, status: TextbookRecord['status']) => void;
}

export const TextbooksModule: React.FC<TextbooksModuleProps> = ({
  textbooks,
  onAddTextbook,
  onUpdateStatus,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [grade, setGrade] = useState('ป.1');
  const [subject, setSubject] = useState('ภาษาไทย');
  const [title, setTitle] = useState('');
  const [publisher, setPublisher] = useState('องค์การค้าของ สกสค.');
  const [studentCount, setStudentCount] = useState<number>(20);
  const [unitPrice, setUnitPrice] = useState<number>(65);

  const filtered = textbooks.filter((b) => {
    if (selectedGrade !== 'all' && b.grade !== selectedGrade) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.subject.toLowerCase().includes(q) ||
        b.publisher.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalAmount = filtered.reduce((s, b) => s + b.totalAmount, 0);
  const totalBooks = filtered.reduce((s, b) => s + b.studentCount, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newBook: TextbookRecord = {
      id: `tb-${Date.now()}`,
      grade,
      subject,
      title: title.trim(),
      publisher,
      studentCount: Number(studentCount) || 1,
      unitPrice: Number(unitPrice) || 0,
      totalAmount: (Number(studentCount) || 1) * (Number(unitPrice) || 0),
      status: 'ordered',
    };

    onAddTextbook(newBook);
    setTitle('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                หนังสือเรียน (เรียนฟรี 15 ปี)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                โครงการสนับสนุนค่าใช้จ่ายการจัดการศึกษาขั้นพื้นฐาน หมวดหนังสือเรียน 8 กลุ่มสาระการเรียนรู้
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
            <span>พิมพ์บัญชีจัดสรร</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ เพิ่มรายการหนังสือ</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">จำนวนเล่มหนังสือรวม</div>
          <div className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif] mt-0.5">
            {totalBooks.toLocaleString()} <span className="text-xs font-normal text-slate-500">เล่ม</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">งบประมาณหนังสือเรียนรวม</div>
          <div className="text-2xl font-bold text-amber-700 font-['Kanit',sans-serif] mt-0.5">
            {totalAmount.toLocaleString()} <span className="text-xs font-normal text-slate-500">บาท</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">แจกจ่ายให้นักเรียนแล้ว</div>
          <div className="text-2xl font-bold text-emerald-700 font-['Kanit',sans-serif] mt-0.5">
            {filtered.filter((b) => b.status === 'distributed').length}{' '}
            <span className="text-xs font-normal text-slate-500">
              จาก {filtered.length} รายการ
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อหนังสือ, สำนักพิมพ์..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-amber-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs overflow-x-auto w-full sm:w-auto">
          <span className="text-slate-400 mr-1 shrink-0">ระดับชั้น:</span>
          {['all', 'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6'].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                selectedGrade === g
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g === 'all' ? 'ทุกชั้น' : g}
            </button>
          ))}
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">ชั้น</th>
              <th className="p-3.5">ชื่อหนังสือเรียน</th>
              <th className="p-3.5">กลุ่มสาระ</th>
              <th className="p-3.5">สำนักพิมพ์</th>
              <th className="p-3.5 text-center">จำนวนนักเรียน</th>
              <th className="p-3.5 text-right">ราคา/เล่ม</th>
              <th className="p-3.5 text-right">รวมเงิน (บาท)</th>
              <th className="p-3.5 text-center">สถานะ</th>
              <th className="p-3.5 text-center">ปรับสถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((book) => (
              <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 font-bold text-amber-800 whitespace-nowrap">{book.grade}</td>
                <td className="p-3.5 font-semibold text-slate-900">{book.title}</td>
                <td className="p-3.5 text-slate-600">{book.subject}</td>
                <td className="p-3.5 text-slate-500">{book.publisher}</td>
                <td className="p-3.5 text-center font-bold">{book.studentCount} คน</td>
                <td className="p-3.5 text-right font-medium">{book.unitPrice.toLocaleString()}</td>
                <td className="p-3.5 text-right font-bold text-slate-900 font-['Kanit',sans-serif]">
                  {book.totalAmount.toLocaleString()}
                </td>
                <td className="p-3.5 text-center whitespace-nowrap">
                  {book.status === 'distributed' && (
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> แจกแล้ว
                    </span>
                  )}
                  {book.status === 'received' && (
                    <span className="text-[11px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Truck className="w-3 h-3" /> รับเข้าคลังแล้ว
                    </span>
                  )}
                  {book.status === 'ordered' && (
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> รอส่งมอบ
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-center whitespace-nowrap">
                  <select
                    value={book.status}
                    onChange={(e) => onUpdateStatus(book.id, e.target.value as TextbookRecord['status'])}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-1 text-slate-700 cursor-pointer"
                  >
                    <option value="ordered">รอส่งมอบ</option>
                    <option value="received">รับเข้าคลังแล้ว</option>
                    <option value="distributed">แจกให้นักเรียนแล้ว</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-['Kanit',sans-serif]">
              เพิ่มรายการหนังสือเรียน (เรียนฟรี 15 ปี)
            </h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">ระดับชั้น</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    {['ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">กลุ่มสาระการเรียนรู้</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    placeholder="เช่น ภาษาไทย, คณิตศาสตร์"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">ชื่อหนังสือเรียน *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="เช่น วรรณคดีลำนำ ชั้น ป.3"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">สำนักพิมพ์ / ผู้จัดพิมพ์</label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">จำนวนนักเรียน (เล่ม)</label>
                  <input
                    type="number"
                    value={studentCount}
                    onChange={(e) => setStudentCount(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ราคาต่อเล่ม (บาท)</label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs"
                >
                  บันทึกรายการ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
