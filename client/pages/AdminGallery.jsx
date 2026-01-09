import React, { useMemo, useState } from "react";

const seedCollections = [
  {
    id: "1",
    title: "ISRO Ceremony",
    year: "2025",
    category: "Event",
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    ],
  },
  {
    id: "2",
    title: "Pre-wedding in Goa",
    year: "2024",
    category: "Workshop",
    images: [
      "https://images.unsplash.com/photo-1520854223473-4a129c60036c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    ],
  },
];

const emptyForm = {
  id: null,
  title: "",
  year: "2025",
  category: "Event",
  description: "",
  images: [],
};

export default function AdminGallery() {
  const [collections, setCollections] = useState(seedCollections);
  const [form, setForm] = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const stats = useMemo(() => {
    const total = collections.length;
    const images = collections.reduce((sum, c) => sum + c.images.length, 0);
    const events = collections.filter((c) => c.category === "Event").length;
    const workshops = collections.filter((c) => c.category === "Workshop").length;
    return { total, images, events, workshops };
  }, [collections]);

  const openModal = (collection = null) => {
    if (collection) {
      setForm({ ...collection, images: collection.images.map((src, idx) => ({ id: `${collection.id}-${idx}`, src })) });
    } else {
      setForm(emptyForm);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
  };

  const handleFiles = (files) => {
    if (!files) return;
    const selected = Array.from(files).slice(0, 5);
    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, { id: crypto.randomUUID(), src: reader.result }],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((img) => img.id !== id) }));
  };

  const saveCollection = () => {
    if (!form.title.trim()) return;
    const normalizedImages = form.images.map((img) => img.src);
    if (form.id) {
      setCollections((prev) => prev.map((c) => (c.id === form.id ? { ...form, images: normalizedImages } : c)));
    } else {
      setCollections((prev) => [
        {
          ...form,
          id: crypto.randomUUID(),
          images: normalizedImages,
        },
        ...prev,
      ]);
    }
    closeModal();
  };

  const confirmDelete = () => {
    setCollections((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Media</p>
          <h1 className="text-3xl font-semibold text-charcoal-900 dark:text-white">Photo Gallery</h1>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-300">
            Curate featured shoots and keep the homepage visuals fresh.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gold-600"
          onClick={() => openModal()}
        >
          <span className="text-lg">+</span>
          Add Gallery
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Collections" value={stats.total} accent="from-amber-100 to-white" />
        <Stat label="Images" value={stats.images} accent="from-emerald-100 to-white" />
        <Stat label="Events" value={stats.events} accent="from-blue-100 to-white" />
        <Stat label="Workshops" value={stats.workshops} accent="from-rose-50 to-white" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {collections.map((collection) => (
          <article key={collection.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{collection.year}</p>
                <h2 className="text-xl font-semibold text-charcoal-900">{collection.title}</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {collection.category}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-4">
              {collection.images.slice(0, 3).map((img, idx) => (
                <div key={`${collection.id}-${idx}`} className="relative h-32 overflow-hidden rounded-xl">
                  <img src={img} alt={collection.title} className="h-full w-full object-cover" />
                  {idx === 2 && collection.images.length > 3 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                      +{collection.images.length - 3}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-slate-200 px-4 py-3">
              <p className="text-sm text-slate-500">{collection.images.length} photos</p>
              <div className="inline-flex gap-2">
                <button
                  className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  onClick={() => openModal(collection)}
                >
                  Edit
                </button>
                <button
                  className="rounded-md border border-rose-100 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  onClick={() => setDeleteId(collection.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
        {collections.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            No galleries yet. Start by uploading highlights from your latest shoot.
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Gallery</p>
                <h2 className="text-2xl font-semibold text-charcoal-900">
                  {form.id ? "Edit Gallery" : "Add New Gallery"}
                </h2>
              </div>
              <button className="text-slate-400 hover:text-slate-600" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Title" required>
                <input
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Year" required>
                <select
                  value={form.year}
                  onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const year = String(2026 - idx);
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </Field>
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option value="Event">Event</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </Field>
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Upload Images (max 5)" required>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFiles(e.target.files)}
                    className="w-full rounded-lg border border-dashed border-slate-300 px-3 py-10 text-center text-sm text-slate-400"
                  />
                </Field>
              </div>
            </div>
            {form.images.length > 0 && (
              <div className="mt-6 rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-charcoal-900">Selected Images</p>
                <div className="mt-4 grid grid-cols-5 gap-3">
                  {form.images.map((img) => (
                    <div key={img.id} className="relative h-20 overflow-hidden rounded-lg">
                      <img src={img.src} alt="preview" className="h-full w-full object-cover" />
                      <button
                        className="absolute right-1 top-1 rounded-full bg-black/50 px-2 text-xs text-white"
                        onClick={() => removeImage(img.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button className="rounded-md border border-slate-200 px-4 py-2 text-sm" onClick={closeModal}>
                Cancel
              </button>
              <button className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white" onClick={saveCollection}>
                {form.id ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-3xl text-rose-500">
              !
            </div>
            <h3 className="mt-4 text-lg font-semibold text-charcoal-900">Delete this gallery?</h3>
            <p className="mt-2 text-sm text-slate-500">This action cannot be undone.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button className="rounded-md border border-slate-200 px-4 py-2 text-sm" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="rounded-md bg-rose-500 px-4 py-2 text-sm font-semibold text-white" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${accent} p-4 shadow-inner`}>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-charcoal-900">{value}</p>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {required && <span className="text-rose-500"> *</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}
