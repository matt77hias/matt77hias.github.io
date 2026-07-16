(function ()
{
    var t; try { t = localStorage.getItem('theme'); } catch(e) {} t = t || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.dataset.theme = t;
}());
