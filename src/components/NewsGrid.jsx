export default function NewsGrid({ articles }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {articles.map((article) => (
        <a key={article.id} href={article.link} target="_blank" rel="noreferrer" className="card-surface group overflow-hidden">
          <div className="relative h-40 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 transition group-hover:opacity-90" />
            <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          </div>
          <div className="space-y-2 p-4">
            <p className="text-xs uppercase tracking-widest text-bgfc-gold">Top Story</p>
            <h3 className="text-lg font-display font-semibold text-white">{article.title}</h3>
            <p className="text-sm text-white/70">{article.excerpt}</p>
            <p className="text-xs text-white/50">{new Date(article.publishedAt).toLocaleDateString()}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
