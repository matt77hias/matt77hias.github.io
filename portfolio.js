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

//-----------------------------------------------------------------------------
// Publications
//-----------------------------------------------------------------------------
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
	
//-----------------------------------------------------------------------------
// 2nd Semester - 2nd PhD of Science in Engineering (2016-2017)
//-----------------------------------------------------------------------------
addProject("MAGE",
    ["Matthias Moulin"],
    "January 2017",
    "res/Projects/MAGE/Thumbnail.png", 1, 2017,
    "https://github.com/matt77hias/MAGE-Meta",
	[new Download("Code", "https://github.com/matt77hias/MAGE", "res/Icons/icon_html.png"),
	 new Download("Documentation", "https://github.com/matt77hias/MAGE-Doc", "res/Icons/icon_html.png"),
	 new Download("Font Utility", "https://github.com/matt77hias/MAGE-SpriteFont", "res/Icons/icon_html.png")
	]
	);

//-----------------------------------------------------------------------------
// 1st Semester - 2nd PhD of Science in Engineering (2016-2017)
//-----------------------------------------------------------------------------
addProject("Monte Carlo Integration Techniques",
    ["Matthias Moulin"],
    "Teaching: Problem Solving and Design, Part 3 (B-KUL-H01D4B), October 2016",
    "res/Projects/MC/Thumbnail.png", 10, 2016,
    "https://github.com/ComputerGraphicsResearchGroup/peno3",
	[new Download("Supplementary Notes", "https://github.com/matt77hias/MC/blob/master/MC.pdf", "res/Icons/icon_pdf.png"),
	 new Download("Supplementary Notes", "https://github.com/matt77hias/MC", "res/Icons/icon_html.png"),
	 new Download("Code samples", "https://github.com/matt77hias/MCExperiments", "res/Icons/icon_html.png")
	]
	);

addProject("fibpy",
    ["Matthias Moulin"],
    "October 2016",
    "res/Projects/fibpy/Thumbnail.png", 10, 2016,
    "https://github.com/matt77hias/fibpy",
	[]
	);

addProject("pippy",
    ["Matthias Moulin"],
    "October 2016",
    "res/Projects/pippy/Thumbnail.png", 10, 2016,
    "https://github.com/matt77hias/pippy",
	[]
	);
	
//-----------------------------------------------------------------------------
// 2nd Semester - 1st PhD of Science in Engineering (2015-2016)
//-----------------------------------------------------------------------------
addProject("Rosetta smallpt",
    ["Matthias Moulin"],
    "September 2016",
    "res/Projects/smallpt/Thumbnail.png", 9, 2016,
    "https://github.com/matt77hias/smallpt",
	[new Download("C", "https://github.com/matt77hias/c-smallpt", "res/Icons/icon_html.png"),
	 new Download("C++", "https://github.com/matt77hias/cpp-smallpt", "res/Icons/icon_html.png"),
	 new Download("C#", "https://github.com/matt77hias/cs-smallpt", "res/Icons/icon_html.png"),
	 new Download("CoffeeScript", "https://github.com/matt77hias/coffee-smallpt", "res/Icons/icon_html.png"),
	 new Download("CUDA", "https://github.com/matt77hias/cu-smallpt", "res/Icons/icon_html.png"),
	 new Download("Erlang", "https://github.com/matt77hias/erl-smallpt", "res/Icons/icon_html.png"),
	 new Download("Haskell", "https://github.com/matt77hias/hs-smallpt", "res/Icons/icon_html.png"),
	 new Download("Java", "https://github.com/matt77hias/java-smallpt", "res/Icons/icon_html.png"),
	 new Download("JavaScript", "https://github.com/matt77hias/js-smallpt", "res/Icons/icon_html.png"),
	 new Download("J#", "https://github.com/matt77hias/jsl-smallpt", "res/Icons/icon_html.png"),
	 new Download("Prolog", "https://github.com/matt77hias/pl-smallpt", "res/Icons/icon_html.png"),
	 new Download("Python 2.7", "https://github.com/matt77hias/py-smallpt", "res/Icons/icon_html.png"),
	 new Download("Python 3.5", "https://github.com/matt77hias/py-smallpt", "res/Icons/icon_html.png"),
	 new Download("Python 2.7 + NumPy", "https://github.com/matt77hias/numpy-smallpt", "res/Icons/icon_html.png"),
	 new Download("Python 3.5 + NumPy", "https://github.com/matt77hias/numpy-smallpt", "res/Icons/icon_html.png"),
	 new Download("Racket", "https://github.com/matt77hias/rkt-smallpt", "res/Icons/icon_html.png"),
	 new Download("TypeScript", "https://github.com/matt77hias/ts-smallpt", "res/Icons/icon_html.png")]
	);
	
//-----------------------------------------------------------------------------
// 1st Semester - 1st PhD of Science in Engineering (2015-2016)
//-----------------------------------------------------------------------------
addProject("pbrtpy",
    ["Matthias Moulin"],
    "December 2015",
    "res/Projects/pbrtpy/Thumbnail.png", 12, 2015,
    "https://github.com/matt77hias/pbrtpy",
	[]
	);

addProject("Permeability",
    ["Matthias Moulin"],
    "December 2015",
    "res/Projects/Permeability/Thumbnail.png", 12, 2015,
    "https://matt77hias.github.io/private",
	[]
	);

addProject("FalseColor Visualization",
    ["Matthias Moulin"],
    "November 2015",
    "res/Projects/FalseColor/Thumbnail.png", 11, 2015,
    "https://github.com/matt77hias/FalseColor",
	[]
	);
	
addProject("Personal webpage",
    ["Matthias Moulin", "Niels Billen"],
    "November 2015",
    "res/Projects/PersonalWebpage/Thumbnail.png", 11, 2015,
    "https://github.com/matt77hias/matt77hias.github.io",
	[new Download("Play", "matt77hias.github.io", "res/Icons/icon_html.png")]
	);
	
addProject("Clipping",
    ["Matthias Moulin"],
    "November 2015",
    "res/Projects/Clipping/Thumbnail.png", 11, 2015,
    "https://github.com/matt77hias/Clipping",
	[]
	);

//-----------------------------------------------------------------------------
// 2nd Semester - 2nd Master of Science in Engineering (2014-2015)
//-----------------------------------------------------------------------------
addProject("Hybrid Survivor",
    ["Matthias Moulin", "Milan Samyn", "Samuel Lannoy"],
    "Course: Capita Selecta Computer Science: Human Machine Communication: Game Design (B-KUL-H05N2A), June 2015",
    "res/Projects/HybridSurvivor/Thumbnail.png", 6, 2015,
    "https://github.com/matt77hias/HybridSurvivor",
	[new Download("Oculus Rift", "https://github.com/matt77hias/HybridSurvivor-OculusRift", "res/Icons/icon_html.png"),
	 new Download("HTC Vive", "https://github.com/matt77hias/HybridSurvivor-PC", "res/Icons/icon_html.png"),
	 new Download("PC & Web", "https://github.com/matt77hias/HybridSurvivor-HTCVive", "res/Icons/icon_html.png")
	]
	);

addProject("Stochastic Experiments",
    ["Matthias Moulin"],
    "Course: Deterministic and Stochastic Integration Techniques (B-KUL-H03G3B), May 2015",
    "res/Projects/StochasticExperiments/Thumbnail.png", 5, 2015,
    "https://github.com/matt77hias/StochasticExperiments",
	[]
	);

addProject("Quadrature Experiments",
    ["Matthias Moulin"],
    "Course: Deterministic and Stochastic Integration Techniques (B-KUL-H03G3B), May 2015",
    "res/Projects/QuadratureExperiments/Thumbnail.png", 5, 2015,
    "https://github.com/matt77hias/QuadratureExperiments",
	[]
	);

//-----------------------------------------------------------------------------
// 1st Semester - 2nd Master of Science in Engineering (2014-2015)
//-----------------------------------------------------------------------------
addProject("Kajiya",
    ["Matthias Moulin", "Mattias Buelens"],
    "Course: Requirements Analysis for Complex Software Systems (B-KUL-G0K32A), December 2014",
    "res/Projects/Kajiya/Thumbnail.png", 12, 2014,
    "https://matt77hias.github.io/private",
	[]
	);

addProject("Fingerprint Compression",
    ["Matthias Moulin"],
    "Course: Wavelets (B-KUL-H03F7A), December 2014",
    "res/Projects/FingerprintCompression/Thumbnail.png", 12, 2014,
    "https://github.com/matt77hias/FingerprintCompression",
	[]
	);

addProject("Tron",
    ["Matthias Moulin"],
    "Course: Comparative Programming Languages (B-KUL-H04L5A), December 2014",
    "res/Projects/Tron/Thumbnail.png", 12, 2014,
    "https://github.com/matt77hias/Tron",
	[new Download("Play", "http://matt77hias.github.io/Tron/", "res/Icons/icon_html.png")]
	);

addProject("2048",
    ["Matthias Moulin"],
    "Course: Comparative Programming Languages (B-KUL-H04L5A), December 2014",
    "res/Projects/2048/Thumbnail.png", 12, 2014,
    "https://github.com/matt77hias/2048",
	[]
	);

//-----------------------------------------------------------------------------
// 2nd Semester - 1st Master of Science in Engineering (2013-2014)
//-----------------------------------------------------------------------------
addProject("Incisor Segmentation",
    ["Matthias Moulin", "Milan Samyn"],
    "Course: Computer Vision (B-KUL-H02A5A), June 2014",
    "res/Projects/IncisorSegmentation/Thumbnail.png", 6, 2014,
    "https://matt77hias.github.io/private",
	[]
	);
	
addProject("FrigoShare",
    ["Herbert Beraldo", "Matthias Moulin", "Ruben Pieters"],
    "Course: User Interfaces (B-KUL-H04I2A), June 2014",
    "res/Projects/FrigoShare/Thumbnail.png", 6, 2014,
    "https://anarchikul.wordpress.com/",
	[new Download("Play", "https://play.google.com/store/apps/details?id=com.frigoshare", "res/Icons/icon_html.png")]
	);
	
addProject("Sampling Experiments",
    ["Matthias Moulin"],
    "Course: Computer Graphics II (B-KUL-G0B36A), April 2014",
    "res/Projects/SamplingExperiments/Thumbnail.png", 4, 2014,
    "https://matt77hias.github.io/private",
	[]
	);
	
addProject("Face Recognition",
    ["Matthias Moulin"],
    "Course: Computer Vision (B-KUL-H02A5A), March 2014",
    "res/Projects/FaceRecognition/Thumbnail.png", 3, 2014,
    "https://github.com/matt77hias/FaceRecognition",
	[]
	);
	
addProject("Segmentation",
    ["Matthias Moulin"],
    "Course: Computer Vision (B-KUL-H02A5A), March 2014",
    "res/Projects/Segmentation/Thumbnail.png", 3, 2014,
    "https://github.com/matt77hias/Segmentation",
	[]
	);
	
addProject("Smoothing",
    ["Matthias Moulin"],
    "Course: Computer Vision (B-KUL-H02A5A), March 2014",
    "res/Projects/Smoothing/Thumbnail.png", 3, 2014,
    "https://github.com/matt77hias/Smoothing",
	[]
	);

//-----------------------------------------------------------------------------
// 1st Semester - 1st Master of Science in Engineering (2013-2014)
//-----------------------------------------------------------------------------
addProject("Pacman",
    ["Matthias Moulin", "Ruben Pieters"],
    "Course: Modelling of Complex Systems (B-KUL-G0Q66B), December 2013",
    "res/Projects/Pacman/Thumbnail.png", 12, 2013,
    "https://matt77hias.github.io/private",
	[]
	);

addProject("Lilyhammer Rendering Engine",
    ["Matthias Moulin"],
    "Course: Computer Graphics I (B-KUL-G0Q66B), December 2013",
    "res/Projects/LilyhammerRenderingEngine/Thumbnail.png", 12, 2013,
    "LilyhammerRenderingEngine.html",
	[]
	);

addProject("JUnit Test Deamon",
    ["Matthias Moulin", "Mattias Buelens", "Ruben Pieters", "Vital D'haveloose"],
    "Course: Design of Software Systems (B-KUL-H04J9B), December 2013",
    "res/Projects/JUnitTestDeamon/Thumbnail.png", 12, 2013,
    "https://github.com/matt77hias/junit",
	[]
	);

addProject("Car Rental Agency",
    ["Matthias Moulin", "Ruben Pieters"],
    "Course: Distributed Systems (B-KUL-H04I4A), December 2013",
    "res/No Image.jpg", 12, 2013,
    "https://github.com/matt77hias/CarRental-Meta",
	[new Download("Java RMI 1", "https://github.com/matt77hias/JavaRMI1", "res/Icons/icon_html.png"),
	 new Download("Java RMI 2", "https://github.com/matt77hias/JavaRMI2", "res/Icons/icon_html.png"),
	 new Download("Java EE", "https://github.com/matt77hias/JavaEE", "res/Icons/icon_html.png"),
	 new Download("Java GAE", "https://github.com/matt77hias/JavaGAE", "res/Icons/icon_html.png")
	]
	);
	
addProject("Synchronization Experiments",
    ["Matthias Moulin"],
    "Course: Operating Systems (B-KUL-H04G1B), November 2013",
    "res/Projects/SynchronizationExperiments/Thumbnail.png", 11, 2013,
    "https://github.com/matt77hias/JavaSyncExperiments",
	[]
	);

//-----------------------------------------------------------------------------
// Holiday (2013)
//-----------------------------------------------------------------------------
addProject("Snake",
    ["Matthias Moulin"],
    "August 2013",
    "res/Projects/Snake/Thumbnail.png", 8, 2013,
    "https://github.com/matt77hias/Snake",
	[]
	);
	
//-----------------------------------------------------------------------------
// 1st + 2nd Semester - 3th Bachelor of Science in Engineering (2012-2013)
//-----------------------------------------------------------------------------
addProject("MazeStormer",
    ["Dennis Frett", "Matthias Moulin", "Mattias Buelens", "Stijn Hoskens", "Vital D'haveloose", "Stijn Hoskens"],
    "Course: Problem Solving and Design: Computer Science (B-KUL-H01Q3C), June 2013",
    "res/Projects/MazeStormer/Thumbnail.png", 6, 2013,
    "https://github.com/matt77hias/MazeStormer",
	[]
	);
	
//-----------------------------------------------------------------------------
// 2nd Semester - 3th Bachelor of Science in Engineering (2012-2013)
//-----------------------------------------------------------------------------
addProject("Network Simulation, Part 2",
    ["Matthias Moulin"],
    "Course: Computer Networks (B-KUL-G0Q43A), April 2013",
    "res/Projects/NetworkSimulation2/Thumbnail.png", 4, 2013,
    "https://github.com/matt77hias/NS2",
	[]
	);
	
addProject("Network Simulation, Part 1",
    ["Matthias Moulin"],
    "Course: Computer Networks (B-KUL-G0Q43A), April 2013",
    "res/Projects/NetworkSimulation1/Thumbnail.png", 4, 2013,
    "https://github.com/matt77hias/NS1",
	[]
	);
	
addProject("Socket Experiments",
    ["Matthias Moulin", "Ruben Pieters"],
    "Course: Computer Networks (B-KUL-G0Q43A), April 2013",
    "res/Projects/SocketExperiments/Thumbnail.png", 4, 2013,
    "https://github.com/matt77hias/JavaSocketExperiments",
	[]
	);
	
//-----------------------------------------------------------------------------
// 1st Semester - 3th Bachelor of Science in Engineering (2012-2013)
//-----------------------------------------------------------------------------
addProject("MIPS Samples",
    ["Matthias Moulin"],
    "Course: Computer Architecture and System Software (B-KUL-H01P5A), December 2012",
    "res/Projects/MIPSSamples/Thumbnail.png", 12, 2012,
    "https://github.com/matt77hias/MIPSSamples",
	[]
	);

//-----------------------------------------------------------------------------
// 2nd Semester - 2nd Bachelor of Science in Engineering (2011-2012)
//-----------------------------------------------------------------------------
addProject("RoboRally",
    ["Matthias Moulin", "Ruben Pieters"],
    "Course: Object Oriented Programming (B-KUL-H01P1A), June 2012",
    "res/Projects/RoboRally/Thumbnail.png", 6, 2012,
    "https://github.com/matt77hias/RoboRally",
	[]
	);

//-----------------------------------------------------------------------------
// 1st Semester - 2nd Bachelor of Science in Engineering (2011-2012)
//-----------------------------------------------------------------------------
addProject("Aurora",
	["Matthias Moulin", "Nathan Moesen", "Pieter Marynissen", "Sebastiaan Maes", "Sophie Marien", "Tom Molderez"],
    "Course: Problem Solving and Design, Part 3 (B-KUL-H01D4B), December 2011",
    "res/Projects/Aurora/Thumbnail.png", 12, 2011,
    "https://github.com/matt77hias/Aurora",
	[new Download("Play", "http://aurora--cwb1.appspot.com/", "res/Icons/icon_html.png"),
	 new Download("Wiki", "http://ariadne.cs.kuleuven.be/mediawiki/index.php/CWB1-1112", "res/Icons/icon_html.png")
	]
	);
	
//-----------------------------------------------------------------------------
// 2nd Semester - 1st Bachelor of Science in Engineering (2010-2011)
//-----------------------------------------------------------------------------
addProject("Crossbow Tennis Machine",
    ["Bart Opsomer", "Ben Praet", "Egon Blyweert", "Frederick Puttemans", "Jeroen Colon", "Joris Panis", "Louis Ponet", "Matthias Moulin", "Nick Berlanger"],
    "Course: Problem Solving and Design, Part 2 (B-KUL-H01C2A), June 2011",
    "res/Projects/CrossbowTennisMachine/Thumbnail.png", 6, 2011,
    "https://matt77hias.github.io/private",
	[]
	);

//-----------------------------------------------------------------------------
// 1st Semester - 1st Bachelor of Science in Engineering (2010-2011)
//-----------------------------------------------------------------------------
addProject("MandeLboat",
	["Ben Allaerts", "Egon Pittoors", "Jef Aendekerk", "Julian Bouckenooghe", "Matthias Moulin", "Robin Clerckx", "Stijn Meylemans", "Wout Behaeghel"],
    "Course: Problem Solving and Design, Part 1 (B-KUL-H01B9A), December 2010",
    "res/Projects/MandeLboat/Thumbnail.png", 12, 2010,
    "https://matt77hias.github.io/private",
	[]
	);
