import React, { useState } from 'react';
import { Monitor, Plus, Printer, Search, CheckCircle2, AlertTriangle, ShieldCheck, Tag, Edit2, Trash2, X } from 'lucide-react';
import { FixedAsset, SchoolProfile } from '../../types';

interface AssetRegisterModuleProps {
  assets: FixedAsset[];
  onAddAsset: (asset: FixedAsset) => void;
  onUpdateAsset?: (asset: FixedAsset) => void;
  onDeleteAsset?: (id: string) => void;
  fiscalYear: number;
  schoolProfile?: SchoolProfile;
}

export const AssetRegisterModule: React.FC<AssetRegisterModuleProps> = ({
  assets,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
  fiscalYear,
  schoolProfile,
}) => {
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<FixedAsset | null>(null);

  // New asset form
  const [assetNumber, setAssetNumber] = useState('');
  const [name, setName] = useState('');
  const [specs, setSpecs] = useState('');
  const [price, setPrice] = useState<number>(15000);
  const [location, setLocation] = useState('ห้องเรียน');
  const [custodian, setCustodian] = useState('ครูทัศน์พล เจริญสุข');
  const [fundingSource, setFundingSource] = useState('เงินอุดหนุนรายหัว');

  const filtered = assets.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.assetNumber.toLowerCase().includes(q) ||
      a.custodian.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q)
    );
  });

  const totalAssetValue = filtered.reduce((s, a) => s + a.price, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newAsset: FixedAsset = {
      id: `ast-${Date.now()}`,
      assetNumber:
        assetNumber.trim() ||
        `ศธ 04052.12/${String(fiscalYear).slice(2)}/${String(Math.floor(Math.random() * 900 + 100)).padStart(3, '0')}`,
      name: name.trim(),
      specs: specs.trim() || 'ตามมาตรฐานคุณลักษณะครุภัณฑ์ สพฐ.',
      acquisitionDate: `1 ต.ค. ${String(fiscalYear).slice(2)}`,
      price: Number(price) || 0,
      fundingSource,
      location,
      custodian,
      condition: 'good',
    };

    onAddAsset(newAsset);
    setIsAddOpen(false);
    setName('');
    setAssetNumber('');
    setSpecs('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset || !editingAsset.name.trim() || !onUpdateAsset) return;

    onUpdateAsset(editingAsset);
    setEditingAsset(null);
  };

  const handleDelete = (asset: FixedAsset) => {
    if (!onDeleteAsset) return;
    if (confirm(`คุณต้องการลบครุภัณฑ์ "${asset.name}" (${asset.assetNumber}) หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`)) {
      onDeleteAsset(asset.id);
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                  ทะเบียนคุมทรัพย์สิน (Fixed Assets)
                </h2>
                {schoolProfile && (
                  <span className="hidden sm:inline-block text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {schoolProfile.schoolName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ทะเบียนคุมครุภัณฑ์ เลขรหัสครุภัณฑ์ ผู้ครอบครอง และการบำรุงรักษาสถานศึกษา • {schoolProfile?.schoolName || 'โรงเรียนบ้านนิคมสายโท 12 เหนือ'}
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
            <span>พิมพ์ทะเบียนครุภัณฑ์</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ ลงทะเบียนครุภัณฑ์ใหม่</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">จำนวนครุภัณฑ์ทั้งหมด</div>
          <div className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif] mt-0.5">
            {filtered.length} <span className="text-xs font-normal text-slate-500">รายการ</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">มูลค่าครุภัณฑ์รวม</div>
          <div className="text-2xl font-bold text-blue-700 font-['Kanit',sans-serif] mt-0.5">
            {totalAssetValue.toLocaleString()} <span className="text-xs font-normal text-slate-500">บาท</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400">สภาพพร้อมใช้งาน</div>
          <div className="text-2xl font-bold text-emerald-700 font-['Kanit',sans-serif] mt-0.5">
            {filtered.filter((a) => a.condition === 'good').length} <span className="text-xs font-normal text-slate-500">รายการ</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อครุภัณฑ์, หมายเลขครุภัณฑ์, ผู้ดูแล..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 bg-slate-50/50"
          />
        </div>
        <div className="text-xs text-slate-500">
          แสดง {filtered.length} รายการ
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">หมายเลขครุภัณฑ์</th>
              <th className="p-3.5">รายการครุภัณฑ์</th>
              <th className="p-3.5">คุณลักษณะ / ข้อมูล</th>
              <th className="p-3.5 text-right">ราคาจัดซื้อ (บาท)</th>
              <th className="p-3.5">สถานที่ตั้ง / ผู้ดูแล</th>
              <th className="p-3.5 text-center">สภาพ</th>
              <th className="p-3.5 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  ไม่พบข้อมูลทะเบียนครุภัณฑ์
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono text-slate-700 font-semibold whitespace-nowrap">
                    {item.assetNumber}
                  </td>
                  <td className="p-3.5 font-medium text-slate-900">
                    <div>{item.name}</div>
                    <div className="text-[11px] text-slate-400">รับเมื่อ: {item.acquisitionDate}</div>
                  </td>
                  <td className="p-3.5 text-slate-500 max-w-xs truncate">{item.specs}</td>
                  <td className="p-3.5 text-right font-bold text-slate-900 font-['Kanit',sans-serif] whitespace-nowrap">
                    {item.price.toLocaleString()}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="font-semibold text-slate-800">{item.location}</div>
                    <div className="text-[11px] text-slate-400">ดูแลโดย: {item.custodian}</div>
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    {item.condition === 'good' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> ปกติ
                      </span>
                    )}
                    {item.condition === 'fair' && (
                      <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        พอใช้
                      </span>
                    )}
                    {item.condition === 'damaged' && (
                      <span className="text-[11px] font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded-full">
                        ชำรุด
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {onUpdateAsset && (
                        <button
                          onClick={() => setEditingAsset(item)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="แก้ไขครุภัณฑ์"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteAsset && (
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="ลบครุภัณฑ์"
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
        </table>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-['Kanit',sans-serif]">
                ลงทะเบียนครุภัณฑ์ใหม่
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">หมายเลขครุภัณฑ์ (ปล่อยว่างเพื่อสร้างอัตโนมัติ)</label>
                <input
                  type="text"
                  value={assetNumber}
                  onChange={(e) => setAssetNumber(e.target.value)}
                  placeholder={`ศธ 04052.12/${String(fiscalYear).slice(2)}/...`}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">ชื่อรายการครุภัณฑ์ *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น เครื่องปรับอากาศ ขนาด 18,000 BTU"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">คุณลักษณะเฉพาะ (Specs)</label>
                <input
                  type="text"
                  value={specs}
                  onChange={(e) => setSpecs(e.target.value)}
                  placeholder="เช่น ยี่ห้อ Daikin พร้อมติดตั้งและรับประกัน 5 ปี"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">ราคาจัดซื้อ (บาท)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">แหล่งเงิน</label>
                  <input
                    type="text"
                    value={fundingSource}
                    onChange={(e) => setFundingSource(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">สถานที่ติดตั้ง/จัดเก็บ</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="เช่น ห้องปฏิบัติการวิทยาศาสตร์"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ผู้ครอบครอง/ดูแล</label>
                  <input
                    type="text"
                    value={custodian}
                    onChange={(e) => setCustodian(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  บันทึกครุภัณฑ์
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-['Kanit',sans-serif]">
                แก้ไขข้อมูลครุภัณฑ์
              </h3>
              <button onClick={() => setEditingAsset(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">หมายเลขครุภัณฑ์</label>
                <input
                  type="text"
                  required
                  value={editingAsset.assetNumber}
                  onChange={(e) => setEditingAsset({ ...editingAsset, assetNumber: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">ชื่อรายการครุภัณฑ์ *</label>
                <input
                  type="text"
                  required
                  value={editingAsset.name}
                  onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">คุณลักษณะเฉพาะ (Specs)</label>
                <input
                  type="text"
                  value={editingAsset.specs}
                  onChange={(e) => setEditingAsset({ ...editingAsset, specs: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">ราคาจัดซื้อ (บาท)</label>
                  <input
                    type="number"
                    required
                    value={editingAsset.price}
                    onChange={(e) => setEditingAsset({ ...editingAsset, price: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">สภาพครุภัณฑ์</label>
                  <select
                    value={editingAsset.condition}
                    onChange={(e) => setEditingAsset({ ...editingAsset, condition: e.target.value as FixedAsset['condition'] })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="good">ปกติ (พร้อมใช้งาน)</option>
                    <option value="fair">พอใช้</option>
                    <option value="damaged">ชำรุด</option>
                    <option value="disposed">จำหน่ายแล้ว</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">สถานที่ติดตั้ง/จัดเก็บ</label>
                  <input
                    type="text"
                    value={editingAsset.location}
                    onChange={(e) => setEditingAsset({ ...editingAsset, location: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ผู้ครอบครอง/ดูแล</label>
                  <input
                    type="text"
                    value={editingAsset.custodian}
                    onChange={(e) => setEditingAsset({ ...editingAsset, custodian: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleDelete(editingAsset);
                    setEditingAsset(null);
                  }}
                  className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  ลบครุภัณฑ์นี้
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingAsset(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
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
