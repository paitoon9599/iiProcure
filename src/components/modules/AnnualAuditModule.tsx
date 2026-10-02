import React, { useState } from 'react';
import { ShieldCheck, Printer, CheckCircle2, Clock, AlertTriangle, FileSpreadsheet, Users } from 'lucide-react';
import { AuditItem } from '../../types';

interface AnnualAuditModuleProps {
  auditItems: AuditItem[];
  onUpdateAuditStatus: (id: string, status: AuditItem['status']) => void;
  fiscalYear: number;
}

export const AnnualAuditModule: React.FC<AnnualAuditModuleProps> = ({
  auditItems,
  onUpdateAuditStatus,
  fiscalYear,
}) => {
  const verifiedCount = auditItems.filter((i) => i.status === 'verified').length;
  const pendingCount = auditItems.filter((i) => i.status === 'pending').length;

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                การตรวจสอบพัสดุประจำปี {fiscalYear}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                การตรวจสอบการรับจ่ายพัสดุงวด 1 ปี ตามระเบียบกระทรวงการคลังว่าด้วยการจัดซื้อจัดจ้างฯ ข้อ 213
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
            <span>พิมพ์รายงานผลการตรวจสอบ</span>
          </button>
        </div>
      </div>

      {/* Audit Committee Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <Users className="w-4 h-4 text-emerald-700" />
          <span>คณะกรรมการตรวจสอบพัสดุประจำปี {fiscalYear} (ตามคำสั่งโรงเรียนที่ 124/{fiscalYear})</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-slate-600">
          <div className="p-2 bg-slate-50 rounded-lg">1. นายธีรพล สินธุ (ประธานกรรมการ)</div>
          <div className="p-2 bg-slate-50 rounded-lg">2. นางสาวรัตนา สว่างศรี (กรรมการ)</div>
          <div className="p-2 bg-slate-50 rounded-lg">3. นายประดิษฐ์ ใจงาม (กรรมการ)</div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">รายการที่ต้องตรวจสอบ</div>
          <div className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif] mt-0.5">
            {auditItems.length} <span className="text-xs font-normal text-slate-500">รายการ</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">ตรวจสอบเรียบร้อยแล้ว</div>
          <div className="text-2xl font-bold text-emerald-700 font-['Kanit',sans-serif] mt-0.5">
            {verifiedCount} <span className="text-xs font-normal text-slate-500">รายการ</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">อยู่ระหว่างตรวจสอบ/ติดตาม</div>
          <div className="text-2xl font-bold text-amber-600 font-['Kanit',sans-serif] mt-0.5">
            {pendingCount} <span className="text-xs font-normal text-slate-500">รายการ</span>
          </div>
        </div>
      </div>

      {/* Audit Checklist Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 font-['Kanit',sans-serif]">
            รายการตรวจสอบทางกายภาพ (Physical Inventory Check)
          </h3>
          <span className="text-xs text-slate-500">
            สถานะสิ้นสุด ณ วันที่ 30 กันยายน {fiscalYear}
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">หมายเลขครุภัณฑ์</th>
              <th className="p-3.5">รายการครุภัณฑ์</th>
              <th className="p-3.5">สถานที่ติดตั้ง</th>
              <th className="p-3.5">กรรมการผู้ตรวจ</th>
              <th className="p-3.5">ผลการตรวจทางกายภาพ</th>
              <th className="p-3.5">หมายเหตุ</th>
              <th className="p-3.5 text-center">บันทึกผล</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-['Sarabun',sans-serif]">
            {auditItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                  {item.assetNumber}
                </td>
                <td className="p-3.5 font-semibold text-slate-800">{item.name}</td>
                <td className="p-3.5 text-slate-600">{item.location}</td>
                <td className="p-3.5 text-slate-800">{item.auditor}</td>
                <td className="p-3.5">
                  {item.status === 'verified' && (
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> ตรวจพบตรงบัญชี
                    </span>
                  )}
                  {item.status === 'pending' && (
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> รอติดตามตรวจ
                    </span>
                  )}
                  {item.status === 'damaged' && (
                    <span className="text-[11px] font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> ชำรุด/รอจำหน่าย
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-slate-500 text-[11px]">{item.notes}</td>
                <td className="p-3.5 text-center whitespace-nowrap">
                  <select
                    value={item.status}
                    onChange={(e) => onUpdateAuditStatus(item.id, e.target.value as AuditItem['status'])}
                    className="p-1 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="verified">✓ ตรวจพบตรงบัญชี</option>
                    <option value="pending">⏳ รอติดตาม</option>
                    <option value="damaged">⚠️ ชำรุด/ขอจำหน่าย</option>
                    <option value="missing">❌ สูญหาย</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
