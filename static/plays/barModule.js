angular
	.module('barModule', ['ngMaterial'])
	.directive('barChart', function($window) {
		return {
				restrict: 'EA',
				template:"<svg width='100%' height='100%'></svg>",
			scope: {
				play: '='
			},
				link: function(scope, elem, attrs) {
					$(document).on("characterSelected", function(e, data) {
						console.log(data);
						var characterName = data.charName;
						var playName = data.playName;
						var margin = {top: 20, right: 0, bottom: 100, left: 60},
							width = 1100 - margin.left - margin.right, 
							height = 400 - margin.top - margin.bottom;
						// var width = 800,
						//     height = 500;
						console.log("test: " + d3.select(".barChart"+ characterName)[0]);
						console.log("test2: " + d3.select(".barChart"+ characterName)[0][0]);

						if(d3.select(".barChart" + characterName)[0][0] !== null) {
							console.log(d3.select(".barChart" +characterName));
							d3.select(".barChart" + characterName).remove();
						}
						else {

						var svg = d3.select(".barChart").append("svg")
									.attr("class", function(d) { return "barChart" + characterName;})
									.attr("width", width + margin.left + margin.right)
									.attr("height", height + margin.top + margin.bottom)
									.attr("fill", "none")
									.attr("text-anchor", "middle");
						    

						var x = d3.scale.ordinal().rangePoints([0, width-60], 0.1),
							y = d3.scale.linear().rangeRound([height, 0]);

						// var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
						//     y = d3.scaleLinear().rangeRound([height, 0]);

						var g = svg.append("g")
						    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
						    //.attr("transform", "translate(" + 20 + "," + 20 + ")");

						var path = "./static/visualizations/tsvDat";

						d3.tsv(path + "/" + playName + "/" + characterName + ".tsv", function(d) {
						  d.numLines = +d.numLines;
						  return d;
						}, function(error, data) {
						  if (error) throw error;
						  console.log("data " + data.length);
						  var numScenes = data.length;
						  x.domain(data.map(function(d) { return d.scene; }));
						  y.domain([0, d3.max(data, function(d) { return d.numLines + 10 - (d.numLines % 10); })]);

						  // g.append("g")
						  //     .attr("class", "axis axis--x")
						  //     .attr("transform", "translate(0," + height + ")")
						  //     .call(d3.axisBottom(x));

						  // g.append("g")
						  //     .attr("class", "axis axis--y")
						  //     .call(d3.axisLeft(y).ticks(10))
						  //   .append("text")
						  //     .attr("transform", "rotate(-90)")
						  //     .attr("y", 6)
						  //     .attr("dy", "0.71em")
						  //     .attr("text-anchor", "end")
						  //     .text("Frequency");

						  //----part that i am adding to deal with d4
						  
						  				

						  var xAxis = d3.svg.axis()
						  				.scale(x)
						  				.orient("bottom");

						  var yAxis = d3.svg.axis()
						  				.scale(y)
						  				.orient("left");

						  g.append("g")
						  				.attr("class", "x axis")
						  				.attr("transform", "translate(" + ((width-60)/numScenes)/2 + "," + height + ")")
						  				.attr("stroke", "#000")
						  				.call(xAxis);

						  g.append("g")
						  				.attr("class", "y axis")
						  				.attr("stroke", "#000")
						  				.call(yAxis)
						  				//.call(d3.axisLeft(y).ticks(10))
						  			.append("text")
						  				.attr("transform", "rotate(-90)")
						  				.attr("y", -45)
						  				.attr("x", -height/3.33)
						  				.attr("dy", "0.71em")
						  				.attr("text-anchor", "end")
						  				.text("Number of Lines");

						  g.append("g")
						  			.append("text")
						  				.attr("transform", "translate(" + width/2.0 + ",0)")
						  				.attr("stroke", "#000")
						  				.text(characterName);

						  svg.select(".domain")
						  		.attr("display", "none");

						  //-------------

						  var bars = g.selectAll(".bar")
						    .data(data)
						    .enter().append("rect")
						      .attr("class", "bar")
						      .attr("x", function(d) { return x(d.scene) ; })
						      .attr("y", function(d) { return y(d.numLines); })
						      .attr("width", function(d) {return (width-60)/numScenes;})//x.bandwidth())
						      .attr("height", function(d) { return height - y(d.numLines); })
						       ;

						  bars.append("title").text(function(d) {
						    return "" + d.numLines;
						  });

						});

					}
					})
				}

		}
	})