import React, { useState } from 'react';
import { BookOpen, Download, Printer, Search, Filter, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { ProcurementTask, SchoolProfile } from '../../types';

interface ProcurementRegisterModuleProps {
  tasks: ProcurementTask[];
  fiscalYear: number;
  onSelectTask: (task: ProcurementTask) => void;
  schoolProfile?: SchoolProfile;
  onAddNewTask?: () => void;
  onEditTask?: (task: ProcurementTask) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const ProcurementRegisterModule: React.FC<ProcurementRegisterModuleProps> = ({
  tasks,
  fiscalYear,
  onSelectTask,
  schoolProfile,
  onAddNewTask,
  onEditTask,
  onDeleteTask,
}) => {
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter((t) => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.vendorName.toLowerCase().includes(q) ||
        t.poNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalAmount = filteredTasks.reduce((acc, curr) => acc + curr.amount, 0);

  const handleExportCSV = () => {
    const headers = ['ลำดับ', 'วันที่', 'เลขที่เอกสาร', 'รายการจัดซื้อจัดจ้าง', 'วงเงินงบประมาณ', 'ผู้เสนอราคา/คู่สัญญา', 'สถานะ'];
    const rows = filteredTasks.map((t, idx) => [
      idx + 1,
      t.dateStr,
      t.poNumber,
      `"${t.title.replace(/"/g, '""')}"`,
      t.amount,
      `"${t.vendorName.replace(/"/g, '""')}"`,
      t.status === 'completed' ? 'เบิกจ่ายแล้ว' : t.statusText,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ทะเบียนคุมจัดซื้อจัดจ้าง_ปีงบประมาณ_${fiscalYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-700" />
            <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
              ทะเบียนคุมจัดซื้อจัดจ้าง
            </h2>
            {schoolProfile && (
              <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {schoolProfile.schoolName}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {schoolProfile?.schoolName || 'โรงเรียนบ้านนิคมสายโท 12 เหนือ'} • ทะเบียนคุมการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ ประจำปีงบประมาณ {fiscalYear}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์ทะเบียนคุม</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออก CSV</span>
          </button>
          {onAddNewTask && (
            <button
              onClick={onAddNewTask}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ เพิ่มลงทะเบียนคุม</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-400">รายการในทะเบียน</span>
          <div className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif] mt-0.5">
            {filteredTasks.length} <span className="text-xs font-normal text-slate-500">โครงการ</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-400">ยอดเงินรวมในทะเบียน</span>
          <div className="text-2xl font-bold text-emerald-700 font-['Kanit',sans-serif] mt-0.5">
            {totalAmount.toLocaleString()} <span className="text-xs font-normal text-slate-500">บาท</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-400">เบิกจ่ายแล้วเสร็จ</span>
          <div className="text-2xl font-bold text-blue-700 font-['Kanit',sans-serif] mt-0.5">
            {filteredTasks.filter((t) => t.status === 'completed').length}{' '}
            <span className="text-xs font-normal text-slate-500">โครงการ</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อโครงการ, ร้านค้า, เลขที่..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs w-full sm:w-auto">
          <span className="text-slate-400 mr-1">หมวดงาน:</span>
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'purchase', label: 'งานซื้อ' },
            { id: 'hire', label: 'งานจ้าง' },
            { id: 'construction', label: 'ก่อสร้าง' },
            { id: 'w804', label: 'ว.804' },
            { id: 'w119', label: 'ว.119' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterType === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Official Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 text-center w-12 border-r border-slate-200">ลำดับ</th>
                <th className="p-3 whitespace-nowrap border-r border-slate-200">วัน เดือน ปี</th>
                <th className="p-3 whitespace-nowrap border-r border-slate-200">เลขที่โครงการ/ใบสั่ง</th>
                <th className="p-3 border-r border-slate-200">รายการจัดซื้อจัดจ้าง</th>
                <th className="p-3 border-r border-slate-200">วิธีจัดซื้อจัดจ้าง</th>
                <th className="p-3 border-r border-slate-200">ผู้เสนอราคา/คู่สัญญา</th>
                <th className="p-3 text-right border-r border-slate-200 whitespace-nowrap">วงเงินจัดซื้อ (บาท)</th>
                <th className="p-3 text-center border-r border-slate-200 whitespace-nowrap">สถานะตรวจรับ/เบิกจ่าย</th>
                <th className="p-3 text-center">เอกสาร</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-['Sarabun',sans-serif]">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    ไม่มีรายการตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task, index) => (
                  <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-center border-r border-slate-100 font-mono text-slate-500">
                      {index + 1}
                    </td>
                    <td className="p-3 whitespace-nowrap border-r border-slate-100 text-slate-700">
                      {task.dateStr}
                    </td>
                    <td className="p-3 whitespace-nowrap border-r border-slate-100 font-mono font-semibold text-slate-800">
                      {task.poNumber}
                    </td>
                    <td className="p-3 border-r border-slate-100 font-medium text-slate-900 max-w-xs">
                      <div>{task.title}</div>
                      {task.projectName && (
                        <div className="text-[10px] text-indigo-700 bg-indigo-50/80 px-1.5 py-0.5 rounded-sm border border-indigo-100 font-normal inline-block mt-0.5">
                          {task.projectCode ? `${task.projectCode} ` : ''}{task.projectName}
                          {task.activityName ? ` > ${task.activityName}` : ''}
                        </div>
                      )}
                    </td>
                    <td className="p-3 border-r border-slate-100 whitespace-nowrap text-slate-600">
                      {task.type === 'w804'
                        ? 'เฉพาะเจาะจง (ว.804)'
                        : task.type === 'w119'
                        ? 'เฉพาะเจาะจง (ว.119)'
                        : 'เฉพาะเจาะจง (มาตรา 56)'}
                    </td>
                    <td className="p-3 border-r border-slate-100 whitespace-nowrap font-medium text-slate-800">
                      {task.vendorName}
                    </td>
                    <td className="p-3 text-right border-r border-slate-100 font-bold text-slate-900 font-['Kanit',sans-serif] whitespace-nowrap">
                      {task.amount.toLocaleString()}
                    </td>
                    <td className="p-3 text-center border-r border-slate-100 whitespace-nowrap">
                      {task.status === 'completed' ? (
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                          ✓ เบิกจ่ายแล้ว
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                          ⏳ {task.statusText}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onSelectTask(task)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
                          title="ดูรายละเอียด/พิมพ์"
                        >
                          พิมพ์/ดู
                        </button>
                        {onEditTask && (
                          <button
                            onClick={() => onEditTask(task)}
                            className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                            title="แก้ไขรายการ"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteTask && (
                          <button
                            onClick={() => {
                              if (confirm(`คุณต้องการลบรายการ "${task.title}" หรือไม่?`)) {
                                onDeleteTask(task.id);
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
                ))
              )}
            </tbody>
            <tfoot className="bg-slate-50 font-bold text-slate-800 border-t border-slate-200">
              <tr>
                <td colSpan={6} className="p-3 text-right border-r border-slate-200">
                  ยอดรวมทั้งสิ้น ({filteredTasks.length} รายการ)
                </td>
                <td className="p-3 text-right text-emerald-800 font-['Kanit',sans-serif] text-sm border-r border-slate-200">
                  {totalAmount.toLocaleString()} บาท
                </td>
                <td colSpan={2} className="p-3 text-center text-slate-500 text-xs">
                  ครบถ้วนตามระเบียบ
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
