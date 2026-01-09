import React, { useMemo, useState } from "react";

const emptyForm = {
  id: null,
  name: "",
  email: "",
  whatsapp: "",
  role: "Admin",
  permission: "Full Access",
  blocked: false,
};

const seedUsers = [
  {
    id: "1",
    name: "Akanksha Patil",
    email: "akanksha@studio.com",
    whatsapp: "9876543210",
    role: "Admin",
    permission: "Full Access",
    blocked: false,
    createdAt: "2025-11-02",
  },
  {
    id: "2",
    name: "Ganesh Shinde",
    email: "ganesh@studio.com",
    whatsapp: "9123456780",
    role: "Editor",
    permission: "Quotations + Orders",
    blocked: false,
    createdAt: "2025-10-15",
  },
  {
    id: "3",
    name: "Sakshi Kamat",
    email: "sakshi@studio.com",
    whatsapp: "9988776655",
    role: "Viewer",
    permission: "Read Only",
    blocked: true,
    createdAt: "2025-09-25",
  },
];

const roles = ["Admin", "Editor", "Viewer", "Contributor"];
const permissionPresets = ["Full Access", "Quotations + Orders", "Billing Only", "Read Only"];

export default function AdminUsers() {
  const [users, setUsers] = useState(seedUsers);
  const [form, setForm] = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [blockTarget, setBlockTarget] = useState(null);

  const activeUsers = useMemo(() => users.filter((u) => !u.blocked).length, [users]);

  const openModal = (user = null) => {
    setForm(user ? user : emptyForm);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
  };

  const saveUser = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (form.id) {
      setUsers((prev) => prev.map((u) => (u.id === form.id ? { ...u, ...form } : u)));
    } else {
      setUsers((prev) => [
        {
          ...form,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ]);
    }
    closeModal();
  };

  const confirmDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget));
    setDeleteTarget(null);
  };

  const toggleBlock = () => {
    setUsers((prev) => prev.map((u) => (u.id === blockTarget ? { ...u, blocked: !u.blocked } : u)));
    setBlockTarget(null);
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Team</p>
          <h1 className="text-3xl font-semibold text-charcoal-900 dark:text-white">Manage Users</h1>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-300">
            Invite teammates, adjust their permissions, and keep sensitive workflows secure.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gold-600"
          onClick={() => openModal()}
        >
          <span className="text-lg">+</span>
          Add User
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Users" value={users.length} accent="from-amber-200 to-amber-50" />
        <StatCard label="Active" value={activeUsers} accent="from-emerald-200 to-emerald-50" />
        <StatCard label="Blocked" value={users.length - activeUsers} accent="from-rose-100 to-rose-50" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">Permission</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Created</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="odd:bg-white even:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-charcoal-900">{user.name}</td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">{user.permission}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                      user.blocked ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {user.blocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{user.createdAt || "--"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      onClick={() => openModal(user)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-rose-100 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      onClick={() => setDeleteTarget(user.id)}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                      onClick={() => setBlockTarget(user.id)}
                    >
                      {user.blocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-6 text-center text-sm text-slate-500">No users found. Start by inviting a teammate.</div>
        )}
      </div>

      {modalOpen && (
        <Modal title={form.id ? "Edit User" : "Add New User"} onClose={closeModal}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Full Name<em className="text-red-500">*</em>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Email<em className="text-red-500">*</em>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              WhatsApp Number
              <input
                type="tel"
                maxLength={10}
                value={form.whatsapp}
                onChange={(e) => setForm((prev) => ({ ...prev, whatsapp: e.target.value.replace(/[^0-9]/g, "") }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Role<em className="text-red-500">*</em>
              <select
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              >
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Permission
              <select
                value={form.permission}
                onChange={(e) => setForm((prev) => ({ ...prev, permission: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              >
                {permissionPresets.map((perm) => (
                  <option key={perm}>{perm}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button className="rounded-md border border-slate-200 px-4 py-2 text-sm" onClick={closeModal}>
              Cancel
            </button>
            <button
              className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600"
              onClick={saveUser}
            >
              {form.id ? "Update" : "Save"}
            </button>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete this user?"
          subtitle="This action is permanent and cannot be undone."
          confirmLabel="Yes, delete"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}

      {blockTarget && (
        <ConfirmDialog
          title={users.find((u) => u.id === blockTarget)?.blocked ? "Unblock user?" : "Block user?"}
          subtitle={
            users.find((u) => u.id === blockTarget)?.blocked
              ? "They will regain access immediately."
              : "They will no longer be able to sign in."
          }
          confirmLabel={users.find((u) => u.id === blockTarget)?.blocked ? "Unblock" : "Block"}
          onCancel={() => setBlockTarget(null)}
          onConfirm={toggleBlock}
        />
      )}
    </section>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${accent} p-4 shadow-inner`}>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-charcoal-900">{value}</p>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-charcoal-900">{title}</h2>
          <button className="text-slate-400 hover:text-slate-600" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({ title, subtitle, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-3xl text-amber-500">
          !
        </div>
        <h3 className="mt-4 text-lg font-semibold text-charcoal-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button className="rounded-md border border-slate-200 px-4 py-2 text-sm" onClick={onCancel}>
            Cancel
          </button>
          <button className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
