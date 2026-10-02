import React, { useState } from 'react';
import { Plus, Search, Filter, Printer, Download, Eye, CheckCircle2, Clock } from 'lucide-react';
import { ProcurementTask, TaskType } from '../../types';

interface ProcurementModuleProps {
  type: TaskType;
  title: string;
  subtitle: string;
  tasks: ProcurementTask[];
  onSelectTask: (task: ProcurementTask) => void;
  onOpenWizard: () => void;
}

export const ProcurementModule: React.FC<ProcurementModuleProps> = ({
  type,
  title,
  subtitle,
  tasks,
  onSelectTask,
  onOpenWizard,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress'>('all');

  const filtered = tasks.filter((t) => {
    if (t.type !== type) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.vendorName.toLowerCase().includes(q) ||
        t.poNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalAmount = filtered.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-5 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">{title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์รายงาน</span>
          </button>
          <button
            onClick={onOpenWizard}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ สร้างรายการใหม่</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">จำนวนโครงการทั้งหมด</div>
          <div className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif] mt-1">
            {filtered.length} <span className="text-xs font-normal text-slate-500">โครงการ</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">ยอดงบประมาณรวม</div>
          <div className="text-2xl font-bold text-emerald-700 font-['Kanit',sans-serif] mt-1">
            {totalAmount.toLocaleString()} <span className="text-xs font-normal text-slate-500">บาท</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">เสร็จสิ้นแล้ว</div>
          <div className="text-2xl font-bold text-blue-700 font-['Kanit',sans-serif] mt-1">
            {filtered.filter((t) => t.status === 'completed').length}{' '}
            <span className="text-xs font-normal text-slate-500">
              จาก {filtered.length} งาน
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อรายการ, ผู้รับจ้าง, เลขที่..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs w-full sm:w-auto">
          <span className="text-slate-400 mr-1">สถานะ:</span>
          {(['all', 'completed', 'in_progress'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === s
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'all' ? 'ทั้งหมด' : s === 'completed' ? 'เสร็จแล้ว' : 'กำลังดำเนินการ'}
            </button>
          ))}
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">วันที่ / เลขที่</th>
                <th className="p-3.5">รายการโครงการ</th>
                <th className="p-3.5">ผู้ขาย / ผู้รับจ้าง</th>
                <th className="p-3.5">แหล่งเงิน</th>
                <th className="p-3.5 text-right">วงเงิน (บาท)</th>
                <th className="p-3.5 text-center">สถานะ</th>
                <th className="p-3.5 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    ไม่พบรายการข้อมูล
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{item.dateStr}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{item.poNumber}</div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-900 max-w-xs">
                      <div>{item.title}</div>
                      {item.projectName && (
                        <div className="text-[11px] text-indigo-800 bg-indigo-50/90 px-1.5 py-0.5 rounded-md border border-indigo-100 font-medium inline-block mt-1">
                          {item.projectCode || 'โครงการ'}: {item.projectName} {item.activityName ? `> ${item.activityName}` : ''}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-600 whitespace-nowrap">{item.vendorName}</td>
                    <td className="p-3.5 text-slate-500 max-w-xs truncate">{item.budgetSource}</td>
                    <td className="p-3.5 text-right font-bold text-slate-900 font-['Kanit',sans-serif] whitespace-nowrap">
                      {item.amount.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap">
                      {item.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>เสร็จแล้ว</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span>{item.statusText}</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={() => onSelectTask(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="ดูรายละเอียดและพิมพ์เอกสาร"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>เปิดดู</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
