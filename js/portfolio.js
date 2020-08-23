"use strict";

var g_authors = {};

var g_posts_by_year        = {};
var g_projects_by_year     = {};
var g_publications_by_year = {};

var g_items_by_date        = [];
var g_items_by_date_sorted = true;

function GetIconFromLink(link)
{
    var extension = link.split(".").pop();

    if      (extension === "pdf")                                                                                             { return "res/Icons/icon-pdf.png";     }
    else if (extension === "bib" || extension === "tex")                                                                      { return "res/Icons/icon-tex.png";     }
    else if (extension === "html")                                                                                            { return "res/Icons/icon-html.png";    }
    else if (extension === "txt")                                                                                             { return "res/Icons/icon-txt.png";     }
    else if (extension === "zip" || extension === "rar")                                                                      { return "res/Icons/icon-zip.png";     }
    else if (extension === "mov" || extension === "mp4" || extension === "avi" || extension === "mkv" || extension === "wmv") { return "res/Icons/icon-video.png";   }
    else if (extension === "ppt" || extension === "pptx")                                                                     { return "res/Icons/icon-ppt.png";     }
    else                                                                                                                      { return "res/Icons/icon-unknown.png"; }
}

var Author = function (name, url)
{
    this.name = name;
    this.url  = url;
};

var Download = function (description, link, icon)
{
    this.description = description;
    this.link        = link;
    this.icon        = (icon) ? icon : GetIconFromLink(link);
};

var Post = function (title, authors, description, month, year, url)
{
    this.title       = title;
    this.authors     = authors;
    this.description = description;
    this.month       = month;
    this.year        = year;
    this.url         = url;
};

var Project = function (title, authors, description, thumbnail, month, year, url, downloads)
{
    this.title       = title;
    this.authors     = authors;
    this.description = description;
    this.thumbnail   = thumbnail;
    this.month       = month;
    this.year        = year;
    this.url         = url;
    this.downloads   = downloads;
};

var Publication = function (title, authors, description, thumbnail, month, year, url, downloads)
{
    this.title       = title;
    this.authors     = authors;
    this.description = description;
    this.thumbnail   = thumbnail;
    this.month       = month;
    this.year        = year;
    this.url = url;
    this.downloads   = downloads;
};

function AddItem(item, year)
{
    g_items_by_date.push(item);
    g_items_by_date_sorted = false;
}

function AddPost(post, year)
{
    if (!g_posts_by_year.hasOwnProperty(year))
	{
        g_posts_by_year[year] = [];
    }

    g_posts_by_year[year].push(post);
}

function AddProject(project, year)
{
    if (!g_projects_by_year.hasOwnProperty(year))
	{
        g_projects_by_year[year] = [];
    }

    g_projects_by_year[year].push(project);

    AddItem(project, year);
}

function AddPublication(publication, year)
{
    if (!g_publications_by_year.hasOwnProperty(year))
	{
        g_publications_by_year[year] = [];
    }

    g_publications_by_year[year].push(publication);
	
    AddItem(publication, year);
}

function CreateAuthor(name, url)
{
    if (!(g_authors.hasOwnProperty(name)))
	{
        g_authors[name] = new Author(name, url);
    }
}

function CreatePost(title, authors, description, month, year, url)
{
    var post = new Post(title, authors, description, month, year, url);
    AddPost(post, year);
}

function CreateProject(title, authors, description, thumbnail, month, year, url, downloads)
{
    var project = new Project(title, authors, description, thumbnail, month, year, url, downloads);
    AddProject(project, year);
}

function CreatePublication(title, authors, description, thumbnail, month, year, url, downloads)
{
    var publication = new Publication(title, authors, description, thumbnail, month, year, url, downloads);
    AddPublication(publication, year);
}

function GetAuthor(name)
{
    if (!g_authors.hasOwnProperty(name))
	{
        return new Author(name);
    }
    else
	{
        return g_authors[name];
    }
}

function GetDataOfYear(map, year)
{
    if (map.hasOwnProperty(year))
	{
        var data = map[year];

        data.sort(function (lhs, rhs)
		{
            return rhs.month - lhs.month;
        });

        return data;
    }
    else
	{
        return [];
    }
}

function GetPostsOfYear(year)
{
    return GetDataOfYear(g_posts_by_year, year);
}

function GetProjectsOfYear(year)
{
    return GetDataOfYear(g_projects_by_year, year);
}

function GetPublicationsOfYear(year)
{
    return GetDataOfYear(g_publications_by_year, year);
}

function GetDataYears(map)
{
	var years = Object.keys(map);
	years.sort();
	return years;
}

function GetPostYears()
{
	return GetDataYears(g_posts_by_year);
}

function GetProjectYears()
{
	return GetDataYears(g_projects_by_year);
}

function GetPublicationYears()
{
	return GetDataYears(g_publications_by_year);
}

function SortItems(list)
{
    list.sort(function (lhs, rhs)
	{
        if      (lhs.year  < rhs.year)  { return  1; }
        else if (lhs.year  > rhs.year)  { return -1; }
        else if (lhs.month < rhs.month) { return  1; }
        else if (lhs.month > rhs.month) { return -1; }
        else return rhs.title.localeCompare(lhs.title);
    });
}

function GetRecentItems(count)
{
    if (false === g_items_by_date_sorted)
	{
        SortItems(g_items_by_date);
        g_items_by_date_sorted = true;
    }
	
	var recent = [];
    for (var i = 0; i < Math.min(count, g_items_by_date.length); ++i)
	{
        recent.push(g_items_by_date[i]);
    }
	
    return recent;
}

//-----------------------------------------------------------------------------
// Authors
//-----------------------------------------------------------------------------

CreateAuthor("Matthias Moulin"    , "https://matt77hias.github.io");
CreateAuthor("Niels Billen"       , "https://nielsbillen.github.io");
CreateAuthor("Philip Dutr&eacute;", "https://sites.google.com/site/philipdutre");
CreateAuthor("Ruben Pieters"      , "https://rubenpieters.github.io");

//-----------------------------------------------------------------------------
// Posts
//-----------------------------------------------------------------------------
CreatePost("MAGE: Asserts",
    ["Matthias Moulin"],
    "August 2018", 8, 2020,
    "https://matt77hias.github.io/blog/2020/08/25/mage-asserts.html");

CreatePost("Closure",
    ["Matthias Moulin"],
    "August 2018", 8, 2020,
    "https://matt77hias.github.io/blog/2020/08/24/closure.html");

CreatePost("Voxel Cone Tracing",
    ["Matthias Moulin"],
    "August 2018", 8, 2018,
    "https://matt77hias.github.io/blog/2018/08/19/voxel-cone-tracing.html");

CreatePost("The Constructible Array",
    ["Matthias Moulin"],
    "August 2018", 8, 2018,
    "https://matt77hias.github.io/blog/2018/08/08/the-constructible-array.html");

CreatePost("Linear, Gamma and sRGB Color Spaces",
    ["Matthias Moulin"],
    "July 2018", 7, 2018,
    "https://matt77hias.github.io/blog/2018/07/01/linear-gamma-and-sRGB-color-spaces.html");
	
CreatePost("Candidate Partitions of Hierarchical Acceleration Data Structures for Ray Tracing",
    ["Matthias Moulin"],
    "February 2018", 2, 2018,
    "https://matt77hias.github.io/blog/2018/02/04/candidate-partitions-of-hierarchical-acceleration-data-structures-for-ray-tracing.html");
	
CreatePost("The Universal Pointer",
    ["Matthias Moulin"],
    "January 2018", 1, 2018,
    "https://matt77hias.github.io/blog/2018/01/28/the-universal-pointer.html");
	
CreatePost("C++ Wishlist",
    ["Matthias Moulin"],
    "January 2018", 1, 2018,
    "https://matt77hias.github.io/blog/2018/01/27/cpp-wishlist.html");
	
CreatePost("NDC to Projection to Camera Space",
    ["Matthias Moulin"],
    "October 2017", 10, 2017,
    "https://matt77hias.github.io/blog/2017/10/19/ndc-to-projection-to-view-space.html");
	
CreatePost("Reducing Shader Binding Dependencies",
    ["Matthias Moulin"],
    "September 2017", 9, 2017,
    "https://matt77hias.github.io/blog/2017/09/07/reducing-shader-binding-dependencies.html");
	
CreatePost("Creating a View Frustum in Local/World/Camera Space using SIMD",
    ["Matthias Moulin"],
    "August 2017", 8, 2017,
    "https://matt77hias.github.io/blog/2017/08/24/creating-a-view-frustum.html");

//-----------------------------------------------------------------------------
// Publications
//-----------------------------------------------------------------------------
CreatePublication("On the Use of Local Ray Termination for Efficiently Constructing Qualitative BSPs, BIHs and (S)BVHs",
    ["Matthias Moulin", "Philip Dutr&eacute;"],
    "The Visual Computer, Volume 35, Issue 12, December 2019 (First online: July 2018)",
    "res/Publications/Moulin2018-1/Thumbnail.png", 7, 2018,
    "res/Publications/Moulin2018-1/Publication.html",
    [
		new Download("Preprint",      "pdf.js/web/viewer.html?file=%2F../../res/Publications/Moulin2018-1/Preprint.pdf",                      undefined),
		new Download("Citation",      "res/Publications/Moulin2018-1/Citation.bib",                                                           undefined),
		new Download("Abstract",      "res/Publications/Moulin2018-1/Abstract.txt",                                                           undefined),
		new Download("Supplementary Material (1/2)", "pdf.js/web/viewer.html?file=%2F../../res/Publications/Moulin2018-1/Supplementary1.pdf", undefined),
		new Download("Supplementary Material (2/2)", "pdf.js/web/viewer.html?file=%2F../../res/Publications/Moulin2018-1/Supplementary2.pdf", undefined),
		new Download("DOI",           "https://doi.org/10.1007/s00371-018-1575-x",                                            "res/Icons/icon-html.png"),
		new Download("Lirias",        "https://lirias.kuleuven.be/handle/123456789/625753",                                   "res/Icons/icon-html.png")
    ]);

CreatePublication("Hybrid Kd-trees for Photon Mapping and Accelerating Ray Tracing",
    ["Matthias Moulin"],
    "Master's thesis, Department of Computer Science, KU Leuven, Belgium, June 2015",
    "res/Publications/Moulin2015-2/Thumbnail.png", 6, 2015,
    "res/Publications/Moulin2015-2/Publication.html",
    [
		new Download("Dissertation",  "pdf.js/web/viewer.html?file=%2F../../res/Publications/Moulin2015-2/Dissertation.pdf", undefined),
		new Download("Citation",      "res/Publications/Moulin2015-2/Citation.bib",                                          undefined),
		new Download("Abstract",      "res/Publications/Moulin2015-2/Abstract.txt",                                          undefined),
		new Download("Abstract (NL)", "res/Publications/Moulin2015-2/Abstract_NL.txt",                                       undefined),
		new Download("Presentation",  "pdf.js/web/viewer.html?file=%2F../../res/Publications/Moulin2015-2/Presentation.pdf", undefined),
		new Download("Poster",        "pdf.js/web/viewer.html?file=%2F../../res/Publications/Moulin2015-2/Poster.pdf",       undefined)
    ]);

CreatePublication("Efficient Visibility Heuristics for kd-trees Using the RTSAH",
    ["Matthias Moulin", "Niels Billen", "Philip Dutr&eacute;"],
    "Eurographics Symposium on Rendering - Experimental Ideas & Implementations, June 2015",
    "res/Publications/Moulin2015-1/Thumbnail.png", 6, 2015,
    "res/Publications/Moulin2015-1/Publication.html",
    [
		new Download("Preprint",      "pdf.js/web/viewer.html?file=%2F../../res/Publications/Moulin2015-1/Preprint.pdf",     undefined),
		new Download("Citation",      "res/Publications/Moulin2015-1/Citation.bib",                                          undefined),
		new Download("Abstract",      "res/Publications/Moulin2015-1/Abstract.txt",                                          undefined),
		new Download("Presentation",  "pdf.js/web/viewer.html?file=%2F../../res/Publications/Moulin2015-1/Presentation.pdf", undefined),
		new Download("Poster",        "pdf.js/web/viewer.html?file=%2F../../res/Publications/Moulin2015-1/Poster.pdf",       undefined),
		new Download("DOI",           "https://dx.doi.org/10.2312/sre.20151164",                             "res/Icons/icon-html.png"),
		new Download("Lirias",        "https://lirias.kuleuven.be/handle/123456789/501514",                  "res/Icons/icon-html.png")
	]);

//-----------------------------------------------------------------------------
// Projects
//-----------------------------------------------------------------------------
	
//-----------------------------------------------------------------------------
// 2nd Semester - 2nd PhD of Science in Engineering (2016-2017)
//-----------------------------------------------------------------------------
CreateProject("MAGE",
    ["Matthias Moulin"],
    "January 2017",
    "res/Projects/MAGE/Thumbnail.png", 1, 2017,
    "https://github.com/matt77hias/MAGE",
	[
		new Download("Assets",        "https://github.com/matt77hias/MAGE-Assets",     "res/Icons/icon-html.png"),
		new Download("Code",          "https://github.com/matt77hias/MAGE",            "res/Icons/icon-html.png"),
		new Download("Documentation", "https://github.com/matt77hias/MAGE-Doc",        "res/Icons/icon-html.png"),
		new Download("Font Utility",  "https://github.com/matt77hias/MAGE-SpriteFont", "res/Icons/icon-html.png"),
		new Download("Meta",          "https://github.com/matt77hias/MAGE-Meta",       "res/Icons/icon-html.png")
	]);

//-----------------------------------------------------------------------------
// 1st Semester - 2nd PhD of Science in Engineering (2016-2017)
//-----------------------------------------------------------------------------
CreateProject("Monte Carlo Integration Techniques",
    ["Matthias Moulin"],
    "October 2016",
    "res/Projects/MC/Thumbnail.png", 10, 2016,
    "https://github.com/matt77hias/MCExperiments",
	[
		new Download("Supplementary Notes", "https://github.com/matt77hias/MC/blob/master/MC.pdf", "res/Icons/icon-pdf.png"),
		new Download("Supplementary Notes", "https://github.com/matt77hias/MC",                    "res/Icons/icon-html.png")
	]);

CreateProject("fibpy",
    ["Matthias Moulin"],
    "October 2016",
    "res/Projects/fibpy/Thumbnail.png", 10, 2016,
    "https://github.com/matt77hias/fibpy",
	[]);

CreateProject("pippy",
    ["Matthias Moulin"],
    "October 2016",
    "res/Projects/pippy/Thumbnail.png", 10, 2016,
    "https://github.com/matt77hias/pippy",
	[]);
	
//-----------------------------------------------------------------------------
// 2nd Semester - 1st PhD of Science in Engineering (2015-2016)
//-----------------------------------------------------------------------------
CreateProject("Rosetta smallpt",
    ["Matthias Moulin"],
    "September 2016",
    "res/Projects/smallpt/Thumbnail.png", 9, 2016,
    "https://github.com/matt77hias/smallpt",
	[
		new Download("C",                  "https://github.com/matt77hias/c-smallpt",      "res/Icons/icon-html.png"),
		new Download("C++",                "https://github.com/matt77hias/cpp-smallpt",    "res/Icons/icon-html.png"),
		new Download("C#",                 "https://github.com/matt77hias/cs-smallpt",     "res/Icons/icon-html.png"),
		new Download("CoffeeScript",       "https://github.com/matt77hias/coffee-smallpt", "res/Icons/icon-html.png"),
		new Download("CUDA",               "https://github.com/matt77hias/cu-smallpt",     "res/Icons/icon-html.png"),
		new Download("Erlang",             "https://github.com/matt77hias/erl-smallpt",    "res/Icons/icon-html.png"),
		new Download("GLSL",               "https://www.shadertoy.com/view/MlcczX",        "res/Icons/icon-html.png"),
		new Download("Haskell",            "https://github.com/matt77hias/hs-smallpt",     "res/Icons/icon-html.png"),
		new Download("Java",               "https://github.com/matt77hias/java-smallpt",   "res/Icons/icon-html.png"),
		new Download("JavaScript",         "https://github.com/matt77hias/js-smallpt",     "res/Icons/icon-html.png"),
		new Download("J#",                 "https://github.com/matt77hias/jsl-smallpt",    "res/Icons/icon-html.png"),
		new Download("Prolog",             "https://github.com/matt77hias/pl-smallpt",     "res/Icons/icon-html.png"),
		new Download("Python 2.7",         "https://github.com/matt77hias/py-smallpt",     "res/Icons/icon-html.png"),
		new Download("Python 3.5",         "https://github.com/matt77hias/py-smallpt",     "res/Icons/icon-html.png"),
		new Download("Python 2.7 + NumPy", "https://github.com/matt77hias/numpy-smallpt",  "res/Icons/icon-html.png"),
		new Download("Python 3.5 + NumPy", "https://github.com/matt77hias/numpy-smallpt",  "res/Icons/icon-html.png"),
		new Download("Racket",             "https://github.com/matt77hias/rkt-smallpt",    "res/Icons/icon-html.png"),
		new Download("TypeScript",         "https://github.com/matt77hias/ts-smallpt",     "res/Icons/icon-html.png")
	]);
	
//-----------------------------------------------------------------------------
// 1st Semester - 1st PhD of Science in Engineering (2015-2016)
//-----------------------------------------------------------------------------
CreateProject("pbrtpy",
    ["Matthias Moulin"],
    "December 2015",
    "res/Projects/pbrtpy/Thumbnail.png", 12, 2015,
    "https://github.com/matt77hias/pbrtpy",
	[]);

CreateProject("FalseColor Visualization",
    ["Matthias Moulin"],
    "November 2015",
    "res/Projects/FalseColor/Thumbnail.png", 11, 2015,
    "https://github.com/matt77hias/FalseColor",
	[]);
	
CreateProject("Clipping",
    ["Matthias Moulin"],
    "November 2015",
    "res/Projects/Clipping/Thumbnail.png", 11, 2015,
    "https://github.com/matt77hias/Clipping",
	[]);

//-----------------------------------------------------------------------------
// 2nd Semester - 2nd Master of Science in Engineering (2014-2015)
//-----------------------------------------------------------------------------
CreateProject("Hybrid Survivor",
    ["Matthias Moulin", "Milan Samyn", "Samuel Lannoy"],
    "Course: Capita Selecta Computer Science: Human Machine Communication: Game Design <a href='https://onderwijsaanbod.kuleuven.be/syllabi/v/e/H05N2AE.htm'>(B-KUL-H05N2A)</a>, June 2015",
    "res/Projects/HybridSurvivor/Thumbnail.png", 6, 2015,
    "https://github.com/matt77hias/HybridSurvivor",
	[
		new Download("Oculus Rift", "https://github.com/matt77hias/HybridSurvivor-OculusRift", "res/Icons/icon-html.png"),
		new Download("HTC Vive",    "https://github.com/matt77hias/HybridSurvivor-PC",         "res/Icons/icon-html.png"),
		new Download("PC & Web",    "https://github.com/matt77hias/HybridSurvivor-HTCVive",    "res/Icons/icon-html.png")
	]);

CreateProject("Stochastic Experiments",
    ["Matthias Moulin"],
    "Course: Deterministic and Stochastic Integration Techniques <a href='https://onderwijsaanbod.kuleuven.be/syllabi/v/e/H03G3BE.htm'>(B-KUL-H03G3B)</a>, May 2015",
    "res/Projects/StochasticExperiments/Thumbnail.png", 5, 2015,
    "https://github.com/matt77hias/StochasticExperiments",
	[]);

CreateProject("Quadrature Experiments",
    ["Matthias Moulin"],
    "Course: Deterministic and Stochastic Integration Techniques <a href='https://onderwijsaanbod.kuleuven.be/syllabi/v/e/H03G3BE.htm'>(B-KUL-H03G3B)</a>, May 2015",
    "res/Projects/QuadratureExperiments/Thumbnail.png", 5, 2015,
    "https://github.com/matt77hias/QuadratureExperiments",
	[]);

//-----------------------------------------------------------------------------
// 1st Semester - 2nd Master of Science in Engineering (2014-2015)
//-----------------------------------------------------------------------------
CreateProject("Kajiya",
    ["Matthias Moulin", "Mattias Buelens"],
    "Course: Requirements Analysis for Complex Software Systems <a href='https://onderwijsaanbod.kuleuven.be/syllabi/v/e/G0K32AE.htm'>(B-KUL-G0K32A)</a>, December 2014",
    "res/Projects/Kajiya/Thumbnail.png", 12, 2014,
    "https://matt77hias.github.io/404.html",
	[]);

CreateProject("Fingerprint Compression",
    ["Matthias Moulin"],
    "Course: Wavelets <a href='https://onderwijsaanbod.kuleuven.be/syllabi/e/H03F7AE.htm'>(B-KUL-H03F7A)</a>, December 2014",
    "res/Projects/FingerprintCompression/Thumbnail.png", 12, 2014,
    "https://github.com/matt77hias/FingerprintCompression",
	[]);

CreateProject("Tron",
    ["Matthias Moulin"],
    "Course: Comparative Programming Languages <a href='https://onderwijsaanbod.kuleuven.be/syllabi/v/e/H04L5AE.htm'>(B-KUL-H04L5A)</a>, December 2014",
    "res/Projects/Tron/Thumbnail.png", 12, 2014,
    "https://github.com/matt77hias/Tron",
	[
		new Download("Play", "http://matt77hias.github.io/Tron/", "res/Icons/icon-html.png")
	]);

CreateProject("2048",
    ["Matthias Moulin"],
    "Course: Comparative Programming Languages <a href='https://onderwijsaanbod.kuleuven.be/syllabi/v/e/H04L5AE.htm'>(B-KUL-H04L5A)</a>, December 2014",
    "res/Projects/2048/Thumbnail.png", 12, 2014,
    "https://github.com/matt77hias/2048",
	[]);

//-----------------------------------------------------------------------------
// 2nd Semester - 1st Master of Science in Engineering (2013-2014)
//-----------------------------------------------------------------------------
CreateProject("Incisor Segmentation",
    ["Matthias Moulin", "Milan Samyn"],
    "Course: Computer Vision <a href='https://onderwijsaanbod.kuleuven.be/syllabi/e/H02A5AE.htm'>(B-KUL-H02A5A)</a>, June 2014",
    "res/Projects/IncisorSegmentation/Thumbnail.png", 6, 2014,
    "https://github.com/matt77hias/IncisorSegmentation",
	[]);
	
CreateProject("FrigoShare",
    ["Herbert Beraldo", "Matthias Moulin", "Ruben Pieters"],
    "Course: User Interfaces <a href='https://onderwijsaanbod.kuleuven.be/syllabi/v/e/H04I2AE.htm'>(B-KUL-H04I2A)</a>, June 2014",
    "res/Projects/FrigoShare/Thumbnail.png", 6, 2014,
    "https://anarchikul.wordpress.com/",
	[
		new Download("Play", "https://play.google.com/store/apps/details?id=com.frigoshare", "res/Icons/icon-html.png"), 
		new Download("Code", "https://github.com/matt77hias/FrigoShare",                     "res/Icons/icon-html.png")
	]);

CreateProject("ReMeS: Remote Measurement, Monitoring and Control System",
    ["Matthias Moulin", "Ruben Pieters"],
    "Course: Software Architecture <a href='https://onderwijsaanbod.kuleuven.be/syllabi/e/H07Z9AE.htm'>(B-KUL-H07Z9A)</a>, June 2014",
    "res/No Image.jpg", 6, 2014,
    "https://matt77hias.github.io/404.html",
	[]);
	
CreateProject("Sampling Experiments",
    ["Matthias Moulin"],
    "Course: Computer Graphics II <a href='https://onderwijsaanbod.kuleuven.be/syllabi/v/e/G0B36AE.htm'>(B-KUL-G0B36A)</a>, April 2014",
    "res/Projects/SamplingExperiments/Thumbnail.png", 4, 2014,
    "https://matt77hias.github.io/404.html",
	[]);
	
CreateProject("Face Recognition",
    ["Matthias Moulin"],
    "Course: Computer Vision <a href='https://onderwijsaanbod.kuleuven.be/syllabi/e/H02A5AE.htm'>(B-KUL-H02A5A)</a>, March 2014",
    "res/Projects/FaceRecognition/Thumbnail.png", 3, 2014,
    "https://github.com/matt77hias/FaceRecognition",
	[]);
	
CreateProject("Segmentation",
    ["Matthias Moulin"],
    "Course: Computer Vision <a href='https://onderwijsaanbod.kuleuven.be/syllabi/e/H02A5AE.htm'>(B-KUL-H02A5A)</a>, March 2014",
    "res/Projects/Segmentation/Thumbnail.png", 3, 2014,
    "https://github.com/matt77hias/Segmentation",
	[]);
	
CreateProject("Smoothing",
    ["Matthias Moulin"],
    "Course: Computer Vision <a href='https://onderwijsaanbod.kuleuven.be/syllabi/e/H02A5AE.htm'>(B-KUL-H02A5A)</a>, March 2014",
    "res/Projects/Smoothing/Thumbnail.png", 3, 2014,
    "https://github.com/matt77hias/Smoothing",
	[]);

//-----------------------------------------------------------------------------
// 1st Semester - 1st Master of Science in Engineering (2013-2014)
//-----------------------------------------------------------------------------
CreateProject("Pacman",
    ["Matthias Moulin", "Ruben Pieters"],
    "Course: Modelling of Complex Systems <a href='https://onderwijsaanbod.kuleuven.be/syllabi/e/H0N05AE.htm'>(B-KUL-H0N05A)</a>, December 2013",
    "res/Projects/Pacman/Thumbnail.png", 12, 2013,
    "https://matt77hias.github.io/404.html",
	[]);

CreateProject("Lilyhammer Rendering Engine",
    ["Matthias Moulin"],
    "Course: Computer Graphics I <a href='https://onderwijsaanbod.kuleuven.be/syllabi/v/e/G0Q66BE.htm'>(B-KUL-G0Q66B)</a>, December 2013",
    "res/Projects/LilyhammerRenderingEngine/Thumbnail.png", 12, 2013,
    "res/Projects/LilyhammerRenderingEngine/Project.html",
	[]);

CreateProject("JUnit Test Deamon",
    ["Matthias Moulin", "Mattias Buelens", "Ruben Pieters", "Vital D'haveloose"],
    "Course: Design of Software Systems <a href='https://onderwijsaanbod.kuleuven.be/syllabi/v/e/H04J9BE.htm'>(B-KUL-H04J9B)</a>, December 2013",
    "res/Projects/JUnitTestDeamon/Thumbnail.png", 12, 2013,
    "https://github.com/matt77hias/junit",
	[]);

CreateProject("Car Rental Agency",
    ["Matthias Moulin", "Ruben Pieters"],
    "Course: Distributed Systems <a href='https://onderwijsaanbod.kuleuven.be/syllabi/v/e/H04I4AE.htm'>(B-KUL-H04I4A)</a>, December 2013",
    "res/No Image.jpg", 12, 2013,
    "https://github.com/matt77hias/CarRental-Meta",
	[
		new Download("Java RMI 1", "https://github.com/matt77hias/JavaRMI1", "res/Icons/icon-html.png"),
		new Download("Java RMI 2", "https://github.com/matt77hias/JavaRMI2", "res/Icons/icon-html.png"),
		new Download("Java EE",    "https://github.com/matt77hias/JavaEE",   "res/Icons/icon-html.png"),
		new Download("Java GAE",   "https://github.com/matt77hias/JavaGAE",  "res/Icons/icon-html.png")
	]);
	
CreateProject("Synchronization Experiments",
    ["Matthias Moulin"],
    "Course: Operating Systems <a href='https://onderwijsaanbod.kuleuven.be/syllabi/v/e/H04G1BE.htm'>(B-KUL-H04G1B)</a>, November 2013",
    "res/Projects/SynchronizationExperiments/Thumbnail.png", 11, 2013,
    "https://github.com/matt77hias/JavaSyncExperiments",
	[]);

//-----------------------------------------------------------------------------
// Holiday (2013)
//-----------------------------------------------------------------------------
CreateProject("Snake",
    ["Matthias Moulin"],
    "August 2013",
    "res/Projects/Snake/Thumbnail.png", 8, 2013,
    "https://github.com/matt77hias/Snake",
	[]);
	
//-----------------------------------------------------------------------------
// 1st + 2nd Semester - 3th Bachelor of Science in Engineering (2012-2013)
//-----------------------------------------------------------------------------
CreateProject("MazeStormer",
    ["Dennis Frett", "Matthias Moulin", "Mattias Buelens", "Stijn Hoskens", "Vital D'haveloose", "Stijn Hoskens"],
    "Course: Problem Solving and Design: Computer Science <a href='https://onderwijsaanbod.kuleuven.be/syllabi/v/e/H01Q3CE.htm'>(B-KUL-H01Q3C)</a>, June 2013",
    "res/Projects/MazeStormer/Thumbnail.png", 6, 2013,
    "https://github.com/matt77hias/MazeStormer",
	[
		new Download("Demo 1", "https://www.youtube.com/watch?v=PkklxX5FeSE", "res/Icons/icon-html.png"), 
		new Download("Demo 2", "https://www.youtube.com/watch?v=WiFAeo-Ifsk", "res/Icons/icon-html.png")
	]);
	
//-----------------------------------------------------------------------------
// 2nd Semester - 3th Bachelor of Science in Engineering (2012-2013)
//-----------------------------------------------------------------------------
CreateProject("Network Simulation, Part 2",
    ["Matthias Moulin"],
    "Course: Computer Networks <a href='https://onderwijsaanbod.kuleuven.be/syllabi/e/G0Q43AE.htm'>(B-KUL-G0Q43A)</a>, April 2013",
    "res/Projects/NetworkSimulation2/Thumbnail.png", 4, 2013,
    "https://github.com/matt77hias/NS2",
	[]);
	
CreateProject("Network Simulation, Part 1",
    ["Matthias Moulin"],
    "Course: Computer Networks <a href='https://onderwijsaanbod.kuleuven.be/syllabi/e/G0Q43AE.htm'>(B-KUL-G0Q43A)</a>, April 2013",
    "res/Projects/NetworkSimulation1/Thumbnail.png", 4, 2013,
    "https://github.com/matt77hias/NS1",
	[]);
	
CreateProject("Socket Experiments",
    ["Matthias Moulin", "Ruben Pieters"],
    "Course: Computer Networks <a href='https://onderwijsaanbod.kuleuven.be/syllabi/e/G0Q43AE.htm'>(B-KUL-G0Q43A)</a>, April 2013",
    "res/Projects/SocketExperiments/Thumbnail.png", 4, 2013,
    "https://github.com/matt77hias/JavaSocketExperiments",
	[]);
	
//-----------------------------------------------------------------------------
// 1st Semester - 3th Bachelor of Science in Engineering (2012-2013)
//-----------------------------------------------------------------------------
CreateProject("MIPS Samples",
    ["Matthias Moulin"],
    "Course: Computer Architecture and System Software <a href='https://onderwijsaanbod.kuleuven.be/syllabi/v/e/H01P5AE.htm'>(B-KUL-H01P5A)</a>, December 2012",
    "res/Projects/MIPSSamples/Thumbnail.png", 12, 2012,
    "https://github.com/matt77hias/MIPSSamples",
	[]);

//-----------------------------------------------------------------------------
// 2nd Semester - 2nd Bachelor of Science in Engineering (2011-2012)
//-----------------------------------------------------------------------------
CreateProject("RoboRally",
    ["Matthias Moulin", "Ruben Pieters"],
    "Course: Object Oriented Programming <a href='https://onderwijsaanbod.kuleuven.be/syllabi/v/e/H01P1AE.htm'>(B-KUL-H01P1A)</a>, June 2012",
    "res/Projects/RoboRally/Thumbnail.png", 6, 2012,
    "https://github.com/matt77hias/RoboRally",
	[]);

//-----------------------------------------------------------------------------
// 1st Semester - 2nd Bachelor of Science in Engineering (2011-2012)
//-----------------------------------------------------------------------------
CreateProject("Aurora",
	["Matthias Moulin", "Nathan Moesen", "Pieter Marynissen", "Sebastiaan Maes", "Sophie Marien", "Tom Molderez"],
	"Course: Problem Solving and Design, Part 3 <a href='https://onderwijsaanbod.kuleuven.be/syllabi/v/e/H01D4BE.htm'>(B-KUL-H01D4B)</a>, December 2011",
    "res/Projects/Aurora/Thumbnail.png", 12, 2011,
    "https://github.com/matt77hias/Aurora",
	[
		new Download("Play", "https://aurora--cwb1.appspot.com/",                           "res/Icons/icon-html.png"),
		new Download("Wiki", "http://ariadne.cs.kuleuven.be/mediawiki/index.php/CWB1-1112", "res/Icons/icon-html.png")
	]);
