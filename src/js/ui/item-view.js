import {
    buildYearHeading, buildListItem, appendAuthors, setDescription, itemSubtitle,
    appendDownload, tintFromThumbnail, typeIcon, PLACEHOLDER_THUMBNAIL,
} from './item-renderer.js';

const VIEW_MODE_KEY = 'viewMode';

// ── View builders ─────────────────────────────────────────────

function makeThumb(src, alt, className)
{
    const img = document.createElement('img');
    img.className = className;
    img.loading = 'lazy';
    img.alt = alt;
    img.crossOrigin = 'anonymous';
    img.width = 224;
    img.height = 224;
    img.onload  = () => { img.style.opacity = '1'; };
    img.onerror = () => { img.style.opacity = '1'; };
    img.src = src;
    return img;
}

function buildTileYear(items, year, section, usePlaceholder)
{
    const tileGrid = document.createElement('div');
    tileGrid.className = 'item-tile-grid';
    section.appendChild(tileGrid);

    for (const item of items)
    {
        const src = item.thumbnail || (usePlaceholder ? PLACEHOLDER_THUMBNAIL : null);
        if (!src) continue;
        const tile = document.createElement('div');
        tile.className = 'item-tile';
        tileGrid.appendChild(tile);

        const tileA = document.createElement('a');
        tileA.href = item.url;
        tile.appendChild(tileA);

        const img = makeThumb(src, item.title, '');
        tileA.appendChild(img);
        tintFromThumbnail(tile, img, src);

        const cap = document.createElement('span');
        cap.className = 'item-tile-caption';
        cap.textContent = item.title;
        tile.appendChild(cap);
    }
}

function buildCardYear(items, year, section, usePlaceholder)
{
    for (const item of items)
    {
        const src = item.thumbnail || (usePlaceholder ? PLACEHOLDER_THUMBNAIL : null);
        const article = document.createElement('article');
        article.className = 'item-thumbnail-view container';
        article.tabIndex = 0;
        article.setAttribute('role', 'link');
        article.setAttribute('aria-label', item.title);
        const _navigate = () =>
        {
            if (item.url.startsWith('http')) window.open(item.url, '_blank', 'noopener,noreferrer');
            else window.location.href = item.url;
        };
        article.addEventListener('click', e =>
        {
            if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
            if (e.target.closest('a, button')) return;
            _navigate();
        });
        article.addEventListener('keydown', e =>
        {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _navigate(); }
        });
        section.appendChild(article);

        if (src)
        {
            const aside = document.createElement('aside');
            aside.className = 'container-item';
            article.appendChild(aside);

            const img = makeThumb(src, '', 'item-thumbnail');
            aside.appendChild(img);
            tintFromThumbnail(article, img, src);
        }

        const content = document.createElement('section');
        content.className = 'container-item';
        article.appendChild(content);

        if (item.type)
        {
            const badge = document.createElement('span');
            badge.className = 'item-type-badge';
            badge.setAttribute('aria-hidden', 'true');
            badge.innerHTML = typeIcon(item.type);
            content.appendChild(badge);
        }

        const aTitle = document.createElement('a');
        aTitle.className = 'item-title-url';
        aTitle.href = item.url;
        aTitle.tabIndex = -1;  // article[role=link] is the keyboard entry point
        const hTitle = document.createElement('h4');
        hTitle.className = 'item-title';
        hTitle.textContent = item.title;
        aTitle.appendChild(hTitle);
        content.appendChild(aTitle);

        if (item.authors?.length)
        {
            const p = document.createElement('p');
            p.className = 'item-authors';
            appendAuthors(p, item.authors);
            content.appendChild(p);
        }

        const subtitle = itemSubtitle(item);
        if (subtitle)
        {
            const p = document.createElement('p');
            p.className = 'item-description';
            setDescription(p, subtitle);
            content.appendChild(p);
        }

        const dlRow = document.createElement('div');
        dlRow.className = 'item-urls-table';
        content.appendChild(dlRow);

        for (const dl of (item.downloads || [])) appendDownload(dlRow, dl);
    }
}

function buildListYear(items, section)
{
    const ul = document.createElement('ul');
    ul.className = 'item-list-view';
    section.appendChild(ul);

    for (const item of items)
    {
        const li = document.createElement('li');
        buildListItem(li, item);
        ul.appendChild(li);
    }
}

// Module-level registry: section element → {items, year, usePlaceholder}
const _sectionMeta = new WeakMap();

function _setViewButtons(active)
{
    for (const id of ['tile-view-button', 'thumbnail-view-button', 'list-view-button'])
    {
        const btn = document.getElementById(id);
        if (!btn) continue;
        btn.setAttribute('aria-pressed', String(btn.id === active));
        btn.classList.toggle('active', btn.id === active);
    }
}

function _setViewMode(mode, buttonId)
{
    const body = document.getElementById('item-list-body');
    if (body) body.dataset.viewMode = mode;
    _setViewButtons(buttonId);
    try { localStorage.setItem(VIEW_MODE_KEY, mode); } catch {}
}

function _rebuildSectionView(section, mode)
{
    const meta = _sectionMeta.get(section);
    if (!meta) return;
    // Remove everything except the year heading
    for (const child of [...section.children])
    {
        if (!child.classList.contains('item-year-heading')) child.remove();
    }
    if (mode === 'list')        buildListYear(meta.items, section);
    else if (mode === 'tiles')  buildTileYear(meta.items, meta.year, section, meta.usePlaceholder);
    else                        buildCardYear(meta.items, meta.year, section, meta.usePlaceholder);
}

function _rebuildAllSections(mode)
{
    for (const section of document.querySelectorAll('#item-list-body section[id^="items-"]'))
    {
        _rebuildSectionView(section, mode);
    }
}

export function showTiles()
{
    _rebuildAllSections('tiles');
    _setViewMode('tiles', 'tile-view-button');
}

export function showThumbnails()
{
    _rebuildAllSections('thumbnails');
    _setViewMode('thumbnails', 'thumbnail-view-button');
}

export function showList()
{
    _rebuildAllSections('list');
    _setViewMode('list', 'list-view-button');
}

function _readViewMode()
{
    let stored; try { stored = localStorage.getItem(VIEW_MODE_KEY); } catch {}
    return stored;
}

// Called after initial build — sections already contain the right view,
// so only update the data-view-mode attribute and button states (no rebuild).
export function applyStoredViewMode()
{
    const stored   = _readViewMode();
    const mode     = stored === 'list' ? 'list' : stored === 'tiles' ? 'tiles' : 'thumbnails';
    const buttonId = mode === 'list' ? 'list-view-button' : mode === 'tiles' ? 'tile-view-button' : 'thumbnail-view-button';
    _setViewMode(mode, buttonId);
}

export function clearBuilt()
{
    const body = document.getElementById('item-list-body');
    if (!body) return;
    for (const el of [...body.querySelectorAll('section[id^="items-"]')]) el.remove();
    for (const el of [...body.querySelectorAll('.item-list-empty')]) el.remove();
}

export function buildYearSection(items, year, topAnchorId, usePlaceholder = false, showHeadings = true, viewMode = _readViewMode())
{
    const listBody = document.getElementById('item-list-body');
    if (!listBody) return;

    const section = document.createElement('section');
    section.id = 'items-' + year;
    _sectionMeta.set(section, { items, year, usePlaceholder });
    listBody.appendChild(section);

    if (showHeadings) section.appendChild(buildYearHeading(year, topAnchorId));

    if (viewMode === 'list')       buildListYear(items, section);
    else if (viewMode === 'tiles') buildTileYear(items, year, section, usePlaceholder);
    else                           buildCardYear(items, year, section, usePlaceholder);
}

function _renderEmpty(message)
{
    const body = document.getElementById('item-list-body');
    if (!body) return;
    const p = document.createElement('p');
    p.className = 'item-list-empty';
    p.textContent = message;
    body.appendChild(p);
}

export function buildItemPage(getYears, getItemsOfYear, topAnchorId, usePlaceholder = false)
{
    const years = getYears();
    const body = document.getElementById('item-list-body');
    if (body) body.setAttribute('aria-busy', 'false');

    if (!years.length)
    {
        _renderEmpty('No items match the current filter.');
        applyStoredViewMode();
        return;
    }

    const viewMode = _readViewMode();
    for (const year of years)
    {
        buildYearSection(getItemsOfYear(year), year, topAnchorId, usePlaceholder, true, viewMode);
    }

    applyStoredViewMode();
}

export function buildFlatPage(items, topAnchorId, usePlaceholder = false)
{
    const body = document.getElementById('item-list-body');
    if (body) body.setAttribute('aria-busy', 'false');

    if (!items.length)
    {
        _renderEmpty('No items match the current filter.');
        applyStoredViewMode();
        return;
    }

    const yearMap = {};
    for (const item of items) (yearMap[item.year] = yearMap[item.year] || []).push(item);
    const years = Object.keys(yearMap).map(Number).sort((a, b) => b - a);

    const viewMode = _readViewMode();
    for (const year of years)
    {
        buildYearSection(yearMap[year], year, topAnchorId, usePlaceholder, false, viewMode);
    }

    applyStoredViewMode();
}
