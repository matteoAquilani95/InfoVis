var hours=0;
var minutes=0;
var seconds=0;
var tenths=0;
var visualization="";
var interrupt_counter=0;
var stop=1; //0=active 1=stop

function start()
{
  if (stop==1)
  {
    stop=0;
    chrono();
  }
}

function chrono()
{
  if (stop==0) {
    tenths+=1;
    if (tenths>9) {tenths=0;seconds+=1;}
    if (seconds>59) {seconds=0;minutes+=1;}
    if (minutes>59) {minutes=0;hours+=1;}

    if (hours<10) {visualization="0" + hours;} else {visualization=hours;}
    if (minutes<10) {visualization=visualization + ":0" + minutes;} else {visualization=visualization + ":" + minutes;}
    if (seconds<10) {visualization=visualization + ":0" + seconds;} else {visualization=visualization + ":" + seconds;}
    // visualizzazione=visualizzazione + ":" + decimi;

    document.getElementById("show_chrono").value=visualization;
    setTimeout("chrono()", 100);
  }
}

function intertime()
{
  if (stop==0)
  {
    interrupt_counter+=1;
    document.getElementById("intertime").appendChild(document.createTextNode(interrupt_counter + ". " + visualization));
    document.getElementById("intertime").appendChild(document.createElement("br"));
  }
}

function pause()
{
  stop=1;
}

// document.getElementById("button_pause").onclick = function() {stop()}

function reset()
{
  if (stop==1)
  {
    hours=0;
    minutes=0;
    seconds=0;
    tenths=0;

    document.getElementById("show_chrono").value="00:00:00";
  }
}

window.onload=function(){start()}
