import { createItemPageController } from './item-controls.js';

export async function createView(readyFn, config)
{
    const el = document.getElementById('item-list');

    try { await readyFn(); }
    catch (e)
    {
        console.error(`Failed to load ${config.storagePrefix} data:`, e);
        if (el)
        {
            const body = el.querySelector('#item-list-body') ?? el;
            body.setAttribute('aria-busy', 'false');
            body.innerHTML = '<p role="alert">Failed to load data.</p>';
        }
        return;
    }

    const { rebuildItems, buildControls } = createItemPageController(config);

    if (el)
    {
        const h2 = el.querySelector('h2');
        const slot = document.createElement('div');
        if (h2) h2.after(slot); else el.prepend(slot);
        buildControls(slot);
    }

    rebuildItems();
}
