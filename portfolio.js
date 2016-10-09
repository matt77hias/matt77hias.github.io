var ItemsByYear = {};
var ItemsByDate = [];
var ItemsByDateSorted = false;

var PublicationsByYear = {};
var PublicationsByDate = [];
var PublicationsByDateSorted = false;

var ProjectsByYear = {};
var ProjectsByDate = [];
var ProjectsByDateSorted = false;

function linkToIcon(a) {
    var b = a.split(".").pop();
    if      (b === "pdf")                                                             { return "res/Icons/icon_pdf.png"     }
    else if (b === "bib" || b === "tex")                                              { return "res/Icons/icon_tex.png"     }
    else if (b === "html")                                                            { return "res/Icons/icon_html.png"    }
    else if (b === "txt")                                                             { return "res/Icons/icon_txt.png"     }
    else if (b === "zip" || b === "gz")                                               { return "res/Icons/icon_zip.png"     }
    else if (b === "mov" || b === "mp4" || b === "avi" || b === "mkv" || b === "wmv") { return "res/Icons/icon_video.png"   }
    else if (b === "ppt" || b === "pptx")                                             { return "res/Icons/icon_ppt.png"     }
    else if (b === "ps")                                                              { return "res/Icons/icon_ps.png"      }
    else                                                                              { return "res/Icons/icon_unknown.png" }
}

var Download = function (d, l, i, e, s) {
    this.description   = d;
    this.link          = l;
    this.extension     = e;
    this.size          = s;
    if (i) { this.icon = i             }
    else   { this.icon = linkToIcon(l) }
};

var Publication = function (t, a, c, i, m, y, p, d) {
    this.title         = t;
    this.authors       = a;
    this.citation      = c;
    this.thumbnail     = i;
    this.month         = m;
    this.year          = y;
    this.projectpage   = p;
    this.downloads     = d
};

var Project = function (t, a, c, i, m, y, p, d) {
    this.title         = t;
    this.authors       = a;
    this.citation      = c;
    this.thumbnail     = i;
    this.month         = m;
    this.year          = y;
    this.projectpage   = p;
    this.downloads     = d
};

function _addItem(b, y) {
    if (!ItemsByYear.hasOwnProperty(y)) {
        ItemsByYear[y] = []
    }

    ItemsByYear[y].push(b);
    ItemsByDate.push(b);
    ItemsByDateSorted = false
}

function _addPublication(b, y) {
    if (!PublicationsByYear.hasOwnProperty(y)) {
        PublicationsByYear[y] = []
    }

    PublicationsByYear[y].push(b);
    PublicationsByDate.push(b);
    PublicationsByDateSorted = false
}

function _addProject(b, y) {
    if (!ProjectsByYear.hasOwnProperty(y)) {
        ProjectsByYear[y] = []
    }

    ProjectsByYear[y].push(b);
    ProjectsByDate.push(b);
    ProjectsByDateSorted = false
}

function addPublication(t, a, c, i, m, y, p, d) {
    var b = new Publication(t, a, c, i, m, y, p, d);
    _addItem(b, y);
    _addPublication(b, y)
}

function addProject(t, a, c, i, m, y, p, d) {
    var b = new Project(t, a, c, i, m, y, p, d);
    _addItem(b, y);
    _addProject(b, y)
}

function _getByYear(d, y) {
    if (d.hasOwnProperty(y)) {
        var b = d[y];
        b.sort(function (p1, p2) { return p2.month - p1.month });
        return b
    }
    else {
        return []
    }
}

function getItemsByYear(y) {
    return _getByYear(ItemsByYear, y)
}

function getPublicationsByYear(y) {
    return _getByYear(PublicationsByYear, y)
}

function getProjectsByYear(y) {
    return _getByYear(ProjectsByYear, y)
}

function getItemYears() {
    return Object.keys(ItemsByYear)
}

function getPublicationYears() {
    return Object.keys(PublicationsByYear)
}

function getProjectYears() {
    return Object.keys(ProjectsByYear)
}

function _sort(l) {
    l.sort(function (p1, p2) {
    if (p1.year < p2.year)        { return  1 }
    else if (p1.year > p2.year)   { return -1 }
    else if (p1.month < p2.month) { return  1 }
    else if (p1.month > p2.month) { return -1 }
    else return p2.title.localeCompare(p1.title)
    });
}

function _getRecent(l, nb) {
    var b, a;
    a = [];
    for (b = 0; b < Math.min(nb, l.length) ; b += 1) {
        a.push(l[b])
    }
    return a
}

function getRecentItems(nb) {
    if (ItemsByDateSorted === false) {
        _sort(ItemsByDate, nb)
        ItemsByDateSorted = true
    }
    return _getRecent(ItemsByDate, nb)
}

function getRecentPublications(nb) {
    if (PublicationsByDateSorted === false) {
        _sort(PublicationsByDate, nb)
        PublicationsByDateSorted = true
    }
    return _getRecent(PublicationsByDate, nb)
}

function getRecentProjects(nb) {
    if (ProjectsByDateSorted === false) {
        _sort(ProjectsByDate, nb)
        ProjectsByDateSorted = true
    }
    return _getRecent(ProjectsByDate, nb)
}

var recent = getRecentItems(5)

addPublication("Hybrid kd-trees for photon mapping and accelerating ray tracing",
    ["Matthias Moulin"],
    "Master's thesis, Department of Computer Science, KULeuven, Belgium, June 2015",
    "res/Publications/M15HKFPMAART/Thumbnail.png", 6, 2015,
    "M15HKFPMAART.html",
    [new Download("Citation", "res/Publications/M15HKFPMAART/Citation.bib", undefined, "BIB", "0.3 KB"),
     new Download("Abstract", "res/Publications/M15HKFPMAART/Abstract.txt", undefined, "TXT", "4.0 KB"),
     new Download("Presentation", "res/Publications/M15HKFPMAART/Presentation.pdf", undefined, "PDF", "1.4 MB"),
     new Download("Poster", "res/Publications/M15HKFPMAART/Poster.pdf", undefined, "PDF", "1.3 MB")
    ]
	);

addPublication("Efficient Visibility Heuristics for kd-trees Using the RTSAH",
    ["Matthias Moulin", "Niels Billen", "Philip Dutr&eacute;"],
    "Eurographics Symposium on Rendering - Experimental Ideas & Implementations, June 2015",
    "res/Publications/MBD15EVHFKUTR/Thumbnail.png", 6, 2015,
    "MBD15EVHFKUTR.html",
    [new Download("Preprint", "res/Publications/MBD15EVHFKUTR/Preprint.pdf", undefined, "PDF", "10.9 MB"),
     new Download("Citation", "res/Publications/MBD15EVHFKUTR/Citation.bib", undefined, "BIB", "0.6 KB"),
     new Download("Abstract", "res/Publications/MBD15EVHFKUTR/Abstract.txt", undefined, "TXT", "0.9 KB"),
     new Download("Presentation", "res/Publications/MBD15EVHFKUTR/Presentation.pdf", undefined, "PDF", "6.7 MB"),
     new Download("Poster", "res/Publications/MBD15EVHFKUTR/Poster.pdf", undefined, "PDF", "1.3 MB"),
     new Download("DOI", "https://dx.doi.org/10.2312/sre.20151164", "res/Icons/icon_html.png"),
	 new Download("Lirias", "https://lirias.kuleuven.be/handle/123456789/501514", "res/Icons/icon_html.png")
    ]
	);

addProject("Gwent",
    ["Matthias Moulin"],
    "April 2016",
    "res/Projects/M16G/Thumbnail.png", 4, 2016,
    "https://github.com/matt77hias/Gwent",
	[new Download("Repository", "https://github.com/matt77hias/Gwent", "res/Icons/icon_html.png")]
	);	
	
addProject("FlowGrid Visualization",
    ["Matthias Moulin"],
    "April 2016",
    "res/Projects/M16FV/Thumbnail.png", 4, 2016,
    "M16FV.html",
	[new Download("Repository", "https://github.com/matt77hias/FlowGridVisualization", "res/Icons/icon_html.png")]
	);	
	
addProject("Permeability",
    ["Matthias Moulin"],
    "December 2015",
    "res/Projects/M15P/Thumbnail.png", 12, 2015,
    "M15P.html",
	[new Download("Repository", "https://github.com/matt77hias/Permeability", "res/Icons/icon_html.png")]
	);
	
addProject("Personal webpage",
    ["Matthias Moulin", "Niels Billen"],
    "November 2015",
    "res/Projects/MB15M/Thumbnail.png", 11, 2015,
    "http://matt77hias.github.io/",
	[new Download("Repository", "https://github.com/matt77hias/matt77hias.github.io", "res/Icons/icon_html.png")]
	);
	
addProject("FalseColor",
    ["Matthias Moulin"],
    "November 2015",
    "res/Projects/M15F/Thumbnail.png", 11, 2015,
    "M15F.html",
	[new Download("Repository", "https://github.com/matt77hias/FalseColor", "res/Icons/icon_html.png")]
	);	
	
addProject("Clipping",
    ["Matthias Moulin"],
    "November 2015",
    "res/Projects/M15C/Thumbnail.png", 11, 2015,
    "M15C.html",
	[new Download("Repository", "https://github.com/matt77hias/Clipping", "res/Icons/icon_html.png")]
	);

addProject("Hybrid Survivor",
    ["Matthias Moulin", "Milan Samyn", "Samuel Lannoy"],
    "Capita Selecta Computer Science: Man Machine Interface: Game Design (H05N2A), June 2015",
    "res/Projects/MSL15HS/Thumbnail.png", 6, 2015,
    "MSL15HS.html",
	[new Download("Repository", "https://github.com/matt77hias/meta-HybridSurvivor", "res/Icons/icon_html.png")]
	);

addProject("Stochastic Experiments",
    ["Matthias Moulin"],
    "Deterministic and Stochastic Integration Techniques (H03G3B), May 2015",
    "res/Projects/M15SE/Thumbnail.png", 5, 2015,
    "M15SE.html",
	[new Download("Repository", "https://github.com/matt77hias/StochasticExperiments", "res/Icons/icon_html.png")]
	);

addProject("Quadrature Experiments",
    ["Matthias Moulin"],
    "Deterministic and Stochastic Integration Techniques (H03G3B), May 2015",
    "res/Projects/M15QE/Thumbnail.png", 5, 2015,
    "M15QE.html",
	[new Download("Repository", "https://github.com/matt77hias/QuadratureExperiments", "res/Icons/icon_html.png")]
	);

addProject("Kajiya",
    ["Matthias Moulin", "Mattias Buelens"],
    "Requirements Analysis for Complex Software Systems (G0K32A), December 2014",
    "res/Projects/MB14K/Thumbnail.png", 12, 2014,
    "MB14K.html",
	[]
	);

addProject("Fingerprint Compression",
    ["Matthias Moulin"],
    "Wavelets (H03F7A), December 2014",
    "res/Projects/M14FC/Thumbnail.png", 12, 2014,
    "M14FC.html",
	[new Download("Repository", "https://github.com/matt77hias/FingerprintCompression", "res/Icons/icon_html.png")]
	);

addProject("Tron",
    ["Matthias Moulin"],
    "Comparative Programming Languages (H04L5A), December 2014",
    "res/Projects/M14T/Thumbnail.png", 12, 2014,
    "M14T.html",
	[]
	);

addProject("2048",
    ["Matthias Moulin"],
    "Comparative Programming Languages (H04L5A), December 2014",
    "res/Projects/M142048/Thumbnail.png", 12, 2014,
    "M142048.html",
	[]
	);
	
addProject("pbrt tools",
    ["Matthias Moulin"],
    "December 2014",
    "res/Projects/M14P/Thumbnail.png", 12, 2014,
    "M14P.html",
	[]
	);
	
addProject("The Puppeteer",
    ["Matthias Moulin"],
    "Capita Selecta Computer Science: Man Machine Interface: Game Design (H05N2A), October 2014",
    "res/Projects/M14TP/Thumbnail.png", 10, 2014,
    "M14TP.html",
	[]
	);

addProject("Incisor Segmentation",
    ["Matthias Moulin", "Milan Samyn"],
    "Computer Vision (H02A5A), June 2014",
    "res/Projects/MS14IS/Thumbnail.png", 6, 2014,
    "MS14IS.html",
	[]
	);

addProject("FrigoShare",
    ["Herbert Beraldo", "Matthias Moulin", "Ruben Pieters"],
    "User Interfaces (H04I2A), June 2014",
    "res/Projects/BMP14FS/Thumbnail.png", 6, 2014,
    "BMP14FS.html",
	[new Download("App", "https://play.google.com/store/apps/details?id=com.frigoshare", "res/Icons/icon_html.png"),
	 new Download("Blog", "https://anarchikul.wordpress.com/", "res/Icons/icon_html.png")
	]
	);

addProject("Pacman",
    ["Matthias Moulin", "Ruben Pieters"],
    "Modelling of Complex Systems (G0Q66B), December 2013",
    "res/Projects/MP13P/Thumbnail.png", 12, 2013,
    "MP13P.html",
	[]
	);

addProject("Lilyhammer Rendering Engine",
    ["Matthias Moulin"],
    "Computer Graphics I (G0Q66B), December 2013",
    "res/Projects/M13LRE/Thumbnail.png", 12, 2013,
    "M13LRE.html",
	[]
	);

addProject("JUnit Test Deamon",
    ["Mattias Buelens", "Vital D'haveloose", "Matthias Moulin", "Ruben Pieters"],
    "Design of Software Systems (H04J9B), December 2013",
    "res/Projects/BDMP13JTD/Thumbnail.png", 12, 2013,
    "BDMP13JTD.html",
	[new Download("Repository", "https://github.com/MattiasBuelens/junit", "res/Icons/icon_html.png")]
	);

addProject("Car Rental Service",
    ["Matthias Moulin", "Ruben Pieters"],
    "Distributed Systems (H04I4A), December 2013",
    "res/Projects/MP13CRS/Thumbnail.png", 12, 2013,
    "MP13CRS.html",
	[]
	);

addProject("Snake",
    ["Matthias Moulin"],
    "August 2013",
    "res/Projects/M13S/Thumbnail.png", 8, 2013,
    "M13S.html",
	[]
	);

addProject("MazeStormer",
    ["Mattias Buelens", "Vital D'haveloose", "Dennis Frett", "Stijn Hoskens", "Matthias Moulin"],
    "Problem Solving and Design: Computer Science (H01Q3C), June 2013",
    "res/Projects/BDFHM13MS/Thumbnail.png", 6, 2013,
    "BDFHM13MS.html",
	[new Download("Repository", "https://github.com/MattiasBuelens/MazeStormer", "res/Icons/icon_html.png")]
	);

addProject("RoboRally",
    ["Matthias Moulin", "Ruben Pieters"],
    "Object Oriented Programming (H01P1A), June 2012",
    "res/Projects/MP12RR/Thumbnail.png", 6, 2012,
    "MP12RR.html",
	[]
	);

addProject("Aurora",
    ["Sebastiaan Maes", "Sophie Marien", "Pieter Marynissen", "Nathan Moesen", "Tom Molderez", "Matthias Moulin"],
    "Problem Solving and Design, Part 3 (H01D4B), December 2011",
    "res/Projects/MMMMMM11A/Thumbnail.png", 12, 2011,
    "MMMMMM11A.html",
	[new Download("App", "http://aurora--cwb1.appspot.com/", "res/Icons/icon_html.png"),
	new Download("Wiki", "http://ariadne.cs.kuleuven.be/mediawiki/index.php/CWB1-1112", "res/Icons/icon_html.png")]
	);

addProject("Crossbow Tennis Machine",
    ["Nick Berlanger", "Egon Blyweert", "Jeroen Colon", "Matthias Moulin", "Bart Opsomer", "Joris Panis", "Louis Ponet", "Ben Praet", "Frederick Puttemans"],
    "Problem Solving and Design, Part 2 (H01C2A), June 2011",
    "res/Projects/BBCMOPPPP11CTM/Thumbnail.png", 6, 2011,
    "BBCMOPPPP11CTM.html",
	[]
	);

addProject("MandeLboat",
    ["Jef Aendekerk", "Ben Allaerts", "Wout Behaeghel", "Julian Bouckenooghe", "Robin Clerckx", "Stijn Meylemans", "Matthias Moulin", "Egon Pittoors"],
    "Problem Solving and Design, Part 1 (H01B9A), December 2010",
    "res/Projects/AABBCMMP10M/Thumbnail.png", 12, 2010,
    "AABBCMMP10M.html",
	[]
	);