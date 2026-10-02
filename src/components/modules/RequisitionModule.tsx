import React, { useState } from 'react';
import { FileCheck2, Plus, Printer, CheckCircle2, Clock, Check, Search, Edit2, Trash2, X } from 'lucide-react';
import { RequisitionSlip, MaterialItem, SchoolProfile } from '../../types';

interface RequisitionModuleProps {
  requisitions: RequisitionSlip[];
  materials: MaterialItem[];
  onAddRequisition: (req: RequisitionSlip) => void;
  onUpdateRequisition?: (req: RequisitionSlip) => void;
  onDeleteRequisition?: (id: string) => void;
  onUpdateStatus: (id: string, status: RequisitionSlip['status']) => void;
  schoolProfile?: SchoolProfile;
}

export const RequisitionModule: React.FC<RequisitionModuleProps> = ({
  requisitions,
  materials,
  onAddRequisition,
  onUpdateRequisition,
  onDeleteRequisition,
  onUpdateStatus,
  schoolProfile,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'disbursed'>('all');
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSlip, setEditingSlip] = useState<RequisitionSlip | null>(null);
  const [selectedSlip, setSelectedSlip] = useState<RequisitionSlip | null>(null);

  // New slip form
  const [requesterName, setRequesterName] = useState('ครูสมศรี มีสุข');
  const [department, setDepartment] = useState('สายชั้นประถมศึกษาปีที่ 1');
  const [purpose, setPurpose] = useState('ใช้ในการจัดการเรียนการสอนและพิมพ์ใบงานประจำสัปดาห์');
  const [selectedMat, setSelectedMat] = useState(materials[0]?.name || 'กระดาษถ่ายเอกสาร A4 80 แกรม (Double A)');
  const [qty, setQty] = useState(2);
  const [unit, setUnit] = useState('รีม');

  const filtered = requisitions.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.requesterName.toLowerCase().includes(q) ||
        r.slipNumber.toLowerCase().includes(q) ||
        r.purpose.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlip: RequisitionSlip = {
      id: `req-${Date.now()}`,
      slipNumber: `บพ ${Math.floor(Math.random() * 90 + 10)}/2569`,
      date: '1 ต.ค. 69',
      requesterName: requesterName.trim(),
      department: department.trim(),
      items: [{ name: selectedMat, quantity: Number(qty) || 1, unit: unit.trim() }],
      purpose: purpose.trim(),
      status: 'pending',
    };

    onAddRequisition(newSlip);
    setIsAddOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlip || !editingSlip.requesterName.trim() || !onUpdateRequisition) return;

    onUpdateRequisition(editingSlip);
    setEditingSlip(null);
  };

  const handleDelete = (slip: RequisitionSlip) => {
    if (!onDeleteRequisition) return;
    if (confirm(`คุณต้องการลบใบเบิกเลขที่ "${slip.slipNumber}" ของ ${slip.requesterName} หรือไม่?`)) {
      onDeleteRequisition(slip.id);
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                  ใบเบิกพัสดุ (Requisitions)
                </h2>
                {schoolProfile && (
                  <span className="hidden sm:inline-block text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    {schoolProfile.schoolName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ระบบจัดการคำขอเบิกพัสดุ/วัสดุการศึกษาของคณะครูและบุคลากรทางการศึกษา • {schoolProfile?.schoolName || 'โรงเรียนบ้านนิคมสายโท 12 เหนือ'}
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
            <span>พิมพ์รายงานใบเบิก</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ เขียนใบขอเบิกพัสดุ</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อผู้เบิก, เลขที่ใบเบิก..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 mr-1">สถานะ:</span>
          {(['all', 'pending', 'approved', 'disbursed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === s
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'all'
                ? 'ทั้งหมด'
                : s === 'pending'
                ? 'รออนุมัติ'
                : s === 'approved'
                ? 'อนุมัติแล้ว'
                : 'จ่ายแล้ว'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Slips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center text-sm text-slate-400 rounded-2xl border border-slate-200">
            ไม่พบรายการใบเบิกพัสดุ
          </div>
        ) : (
          filtered.map((req) => (
            <div
              key={req.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-teal-700 bg-teal-50 font-bold px-2 py-0.5 rounded-md border border-teal-100">
                    {req.slipNumber}
                  </span>
                  <span className="text-slate-400">{req.date}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base font-['Kanit',sans-serif]">
                  {req.requesterName}
                </h3>
                <p className="text-xs text-slate-500">{req.department}</p>

                <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="font-semibold text-slate-700">รายการที่ขอเบิก:</div>
                  {req.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-slate-600">
                      <span>• {it.name}</span>
                      <span className="font-bold text-slate-900">
                        {it.quantity} {it.unit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">เหตุผล: </span>
                  {req.purpose}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 mt-3">
                <div className="flex items-center justify-between">
                  <div>
                    {req.status === 'pending' && (
                      <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> รออนุมัติ
                      </span>
                    )}
                    {req.status === 'approved' && (
                      <span className="text-[11px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Check className="w-3 h-3" /> อนุมัติแล้ว (รอจ่าย)
                      </span>
                    )}
                    {req.status === 'disbursed' && (
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> จ่ายพัสดุแล้ว
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {onUpdateRequisition && (
                      <button
                        onClick={() => setEditingSlip(req)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        title="แก้ไขใบเบิก"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDeleteRequisition && (
                      <button
                        onClick={() => handleDelete(req)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="ลบใบเบิก"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    {req.status === 'pending' && (
                      <button
                        onClick={() => onUpdateStatus(req.id, 'approved')}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        อนุมัติ
                      </button>
                    )}
                    {req.status === 'approved' && (
                      <button
                        onClick={() => onUpdateStatus(req.id, 'disbursed')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        จ่ายพัสดุ
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedSlip(req)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    พิมพ์ใบเบิก
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Slip Print Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 border border-slate-100 font-['Sarabun',sans-serif] space-y-4">
            <div className="text-center font-bold text-base border-b pb-2">
              ใบเบิกพัสดุ{schoolProfile?.schoolName || 'โรงเรียนบ้านนิคมสายโท 12 เหนือ'}
            </div>
            <div className="flex justify-between text-xs">
              <div>เลขที่: {selectedSlip.slipNumber}</div>
              <div>วันที่: {selectedSlip.date}</div>
            </div>
            <div className="text-xs">
              <strong>ผู้ขอเบิก:</strong> {selectedSlip.requesterName} ({selectedSlip.department})
            </div>
            <div className="text-xs">
              <strong>เพื่อใช้ในราชการ:</strong> {selectedSlip.purpose}
            </div>

            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300">ลำดับ</th>
                  <th className="p-2 border-r border-slate-300">รายการพัสดุ</th>
                  <th className="p-2 text-center">จำนวน</th>
                </tr>
              </thead>
              <tbody>
                {selectedSlip.items.map((it, i) => (
                  <tr key={i} className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-300 text-center">{i + 1}</td>
                    <td className="p-2 border-r border-slate-300">{it.name}</td>
                    <td className="p-2 text-center font-bold">{it.quantity} {it.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pt-6 grid grid-cols-2 text-center text-xs gap-4">
              <div>
                <div>ลงชื่อ..................................ผู้เบิก</div>
                <div className="font-semibold mt-1">({selectedSlip.requesterName})</div>
              </div>
              <div>
                <div>ลงชื่อ..................................ผู้จ่ายพัสดุ</div>
                <div className="font-semibold mt-1">({schoolProfile?.directorName ? 'ครูทัศน์พล เจริญสุข' : 'ครูทัศน์พล เจริญสุข'})</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                พิมพ์ใบเบิกนี้
              </button>
              <button
                onClick={() => setSelectedSlip(null)}
                className="px-4 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-['Kanit',sans-serif]">
                เขียนใบขอเบิกพัสดุ
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">ชื่อผู้ขอเบิก *</label>
                <input
                  type="text"
                  required
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

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
                <label className="block font-semibold mb-1">รายการพัสดุที่จะขอเบิก</label>
                <select
                  value={selectedMat}
                  onChange={(e) => setSelectedMat(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} (คงเหลือในคลัง {m.balance} {m.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">จำนวนที่ขอเบิก</label>
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">หน่วยนับ</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">วัตถุประสงค์ในการนำไปใช้</label>
                <textarea
                  rows={2}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
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
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                >
                  ส่งใบเบิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-['Kanit',sans-serif]">
                แก้ไขใบขอเบิกพัสดุ ({editingSlip.slipNumber})
              </h3>
              <button onClick={() => setEditingSlip(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">ชื่อผู้ขอเบิก *</label>
                <input
                  type="text"
                  required
                  value={editingSlip.requesterName}
                  onChange={(e) => setEditingSlip({ ...editingSlip, requesterName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">กลุ่มงาน / สายชั้น</label>
                <input
                  type="text"
                  value={editingSlip.department}
                  onChange={(e) => setEditingSlip({ ...editingSlip, department: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">สถานะ</label>
                <select
                  value={editingSlip.status}
                  onChange={(e) => setEditingSlip({ ...editingSlip, status: e.target.value as RequisitionSlip['status'] })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="pending">รออนุมัติ</option>
                  <option value="approved">อนุมัติแล้ว (รอจ่าย)</option>
                  <option value="disbursed">จ่ายพัสดุแล้ว</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">วัตถุประสงค์ในการนำไปใช้</label>
                <textarea
                  rows={2}
                  value={editingSlip.purpose}
                  onChange={(e) => setEditingSlip({ ...editingSlip, purpose: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleDelete(editingSlip);
                    setEditingSlip(null);
                  }}
                  className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  ลบใบเบิกนี้
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSlip(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
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
