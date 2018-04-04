d3.queue()
	.defer(d3.csv, "england.csv")
	.defer(d3.csv, "france.csv")
	.defer(d3.csv, "autores.csv")
	.await(analyze);

function analyze(error, england, france, autor){
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
	autor.forEach(function (d){
		d.Begin = +d.Begin;
		d.End = +d.End;
		d.Duration = d.End - d.Begin;
	});
	atualizarPlot(england, france, autor);
}
var m = {top:20, right:15, bottom:20, left:15};

var mySvg = d3.select("svg").attr("transform", "translate(150,150)");
var England = mySvg.append("g").attr("transform", "translate(10,0)");
var France = mySvg.append("g").attr("transform", "translate(10,0)");
var Autor = mySvg.append("g").attr("transform", "translate(10,0)");

function atualizarPlot(england, france, autor){
	var timeBegin = 700,
		timeEnd = 2050;

	var x = d3.scaleLinear().domain([timeBegin, timeEnd]).range([0,1000]);
	var colour = d3.scaleOrdinal().range(d3.schemeCategory10);
    var xAxis = d3.axisBottom(x);
    var xAxisGroup = mySvg
    	.append("g")
    	.attr("class","xAxis")
    	.attr("transform","translate(10,500)");
    xAxisGroup.call(xAxis);

	var opacity = .5;


	var plota = function(svg, dataset, color, translate){
		return svg
			.selectAll("circle")
			.data(dataset)
			.enter()
			.append("circle")
			.attr("cx", d=>x(d.Begin))
			.attr("cy", d=>d.Duration+translate)
			.attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*3)
			.style("fill", color)
			.style("fill-opacity", opacity);
	}
	
	function acao(circulo){
		circulo
			.on("mouseover", function(d){
			d3.select(this).attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*4);
			tip.show(d);
		})
		.on("mouseout", function(d){
			d3.select(this).attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*3);
			tip.hide(d);
		});
	}

	var circleE = plota(England, england, "red", 400);
	var circleF = plota(France, france, "blue", 200);
	var circleA = plota(Autor, autor, "green", 0);

	var tip = d3.tip().attr("class", "d3-tip")
				.html(d => d.Begin + " - " + d.Name);

	circleE.call(tip);
	circleF.call(tip);

	acao(circleE);
	acao(circleF);

	circleA
		.attr("cy", d=>d.Duration*4-100)
		.attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*2)
		.style("fill", d=>(colour(d.Begin)))
		.on("mouseover", function(d){
			d3.select(this).attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*3);
			tip.show(d);
		})
		.on("mouseout", function(d){
			d3.select(this).attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*2);
			tip.hide(d);
		});
}