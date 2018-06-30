var g_authors = {};

var Author = function (name, url) {
    this.name = name;
    this.url  = url;
};

function AddAuthor(name, url) {
    if (!(g_authors.hasOwnProperty(name))) {
        g_authors[name] = new Author(name, url);
    }
}

function GetAuthor(name) {
    if (!g_authors.hasOwnProperty(name)) {
        return new Author(name);
    }
    else {
        return g_authors[name];
    }
}

function InitializeAuthors() {
    AddAuthor("Matthias Moulin"    , "https://matt77hias.github.io");
    AddAuthor("Niels Billen"       , "https://nielsbillen.github.io");
    AddAuthor("Philip Dutr&eacute;", "https://sites.google.com/site/philipdutre");
    AddAuthor("Ruben Pieters"      , "https://rubenpieters.github.io");
}

InitializeAuthors();