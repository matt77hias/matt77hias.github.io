import { postsReady, getItems, getYears, getOfYear } from '../core/store.js';
import { typeIcon } from '../ui/item-renderer.js';
import { createView } from '../ui/view-factory.js';

createView(postsReady, {
    storagePrefix:     'blog',
    topAnchorId:       'blog',
    getAll:            () => getItems('Post'),
    getYears:          () => getYears('Post'),
    getOfYear:         y  => getOfYear(y, 'Post'),
    searchId:          'blog-search',
    searchLabel:       'Search blog',
    typeFilterOptions: [{ value: 'Post', text: 'Posts', icon: typeIcon('Post') }],
    defaultTypeFilter: null,
    viewButtons:       'all',
    usePlaceholder:    true,
});
