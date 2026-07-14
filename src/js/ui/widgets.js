export const TAB_ICONS = {
    Filter: '<svg class="ctrl-tab-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
    View:   '<svg class="ctrl-tab-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
};
export const CHEVRON = '<svg class="ctrl-tab-chevron" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

export const SVG_TILE = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>';
export const SVG_CARD = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="18" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="11" width="8" height="2" rx="0.5"/><rect x="13" y="16" width="8" height="2" rx="0.5"/></svg>';
export const SVG_LIST = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';

export function buildViewButton(id, tooltip, svgContent)
{
    const btn = document.createElement('button');
    btn.id = id;
    btn.className = 'view-button';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', tooltip);
    btn.setAttribute('data-tooltip', tooltip);
    btn.title = tooltip;
    btn.innerHTML = svgContent;
    return btn;
}

function _pillGroupShell(container, label)
{
    const wrapper = document.createElement('div');
    wrapper.className = 'pill-group';
    const lbl = document.createElement('span');
    lbl.className = 'pill-group-label';
    lbl.textContent = label;
    wrapper.appendChild(lbl);
    const bar = document.createElement('div');
    bar.className = 'filter-pills';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', label);
    wrapper.appendChild(bar);
    container.appendChild(wrapper);
    return bar;
}

export function buildPillGroup(container, label, options, activeKey, storageKey, onChange)
{
    const bar = _pillGroupShell(container, label);

    for (const { value, text, icon } of options)
    {
        const btn = document.createElement('button');
        btn.className = 'filter-pill';
        if (icon) { btn.innerHTML = icon + text; } else { btn.textContent = text; }
        btn.dataset.value = value;
        const active = value === activeKey();
        btn.setAttribute('aria-pressed', String(active));
        if (active) btn.classList.add('active');

        btn.addEventListener('click', () =>
        {
            try { localStorage.setItem(storageKey, value); } catch {}
            onChange(value);
            for (const b of bar.querySelectorAll('.filter-pill'))
            {
                b.setAttribute('aria-pressed', String(b.dataset.value === value));
                b.classList.toggle('active', b.dataset.value === value);
            }
        });

        bar.appendChild(btn);
    }
}

export function buildReadOnlyPillGroup(container, label, options, activeKey)
{
    const bar = _pillGroupShell(container, label);
    bar.classList.add('filter-pills--readonly');

    for (const { value, text, icon } of options)
    {
        const btn = document.createElement('button');
        btn.className = 'filter-pill';
        if (icon) { btn.innerHTML = icon + text; } else { btn.textContent = text; }
        btn.dataset.value = value;
        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');
        btn.setAttribute('aria-pressed', String(value === activeKey()));
        if (value === activeKey()) btn.classList.add('active');
        bar.appendChild(btn);
    }
}

export function buildSearchField(container, inputId, ariaLabel, onSearch)
{
    const row = document.createElement('div');
    row.className = 'portfolio-search-wrap';

    const label = document.createElement('label');
    label.className = 'portfolio-search-label';
    label.setAttribute('for', inputId);
    label.textContent = 'Search';

    const input = document.createElement('input');
    input.type = 'search';
    input.id = inputId;
    input.className = 'portfolio-search';
    input.placeholder = 'Title, author, description…';
    input.setAttribute('aria-label', ariaLabel);

    let debounce;
    input.addEventListener('input', () =>
    {
        clearTimeout(debounce);
        debounce = setTimeout(() => onSearch(input.value.trim()), 200);
    });

    row.appendChild(label);
    row.appendChild(input);
    container.appendChild(row);
}

export function rebuildYearPills(container, getAvailableYears, selectedYears, onChange)
{
    const focusedYear = container.contains(document.activeElement)
        ? document.activeElement.dataset.year
        : null;
    container.innerHTML = '';
    const available = new Set(getAvailableYears());
    let staleCleared = false;
    for (const y of [...selectedYears])
    {
        if (!available.has(y)) { selectedYears.delete(y); staleCleared = true; }
    }
    if (staleCleared) { onChange(); return; }

    const allBtn = document.createElement('button');
    allBtn.className = 'filter-pill';
    allBtn.textContent = 'All';
    allBtn.dataset.year = 'all';
    const allActive = selectedYears.size === 0;
    allBtn.setAttribute('aria-pressed', String(allActive));
    if (allActive) allBtn.classList.add('active');
    allBtn.addEventListener('click', () => { selectedYears.clear(); onChange(); });
    container.appendChild(allBtn);

    for (const year of [...available])
    {
        const btn = document.createElement('button');
        btn.className = 'filter-pill';
        btn.textContent = year;
        btn.dataset.year = year;
        const active = selectedYears.has(year);
        btn.setAttribute('aria-pressed', String(active));
        if (active) btn.classList.add('active');
        btn.addEventListener('click', () =>
        {
            selectedYears.has(year) ? selectedYears.delete(year) : selectedYears.add(year);
            const on = selectedYears.has(year);
            btn.setAttribute('aria-pressed', String(on));
            btn.classList.toggle('active', on);
            const allPill = container.querySelector('[data-year="all"]');
            if (allPill)
            {
                const noneSelected = selectedYears.size === 0;
                allPill.setAttribute('aria-pressed', String(noneSelected));
                allPill.classList.toggle('active', noneSelected);
            }
            onChange();
        });
        container.appendChild(btn);
    }

    if (focusedYear !== null)
    {
        const target = container.querySelector(`[data-year="${focusedYear}"]`);
        if (target) target.focus();
    }
}

export function buildYearPillsUI(container, getAvailableYears, selectedYears, onChange)
{
    const wrapper = document.createElement('div');
    wrapper.className = 'pill-group';

    const lbl = document.createElement('span');
    lbl.id = 'year-pills-label';
    lbl.className = 'pill-group-label';
    lbl.textContent = 'Years';
    wrapper.appendChild(lbl);

    const bar = document.createElement('div');
    bar.className = 'filter-pills';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-labelledby', 'year-pills-label');

    rebuildYearPills(bar, getAvailableYears, selectedYears, onChange);

    wrapper.appendChild(bar);
    container.appendChild(wrapper);
    return bar;
}

export function buildPresentationGroup(body, buttons)
{
    const group = document.createElement('div');
    group.className = 'pill-group';

    const lbl = document.createElement('span');
    lbl.className = 'pill-group-label';
    lbl.textContent = 'Presentation';
    group.appendChild(lbl);

    const row = document.createElement('div');
    row.className = 'view-button-row';
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', 'Presentation');
    for (const btn of buttons) row.appendChild(btn);
    group.appendChild(row);
    body.appendChild(group);
}

function safeGet(key, fallback) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } }

export function buildCollapsibleControls(defs, container)
{
    const bar = document.createElement('div');
    bar.className = 'ctrl-bar';

    const tabs = document.createElement('div');
    tabs.className = 'ctrl-tabs';

    const panelWrap = document.createElement('div');
    panelWrap.className = 'ctrl-panels';

    for (const def of defs)
    {
        const isOpen = safeGet(def.key, null) !== 'closed';

        const tab = document.createElement('button');
        tab.className = 'ctrl-tab' + (isOpen ? ' open' : '');
        tab.setAttribute('aria-expanded', String(isOpen));
        tab.setAttribute('aria-controls', def.key + '-body');
        const iconWrap = document.createElement('span');
        iconWrap.innerHTML = TAB_ICONS[def.label] ?? '';
        const labelSpan = document.createElement('span');
        labelSpan.className = 'ctrl-tab-label';
        labelSpan.textContent = def.label;
        const chevronWrap = document.createElement('span');
        chevronWrap.innerHTML = CHEVRON;
        if (iconWrap.firstElementChild) tab.appendChild(iconWrap.firstElementChild);
        tab.appendChild(labelSpan);
        if (chevronWrap.firstElementChild) tab.appendChild(chevronWrap.firstElementChild);
        tabs.appendChild(tab);

        const body = document.createElement('div');
        body.className = 'ctrl-panel-body' + (isOpen ? ' open' : '');
        body.id = def.key + '-body';
        def.build(body);
        panelWrap.appendChild(body);

        tab.addEventListener('click', () =>
        {
            const opening = !tab.classList.contains('open');
            tab.classList.toggle('open', opening);
            tab.setAttribute('aria-expanded', String(opening));
            body.classList.toggle('open', opening);
            try { localStorage.setItem(def.key, opening ? 'open' : 'closed'); } catch {}
        });
    }

    bar.appendChild(tabs);
    bar.appendChild(panelWrap);
    container.appendChild(bar);
}
