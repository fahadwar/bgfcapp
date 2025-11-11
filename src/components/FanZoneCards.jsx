import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export default function FanZoneCards({ sections }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sections.map((section) => (
        <a
          key={section.id}
          href={section.link}
          target="_blank"
          rel="noreferrer"
          className="card-surface group flex items-start justify-between p-5"
        >
          <div>
            <h3 className="text-lg font-display font-semibold text-white">{section.title}</h3>
            <p className="mt-1 text-sm text-white/70">{section.description}</p>
          </div>
          <ArrowTopRightOnSquareIcon className="h-5 w-5 text-bgfc-gold transition group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>
      ))}
    </div>
  );
}
