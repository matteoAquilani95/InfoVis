//create 50 circles of radius 20
//specify centre points randomly through the map function

var hero = "null";
var sectionHeroXY = [55,65];

dictTemp = { "h0": ["m1"], "h1":["m1","m2"]}

var drag =  d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

var radius = 40;

/*var circle_data = d3.range(6).map(function(d,i) {
    return{
        id : "h" + i,
        x : Math.round(Math.random() * (120 - radius*2 ) + radius + 10),
        y : Math.round(Math.random() * (700 - radius*2 ) + radius + 22)
    }; 
});*/
var dist = [70,160,250,340,430,520,610,700,790,870,960,1050];
var circle_data = d3.range(6).map(function(d,i) {
    return{
        id : "h" + i,
        x : 60,
        y : dist[i]
    }; 
});

var g = d3.select("#world").append("g").attr("id","g_secHero")
g.append("rect").attr("class", "sectionHero")
    .attr("x","10").attr("y","20").attr("width","90").attr("height","90")

// Define the div for the tooltip for hero
var div = d3.select("body").append("div")
    .attr("class", "tooltip")				
    .style("opacity", 0);

d3.select("div.heroes").append("svg").attr("id","heroList").attr("width","120").attr("height","2600")

//d3.select(".target").append("svg").attr("id","world").attr("width","1400").attr("height","595")


function dragstarted() {
    d3.select(this).attr("stroke", "black");
    hero = this.id;
    hero = "h"+hero.split("h")[1];
    //console.log(hero)
}

function dragged() {
    d3.select(this).raise().attr("cx", d3.event.x).attr("cy", d3.event.y);
    div.transition().duration(100).style("opacity", 0);
}

function dragended() {
    d3.select(this).attr("stroke", null);
    checkCharacterMovie();
    
}

function img_url(id){ return "url(#img" + id + ")";}

function checkCharacterMovie(){
    if (hero != "null"){
        let idMovie = distanceHeroMovie(dictEdge[hero]);
        console.log("Movie: " + idMovie);
        if (idMovie != ""){
            if(hero_movie_left[hero] == undefined){
                actionHeroCorrect(idMovie);
            }else if(hero_movie_left[hero] != undefined && !hero_movie_left[hero].includes(idMovie)){
                actionHeroCorrect(idMovie);
            }else{
                d3.select("#selectHero"+hero).raise().transition().ease(d3.easeElastic).duration(1500)
                    .attr("cx", sectionHeroXY[0]).attr("cy", sectionHeroXY[1])
                alert("Personaggio già inserito nel film!")
            }
        }else{
            d3.select("#selectHero"+hero).raise().transition().ease(d3.easeElastic).duration(1500)
                .attr("cx", sectionHeroXY[0]).attr("cy", sectionHeroXY[1])
            console.log("Posizione errata!")
            wrongHero();
        }
    }
}

function actionHeroCorrect(idMovie){
    console.log("personaggio nel film giusto!")
        let movie = d3.select("#"+idMovie)
        let x = d3.select("#"+hero+"_"+idMovie).attr("cx");
        let y = d3.select("#"+hero+"_"+idMovie).attr("cy");
        let parentMovieCod = movie._groups[0][0].parentNode.attributes[2].nodeValue.split("(")[1].split(")")[0]
        
        x = parseFloat(x) + parseFloat(parentMovieCod.split(",")[0]);
        y = parseFloat(y) + parseFloat(parentMovieCod.split(",")[1]);
        
        d3.select("#selectHero"+hero).transition().ease(d3.easeSin)
            .attr("cx", x )
            .attr("cy", y )
            .duration(1500).remove()

        d3.select("#"+hero+"_"+idMovie).attr("class","appostHero").style("fill",img_url(hero))
        
        correctHero(idMovie, hero);
}

function distanceHeroMovie(movies){
    //console.log(hero, movies)
    let result = "";
    let hr = d3.select("#selectHero"+hero)
    movies.forEach(function(d,i){ 
        //console.log(d)
        let movie = d3.select("#"+d);
        let parentMovieCod = movie._groups[0][0].parentNode.attributes[2].nodeValue.split("(")[1].split(")")[0]
        let parentMovieWidth = (movie._groups[0][0].parentNode.attributes[0].nodeValue)/2
        //console.log(parentMovieWidth + parseInt(parentMovieCod.split(",")[0]))
        let parentMovieHeigth = (movie._groups[0][0].parentNode.attributes[1].nodeValue)/2
        let x = Math.pow((hr.attr("cx")) - (parseInt(parentMovieCod.split(",")[0]) + parentMovieWidth),2);
        let y = Math.pow((hr.attr("cy")) - (parseInt(parentMovieCod.split(",")[1]) + parentMovieHeigth),2);
        let distance = Math.sqrt(x + y);
        let minimo = d3.mean([movie.attr("rx"), movie.attr("ry")])
        console.log("Distance: "+ distance, "Minimo: " + minimo, "Movie: " + d);
        if (distance < minimo)
            result = d;
    })

    return result;
}