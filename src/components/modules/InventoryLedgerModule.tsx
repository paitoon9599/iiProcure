import React, { useState } from 'react';
import { Archive, Plus, Printer, AlertTriangle, ArrowDownRight, ArrowUpRight, Search } from 'lucide-react';
import { MaterialItem } from '../../types';

interface InventoryLedgerModuleProps {
  materials: MaterialItem[];
  onAddMaterial: (mat: MaterialItem) => void;
  onStockAdjustment: (id: string, delta: number) => void;
}

export const InventoryLedgerModule: React.FC<InventoryLedgerModuleProps> = ({
  materials,
  onAddMaterial,
  onStockAdjustment,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New item form
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('วัสดุสำนักงาน');
  const [unit, setUnit] = useState('รีม');
  const [balance, setBalance] = useState<number>(10);
  const [minStock, setMinStock] = useState<number>(5);
  const [unitPrice, setUnitPrice] = useState<number>(120);

  const categories = ['all', 'วัสดุสำนักงาน', 'วัสดุคอมพิวเตอร์', 'วัสดุการศึกษา', 'วัสดุไฟฟ้าและวิทยุ', 'วัสดุงานบ้านงานครัว'];

  const filtered = materials.filter((m) => {
    if (selectedCat !== 'all' && m.category !== selectedCat) return false;
    if (search) {
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q);
    }
    return true;
  });

  const totalValue = filtered.reduce((s, m) => s + m.balance * m.unitPrice, 0);
  const lowStockCount = filtered.filter((m) => m.balance <= m.minStock).length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMat: MaterialItem = {
      id: `mat-${Date.now()}`,
      code: code.trim() || `ว-${Math.floor(Math.random() * 900 + 100)}`,
      name: name.trim(),
      category,
      unit,
      balance: Number(balance) || 0,
      minStock: Number(minStock) || 0,
      unitPrice: Number(unitPrice) || 0,
      lastUpdated: '1 ต.ค. 69',
    };

    onAddMaterial(newMat);
    setIsAddOpen(false);
    setName('');
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                บัญชีวัสดุ (Stock Inventory)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                บัญชีคุมยอดพัสดุคงคลัง การรับเข้า - จ่ายออก และแจ้งเตือนจุดสั่งซื้อขั้นต่ำ
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
            <span>พิมพ์บัญชีคุม</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ เพิ่มวัสดุใหม่</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">รายการวัสดุทั้งหมด</div>
          <div className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif] mt-0.5">
            {filtered.length} <span className="text-xs font-normal text-slate-500">รายการ</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">มูลค่าวัสดุคงเหลือรวม</div>
          <div className="text-2xl font-bold text-emerald-700 font-['Kanit',sans-serif] mt-0.5">
            {totalValue.toLocaleString()} <span className="text-xs font-normal text-slate-500">บาท</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">วัสดุใกล้หมด (ต่ำกว่าขั้นต่ำ)</div>
          <div className="text-2xl font-bold text-amber-600 font-['Kanit',sans-serif] mt-0.5 flex items-center gap-2">
            <span>{lowStockCount} รายการ</span>
            {lowStockCount > 0 && <AlertTriangle className="w-5 h-5 text-amber-500" />}
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อวัสดุ หรือ รหัส..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs overflow-x-auto w-full sm:w-auto">
          <span className="text-slate-400 mr-1 shrink-0">หมวด:</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                selectedCat === c
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c === 'all' ? 'ทุกหมวด' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">รหัสวัสดุ</th>
              <th className="p-3.5">ชื่อพัสดุ / วัสดุ</th>
              <th className="p-3.5">หมวดหมู่</th>
              <th className="p-3.5 text-center">หน่วยนับ</th>
              <th className="p-3.5 text-right">ราคา/หน่วย</th>
              <th className="p-3.5 text-center">คงเหลือ</th>
              <th className="p-3.5 text-right">มูลค่ารวม</th>
              <th className="p-3.5 text-center">ปรับยอดคงคลัง</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((mat) => {
              const isLow = mat.balance <= mat.minStock;
              return (
                <tr key={mat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono text-emerald-800 font-bold whitespace-nowrap">
                    {mat.code}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{mat.name}</span>
                      {isLow && (
                        <span className="text-[10px] text-red-600 bg-red-100 px-1.5 py-0.5 rounded-sm font-bold">
                          ใกล้หมด
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-500 whitespace-nowrap">{mat.category}</td>
                  <td className="p-3.5 text-center text-slate-600">{mat.unit}</td>
                  <td className="p-3.5 text-right font-medium">
                    {mat.unitPrice.toLocaleString()} บาท
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={`font-extrabold text-sm font-['Kanit',sans-serif] px-2 py-0.5 rounded-lg ${
                        isLow ? 'text-red-700 bg-red-50' : 'text-slate-900'
                      }`}
                    >
                      {mat.balance}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-1">/{mat.minStock}</span>
                  </td>
                  <td className="p-3.5 text-right font-bold text-slate-900 font-['Kanit',sans-serif] whitespace-nowrap">
                    {(mat.balance * mat.unitPrice).toLocaleString()} บาท
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onStockAdjustment(mat.id, 1)}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md font-bold transition-colors cursor-pointer"
                        title="รับเข้า +1"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => onStockAdjustment(mat.id, -1)}
                        disabled={mat.balance <= 0}
                        className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md font-bold transition-colors cursor-pointer disabled:opacity-40"
                        title="จ่ายออก -1"
                      >
                        -1
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-['Kanit',sans-serif]">
              เพิ่มวัสดุใหม่ในบัญชีคุม
            </h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">รหัสวัสดุ</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="เช่น ว-009"
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">หมวดหมู่</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    {categories.filter((c) => c !== 'all').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">ชื่อรายการวัสดุ *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น ปากกาเขียนแผ่นใส หรือ กระดาษอาร์ตการ์ด"
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1">หน่วยนับ</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ยอดเริ่มต้น</label>
                  <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">เตือนขั้นต่ำ</label>
                  <input
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold text-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">ราคาต่อหน่วย (บาท)</label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
