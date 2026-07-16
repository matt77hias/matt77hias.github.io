import { isGlitchDisabled } from './glitch-toggle.js';

const rand    = (a, b) => Math.random() * (b - a) + a;
const randInt = (a, b) => Math.floor(rand(a, b + 1));
const pick    = (...a) => a[randInt(0, a.length - 1)];
const clamp   = (v, a, b) => Math.max(a, Math.min(b, v));

const CP = {
    cyan:    [0,   255, 220],
    magenta: [255, 0,   80 ],
    yellow:  [255, 220, 0  ],
    purple:  [180, 0,   255],
    red:     [255, 20,  20 ],
    white:   [255, 255, 255],
};

const WEIGHTS = [0.35, 0.28, 0.20, 0.11, 0.06];

export function initGlitch(img)
{
    if (!img) return;

    const canvas  = document.createElement('canvas');
    const ctx     = canvas.getContext('2d');
    let   prevFrame = null;
    let   _pendingTimer = null;
    let   _started = false;
    const echoCanvas = document.createElement('canvas');
    const echoCtx    = echoCanvas.getContext('2d');

    function sync()
    {
        canvas.width  = img.naturalWidth  || 450;
        canvas.height = img.naturalHeight || 675;
        canvas.style.width  = '';
        canvas.style.height = '';
        canvas.className = 'glitch-canvas';
        canvas.style.opacity = '1';
    }

    function drawClean()
    {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    function saveFrame()
    {
        prevFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    // ── Effect primitives ──────────────────────────────────────

    function rgbSplit(amount)
    {
        const w = canvas.width, h = canvas.height;
        const orig = ctx.getImageData(0, 0, w, h);
        const src  = new Uint8ClampedArray(orig.data);
        const dst  = orig.data;
        for (let y = 0; y < h; y++)
        {
            const s = amount + Math.sin(y * 0.25) * amount * 0.5;
            for (let x = 0; x < w; x++)
            {
                const i  = (y * w + x) * 4;
                const rx = clamp(x + Math.round(s), 0, w - 1);
                const bx = clamp(x - Math.round(s), 0, w - 1);
                dst[i]     = src[(y * w + rx) * 4];
                dst[i + 1] = src[i + 1];
                dst[i + 2] = src[(y * w + bx) * 4 + 2];
                dst[i + 3] = 255;
            }
        }
        ctx.putImageData(orig, 0, 0);
    }

    function sliceDisplace(num, maxDx)
    {
        const w = canvas.width, h = canvas.height;
        for (let s = 0; s < num; s++)
        {
            const sy   = randInt(0, h - 2);
            const sh   = randInt(1, Math.max(1, Math.floor(h * 0.2)));
            const safe = Math.min(sh, h - sy);
            if (safe < 1) continue;
            const slice = ctx.getImageData(0, sy, w, safe);
            ctx.putImageData(slice, rand(-maxDx, maxDx), sy);
        }
    }

    function ghostEcho(alpha)
    {
        if (!prevFrame) return;
        echoCanvas.width = canvas.width; echoCanvas.height = canvas.height;
        echoCtx.putImageData(prevFrame, 0, 0);
        ctx.globalAlpha = alpha;
        ctx.drawImage(echoCanvas, rand(-8, 8), rand(-4, 4));
        ctx.globalAlpha = 1;
    }

    function colorBar()
    {
        const w = canvas.width, h = canvas.height;
        const y  = randInt(0, h - 1);
        const bh = randInt(1, Math.floor(h * 0.07));
        const [r,g,b] = pick(CP.cyan, CP.magenta, CP.yellow, CP.purple, CP.white);
        ctx.fillStyle = `rgba(${r},${g},${b},${rand(0.45, 0.8)})`;
        ctx.fillRect(0, y, w, bh);
    }

    function memoryDump(num)
    {
        const w = canvas.width, h = canvas.height;
        for (let b = 0; b < num; b++)
        {
            const bw = randInt(20, Math.floor(w * 0.75));
            const bh = randInt(1, 12);
            const bx = randInt(0, w - bw);
            const by = randInt(0, h - bh);
            const [cr, cg, cb] = pick(CP.cyan, CP.magenta, CP.yellow, CP.white, CP.red);
            const noise = ctx.createImageData(bw, bh);
            const d = noise.data;
            for (let i = 0; i < d.length; i += 4)
            {
                if (Math.random() < 0.6)
                {
                    d[i] = cr; d[i+1] = cg; d[i+2] = cb;
                }
                else
                {
                    const v = randInt(0, 255);
                    d[i] = v; d[i+1] = v; d[i+2] = v;
                }
                d[i+3] = randInt(190, 255);
            }
            ctx.putImageData(noise, bx, by);
        }
    }

    function corruptBlock()
    {
        const w = canvas.width, h = canvas.height;
        const bw = randInt(8, Math.floor(w * 0.4));
        const bh = randInt(4, Math.floor(h * 0.12));
        const [r,g,b] = pick(CP.cyan, CP.magenta, CP.yellow, CP.purple);
        ctx.fillStyle = `rgba(${r},${g},${b},${rand(0.6, 1.0)})`;
        ctx.fillRect(randInt(0, w - bw), randInt(0, h - bh), bw, bh);
    }

    function invertStrip()
    {
        const w = canvas.width, h = canvas.height;
        const y = randInt(0, h - 1);
        const sh = Math.min(randInt(1, Math.floor(h * 0.05)), h - y);
        if (sh < 1) return;
        const data = ctx.getImageData(0, y, w, sh);
        const d = data.data;
        for (let i = 0; i < d.length; i += 4)
        {
            d[i] = 255 - d[i]; d[i+1] = 255 - d[i+1]; d[i+2] = 255 - d[i+2];
        }
        ctx.putImageData(data, 0, y);
    }

    function channelIsolate()
    {
        const w = canvas.width, h = canvas.height;
        const data = ctx.getImageData(0, 0, w, h);
        const d = data.data;
        const ch = pick(0, 2);
        for (let i = 0; i < d.length; i += 4)
        {
            const v = d[i + ch];
            d[i] = ch === 0 ? v : v >> 2;
            d[i+1] = v >> 2;
            d[i+2] = ch === 2 ? v : v >> 2;
        }
        ctx.putImageData(data, 0, 0);
    }

    function whiteFlash(alpha)
    {
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function screenTear()
    {
        const w = canvas.width, h = canvas.height;
        const cy = randInt(Math.floor(h * 0.15), Math.floor(h * 0.85));
        const top = ctx.getImageData(0, 0, w, cy);
        ctx.putImageData(top, rand(-w * 0.08, w * 0.08), 0);
    }

    function vSync()
    {
        const w = canvas.width, h = canvas.height;
        const dy = randInt(2, Math.floor(h * 0.12));
        const full = ctx.getImageData(0, 0, w, h);
        ctx.clearRect(0, 0, w, h);
        ctx.putImageData(full, 0, dy);
        const gap = ctx.createImageData(w, dy);
        const [cr,cg,cb] = pick(CP.cyan, CP.magenta, CP.yellow);
        for (let i = 0; i < gap.data.length; i += 4)
        {
            gap.data[i] = cr; gap.data[i+1] = cg; gap.data[i+2] = cb;
            gap.data[i+3] = randInt(120, 200);
        }
        ctx.putImageData(gap, 0, 0);
    }

    function scanlines()
    {
        const w = canvas.width, h = canvas.height;
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
    }

    function pixelate(blockSize)
    {
        const w = canvas.width, h = canvas.height;
        const rx = randInt(0, w - 20);
        const ry = randInt(0, h - 20);
        const rw = randInt(20, Math.floor(w * 0.5));
        const rh = randInt(20, Math.floor(h * 0.4));
        const data = ctx.getImageData(rx, ry, rw, rh);
        const d = data.data;
        for (let y = 0; y < rh; y += blockSize)
        {
            for (let x = 0; x < rw; x += blockSize)
            {
                const i = (y * rw + x) * 4;
                const r = d[i], g = d[i+1], b = d[i+2];
                for (let dy = 0; dy < blockSize && y+dy < rh; dy++)
                {
                    for (let dx = 0; dx < blockSize && x+dx < rw; dx++)
                    {
                        const j = ((y+dy) * rw + (x+dx)) * 4;
                        d[j] = r; d[j+1] = g; d[j+2] = b;
                    }
                }
            }
        }
        ctx.putImageData(data, rx, ry);
    }

    function interlace()
    {
        const w = canvas.width, h = canvas.height;
        const dx = rand(-12, 12);
        for (let y = 0; y < h; y += 2)
        {
            const row = ctx.getImageData(0, y, w, 1);
            ctx.putImageData(row, dx, y);
        }
    }

    function dataCorruptText()
    {
        const w = canvas.width, h = canvas.height;
        const [r,g,b] = pick(CP.cyan, CP.yellow, CP.magenta);
        ctx.font = `${randInt(7, 11)}px monospace`;
        ctx.fillStyle = `rgba(${r},${g},${b},${rand(0.5, 0.9)})`;
        const num = randInt(1, 4);
        for (let i = 0; i < num; i++)
        {
            const hex = (Math.random() * 0xFFFFFFFF >>> 0).toString(16).toUpperCase().padStart(8, '0');
            ctx.fillText(`0x${hex}`, randInt(0, w - 80), randInt(10, h - 4));
        }
    }

    // ── Glitch levels ──────────────────────────────────────────

    const LEVELS = [
        {
            idle: [300, 900],
            fn()
            {
                drawClean();
                rgbSplit(rand(3, 8));
                sliceDisplace(randInt(1, 4), canvas.width * 0.04);
                memoryDump(randInt(1, 2));
                scanlines();
            },
        },

        {
            idle: [600, 2000],
            fn()
            {
                drawClean();
                rgbSplit(rand(8, 18));
                sliceDisplace(randInt(3, 8), canvas.width * 0.10);
                colorBar();
                memoryDump(randInt(2, 5));
                if (Math.random() < 0.4) invertStrip();
                scanlines();
            },
        },

        {
            idle: [1500, 4000],
            fn()
            {
                saveFrame();
                drawClean();
                rgbSplit(rand(16, 30));
                sliceDisplace(randInt(6, 14), canvas.width * 0.25);
                if (Math.random() < 0.5) ghostEcho(rand(0.25, 0.5));
                colorBar(); colorBar();
                memoryDump(randInt(5, 10));
                corruptBlock();
                invertStrip(); invertStrip();
                if (Math.random() < 0.4) pixelate(randInt(6, 12));
                dataCorruptText();
                scanlines();
            },
        },

        {
            idle: [3000, 7000],
            fn()
            {
                saveFrame();
                drawClean();
                rgbSplit(rand(28, 48));
                screenTear();
                sliceDisplace(randInt(12, 22), canvas.width * 0.45);
                ghostEcho(rand(0.3, 0.6));
                for (let i = 0; i < 4; i++) colorBar();
                memoryDump(randInt(10, 18));
                for (let i = 0; i < 3; i++) corruptBlock();
                for (let i = 0; i < 4; i++) invertStrip();
                interlace();
                pixelate(randInt(8, 16));
                dataCorruptText(); dataCorruptText();
                if (Math.random() < 0.5) channelIsolate();
                scanlines();
            },
        },

        {
            idle: [6000, 14000],
            fn()
            {
                saveFrame();
                drawClean();
                whiteFlash(rand(0.3, 0.7));
                rgbSplit(rand(40, 65));
                vSync();
                screenTear();
                sliceDisplace(randInt(18, 30), canvas.width * 0.65);
                ghostEcho(rand(0.4, 0.7));
                for (let i = 0; i < 6; i++) colorBar();
                memoryDump(randInt(18, 28));
                for (let i = 0; i < 5; i++) corruptBlock();
                for (let i = 0; i < 6; i++) invertStrip();
                interlace();
                pixelate(randInt(12, 22));
                channelIsolate();
                for (let i = 0; i < 4; i++) dataCorruptText();
                scanlines();
            },
        },
    ];

    function pickLevel()
    {
        const r = Math.random();
        let c = 0;
        for (let i = 0; i < WEIGHTS.length; i++)
        {
            c += WEIGHTS[i];
            if (r < c) return i;
        }
        return 0;
    }

    function schedule(ms, fn)
    {
        _pendingTimer = setTimeout(fn, ms);
    }

    function runBurst(lvl)
    {
        const def    = LEVELS[lvl];
        const frames = randInt(3, 9);
        let f = 0;

        function nextFrame()
        {
            def.fn();
            f++;
            if (f < frames)
            {
                schedule(rand(25, 65), nextFrame);
            }
            else
            {
                schedule(40, () =>
                {
                    drawClean();
                    scheduleGlitch();
                });
            }
        }
        nextFrame();
    }

    function scheduleGlitch()
    {
        const lvl  = pickLevel();
        const def  = LEVELS[lvl];
        const idle = rand(def.idle[0], def.idle[1]);
        schedule(idle, () => runBurst(lvl));
    }

    function cancelPending()
    {
        if (_pendingTimer !== null)
        {
            clearTimeout(_pendingTimer);
            _pendingTimer = null;
        }
    }

    function start()
    {
        if (_started) return;
        if (!img.parentNode) return;
        _started = true;

        sync();
        drawClean();
        scanlines();
        img.parentNode.insertBefore(canvas, img.nextSibling);

        const disabled = isGlitchDisabled();
        canvas.style.display = disabled ? 'none' : '';
        img.style.display    = disabled ? '' : 'none';

        document.addEventListener('glitch-state-changed', e =>
        {
            if (e.detail.disabled)
            {
                cancelPending();
                drawClean();
                canvas.style.display = 'none';
                img.style.display    = '';
            }
            else
            {
                canvas.style.display = '';
                img.style.display    = 'none';
                if (!document.hidden) { cancelPending(); drawClean(); scheduleGlitch(); }
            }
        });

        document.addEventListener('visibilitychange', () =>
        {
            if (document.hidden)
            {
                cancelPending();
            }
            else if (!isGlitchDisabled())
            {
                cancelPending();
                drawClean();
                scheduleGlitch();
            }
        });

        if (!disabled) scheduleGlitch();
    }

    if (img.complete && img.naturalWidth)
    {
        start();
    }
    else
    {
        img.addEventListener('load', start, { once: true });
    }
}
