import React, { useMemo, useState } from "react";

const emptyForm = {
  id: null,
  title: "",
  image: "",
  file: null,
  visible: true,
};

const seedSliders = [
  {
    id: "1",
    title: "Destination Wedding",
    image: "https://images.unsplash.com/photo-1520854223473-4a129c60036c?auto=format&fit=crop&w=800&q=80",
    visible: true,
    createdAt: "2025-11-05",
  },
  {
    id: "2",
    title: "Bridal Portraits",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    visible: false,
    createdAt: "2025-10-28",
  },
];

export default function AdminSlider() {
  const [sliders, setSliders] = useState(seedSliders);
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(null);

  const visibleCount = useMemo(() => sliders.filter((s) => s.visible).length, [sliders]);

  const openModal = (slider = null) => {
    if (slider) {
      setForm({ ...slider, file: null });
    } else {
      setForm(emptyForm);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, file, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const saveSlider = () => {
    if (!form.title.trim() || !form.image) return;
    if (form.id) {
      setSliders((prev) => prev.map((s) => (s.id === form.id ? { ...s, ...form } : s)));
    } else {
      setSliders((prev) => [
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

  const toggleVisible = (id) => {
    setSliders((prev) => prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));
  };

  const confirmDelete = () => {
    setSliders((prev) => prev.filter((s) => s.id !== showDelete));
    setShowDelete(null);
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-gold-600">Content</p>
          <h1 className="text-3xl font-semibold text-charcoal-900 dark:text-white">Home Slider</h1>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-300">
            Manage hero carousel images that appear on the public website.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gold-600"
          onClick={() => openModal()}
        >
          <span className="text-lg">+</span>
          Add Slide
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-amber-500">Total Slides</p>
          <p className="mt-2 text-3xl font-bold text-charcoal-900">{sliders.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-emerald-500">Visible</p>
          <p className="mt-2 text-3xl font-bold text-charcoal-900">{visibleCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-slate-500">Hidden</p>
          <p className="mt-2 text-3xl font-bold text-charcoal-900">{sliders.length - visibleCount}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Image</th>
              <th className="px-4 py-3 text-left font-semibold">Title</th>
              <th className="px-4 py-3 text-left font-semibold">Show</th>
              <th className="px-4 py-3 text-left font-semibold">Created</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sliders.map((slider) => (
              <tr key={slider.id} className="odd:bg-white even:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={slider.image} alt={slider.title} className="h-16 w-28 rounded-lg object-cover" />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-charcoal-900">{slider.title}</td>
                <td className="px-4 py-3">
                  <label className="inline-flex cursor-pointer items-center gap-2">
                    <span className="text-xs text-slate-500">{slider.visible ? "Visible" : "Hidden"}</span>
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={slider.visible}
                      onChange={() => toggleVisible(slider.id)}
                    />
                    <span className="h-5 w-9 rounded-full bg-slate-300 peer-checked:bg-emerald-500"></span>
                  </label>
                </td>
                <td className="px-4 py-3 text-slate-500">{slider.createdAt || "--"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      onClick={() => openModal(slider)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-red-100 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                      onClick={() => setShowDelete(slider.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sliders.length === 0 && (
          <div className="p-6 text-center text-sm text-slate-500">No slides yet. Add your first hero image.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Slider</p>
                <h2 className="text-2xl font-semibold text-charcoal-900">
                  {form.id ? "Edit Slide" : "Add New Slide"}
                </h2>
              </div>
              <button className="text-slate-400 hover:text-slate-600" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Title
                <input
                  type="text"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Image
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </label>

              {form.image && (
                <img src={form.image} alt="Preview" className="h-40 w-full rounded-xl object-cover" />
              )}

              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => setForm((prev) => ({ ...prev, visible: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Show on homepage hero
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button className="rounded-md border border-slate-200 px-4 py-2 text-sm" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600"
                onClick={saveSlider}
              >
                {form.id ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl text-red-500">
              !
            </div>
            <h3 className="mt-4 text-lg font-semibold text-charcoal-900">Delete this slide?</h3>
            <p className="mt-2 text-sm text-slate-500">This action cannot be undone.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button className="rounded-md border border-slate-200 px-4 py-2 text-sm" onClick={() => setShowDelete(null)}>
                Cancel
              </button>
              <button className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white" onClick={confirmDelete}>
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
