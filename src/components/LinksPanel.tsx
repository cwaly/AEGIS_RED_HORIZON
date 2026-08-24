import { FC, useMemo, useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { RESOURCE_LINKS, LinkCategory } from '../data/resourceLinks';

const CATEGORY_ACCENT: Record<LinkCategory, string> = {
  [LinkCategory.METHODOLOGY]: '#facc15',
  [LinkCategory.CVSS]: '#f59e0b',
  [LinkCategory.CVE_EXPLOITS]: '#f43f5e',
  [LinkCategory.OSINT_PEOPLE]: '#22d3ee',
  [LinkCategory.OSINT_IMAGES]: '#e879f9',
  [LinkCategory.OSINT_INFRA]: '#38bdf8',
  [LinkCategory.HASH_CRYPTO]: '#10b981',
};

export const LinksPanel: FC = () => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RESOURCE_LINKS;
    return RESOURCE_LINKS.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q)
    );
  }, [query]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(filtered.map(l => l.category)));
    return cats.sort((a, b) => Object.values(LinkCategory).indexOf(a) - Object.values(LinkCategory).indexOf(b));
  }, [filtered]);

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Recursos & OSINT</h2>
          <p className="text-gray-400">Wikis de metodología, calculadoras CVSS y herramientas OSINT para apoyar auditorías y CTFs. Todos abren en una pestaña nueva.</p>
        </div>

        <div className="relative mb-8 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, categoría o descripción..."
            className="w-full bg-surface border border-gray-700 text-white text-sm pl-9 pr-4 py-2.5 rounded-lg focus:border-rose-500 focus:outline-none transition-colors"
          />
        </div>

        {categories.length === 0 && (
          <p className="text-gray-500 text-sm">Sin resultados para "{query}".</p>
        )}

        <div className="space-y-8">
          {categories.map((category) => {
            const accent = CATEGORY_ACCENT[category];
            return (
              <div key={category}>
                <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accent }}></span>
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.filter(l => l.category === category).map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ borderLeftColor: accent }}
                      className="relative bg-surface border border-gray-800 border-l-4 rounded-sm p-5 hover:bg-surface/80 hover:border-l-[6px] transition-all group text-left flex flex-col"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">{link.name}</h4>
                        <ExternalLink size={14} className="text-gray-600 group-hover:text-rose-400 transition-colors shrink-0 ml-2 mt-0.5" />
                      </div>
                      <p className="text-xs text-gray-500 flex-1">{link.description}</p>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
