import { useMemo, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';
import { useData } from '../../context/DataContext.jsx';

const emptyPromotion = {
  title: '',
  description: '',
  imageUrl: '',
  cta: '',
  link: '',
  active: true,
  order: 0,
  status: 'draft'
};

export default function PromotionsManager() {
  const { promotions } = useData();
  const { createPromotion, updatePromotion, deletePromotion } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formValues, setFormValues] = useState(emptyPromotion);
  const [file, setFile] = useState(null);

  const sortedPromotions = useMemo(
    () => [...(promotions ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [promotions]
  );

  const openModal = (promotion) => {
    setEditing(promotion ?? null);
    setFormValues(promotion ? { ...emptyPromotion, ...promotion } : emptyPromotion);
    setFile(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setFormValues(emptyPromotion);
    setFile(null);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      values: {
        title: formValues.title,
        description: formValues.description,
        imageUrl: formValues.imageUrl,
        cta: formValues.cta,
        link: formValues.link,
        active: formValues.active,
        order: Number(formValues.order) || 0,
        status: formValues.status
      },
      file
    };
    if (editing?.id) {
      await updatePromotion(editing.id, payload);
    } else {
      await createPromotion(payload);
    }
    closeModal();
  };

  const handleDelete = async (promotionId) => {
    if (!window.confirm('Remove this promotion?')) return;
    await deletePromotion(promotionId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-white">Promotions</h2>
          <p className="text-sm text-white/60">Update hero carousel cards shown on the home page.</p>
        </div>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center justify-center rounded-full bg-bgfc-gold px-5 py-2 text-sm font-semibold text-bgfc-charcoal shadow-lg transition hover:bg-bgfc-gold/80"
        >
          New promotion
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr className="text-left text-xs uppercase tracking-[0.25em] text-white/50">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">CTA</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedPromotions.map((promo) => (
              <tr key={promo.id ?? promo.title} className="text-sm text-white/80">
                <td className="px-4 py-3">{promo.order ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-white">{promo.title}</div>
                  <p className="text-xs text-white/60">{promo.description}</p>
                </td>
                <td className="px-4 py-3">{promo.cta}</td>
                <td className="px-4 py-3">{promo.active ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openModal(promo)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/70 transition hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(promo.id)}
                      className="rounded-full border border-red-500/40 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-300 transition hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit Promotion' : 'Create Promotion'}
        description="Upload imagery to Firebase Storage and craft the messaging BGFC supporters will see first."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="text-white/70">Title</span>
              <input
                name="title"
                value={formValues.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
                required
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-white/70">CTA Label</span>
              <input
                name="cta"
                value={formValues.cta}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
                required
              />
            </label>
          </div>
          <label className="space-y-2 text-sm">
            <span className="text-white/70">Description</span>
            <textarea
              name="description"
              value={formValues.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
              required
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="text-white/70">Target link</span>
              <input
                name="link"
                value={formValues.link}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
                required
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-white/70">Image URL (optional)</span>
              <input
                name="imageUrl"
                value={formValues.imageUrl}
                onChange={handleChange}
                placeholder="https://"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
              />
            </label>
          </div>
          <label className="space-y-2 text-sm">
            <span className="text-white/70">Upload image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-dashed border-white/20 bg-black/30 px-3 py-2 text-sm text-white"
            />
            <p className="text-xs text-white/40">If supplied, the uploaded asset will replace the current image.</p>
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm">
              <span className="text-white/70">Display Order</span>
              <input
                type="number"
                name="order"
                value={formValues.order}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
              />
            </label>
            <label className="flex items-center gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                name="active"
                checked={formValues.active}
                onChange={handleChange}
                className="h-4 w-4 rounded border-white/20 bg-black/50 text-bgfc-gold focus:ring-bgfc-gold"
              />
              <span>Active</span>
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-white/70">Status</span>
              <select
                name="status"
                value={formValues.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70 transition hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-bgfc-gold px-5 py-2 text-sm font-semibold text-bgfc-charcoal shadow-lg transition hover:bg-bgfc-gold/80"
            >
              {editing ? 'Save changes' : 'Create promotion'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
