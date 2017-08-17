function AppendDownload(acc, download) {
    // Create the division/section for the download.
    var div          = document.createElement("div");
    div.className    = "download";

    // Create the download image hyperref.
    var a_img        = document.createElement("a");
    a_img.href       = download.link;

    // Create the download image.
    var img          = document.createElement("img");
    img.className    = "download-icon";
    img.src          = download.icon;

     // Create the download text hyperref.
    var a_txt        = document.createElement("a");
    a_txt.className  = "download-description";
    a_txt.href       = download.link;
    a_txt.innerHTML  = download.description;

    a_img.appendChild(img);
    div.appendChild(a_img);
    div.appendChild(a_txt);
    acc.appendChild(div);
}

function makePublicationThumbnailOpacityHandler(b, c, a) {
    return function () {
        c.style.opacity = 1;
        c.src = b.src;
        a.style.opacity = 1;
        a.src = b.src
    }
}

function constructPublicationTableForYearLargeThumbnail(m, n) {
    var t, r, l, e, v, y, g, c, f, w, k, b, u, o, q, a, d, s, x, h, p;
    v = document.getElementById("item-list");
    y = document.createElement("article");
    y.id = "items-" + n;
    g = document.createElement("h1");
    g.id = "items-" + n;
    g.innerHTML = n + '<a class = "to-top-link" href = "#publications">back to the top</a>';
    y.appendChild(g);
    for (t = 0; t < m.length; t += 1) {
        l = m[t];
        c = document.createElement("article");
        c.className = "item-thumbnailview container";
        if (l.thumbnail) {
            f = document.createElement("aside");
            f.className = "container-item";
            k = document.createElement("a");
            k.href = l.projectpage;
            w = document.createElement("img");
            w.className = "item-thumbnail large-thumbnail bordered";
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
            u.className = "item-inline-thumbnail inline-thumbnail bordered";
            o.appendChild(u);
            b.appendChild(o)
        }
        if (l.thumbnail) {
            q = new Image();
            q.onload = q.onerror = makePublicationThumbnailOpacityHandler(q, w, u);
            q.src = l.thumbnail
        }
        d = document.createElement("a");
        d.className = "item-title-link";
        d.href = l.projectpage;
        a = document.createElement("h3");
        a.innerHTML = l.title;
        a.className = "item-title";
        d.appendChild(a);
        b.appendChild(d);
        s = document.createElement("h4");
        s.className = "item-authors";
        b.appendChild(s);
        for (r = 0; r < l.authors.length; r += 1) {
            e = GetAuthor(l.authors[r]);
            if (e.url)         { s.innerHTML += '<a href="' + e.url + '">' + e.name + "</a>" }
            else                            { s.innerHTML += e.name }
            if (r === l.authors.length - 1) { s.innerHTML += "."        }
            else                            { s.innerHTML += ", "       }
        }
        x = document.createElement("p");
        x.innerHTML = l.citation;
        x.className = "item-details";
        b.appendChild(x);
        p = document.createElement("div");
        p.className = "item-links-table";
        AppendDownload(p, new Download("Publication page", l.projectpage, "res/Icons/icon_html.png"));
        for (r = 0; r < l.downloads.length; r += 1) { AppendDownload(p, l.downloads[r]) }
        b.appendChild(p);
        c.appendChild(b); y.appendChild(c)
    }
    v.appendChild(y)
}

function constructPublicationTableForYearSmallDetails(a, h) {
    var f, e, l, c, g, k, b, d;
    l = document.getElementById("item-list");
    g = document.getElementById("items-" + h);
    k = document.createElement("ul");
    k.className = "item-listview";
    for (f = 0; f < a.length; f += 1) {
        b = a[f];
        c = document.createElement("li");
        c.innerHTML += '<a href="' + b.projectpage + '"><h3 class="item-title-details">' + b.title + "</h3></a>";
        for (e = 0; e < b.authors.length; e += 1) {
            d = GetAuthor(b.authors[e]);
            if (d.url)         { c.innerHTML += '<a href="' + d.url + '" class="item-authors-details">' + d.name + "</a>" }
            else                            { c.innerHTML += d.name }
            if (e === b.authors.length - 1) { c.innerHTML += ".</br>"   }
            else                            { c.innerHTML += ", "       }
        }
        c.innerHTML += '<span class="item-details">' + b.citation + "</span>"; 
		k.appendChild(c)
    }
    g.appendChild(k);
    l.appendChild(g)
}

function constructPublicationTableSmallDetails() {
    var c, b, a;
    b = GetPublicationYears();
    b.sort();
    for (c = b.length - 1; c >= 0; c -= 1) {
        constructPublicationTableForYearSmallDetails(GetPublicationsOfYear(b[c]), b[c])
    }
}

function constructPublicationTableLargeThumbnail() {
    var c, b, a;
    b = GetPublicationYears();
    b.sort();
    for (c = b.length - 1; c >= 0; c -= 1) {
        constructPublicationTableForYearLargeThumbnail(GetPublicationsOfYear(b[c]), b[c])
    }
}

function constructPublicationYearLinks() {
    var c, a, b;
    b = GetPublicationYears();
    b.sort();
    a = document.getElementById("item-year-links");
    for (c = b.length - 1; c >= 0; c -= 1) {
        a.innerHTML += '<a href = "#items-' + b[c] + '">' + b[c] + "</a>";
        if (c > 0) { a.innerHTML += ", " }
        else       { a.innerHTML += "."  }
    }
}

function thumbnailView() {
    var a, b;
    b = document.getElementsByClassName("item-thumbnailview");
    for (a = 0; a < b.length; a += 1) {
        b[a].style.display = "block"
    }
    b = document.getElementsByClassName("item-listview");
    for (a = 0; a < b.length; a += 1) {
        b[a].style.display = "none"
    }
    document.getElementById("thumbnail-view-button").style.opacity = 0.8;
    document.getElementById("list-view-button").style.opacity      = ""
}

function listView() {
    var a, b;
    b = document.getElementsByClassName("item-thumbnailview");
    for (a = 0; a < b.length; a += 1) {
        b[a].style.display = "none"
    }
    b = document.getElementsByClassName("item-listview");
    for (a = 0; a < b.length; a += 1) {
        b[a].style.display = "block"
    }
    document.getElementById("thumbnail-view-button").style.opacity = "";
    document.getElementById("list-view-button").style.opacity      = 0.8
}

constructPublicationTableLargeThumbnail();
constructPublicationTableSmallDetails();
constructPublicationYearLinks();
thumbnailView();