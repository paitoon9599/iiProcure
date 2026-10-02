import React, { useState } from 'react';
import { ShoppingBag, Plus, Printer, CheckCircle2, Info, Receipt, Search, FileText, Edit2, Trash2 } from 'lucide-react';
import { ProcurementTask, SchoolProfile } from '../../types';

interface W804ModuleProps {
  tasks: ProcurementTask[];
  onOpenWizard: () => void;
  onSelectTask: (task: ProcurementTask) => void;
  fiscalYear: number;
  schoolProfile?: SchoolProfile;
  onAddNewTask?: () => void;
  onEditTask?: (task: ProcurementTask) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const W804Module: React.FC<W804ModuleProps> = ({
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

  const w804Tasks = tasks.filter((t) => t.type === 'w804');
  const filtered = w804Tasks.filter((t) => {
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
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                  ว.804 ซื้อไม่เกิน 50,000 บาท
                </h2>
                {schoolProfile && (
                  <span className="hidden sm:inline-block text-[11px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    {schoolProfile.schoolName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                แนวทางปฏิบัติการจัดซื้อจัดจ้างตามหนังสือเวียน กค (กวจ) ว 804 • {schoolProfile?.schoolName || 'โรงเรียนบ้านนิคมสายโท 12 เหนือ'}
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
            <span>พิมพ์สรุปเบิกจ่าย</span>
          </button>
          {onAddNewTask && (
            <button
              onClick={onAddNewTask}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ บันทึก ว.804</span>
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

      {/* Regulation guidance card */}
      <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-4 text-xs text-purple-900 flex items-start gap-3">
        <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-purple-950">ข้อกำหนดตามหนังสือเวียน ว 804 สำหรับสถานศึกษา:</div>
          <p className="text-purple-800 leading-relaxed">
            1. วงเงินการจัดซื้อจัดจ้างครั้งหนึ่งไม่เกิน 50,000 บาท สามารถใช้ใบเสร็จรับเงินหรือใบแจ้งหนี้เป็นหลักฐานแทนการทำใบสั่งซื้อสั่งจ้างได้
            2. ผู้ตรวจรับพัสดุสามารถแต่งตั้งเพียงบุคคลเดียวเป็นผู้ตรวจรับพัสดุก็ได้ เพื่อความคล่องตัวในการปฏิบัติงานของโรงเรียน
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">รายการ ว.804 ทั้งหมด</div>
          <div className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif] mt-0.5">
            {w804Tasks.length} <span className="text-xs font-normal text-slate-500">บิล / รายการ</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">ยอดเบิกจ่ายสะสม ว.804</div>
          <div className="text-2xl font-bold text-purple-700 font-['Kanit',sans-serif] mt-0.5">
            {totalAmount.toLocaleString()} <span className="text-xs font-normal text-slate-500">บาท</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">เฉลี่ยต่อบิล</div>
          <div className="text-2xl font-bold text-slate-700 font-['Kanit',sans-serif] mt-0.5">
            {(w804Tasks.length ? Math.round(totalAmount / w804Tasks.length) : 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">บาท</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหารายการ, ร้านค้า, เลขที่ใบเสร็จ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-purple-500 bg-slate-50/50"
          />
        </div>
        <div className="text-xs text-slate-500 hidden sm:block">
          แสดง {filtered.length} จากทั้งหมด {w804Tasks.length} รายการ
        </div>
      </div>

      {/* Grid of W804 Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectTask(item)}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-purple-700 bg-purple-50 font-semibold px-2 py-0.5 rounded-md border border-purple-100">
                  {item.poNumber}
                </span>
                <span className="text-slate-400">{item.dateStr}</span>
              </div>
              <h3 className="font-semibold text-slate-900 text-sm group-hover:text-purple-800 transition-colors line-clamp-2">
                {item.title}
              </h3>
              {item.projectName && (
                <div className="text-[11px] text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 font-medium inline-block mt-1">
                  {item.projectCode || 'โครงการ'}: {item.projectName} {item.activityName ? `> ${item.activityName}` : ''}
                </div>
              )}
              <p className="text-xs text-slate-500 mt-1">
                ร้านค้า: <strong className="text-slate-700">{item.vendorName}</strong>
              </p>
              <div className="text-[11px] text-slate-400 mt-1">
                ผู้ตรวจรับ: {item.committee.join(', ')}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="text-xs text-slate-500">
                  งบ: <span className="text-slate-700 font-medium">{item.budgetSource}</span>
                </div>
                {onEditTask && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTask(item);
                    }}
                    className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                    title="แก้ไขรายการ"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDeleteTask && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`คุณต้องการลบรายการ "${item.title}" หรือไม่?`)) {
                        onDeleteTask(item.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="ลบรายการ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="text-right">
                <div className="text-base font-extrabold text-slate-900 font-['Kanit',sans-serif]">
                  {item.amount.toLocaleString()} <span className="text-xs font-normal text-slate-500">บาท</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
