/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ModuleId,
  ProcurementTask,
  TaskType,
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
import { TaskFormModal } from './components/TaskFormModal';
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
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ProcurementTask | null>(null);
  const [defaultTaskType, setDefaultTaskType] = useState<TaskType>('purchase');

  // Task open actions
  const handleOpenAddTask = (type?: TaskType) => {
    setDefaultTaskType(type || 'purchase');
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleOpenEditTask = (task: ProcurementTask) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  // Handlers for Procurement Tasks (Create / Update / Delete)
  const handleSaveTask = (savedTask: ProcurementTask) => {
    const existing = tasks.find((t) => t.id === savedTask.id);
    if (existing) {
      setTasks((prev) => prev.map((t) => (t.id === savedTask.id ? savedTask : t)));
    } else {
      setTasks((prev) => [savedTask, ...prev]);
    }

    // Update project budget
    if (savedTask.projectId) {
      const delta = existing ? savedTask.amount - existing.amount : savedTask.amount;
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === savedTask.projectId) {
            return {
              ...p,
              spentBudget: Math.max(0, p.spentBudget + delta),
              activities: p.activities.map((a) =>
                a.id === savedTask.activityId
                  ? { ...a, spentBudget: Math.max(0, a.spentBudget + delta) }
                  : a
              ),
            };
          }
          return p;
        })
      );
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTaskForDetail?.id === taskId) {
      setSelectedTaskForDetail(null);
    }
    if (taskToDelete?.projectId) {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === taskToDelete.projectId) {
            return {
              ...p,
              spentBudget: Math.max(0, p.spentBudget - taskToDelete.amount),
              activities: p.activities.map((a) =>
                a.id === taskToDelete.activityId
                  ? { ...a, spentBudget: Math.max(0, a.spentBudget - taskToDelete.amount) }
                  : a
              ),
            };
          }
          return p;
        })
      );
    }
  };

  const handleSaveNewTask = (newTask: ProcurementTask) => {
    handleSaveTask(newTask);
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

  const handleUpdateMaterial = (mat: MaterialItem) => {
    setMaterials((prev) => prev.map((m) => (m.id === mat.id ? mat : m)));
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddRequisition = (newReq: RequisitionSlip) => {
    setRequisitions((prev) => [newReq, ...prev]);
  };

  const handleUpdateRequisition = (req: RequisitionSlip) => {
    setRequisitions((prev) => prev.map((r) => (r.id === req.id ? req : r)));
  };

  const handleDeleteRequisition = (id: string) => {
    setRequisitions((prev) => prev.filter((r) => r.id !== id));
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

  const handleUpdateBorrow = (rec: BorrowRecord) => {
    setBorrows((prev) => prev.map((b) => (b.id === rec.id ? rec : b)));
  };

  const handleDeleteBorrow = (id: string) => {
    setBorrows((prev) => prev.filter((b) => b.id !== id));
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

  const handleUpdateAsset = (asset: FixedAsset) => {
    setAssets((prev) => prev.map((a) => (a.id === asset.id ? asset : a)));
  };

  const handleDeleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddTextbook = (newBook: TextbookRecord) => {
    setTextbooks((prev) => [...prev, newBook]);
  };

  const handleUpdateTextbook = (book: TextbookRecord) => {
    setTextbooks((prev) => prev.map((b) => (b.id === book.id ? book : b)));
  };

  const handleDeleteTextbook = (id: string) => {
    setTextbooks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleUpdateTextbookStatus = (id: string, status: TextbookRecord['status']) => {
    setTextbooks((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const handleAddAuditItem = (item: AuditItem) => {
    setAuditItems((prev) => [item, ...prev]);
  };

  const handleUpdateAuditItem = (item: AuditItem) => {
    setAuditItems((prev) => prev.map((a) => (a.id === item.id ? item : a)));
  };

  const handleDeleteAuditItem = (id: string) => {
    setAuditItems((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdateAuditStatus = (id: string, status: AuditItem['status']) => {
    setAuditItems((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  // Staff Handlers
  const handleAddStaff = (newStaff: StaffPersonnel) => {
    setStaffList((prev) => [...prev, newStaff]);
  };

  const handleUpdateStaff = (updatedStaff: StaffPersonnel) => {
    setStaffList((prev) => prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== staffId));
  };

  // Project Handlers
  const handleAddProject = (newProject: ApprovedProject) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleUpdateProject = (proj: ApprovedProject) => {
    setProjects((prev) => prev.map((p) => (p.id === proj.id ? proj : p)));
  };

  const handleDeleteProject = (projId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projId));
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

  const handleUpdateActivity = (projectId: string, activity: ProjectActivity) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              activities: p.activities.map((a) => (a.id === activity.id ? activity : a)),
            }
          : p
      )
    );
  };

  const handleDeleteActivity = (projectId: string, activityId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              activities: p.activities.filter((a) => a.id !== activityId),
            }
          : p
      )
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
          schoolName={schoolProfile.schoolName}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            activeModule={activeModule}
            fiscalYear={fiscalYear}
            onFiscalYearChange={(year) => setFiscalYear(year)}
            schoolName={schoolProfile.schoolName}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-7xl w-full mx-auto">
            {activeModule === 'home' && (
              <HomeDashboard
                tasks={tasks}
                onSelectModule={(mod) => setActiveModule(mod)}
                onOpenWizard={() => setIsWizardOpen(true)}
                onOpenAlerts={() => setIsAlertsOpen(true)}
                onSelectTask={(task) => setSelectedTaskForDetail(task)}
                onAddNewTask={() => handleOpenAddTask('purchase')}
                onEditTask={handleOpenEditTask}
                onDeleteTask={handleDeleteTask}
                fiscalYear={fiscalYear}
                schoolProfile={schoolProfile}
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
                onAddNewTask={() => handleOpenAddTask('purchase')}
                onEditTask={handleOpenEditTask}
                onDeleteTask={handleDeleteTask}
                schoolProfile={schoolProfile}
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
                onAddNewTask={() => handleOpenAddTask('hire')}
                onEditTask={handleOpenEditTask}
                onDeleteTask={handleDeleteTask}
                schoolProfile={schoolProfile}
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
                onAddNewTask={() => handleOpenAddTask('construction')}
                onEditTask={handleOpenEditTask}
                onDeleteTask={handleDeleteTask}
                schoolProfile={schoolProfile}
              />
            )}

            {activeModule === 'procurement_register' && (
              <ProcurementRegisterModule
                tasks={tasks}
                fiscalYear={fiscalYear}
                onSelectTask={(task) => setSelectedTaskForDetail(task)}
                onAddNewTask={() => handleOpenAddTask('purchase')}
                onEditTask={handleOpenEditTask}
                onDeleteTask={handleDeleteTask}
                schoolProfile={schoolProfile}
              />
            )}

            {activeModule === 'w804' && (
              <W804Module
                tasks={tasks}
                onOpenWizard={() => setIsWizardOpen(true)}
                onSelectTask={(task) => setSelectedTaskForDetail(task)}
                onAddNewTask={() => handleOpenAddTask('w804')}
                onEditTask={handleOpenEditTask}
                onDeleteTask={handleDeleteTask}
                fiscalYear={fiscalYear}
                schoolProfile={schoolProfile}
              />
            )}

            {activeModule === 'w119' && (
              <W119Module
                tasks={tasks}
                onOpenWizard={() => setIsWizardOpen(true)}
                onSelectTask={(task) => setSelectedTaskForDetail(task)}
                onAddNewTask={() => handleOpenAddTask('w119')}
                onEditTask={handleOpenEditTask}
                onDeleteTask={handleDeleteTask}
                fiscalYear={fiscalYear}
                schoolProfile={schoolProfile}
              />
            )}

            {activeModule === 'textbooks' && (
              <TextbooksModule
                textbooks={textbooks}
                onAddTextbook={handleAddTextbook}
                onUpdateTextbook={handleUpdateTextbook}
                onDeleteTextbook={handleDeleteTextbook}
                onUpdateStatus={handleUpdateTextbookStatus}
                schoolProfile={schoolProfile}
              />
            )}

            {activeModule === 'quarterly_announcement' && (
              <QuarterlyAnnouncementModule
                tasks={tasks}
                fiscalYear={fiscalYear}
                schoolProfile={schoolProfile}
              />
            )}

            {activeModule === 'inventory_ledger' && (
              <InventoryLedgerModule
                materials={materials}
                onAddMaterial={handleAddMaterial}
                onUpdateMaterial={handleUpdateMaterial}
                onDeleteMaterial={handleDeleteMaterial}
                onStockAdjustment={handleStockAdjustment}
                schoolProfile={schoolProfile}
              />
            )}

            {activeModule === 'requisition' && (
              <RequisitionModule
                requisitions={requisitions}
                materials={materials}
                onAddRequisition={handleAddRequisition}
                onUpdateRequisition={handleUpdateRequisition}
                onDeleteRequisition={handleDeleteRequisition}
                onUpdateStatus={handleUpdateRequisitionStatus}
                schoolProfile={schoolProfile}
              />
            )}

            {activeModule === 'borrow_return' && (
              <BorrowReturnModule
                borrows={borrows}
                onAddBorrow={handleAddBorrow}
                onUpdateBorrow={handleUpdateBorrow}
                onDeleteBorrow={handleDeleteBorrow}
                onReturnBorrow={handleReturnBorrow}
                schoolProfile={schoolProfile}
              />
            )}

            {activeModule === 'material_report' && (
              <MaterialReportModule
                materials={materials}
                fiscalYear={fiscalYear}
                schoolProfile={schoolProfile}
              />
            )}

            {activeModule === 'asset_register' && (
              <AssetRegisterModule
                assets={assets}
                onAddAsset={handleAddAsset}
                onUpdateAsset={handleUpdateAsset}
                onDeleteAsset={handleDeleteAsset}
                fiscalYear={fiscalYear}
                schoolProfile={schoolProfile}
              />
            )}

            {activeModule === 'annual_audit' && (
              <AnnualAuditModule
                auditItems={auditItems}
                onUpdateAuditStatus={handleUpdateAuditStatus}
                onAddAuditItem={handleAddAuditItem}
                onUpdateAuditItem={handleUpdateAuditItem}
                onDeleteAuditItem={handleDeleteAuditItem}
                fiscalYear={fiscalYear}
                schoolProfile={schoolProfile}
              />
            )}

            {activeModule === 'projects' && (
              <ProjectsModule
                projects={projects}
                staffList={staffList}
                departments={departments}
                tasks={tasks}
                onAddProject={handleAddProject}
                onUpdateProject={handleUpdateProject}
                onDeleteProject={handleDeleteProject}
                onAddActivity={handleAddActivity}
                onUpdateActivity={handleUpdateActivity}
                onDeleteActivity={handleDeleteActivity}
                onUpdateActivityStatus={handleUpdateActivityStatus}
                fiscalYear={fiscalYear}
                schoolProfile={schoolProfile}
              />
            )}

            {activeModule === 'personnel' && (
              <PersonnelModule
                staffList={staffList}
                departments={departments}
                onAddStaff={handleAddStaff}
                onUpdateStaff={handleUpdateStaff}
                onDeleteStaff={handleDeleteStaff}
                schoolProfile={schoolProfile}
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

      <TaskFormModal
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        task={editingTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        fiscalYear={fiscalYear}
        projects={projects}
        staffList={staffList}
        defaultType={defaultTaskType}
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
        schoolProfile={schoolProfile}
      />
    </div>
  );
}
