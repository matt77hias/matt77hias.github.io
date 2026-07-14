const GLITCH_KEY = 'glitchDisabled';

export function isGlitchDisabled()
{
    try { return localStorage.getItem(GLITCH_KEY) === '1'; } catch { return false; }
}

function applyGlitchState(btn, disabled)
{
    document.body.classList.toggle('glitch-disabled', disabled);

    if (!btn) return;
    const label = disabled ? 'Enable glitch effect' : 'Disable glitch effect';
    btn.setAttribute('aria-pressed', String(disabled));
    btn.setAttribute('aria-label',   label);
    btn.setAttribute('title',        label);
    btn.setAttribute('data-tooltip', label);
    btn.classList.toggle('active', disabled);
}

export function initGlitchToggle()
{
    const btn = document.getElementById('glitch-toggle');

    if (!btn) return;

    applyGlitchState(btn, isGlitchDisabled());

    btn.addEventListener('click', () =>
    {
        const disabled = !isGlitchDisabled();
        try {
            if (disabled) localStorage.setItem(GLITCH_KEY, '1');
            else          localStorage.removeItem(GLITCH_KEY);
        } catch { /* ignore storage errors (e.g. Safari private browsing) */ }
        applyGlitchState(btn, disabled);
        document.dispatchEvent(new CustomEvent('glitch-state-changed', { detail: { disabled } }));
    });
}

