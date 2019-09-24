/* The dragging code for '.draggable' from the demo above
 * applies to this demo as well so it doesn't have to be repeated. */


var heroIN = false;

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.5,
  
    // listen for drop related events: 
    ondropactivate: function (event) {
      // add active dropzone feedback
      d3.select(event.relatedTarget).style("stroke-width","4px");
      hero = event.relatedTarget.id;
      hero = "h"+hero.split("h")[1];
      //console.log("drop activate " + hero)
      
      div.transition().duration(100).style("opacity", 0);
    },
    ondragenter: function (event) {
      heroIN = true;
    },
    ondragleave: function (event) {
      heroIN = false;
    },
    ondrop: function (event) {
      //console.log("only drop " + event.target.id)
      d3.select(event.relatedTarget).style("stroke-width", null);
      checkCharacterMovie2(event.target.id);
      heroIN=false;
    },
    ondropdeactivate: function (event) {
      // remove active dropzone feedback
      d3.select(event.relatedTarget).style("stroke-width", null);
      if(!heroIN){
        d3.select("#"+event.relatedTarget.id).raise().transition().ease(d3.easeElastic).duration(1500)
            .attr("cx", sectionHeroXY[0]).attr("cy", sectionHeroXY[1])
      }
      //checkCharacterMovie2(event.target.id);
      //console.log("drop disattivato " + event.relatedTarget.id)
    }
  })
  
  interact('.drag-drop')
    .draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ],
      autoScroll: true,
      // dragMoveListener from the dragging demo above
      onmove: dragMoveListener
    })

    function dragMoveListener (event) {
        var target = event.target
        // keep the dragged position in the data-x/data-y attributes
        var x = (parseFloat(target.getAttribute('cx')) || 0) + event.dx
        var y = (parseFloat(target.getAttribute('cy')) || 0) + event.dy

        // update the posiion attributes
        target.setAttribute('cx', x)
        target.setAttribute('cy', y)
    }

    // this is used later in the resizing and gesture demos
    window.dragMoveListener = dragMoveListener