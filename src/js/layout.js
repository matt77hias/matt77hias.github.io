/**
 * layout.js — inserts shared site chrome (icons, header, nav, profile, footer)
 * and initialises all shared interactive modules.
 *
 * Import once per page. Page-specific scripts (view modules, glitch-text) are
 * loaded separately so each page only pulls what it needs.
 *
 * The active nav link is determined from document.body.id, which must match
 * one of the NAV_ITEMS keys below.
 */

import { initGlitchToggle, isGlitchDisabled } from './effects/glitch-toggle.js';
import { initGlitch } from './effects/glitch.js';

// ── Path helpers ──────────────────────────────────────────────────────────────

const BASE = new URL('../../', import.meta.url).href; // repo root

function rootUrl(path) { return new URL(path, BASE).href; }

// ── Nav items ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
    { id: 'home',         href: 'index.html',        label: 'Home',         icon: 'icon-nav-home',         sw: '2' },
    { id: 'portfolio',    href: 'portfolio.html',     label: 'Portfolio',    icon: 'icon-nav-portfolio',    sw: '2' },
    { id: 'blog',         href: 'blog.html',          label: 'Blog',         icon: 'icon-nav-blog',         sw: '2' },
    { id: 'publications', href: 'publications.html',  label: 'Publications', icon: 'icon-nav-publications', sw: '1.75' },
    { id: 'resume',       href: 'src/external/pdf.js/web/viewer.html?file=%2F../../assets/CV.pdf',
                                                       label: 'Resume',       icon: 'icon-nav-resume',       sw: '2',
      external: true, ariaLabel: 'Resume (opens PDF in new tab)' },
];

// ── Icon sprite ───────────────────────────────────────────────────────────────

async function loadIconSprite()
{
    try
    {
        const r = await fetch(rootUrl('assets/icons.svg'));
        if (!r.ok) throw new Error(r.status);
        const contentType = r.headers.get('content-type') || '';
        if (!contentType.includes('svg') && !contentType.includes('xml'))
            throw new Error(`Unexpected content-type: ${contentType}`);
        const svg = await r.text();
        const tmp = document.createElement('div');
        tmp.innerHTML = svg;
        const el = tmp.firstElementChild;
        if (el && el.tagName.toLowerCase() === 'svg')
        {
            el.setAttribute('aria-hidden', 'true');
            document.body.insertBefore(el, document.body.firstChild);
        }
    }
    catch (e) { console.error('Failed to load icon sprite:', e); }
}

// ── Header ────────────────────────────────────────────────────────────────────

function buildHeader()
{
    const bodyId = document.body.id;
    const wrapH1 = bodyId === 'home'; // glitch-text.js targets header h1 inside .h1-wrapper
    const showGlitch = bodyId !== '404';

    const header = document.createElement('header');

    const h1Wrapper = wrapH1 ? document.createElement('div') : null;
    if (h1Wrapper) h1Wrapper.className = 'h1-wrapper';
    const h1 = document.createElement('h1');
    h1.textContent = 'Matthias Moulin';
    if (h1Wrapper) { h1Wrapper.appendChild(h1); header.appendChild(h1Wrapper); }
    else header.appendChild(h1);

    const btns = document.createElement('div');
    btns.className = 'header-buttons';

    if (showGlitch)
    {
        const glitchBtn = document.createElement('button');
        glitchBtn.id = 'glitch-toggle';
        glitchBtn.setAttribute('aria-label',   'Disable glitch effect');
        glitchBtn.setAttribute('title',        'Disable glitch effect');
        glitchBtn.setAttribute('data-tooltip', 'Disable glitch effect');
        glitchBtn.setAttribute('aria-pressed', 'false');
        glitchBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="#icon-glitch-wave"/></svg>';
        btns.appendChild(glitchBtn);
    }

    const themeBtn = document.createElement('button');
    themeBtn.id = 'theme-toggle';
    themeBtn.setAttribute('aria-label', 'Switch to light mode');
    themeBtn.setAttribute('title', 'Switch to light mode');
    themeBtn.setAttribute('data-tooltip', 'Switch to light mode');
    themeBtn.setAttribute('aria-pressed', 'false');
    themeBtn.innerHTML =
        '<span class="icon-sun"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-theme-sun"/></svg></span>' +
        '<span class="icon-moon"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-theme-moon"/></svg></span>';
    btns.appendChild(themeBtn);

    header.appendChild(btns);
    return header;
}

// ── Nav ───────────────────────────────────────────────────────────────────────

function buildNav()
{
    const bodyId = document.body.id;

    const nav = document.createElement('nav');
    nav.id = 'navigationbar';
    nav.setAttribute('aria-label', 'Site navigation');

    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', 'Toggle navigation');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'nav-links-list');
    toggle.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>';
    nav.appendChild(toggle);

    const list = document.createElement('div');
    list.className = 'nav-links';
    list.id = 'nav-links-list';

    for (const item of NAV_ITEMS)
    {
        const a = document.createElement('a');
        a.className = item.id;
        a.href = rootUrl(item.href);
        if (item.external)
        {
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.setAttribute('aria-label', item.ariaLabel);
        }
        if (item.id === bodyId) a.setAttribute('aria-current', 'page');
        a.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="${item.sw}" stroke-linecap="round" stroke-linejoin="round"><use href="#${item.icon}"/></svg>${item.label}`;
        list.appendChild(a);
    }

    nav.appendChild(list);
    return nav;
}

// ── Profile placeholder ───────────────────────────────────────────────────────

function buildProfile()
{
    const div = document.createElement('div');
    div.className = 'profile';
    return div;
}

// ── Footer ────────────────────────────────────────────────────────────────────

async function initFooter()
{
    let site;
    try
    {
        const r = await fetch(rootUrl('data/site.json'));
        if (!r.ok) throw new Error(r.status);
        site = await r.json();
    }
    catch { return; }

    const year = new Date().getFullYear();

    const avatar = document.querySelector('footer .footer-avatar');
    if (avatar)
    {
        avatar.loading = 'lazy';
        avatar.src = rootUrl(site.avatarPath);
        avatar.alt = site.avatarAlt;
    }

    const copy = document.querySelector('footer .copyright');
    if (copy)
        copy.textContent = `Copyright © ${site.copyrightStart}–${year} ${site.author}. All Rights Reserved.`;
}

// ── Theme toggle ──────────────────────────────────────────────────────────────

function initTheme()
{
    const root = document.documentElement;
    const btn  = document.getElementById('theme-toggle');

    function applyTheme(theme)
    {
        root.dataset.theme = theme;
        if (btn)
        {
            const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
            btn.setAttribute('aria-label', label);
            btn.setAttribute('title', label);
            btn.setAttribute('data-tooltip', label);
            btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        }
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta)
        {
            const accent = getComputedStyle(root).getPropertyValue('--color-accent').trim();
            if (accent) meta.setAttribute('content', accent);
        }
    }

    applyTheme(root.dataset.theme || 'dark');
    btn?.addEventListener('click', () =>
    {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem('theme', next); } catch {}
    });
}

// ── Nav toggle ────────────────────────────────────────────────────────────────

function initNav()
{
    const btn   = document.querySelector('.nav-toggle');
    const links = document.querySelector('#nav-links-list');
    const nav   = document.querySelector('#navigationbar');
    if (!btn || !links) return;

    function close() { links.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    function open()  { links.classList.add('open');    btn.setAttribute('aria-expanded', 'true');  const first = links.querySelector('a'); if (first) first.focus(); }

    btn.addEventListener('click', () => links.classList.contains('open') ? close() : open());
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && links.classList.contains('open')) close(); });
    document.addEventListener('click',   e => { if (links.classList.contains('open') && nav && !nav.contains(e.target)) close(); });
}

// ── Profile view ──────────────────────────────────────────────────────────────

const MAGIC = '__obf__';
const NO_NEW_TAB = ['mailto:', 'skype:', 'tel:', 'sms:'];

async function initProfile()
{
    const container = document.querySelector('.profile');
    if (!container) return;

    let links;
    try
    {
        const r = await fetch(rootUrl('data/profile-links.json'));
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        links = await r.json();
    }
    catch (e) { console.error('Failed to load profile data:', e); return; }

    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Social profiles');
    const ul = document.createElement('ul');
    ul.className = 'social-list';
    nav.appendChild(ul);

    let currentGroup = null;
    for (const link of links)
    {
        if (link.group && link.group !== currentGroup)
        {
            if (currentGroup !== null)
            {
                const divider = document.createElement('li');
                divider.className = 'social-divider';
                divider.setAttribute('aria-hidden', 'true');
                ul.appendChild(divider);
            }
            currentGroup = link.group;
        }

        const li = document.createElement('li');
        const a  = document.createElement('a');
        const cleanUrl = link.url.replaceAll(MAGIC, '');
        if (/^javascript:/i.test(cleanUrl)) continue;
        a.href = cleanUrl;
        a.className = 'social-link';
        a.setAttribute('aria-label', link.label);
        a.setAttribute('data-tooltip', link.label);
        const opensNewTab = !NO_NEW_TAB.some(p => cleanUrl.startsWith(p));
        if (opensNewTab)
        {
            const rel = link.rel ? [link.rel, 'noopener', 'noreferrer'] : ['noopener', 'noreferrer'];
            a.rel = rel.join(' ');
            a.target = '_blank';
        }
        else if (link.rel)
        {
            a.rel = link.rel;
        }

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'social-icon');
        svg.setAttribute('aria-hidden', 'true');
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('href', `#icon-${link.icon}`);
        svg.appendChild(use);
        a.appendChild(svg);

        li.appendChild(a);
        ul.appendChild(li);
    }

    container.appendChild(nav);
}

// ── Profile photo (index page only) ──────────────────────────────────────────

function initProfilePhoto()
{
    const img = document.getElementById('me-thumbnail-large');
    if (!img) return;
    const reveal       = () => { img.style.opacity = '1'; initGlitch(img); };
    const showFallback = () => { img.style.opacity = '1'; };
    if (img.complete && img.naturalWidth) reveal();
    else if (img.complete) showFallback();
    else
    {
        img.addEventListener('load',  reveal,       { once: true });
        img.addEventListener('error', showFallback, { once: true });
    }
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

// Insert chrome synchronously so layout doesn't shift
const skipLink = document.querySelector('.skip-link');
const insertAfter = (node, ref) => ref.parentNode.insertBefore(node, ref.nextSibling);

const header  = buildHeader();
const navEl   = buildNav();
const profile = buildProfile();

insertAfter(header,  skipLink);
insertAfter(navEl,   header);
insertAfter(profile, navEl);

// Async initialisations
loadIconSprite();
initTheme();
initNav();
initGlitchToggle();
initFooter();
initProfilePhoto();
initProfile();
