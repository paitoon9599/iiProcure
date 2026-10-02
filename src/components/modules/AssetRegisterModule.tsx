import React, { useState } from 'react';
import { Monitor, Plus, Printer, Search, CheckCircle2, AlertTriangle, ShieldCheck, Tag } from 'lucide-react';
import { FixedAsset } from '../../types';

interface AssetRegisterModuleProps {
  assets: FixedAsset[];
  onAddAsset: (asset: FixedAsset) => void;
  fiscalYear: number;
}

export const AssetRegisterModule: React.FC<AssetRegisterModuleProps> = ({
  assets,
  onAddAsset,
  fiscalYear,
}) => {
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

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
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif]">
                ทะเบียนคุมทรัพย์สินและครุภัณฑ์
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                โรงเรียนบ้านนิคมสายโท 12 เหนือ • ทะเบียนควบคุมครุภัณฑ์และสินทรัพย์ถาวรของทางราชการ
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
            <span>พิมพ์ทะเบียนครุภัณฑ์</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ ลงทะเบียนครุภัณฑ์ใหม่</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">จำนวนครุภัณฑ์ในทะเบียน</div>
          <div className="text-2xl font-bold text-slate-900 font-['Kanit',sans-serif] mt-0.5">
            {filtered.length} <span className="text-xs font-normal text-slate-500">รายการ</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">มูลค่าสินทรัพย์ครุภัณฑ์รวม</div>
          <div className="text-2xl font-bold text-emerald-700 font-['Kanit',sans-serif] mt-0.5">
            {totalAssetValue.toLocaleString()} <span className="text-xs font-normal text-slate-500">บาท</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400">สภาพความพร้อมใช้งาน</div>
          <div className="text-2xl font-bold text-blue-700 font-['Kanit',sans-serif] mt-0.5">
            100% <span className="text-xs font-normal text-slate-500">พร้อมใช้งาน</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อครุภัณฑ์, หมายเลขครุภัณฑ์, ผู้ครอบครอง..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-500 bg-slate-50/50"
          />
        </div>
        <span className="text-xs text-slate-500 hidden sm:block">
          แสดง {filtered.length} รายการ
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">หมายเลขครุภัณฑ์</th>
                <th className="p-3.5">ชื่อครุภัณฑ์และรายละเอียด</th>
                <th className="p-3.5">วันที่ได้มา</th>
                <th className="p-3.5 text-right">ราคา (บาท)</th>
                <th className="p-3.5">สถานที่ติดตั้ง/จัดเก็บ</th>
                <th className="p-3.5">ผู้ครอบครองดูแล</th>
                <th className="p-3.5 text-center">สภาพ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-['Sarabun',sans-serif]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 whitespace-nowrap font-mono font-bold text-slate-900">
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200">
                      {item.assetNumber}
                    </span>
                  </td>
                  <td className="p-3.5 max-w-xs">
                    <div className="font-semibold text-slate-900">{item.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.specs}</div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-slate-600">{item.acquisitionDate}</td>
                  <td className="p-3.5 text-right font-bold text-slate-900 font-['Kanit',sans-serif] whitespace-nowrap">
                    {item.price.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-slate-700 whitespace-nowrap">{item.location}</td>
                  <td className="p-3.5 text-slate-800 whitespace-nowrap font-medium">
                    {item.custodian}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    {item.condition === 'good' && (
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ปกติดี
                      </span>
                    )}
                    {item.condition === 'fair' && (
                      <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        พอใช้
                      </span>
                    )}
                    {item.condition === 'damaged' && (
                      <span className="text-[11px] font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> ชำรุด
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-['Kanit',sans-serif]">
              ลงทะเบียนครุภัณฑ์ใหม่
            </h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">หมายเลขครุภัณฑ์</label>
                <input
                  type="text"
                  value={assetNumber}
                  onChange={(e) => setAssetNumber(e.target.value)}
                  placeholder="เช่น ศธ 04052.12/69/025"
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">ชื่อรายการครุภัณฑ์ *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น เครื่องปรับอากาศ หรือ โน้ตบุ๊กคอมพิวเตอร์"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">คุณลักษณะเฉพาะ (Specs)</label>
                <input
                  type="text"
                  value={specs}
                  onChange={(e) => setSpecs(e.target.value)}
                  placeholder="ยี่ห้อ รุ่น ขนาด หรือสเปกเครื่อง"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">ราคาที่จัดซื้อ (บาท)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">แหล่งเงินงบประมาณ</label>
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
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ผู้ครอบครองดูแล</label>
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
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs"
                >
                  บันทึกลงทะเบียน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
