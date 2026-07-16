import { getAuthor } from '../core/store.js';

const TINT_CACHE_KEY = 'tintCache';
const TINT_CACHE_MAX = 64;

let _tintCache = null;

export const PLACEHOLDER_THUMBNAIL = 'assets/no-image.jpg';

const TYPE_ICONS = {
    Publication: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    Project:     '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><polyline points="8 10 12 14 8 18"/><line x1="14" y1="18" x2="20" y2="18"/></svg>',
    Post:        '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
};

export function typeIcon(type) { return TYPE_ICONS[type] || ''; }

const _parser = new DOMParser();

const _dateFormatter = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });

export function itemSubtitle(item)
{
    if (item.description) return item.description;
    if (item.month && item.year)
        return _dateFormatter.format(new Date(item.year, item.month - 1, 1));
    return '';
}

export function setDescription(el, description)
{
    const doc = _parser.parseFromString(description, 'text/html');
    for (const node of [...doc.body.childNodes])
    {
        if (node.nodeType === Node.TEXT_NODE)
        {
            el.appendChild(document.createTextNode(node.textContent));
        }
        else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A')
        {
            const href = node.getAttribute('href') || '';
            if (/^https?:\/\//.test(href))
            {
                const a = document.createElement('a');
                a.href = href;
                a.rel = 'noopener noreferrer';
                a.target = '_blank';
                a.textContent = node.textContent;
                el.appendChild(a);
            }
            else
            {
                el.appendChild(document.createTextNode(node.textContent));
            }
        }
        // all other element types are dropped
    }
}

export function appendAuthors(el, authorNames)
{
    for (let i = 0; i < authorNames.length; i++)
    {
        const author = getAuthor(authorNames[i]);
        const sep = i === authorNames.length - 1 ? '.' : ', ';
        if (author.url && /^https?:\/\//.test(author.url))
        {
            const a = document.createElement('a');
            a.href = author.url;
            a.rel = 'noopener noreferrer';
            a.textContent = author.name;
            el.appendChild(a);
        }
        else
        {
            el.appendChild(document.createTextNode(author.name));
        }
        el.appendChild(document.createTextNode(sep));
    }
}

const FORGE_HOSTS = {
    'github.com':    { icon: '#icon-github',    label: 'GitHub' },
    'gitlab.com':    { icon: '#icon-gitlab',    label: 'GitLab' },
    'bitbucket.org': { icon: '#icon-bitbucket', label: 'Bitbucket' },
};

function _forgeInfo(url)
{
    try
    {
        const host = new URL(url).hostname.replace(/^www\./, '');
        return FORGE_HOSTS[host] ?? null;
    }
    catch { return null; }
}

export function appendDownload(container, download)
{
    const div = document.createElement('div');
    div.className = 'download';

    const forge = _forgeInfo(download.url);

    const a = document.createElement('a');
    a.href = download.url;
    a.className = 'download-link';
    a.setAttribute('aria-label', download.description);
    a.title = download.description;
    if (/^https?:\/\//.test(download.url))
    {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
    }

    if (forge)
    {
        // Extract owner/repo from the URL path for the hover card
        try
        {
            const parts = new URL(download.url).pathname.replace(/^\//, '').split('/');
            const repoPath = parts.slice(0, 2).join('/');
            if (repoPath) div.dataset.forgeCard = repoPath;
        }
        catch {}
        div.dataset.forge = forge.label.toLowerCase();
    }

    const iconId = forge ? forge.icon : download.icon;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'download-icon');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.75');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', iconId);
    svg.appendChild(use);
    a.appendChild(svg);

    const label = document.createElement('span');
    label.className = 'download-description';
    label.textContent = download.description;
    a.appendChild(label);

    div.appendChild(a);
    container.appendChild(div);
}

export function buildYearHeading(year, topAnchorId)
{
    const h3 = document.createElement('h3');
    h3.className = 'item-year-heading';
    h3.appendChild(document.createTextNode(year));
    const link = document.createElement('a');
    link.className = 'to-top-url';
    link.href = '#' + topAnchorId;
    link.setAttribute('aria-label', 'Back to top');
    link.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
    h3.appendChild(link);
    return h3;
}

export function buildListItem(parent, item)
{
    if (item.type)
    {
        const badge = document.createElement('span');
        badge.className = 'item-type-badge';
        badge.setAttribute('aria-hidden', 'true');
        badge.innerHTML = typeIcon(item.type);
        parent.appendChild(badge);
    }

    const h4 = document.createElement('h4');
    h4.className = 'item-title';
    const aTitle = document.createElement('a');
    aTitle.href = item.url;
    aTitle.textContent = item.title;
    h4.appendChild(aTitle);
    parent.appendChild(h4);

    if (item.authors?.length)
    {
        const pAuthors = document.createElement('p');
        pAuthors.className = 'item-authors';
        appendAuthors(pAuthors, item.authors);
        parent.appendChild(pAuthors);
    }

    const subtitle = itemSubtitle(item);
    if (subtitle)
    {
        const pDesc = document.createElement('p');
        pDesc.className = 'item-description';
        setDescription(pDesc, subtitle);
        parent.appendChild(pDesc);
    }
}

// ── Tint ──────────────────────────────────────────────────

function loadTintCache()
{
    if (_tintCache) return _tintCache;
    try { _tintCache = JSON.parse(localStorage.getItem(TINT_CACHE_KEY) || '{}'); }
    catch { _tintCache = {}; }
    return _tintCache;
}

function saveTintCache(cache)
{
    const keys = Object.keys(cache);
    if (keys.length > TINT_CACHE_MAX)
    {
        const pruned = {};
        const keep = Math.floor(TINT_CACHE_MAX * 0.75);
        for (const k of keys.slice(keys.length - keep)) pruned[k] = cache[k];
        _tintCache = pruned;
    }
    try { localStorage.setItem(TINT_CACHE_KEY, JSON.stringify(_tintCache)); }
    catch {}
}

function extractDominantColor(img)
{
    try
    {
        const SIZE = 24;
        const canvas = document.createElement('canvas');
        canvas.width = SIZE; canvas.height = SIZE;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, SIZE, SIZE);
        const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4)
        {
            const a = data[i + 3];
            if (a < 128) continue;
            r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
        }
        if (!count) return null;

        r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count);

        const delta = Math.max(r, g, b) - Math.min(r, g, b);
        if (delta < 20) return null;

        const boost = 1.6, avg = (r + g + b) / 3;
        r = Math.min(255, Math.round(avg + (r - avg) * boost));
        g = Math.min(255, Math.round(avg + (g - avg) * boost));
        b = Math.min(255, Math.round(avg + (b - avg) * boost));

        return `${r},${g},${b}`;
    }
    catch { return null; }
}

function applyTint(el, rgb)
{
    if (!rgb) return;
    el.style.setProperty('--card-tint', `rgb(${rgb})`);
    el.style.setProperty('--card-tint-glow', `rgba(${rgb},0.30)`);
    el.style.setProperty('--card-tint-dim', `rgba(${rgb},0.65)`);
    el.classList.add('has-tint');
}

export function tintFromThumbnail(el, img, src)
{
    const cache = loadTintCache();
    if (cache[src] !== undefined) { applyTint(el, cache[src]); return; }
    const sample = () =>
    {
        const rgb = extractDominantColor(img);
        cache[src] = rgb ?? '';
        saveTintCache(cache);
        applyTint(el, rgb);
    };
    if (img.complete && img.naturalWidth) sample();
    else img.addEventListener('load', sample, { once: true });
}

