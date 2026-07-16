import Fuse from '../../external/fuse/fuse.esm.min.js';
import {
    buildPillGroup, buildReadOnlyPillGroup, buildSearchField, buildViewButton,
    buildYearPillsUI, rebuildYearPills, buildPresentationGroup, buildCollapsibleControls,
    SVG_TILE, SVG_CARD, SVG_LIST,
} from './widgets.js';
import { showTiles, showThumbnails, showList, clearBuilt, buildItemPage, buildFlatPage } from './item-view.js';

const SEARCH_KEYS = ['title', 'description', 'authors'];
const FUSE_OPTIONS = { keys: SEARCH_KEYS, threshold: 0.4, ignoreLocation: true };

/**
 * createItemPageController — shared controller for Portfolio, Blog, Publications.
 *
 * config = {
 *   storagePrefix: string,          // e.g. 'portfolio', 'blog', 'publications'
 *   topAnchorId: string,            // e.g. 'portfolio'
 *   getAll: () => Item[],           // all items (flat, unfiltered)
 *   getYears: () => number[],       // sorted years (used in Year grouping)
 *   getOfYear: (y) => Item[],       // items for a given year
 *   searchId: string,               // input element id
 *   searchLabel: string,            // aria-label for the search input
 *   typeFilterOptions: Option[],    // [{value, text, icon}] — pass [] to omit type filter
 *   defaultTypeFilter: string|null, // initial active type value (null = show type filter as read-only)
 *   viewButtons: 'all'|'card-list', // 'all' = tile+card+list, 'card-list' = card+list only
 *   usePlaceholder: bool,           // use no-image.jpg for items without thumbnail
 * }
 *
 * Returns { rebuildItems }
 */
export function createItemPageController(config)
{
    const {
        storagePrefix,
        topAnchorId,
        getAll,
        getYears,
        getOfYear,
        searchId,
        searchLabel,
        typeFilterOptions,
        defaultTypeFilter,
        viewButtons,
        usePlaceholder = false,
    } = config;

    const GROUP_KEY    = storagePrefix + 'Group';
    const PANEL_FILTER = storagePrefix + 'PanelFilter';
    const PANEL_VIEW   = storagePrefix + 'PanelView';

    let _activeFilter  = (() =>
    {
        if (defaultTypeFilter === null) return null;
        let stored; try { stored = localStorage.getItem(storagePrefix + 'Filter'); } catch {}
        const valid = typeFilterOptions.map(o => o.value);
        return (stored && valid.includes(stored)) ? stored : (defaultTypeFilter ?? typeFilterOptions[0]?.value ?? 'All');
    })();
    let stored_group; try { stored_group = localStorage.getItem(GROUP_KEY); } catch {}
    let _activeGroup   = stored_group || 'Year';
    let _searchQuery   = '';
    let _selectedYears = new Set();
    let _yearPillsBar  = null;
    let _fuse          = null;   // Fuse index over _getFilteredAll(); rebuilt when filter changes
    let _fuseFilter    = undefined; // tracks which _activeFilter the index was built for

    function _ensureFuse()
    {
        if (_fuse && _fuseFilter === _activeFilter) return _fuse;
        _fuse = new Fuse(_getFilteredAll(), FUSE_OPTIONS);
        _fuseFilter = _activeFilter;
        return _fuse;
    }

    // Cached Fuse search result for the duration of a single rebuildItems call.
    // Avoids running the same full-set scan multiple times per rebuild.
    let _searchUrls = null;

    function _getSearchUrls()
    {
        if (!_searchQuery) return null;
        if (!_searchUrls) _searchUrls = new Set(_ensureFuse().search(_searchQuery).map(r => r.item.url));
        return _searchUrls;
    }

    function _applySearch(items)
    {
        const urls = _getSearchUrls();
        if (!urls) return items;
        return items.filter(i => urls.has(i.url));
    }

    function _applyFilters(items)
    {
        let result = _applySearch(items);
        if (_selectedYears.size > 0) result = result.filter(i => _selectedYears.has(i.year));
        return result;
    }

    function _getFilteredAll()
    {
        return _activeFilter && _activeFilter !== 'All'
            ? getAll().filter(i => i.type === _activeFilter)
            : getAll();
    }

    function _getAvailableYears()
    {
        return [...new Set(_applySearch(_getFilteredAll()).map(i => i.year))].sort((a, b) => b - a);
    }

    function rebuildItems()
    {
        _searchUrls = null;  // reset per-rebuild cache
        clearBuilt();
        if (_yearPillsBar) rebuildYearPills(_yearPillsBar, _getAvailableYears, _selectedYears, rebuildItems);

        const _typeFilter = _activeFilter && _activeFilter !== 'All';
        if (_activeGroup === 'Year')
        {
            const filteredByYear = new Map(getYears().map(y => [y, _applyFilters(
                _typeFilter ? getOfYear(y).filter(i => i.type === _activeFilter) : getOfYear(y)
            )]));
            buildItemPage(
                () => [...filteredByYear.keys()].filter(y => filteredByYear.get(y).length > 0),
                y => filteredByYear.get(y),
                topAnchorId,
                usePlaceholder,
            );
        }
        else
        {
            buildFlatPage(_applyFilters(_getFilteredAll()), topAnchorId, usePlaceholder);
        }
    }

    function buildControls(container)
    {
        buildCollapsibleControls([
            {
                key: PANEL_FILTER,
                label: 'Filter',
                build(body)
                {
                    if (typeFilterOptions.length > 1)
                    {
                        buildPillGroup(body, 'Type', typeFilterOptions,
                            () => _activeFilter,
                            storagePrefix + 'Filter',
                            v => { _activeFilter = v; _fuse = null; _selectedYears.clear(); rebuildItems(); },
                        );
                    }
                    else if (typeFilterOptions.length === 1)
                    {
                        buildReadOnlyPillGroup(body, 'Type', typeFilterOptions,
                            () => typeFilterOptions[0].value,
                        );
                    }

                    _yearPillsBar = buildYearPillsUI(body, _getAvailableYears, _selectedYears, rebuildItems);

                    buildSearchField(body, searchId, searchLabel, query =>
                    {
                        _searchQuery = query;
                        rebuildItems();
                    });
                },
            },
            {
                key: PANEL_VIEW,
                label: 'View',
                build(body)
                {
                    buildPillGroup(body, 'Grouping',
                        [{ value: 'Year', text: 'By Year' }, { value: 'None', text: 'None' }],
                        () => _activeGroup, GROUP_KEY, v => { _activeGroup = v; rebuildItems(); },
                    );

                    const buttons = [];
                    if (viewButtons === 'all')
                    {
                        const tileBtn = buildViewButton('tile-view-button', 'Tile view', SVG_TILE);
                        tileBtn.addEventListener('click', showTiles);
                        buttons.push(tileBtn);
                    }
                    const cardBtn = buildViewButton('thumbnail-view-button', 'Card view', SVG_CARD);
                    const listBtn = buildViewButton('list-view-button', 'List view', SVG_LIST);
                    cardBtn.addEventListener('click', showThumbnails);
                    listBtn.addEventListener('click', showList);
                    buttons.push(cardBtn, listBtn);
                    buildPresentationGroup(body, buttons);
                },
            },
        ], container);
    }

    return { rebuildItems, buildControls };
}
