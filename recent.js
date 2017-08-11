function constructRecent() {
    var h, g, d, f, m, e, b, a, l, c, k;
    m = document.getElementById("recent");
    b = getRecentItems(6);
    for (h = 0; h < b.length; h += 1) {
        d = b[h];
        a = document.createElement("div");
        a.className = "recent-container";
        c = document.createElement("a");
        c.href = d.projectpage;
        l = document.createElement("img");
        l.className = "recent-thumbnail";
        l.src = d.thumbnail;
        c.appendChild(l);
        a.appendChild(c);
        m.appendChild(a)
    }
    console.log(b)
}
constructRecent();