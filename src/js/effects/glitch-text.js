import { isGlitchDisabled } from './glitch-toggle.js';

function init()
{
    const h1 = document.querySelector('header h1');
    if (!h1) return;

// ── Slice pool ────────────────────────────────────────────────
// Each clone covers the full h1 box but is clipped + shifted per frame.
// Two extra clones per slice for red/cyan chromatic aberration ghosts.
// Created lazily on first enable to avoid 60 DOM nodes when glitch is off.
const NUM_SLICES = 20;
const mainSlices = [];
const redSlices  = [];
const cyanSlices = [];
let _slicesReady = false;

function makeClone(extraClass)
{
    const el = document.createElement('h1');
    el.className = 'h1-slice' + (extraClass ? ' ' + extraClass : '');
    el.textContent = h1.textContent;
    el.setAttribute('aria-hidden', 'true');
    el.style.display = 'none';
    h1.parentNode.appendChild(el);
    return el;
}

function ensureSlices()
{
    if (_slicesReady) return;
    _slicesReady = true;
    for (let i = 0; i < NUM_SLICES; i++)
    {
        mainSlices.push(makeClone(''));
        redSlices.push(makeClone('h1-slice--red'));
        cyanSlices.push(makeClone('h1-slice--cyan'));
    }
}

// ── Frame state ───────────────────────────────────────────────
// A "frame state" is an array of slice descriptors so we can hold frames.
function buildFrameState(totalH)
{
    // Decide burst intensity: calm (0) or violent (1)
    const violent = Math.random() < 0.35;

    const n = violent
        ? 12 + Math.floor(Math.random() * 9)   // 12-20 slices
        :  6 + Math.floor(Math.random() * 7);  //  6-12 slices

    // Build non-uniform slice boundaries — thin slices dominate,
    // occasional thick "torn" slices for CP2077 feel
    const bounds = [0];
    for (let i = 1; i < n; i++)
    {
        const prev = bounds[bounds.length - 1];
        const remaining = totalH - prev;
        const slicesLeft = n - i;
        // Each slice gets a random share; skew towards thin slices
        const share = Math.random() * Math.random(); // squared = biased small
        const h = Math.max(2, Math.round(share * remaining * 1.8));
        bounds.push(Math.min(prev + h, totalH - slicesLeft));
    }
    bounds.push(totalH);

    const maxShift = violent ? 140 : 55;

    return bounds.slice(0, -1).map((top, i) =>
    {
        const bottom  = bounds[i + 1];
        const shifted = Math.random() < (violent ? 0.65 : 0.45);
        // Bias towards one side occasionally (like a hard corruption block)
        const bias    = Math.random() < 0.2 ? (Math.random() < 0.5 ? 1 : -1) : 0;
        const dx      = shifted
            ? Math.round((Math.random() - 0.5 + bias * 0.4) * maxShift * 2)
            : 0;
        const bigShift = Math.abs(dx) > 50;
        return { top, bottom, dx, bigShift };
    });
}

// ── Apply a frame state to the DOM ────────────────────────────
function applyFrameState(state, totalH)
{
    h1.style.visibility = 'hidden';

    const n = state.length;
    for (let i = 0; i < NUM_SLICES; i++)
    {
        if (i >= n)
        {
            mainSlices[i].style.display = 'none';
            redSlices[i].style.display  = 'none';
            cyanSlices[i].style.display = 'none';
            continue;
        }

        const { top, bottom, dx, bigShift } = state[i];
        const clipTop    = top;
        const clipBottom = totalH - bottom;
        const clip       = `inset(${clipTop}px 0px ${clipBottom}px 0px)`;

        // Main slice
        const m = mainSlices[i];
        m.style.display   = 'block';
        m.style.clipPath  = clip;
        m.style.transform = dx ? `translateX(${dx}px)` : 'none';

        // Chromatic aberration ghosts — only on big shifts
        if (bigShift)
        {
            const r = redSlices[i];
            r.style.display   = 'block';
            r.style.clipPath  = clip;
            r.style.transform = `translateX(${dx - 5}px)`;

            const c = cyanSlices[i];
            c.style.display   = 'block';
            c.style.clipPath  = clip;
            c.style.transform = `translateX(${dx + 7}px)`;
        }
        else
        {
            redSlices[i].style.display  = 'none';
            cyanSlices[i].style.display = 'none';
        }
    }
}

function clearFrame()
{
    if (!_slicesReady) return;
    h1.style.visibility = '';
    for (let i = 0; i < NUM_SLICES; i++)
    {
        mainSlices[i].style.display = 'none';
        redSlices[i].style.display  = 'none';
        cyanSlices[i].style.display = 'none';
    }
}

// ── Burst scheduler ───────────────────────────────────────────
let timer    = null;
let _stopped = false;

function burst()
{
    if (_stopped || isGlitchDisabled()) { clearFrame(); return; }
    ensureSlices();

    const totalH = h1.offsetHeight;
    // 4-10 ticks per burst; each tick may hold for 1-3 frames
    const ticks  = 4 + Math.floor(Math.random() * 7);
    let t = 0;

    function nextTick()
    {
        if (_stopped) { clearFrame(); return; }
        if (t >= ticks)
        {
            clearFrame();
            scheduleBurst();
            return;
        }

        const state    = buildFrameState(totalH);
        const holdFor  = Math.random() < 0.3 ? 2 + Math.floor(Math.random() * 2) : 1;
        const interval = 35 + Math.random() * 65;

        applyFrameState(state, totalH);
        t++;

        // Hold same state for extra ticks if holdFor > 1
        let held = 1;
        function holdStep()
        {
            if (_stopped) { clearFrame(); return; }
            if (held >= holdFor || t >= ticks)
            {
                timer = setTimeout(nextTick, interval);
                return;
            }
            held++;
            t++;
            timer = setTimeout(holdStep, interval);
        }
        timer = setTimeout(holdStep, interval);
    }

    nextTick();
}

function scheduleBurst()
{
    if (_stopped) return;
    // CP2077 cadence: quick double-glitch sometimes, long quiet stretches otherwise
    const roll = Math.random();
    const idle = roll < 0.15
        ? 200  + Math.random() * 400    // rapid follow-up
        : roll < 0.5
        ? 1000 + Math.random() * 1500   // moderate
        : 2500 + Math.random() * 3500;  // long quiet stretch
    timer = setTimeout(burst, idle);
}

function stop()
{
    _stopped = true;
    clearTimeout(timer);
    timer = null;
    clearFrame();
}

function resume()
{
    _stopped = false;
}

document.addEventListener('glitch-state-changed', ({ detail }) =>
{
    if (detail.disabled) stop();
    else if (!document.hidden) { stop(); ensureSlices(); resume(); scheduleBurst(); }
});

document.addEventListener('visibilitychange', () =>
{
    if (document.hidden) stop();
    else if (!isGlitchDisabled()) { stop(); ensureSlices(); resume(); scheduleBurst(); }
});

if (!isGlitchDisabled() && !document.hidden) scheduleBurst();
}

init();
