import { publicationsReady, getItems, getYears, getOfYear } from '../core/store.js';
import { typeIcon } from '../ui/item-renderer.js';
import { createView } from '../ui/view-factory.js';

createView(publicationsReady, {
    storagePrefix:     'publications',
    topAnchorId:       'publications',
    getAll:            () => getItems('Publication'),
    getYears:          () => getYears('Publication'),
    getOfYear:         y  => getOfYear(y, 'Publication'),
    searchId:          'publications-search',
    searchLabel:       'Search publications',
    typeFilterOptions: [{ value: 'Publication', text: 'Publications', icon: typeIcon('Publication') }],
    defaultTypeFilter: null,
    viewButtons:       'all',
    usePlaceholder:    false,
});
