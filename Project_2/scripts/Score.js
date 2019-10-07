var score = 0,
    scoreTot = 0,
    missingHero = 152,
    userFails = 0;

var hero_movie_left = {};


d3.select('.menu1').append("div").attr("class","score").text("SCORE: " + scoreTot)
d3.select('.menu2').append("div").attr("class","missingHero").text("Missing Heroes: " + missingHero)
d3.select('.menu2').append("div").attr("class","movieCompleted").text("Movies Completed: " + 0 + " / 24")
d3.select('.menu2').append("div").attr("class","userFails").text("Fails: " + userFails)

function correctHero(movieID, heroID){
    if(score == 0){
        score = 10;
    }else if (score < 640){
        score = score * 2;
    }else {
        score = 1000;
    }

    scoreTot += score;
    HeroRevealed(scoreTot, movieID, heroID);
}

function cheatHero(movieID, heroID){
    scoreTot -= 200;
    HeroRevealed(scoreTot, movieID, heroID);
}

function wrongHero(){
    score = 0;
    userFails += 1;
    d3.select('.userFails').text("Fails: " + userFails);
}

function HeroRevealed(score,movieID,heroID){
    d3.select('.score').text("SCORE: " + score);
    calculateMissingHero()
    updateMovieCompleted(movieID)
    updateHeroMovieLeft(heroID, movieID)
    updateScore()
}

function calculateMissingHero(){
    missingHero = d3.selectAll(".missHero")._groups[0].length;
    d3.select('.missingHero').text("Missing Heroes: " + missingHero);

    /* final condition to the end of the game */
    if(missingHero==0)
      d3.select("#overlay").style("display",'block');
}



function updateHeroMovieLeft(heroID,movieID){
    if(hero_movie_left[heroID] == undefined)
        hero_movie_left[heroID] = [movieID];
    else
        hero_movie_left[heroID].push(movieID);
}

function updateMovieCompleted(movieID){
    missHeroes_Movie[movieID] = missHeroes_Movie[movieID] - 1;

    let movieC = 0;
    Object.values(missHeroes_Movie).forEach(element => {
        //console.log(element)
        if(element == 0){
            movieC+=1;
        }
    });
    d3.select('.movieCompleted').text("Movies Completed: " + movieC + " / 24")
}

// ========= widget status game ============
function radialProgress(selector) {
  const parent = d3.select(selector)
  const size = parent.node().getBoundingClientRect()
  const svg = parent.append('svg')
    .attr('width', size.width)
    .attr('height', size.height);
  const outerRadius = Math.min(size.width, size.height) * 0.45;
  const thickness = 10;
  let value = 0;

  const mainArc = d3.arc()
    .startAngle(0)
    .endAngle(Math.PI * 2)
    .innerRadius(outerRadius-thickness)
    .outerRadius(outerRadius)

  svg.append("path")
    .attr('class', 'progress-bar-bg')
    .attr('transform', `translate(${size.width/2},${size.height/2})`)
    .attr('d', mainArc())

  const mainArcPath = svg.append("path")
    .attr('class', 'progress-bar')
    .attr('transform', `translate(${size.width/2},${size.height/2})`)

  svg.append("circle")
    .attr('class', 'progress-bar')
    .attr('transform', `translate(${size.width/2},${size.height/2-outerRadius+thickness/2})`)
    .attr('width', thickness)
    .attr('height', thickness)
    .attr('r', thickness/2)

  const end = svg.append("circle")
    .attr('class', 'progress-bar')
    .attr('transform', `translate(${size.width/2},${size.height/2-outerRadius+thickness/2})`)
    .attr('width', thickness)
    .attr('height', thickness)
    .attr('r', thickness/2)

  let percentLabel = svg.append("text")
    .attr('class', 'progress-label')
    .attr('transform', `translate(${size.width/2},${size.height/2})`)
    .text('0%')

  return {
    update: function(progressPercent) {
      const startValue = value
      const startAngle = Math.PI * startValue / 50
      const angleDiff = Math.PI * progressPercent / 50 - startAngle;
      const startAngleDeg = startAngle / Math.PI * 180
      const angleDiffDeg = angleDiff / Math.PI * 180
      const transitionDuration = 1500

      mainArcPath.transition().duration(transitionDuration).attrTween('d', function(){
        return function(t) {
          mainArc.endAngle(startAngle + angleDiff * t)
          return mainArc();
        }
      })
      end.transition().duration(transitionDuration).attrTween('transform', function(){
        return function(t) {
          return `translate(${size.width/2},${size.height/2})`+
            `rotate(${(startAngleDeg + angleDiffDeg * t)})`+
            `translate(0,-${outerRadius-thickness/2})`
        }
      })
      percentLabel.transition().duration(transitionDuration).tween('bla', function() {
        return function(t) {
          percentLabel.text(Math.round(startValue + (progressPercent - startValue) * t) + "%");
        }
      })
      value = progressPercent

    }

  }
}

let chart = radialProgress('.widget')
let totalHeroes = 152

function updateScore(){
  chart.update(((totalHeroes-missingHero)/totalHeroes)*100)
}
