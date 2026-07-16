import { allReady, getRecentItems } from '../core/store.js';
import { typeIcon } from '../ui/item-renderer.js';

async function init()
{
    const container = document.getElementById('recent');
    if (!container) return;

    try { await allReady(); }
    catch (e)
    {
        console.error('Failed to load portfolio data:', e);
        container.setAttribute('aria-busy', 'false');
        container.innerHTML = '<p class="recent-empty" role="alert">Could not load recent items.</p>';
        return;
    }

    const items = getRecentItems(6);
    container.setAttribute('aria-busy', 'false');
    if (!items.length)
    {
        container.innerHTML = '<p class="recent-empty">No recent items.</p>';
        return;
    }

    for (const item of items)
    {
        const div = document.createElement('div');
        div.className = 'recent-container';

        const a = document.createElement('a');
        a.href = item.url;

        if (item.thumbnail)
        {
            const imgWrap = document.createElement('div');
            imgWrap.className = 'recent-thumbnail-wrap';

            const img = document.createElement('img');
            img.className = 'recent-thumbnail';
            img.src = item.thumbnail;
            img.alt = item.title;
            img.loading = 'lazy';

            imgWrap.appendChild(img);
            a.appendChild(imgWrap);
        }

        const caption = document.createElement('span');
        caption.className = 'recent-caption';

        if (item.type)
        {
            const badge = document.createElement('span');
            badge.className = 'recent-type';
            badge.setAttribute('aria-hidden', 'true');
            badge.innerHTML = typeIcon(item.type);
            caption.appendChild(badge);
        }

        caption.appendChild(document.createTextNode(item.title));
        a.appendChild(caption);
        div.appendChild(a);
        container.appendChild(div);
    }
}

init();
