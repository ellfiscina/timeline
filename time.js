d3.csv("monarch.csv", function(data){

	data.forEach(function (d){
		d.Begin = +d.Begin;
		d.End = +d.End;
		d.Duration = d.End - d.Begin;
	});
	atualizarPlot(data);
})

var mySVG = d3.select("svg").append("g");

function atualizarPlot(dataset){
	var timeBegin = 800,
		timeEnd = 2050;

	var m = [20, 15, 15, 120];

	var x = d3.scaleLinear().domain([timeBegin, timeEnd]).range([0,1000]);

    var xAxis = d3.axisBottom(x);
     
    var xAxisGroup = mySVG
    	.append("g")
    	.attr("class","xAxis")
    	.attr("transform","translate("+m[1]+",500)");

    xAxisGroup.call(xAxis);

    /*var rec = mySVG
    	.selectAll("rect")
    	.data(dataset)
    	.enter()
    	.append("rect")
    	.attr("x", d=>x(d.Begin))
    	.attr("y", 450)
    	.attr("width", d=>d.Duration)
		.attr("height", 25)
		.style("fill", "red")
		.style("fill-opacity", .5);

	var line = mySVG
		.append("g")
		.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr("x", d=>x(d.Begin))
		.attr("y", 450)
		.attr("width", 2)
		.attr("height", 25)
		.style("fill", "red");*/

	var circle = mySVG
		.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("cx", d=>x(d.Begin))
		.attr("cy", d=>d.Duration+400)
		.attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*3)
		.style("fill", "red")
		.style("fill-opacity", .5).on("click", function(){
		d3.select(this).attr("fill","orange");
	});

	var texto = mySVG
		.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
		.attr("x", d=>x(d.Begin))
		.attr("y", d=>d.Duration+400);

	circle.on("mouseover", function(){
		d3.select(this).style("fill", "blue");
	})
	.on("mouseout", function(){
		d3.select(this).style("fill", "red");
	});
}