angular
	.module('wordCloudModule',['ngMaterial'])
	.directive('wordCloud', function($window) {
		return {
            restrict:'EA',
            template:"<svg width='100%' height='100%'></svg>",
            scope: {
  				    play: '='
            },
            link: function(scope, elem, attrs){
           //     $(document).on("playSelected", function(e, play) {
                    var fileName = scope.play;
                    var frequency_list = [];                 
                    
                    // Currently hard coded for Hamlet until JSON files fixed.
                    $.ajax({
                        type : "POST",
                        url : "get_word_frequencies",
                        data: String(fileName),
                        contentType: 'application/json;charset=UTF-8',
                        success: function(data) {
                            frequency_list = data;

                            var width = 1000;
                            var height = 400;
                            var min = 100;
                            var max = 0;

                            // Find min and max values
                            frequency_list.forEach(function(word) {
                              if (word.size < min) min = word.size;
                              if (word.size > max) max = word.size;
                            });

                            var padding_val = 100/(max - min);
                            // teal, orange, blue, pink, green
                            var color = d3.scale.ordinal().range(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854"]);
                            var sizeScale = d3.scale.linear()
                            .domain([min, max])
                            .range([20,60]);

                            d3.layout.cloud().size([width, height])
                                .words(frequency_list)
                                .padding(5)
                                .rotate(0)
                                .fontSize(function(d) { return sizeScale(d.size); })
                                .on("end", draw)
                                .start();
                                function draw(words) {
                                  d3.select(".Themes").append("svg")
                                      .attr("width", width)
                                      .attr("height", height)
                                      .append("g")
                                      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                                    .selectAll("text")
                                      .data(words)
                                    .enter().append("text")
                                      .style("font-size", function(d) { return d.size + "px"; })
                                      .style("fill", function(d, i) { return color(i); })
                                      .attr("text-anchor", "middle")
                                      .attr("cursor", "pointer")
                                      .attr("transform", function(d) {
                                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                                      })
                                      .on('click', function(d, i) {
									                      $(document).trigger("themeSelected", {"text":d.text, "color":color(i)});
                                      })
                                      .text(function(d) { return d.text; });
                                }
                          } });
          //          });

                }

    };
  });
