var PapersByYear = {};
var PapersByDate = [];
var PapersByDateSorted = false;

function linkToIcon(a) {
    var b = a.split(".").pop();
    if (b === "pdf")                                                                  { return "res/Icons/icon_pdf.png"     }
    else if (b === "bib" || b === "tex")                                              { return "res/Icons/icon_tex.png"     } 
    else if (b === "txt")                                                             { return "res/Icons/icon_txt.png"     } 
    else if (b === "zip" || b === "gz")                                               { return "res/Icons/icon_zip.png"     } 
    else if (b === "mov" || b === "mp4" || b === "avi" || b === "mkv" || b === "wmv") { return "res/Icons/icon_video.png"   } 
    else if (b === "ppt" || b === "pptx")                                             { return "res/Icons/icon_ppt.png"     } 
    else if (b === "ps")                                                              { return "res/Icons/icon_ps.png"      } 
    else                                                                              { return "res/Icons/icon_unknown.png" }
}

var Download = function (d, l, i, e, s) {
    this.description = d;
    this.link        = l;
    this.extension   = e;
    this.size        = s;
    if (i) { this.icon = i             }
    else   { this.icon = linkToIcon(l) }
};

var Paper = function (t, a, c, i, m, y, p, d) {
    this.title       = t;
    this.authors     = a;
    this.citation    = c;
    this.thumbnail   = i;
    this.month       = m;
    this.year        = y;
    this.projectpage = p;
    this.downloads   = d
};

function addPaper(t, a, c, i, m, y, p, d) {
    if (!PapersByYear.hasOwnProperty(y)) { PapersByYear[y] = [] }
    var b = new Paper(t, a, c, i, m, y, p, d);
    PapersByYear[g].push(b);
    PapersByDate.push(b);
    PapersByDateSorted = false
}

function getPapersByYear(y) {
    if (PapersByYear.hasOwnProperty(y)) {
        var b = PapersByYear[y];
        b.sort(function (p1, p2) { return p2.month - p1.month });
        return b
    }
    else { return [] }
}

function getPaperYears() {
    return Object.keys(PapersByYear)
}

function getRecentPapers(nb) {
    if (PapersByDateSorted === false) {
        PapersByDate.sort(function (p1, p2) {
            if      (p1.year < p2.year)   { return  1 }
            else if (p1.year > p2.year)   { return -1 } 
            else if (p1.month < p2.month) { return  1 } 
            else if (p1.month > p2.month) { return -1 } 
            else return p2.title.localeCompare(p1.title)
        });
        PapersByDateSorted = true
    }
    var b, a;
    a = [];
    for (b = 0; b < Math.min(nb, PapersByDate.length); b += 1) {
        a.push(PapersByDate[b])
    }
    return a
}

addPaper("Efficient visibility heuristics for kd-trees using the RTSAH",
    ["Matthias Moulin", "Niels Billen", "Philip Dutr&eacute"],
    "Eurographics Symposium on Rendering - Experimental Ideas & Implementations, June 2015",
    "res/Publications/Efficient Visibility Heuristics for kd-trees Using the RTSAH/Thumbnail.png",
    6, 2015,
    "res/Publications/Efficient Visibility Heuristics for kd-trees Using the RTSAH/index.html",
    [new Download("Preprint"    , "res/Publications/Efficient Visibility Heuristics for kd-trees Using the RTSAH/Preprint.pdf"    , undefined, "PDF", "10.9 MB"),
     new Download("Citation"    , "res/Publications/Efficient Visibility Heuristics for kd-trees Using the RTSAH/Citation.bib"    , undefined, "BIB", "0.1 KB"),
     new Download("Abstract"    , "res/Publications/Efficient Visibility Heuristics for kd-trees Using the RTSAH/Abstract.txt"    , undefined, "TXT", "0.1 KB"),
     new Download("Presentation", "res/Publications/Efficient Visibility Heuristics for kd-trees Using the RTSAH/Presentation.pdf", undefined, "PDF", "6.8 MB"),
     new Download("DOI"         , "https://dx.doi.org/10.2312/sre.20151164"                                                       , "images/icon_html.png")
	]
	);

var recent = getRecentPapers(5)