import React, { useState } from 'react';
import { Megaphone, Printer, Calendar, FileText, CheckCircle2, AlertTriangle, Download, Plus, Edit2, Trash2, X } from 'lucide-react';
import { ProcurementTask, SchoolProfile } from '../../types';

interface QuarterlyAnnouncementProps {
  tasks: ProcurementTask[];
  fiscalYear: number;
  schoolProfile?: SchoolProfile;
}

interface CustomAnnouncementItem {
  id: string;
  quarter: number;
  title: string;
  amount: number;
  method: string;
  vendor: string;
  reason: string;
  poNumber: string;
}

export const QuarterlyAnnouncementModule: React.FC<QuarterlyAnnouncementProps> = ({
  tasks,
  fiscalYear,
  schoolProfile,
}) => {
  const [selectedQuarter, setSelectedQuarter] = useState<number>(4);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [customItems, setCustomItems] = useState<CustomAnnouncementItem[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomAnnouncementItem | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState<number>(10000);
  const [formMethod, setFormMethod] = useState('เฉพาะเจาะจง');
  const [formVendor, setFormVendor] = useState('');
  const [formReason, setFormReason] = useState('ราคาเหมาะสมตามท้องตลาด');
  const [formPo, setFormPo] = useState('');

  // Group tasks into quarters:
  const quarters = [
    { q: 1, name: 'ไตรมาสที่ 1', period: '1 ต.ค. - 31 ธ.ค.', status: 'ประกาศแล้ว' },
    { q: 2, name: 'ไตรมาสที่ 2', period: '1 ม.ค. - 31 มี.ค.', status: 'ประกาศแล้ว' },
    { q: 3, name: 'ไตรมาสที่ 3', period: '1 เม.ย. - 30 มิ.ย.', status: 'ประกาศแล้ว' },
    { q: 4, name: 'ไตรมาสที่ 4', period: '1 ก.ค. - 30 ก.ย.', status: 'ยังไม่ได้ประกาศ (กำหนด 30 ต.ค. 69)' },
  ];

  const qTasks = selectedQuarter === 4 ? tasks.slice(0, 10) : tasks.slice(0, 5);
  const quarterCustom = customItems.filter((i) => i.quarter === selectedQuarter);
  const totalQuarterAmount =
    qTasks.reduce((s, t) => s + t.amount, 0) +
    quarterCustom.reduce((s, i) => s + i.amount, 0);

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newItem: CustomAnnouncementItem = {
      id: `ann-${Date.now()}`,
      quarter: selectedQuarter,
      title: formTitle.trim(),
      amount: Number(formAmount) || 0,
      method: formMethod,
      vendor: formVendor.trim() || 'ร้านค้าทั่วไป',
      reason: formReason.trim(),
      poNumber: formPo.trim() || `PO-${Math.floor(Math.random() * 900 + 100)}/${fiscalYear}`,
    };

    setCustomItems([...customItems, newItem]);
    setIsAddOpen(false);
    setFormTitle('');
    setFormVendor('');
    setFormPo('');
  };

  const handleSaveEditCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title.trim()) return;

    setCustomItems(customItems.map((i) => (i.id === editingItem.id ? editingItem : i)));
    setEditingItem(null);
  };

  const handleDeleteCustom = (id: string) => {
    if (confirm('คุณต้องการลบรายการประกาศนี้หรือไม่?')) {
      setCustomItems(customItems.filter((i) => i.id !== id));
    }
  };

  const handlePublish = () => {
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 4000);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                  ประกาศผลการจัดซื้อจัดจ้างรายไตรมาส (แบบ สขร. 1)
                </h2>
                {schoolProfile && (
                  <span className="hidden sm:inline-block text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {schoolProfile.schoolName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                สรุปผลการจัดซื้อจัดจ้างเพื่อเผยแพร่ตาม พ.ร.บ. ข้อมูลข่าวสารของราชการ พ.ศ. 2540 • {schoolProfile?.schoolName || 'โรงเรียนบ้านนิคมสายโท 12 เหนือ'}
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
            <span>พิมพ์แบบ สขร. 1</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ เพิ่มรายการ สขร.1</span>
          </button>
          <button
            onClick={handlePublish}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>บันทึกการเผยแพร่</span>
          </button>
        </div>
      </div>

      {publishSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-2 text-xs text-emerald-900 font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>บันทึกการเผยแพร่ประกาศ สขร. 1 ประจำไตรมาสที่ {selectedQuarter} สำเร็จแล้ว</span>
        </div>
      )}

      {/* Quarter Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {quarters.map((q) => {
          const isSelected = selectedQuarter === q.q;
          const isQ4 = q.q === 4;
          return (
            <div
              key={q.q}
              onClick={() => setSelectedQuarter(q.q)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{q.name}</span>
                {isQ4 ? (
                  <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-sm">
                    รอประกาศ
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-sm">
                    ประกาศแล้ว
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{q.period}</span>
              </div>
              <div className="text-sm font-extrabold text-slate-800 font-['Kanit',sans-serif] mt-2">
                {isQ4 ? '10 รายการ' : '5 รายการ'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Notification banner for Q4 */}
      {selectedQuarter === 4 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <strong>ไตรมาสที่ 4 ยังไม่ได้ประกาศ:</strong> รวบรวมข้อมูลครบทั้ง 10 รายการแล้ว
            กำหนดประกาศเผยแพร่บนเว็บไซต์โรงเรียนและบอร์ดประชาสัมพันธ์ภายในวันที่ <strong>30 ต.ค. {fiscalYear}</strong>
          </div>
        </div>
      )}

      {/* Official Form สขร. 1 Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-sm text-slate-900 font-['Kanit',sans-serif]">
              แบบ สขร. 1 สรุปผลการจัดซื้อจัดจ้าง ไตรมาสที่ {selectedQuarter} ปีงบประมาณ {fiscalYear}
            </h3>
            <p className="text-[11px] text-slate-500">
              {schoolProfile?.schoolName || 'โรงเรียนบ้านนิคมสายโท 12 เหนือ'} {schoolProfile?.districtOffice || 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษาบุรีรัมย์ เขต 2'}
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-700">
            ยอดรวม: {totalQuarterAmount.toLocaleString()} บาท
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2.5 border-r border-slate-200 text-center w-10">ลำดับ</th>
                <th className="p-2.5 border-r border-slate-200">งานจัดซื้อจัดจ้าง</th>
                <th className="p-2.5 border-r border-slate-200 text-right">วงเงินงบประมาณ (บาท)</th>
                <th className="p-2.5 border-r border-slate-200 text-right">ราคากลาง (บาท)</th>
                <th className="p-2.5 border-r border-slate-200">วิธีซื้อหรือจ้าง</th>
                <th className="p-2.5 border-r border-slate-200">ผู้ได้รับการคัดเลือก</th>
                <th className="p-2.5 border-r border-slate-200 text-right">ราคาที่ตกลงซื้อจ้าง</th>
                <th className="p-2.5 border-r border-slate-200 text-center">เหตุผลที่คัดเลือก</th>
                <th className="p-2.5 border-r border-slate-200 text-center">เลขที่และวันที่สัญญา</th>
                <th className="p-2.5 text-center w-16">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-['Sarabun',sans-serif]">
              {qTasks.map((t, idx) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="p-2.5 border-r border-slate-100 text-center font-mono">{idx + 1}</td>
                  <td className="p-2.5 border-r border-slate-100 font-semibold text-slate-800 max-w-xs">{t.title}</td>
                  <td className="p-2.5 border-r border-slate-100 text-right font-medium">{t.amount.toLocaleString()}</td>
                  <td className="p-2.5 border-r border-slate-100 text-right font-medium">{t.amount.toLocaleString()}</td>
                  <td className="p-2.5 border-r border-slate-100 whitespace-nowrap">
                    {t.type === 'w804' ? 'เฉพาะเจาะจง (ว.804)' : 'เฉพาะเจาะจง'}
                  </td>
                  <td className="p-2.5 border-r border-slate-100 font-medium text-slate-900">{t.vendorName}</td>
                  <td className="p-2.5 border-r border-slate-100 text-right font-bold text-slate-900 font-['Kanit',sans-serif]">
                    {t.amount.toLocaleString()}
                  </td>
                  <td className="p-2.5 border-r border-slate-100 text-center text-slate-600 text-[11px]">
                    ราคาเหมาะสมตามท้องตลาด
                  </td>
                  <td className="p-2.5 border-r border-slate-100 text-center font-mono text-[11px] whitespace-nowrap">
                    {t.poNumber} ({t.dateStr})
                  </td>
                  <td className="p-2.5 text-center text-slate-400 text-[11px]">
                    ระบบอัตโนมัติ
                  </td>
                </tr>
              ))}
              {quarterCustom.map((item, cIdx) => (
                <tr key={item.id} className="hover:bg-amber-50/50 bg-amber-50/20">
                  <td className="p-2.5 border-r border-slate-100 text-center font-mono">{qTasks.length + cIdx + 1}</td>
                  <td className="p-2.5 border-r border-slate-100 font-semibold text-slate-900 max-w-xs">
                    {item.title} <span className="text-[10px] text-amber-700 bg-amber-100 px-1 py-0.5 rounded-sm font-normal">เพิ่มเอง</span>
                  </td>
                  <td className="p-2.5 border-r border-slate-100 text-right font-medium">{item.amount.toLocaleString()}</td>
                  <td className="p-2.5 border-r border-slate-100 text-right font-medium">{item.amount.toLocaleString()}</td>
                  <td className="p-2.5 border-r border-slate-100 whitespace-nowrap">{item.method}</td>
                  <td className="p-2.5 border-r border-slate-100 font-medium text-slate-900">{item.vendor}</td>
                  <td className="p-2.5 border-r border-slate-100 text-right font-bold text-slate-900 font-['Kanit',sans-serif]">
                    {item.amount.toLocaleString()}
                  </td>
                  <td className="p-2.5 border-r border-slate-100 text-center text-slate-600 text-[11px]">{item.reason}</td>
                  <td className="p-2.5 border-r border-slate-100 text-center font-mono text-[11px] whitespace-nowrap">{item.poNumber}</td>
                  <td className="p-2.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded cursor-pointer"
                        title="แก้ไข"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustom(item.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                        title="ลบ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custom Announcement Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-['Kanit',sans-serif]">
                เพิ่มรายการประกาศ สขร. 1 (ไตรมาสที่ {selectedQuarter})
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCustom} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">งานจัดซื้อจัดจ้าง *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="เช่น ซื้อวัสดุสื่อการเรียนการสอนปฐมวัย"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">วงเงินงบประมาณ (บาท) *</label>
                  <input
                    type="number"
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">วิธีซื้อหรือจ้าง</label>
                  <input
                    type="text"
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">ผู้ได้รับการคัดเลือก *</label>
                  <input
                    type="text"
                    required
                    value={formVendor}
                    onChange={(e) => setFormVendor(e.target.value)}
                    placeholder="เช่น หจก. บุรีรัมย์ศึกษาภัณฑ์"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">เลขที่และวันที่สัญญา/ใบสั่งซื้อ</label>
                  <input
                    type="text"
                    value={formPo}
                    onChange={(e) => setFormPo(e.target.value)}
                    placeholder="เช่น PO-012/2569 (1 ต.ค. 69)"
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">เหตุผลที่คัดเลือก</label>
                <input
                  type="text"
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  บันทึกรายการ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Custom Announcement Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-['Kanit',sans-serif]">
                แก้ไขรายการประกาศ สขร. 1
              </h3>
              <button onClick={() => setEditingItem(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEditCustom} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">งานจัดซื้อจัดจ้าง *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">วงเงินงบประมาณ (บาท) *</label>
                  <input
                    type="number"
                    required
                    value={editingItem.amount}
                    onChange={(e) => setEditingItem({ ...editingItem, amount: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">วิธีซื้อหรือจ้าง</label>
                  <input
                    type="text"
                    value={editingItem.method}
                    onChange={(e) => setEditingItem({ ...editingItem, method: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">ผู้ได้รับการคัดเลือก *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.vendor}
                    onChange={(e) => setEditingItem({ ...editingItem, vendor: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">เลขที่และวันที่สัญญา</label>
                  <input
                    type="text"
                    value={editingItem.poNumber}
                    onChange={(e) => setEditingItem({ ...editingItem, poNumber: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">เหตุผลที่คัดเลือก</label>
                <input
                  type="text"
                  value={editingItem.reason}
                  onChange={(e) => setEditingItem({ ...editingItem, reason: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
