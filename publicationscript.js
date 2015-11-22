function addLinkIconToRow(d, b) {
    var a, f, g, e, h, c;
    f = document.createElement("a");
    f.href = b.link;
    a = document.createElement("div");
    a.className = "download";
    g = document.createElement("img");
    g.className = "download-icon";
    g.src = b.icon; a.appendChild(g);
    e = document.createElement("a");
    e.href = b.link;
    e.innerHTML = b.description;
    e.className = "download-description";
    f.appendChild(g);
    f.appendChild(e);
    a.appendChild(f);
    d.appendChild(a)
}

function makePaperThumbnailOpacityHandler(b, c, a) {
    return function () {
        c.style.opacity = 1;
        c.src = b.src;
        a.style.opacity = 1;
        a.src = b.src
    }
}

function constructPaperTableForYearLargeThumbnail(m, n) {
    var t, r, l, e, v, y, g, c, f, w, k, b, u, o, q, a, d, s, x, h, p;
    v = document.getElementById("publication-list");
    y = document.createElement("article");
    y.id = "papers-" + n;
    g = document.createElement("h1");
    g.id = "papers-" + n;
    g.innerHTML = n + '<a class = "to-top-link" href = "#publications">back to the top</a>';
    y.appendChild(g);
    for (t = 0; t < m.length; t += 1) {
        l = m[t];
        c = document.createElement("article");
        c.className = "paper-thumbnailview container";
        if (l.thumbnail) {
            f = document.createElement("aside");
            f.className = "container-item";
            k = document.createElement("a");
            k.href = l.projectpage;
            w = document.createElement("img");
            w.className = "paper-thumbnail large-thumbnail bordered";
            k.appendChild(w);
            f.appendChild(k);
            c.appendChild(f)
        }
        b = document.createElement("section");
        b.className = "container-item";
        if (l.thumbnail) {
            o = document.createElement("a");
            o.href = l.projectpage;
            u = document.createElement("img");
            u.className = "paper-inline-thumbnail inline-thumbnail bordered";
            o.appendChild(u);
            b.appendChild(o)
        }
        if (l.thumbnail) {
            q = new Image();
            q.onload = q.onerror = makePaperThumbnailOpacityHandler(q, w, u);
            q.src = l.thumbnail
        }
        d = document.createElement("a");
        d.className = "paper-title-link";
        d.href = l.projectpage;
        a = document.createElement("h3");
        a.innerHTML = l.title;
        a.className = "paper-title";
        d.appendChild(a);
        b.appendChild(d);
        s = document.createElement("h4");
        s.className = "paper-authors";
        b.appendChild(s);
        for (r = 0; r < l.authors.length; r += 1) {
            e = getAuthor(l.authors[r]);
            if (e.personalPageLink)         { s.innerHTML += '<a href="' + e.personalPageLink + '">' + e.fullName + "</a>" }
            else                            { s.innerHTML += e.fullName }
            if (r === l.authors.length - 1) { s.innerHTML += "."        }
            else                            { s.innerHTML += ", "       }
        }
        x = document.createElement("p");
        x.innerHTML = l.citation;
        x.className = "paper-journal";
        b.appendChild(x);
        p = document.createElement("div");
        p.className = "paper-links-table";
        addLinkIconToRow(p, new Download("Project page", l.projectpage, "res/Icon/icon_html.png"));
        for (r = 0; r < l.downloads.length; r += 1) { addLinkIconToRow(p, l.downloads[r]) }
        b.appendChild(p);
        c.appendChild(b); y.appendChild(c)
    }
    v.appendChild(y)
}

function constructPaperTableForYearSmallDetails(a, h) {
    var f, e, l, c, g, k, b, d;
    l = document.getElementById("publication-list");
    g = document.getElementById("papers-" + h);
    k = document.createElement("ul");
    k.className = "paper-listview";
    for (f = 0; f < a.length; f += 1) {
        b = a[f];
        c = document.createElement("li");
        c.innerHTML += '<a href="' + b.projectpage + '"><h3 class="paper-title-details">' + b.title + "</h3></a>";
        for (e = 0; e < b.authors.length; e += 1) {
            d = getAuthor(b.authors[e]);
            if (d.personalPageLink)         { c.innerHTML += '<a href="' + d.personalPageLink + '" class="paper-authors-details">' + d.fullName + "</a>" }
            else                            { c.innerHTML += d.fullName }
            if (e === b.authors.length - 1) { c.innerHTML += ".</br>"   }
            else                            { c.innerHTML += ", "       }
        }
        c.innerHTML += '<span class="paper-journal-details">' + b.citation + "</span>"; 
		k.appendChild(c)
    }
    g.appendChild(k);
    l.appendChild(g)
}

function constructPaperTableSmallDetails() {
    var c, b, a;
    b = getPaperYears();
    b.sort();
    for (c = b.length - 1; c >= 0; c -= 1) {
        constructPaperTableForYearSmallDetails(getPapersByYear(b[c]), b[c])
    }
}

function constructPaperTableLargeThumbnail() {
    var c, b, a;
    b = getPaperYears();
    b.sort();
    for (c = b.length - 1; c >= 0; c -= 1) {
        constructPaperTableForYearLargeThumbnail(getPapersByYear(b[c]), b[c])
    }
}

function constructPaperYearLinks() {
    var c, a, b;
    b = getPaperYears();
    b.sort();
    a = document.getElementById("paper-year-links");
    for (c = b.length - 1; c >= 0; c -= 1) {
        a.innerHTML += '<a href = "#papers-' + b[c] + '">' + b[c] + "</a>";
        if (c > 0) { a.innerHTML += ", " }
        else       { a.innerHTML += "."  }
    }
}

function thumbnailView() {
    var a, b;
    b = document.getElementsByClassName("paper-thumbnailview");
    for (a = 0; a < b.length; a += 1) {
        b[a].style.display = "block"
    }
    b = document.getElementsByClassName("paper-listview");
    for (a = 0; a < b.length; a += 1) {
        b[a].style.display = "none"
    }
    document.getElementById("thumbnail-view-button").style.opacity = 0.8;
    document.getElementById("list-view-button").style.opacity      = ""
}

function listView() {
    var a, b;
    b = document.getElementsByClassName("paper-thumbnailview");
    for (a = 0; a < b.length; a += 1) {
        b[a].style.display = "none"
    }
    b = document.getElementsByClassName("paper-listview");
    for (a = 0; a < b.length; a += 1) {
        b[a].style.display = "block"
    }
    document.getElementById("thumbnail-view-button").style.opacity = "";
    document.getElementById("list-view-button").style.opacity      = 0.8
}

constructPaperTableLargeThumbnail();
constructPaperTableSmallDetails();
constructPaperYearLinks();
thumbnailView();