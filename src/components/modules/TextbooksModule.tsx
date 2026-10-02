import React, { useState } from 'react';
import { BookMarked, Plus, Printer, CheckCircle2, Clock, Truck, Search, Edit2, Trash2, X } from 'lucide-react';
import { TextbookRecord, SchoolProfile } from '../../types';

interface TextbooksModuleProps {
  textbooks: TextbookRecord[];
  onAddTextbook: (book: TextbookRecord) => void;
  onUpdateTextbook?: (book: TextbookRecord) => void;
  onDeleteTextbook?: (id: string) => void;
  onUpdateStatus: (id: string, status: TextbookRecord['status']) => void;
  schoolProfile?: SchoolProfile;
}

export const TextbooksModule: React.FC<TextbooksModuleProps> = ({
  textbooks,
  onAddTextbook,
  onUpdateTextbook,
  onDeleteTextbook,
  onUpdateStatus,
  schoolProfile,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<TextbookRecord | null>(null);

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
    setIsAddOpen(false);
    setTitle('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook || !editingBook.title.trim() || !onUpdateTextbook) return;

    onUpdateTextbook({
      ...editingBook,
      totalAmount: (Number(editingBook.studentCount) || 1) * (Number(editingBook.unitPrice) || 0),
    });
    setEditingBook(null);
  };

  const handleDelete = (book: TextbookRecord) => {
    if (!onDeleteTextbook) return;
    if (confirm(`คุณต้องการลบหนังสือ "${book.title}" (${book.grade}) หรือไม่?`)) {
      onDeleteTextbook(book.id);
    }
  };

  const grades = ['all', 'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6'];

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                  หนังสือเรียน (โครงการเรียนฟรี 15 ปี)
                </h2>
                {schoolProfile && (
                  <span className="hidden sm:inline-block text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {schoolProfile.schoolName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                การจัดซื้อและแจกจ่ายแบบเรียนตามนโยบายสนับสนุนค่าใช้จ่ายในการจัดการศึกษาตั้งแต่ระดับอนุบาลจนจบการศึกษาขั้นพื้นฐาน • {schoolProfile?.schoolName || 'โรงเรียนบ้านนิคมสายโท 12 เหนือ'}
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
            <span>พิมพ์บัญชีจัดซื้อ</span>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">รายการวิชาที่จัดซื้อ</div>
          <div className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif] mt-0.5">
            {filtered.length} <span className="text-xs font-normal text-slate-500">วิชา</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">จำนวนเล่มรวม</div>
          <div className="text-2xl font-bold text-slate-800 font-['Kanit',sans-serif] mt-0.5">
            {totalBooks} <span className="text-xs font-normal text-slate-500">เล่ม</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">งบประมาณหนังสือรวม</div>
          <div className="text-2xl font-bold text-emerald-700 font-['Kanit',sans-serif] mt-0.5">
            {totalAmount.toLocaleString()} <span className="text-xs font-normal text-slate-500">บาท</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อหนังสือ, สำนักพิมพ์..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-amber-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
          <span className="text-slate-400 mr-1 whitespace-nowrap">ระดับชั้น:</span>
          {grades.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedGrade === g
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g === 'all' ? 'ทุกชั้น' : g}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">ชั้น / กลุ่มสาระ</th>
              <th className="p-3.5">ชื่อหนังสือแบบเรียน</th>
              <th className="p-3.5">สำนักพิมพ์</th>
              <th className="p-3.5 text-center">จำนวนนักเรียน</th>
              <th className="p-3.5 text-right">ราคา/เล่ม</th>
              <th className="p-3.5 text-right">ราคารวม (บาท)</th>
              <th className="p-3.5 text-center">สถานะจัดส่ง</th>
              <th className="p-3.5 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  ไม่พบรายการหนังสือเรียน
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-bold text-slate-800 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200 mr-1.5">
                      {item.grade}
                    </span>
                    <span className="text-slate-500 font-medium">{item.subject}</span>
                  </td>
                  <td className="p-3.5 font-medium text-slate-900">{item.title}</td>
                  <td className="p-3.5 text-slate-500">{item.publisher}</td>
                  <td className="p-3.5 text-center font-bold text-slate-800">{item.studentCount} เล่ม</td>
                  <td className="p-3.5 text-right font-medium">{item.unitPrice} บาท</td>
                  <td className="p-3.5 text-right font-bold text-slate-900 font-['Kanit',sans-serif]">
                    {item.totalAmount.toLocaleString()} บาท
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        onUpdateStatus(item.id, e.target.value as TextbookRecord['status'])
                      }
                      className="text-xs p-1 rounded-md border border-slate-300 bg-white font-medium cursor-pointer"
                    >
                      <option value="ordered">📦 สั่งซื้อแล้ว</option>
                      <option value="received">🚚 ได้รับหนังสือแล้ว</option>
                      <option value="distributed">✓ แจกจ่ายนักเรียนแล้ว</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {onUpdateTextbook && (
                        <button
                          onClick={() => setEditingBook(item)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="แก้ไขหนังสือ"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteTextbook && (
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="ลบหนังสือ"
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
                เพิ่มรายการหนังสือเรียนใหม่
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">ระดับชั้น</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {grades.filter((g) => g !== 'all').map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">กลุ่มสาระการเรียนรู้</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="ภาษาไทย">ภาษาไทย</option>
                    <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                    <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                    <option value="สังคมศึกษา">สังคมศึกษา</option>
                    <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                    <option value="สุขศึกษาและพลศึกษา">สุขศึกษาและพลศึกษา</option>
                    <option value="ศิลปะ">ศิลปะ</option>
                    <option value="การงานอาชีพ">การงานอาชีพ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">ชื่อหนังสือแบบเรียน *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น ภาษาพาที ป.1 หรือ วรรณคดีลำนำ"
                  className="w-full p-2 border border-slate-300 rounded-lg"
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
                    min={1}
                    required
                    value={studentCount}
                    onChange={(e) => setStudentCount(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ราคาต่อเล่ม (บาท)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center text-xs">
                <span>ราคารวมทั้งสิ้น:</span>
                <span className="font-bold text-amber-950 font-['Kanit',sans-serif] text-sm">
                  {((Number(studentCount) || 0) * (Number(unitPrice) || 0)).toLocaleString()} บาท
                </span>
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
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-['Kanit',sans-serif]">
                แก้ไขรายการหนังสือเรียน
              </h3>
              <button onClick={() => setEditingBook(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">ระดับชั้น</label>
                  <select
                    value={editingBook.grade}
                    onChange={(e) => setEditingBook({ ...editingBook, grade: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {grades.filter((g) => g !== 'all').map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">กลุ่มสาระการเรียนรู้</label>
                  <input
                    type="text"
                    value={editingBook.subject}
                    onChange={(e) => setEditingBook({ ...editingBook, subject: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">ชื่อหนังสือแบบเรียน *</label>
                <input
                  type="text"
                  required
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">สำนักพิมพ์ / ผู้จัดพิมพ์</label>
                <input
                  type="text"
                  value={editingBook.publisher}
                  onChange={(e) => setEditingBook({ ...editingBook, publisher: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">จำนวนนักเรียน (เล่ม)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editingBook.studentCount}
                    onChange={(e) => setEditingBook({ ...editingBook, studentCount: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ราคาต่อเล่ม (บาท)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editingBook.unitPrice}
                    onChange={(e) => setEditingBook({ ...editingBook, unitPrice: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleDelete(editingBook);
                    setEditingBook(null);
                  }}
                  className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  ลบหนังสือนี้
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBook(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs"
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
