import React, { useState } from 'react';
import { Megaphone, Printer, Calendar, FileText, CheckCircle2, AlertTriangle, Download } from 'lucide-react';
import { ProcurementTask } from '../../types';

interface QuarterlyAnnouncementProps {
  tasks: ProcurementTask[];
  fiscalYear: number;
}

export const QuarterlyAnnouncementModule: React.FC<QuarterlyAnnouncementProps> = ({
  tasks,
  fiscalYear,
}) => {
  const [selectedQuarter, setSelectedQuarter] = useState<number>(4);

  // Group tasks into quarters:
  // Q1: Oct - Dec (months 10, 11, 12 of previous solar year)
  // Q2: Jan - Mar
  // Q3: Apr - Jun
  // Q4: Jul - Sep
  const quarters = [
    { q: 1, name: 'ไตรมาสที่ 1', period: '1 ต.ค. - 31 ธ.ค.', status: 'ประกาศแล้ว' },
    { q: 2, name: 'ไตรมาสที่ 2', period: '1 ม.ค. - 31 มี.ค.', status: 'ประกาศแล้ว' },
    { q: 3, name: 'ไตรมาสที่ 3', period: '1 เม.ย. - 30 มิ.ย.', status: 'ประกาศแล้ว' },
    { q: 4, name: 'ไตรมาสที่ 4', period: '1 ก.ค. - 30 ก.ย.', status: 'ยังไม่ได้ประกาศ (กำหนด 30 ต.ค. 69)' },
  ];

  // In our mock database, we have 10 items in Q4 as indicated by the screenshot
  const qTasks = selectedQuarter === 4 ? tasks.slice(0, 10) : tasks.slice(0, 5);
  const totalQuarterAmount = qTasks.reduce((s, t) => s + t.amount, 0);

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
              <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                ประกาศผลการจัดซื้อจัดจ้างรายไตรมาส (แบบ สขร. 1)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                สรุปผลการจัดซื้อจัดจ้างเพื่อเผยแพร่ตาม พ.ร.บ. ข้อมูลข่าวสารของราชการ พ.ศ. 2540
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
            <span>พิมพ์แบบ สขร. 1</span>
          </button>
          <button
            onClick={() => alert('บันทึกการเผยแพร่ประกาศ สขร. 1 เรียบร้อยแล้ว')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>บันทึกการเผยแพร่</span>
          </button>
        </div>
      </div>

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
            <p className="text-[11px] text-slate-500">โรงเรียนบ้านนิคมสายโท 12 เหนือ สำนักงานเขตพื้นที่การศึกษาประถมศึกษาบุรีรัมย์ เขต 2</p>
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
                <th className="p-2.5 text-center">เลขที่และวันที่สัญญา</th>
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
                  <td className="p-2.5 text-center font-mono text-[11px] whitespace-nowrap">
                    {t.poNumber} ({t.dateStr})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
