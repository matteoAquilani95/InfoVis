
var dictMovies = [];
var dictEdge = {};
var missHeroes_Movie = {};

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        myFunction(this);
    }
};
xhttp.open("GET", "./Marvel - GraphML.xml", true);
xhttp.send();

function myFunction(xml) {
    var dictHeroes = [];
    var xmlDoc = xml.responseXML;
    var Root = xmlDoc.childNodes[0];
    var Elements = Root.children[2];
    var i;
    var yDist = 60;
    
    // inizializzo dizionario personaggi
    for (i = 0; i < Elements.children.length; i++){
        var Elem = Elements.children[i];
        if (Elem.id == "m0")
            break;
        // Access each of the data values.
        var Name = Elem.children;
        // Write the data to the page.
        dictHeroes.push({ "ID":Elem.id, "Name":Name[1].textContent.toString(), "y":yDist});

        yDist = yDist + 90;
        
    };

    // caricamento link character-movie
    var edges = Elements.getElementsByTagName("edge");
    Object.keys(edges).forEach(function(element, index){
        let array = dictEdge[edges[element].attributes[0].nodeValue];
        if (array == undefined){
            dictEdge[edges[element].attributes[0].nodeValue] = [edges[element].attributes[1].nodeValue]
        }else{
            array.push(edges[element].attributes[1].nodeValue)
        }
    });

    // inizializzo dizionario movie
    for (i = 0; i < Elements.children.length; i++){
        var Elem = Elements.children[i];
        if (Elem.id == "")
            break;
        if (Elem.id.substring(0,1) == "m"){
            // Access each of the data values.
            var Name = Elem.children;
            // Write the data to the page.
            let Heroes = checkEdgeOfMovie(Elem.id);
            dictMovies.push({ "ID":Elem.id, "Name":Name[1].textContent.toString(), "Heroes":Heroes});
            //target.append('h3').attr('id', Elem.id).text(Name[1].textContent.toString());
        }
        
    };

    console.log("Caricamento dati, finito!");

   
    // =================   Creazione dei personaggi nella herolist ===========================
    var defs = d3.select("#heroList").append("defs").attr("id","1");
    var defs2 = d3.select("#heroList").append("defs").attr("id","2");
    //var img_url = function(d){ return "url(#" + d.ID + ")"; }
    function img_url(id){ return "url(#img" + id + ")";}

    defs.selectAll("pattern").data(dictHeroes)
    	.enter()
        .append("pattern")
        .attr("id", function(d){ return "img"+d.ID; })
        .attr("width", 1)
        .attr("height", 1)
        .attr("patternUnits", "objectBoundingBox")
    	.append("image")
    		.attr("x", 0)
    		.attr("y", 0)
    		.attr("width", (radius*2)+4)
            .attr("height", (radius*2)+4)
            .attr("xlink:href", function(d) {
                    return "./media/"+d.Name+".jpg";
            })
    
    defs2.selectAll("pattern").data(dictHeroes)
            .enter()
            .append("pattern")
            .attr("id", function(d){ return "img"+d.ID+"BW"; })
            .attr("width", 1)
            .attr("height", 1)
            .attr("patternUnits", "objectBoundingBox")
            .append("image")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", (radius*2)+4)
                .attr("height", (radius*2)+4)
                .attr("xlink:href", function(d) {
                        return "./media/"+d.Name+"-bw.jpg";
                })

    d3.select("#heroList").append("g").selectAll("circle")
        .data(dictHeroes)
        .enter()
        .append("circle")
        .attr("id", function(d) {return(d.ID)})
        .attr("cx", "60")
        .attr("cy", function(d) {return(d.y)})
        .attr("r", radius)
        .attr("stroke","red")
        //.style("fill", "yellow")
        .style("fill", function(d) { return img_url(d.ID) } )
        .on("mouseover", function(d) {
            div.transition().duration(200).style("opacity", .9);		
            div.html("<strong>"+ d.Name + "</strong><br> Movies Left: " + calculateMovieLeftHero(d.ID,dictEdge[d.ID].length,hero_movie_left[d.ID]))
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 40) + "px");
        })
        .on("mouseout", function() {
            div.transition().duration(500).style("opacity", 0);
        })
        .on("click", function(d){
            let rect = d3.select(".drag-drop");
            if(rect._groups[0][0] != null){
                rect.remove()
            }
            if(calculateMovieLeftHero(d.ID,dictEdge[d.ID].length,hero_movie_left[d.ID]) == 0){
                alert("Hai finito di inserire il personaggio!")
            }else{
                console.log("Hai selezionato: " + d.Name)
                d3.select("#world").append("circle")
                    .attr("id", "selectHero"+d.ID)
                    .attr("class", "drag-drop")
                    .attr("cx", sectionHeroXY[0])
                    .attr("cy", sectionHeroXY[1])
                    .attr("r", radius)
                    //.style("fill", "orange")
                    .style("fill", img_url(d.ID))
                    .on("mouseover", function() {
                        div.transition().duration(200).style("opacity", .9);		
                        div.html("<strong>"+ d.Name + "</strong><br> Movies Left: " + calculateMovieLeftHero(d.ID,dictEdge[d.ID].length,hero_movie_left[d.ID]))
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 40) + "px");
                    })
                    .on("mouseout", function() {
                        div.transition().duration(500).style("opacity", 0);
                    })
                    //.call(drag)
            }
        })


        // ====================== Caricamento dei Movies ===================================
        //var gEllipse = d3.select("#world").append("g")
        var gEllipse = d3.select(".view").append("g")

        defs.append("pattern")
        .attr("id", "img?")
        .attr("width", 1)
        .attr("height", 1)
        .attr("patternUnits", "objectBoundingBox")
    	.append("image")
    		.attr("x", 0)
    		.attr("y", 0)
    		.attr("width", (radius*2)+4)
            .attr("height", (radius*2)+4)
            .attr("xlink:href", function(d) {
                    return "./media/unknown.png";
            })

        let cod = [40,150];
        let down = 0;
        let svgnew = undefined;
        let keys = Object.keys(dimMovie);

        dictMovies.forEach(function(d,i){
            let dim = [];
            keys.forEach(function(value,i){
                if (parseInt(value) == d.Heroes.length)
                    dim = dimMovie[value]["d"]
            });

            let w = dim[0]*2;
            let h = dim[1]*2;

            svgnew = gEllipse.append("svg").attr("width",w).attr("height",h).attr("transform",'translate('+cod+')')
            let ellipse = svgnew.append("ellipse").attr("id", d.ID).attr("class","dropzone")
                .attr("cx", dim[0]).attr("cy", dim[1]).attr("rx", dim[0]).attr("ry", dim[1])
            svgnew.append("text").attr("x",takeDistanceMovieName(dim[0]-(d.Name.length*4),d.Name))
                .attr("y","43").text(d.Name);

            loadHeroFinder(svgnew,ellipse,d.Heroes);

            missHeroes_Movie[""+d.ID] = d.Heroes.length;

            cod[0] = cod[0] + w + 50;
            down++;
            if (down == 3){
                cod[0] = 40;
                cod[1] = cod[1] + (270*2) + 50;
                down = 0;
            }
        });

}

function takeDistanceMovieName(len, name){
    if(name.substring(0,15) == "Captain America")
        len = len + 15;
    if(name.substring(0,9) == "Guardians")
        len = len + 14;
    
    return len;
}

var dimMovie = {
    "2": {
        "d":[180,100],
        "pos":[2]
    },
    "3": {
        "d":[180,100],
        "pos":[3]
    },
    "4":{
        "d":[180,130],
        "pos":[2,2]
    },
    "5":{
        "d":[200,130],
        "pos":[3,2]
    },
    "6":{
        "d":[220,140],
        "pos":[3,3]
    },
    "7":{
        "d":[230,140],
        "pos":[4,3]
    },
    "8":{
        "d":[240,150],
        "pos":[4,4]
    },
    "12":{
        "d":[260,180],
        "pos":[4,5,3]
    },
    "22":{
        "d":[320,260],
        "pos":[3,5,6,5,3]
    },
    "25":{
        "d":[350,270],
        "pos":[4,5,7,5,4]
    }
};

function calculateMovieLeftHero(heroID,movieTot, NumMovie){
    let result = movieTot;
    if(NumMovie != undefined)
        result =  movieTot - NumMovie.length;
    
    if (result == 0){
        d3.select("#selectHero"+heroID).remove();
        d3.select("#"+heroID).attr("stroke",null).style("fill",img_urlBW(heroID));
    }
    
    return result;
}

function img_urlBW(id){return "url(#img" + id + "BW)";}

function play(song) {
    var audio = document.getElementById("audio");
    audio.src = song;
    audio.play();
}

function checkEdgeOfMovie(movie){
    //let sum = 0;
    let heroes = [];
    Object.keys(dictEdge).forEach(function(elem){
        let ar = dictEdge[elem];
        if(ar.includes(movie)){
            //sum+=1;
            heroes.push(elem);
        }
    });
    return heroes;
}

function loadHeroFinder(svg, ellipse, heroes){
    let x;
    let j = 0;
    let off = 5;
    let pos = dimMovie[heroes.length]["pos"];
    let righe = pos.length;
    let y = ((righe-1)*radius) + ((righe/2)*off) - 20;
    
    pos.forEach(function(d,i){
        x = ((d-1)*radius) + ((d/2)*off);
        //creo il primo cerchio
        buildHeroFinder(svg,ellipse,x,y,heroes[j])
        j++;
        for(let i = 1; i<d; i++){
            x = x - ((2*radius)+off);
            buildHeroFinder(svg,ellipse,x,y,heroes[j]);
            j++;
        }

        y = y - ((2*radius)+off);
    });
}

function buildHeroFinder(svg,ellipse,x,y,heroID){
        let movieID = ellipse._groups[0][0].attributes["id"].nodeValue;
        svg.append("circle")
        .attr("id", heroID + "_" + movieID)
        .attr("class", "missHero")
        .attr("cx", (parseInt(ellipse._groups[0][0].attributes["cx"].nodeValue)) - x)
        .attr("cy", (parseInt(ellipse._groups[0][0].attributes["cy"].nodeValue)) - y)
        .attr("r", radius)
        //.style("fill", "black")
        .style("fill", "url(#img?)")
        .on("click", function(){revealHero(this, heroID, movieID)})
}

function revealHero(heroR, heroID, movieID) {
    //console.log(d3.select(heroR).style("fill"))
    if(confirm("Vuoi davvero sapere chi è? (costa 200 punti)")){
        cheatHero(movieID, heroID);
        d3.select(heroR).attr("class","appostHero").style("fill", img_url(heroID))
    }
}