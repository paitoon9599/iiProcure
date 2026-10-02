import React from 'react';
import { X, AlertCircle, Clock, CheckCircle2, Phone, Calendar, ArrowRight } from 'lucide-react';
import { BorrowRecord, RequisitionSlip } from '../types';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  borrows: BorrowRecord[];
  onReturnBorrow: (id: string) => void;
  onNavigateToBorrow: () => void;
  onNavigateToRequisition: () => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  isOpen,
  onClose,
  borrows,
  onReturnBorrow,
  onNavigateToBorrow,
  onNavigateToRequisition,
}) => {
  if (!isOpen) return null;

  const overdueList = borrows.filter((b) => b.status === 'overdue');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-red-50 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-base font-['Kanit',sans-serif]">
              รายการที่ต้องติดตามเร่งด่วน ({overdueList.length} รายการ)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {overdueList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-red-200 bg-red-50/40 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                      เกินกำหนดส่งคืน
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{item.code}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm mt-1">
                    {item.assetName}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    ผู้ยืม: <span className="font-medium text-slate-900">{item.borrowerName}</span> ({item.department})
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-red-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>กำหนดยืม: {item.borrowDate} - {item.dueDate}</span>
                </div>
                {item.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>โทร: {item.phone}</span>
                  </div>
                )}
                {item.note && (
                  <div className="col-span-2 text-red-600 text-[11px] font-medium">
                    ⚠️ {item.note}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => onReturnBorrow(item.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>บันทึกรับคืนแล้ว</span>
                </button>
              </div>
            </div>
          ))}

          {overdueList.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <span>ไม่มีรายการค้างส่งคืนในขณะนี้</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onClose();
              onNavigateToBorrow();
            }}
            className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
          >
            <span>ดูทะเบียนยืม-คืนพัสดุทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
