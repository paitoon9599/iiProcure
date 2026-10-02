import React, { useState } from 'react';
import { Archive, Plus, Printer, AlertTriangle, Search, Edit2, Trash2, Check, X } from 'lucide-react';
import { MaterialItem, SchoolProfile } from '../../types';

interface InventoryLedgerModuleProps {
  materials: MaterialItem[];
  onAddMaterial: (mat: MaterialItem) => void;
  onUpdateMaterial?: (mat: MaterialItem) => void;
  onDeleteMaterial?: (id: string) => void;
  onStockAdjustment: (id: string, delta: number) => void;
  schoolProfile?: SchoolProfile;
}

export const InventoryLedgerModule: React.FC<InventoryLedgerModuleProps> = ({
  materials,
  onAddMaterial,
  onUpdateMaterial,
  onDeleteMaterial,
  onStockAdjustment,
  schoolProfile,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialItem | null>(null);

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
    setCode('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial || !editingMaterial.name.trim() || !onUpdateMaterial) return;

    onUpdateMaterial({
      ...editingMaterial,
      lastUpdated: '1 ต.ค. 69',
    });
    setEditingMaterial(null);
  };

  const handleDelete = (mat: MaterialItem) => {
    if (!onDeleteMaterial) return;
    if (confirm(`คุณต้องการลบวัสดุ "${mat.name}" ออกจากบัญชีคุมหรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`)) {
      onDeleteMaterial(mat.id);
    }
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
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                  บัญชีวัสดุ (Stock Inventory)
                </h2>
                {schoolProfile && (
                  <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {schoolProfile.schoolName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                บัญชีคุมยอดพัสดุคงคลัง การรับเข้า - จ่ายออก และแจ้งเตือนจุดสั่งซื้อขั้นต่ำ • {schoolProfile?.schoolName || 'โรงเรียนบ้านนิคมสายโท 12 เหนือ'}
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
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">รายการวัสดุทั้งหมด</div>
          <div className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif] mt-0.5">
            {filtered.length} <span className="text-xs font-normal text-slate-500">รายการ</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">มูลค่าวัสดุคงเหลือรวม</div>
          <div className="text-2xl font-bold text-emerald-700 font-['Kanit',sans-serif] mt-0.5">
            {totalValue.toLocaleString()} <span className="text-xs font-normal text-slate-500">บาท</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">วัสดุใกล้หมด/ถึงจุดสั่งซื้อ</div>
          <div className="text-2xl font-bold text-amber-600 font-['Kanit',sans-serif] mt-0.5">
            {lowStockCount} <span className="text-xs font-normal text-slate-500">รายการ</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อวัสดุ หรือรหัส..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCat === cat
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'ทั้งหมด' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Material Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">รหัสวัสดุ</th>
              <th className="p-3.5">รายการพัสดุ/วัสดุ</th>
              <th className="p-3.5">หมวดหมู่</th>
              <th className="p-3.5 text-center">หน่วยนับ</th>
              <th className="p-3.5 text-right">ราคา/หน่วย</th>
              <th className="p-3.5 text-center">คงเหลือ/ขั้นต่ำ</th>
              <th className="p-3.5 text-right">มูลค่ารวม</th>
              <th className="p-3.5 text-center">ปรับยอด</th>
              <th className="p-3.5 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-400">
                  ไม่พบรายการวัสดุ
                </td>
              </tr>
            ) : (
              filtered.map((mat) => {
                const isLow = mat.balance <= mat.minStock;
                return (
                  <tr key={mat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-mono text-slate-500 font-semibold">{mat.code}</td>
                    <td className="p-3.5 font-medium text-slate-900">
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
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditingMaterial(mat)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="แก้ไขวัสดุ"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(mat)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="ลบวัสดุ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-['Kanit',sans-serif]">
                เพิ่มวัสดุใหม่ในบัญชีคุม
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
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
                  placeholder="เช่น ปากกาไวท์บอร์ดสีน้ำเงิน"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1">หน่วยนับ</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="ด้าม/กล่อง"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ยอดเริ่มต้น</label>
                  <input
                    type="number"
                    required
                    value={balance}
                    onChange={(e) => setBalance(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">เกณฑ์ขั้นต่ำ</label>
                  <input
                    type="number"
                    required
                    value={minStock}
                    onChange={(e) => setMinStock(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">ราคาต่อหน่วย (บาท)</label>
                <input
                  type="number"
                  required
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg"
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-['Kanit',sans-serif]">
                แก้ไขข้อมูลวัสดุ
              </h3>
              <button onClick={() => setEditingMaterial(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">รหัสวัสดุ</label>
                  <input
                    type="text"
                    value={editingMaterial.code}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, code: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">หมวดหมู่</label>
                  <select
                    value={editingMaterial.category}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, category: e.target.value })}
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
                  value={editingMaterial.name}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1">หน่วยนับ</label>
                  <input
                    type="text"
                    required
                    value={editingMaterial.unit}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, unit: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ยอดคงเหลือ</label>
                  <input
                    type="number"
                    required
                    value={editingMaterial.balance}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, balance: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">เกณฑ์ขั้นต่ำ</label>
                  <input
                    type="number"
                    required
                    value={editingMaterial.minStock}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, minStock: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">ราคาต่อหน่วย (บาท)</label>
                <input
                  type="number"
                  required
                  value={editingMaterial.unitPrice}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, unitPrice: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleDelete(editingMaterial);
                    setEditingMaterial(null);
                  }}
                  className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  ลบรายการนี้
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingMaterial(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                  >
                    บันทึกการแก้ไข
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
