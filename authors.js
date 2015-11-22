var Author = function (b, a) {
    this.fullName         = b;
    this.personalPageLink = a
};

var AuthorMap = {};

function addAuthor(b, a) {
    if (!(AuthorMap.hasOwnProperty(b))) {
        AuthorMap[b] = new Author(b, a)
    }
}

function initializeAuthors() {
    addAuthor("Niels Billen"       , "https://perswww.kuleuven.be/~u0093806/");
    addAuthor("Philip Dutré"       , "http://people.cs.kuleuven.be/~philip.dutre/");
    addAuthor("Philip Dutr&eacute;", "http://people.cs.kuleuven.be/~philip.dutre/");
}

function getAuthor(a) {
    if (!AuthorMap.hasOwnProperty(a)) { return new Author(a) }
    else                              { return AuthorMap[a]  }
}

initializeAuthors();