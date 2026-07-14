// Pre-load config: set before MathJax library script runs.
// MathJax 2 reads window.MathJax on startup if present.
window.MathJax = {
    TeX: {
        equationNumbers: { autoNumber: 'AMS' },
        extensions: ['AMScd.js']
    },
    tex2jax: {
        inlineMath:  [['$', '$']],
        displayMath: [['$$', '$$']],
        processEscapes: true
    }
};