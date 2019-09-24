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

var div = d3.select("body").append("div")
                .attr("class", "tooltip")				
                .style("opacity", 0);

d3.select("div.heroes").append("svg").attr("id","heroList").attr("width","120").attr("height","2600")

function zoomed() {
    view.attr("transform", d3.event.transform);
}

function nozoom() {
    d3.event.preventDefault();
}

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
            alert("Personaggio già inserito nel film!")
        }
    }else{
        d3.select("#selectHero"+hero).raise().transition().ease(d3.easeElastic).duration(1500)
            .attr("cx", sectionHeroXY[0]).attr("cy", sectionHeroXY[1])
        console.log("Posizione errata!")
        wrongHero();
    }

}

function actionHeroCorrect(idMovie){
    console.log("personaggio nel film giusto!")
        
        // d3.select("#selectHero"+hero).transition().ease(d3.easeLinear)
        //     .attr("cx", sectionHeroXY[0])
        //     .attr("cy", sectionHeroXY[1])
        //     .duration(1500)
        d3.select("#selectHero"+hero)
            .attr("cx", sectionHeroXY[0])
            .attr("cy", sectionHeroXY[1])

        d3.select("#"+hero+"_"+idMovie).attr("class","appostHero").style("fill",img_url(hero))
        
        correctHero(idMovie, hero);
}