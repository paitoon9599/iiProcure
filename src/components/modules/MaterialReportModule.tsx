import React from 'react';
import { LineChart, Printer, Download, TrendingUp, AlertTriangle, Layers, DollarSign } from 'lucide-react';
import { MaterialItem, SchoolProfile } from '../../types';

interface MaterialReportModuleProps {
  materials: MaterialItem[];
  fiscalYear: number;
  schoolProfile?: SchoolProfile;
}

export const MaterialReportModule: React.FC<MaterialReportModuleProps> = ({
  materials,
  fiscalYear,
  schoolProfile,
}) => {
  const totalStockValue = materials.reduce((s, m) => s + m.balance * m.unitPrice, 0);
  const lowStockItems = materials.filter((m) => m.balance <= m.minStock);

  // Group by category
  const categories = Array.from(new Set(materials.map((m) => m.category)));
  const categoryStats = categories.map((cat) => {
    const items = materials.filter((m) => m.category === cat);
    const value = items.reduce((s, m) => s + m.balance * m.unitPrice, 0);
    const count = items.length;
    return { cat, value, count };
  });

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <LineChart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                  รายงานสรุปยอดพัสดุและวัสดุคงคลัง
                </h2>
                {schoolProfile && (
                  <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {schoolProfile.schoolName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                รายงานสถานะพัสดุ มูลค่าคงเหลือ และการใช้วัสดุ ประจำปีงบประมาณ {fiscalYear} • {schoolProfile?.schoolName || 'โรงเรียนบ้านนิคมสายโท 12 เหนือ'} {schoolProfile?.districtOffice ? `(${schoolProfile.districtOffice})` : ''}
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
            <span>พิมพ์รายงานสรุป</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">มูลค่าวัสดุคงเหลือในคลัง</div>
          <div className="text-3xl font-extrabold text-slate-900 font-['Kanit',sans-serif] mt-1">
            {totalStockValue.toLocaleString()} <span className="text-sm font-normal text-slate-500">บาท</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            ครอบคลุมทั้งหมด {materials.length} รายการ
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">หมวดหมู่ที่มีมูลค่าสูงสุด</div>
          <div className="text-xl font-bold text-emerald-700 font-['Kanit',sans-serif] mt-1">
            วัสดุคอมพิวเตอร์และหมึกพิมพ์
          </div>
          <div className="text-xs text-slate-500 mt-1">
            อัตราการหมุนเวียนสูงสำหรับพิมพ์ข้อสอบและเอกสาร
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">รายการที่ต้องจัดซื้อเพิ่มเติม</div>
          <div className="text-3xl font-extrabold text-amber-600 font-['Kanit',sans-serif] mt-1 flex items-center gap-2">
            <span>{lowStockItems.length}</span>
            <span className="text-sm font-normal text-slate-500">รายการ</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            ยอดคงเหลือเท่ากับหรือต่ำกว่าจุดสั่งซื้อขั้นต่ำ
          </div>
        </div>
      </div>

      {/* Breakdown by Category */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h3 className="font-bold text-sm text-slate-900 font-['Kanit',sans-serif] mb-3">
          สัดส่วนมูลค่าวัสดุตามหมวดหมู่
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categoryStats.map((cs) => {
            const pct = Math.round((cs.value / (totalStockValue || 1)) * 100);
            return (
              <div key={cs.cat} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                  <span>{cs.cat}</span>
                  <span className="text-slate-500">{cs.count} รายการ</span>
                </div>
                <div className="text-base font-bold text-slate-900 font-['Kanit',sans-serif]">
                  {cs.value.toLocaleString()} <span className="text-xs font-normal text-slate-500">บาท</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-[10px] text-slate-400 mt-1 text-right">{pct}% ของมูลค่าทั้งหมด</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items nearing reorder point */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>พัสดุที่ควรจัดซื้อเพิ่มเติมตามแผนเร่งด่วน</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {lowStockItems.map((item) => (
              <div key={item.id} className="bg-white p-3 rounded-xl border border-amber-200 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-900">{item.name}</div>
                  <div className="text-slate-500 text-[11px]">
                    รหัส: {item.code} • {item.category}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-red-600 text-sm">{item.balance}</span>
                  <span className="text-slate-500 text-[11px]">/{item.minStock} {item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
