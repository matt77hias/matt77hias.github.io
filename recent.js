function constructRecent() {
    var h, g, d, f, m, e, b, a, l, c, k;
    m = document.getElementById("recent");
    b = getRecentItems(6);
    for (h = 0; h < b.length; h += 1) {
        d = b[h];
        a = document.createElement("div");
        a.className = "recent-container";
        e = document.createElement("p");
        e.innerHTML = '<h3 class="recent-title"><a href="' + d.projectpage + '">' + d.title + "</a></h3>";
        a.appendChild(e);
        k = document.createElement("h4");
        k.className = "recent-authors";
        a.appendChild(k);
        for (g = 0; g < d.authors.length; g += 1) {
            f = getAuthor(d.authors[g]);
            if (f.personalPageLink)         { k.innerHTML += '<a href="' + f.personalPageLink + '">' + f.fullName + "</a>" }
            else                            { k.innerHTML += f.fullName }
            if (g === d.authors.length - 1) { k.innerHTML += "."        }
            else                            { k.innerHTML += ", "       }
        }
        a.appendChild(k);
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