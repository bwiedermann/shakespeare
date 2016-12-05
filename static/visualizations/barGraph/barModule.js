angular
	.module('barModule', ['ngMaterial'])
	.directive('barChart', function($window) {
		return {
			restrict: 'EA',
			template:"<svg></svg>",
			scope: {
				play: '='
			},

				link: function(scope, elem, attrs) {
					//if the character name is clicked on in the heat map visualization
					// then we can make a bar graph appear or disappear depending. 
					$(document).on("characterSelected", function(e, data) {
						d3.select("." + data.charName.split(" ").join("delim"))
							.style("fill", function(d){
								if(this.style.fill === "rgb(70, 70, 70)"){
									return "rgb(127, 15, 126)";
								}
								else {
									return "rgb(70, 70, 70)";
								}
						// console.log("last letter of charactername:" + characterName.charAt(characterName.length -1));
						// var fileList = [];
						// if (characterName.charAt(characterName.length -1) == 'S') {
						// 	var files = fs.readdirSync(path);
						// 	console.log("list of files: " + files);
						// 	for (var characterFile in files) {
						// 		var searchName = characterName.substr(0, characterName.length - 2);
						// 		if (characterFile.indexOf(searchName) !== -1) {
						// 			fileList.push(characterFile);
						// 		}
						// 	}
						// 	console.log("fileList: " + fileList);
						// 	});
						// }
						// console.log("characterName: " + characterName);
							})
							.style("font-weight", function(d){
									if(this.style.fontWeight === "bolder"){
										return "";
									}
									else {
										return "bolder";
									}
								});
						
						function parseCharName(charName) {
							if (charName.indexOf(' ') >= 0) {
								charName.replace(" ", "");
							}
						}
						var fullcharName = data.charName;
						var characterName = data.charName.replace(" ","");
						var playName = data.playName;
						var margin = {top: 20, right: 0, bottom: 100, left: 60},
							width = 1100 - margin.left - margin.right, 
							height = 300 - margin.top - margin.bottom;
						// console.log("test: " + d3.select(".barChart"+ characterName)[0]);
						// console.log("test2: " + d3.select(".barChart"+ characterName)[0][0]);

						if(d3.select(".barChart" + characterName)[0][0] !== null) {
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

						var g = svg.append("g")
						    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

						var path = "./static/visualizations/barGraph/tsvDat";

						d3.tsv(path + "/" + playName + "/" + characterName + ".tsv", function(d) {
						  d.numLines = +d.numLines;
						  return d;
						}, function(error, data) {
						  if (error) throw error;
						  var numScenes = data.length;
						  x.domain(data.map(function(d) { return d.scene; }));
						  y.domain([0, d3.max(data, function(d) { return d.numLines + 10 - (d.numLines % 10); })]);

						  var xAxis = d3.svg.axis()
						  				.scale(x)
						  				.orient("bottom");

						  var yAxis = d3.svg.axis()
						  				.scale(y)
						  				.orient("left");

						  g.append("g")
						  				.attr("class", "x axis")
						  				.attr("transform", "translate(" + (((width-60)/numScenes)/2) + "," + (height+8) + ")")
						  				.attr("stroke", "#000")
						  				.call(xAxis)
						  				.selectAll("text")
						  				.attr("transform", "rotate(-55)")
    									

						  g.append("g")
						  				.attr("class", "y axis")
						  				.attr("stroke", "#000")
						  				.call(yAxis)
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
						  				.text(fullcharName);

						  svg.select(".domain")
						  		.attr("display", "none");

						  var bars = g.selectAll(".bar")
						    .data(data)
						    .enter().append("rect")
						      .attr("class", "bar")
						      .attr("x", function(d) { 
						      	return x(d.scene) ; })
						      .attr("y", function(d) { return y(d.numLines); })
						      .attr("width", function(d) {return (width-60)/numScenes;})
						      .attr("height", function(d) { return height - y(d.numLines); })
						       ;

						  bars.append("title").text(function(d) {
						    return "" + d.numLines;
						  });

						});
					}
				});
			}
		}
	})