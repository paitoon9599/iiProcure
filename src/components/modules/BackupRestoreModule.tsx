import React, { useRef, useState } from 'react';
import { DownloadCloud, Upload, RefreshCw, CheckCircle2, Database, ShieldAlert, FileText } from 'lucide-react';

interface BackupRestoreModuleProps {
  onExportData: () => void;
  onImportData: (data: any) => void;
  onResetData: () => void;
  fiscalYear: number;
}

export const BackupRestoreModule: React.FC<BackupRestoreModuleProps> = ({
  onExportData,
  onImportData,
  onResetData,
  fiscalYear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImportData(json);
        setSuccessMsg('นำเข้าข้อมูลและกู้คืนระบบเรียบร้อยแล้ว');
        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err) {
        alert('ไฟล์ข้อมูลไม่ถูกต้อง กรุณาเลือกไฟล์ JSON ที่สำรองจากระบบนี้');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นของโรงเรียนบ้านนิคมสายโท 12 เหนือ หรือไม่?')) {
      onResetData();
      setSuccessMsg('คืนค่าข้อมูลเริ่มต้นเรียบร้อยแล้ว');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-5 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
              สำรองและกู้คืนข้อมูลระบบ
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              จัดการฐานข้อมูลพัสดุ ทะเบียนคุม จัดซื้อจัดจ้าง และคลังวัสดุโรงเรียนบ้านนิคมสายโท 12 เหนือ
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Backup Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base font-['Kanit',sans-serif]">
              สำรองข้อมูล (Export JSON)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ดาวน์โหลดไฟล์สำรองข้อมูลทั้งหมดในระบบ ทั้งงานจัดซื้อจัดจ้าง ทะเบียนคุม บัญชีวัสดุ และประวัติการยืม-คืน สำหรับเก็บไว้ในคอมพิวเตอร์อย่างปลอดภัย
            </p>
          </div>

          <button
            onClick={onExportData}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>ดาวน์โหลดไฟล์สำรองข้อมูล (.json)</span>
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base font-['Kanit',sans-serif]">
              กู้คืนข้อมูล (Import JSON)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              นำเข้าไฟล์สำรองข้อมูลเดิมที่เคยบันทึกไว้ เพื่อกู้คืนสถานะข้อมูลทั้งหมดกลับมาใช้งาน
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>เลือกไฟล์เพื่อกู้คืน</span>
          </button>
        </div>
      </div>

      {/* Reset Demo Data Card */}
      <div className="bg-white p-6 rounded-2xl border border-red-200/70 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>คืนค่าข้อมูลเริ่มต้นของโรงเรียน (Reset Demo Data)</span>
          </div>
          <p className="text-xs text-slate-500">
            ล้างข้อมูลการแก้ไข และคืนค่ากลับสู่ชุดข้อมูลตัวอย่างที่ตรงกับรูปภาพหน้าจอ 100%
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>คืนค่าเริ่มต้น</span>
        </button>
      </div>
    </div>
  );
};
