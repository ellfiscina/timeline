d3.queue()
	.defer(d3.csv, "england.csv")
	.defer(d3.csv, "france.csv")
	.await(analyze);

function analyze(error, england, france){
	if(error){console.log(error);}
	england.forEach(function (d){
		d.Begin = +d.Begin;
		d.End = +d.End;
		d.Duration = d.End - d.Begin;
	});
	france.forEach(function (d){
		d.Begin = +d.Begin;
		d.End = +d.End;
		d.Duration = d.End - d.Begin;
	});
	console.log(england[0]);
	console.log(france[0]);
	atualizarPlot(england, france);
}
var m = {top:20, right:15, bottom:20, left:15};

var mySVG = d3.select("svg").append("g").attr("transform", "translate(55,0)");
var mySVG2 = d3.select("svg").append("g").attr("transform", "translate(55,0)");

function atualizarPlot(england, france){
	var timeBegin = 800,
		timeEnd = 2050;

	var x = d3.scaleLinear().domain([timeBegin, timeEnd]).range([0,1000]);

    var xAxis = d3.axisBottom(x);
     
    var xAxisGroup = mySVG
    	.append("g")
    	.attr("class","xAxis")
    	.attr("transform","translate(15,500)");

    xAxisGroup.call(xAxis);

	var opacity = .5;

	var circleE = mySVG
		.selectAll("circle")
		.data(england)
		.enter()
		.append("circle")
		.attr("cx", d=>x(d.Begin))
		.attr("cy", d=>d.Duration+400)
		.attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*3)
		.style("fill", "red")
		.style("fill-opacity", opacity);
	
	var tip = d3.tip().attr("class", "d3-tip").html(d => d.Begin + " - " + d.Monarch);
	circleE.call(tip);

	circleE
		.on("mouseover", function(d){
			d3.select(this).attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*4);
			tip.show(d);
		})
		.on("mouseout", function(){
			d3.select(this).attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*3);
			tip.hide(d);
		});

	var circleF = mySVG2
		.selectAll("circle")
		.data(france)
		.enter()
		.append("circle")
		.attr("cx", d=>x(d.Begin))
		.attr("cy", d=>d.Duration+200)
		.attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*3)
		.style("fill", "blue")
		.style("fill-opacity", opacity);
	
	var tip2 = d3.tip().attr("class", "d3-tip").html(d => d.Begin + " - " + d.Monarch);
	circleF.call(tip2);

	circleF
		.on("mouseover", function(d){
			d3.select(this).attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*4);
			tip2.show(d);
		})
		.on("mouseout", function(){
			d3.select(this).attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*3);
			tip2.hide(d);
		});
	
}