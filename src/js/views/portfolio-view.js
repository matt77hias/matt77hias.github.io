import { allReady, getItems, getYears, getOfYear } from '../core/store.js';
import { typeIcon } from '../ui/item-renderer.js';
import { createView } from '../ui/view-factory.js';

createView(allReady, {
    storagePrefix:     'portfolio',
    topAnchorId:       'portfolio',
    getAll:            () => getItems(null),
    getYears:          () => getYears(null),
    getOfYear:         y  => getOfYear(y, null),
    searchId:          'portfolio-search',
    searchLabel:       'Search portfolio',
    typeFilterOptions: [
        { value: 'All',         text: 'All',          icon: '' },
        { value: 'Project',     text: 'Projects',     icon: typeIcon('Project') },
        { value: 'Publication', text: 'Publications', icon: typeIcon('Publication') },
    ],
    defaultTypeFilter: 'All',
    viewButtons:       'all',
    usePlaceholder:    false,
});
