let _authors = {};
let _postsByYear = {};
let _projectsByYear = {};
let _publicationsByYear = {};
// Projects + Publications only — Posts are intentionally excluded from the portfolio/recent views.
let _portfolioItems = [];

function _compareItems(a, b)
{
    if (b.year  !== a.year)  return b.year  - a.year;
    if (b.month !== a.month) return b.month - a.month;
    return (a.title || '').localeCompare(b.title || '');
}

function _indexByYear(map, item)
{
    const yr = item.year;
    if (!map[yr]) map[yr] = [];
    map[yr].push(item);
}

function _sortedYears(map)
{
    return Object.keys(map).map(Number).sort((a, b) => b - a);
}

function _itemsOfYear(map, year)
{
    const items = (map[year] ?? []).slice();
    items.sort(_compareItems);
    return items;
}

function _fetchJson(url)
{
    return fetch(url).then(r =>
    {
        if (!r.ok) throw new Error(`HTTP ${r.status} fetching ${url}`);
        return r.json();
    });
}

// ── Lazy per-dataset loaders ──────────────────────────────────

function _once(fn)
{
    let p = null;
    return () =>
    {
        if (!p)
        {
            p = fn();
            p.catch(() => { p = null; });
        }
        return p;
    };
}

const _ensureAuthors = _once(() =>
    _fetchJson('data/authors.json').then(authors => { _authors = authors; })
);

export const postsReady = _once(() =>
{
    _postsByYear = {};
    return Promise.all([_ensureAuthors(), _fetchJson('data/posts.json')])
        .then(([, posts]) =>
        {
            for (const p of posts) _indexByYear(_postsByYear, { ...p, type: 'Post' });
        });
});

export const projectsReady = _once(() =>
{
    _projectsByYear = {};
    _portfolioItems = _portfolioItems.filter(i => i.type !== 'Project');
    return Promise.all([_ensureAuthors(), _fetchJson('data/projects.json')])
        .then(([, projects]) =>
        {
            for (const p of projects)
            {
                const item = { ...p, type: 'Project' };
                _indexByYear(_projectsByYear, item);
                _portfolioItems.push(item);
            }
        });
});

export const publicationsReady = _once(() =>
{
    _publicationsByYear = {};
    _portfolioItems = _portfolioItems.filter(i => i.type !== 'Publication');
    return Promise.all([_ensureAuthors(), _fetchJson('data/publications.json')])
        .then(([, publications]) =>
        {
            for (const p of publications)
            {
                const item = { ...p, type: 'Publication' };
                _indexByYear(_publicationsByYear, item);
                _portfolioItems.push(item);
            }
        });
});

/** Convenience: load all datasets (used by portfolio and recent views). */
export const allReady = _once(() =>
    Promise.all([postsReady(), projectsReady(), publicationsReady()])
);

// ── Accessors ─────────────────────────────────────────────────

export function getAuthor(name)
{
    if (!(name in _authors)) console.warn(`Unknown author: "${name}"`);
    return _authors[name] ?? { name, url: null };
}

export function getRecentItems(count)
{
    return _portfolioItems.slice().sort(_compareItems).slice(0, count);
}

/**
 * Flat sorted list of all items of the given type.
 * type: 'Project' | 'Publication' | 'Post' | null (all portfolio items)
 */
export function getItems(type)
{
    let items;
    if (type === 'Post')        items = Object.values(_postsByYear).flat();
    else if (type === 'Project')     items = Object.values(_projectsByYear).flat();
    else if (type === 'Publication') items = Object.values(_publicationsByYear).flat();
    else items = _portfolioItems.slice();
    return items.sort(_compareItems);
}

/**
 * Sorted years (descending) for the given type.
 * type: 'Project' | 'Publication' | 'Post' | null (union of Project + Publication)
 */
export function getYears(type)
{
    if (type === 'Post')             return _sortedYears(_postsByYear);
    if (type === 'Project')          return _sortedYears(_projectsByYear);
    if (type === 'Publication')      return _sortedYears(_publicationsByYear);
    const years = new Set([..._sortedYears(_projectsByYear), ..._sortedYears(_publicationsByYear)]);
    return [...years].sort((a, b) => b - a);
}

/**
 * Items of a specific year for the given type, sorted descending by month.
 * type: 'Project' | 'Publication' | 'Post' | null (union of Project + Publication)
 */
export function getOfYear(year, type)
{
    if (type === 'Post')        return _itemsOfYear(_postsByYear, year);
    if (type === 'Project')     return _itemsOfYear(_projectsByYear, year);
    if (type === 'Publication') return _itemsOfYear(_publicationsByYear, year);
    const combined = [
        ..._itemsOfYear(_projectsByYear, year),
        ..._itemsOfYear(_publicationsByYear, year),
    ];
    combined.sort(_compareItems);
    return combined;
}
