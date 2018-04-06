d3.queue()
	.defer(d3.csv, "england.csv")
	.defer(d3.csv, "france.csv")
	.defer(d3.csv, "autores.csv")
	.await(analyze);

var dataE, dataF, dataA;

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
	
	dataE = england;
	dataF = france;
	dataA = autor;

	bubble();
}

var flag = false;

var mySvg = d3.select("svg");
var England = mySvg.append("g").attr("transform", "translate(100,150)");
var France = mySvg.append("g").attr("transform", "translate(100,150)");
var Autor = mySvg.append("g").attr("transform", "translate(100,150)");

var timeBegin = 1450,
	timeEnd = 2050;

var x = d3.scaleLinear().domain([timeBegin, timeEnd]).range([0,1000]);
var colour = d3.scaleOrdinal().range(d3.schemeCategory10);

var tip = d3.tip().attr("class", "d3-tip")
	.html(d => d.Begin + " - " + d.Name);

function clicka(){
	if(flag){
		flag = false;
		bubble();
	}
	else{
		flag = true;
		bar();
	}
}

function bubble(){
	d3.selectAll("rect").remove();
    var xAxis = d3.axisBottom(x);
    var xAxisGroup = mySvg
    	.append("g")
    	.attr("class","xAxis")
    	.attr("transform","translate(100,650)");
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

	var circleE = plota(England, dataE, "red", 400);
	var circleF = plota(France, dataF, "blue", 200);
	var circleA = plota(Autor, dataA, d=>(colour(d.Begin)), 50);


	circleE.call(tip);
	circleF.call(tip);

	acao(circleE);
	acao(circleF);

	circleA
		.attr("cy", d=>d.Duration*4-200)
		.attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*2)
		.on("mouseover", function(d){
			d3.select(this).attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*3);
			tip.show(d);
		})
		.on("mouseout", function(d){
			d3.select(this).attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*2);
			tip.hide(d);
		});
}

function bar(){
	d3.selectAll("circle").remove();
	
	var plota = function(svg, dataset, color, y){
		return svg
			.selectAll("rect")
			.data(dataset)
			.enter()
			.append("rect")
			.attr("x", d=>x(d.Begin))
			.attr("y", y)
			.attr("width", d=>x(d.End)-x(d.Begin))
			.attr("height", 50)
			.attr("transform","translate(0,1000),scale(1,-1)")
			.style("fill", color)
			.style("opacity", .5)
			.style("stroke", color);
	}

	function acao(barra){
		barra
			.on("mouseover", function(d){
			d3.select(this).style("opacity", 1);
			tip.show(d);
		})
		.on("mouseout", function(d){
			d3.select(this).style("opacity", .5);
			tip.hide(d);
		});
	}

	var barE = plota(England, dataE, "red", 500);
	var barF = plota(France, dataF, "blue", 550);
	var barA = plota(Autor, dataA, d=>(colour(d.Begin)), 600);
	
	barA.attr("y", (d,i)=>(600+i*i));
	tip.direction('e');
	
	acao(barE);
	acao(barF);
	acao(barA);

}