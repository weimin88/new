$(document).ready(function () {

var controlPoints = [ { "x": 10,   "y": 200},  { "x": 100,  "y": 40},{ "x": 280,  "y": 60},{ "x": 320,  "y": 190},{ "x": 380,  "y": 190}];


var svgContainer = d3.select("#bezierDemo").append("svg")
.attr("width", 600)
.attr("height", 300);


$("#bezierDemo").append("<div id='toolbar'></div>");
$("#toolbar").append("<div id='animateButton'>ANIMATE</div>");
$("#toolbar").append("<div id='param'>t=1.00</div>");

$("#toolbar").append("<button id='add'>+ CPoint</div>");
$("#toolbar").append("<button id='subtract'>- CPoint</div>");


function fact(k){
  if(k===0){
    return 1;
  }
  return k*fact(k-1);
}

function drawPoint(coords,fillcolor,strokecolor,r,newClass){
  var circle=svgContainer.append("circle")
  .attr("cx",coords[0])
  .attr("cy",coords[1])
  .attr("r",r)
  .attr("class",newClass)
  .style("fill",fillcolor)
  .style("stroke",strokecolor);

  return circle;
}

function drawStep(){
  var t=k/steps;

  d3.selectAll("path").remove();

  for(var j=0;j<controlPoints.length-1;j++){
    p0=controlPoints[j];
    p1=controlPoints[j+1];

    if(j<controlPoints.length-2){
      p2=controlPoints[j+2];
      c1_x=(1-t)*p0["x"]+t*p1["x"];
      c1_y=(1-t)*p0["y"]+t*p1["y"];
      c2_x=(1-t)*p1["x"]+t*p2["x"];
      c2_y=(1-t)*p1["y"]+t*p2["y"];
      //line1=drawLine(c1_x,c1_y,c2_x,c2_y);
    }
    pt=linearInterpolate(p0,p1,t);
    drawPoint(pt,"#00398E","none",1);
  }
  pt=computeBezierCurve(controlPoints,t);
  if(k<steps){
    drawPoint(pt,"black","none",1);
    k++
  }
  if(k===steps){
    clearInterval(refreshDraw);
  }
  $("#param").html("t="+t.toString().substring(0,3));
}



var drag = d3.behavior.drag()
    .origin(Object)
    .on("drag", dragmove);



function drawControlPoints(controlPoints){
  $(".cpoint").remove();
  for (var i=0;i<controlPoints.length;i++){
    var px=controlPoints[i]["x"];
    var py=controlPoints[i]["y"];

    var circle=svgContainer.append("circle")
    .data([{x: px, y: py}])
      .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r",6)
    .attr("class","cpoint draggable")
    .style("fill","#ffffff")
    .style("stroke","black")
    .style("cursor", "pointer")
    .style("z-index",100)
    .call(drag);
  }

}

function drawLine(x1,y1,x2,y2,newclass){
  var lineData = [ { "x": x1,   "y": y1},  { "x": x2,  "y": y2}];
  var lineFunction = d3.svg.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; })
  .interpolate("linear");

  var lineGraph = svgContainer.append("path")
  .attr("d", lineFunction(lineData))
  .attr("stroke", "grey")
  .attr("stroke-width", 1)
  .attr("fill", "none")
  .attr("class",newclass);

  $(".netLine").css("z-index","0");
  
  return lineGraph
}

function updateControlPoints(controlPoints){

  var i=0;
  $(".cpoint").each(function(){
    $(this).attr("cx",controlPoints[i]["x"]);
    $(this).attr("cy",controlPoints[i]["y"]);

    i++;

  });


}



function drawCurve(controlPoints,t){
  $(".curvePoint").remove();
  steps=350;
  var lim=Math.floor(steps*t);
  for(i=0;i<lim;i++){
    t=i/steps;
    drawPoint(computeBezierCurve(controlPoints,t),"black","none",1,"curvePoint");
  }
}
function drawControlNet(cpts){
   $(".netLine").remove();

  for(var j=0;j<cpts.length-1;j++){
    drawLine(cpts[j]["x"],cpts[j]["y"],cpts[j+1]["x"],cpts[j+1]["y"],"netLine");
  }
}
function drawLineInterpolation(controlPoints,t){

  for(var j=0;j<controlPoints.length-1;j++){
    p0=controlPoints[j];
    p1=controlPoints[j+1];

    if(j<controlPoints.length-2){
      p2=controlPoints[j+2];
      c1_x=(1-t)*p0["x"]+t*p1["x"];
      c1_y=(1-t)*p0["y"]+t*p1["y"];
      c2_x=(1-t)*p1["x"]+t*p2["x"];
      c2_y=(1-t)*p1["y"]+t*p2["y"];
      //line1=drawLine(c1_x,c1_y,c2_x,c2_y);
    }
    pt=linearInterpolate(p0,p1,t);
    drawPoint(pt,"#00398E","none",1);
  }

}







drawControlNet(controlPoints);



////Compute value on a Bezier Curve for given control points at a given t value between 0 and 1
function computeBezierCurve(controlPoints,t){
  var n=controlPoints.length-1;
  var value_x=0;
  var value_y=0;
  for(var i=0;i<=n;i++){
    coeff=(fact(n)/(fact(i)*fact(n-i)));
    value_x+=coeff*Math.pow((1-t),n-i)*Math.pow(t,i)*controlPoints[i]["x"];
    value_y+=coeff*Math.pow((1-t),n-i)*Math.pow(t,i)*controlPoints[i]["y"];
  }
  return [value_x,value_y];
}

function linearInterpolate(p1,p2,t){
  return [(1-t)*p1["x"]+t*p2["x"],(1-t)*p1["y"]+t*p2["y"]]
}




drawControlPoints(controlPoints);
drawCurve(controlPoints,1.0);









var h=0;
var steps=400;
var draw_time_seconds=1.5;
var interval=(draw_time_seconds/steps)*1000


var refreshDraw;

$("#animateButton").click(function(){
  $(".bezierPoint").remove();
  h=0;
  refreshDraw=setInterval(animateCurve,interval)

})

$("#add").click(function(){
controlPoints.push({"x":350,"y":100});
drawControlPoints(controlPoints);
drawCurve(controlPoints,1);
drawControlNet(controlPoints);

})

$("#subtract").click(function(){

controlPoints.pop();
drawControlPoints(controlPoints);
drawCurve(controlPoints,1);
drawControlNet(controlPoints);

})


function animateCurve(){
  drawCurve(controlPoints,0)
  t=h/steps;
  pt=computeBezierCurve(controlPoints,t)
  drawPoint(pt,"#00398E","none",1,"bezierPoint");

  tStr=t.toString()+"000";
  S=tStr.charAt(0)+"."+tStr.substring(2).substring(0,2);
  


  $("#param").html("t="+S);

  //drawLineInterpolation(controlPoints,t);

  h++;
  if(h>steps){
    h=steps;
    clearInterval(refreshDraw);
    $(".bezierPoint").remove();
    drawCurve(controlPoints,1);
  }
}



function dragmove(d) {
  newx=d3.event.x;
  newy=d3.event.y;
  //console.log(newx);
  padding=7;
  if(newx<padding){
    newx=padding;
  }
  if(newy<padding){
    newy=padding;
  }
  if(newx>$("svg").attr("width")-padding){
    newx=$("svg").attr("width")-padding;
  }
  if(newy>$("svg").attr("height")-padding){
    newy=$("svg").attr("height")-padding;
  }

     $(this)
         .attr("cx", d.x = newx)
         .attr("cy", d.y = newy);

        index=$(".cpoint").index($(this));
        controlPoints[index]={"x":$(this).attr("cx"),"y":$(this).attr("cy")};
    //$(".bezierPoint").remove();
        //console.log(controlPoints);
        drawControlNet(controlPoints);
        drawCurve(controlPoints,1);
        updateControlPoints(controlPoints);
 

   }

});






