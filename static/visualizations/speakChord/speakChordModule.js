angular
	.module('speakChordModule',['ngMaterial', 'ngRoute'])
	.directive('speakChord', function($window) {
		return {
            restrict:'EA',
            template:"<svg width='100%' height='100%'></svg>",
  			scope: {
  				play: '='
  			},
            link: function(scope, elem, attrs){
                    var csv = "./static/visualizations/speakChord/csv/" + scope.play + ".csv";
                    var json = "./static/visualizations/speakChord/matrix/" + scope.play + ".json";

                    
                    var width = 900,
                        height = 900,
                        outerRadius = Math.min(width, height) / 2 - 150,
                        innerRadius = outerRadius - 15;

                    var formatPercent = d3.format("1");

                    var arc = d3.svg.arc()
                        .innerRadius(innerRadius)
                        .outerRadius(outerRadius);

                    var layout = d3.layout.chord()
                        .padding(.04)
                        .sortSubgroups(d3.descending)
                        .sortChords(d3.ascending);

                    var path = d3.svg.chord()
                        .radius(innerRadius);
                    

                    queue()
                        .defer(d3.csv, csv)
                        .defer(d3.json, json)
                        .await(ready);

                    function ready(error, cities, matrix) {
                      var svg = d3.select(".Visualizations").append("svg")
                        .attr("width", width)
                        .attr("height", height)
                      .append("g")
                        .attr("id", "circle")
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
                    svg.append("circle")
                        .attr("r", outerRadius);
                      if (error) throw error;

                      // Compute the chord layout.
                      layout.matrix(matrix);

                      // Add a group per neighborhood.
                      var group = svg.selectAll(".group")
                          .data(layout.groups)
                        .enter().append("g")
                          .attr("class", "group")
                          .on("mouseover", mouseover);

                      // Add a mouseover title.
                      group.append("title").text(function(d, i) {
                        return cities[i].name + " shares scenes with " + formatPercent(d.value) + " characters";
                      });

                      // Add the group arc.
                      var groupPath = group.append("path")
                          .attr("id", function(d, i) { return "group" + i; })
                          .attr("d", arc)
                          .style("fill", function(d, i) { return eval(cities[i].color); });

                      // Add a text label.
                        group.append("svg:text")
                          .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
                          .attr("font-size", "75%")
                          .attr("dy", ".35em")
                          .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
                          .attr("transform", function(d) {
                            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                                + "translate(" + (innerRadius + 26) + ")"
                                + (d.angle > Math.PI ? "rotate(180)" : "");
                          })
                          .text(function(d, i) { return cities[i].name; });


                      // Add the chords.
                      var chord = svg.selectAll(".chord")
                          .data(layout.chords)
                        .enter().append("path")
                          .attr("class", "chord")
                          .style("fill", function(d) { return eval(cities[d.source.index].color); })
                          .attr("d", path);

                      // Add an elaborate mouseover title for each chord.
                      chord.append("title").text(function(d) {
                        return cities[d.source.index].name
                            + " & " + cities[d.target.index].name
                            + "\nshare " + formatPercent(d.source.value)
                            + " scenes";
                      });

                      function mouseover(d, i) {
                        chord.classed("fade", function(p) {
                          return p.source.index != i
                              && p.target.index != i;
                        });
                      }
                    }
                
           }
		};
	});
