function AppendDownload(acc, download) {
    // Create the division/section for the download.
    var div          = document.createElement("div");
    div.className    = "download";
	acc.appendChild(div);

    // Create the download image hyperref.
    var a_img        = document.createElement("a");
    a_img.href       = download.link;
	div.appendChild(a_img);

    // Create the download image.
    var img          = document.createElement("img");
    img.className    = "download-icon";
    img.src          = download.icon;
	a_img.appendChild(img);

     // Create the download text hyperref.
    var a_txt        = document.createElement("a");
    a_txt.className  = "download-description";
    a_txt.href       = download.link;
    a_txt.innerHTML  = download.description;
    div.appendChild(a_txt);
}

function MakePublicationThumbnailOpacityHandler(image, img1, img2) {
    return function () {
        img1.style.opacity = 1;
        img1.src = image.src;
        img2.style.opacity = 1;
        img2.src = image.src
    }
}

function ConstructPublicationTableForYearForThumbnails(publications, year) {
    var list = document.getElementById("item-list");
    
	var articles = document.createElement("article");
	articles.id = "items-" + year;
	list.appendChild(articles);
    
	var h1 = document.createElement("h1");
    h1.id = "items-" + year;
	articles.appendChild(h1);
    h1.innerHTML = year + '<a class = "to-top-link" href = "#publications">back to the top</a>';
    
	for (var i = 0; i < publications.length; ++i) {
        var publication = publications[i];
        
		var article = document.createElement("article");
        article.className = "item-thumbnail-view container";
		articles.appendChild(article);
		
		if (publication.thumbnail) {
            var aside = document.createElement("aside");
            aside.className = "container-item";
			article.appendChild(aside);
		}
		
		var section = document.createElement("section");
        section.className = "container-item";
		article.appendChild(section); 
		
		if (publication.thumbnail) {
			var a_img1 = document.createElement("a");
            a_img1.href = publication.projectpage;
			aside.appendChild(a_img1);
			var a_img2 = document.createElement("a");
            a_img2.href = publication.projectpage;
			section.appendChild(a_img2);
            
			var img1 = document.createElement("img");
            img1.className = "item-thumbnail large-thumbnail bordered";
			a_img1.appendChild(img1);
			var img2 = document.createElement("img");
            img2.className = "item-inline-thumbnail inline-thumbnail bordered";
			a_img2.appendChild(img2);
            
            var image = new Image();
			image.src = publication.thumbnail;
            image.onload = image.onerror = MakePublicationThumbnailOpacityHandler(image, img1, img2);
        }
        
		var a_title = document.createElement("a");
        a_title.className = "item-title-link";
        a_title.href = publication.projectpage;
		section.appendChild(a_title);
        
		var h3 = document.createElement("h3");
		h3.className = "item-title";
		a_title.appendChild(h3);
		h3.innerHTML = publication.title;

		var h4 = document.createElement("h4");
        h4.className = "item-authors";
        section.appendChild(h4);
        
		for (var j = 0; j < publication.authors.length; ++j) {
            var author = GetAuthor(publication.authors[j]);
            
			if (author.url) { 
				h4.innerHTML += '<a href="' + author.url + '">' + author.name + "</a>";
			}
            else { 
				h4.innerHTML += author.name;
			}
			
            if (j === publication.authors.length - 1) { 
				h4.innerHTML += ".</br>";
			}
            else { 
				h4.innerHTML += ", ";
			}
        }
        
		var p = document.createElement("p");
		p.className = "item-description";
		section.appendChild(p);
        p.innerHTML = publication.citation;
        
		var div = document.createElement("div");
        div.className = "item-links-table";
		section.appendChild(div);
		
		var download = new Download("Publication page", publication.projectpage, "res/Icons/icon-html.png");
        AppendDownload(div, download);
        for (var k = 0; k < publication.downloads.length; ++k) { 
			download = publication.downloads[k];
			AppendDownload(div, download);
		}
    }
}

function ConstructPublicationTableForYearForList(publications, year) {
    var list = document.getElementById("item-list");
    
	var links = document.getElementById("items-" + year);
	list.appendChild(links);
    
	var ul = document.createElement("ul");
	ul.className = "item-list-view";
	list.appendChild(ul);
    
	for (var i = 0; i < publications.length; ++i) {
        var publication = publications[i];
        
		var li = document.createElement("li");
		ul.appendChild(li);
        
		li.innerHTML += '<a href="' + publication.projectpage + '"><h3 class="item-title">' + publication.title + "</h3></a>";
		
		for (var j = 0; j < publication.authors.length; ++j) {
            var author = GetAuthor(publication.authors[j]);
            
			if (author.url) { 
				li.innerHTML += '<a href="' + author.url + '" class="item-authors">' + author.name + "</a>";
			}
            else { 
				li.innerHTML += author.name;
			}
			
            if (j === publication.authors.length - 1) { 
				li.innerHTML += ".</br>";
			}
            else { 
				li.innerHTML += ", ";
			}
        }
		
        li.innerHTML += '<span class="item-description">' + publication.citation + "</span>";
    }
}

function ConstructPublicationTableForThumbnails() {
    var years = GetPublicationYears();
    for (var i = years.length - 1; i >= 0; --i) {
		var year = years[i];
		var publications = GetPublicationsOfYear(year);
        ConstructPublicationTableForYearForThumbnails(publications, year);
    }
}

function ConstructPublicationTableForList() {
    var years = GetPublicationYears();
    for (var i = years.length - 1; i >= 0; --i) {
        var year = years[i];
		var publications = GetPublicationsOfYear(year);
		ConstructPublicationTableForYearForList(publications, year);
    }
}

function ConstructPublicationYearLinks() {
    var years = GetPublicationYears();
    var links = document.getElementById("item-year-links");
    for (var i = years.length - 1; i >= 0; --i) {
		var year = years[i];
		
        links.innerHTML += '<a href = "#items-' + year + '">' + year + "</a>";
        if (i > 0) { links.innerHTML += ", "; }
        else       { links.innerHTML += ".";  }
    }
}

function ShowThumbnails() {
    var ts = document.getElementsByClassName("item-thumbnail-view");
    for (var i = 0; i < ts.length; ++i) {
        ts[i].style.display = "block"
    }
	
    var ls = document.getElementsByClassName("item-list-view");
    for (var j = 0; j < ls.length; ++j) {
        ls[j].style.display = "none"
    }
	
    document.getElementById("thumbnail-view-button").style.opacity = 0.8;
    document.getElementById("list-view-button").style.opacity      = ""
}

function ShowList() {
    var ts = document.getElementsByClassName("item-thumbnail-view");
    for (var i = 0; i < ts.length; ++i) {
        ts[i].style.display = "none"
    }
	
    var ls = document.getElementsByClassName("item-list-view");
    for (var j = 0; j < ls.length; ++j) {
        ls[j].style.display = "block"
    }
	
    document.getElementById("thumbnail-view-button").style.opacity = "";
    document.getElementById("list-view-button").style.opacity      = 0.8
}

ConstructPublicationTableForThumbnails();
ConstructPublicationTableForList();
ConstructPublicationYearLinks();
ShowThumbnails();