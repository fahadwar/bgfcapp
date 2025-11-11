import { useMemo, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';
import { useData } from '../../context/DataContext.jsx';

const emptyArticle = {
  title: '',
  excerpt: '',
  content: '',
  imageUrl: '',
  publishedAt: '',
  status: 'draft',
  pinned: false
};

const toLocalInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const toIso = (value) => {
  if (!value) return '';
  return new Date(value).toISOString();
};

const formatInlineMarkdown = (text) =>
  text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

const markdownToHtml = (markdown) => {
  if (!markdown) {
    return '<p class="text-white/40"><em>Start typing markdown to preview here.</em></p>';
  }

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let html = '';
  let inList = false;

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += '';
      return;
    }

    if (line.startsWith('- ')) {
      if (!inList) {
        html += '<ul class="list-disc pl-5 space-y-1">';
        inList = true;
      }
      html += `<li>${formatInlineMarkdown(line.slice(2))}</li>`;
      return;
    }

    if (inList) {
      html += '</ul>';
      inList = false;
    }

    if (line.startsWith('### ')) {
      html += `<h3 class="text-lg font-semibold">${formatInlineMarkdown(line.slice(4))}</h3>`;
    } else if (line.startsWith('## ')) {
      html += `<h2 class="text-xl font-semibold">${formatInlineMarkdown(line.slice(3))}</h2>`;
    } else if (line.startsWith('# ')) {
      html += `<h1 class="text-2xl font-semibold">${formatInlineMarkdown(line.slice(2))}</h1>`;
    } else {
      html += `<p>${formatInlineMarkdown(line)}</p>`;
    }
  });

  if (inList) {
    html += '</ul>';
  }

  return html;
};

export default function NewsManager() {
  const { news } = useData();
  const { createNewsArticle, updateNewsArticle, deleteNewsArticle } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formValues, setFormValues] = useState(emptyArticle);

  const orderedNews = useMemo(
    () =>
      [...(news ?? [])]
        .map((article) => ({
          ...article,
          publishedAt: article.publishedAt ? toLocalInput(article.publishedAt) : ''
        }))
        .sort((a, b) => new Date(b.publishedAt ?? 0) - new Date(a.publishedAt ?? 0)),
    [news]
  );

  const openModal = (article) => {
    if (article) {
      setEditing(article);
      setFormValues({
        ...emptyArticle,
        ...article,
        publishedAt: article.publishedAt ? toLocalInput(article.publishedAt) : '',
        pinned: Boolean(article.pinned)
      });
    } else {
      setEditing(null);
      setFormValues(emptyArticle);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setFormValues(emptyArticle);
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
      title: formValues.title,
      excerpt: formValues.excerpt,
      content: formValues.content,
      imageUrl: formValues.imageUrl,
      publishedAt: formValues.publishedAt ? toIso(formValues.publishedAt) : '',
      status: formValues.status,
      pinned: Boolean(formValues.pinned)
    };
    if (editing?.id) {
      await updateNewsArticle(editing.id, payload);
    } else {
      await createNewsArticle(payload);
    }
    closeModal();
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('Delete this article?')) return;
    await deleteNewsArticle(articleId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-white">News</h2>
          <p className="text-sm text-white/60">Publish club announcements, match recaps, and community stories.</p>
        </div>
        <button
          type="button"
          onClick={() => openModal(null)}
          className="inline-flex items-center justify-center rounded-full bg-bgfc-gold px-5 py-2 text-sm font-semibold text-bgfc-charcoal shadow-lg transition hover:bg-bgfc-gold/80"
        >
          New article
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.25em] text-white/50">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Pinned</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orderedNews.map((article) => (
              <tr key={article.id} className="text-sm text-white/80">
                <td className="px-4 py-3">
                  <div className="font-semibold text-white">{article.title}</div>
                  <p className="text-xs text-white/60">{article.excerpt}</p>
                </td>
                <td className="px-4 py-3 capitalize">{article.status ?? 'draft'}</td>
                <td className="px-4 py-3">{article.pinned ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3">
                  {article.publishedAt ? new Date(article.publishedAt).toLocaleString() : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openModal(article)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/70 transition hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(article.id)}
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
        title={editing ? 'Edit Article' : 'Create Article'}
        description="Use markdown to highlight key details, embed links, and format supporter updates."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/70">
              <span>Title</span>
              <input
                name="title"
                value={formValues.title}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-white/70">
              <span>Featured image URL</span>
              <input
                name="imageUrl"
                value={formValues.imageUrl}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
              />
            </label>
          </div>
          <label className="space-y-2 text-sm text-white/70">
            <span>Excerpt</span>
            <textarea
              name="excerpt"
              value={formValues.excerpt}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
            />
          </label>
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="space-y-2 text-sm text-white/70">
              <span>Content (Markdown)</span>
              <textarea
                name="content"
                value={formValues.content}
                onChange={handleChange}
                rows={12}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
              />
            </label>
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Preview</p>
              <div
                className="max-h-80 overflow-y-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/80 space-y-3"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(formValues.content) }}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm text-white/70">
              <span>Publish date</span>
              <input
                type="datetime-local"
                name="publishedAt"
                value={formValues.publishedAt}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-white/70">
              <span>Status</span>
              <select
                name="status"
                value={formValues.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label className="flex items-center gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                name="pinned"
                checked={Boolean(formValues.pinned)}
                onChange={handleChange}
                className="h-4 w-4 rounded border-white/20 bg-black/50 text-bgfc-gold focus:ring-bgfc-gold"
              />
              <span>Pin to Home</span>
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
              {editing ? 'Save article' : 'Publish article'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
