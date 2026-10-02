/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ModuleId,
  ProcurementTask,
  MaterialItem,
  RequisitionSlip,
  BorrowRecord,
  FixedAsset,
  TextbookRecord,
  AuditItem,
  SchoolProfile,
  Department,
  StaffPersonnel,
  ApprovedProject,
  ProjectActivity,
} from './types';
import {
  INITIAL_TASKS,
  INITIAL_MATERIALS,
  INITIAL_REQUISITIONS,
  INITIAL_BORROWS,
  INITIAL_ASSETS,
  INITIAL_TEXTBOOKS,
  INITIAL_AUDIT_ITEMS,
  INITIAL_SCHOOL_PROFILE,
  INITIAL_DEPARTMENTS,
  INITIAL_STAFF,
  INITIAL_PROJECTS,
} from './mockData';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { HomeDashboard } from './components/HomeDashboard';
import { WizardModal } from './components/WizardModal';
import { FollowUpModal } from './components/FollowUpModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProcurementModule } from './components/modules/ProcurementModule';
import { ProcurementRegisterModule } from './components/modules/ProcurementRegisterModule';
import { W804Module } from './components/modules/W804Module';
import { W119Module } from './components/modules/W119Module';
import { TextbooksModule } from './components/modules/TextbooksModule';
import { QuarterlyAnnouncementModule } from './components/modules/QuarterlyAnnouncementModule';
import { InventoryLedgerModule } from './components/modules/InventoryLedgerModule';
import { RequisitionModule } from './components/modules/RequisitionModule';
import { BorrowReturnModule } from './components/modules/BorrowReturnModule';
import { MaterialReportModule } from './components/modules/MaterialReportModule';
import { AssetRegisterModule } from './components/modules/AssetRegisterModule';
import { AnnualAuditModule } from './components/modules/AnnualAuditModule';
import { BackupRestoreModule } from './components/modules/BackupRestoreModule';
import { SchoolSettingsModule } from './components/modules/SchoolSettingsModule';
import { PersonnelModule } from './components/modules/PersonnelModule';
import { ProjectsModule } from './components/modules/ProjectsModule';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fiscalYear, setFiscalYear] = useState<number>(2569);

  // Persistent States
  const [tasks, setTasks] = useState<ProcurementTask[]>(() => {
    const saved = localStorage.getItem('nikomsaito_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [materials, setMaterials] = useState<MaterialItem[]>(() => {
    const saved = localStorage.getItem('nikomsaito_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [requisitions, setRequisitions] = useState<RequisitionSlip[]>(() => {
    const saved = localStorage.getItem('nikomsaito_requisitions');
    return saved ? JSON.parse(saved) : INITIAL_REQUISITIONS;
  });

  const [borrows, setBorrows] = useState<BorrowRecord[]>(() => {
    const saved = localStorage.getItem('nikomsaito_borrows');
    return saved ? JSON.parse(saved) : INITIAL_BORROWS;
  });

  const [assets, setAssets] = useState<FixedAsset[]>(() => {
    const saved = localStorage.getItem('nikomsaito_assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [textbooks, setTextbooks] = useState<TextbookRecord[]>(() => {
    const saved = localStorage.getItem('nikomsaito_textbooks');
    return saved ? JSON.parse(saved) : INITIAL_TEXTBOOKS;
  });

  const [auditItems, setAuditItems] = useState<AuditItem[]>(() => {
    const saved = localStorage.getItem('nikomsaito_audit_items');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_ITEMS;
  });

  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem('nikomsaito_profile');
    return saved ? JSON.parse(saved) : INITIAL_SCHOOL_PROFILE;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('nikomsaito_departments');
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [staffList, setStaffList] = useState<StaffPersonnel[]>(() => {
    const saved = localStorage.getItem('nikomsaito_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [projects, setProjects] = useState<ApprovedProject[]>(() => {
    const saved = localStorage.getItem('nikomsaito_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('nikomsaito_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('nikomsaito_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('nikomsaito_requisitions', JSON.stringify(requisitions));
  }, [requisitions]);

  useEffect(() => {
    localStorage.setItem('nikomsaito_borrows', JSON.stringify(borrows));
  }, [borrows]);

  useEffect(() => {
    localStorage.setItem('nikomsaito_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('nikomsaito_textbooks', JSON.stringify(textbooks));
  }, [textbooks]);

  useEffect(() => {
    localStorage.setItem('nikomsaito_audit_items', JSON.stringify(auditItems));
  }, [auditItems]);

  useEffect(() => {
    localStorage.setItem('nikomsaito_profile', JSON.stringify(schoolProfile));
  }, [schoolProfile]);

  useEffect(() => {
    localStorage.setItem('nikomsaito_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('nikomsaito_staff', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('nikomsaito_projects', JSON.stringify(projects));
  }, [projects]);

  // Modals state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<ProcurementTask | null>(null);

  // Handlers for Procurement
  const handleSaveNewTask = (newTask: ProcurementTask) => {
    setTasks((prev) => [newTask, ...prev]);

    // If linked to an approved project, update project's and activity's spent budget
    if (newTask.projectId) {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === newTask.projectId) {
            return {
              ...p,
              spentBudget: p.spentBudget + newTask.amount,
              activities: p.activities.map((a) =>
                a.id === newTask.activityId
                  ? { ...a, spentBudget: a.spentBudget + newTask.amount }
                  : a
              ),
            };
          }
          return p;
        })
      );
    }
  };

  const handleUpdateTaskStatus = (
    taskId: string,
    status: ProcurementTask['status'],
    statusText: string
  ) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status, statusText } : t))
    );
    if (selectedTaskForDetail && selectedTaskForDetail.id === taskId) {
      setSelectedTaskForDetail((prev) => (prev ? { ...prev, status, statusText } : null));
    }
  };

  const handleStockAdjustment = (materialId: string, delta: number) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === materialId
          ? { ...m, balance: Math.max(0, m.balance + delta), lastUpdated: '1 ต.ค. 69' }
          : m
      )
    );
  };

  const handleAddMaterial = (newMat: MaterialItem) => {
    setMaterials((prev) => [...prev, newMat]);
  };

  const handleAddRequisition = (newReq: RequisitionSlip) => {
    setRequisitions((prev) => [newReq, ...prev]);
  };

  const handleUpdateRequisitionStatus = (id: string, status: RequisitionSlip['status']) => {
    setRequisitions((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          if (status === 'disbursed' && r.status !== 'disbursed') {
            r.items.forEach((item) => {
              const foundMat = materials.find((m) => m.name.includes(item.name) || item.name.includes(m.name));
              if (foundMat) {
                handleStockAdjustment(foundMat.id, -item.quantity);
              }
            });
          }
          return { ...r, status };
        }
        return r;
      })
    );
  };

  const handleAddBorrow = (newBorrow: BorrowRecord) => {
    setBorrows((prev) => [newBorrow, ...prev]);
  };

  const handleReturnBorrow = (id: string) => {
    setBorrows((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: 'returned',
              returnDate: '1 ต.ค. 69',
              note: 'ส่งคืนเรียบร้อยในสภาพสมบูรณ์',
            }
          : b
      )
    );
  };

  const handleAddAsset = (newAsset: FixedAsset) => {
    setAssets((prev) => [newAsset, ...prev]);
  };

  const handleAddTextbook = (newBook: TextbookRecord) => {
    setTextbooks((prev) => [...prev, newBook]);
  };

  const handleUpdateTextbookStatus = (id: string, status: TextbookRecord['status']) => {
    setTextbooks((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const handleUpdateAuditStatus = (id: string, status: AuditItem['status']) => {
    setAuditItems((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  // Staff and Project Handlers
  const handleAddStaff = (newStaff: StaffPersonnel) => {
    setStaffList((prev) => [...prev, newStaff]);
  };

  const handleUpdateStaff = (updatedStaff: StaffPersonnel) => {
    setStaffList((prev) => prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
  };

  const handleAddProject = (newProject: ApprovedProject) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleAddActivity = (projectId: string, activity: ProjectActivity) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            activities: [...p.activities, activity],
          };
        }
        return p;
      })
    );
  };

  const handleUpdateActivityStatus = (
    projectId: string,
    activityId: string,
    status: ProjectActivity['status']
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            activities: p.activities.map((a) => (a.id === activityId ? { ...a, status } : a)),
          };
        }
        return p;
      })
    );
  };

  // Backup & Restore
  const handleExportData = () => {
    const backupData = {
      nikomsaito_tasks: tasks,
      nikomsaito_materials: materials,
      nikomsaito_requisitions: requisitions,
      nikomsaito_borrows: borrows,
      nikomsaito_assets: assets,
      nikomsaito_textbooks: textbooks,
      nikomsaito_audit_items: auditItems,
      nikomsaito_profile: schoolProfile,
      nikomsaito_departments: departments,
      nikomsaito_staff: staffList,
      nikomsaito_projects: projects,
      exportDate: new Date().toISOString(),
      fiscalYear,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ระบบงานพัสดุ_รรบ้านนิคมสายโท12เหนือ_สำรอง_${fiscalYear}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportData = (data: any) => {
    if (data.nikomsaito_tasks) setTasks(data.nikomsaito_tasks);
    if (data.nikomsaito_materials) setMaterials(data.nikomsaito_materials);
    if (data.nikomsaito_requisitions) setRequisitions(data.nikomsaito_requisitions);
    if (data.nikomsaito_borrows) setBorrows(data.nikomsaito_borrows);
    if (data.nikomsaito_assets) setAssets(data.nikomsaito_assets);
    if (data.nikomsaito_textbooks) setTextbooks(data.nikomsaito_textbooks);
    if (data.nikomsaito_audit_items) setAuditItems(data.nikomsaito_audit_items);
    if (data.nikomsaito_profile) setSchoolProfile(data.nikomsaito_profile);
    if (data.nikomsaito_departments) setDepartments(data.nikomsaito_departments);
    if (data.nikomsaito_staff) setStaffList(data.nikomsaito_staff);
    if (data.nikomsaito_projects) setProjects(data.nikomsaito_projects);
    if (data.fiscalYear) setFiscalYear(data.fiscalYear);
  };

  const handleResetData = () => {
    setTasks(INITIAL_TASKS);
    setMaterials(INITIAL_MATERIALS);
    setRequisitions(INITIAL_REQUISITIONS);
    setBorrows(INITIAL_BORROWS);
    setAssets(INITIAL_ASSETS);
    setTextbooks(INITIAL_TEXTBOOKS);
    setAuditItems(INITIAL_AUDIT_ITEMS);
    setSchoolProfile(INITIAL_SCHOOL_PROFILE);
    setDepartments(INITIAL_DEPARTMENTS);
    setStaffList(INITIAL_STAFF);
    setProjects(INITIAL_PROJECTS);
    localStorage.clear();
  };

  const overdueCount = borrows.filter((b) => b.status === 'overdue').length;
  const pendingRequisitionCount = requisitions.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-['Sarabun',sans-serif]">
      <div className="flex flex-1 min-h-screen">
        {/* Sidebar */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={(mod) => setActiveModule(mod)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          overdueCount={overdueCount}
          pendingRequisitionCount={pendingRequisitionCount}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            activeModule={activeModule}
            fiscalYear={fiscalYear}
            onFiscalYearChange={(year) => setFiscalYear(year)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-7xl w-full mx-auto">
            {activeModule === 'home' && (
              <HomeDashboard
                tasks={tasks}
                onSelectModule={(mod) => setActiveModule(mod)}
                onOpenWizard={() => setIsWizardOpen(true)}
                onOpenAlerts={() => setIsAlertsOpen(true)}
                onSelectTask={(task) => setSelectedTaskForDetail(task)}
                fiscalYear={fiscalYear}
              />
            )}

            {activeModule === 'purchase' && (
              <ProcurementModule
                type="purchase"
                title="งานจัดซื้อพัสดุและวัสดุ"
                subtitle="การจัดซื้อวัสดุการศึกษา สื่อการเรียนการสอน และวัสดุสำนักงาน โรงเรียนบ้านนิคมสายโท 12 เหนือ"
                tasks={tasks}
                onSelectTask={(task) => setSelectedTaskForDetail(task)}
                onOpenWizard={() => setIsWizardOpen(true)}
              />
            )}

            {activeModule === 'hire' && (
              <ProcurementModule
                type="hire"
                title="งานจ้างเหมาบริการ"
                subtitle="การจ้างเหมาบริการ ซ่อมแซมระบบไฟฟ้า ปรับปรุง และบริการทั่วไป"
                tasks={tasks}
                onSelectTask={(task) => setSelectedTaskForDetail(task)}
                onOpenWizard={() => setIsWizardOpen(true)}
              />
            )}

            {activeModule === 'construction' && (
              <ProcurementModule
                type="construction"
                title="งานก่อสร้างและปรับปรุงอาคาร"
                subtitle="งานปรับปรุงซ่อมแซมอาคารเรียน หลังคา ระเบียง และสภาพแวดล้อมเพื่อความปลอดภัย"
                tasks={tasks}
                onSelectTask={(task) => setSelectedTaskForDetail(task)}
                onOpenWizard={() => setIsWizardOpen(true)}
              />
            )}

            {activeModule === 'procurement_register' && (
              <ProcurementRegisterModule
                tasks={tasks}
                fiscalYear={fiscalYear}
                onSelectTask={(task) => setSelectedTaskForDetail(task)}
              />
            )}

            {activeModule === 'w804' && (
              <W804Module
                tasks={tasks}
                onOpenWizard={() => setIsWizardOpen(true)}
                onSelectTask={(task) => setSelectedTaskForDetail(task)}
                fiscalYear={fiscalYear}
              />
            )}

            {activeModule === 'w119' && (
              <W119Module
                tasks={tasks}
                onOpenWizard={() => setIsWizardOpen(true)}
                onSelectTask={(task) => setSelectedTaskForDetail(task)}
                fiscalYear={fiscalYear}
              />
            )}

            {activeModule === 'textbooks' && (
              <TextbooksModule
                textbooks={textbooks}
                onAddTextbook={handleAddTextbook}
                onUpdateStatus={handleUpdateTextbookStatus}
              />
            )}

            {activeModule === 'quarterly_announcement' && (
              <QuarterlyAnnouncementModule tasks={tasks} fiscalYear={fiscalYear} />
            )}

            {activeModule === 'inventory_ledger' && (
              <InventoryLedgerModule
                materials={materials}
                onAddMaterial={handleAddMaterial}
                onStockAdjustment={handleStockAdjustment}
              />
            )}

            {activeModule === 'requisition' && (
              <RequisitionModule
                requisitions={requisitions}
                materials={materials}
                onAddRequisition={handleAddRequisition}
                onUpdateStatus={handleUpdateRequisitionStatus}
              />
            )}

            {activeModule === 'borrow_return' && (
              <BorrowReturnModule
                borrows={borrows}
                onAddBorrow={handleAddBorrow}
                onReturnBorrow={handleReturnBorrow}
              />
            )}

            {activeModule === 'material_report' && (
              <MaterialReportModule materials={materials} fiscalYear={fiscalYear} />
            )}

            {activeModule === 'asset_register' && (
              <AssetRegisterModule
                assets={assets}
                onAddAsset={handleAddAsset}
                fiscalYear={fiscalYear}
              />
            )}

            {activeModule === 'annual_audit' && (
              <AnnualAuditModule
                auditItems={auditItems}
                onUpdateAuditStatus={handleUpdateAuditStatus}
                fiscalYear={fiscalYear}
              />
            )}

            {activeModule === 'projects' && (
              <ProjectsModule
                projects={projects}
                staffList={staffList}
                departments={departments}
                tasks={tasks}
                onAddProject={handleAddProject}
                onAddActivity={handleAddActivity}
                onUpdateActivityStatus={handleUpdateActivityStatus}
                fiscalYear={fiscalYear}
              />
            )}

            {activeModule === 'personnel' && (
              <PersonnelModule
                staffList={staffList}
                departments={departments}
                onAddStaff={handleAddStaff}
                onUpdateStaff={handleUpdateStaff}
              />
            )}

            {activeModule === 'school_settings' && (
              <SchoolSettingsModule
                profile={schoolProfile}
                departments={departments}
                staff={staffList}
                onUpdateProfile={(p) => setSchoolProfile(p)}
                onUpdateDepartments={(d) => setDepartments(d)}
              />
            )}

            {activeModule === 'backup_restore' && (
              <BackupRestoreModule
                onExportData={handleExportData}
                onImportData={handleImportData}
                onResetData={handleResetData}
                fiscalYear={fiscalYear}
              />
            )}
          </main>
        </div>
      </div>

      {/* Global Interactive Modals */}
      <WizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSaveTask={handleSaveNewTask}
        fiscalYear={fiscalYear}
        projects={projects}
        staffList={staffList}
      />

      <FollowUpModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        borrows={borrows}
        onReturnBorrow={handleReturnBorrow}
        onNavigateToBorrow={() => setActiveModule('borrow_return')}
        onNavigateToRequisition={() => setActiveModule('requisition')}
      />

      <ProjectDetailModal
        task={selectedTaskForDetail}
        onClose={() => setSelectedTaskForDetail(null)}
        onUpdateStatus={handleUpdateTaskStatus}
      />
    </div>
  );
}
