import React, { useState } from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  Clock,
  Building,
  User,
  Calendar,
  FileText,
  BadgeCheck,
  DollarSign,
  Download,
} from 'lucide-react';
import { ProcurementTask } from '../types';

interface ProjectDetailModalProps {
  task: ProcurementTask | null;
  onClose: () => void;
  onUpdateStatus: (taskId: string, status: ProcurementTask['status'], statusText: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  task,
  onClose,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'memo' | 'order' | 'inspection'>('overview');

  if (!task) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {task.categoryName}
            </span>
            <span className="font-mono text-xs text-slate-400">{task.poNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์เอกสาร</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 flex gap-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            ภาพรวมและสถานะ
          </button>
          <button
            onClick={() => setActiveTab('memo')}
            className={`py-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'memo'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            บันทึกข้อความขออนุมัติ
          </button>
          <button
            onClick={() => setActiveTab('order')}
            className={`py-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'order'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            ใบสั่งซื้อ / สั่งจ้าง
          </button>
          <button
            onClick={() => setActiveTab('inspection')}
            className={`py-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'inspection'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            ใบตรวจรับพัสดุ
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  โรงเรียนบ้านนิคมสายโท 12 เหนือ • วันที่บันทึก {task.dateStr}
                </p>
              </div>

              {/* Project & Activity Citation Card */}
              {(task.projectName || task.activityName) && (
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span>อ้างอิงโครงการและกิจกรรมตามแผนปฏิบัติการประจำปี:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pl-3.5">
                    <div>
                      <span className="text-slate-400">โครงการ:</span>{' '}
                      <strong className="text-indigo-950">{task.projectCode ? `${task.projectCode} ` : ''}{task.projectName}</strong>
                    </div>
                    {task.projectOwnerName && (
                      <div>
                        <span className="text-slate-400">เจ้าของโครงการ:</span>{' '}
                        <strong className="text-slate-900">{task.projectOwnerName}</strong>
                      </div>
                    )}
                    {task.activityName && (
                      <div className="sm:col-span-2">
                        <span className="text-slate-400">กิจกรรม:</span>{' '}
                        <strong className="text-indigo-900">{task.activityCode ? `${task.activityCode} ` : ''}{task.activityName}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status and Action banner */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3.5 h-3.5 rounded-full ${
                      task.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <div>
                    <div className="text-xs text-slate-400">สถานะปัจจุบัน</div>
                    <div className="text-sm font-bold text-slate-800">
                      {task.status === 'completed' ? 'ดำเนินการเสร็จสิ้น (เบิกจ่ายแล้ว)' : task.statusText}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {task.status !== 'completed' ? (
                    <button
                      onClick={() => onUpdateStatus(task.id, 'completed', 'เสร็จแล้ว')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      ✓ ปรับสถานะเป็น "เสร็จแล้ว"
                    </button>
                  ) : (
                    <button
                      onClick={() => onUpdateStatus(task.id, 'in_progress', 'กำลังดำเนินการ')}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      ปรับกลับเป็นกำลังดำเนินการ
                    </button>
                  )}
                </div>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>วงเงินงบประมาณ</span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 font-['Kanit',sans-serif]">
                    {task.amount.toLocaleString()} <span className="text-sm font-normal text-slate-500">บาท</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    แหล่งเงิน: {task.budgetSource}
                  </div>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    <span>คู่สัญญา / ร้านค้า</span>
                  </div>
                  <div className="text-base font-bold text-slate-800">
                    {task.vendorName}
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    เลขที่อ้างอิง: {task.poNumber}
                  </div>
                </div>
              </div>

              {/* Committee */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>คณะกรรมการตรวจรับพัสดุ</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {task.committee.map((person, index) => (
                    <div key={index} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-slate-400 text-[10px]">
                        {index === 0 ? 'ประธานกรรมการ' : index === 1 ? 'กรรมการ' : 'กรรมการ/เลขานุการ'}
                      </div>
                      <div className="font-medium text-slate-800 mt-0.5">{person}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items List if available */}
              {task.items && task.items.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 border-b border-slate-200">
                    รายการสิ่งของที่จัดซื้อ
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    {task.items.map((it, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-800">{it.name}</div>
                          <div className="text-slate-400 text-[11px]">
                            {it.quantity} {it.unit} x @{it.unitPrice.toLocaleString()} บาท
                          </div>
                        </div>
                        <div className="font-bold text-slate-900 font-['Kanit',sans-serif]">
                          {it.total.toLocaleString()} บาท
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: OFFICIAL THAI MEMO PRINT VIEW */}
          {activeTab === 'memo' && (
            <div className="p-6 bg-white border border-slate-300 shadow-xs rounded-lg font-['Sarabun',sans-serif] text-slate-900 leading-relaxed text-sm space-y-4">
              <div className="text-center font-bold text-base border-b pb-3">
                บันทึกข้อความ
              </div>
              <div className="grid grid-cols-2 text-xs gap-y-1">
                <div><strong>ส่วนราชการ:</strong> โรงเรียนบ้านนิคมสายโท 12 เหนือ</div>
                <div><strong>ที่:</strong> ศธ 04052.12/{task.poNumber}</div>
                <div><strong>วันที่:</strong> {task.dateStr}</div>
                <div><strong>เรื่อง:</strong> รายงานขอซื้อขอจ้าง ({task.categoryName})</div>
              </div>
              <div className="pt-2 text-xs">
                <strong>เรียน:</strong> ผู้อำนวยการโรงเรียนบ้านนิคมสายโท 12 เหนือ
              </div>
              <p className="text-xs text-justify indent-6">
                ด้วยโรงเรียนบ้านนิคมสายโท 12 เหนือ มีความประสงค์จะดำเนินการ{task.title} เพื่อใช้ในการบริหารงานและการจัดการเรียนการสอนของโรงเรียน โดยมีรายละเอียดตามที่เสนอต่อไปนี้
              </p>
              <div className="text-xs space-y-1.5 pl-4">
                <div>1. <strong>เหตุผลความจำเป็น:</strong> {task.description || 'เพื่อประโยชน์สูงสุดทางการศึกษาและการจัดการเรียนการสอน'}</div>
                {task.projectName && (
                  <div>2. <strong>โครงการตามแผนปฏิบัติการ:</strong> {task.projectCode ? `${task.projectCode} ` : ''}{task.projectName} {task.projectOwnerName ? `(เจ้าของโครงการ: ${task.projectOwnerName})` : ''}</div>
                )}
                {task.activityName && (
                  <div>3. <strong>กิจกรรมภายใต้โครงการ:</strong> {task.activityCode ? `${task.activityCode} ` : ''}{task.activityName}</div>
                )}
                <div>4. <strong>วงเงินที่จะจัดซื้อจัดจ้าง:</strong> จำนวน {task.amount.toLocaleString()} บาท ({task.amount.toLocaleString()} บาทถ้วน)</div>
                <div>5. <strong>แหล่งเงิน:</strong> {task.budgetSource}</div>
                <div>6. <strong>ผู้เสนอราคา/คู่สัญญา:</strong> {task.vendorName}</div>
                <div>7. <strong>คณะกรรมการตรวจรับพัสดุ:</strong> ประกอบด้วย {task.committee.join(', ')}</div>
              </div>
              <p className="text-xs text-justify indent-6">
                จึงเรียนมาเพื่อโปรดพิจารณาให้ความเห็นชอบรายงานขอซื้อขอจ้าง และแต่งตั้งคณะกรรมการตรวจรับพัสดุดังกล่าว
              </p>
              <div className="pt-8 flex justify-end text-xs text-center pr-8">
                <div>
                  <div>(ลงชื่อ).......................................................</div>
                  <div className="mt-1">(ครูทัศน์พล เจริญสุข)</div>
                  <div className="text-slate-500">เจ้าหน้าที่พัสดุ</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PURCHASE ORDER */}
          {activeTab === 'order' && (
            <div className="p-6 bg-white border border-slate-300 shadow-xs rounded-lg font-['Sarabun',sans-serif] text-slate-900 text-xs space-y-4">
              <div className="text-center font-bold text-sm">
                ใบสั่งซื้อ / สั่งจ้าง (Purchase Order)
              </div>
              <div className="flex justify-between border-b pb-2">
                <div><strong>ผู้สั่งซื้อ:</strong> โรงเรียนบ้านนิคมสายโท 12 เหนือ</div>
                <div><strong>เลขที่:</strong> {task.poNumber}</div>
              </div>
              <div className="flex justify-between">
                <div><strong>ส่งมอบให้:</strong> {task.vendorName}</div>
                <div><strong>วันที่ออกใบสั่ง:</strong> {task.dateStr}</div>
              </div>
              <div className="border border-slate-200 rounded-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 font-bold border-b">
                    <tr>
                      <th className="p-2 border-r">ลำดับ</th>
                      <th className="p-2 border-r">รายการ</th>
                      <th className="p-2 text-right">จำนวนเงิน (บาท)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border-r">1</td>
                      <td className="p-2 border-r">{task.title}</td>
                      <td className="p-2 text-right font-bold">{task.amount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                  <tfoot className="border-t font-bold bg-slate-50">
                    <tr>
                      <td colSpan={2} className="p-2 text-right border-r">รวมเป็นเงินทั้งสิ้น</td>
                      <td className="p-2 text-right text-emerald-800">{task.amount.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: INSPECTION */}
          {activeTab === 'inspection' && (
            <div className="p-6 bg-white border border-slate-300 shadow-xs rounded-lg font-['Sarabun',sans-serif] text-slate-900 text-xs space-y-4">
              <div className="text-center font-bold text-sm">
                ใบตรวจรับพัสดุ / ใบรับรองผลการปฏิบัติงาน
              </div>
              <div className="text-justify indent-6">
                ตามที่ โรงเรียนบ้านนิคมสายโท 12 เหนือ ได้ตกลงซื้อ/จ้าง {task.title} จาก {task.vendorName} ตามเลขที่ {task.poNumber} นั้น
              </div>
              <div className="text-justify indent-6">
                บัดนี้ คณะกรรมการตรวจรับพัสดุได้ร่วมกันตรวจรับงาน/สิ่งของดังกล่าวเรียบร้อยแล้ว ปรากฏว่า มีปริมาณและคุณภาพถูกต้องครบถ้วนตามรายการที่กำหนด จึงได้รับมอบไว้เพื่อนำไปใช้ประโยชน์ในราชการต่อไป
              </div>
              <div className="pt-6 grid grid-cols-3 text-center gap-4">
                {task.committee.map((person, idx) => (
                  <div key={idx} className="space-y-1">
                    <div>ลงชื่อ..................................</div>
                    <div className="font-semibold">({person})</div>
                    <div className="text-[10px] text-slate-500">
                      {idx === 0 ? 'ประธานกรรมการ' : 'กรรมการตรวจรับ'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            ระบบงานพัสดุ ร.ร.บ้านนิคมสายโท 12 เหนือ
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 font-medium cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
