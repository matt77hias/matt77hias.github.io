var Author = function (name, url) {
    this.fullName         = name;
    this.personalPageLink = url
};

var AuthorMap = {};

function addAuthor(name, url) {
    if (!(AuthorMap.hasOwnProperty(name))) {
        AuthorMap[name] = new Author(name, url)
    }
}

function initializeAuthors() {
    addAuthor("Matthias Moulin"    , "https://matt77hias.github.io/");
	addAuthor("Niels Billen"       , "https://nielsbillen.github.io/");
    addAuthor("Philip Dutr&eacute;", "https://sites.google.com/site/philipdutre/");
	addAuthor("Ruben Pieters"      , "https://rubenpieters.github.io/");
}

function getAuthor(name) {
    if (!AuthorMap.hasOwnProperty(name)) { return new Author(name) }
    else                                 { return AuthorMap[name]  }
}

initializeAuthors();