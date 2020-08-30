"use strict";

function ConstructPostTableForYearForList(posts, year)
{
    var list = document.getElementById("item-list");
    
	var articles = document.createElement("article");
	articles.id = "items-" + year;
	list.appendChild(articles);
    
	var h1 = document.createElement("h1");
    h1.id = "items-" + year;
	articles.appendChild(h1);
    h1.innerHTML = year + '<a class = "to-top-url" href = "#blog">back to the top</a>';
    
	var ul = document.createElement("ul");
	ul.className = "item-list-view";
	list.appendChild(ul);
    
	for (var i = 0; i < posts.length; ++i)
	{
        var post = posts[i];
        
		var li = document.createElement("li");
		ul.appendChild(li);
        
		li.innerHTML += '<a href="' + post.url + '"><h3 class="item-title">' + post.title + "</h3></a>";
	
		for (var j = 0; j < post.authors.length; ++j)
		{
            var author = GetAuthor(post.authors[j]);
            
			if (author.url)
			{ 
				li.innerHTML += '<a href="' + author.url + '" class="item-authors">' + author.name + "</a>";
			}
            else
			{ 
				li.innerHTML += author.name;
			}
			
            if (j === post.authors.length - 1)
			{ 
				li.innerHTML += ".</br>";
			}
            else
			{ 
				li.innerHTML += ", ";
			}
        }
		
        li.innerHTML += '<span class="item-description">' + post.description + "</span>";
    }
}

function ConstructPostTableForList()
{
    var years = GetPostYears();
    for (var i = years.length - 1; i >= 0; --i)
	{
        var year  = years[i];
		var posts = GetPostsOfYear(year);
		ConstructPostTableForYearForList(posts, year);
    }
}

function ConstructPostYearLinks()
{
    var years = GetPostYears();
    var urls = document.getElementById("item-year-urls");
    for (var i = years.length - 1; i >= 0; --i)
	{
		var year = years[i];
		
        urls.innerHTML += '<a href = "#items-' + year + '">' + year + "</a>";
        if (i > 0)
		{
			urls.innerHTML += ", ";
		}
        else
		{
			urls.innerHTML += ".";
		}
    }
}

function ShowList()
{
    var ls = document.getElementsByClassName("item-list-view");
    for (var j = 0; j < ls.length; ++j)
	{
        ls[j].style.display = "block"
    }
}

ConstructPostTableForList();
ConstructPostYearLinks();
ShowList();