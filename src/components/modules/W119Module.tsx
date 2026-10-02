import React, { useState } from 'react';
import { Receipt, Plus, Printer, CheckCircle2, Search, Info, Edit2, Trash2 } from 'lucide-react';
import { ProcurementTask, SchoolProfile } from '../../types';

interface W119ModuleProps {
  tasks: ProcurementTask[];
  onOpenWizard: () => void;
  onSelectTask: (task: ProcurementTask) => void;
  fiscalYear: number;
  schoolProfile?: SchoolProfile;
  onAddNewTask?: () => void;
  onEditTask?: (task: ProcurementTask) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const W119Module: React.FC<W119ModuleProps> = ({
  tasks,
  onOpenWizard,
  onSelectTask,
  fiscalYear,
  schoolProfile,
  onAddNewTask,
  onEditTask,
  onDeleteTask,
}) => {
  const [search, setSearch] = useState('');
  const w119Tasks = tasks.filter((t) => t.type === 'w119');

  const filtered = w119Tasks.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.vendorName.toLowerCase().includes(q) ||
      t.poNumber.toLowerCase().includes(q)
    );
  });

  const totalAmount = filtered.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                  ว.119 ค่าใช้จ่ายบริหารงาน
                </h2>
                {schoolProfile && (
                  <span className="hidden sm:inline-block text-[11px] font-semibold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                    {schoolProfile.schoolName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                การเบิกจ่ายค่าใช้จ่ายในการบริหารงานของสถานศึกษาตามหนังสือเวียน กค 0408.4/ว 119 • {schoolProfile?.schoolName || 'โรงเรียนบ้านนิคมสายโท 12 เหนือ'}
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
            <span>พิมพ์รายงาน ว.119</span>
          </button>
          {onAddNewTask && (
            <button
              onClick={onAddNewTask}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ บันทึก ว.119</span>
            </button>
          )}
          <button
            onClick={onOpenWizard}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างแบบทีละข้อ</span>
          </button>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-4 text-xs text-indigo-900 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-indigo-950">หลักเกณฑ์การเบิกจ่ายค่าใช้จ่ายบริหารงาน ว 119:</div>
          <p className="text-indigo-800 leading-relaxed">
            ครอบคลุมค่าใช้จ่ายดำเนินงานปกติ เช่น ค่าอาหารว่างและเครื่องดื่มในการประชุมราชการ ค่าวัสดุจำเป็นขนาดเล็ก ค่าน้ำมันเชื้อเพลิง ค่าซ่อมแซมวัสดุอุปกรณ์สำนักงานเบื้องต้น โดยหัวหน้าสถานศึกษาเป็นผู้อนุมัติ
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">รายการค่าใช้จ่ายบริหารงาน</div>
          <div className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif] mt-0.5">
            {w119Tasks.length} <span className="text-xs font-normal text-slate-500">รายการ</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">ยอดเบิกจ่ายรวม</div>
          <div className="text-2xl font-bold text-indigo-700 font-['Kanit',sans-serif] mt-0.5">
            {totalAmount.toLocaleString()} <span className="text-xs font-normal text-slate-500">บาท</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">สถานะการเบิกเงิน</div>
          <div className="text-2xl font-bold text-emerald-700 font-['Kanit',sans-serif] mt-0.5">
            100% <span className="text-xs font-normal text-slate-500">เบิกจ่ายครบถ้วน</span>
          </div>
        </div>
      </div>

      {/* Table list */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">วันที่ / เลขที่</th>
              <th className="p-3.5">รายการค่าใช้จ่าย</th>
              <th className="p-3.5">ร้านค้า / ผู้รับเงิน</th>
              <th className="p-3.5">แหล่งเงิน</th>
              <th className="p-3.5 text-right">จำนวนเงิน (บาท)</th>
              <th className="p-3.5 text-center">หลักฐาน</th>
              <th className="p-3.5 text-center">ดูเอกสาร</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 whitespace-nowrap">
                  <div className="font-semibold text-slate-800">{item.dateStr}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{item.poNumber}</div>
                </td>
                <td className="p-3.5 font-medium text-slate-900">
                  <div>{item.title}</div>
                  {item.projectName && (
                    <div className="text-[11px] text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-100 font-medium inline-block mt-1">
                      {item.projectCode || 'โครงการ'}: {item.projectName} {item.activityName ? `> ${item.activityName}` : ''}
                    </div>
                  )}
                </td>
                <td className="p-3.5 whitespace-nowrap text-slate-600">{item.vendorName}</td>
                <td className="p-3.5 text-slate-500">{item.budgetSource}</td>
                <td className="p-3.5 text-right font-bold text-slate-900 font-['Kanit',sans-serif]">
                  {item.amount.toLocaleString()}
                </td>
                <td className="p-3.5 text-center">
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    ใบเสร็จรับเงิน
                  </span>
                </td>
                <td className="p-3.5 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onSelectTask(item)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline cursor-pointer"
                    >
                      เปิดดู
                    </button>
                    {onEditTask && (
                      <button
                        onClick={() => onEditTask(item)}
                        className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                        title="แก้ไขรายการ"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDeleteTask && (
                      <button
                        onClick={() => {
                          if (confirm(`คุณต้องการลบรายการ "${item.title}" หรือไม่?`)) {
                            onDeleteTask(item.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title="ลบรายการ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
