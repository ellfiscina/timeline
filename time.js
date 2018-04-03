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

	var opacity = .5;

	var circle = mySVG
		.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("cx", d=>x(d.Begin))
		.attr("cy", d=>d.Duration+400)
		.attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*3)
		.style("fill", "red")
		.style("fill-opacity", opacity);

	/*var texto = mySVG
		.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
		.attr("x", d=>x(d.Begin))
		.attr("y", d=>d.Duration+400)
		.style("visibility", "hidden");*/

	var tip = d3.tip().attr("class", "d3-tip").html(d => d.Begin);
	circle.call(tip);

	circle
		.on("mouseover", function(){
			d3.select(this).attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*4);
		})
		.on("mouseout", function(){
			d3.select(this).attr("r", d=>Math.sqrt(d.Duration*4/Math.PI)*3);
		})
		.on("click", function(d){
			if(opacity == .5){
				opacity = 1;
				tip.show;
			}
			else{
				opacity = .5;
				tip.hide;
			}
			//opacity = opacity == .5 ? 1 : .5;
			d3.select(this).style("fill-opacity", opacity);

		});

}