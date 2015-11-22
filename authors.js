var Author = function (n, l) {
    this.fullName         = n;
    this.personalPageLink = l
};

var AuthorMap = {};

function addAuthor(n, l) {
    if (!(AuthorMap.hasOwnProperty(n))) {
        AuthorMap[n] = new Author(n, l)
    }
}

function initializeAuthors() {
    addAuthor("Niels Billen"       , "https://perswww.kuleuven.be/~u0093806/");
    addAuthor("Philip Dutré"       , "http://people.cs.kuleuven.be/~philip.dutre/");
    addAuthor("Philip Dutr&eacute;", "http://people.cs.kuleuven.be/~philip.dutre/");
}

function getAuthor(n) {
    if (!AuthorMap.hasOwnProperty(n)) { return new Author(n) }
    else                              { return AuthorMap[n]  }
}

initializeAuthors();