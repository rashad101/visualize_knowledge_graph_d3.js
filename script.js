
var w = 700;
var h = 400;
var linkDistance=200;

var colors = d3.scale.category10();
var linkedByIndex = {};
var dataset = {

nodes: [
        {name: "Adam"},
        {name: "Bob"},
        {name: "Carrie"},
        {name: "Donovan"},
        {name: "Edward"},
        {name: "Felicity"},
        {name: "George"},
        {name: "Hannah"},
        {name: "Iris"},
        {name: "Jerry"}
    ],

    edges: [
    {source: 0, target: 1, weight: "a"},
    {source: 0, target: 2, weight: "b"},
    {source: 0, target: 3, weight: "c"},
    {source: 0, target: 4, weight: "d"},
    {source: 1, target: 5, weight: "e"},
    {source: 2, target: 5, weight: "f"},
    {source: 2, target: 5, weight: "g"},
    {source: 3, target: 4, weight: "h"},
    {source: 5, target: 8, weight: "i"},
    {source: 5, target: 9, weight: "j"},
    {source: 6, target: 7, weight: "k"},
    {source: 7, target: 8, weight: "l"},
    {source: 8, target: 9, weight: "m"}
    ]
    };

var connection = {
    "0_1":1,
    "0_2":1,
    "0_3":1,
    "0_4":1,
    "1_5":1,
    "2_5":1,
    "2_5":1,
    "3_4":1,
    "5_8":1,
    "5_9":1,
    "6_7":1,
    "7_8":1,
    "8_9":1,
};


    var svg = d3.select(".graph").append("svg").attr({"width":w,"height":h});

    var force = d3.layout.force()
        .nodes(dataset.nodes)
        .links(dataset.edges)
        .size([w,h])
        .linkDistance([linkDistance])
        .charge([-350])
        .theta(0.1)
        .gravity(0.1)
        .start();



    var edges = svg.selectAll("line")
      .data(dataset.edges)
      .enter()
      .append("line")
      .attr("id",function(d,i) {return 'edge'+i})
      .attr('marker-end','url(#arrowhead)')
      .style("stroke","#ccc")
      .style("pointer-events", "none");

    var nodes = svg.selectAll("circle")
      .data(dataset.nodes)
      .enter()
      .append("circle")
      .attr({"r":18})
      .style("fill",function(d,i){return colors(i);})
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .call(force.drag)


    var nodelabels = svg.selectAll(".nodelabel")
       .data(dataset.nodes)
       .enter()
       .append("text")
       .attr({"x":function(d){return d.x;},
              "y":function(d){return d.y;},
              "class":"nodelabel",
              'font-weight':"normal",
              "stroke":"black"})
       .text(function(d){return d.name;});

    var edgepaths = svg.selectAll(".edgepath")
        .data(dataset.edges)
        .enter()
        .append('path')
        .attr({'d': function(d) {return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y},
               'class':'edgepath',
               'fill-opacity':0,
               'stroke-opacity':0,
               'fill':'blue',
               'stroke':'red',
               'id':function(d,i) {return 'edgepath'+i}})
        .style("pointer-events", "none");

    var edgelabels = svg.selectAll(".edgelabel")
        .data(dataset.edges)
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attr({'class':'edgelabel',
               'id':function(d,i){return 'edgelabel'+i},
               'dx':80,
               'dy':0,
               'font-size':15,
               'font-weight':"bold",
               'fill':'#000000'});

    edgelabels.append('textPath')
        .attr('xlink:href',function(d,i) {return '#edgepath'+i})
        .style("pointer-events", "none")
        .text(d => d.weight);


    svg.append('defs').append('marker')
        .attr({'id':'arrowhead',
               'viewBox':'-0 -5 10 10',
               'refX':25,
               'refY':0,
               'orient':'auto',
               'markerWidth':10,
               'markerHeight':10,
               'xoverflow':'visible'})
        .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#ccc')
            .attr('stroke','#ccc');


    force.on("tick", function(){

        edges.attr({"x1": function(d){return d.source.x;},
                    "y1": function(d){return d.source.y;},
                    "x2": function(d){return d.target.x;},
                    "y2": function(d){return d.target.y;}
        });

        nodes.attr({"cx":function(d){return d.x;},
                    "cy":function(d){return d.y;}
        });

        nodelabels.attr("x", function(d) { return d.x-18; })
                  .attr("y", function(d) { return d.y-20; });

        edgepaths.attr('d', function(d) { var path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
                                           return path});

        edgelabels.attr('transform',function(d,i){
            if (d.target.x<d.source.x){
                bbox = this.getBBox();
                rx = bbox.x+bbox.width/2;
                ry = bbox.y+bbox.height/2;
                return 'rotate(180 '+rx+' '+ry+')';
                }
            else {
                return 'rotate(0)';
                }
        });
    });



function neighboring(a, b) {
    return a.index == b.index || connection[a.index+"_"+b.index]===1 || connection[b.index+"_"+a.index]===1;
}

function mouseover(d) {
	d3.selectAll("circle").attr("r",20).style("stroke","black").style("stroke-width",2.5);
    d3.selectAll("line").style("stroke","black").style("stroke-width",2);
    d3.selectAll(".edgelabel").transition().duration(500)
        .style("opacity", function(o) {
             return o.source === d || o.target === d ? 1 : .1;
        }).style("stroke-width",2.5);
    d3.selectAll("line").transition().duration(500)
        .style("opacity", function(o) {
            return o.source === d || o.target === d ? 1 : .1;
    });
    d3.selectAll("circle").transition().duration(500)
        .style("opacity", function(o) {
            return neighboring(d, o) ? 1 : .1;
        });
}

function mouseout() {
  	d3.selectAll("circle").attr("r",15).style("stroke","white");
    d3.selectAll("line").style("stroke","black").style("stroke-width",1);
    d3.selectAll("line").transition().duration(500).style("opacity", 1);
    d3.selectAll("circle").transition().duration(500).style("opacity", 1);
    d3.selectAll(".edgelabel").transition().duration(500).style("opacity", 1);
    d3.selectAll("textPath").transition().duration(500).style("opacity", 1);

}
