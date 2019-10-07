//var width = self.frameElement ? 960 : innerWidth,
//height = self.frameElement ? 500 : innerHeight;
var width = 1260, height = 595

var data = d3.range(20).map(function() { return [Math.random() * width, Math.random() * height]; });

//var color = d3.scaleOrdinal(d3.schemeCategory10);

var hero = "null";
var sectionHeroXY = [55,65];

var radius = 40;

var scaleX =  d3.scaleLinear().domain([0, width]).rangeRound([0, width]);
var scaleX2 =  d3.scaleLinear().domain([0, width]).rangeRound([0, width]);

var scaleY = d3.scaleLinear().domain([0, height]).rangeRound([0, height]);
var scaleY2 = d3.scaleLinear().domain([0, height]).rangeRound([0, height]);

/* =====================  Creazione Ambiente Film =========================== */
var zoom = d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([0.7, 1])
    /*.extent([[0,0],[width,height]])
    .scaleExtent([0.4,0.5])*/
    .on("zoom", zoomed);

d3.select("div.target")
    .on("touchstart", nozoom)
    .on("touchmove", nozoom)
    /*.append("svg")
    .attr("width", width)
    .attr("height", height);*/

var g = d3.select("#world").append("g")
    .call(zoom);

g.append("rect")
    .attr("width", width)
    .attr("height", height)
    //.on("click", clicked);

var view = g.append("g")
    .attr("class", "view");

//sezione dove viene inserito l'eroe scelto da muovere nell'universo
d3.select("#world").append("g").attr("id","secHero").append("rect").attr("class", "sectionHero")
    .attr("x","10").attr("y","20").attr("width","90").attr("height","90")

/* =====================  Creazione cerchi per gli eroi =========================== */
// var drag =  d3.drag()
//     .on("start", dragstarted)
//     .on("drag", dragged)
//     .on("end", dragended);

var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

d3.select("div.heroes").append("svg").attr("id","heroList").attr("width","120").attr("height","2600")

function zoomed() {
    //view.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    view.attr("transform", d3.event.transform);
    //console.log(d3.event.transform);
    // let t = d3.event.transform;

    // //console.log("Prima: ", scaleX(x), scaleY(y))
    // scaleX.domain(t.rescaleX(scaleX2).domain())
    // scaleY.domain(t.rescaleY(scaleY2).domain())
}

function nozoom() {
    d3.event.preventDefault();
}

// function dragstarted(d) {
//     //this.parentNode.appendChild(this);
//     //view.attr("cursor", "grabbing");
//     d3.select(this).attr("stroke", "black");
//     hero = this.id;
//     hero = hero[hero.length-2] + hero[hero.length-1]
//     //console.log(hero)
// }

// function dragged(d) {

//     d3.select(this).raise().attr("cx", d3.event.x).attr("cy", d3.event.y);
//     div.transition().duration(100).style("opacity", 0);
// }

// function dragended(d) {
//     d3.select(this).attr("stroke", null);
//     view.attr("cursor", "grab");

//     console.log("Posizione del personaggio selezionato: ",d3.event.x, d3.event.y)

//     checkCharacterMovie();
// }

function img_url(id){ return "url(#img" + id + ")"; }

function checkCharacterMovie2(idMovie){
    console.log("Hero: " + hero, "Movie: "+ idMovie)

    if (dictEdge[hero].includes(idMovie)){
        if(hero_movie_left[hero] == undefined){
            actionHeroCorrect(idMovie);
        }else if(!hero_movie_left[hero].includes(idMovie)){
            actionHeroCorrect(idMovie);
        }else{
            d3.select("#selectHero"+hero).raise().transition().ease(d3.easeElastic).duration(1500)
                .attr("cx", sectionHeroXY[0]).attr("cy", sectionHeroXY[1])
            alert("Hero already in this film!")
        }
    }else{
        d3.select("#selectHero"+hero).raise().transition().ease(d3.easeElastic).duration(1500)
            .attr("cx", sectionHeroXY[0]).attr("cy", sectionHeroXY[1])
        console.log("Wrong film!")
        wrongHero();
    }

}

function actionHeroCorrect(idMovie){
    console.log("Hero in the correct film!")

        // d3.select("#selectHero"+hero).transition().ease(d3.easeLinear)
        //     .attr("cx", sectionHeroXY[0])
        //     .attr("cy", sectionHeroXY[1])
        //     .duration(1500)
        d3.select("#selectHero"+hero)
            .attr("cx", sectionHeroXY[0])
            .attr("cy", sectionHeroXY[1])

        d3.select("#"+hero+"_"+idMovie).attr("class","revealHero").style("fill",img_url(hero))

        correctHero(idMovie, hero);
}

// function distanceHeroMovie(movies){
//     console.log(hero, movies)
//     let result = "";
//     let hr = d3.select("#selectHero"+hero)
//     movies.forEach(function(d,i){
//         //console.log(d)
//         let movie = d3.select("#"+d);
//         let parentMovieCod = movie._groups[0][0].parentNode.attributes[2].nodeValue.split("(")[1].split(")")[0]
//         let parentMovieWidth = (movie._groups[0][0].parentNode.attributes[0].nodeValue)/2
//         //console.log(parentMovieWidth + parseInt(parentMovieCod.split(",")[0]))
//         let parentMovieHeigth = (movie._groups[0][0].parentNode.attributes[1].nodeValue)/2

//         //console.log(parseInt(parentMovieCod.split(",")[0]))
//         let xMovie = parseInt(parentMovieCod.split(",")[0])
//         let yMovie = parseInt(parentMovieCod.split(",")[1])
//         xMovie = scaleX(xMovie) + scaleX(parentMovieWidth)
//         yMovie = scaleY(yMovie) + scaleY(parentMovieHeigth)
//         console.log("Centro del film: ",xMovie, yMovie)

//         //d3.select(".view").append("circle").attr("id","test").attr("r",40).attr("cx", xMovie).attr("cy",yMovie).attr("fill", "orange")


//         let x = Math.pow((hr.attr("cx") - xMovie),2);
//         let y = Math.pow((hr.attr("cy") - yMovie),2);

//         let distance = Math.sqrt(x + y);
//         let minimo = d3.mean([(movie.attr("rx")), (movie.attr("ry"))])
//         //let minimo = d3.mean([(movie.attr("rx")), (movie.attr("ry"))])

//         console.log("Distance: "+ distance, "Minimo: " + minimo, "Movie: " + d);
//         if (distance < minimo)
//             result = d;
//     })

//     return result;
// }
