function constructRecent() {
    var doc = document.getElementById("recent");
	var items = getRecentItems(6);
    for (var i = 0; i < items.length; ++i) {
        var item = items[i];
        var div = document.createElement("div");
        div.className = "recent-container";
        var a = document.createElement("a");
        a.href = item.projectpage;
		var img = document.createElement("img");
        img.className = "recent-thumbnail";
        img.src = item.thumbnail;
        a.appendChild(img);
        div.appendChild(a);
        doc.appendChild(div)
    }
}

constructRecent();