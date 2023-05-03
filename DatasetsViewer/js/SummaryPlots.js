import "d3-selection";
import * as d3 from "d3";
import {select, selectAll, event, mouse} from "d3-selection";
import {brush} from  "d3-brush";
import {scaleBand, scaleLinear, scaleOrdinal} from "d3-scale";
import {rollups} from "d3-array";
// import {constants, extractMetric, getPrimitiveLabel} from "../helpers";
// import "d3-transition";
import {axisLeft } from "d3-axis";
import {line, symbols, symbol, symbolCircle, symbolCross, symbolDiamond, symbolSquare, symbolStar, symbolTriangle, symbolWye} from "d3-shape";
import { d3Cloud } from "d3-cloud"; 
import './ScatterPlot.css';

const mySymbols = [
  symbolCircle,
  symbolCross,
  symbolDiamond,
  symbolSquare,
  symbolTriangle,
  symbolWye,
  symbolStar
];

// export function computePipelineMatrixWidthHeight(pipelines, moduleNames, expandedPrimitiveData) {
//   let svgWidth = constants.pipelineNameWidth + moduleNames.length * constants.cellWidth + constants.pipelineScoreWidth +
//     constants.margin.left + constants.margin.right;

//   if (expandedPrimitiveData) {
//     svgWidth += expandedPrimitiveData.orderedHeader.length * constants.cellWidth + constants.widthSeparatorPrimitiveHyperparam;
//   }

//   const svgHeight = pipelines.length * constants.cellHeight + constants.moduleNameHeight + constants.moduleImportanceHeight +
//     constants.margin.top + constants.margin.bottom;

//   return {svgWidth, svgHeight};
// }

// function computeBracketsHyperparams(orderedHeader) {

//   if (orderedHeader.length === 0) {
//     return [];
//   }

//   let currentBegin = orderedHeader[0];
//   let brackets = [];
//   const getKey = (x) => x.split(":")[0];

//   for (let i = 1; i < orderedHeader.length; ++i) {
//     if (getKey(currentBegin) !== getKey(orderedHeader[i])) {
//       brackets.push({
//         begin: currentBegin,
//         end: orderedHeader[i - 1]
//       });
//       currentBegin = orderedHeader[i]
//     }
//   }
//   // Adding last bracket
//   brackets.push({
//     begin: currentBegin,
//     end: orderedHeader[orderedHeader.length - 1]
//   });
//   return brackets;
// }

const hoveredColor = "#720400";
const unhoveredColor = "#797979";

// function plotModuleSeparatorLines(svg, pipelines, moduleNames, infos, colScale, sortColumnBy){
//   const separators = [];
//   if (sortColumnBy === constants.sortModuleBy.moduleType){
//     let prevModuleType = infos[moduleNames[0]].module_type;
//     for (const moduleName of moduleNames){
//       const moduleType = infos[moduleName].module_type;
//       if (moduleType !== prevModuleType){
//         separators.push(colScale(moduleName));
//         prevModuleType = moduleType;
//       }
//     }
//   }

//   const separatorLines = svg.selectAll(".separatorLines")
//     .data([separators])
//     .join(
//       enter => enter
//         .append("g")
//         .attr("class", "separatorLines"),
//       update => update
//   );

//   separatorLines.selectAll("line")
//     .data(x => x)
//     .join(
//       enter => enter
//         .append("line")
//         .attr("x1",x=>x + constants.margin.left + constants.pipelineNameWidth)
//         .attr("x2",x=>x + constants.margin.left + constants.pipelineNameWidth)
//         .attr("y1",constants.margin.top + constants.moduleNameHeight - constants.cellHeight)
//         .attr("y2",constants.margin.top + constants.moduleNameHeight + constants.moduleImportanceHeight + constants.cellHeight * pipelines.length)
//         .style("stroke", hoveredColor)
//         .style("stroke-dasharray", 4),
//       update => update
//     )
// }

function getScalesWordFrequency (data, attrName, widthBarChart, heightBarChart) {
    let words = data.map(d => d[attrName]).join(' ');
    let words_freq = wordFreq(words).slice(0,10);

    // Add X axis
    let xScaleBarChar = d3.scaleLinear()
    .range([ 0, widthBarChart])
    .domain([0, words_freq[0].size]);

    // Y axis
    let yScaleBarChar = d3.scaleBand()
    .range([ 0, heightBarChart ])
    .domain(words_freq.map(function(d) { return d.text; }))
    .padding(.1);

    return  [words_freq, xScaleBarChar, yScaleBarChar]
}

function getScalesDataTypeFrequency (data, widthBarChart, heightBarChart) {

    let datatypeFreq = [
                        // {"text": "Size", "size": d3.sum(data, item => item.size)},
                        {"text": "Categorical", "size": d3.sum(data, item => item.num_categorical)},
                        {"text": "Spatial", "size": d3.sum(data, item => item.num_spatial)},
                        {"text": "Temporal", "size": d3.sum(data, item => item.num_temporal)}
                        ].sort((a, b) => b.size - a.size);;

    // Add X axis
    let xScaleDTBarChar = d3.scaleLinear()
    .range([ 0, widthBarChart])
    .domain([0, d3.max(datatypeFreq, d => d.size)]);

    // Y axis
    let yScaleDTBarChar = d3.scaleBand()
    .range([ 0, heightBarChart ])
    .domain(datatypeFreq.map(function(d) { return d.text; }))
    .padding(.1);

    return  [datatypeFreq, xScaleDTBarChar, yScaleDTBarChar];
}

function getScaleParallelCoordinate (data) {
    const dataPC = data.map(d=> ({"size":d.size,  "num_categorical":d.num_categorical, "num_spatial": d.num_spatial, "num_temporal":d.num_temporal }));
    const attributesPC = Object.keys(dataPC[0]);

    var yScalePCPlot = {}
    for(var i in attributesPC) {
        let name = attributesPC[i]
        yScalePCPlot[name] = d3.scaleLinear()
        .domain( d3.extent(dataPC, function(d) { return +d[name]; }) )
        .range([110, 0])
    }

    // Build the X scale -> it find the best position for each Y axis
    var xScalePCPlot = d3.scalePoint()
        .range([0, 400])
        .padding(1)
        .domain(attributesPC);

    return  [dataPC, attributesPC, xScalePCPlot, yScalePCPlot];
}

function updateBarChart(moduleWordFrequency, textdata, xScaleBarChar, yScaleBarChar, marginTop) {
    moduleWordFrequency
    .selectAll(".horizontalplot")
    .data(textdata)
    .join(
      enter => enter.append("rect")
        .attr("class", "horizontalplot")
        .attr("x", xScaleBarChar(0))
        .attr("y", d => yScaleBarChar(d.text)+marginTop)
        .attr("width", d => xScaleBarChar(d.size) - xScaleBarChar(0))
        .attr("height", yScaleBarChar.bandwidth())
        .attr('fill', 'blue')
        .attr('fill-opacity', 0.2)
    );
    moduleWordFrequency
    .selectAll(".horizontaltextplot")
    .data(textdata)
    .join(
      enter => enter.append("text")
        .text(d => d.text)
        .attr("class", "horizontaltextplot")
        .attr("x", xScaleBarChar(0))
        .attr("y", d => yScaleBarChar(d.text)+8+marginTop)
        .attr("font-size", "12px")
        .attr('fill', 'black')
    );
}

function updateParallelCoordinatePlot(dataPC, attributes, moduleParalellCoordinate, moduleParalellCoordinateAxis, xScalePCPlot, yScalePCPlot) {
    const shortAttributeNames = new Map(
        Object.entries({
            size: "Size",
            num_categorical: "Categorical",
            num_spatial: "Spatial",
            num_temporal: "Temporal",
        })
    );

    moduleParalellCoordinate //.append("g")
    .selectAll(".paralellcoordinateplot")
    .data(dataPC)
    .join(
      enter => enter.append("path")
        .attr("class", "paralellcoordinateplot")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 0.4)
        //paint the polylines
        //https://observablehq.com/@sophiegri/exercise-2-scatterplot-matrix
        .attr("stroke", "gray")
        //set the lines
        //https://observablehq.com/@d3/parallel-coordinates
        .attr("d", d => d3.line()(attributes.map(function(p) { return [xScalePCPlot(p), yScalePCPlot[p](d[p])]; })))
    );

    //https://observablehq.com/@d3/parallel-coordinates
    //set axis to the right and set the text
    moduleParalellCoordinateAxis.each(function(d) { d3.select(this).call(d3.axisRight().scale(yScalePCPlot[d])); })
    .call(g => g.append("text")
        .attr("class", "PCAxis")
        //position of the text
        .attr("x", 0)
        .attr("y", -6)
        .attr("text-anchor", "start")
        .attr("fill", "currentColor")
        //.get(d) gets the short name (value) from the Map shortAttributeNames
        .text(d => shortAttributeNames.get(d)));
        // .text(function(d) { return d; }));
}
  
function highlightSelected(data, moduleWordFrequency, freqTitle, xScaleBarChar, yScaleBarChar, marginTop, widthBarChart, heightBarChart,
                                 moduleWordFrequencyDescrip, freqDescrip, xScaleBarCharDescrip, yScaleBarCharDescrip,
                                 dataPC, attributesPC, moduleParalellCoordinate, moduleParalellCoordinateAxis, xScalePCPlot, yScalePCPlot,
                                 moduleDataTypeFrequency, datatypeFreq, xScaleDTBarChar, yScaleDTBarChar, widthDTBarChart, heightDTBarChart) {
    const selectedIDs = data.map(d => d.id);
        selectAll('.scatterdot')
            .filter(d => selectedIDs.includes(d.id))
            .style('fill', 'red');
        
        selectAll('.scatterdot')
            .filter(d => !selectedIDs.includes(d.id))
            .style('fill', 'blue');   
     
    // Remove all bar charts
    selectAll(".horizontalplot").remove();
    selectAll(".horizontaltextplot").remove();
    selectAll(".PCAxis").remove();
    selectAll(".paralellcoordinateplot").remove();

    if (data.length > 0 ){
        [freqTitle, xScaleBarChar, yScaleBarChar ] = getScalesWordFrequency (data, "title", widthBarChart, heightBarChart);
        [freqDescrip, xScaleBarCharDescrip, yScaleBarCharDescrip ] = getScalesWordFrequency (data, "description", widthBarChart, heightBarChart);
        [dataPC, attributesPC, xScalePCPlot, yScalePCPlot] = getScaleParallelCoordinate(data);
        [datatypeFreq, xScaleDTBarChar, yScaleDTBarChar] = getScalesDataTypeFrequency(data, widthDTBarChart, heightDTBarChart);


    }
    updateBarChart(moduleWordFrequency, freqTitle, xScaleBarChar, yScaleBarChar, marginTop);
    updateBarChart(moduleWordFrequencyDescrip, freqDescrip, xScaleBarCharDescrip, yScaleBarCharDescrip, marginTop);
    updateBarChart(moduleDataTypeFrequency, datatypeFreq, xScaleDTBarChar, yScaleDTBarChar, marginTop);
    updateParallelCoordinatePlot(dataPC, attributesPC, moduleParalellCoordinate, moduleParalellCoordinateAxis, xScalePCPlot, yScalePCPlot);

}

function wordFreq(string) {
    var stopwords = new Set("i,me,my,myself,we,us,our,ours,ourselves,you,your,yours,yourself,yourselves,he,him,his,himself,she,her,hers,herself,it,its,itself,they,them,their,theirs,themselves,what,which,who,whom,whose,this,that,these,those,am,is,are,was,were,be,been,being,have,has,had,having,do,does,did,doing,will,would,should,can,could,ought,i'm,you're,he's,she's,it's,we're,they're,i've,you've,we've,they've,i'd,you'd,he'd,she'd,we'd,they'd,i'll,you'll,he'll,she'll,we'll,they'll,isn't,aren't,wasn't,weren't,hasn't,haven't,hadn't,doesn't,don't,didn't,won't,wouldn't,shan't,shouldn't,can't,cannot,couldn't,mustn't,let's,that's,who's,what's,here's,there's,when's,where's,why's,how's,a,an,the,and,but,if,or,because,as,until,while,of,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,upon,down,in,out,on,off,over,under,again,further,then,once,here,there,when,where,why,how,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,say,says,said,shall".split(","));
    // split text. It becomes an array of string.
    var words = string.replace(/[.]/g, '').split(/\s/);
    // remove stop words
    var nostopwords = words.map(w => w.replace(/^[“‘"\-—()\[\]{}]+/g, ""))
        .map(w => w.replace(/[;:.!?()\[\]{},"'’”\-—]+$/g, ""))
        .map(w => w.replace(/['’]s$/g, ""))
        .map(w => w.substring(0, 30))
        .map(w => w.toLowerCase())
        .filter(w => w && !stopwords.has(w));
    var freqMap = {};
    nostopwords.forEach(function(w) {
        if (!freqMap[w]) {
            freqMap[w] = 0;
        }
        freqMap[w] += 1;
    });
    var listValues = [];
    for (const [key, value] of Object.entries(freqMap)) {
      listValues.push({text: key, size: value});
    }
    return listValues.sort((a, b) => b.size - a.size);
}

export function SummaryPlots(ref,
                            dataJSON,
                            widthSVG,
                            xPositionName,
                            yPositionName
                                //    pipelines,
                                //    moduleNames,
                                //    importances,
                                //    selectedPipelines,
                                //    selectedPipelinesColorScale,
                                //    onClick,
                                //    onHover,
                                //    onSelectExpandedPrimitive,
                                //    expandedPrimitiveData,
                                //    expandedPrimitiveName,
                                //    metricRequest,
                                //    highlightPowersetColumns,
                                //    sortColumnBy
                                   ) {
    const data = dataJSON.datasets;

    // var margin = {top: 10, right: 30, bottom: 30, left: 60},
    var margin = {top: 20, right: 0, bottom: 0, left: 0},

    width = widthSVG - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
    // append the svg object to the body of the page
    const svg = select(ref)
        .style("width", width + margin.left + margin.right)
        .style("height", height + margin.top + margin.bottom);
        // .attr('viewBox', '0 0 ' + width + ' ' + height);
    // svg.append("g")
    //     .attr("transform",
    //         "translate(" + margin.left + "," + margin.top + ")")

    svg.selectAll("*").remove();
    const widthBarChart = 200;
    const heightBarChart = 100;
    const marginRightDotPlot = 15;
    // Add X axis
    let xScaleScatterPlot = d3.scaleLinear()
        .domain([0,  d3.max(data, d => d[xPositionName])])
        .range([ 0, width - 2*widthBarChart - marginRightDotPlot]);
    // svg.append("g")
    //     .attr("class", "myXaxis axis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(xScale))
    //     .attr("opacity", "0")

    // Add Y axis
    let yScaleScatterPlot = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[yPositionName])])
        .range([ height-margin.top, margin.top]);
    // svg.append("g")
    //     .attr("class", "axis")
    //     .call(d3.axisLeft(yScale));

    const moduleDots = svg.selectAll("#gdots")
        .data([1])
        .join(
            enter => enter.append("g")
            .attr("id", "gdots")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
    );
    moduleDots.append("text")
    .text("Datasets")
    .attr("x", 0)
    .attr("y", 10)
    .attr("font-size", "12px")
    .attr('fill', 'black');
    
    moduleDots.append("rect")
    .attr("x", 0)
    .attr("y", margin.top-5)
    .attr("width", width - 2*widthBarChart - marginRightDotPlot + 5)
    .attr("height", height-margin.top)
    .attr("stroke", "grey")
    .attr("stroke-opacity", 0.8)
    .attr('fill', 'white')
    .attr('fill-opacity', 0);

    moduleDots
    .selectAll(".scatterdot")
    .data(data)
    .join(
        enter => enter.append("circle")
        .attr("class", "scatterdot")
        .attr("cx", function (d) { return xScaleScatterPlot(d[xPositionName]); } )
        .attr("cy", function (d) { return yScaleScatterPlot(d[yPositionName]); } )
        .attr("r", 1.5)
        .style("fill", "#69b3a2")
        // .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
        // .on("mouseout", function(){d3.select(this).style("fill", "red");})
    );

    // const getEvent = () => require("d3-selection").event;

    /******************************* PLOTS **********************************/

    // 1. Bar char with frequent words in title
    let [freqTitle, xScaleBarChar, yScaleBarChar ] = getScalesWordFrequency (data, "title", widthBarChart, heightBarChart);

    const moduleWordFrequencyTitle = svg.selectAll("#gwordfrequencytitle")
    .data([1])
    .join(
        enter => enter.append("g")
        .attr("id", "gwordfrequencytitle")
        .attr("transform", `translate(${margin.left+width-2*widthBarChart}, ${margin.top})`)
    );
    moduleWordFrequencyTitle.append("text")
    .text("Title")
    .attr("x", 0)
    .attr("y", 10)
    .attr("font-size", "12px")
    .attr('fill', 'black');

    // 2. Bar char with frequent words in Description
    let [freqDescrip, xScaleBarCharDescrip, yScaleBarCharDescrip ] = getScalesWordFrequency (data, "description", widthBarChart, heightBarChart);

    const moduleWordFrequencyDescrip = svg.selectAll("#gwordfrequencydescrip")
    .data([1])
    .join(
        enter => enter.append("g")
        .attr("id", "gwordfrequencydescrip")
        .attr("transform", `translate(${margin.left+width-widthBarChart +5}, ${margin.top})`)
    );
    moduleWordFrequencyDescrip.append("text")
    .text("Description")
    .attr("x", 0)
    .attr("y", 10)
    .attr("font-size", "12px")
    .attr('fill', 'black');


    const widthDTBarChart = 100;
    const heightDTBarChart = 50;
    let [datatypeFreq, xScaleDTBarChar, yScaleDTBarChar] = getScalesDataTypeFrequency(data, widthDTBarChart, heightDTBarChart);

    // 3. Bar char using data type frequency. Note that it is the sum of all values in the column.
    const moduleDataTypeFrequency = svg.selectAll("#gdatatypefrequency")
    .data([1])
    .join(
        enter => enter.append("g")
        .attr("id", "gdatatypefrequency")
        .attr("transform", `translate(${margin.left+width-widthBarChart-widthBarChart}, ${margin.top+145})`)
    );
    moduleDataTypeFrequency.append("text")
    .text("Data Types")
    .attr("x", 0)
    .attr("y", 10)
    .attr("font-size", "12px")
    .attr('fill', 'black');


    // 4. PARALLEL COORDINATES
    let [dataPC, attributesPC, xScalePCPlot, yScalePCPlot] = getScaleParallelCoordinate(data);

    const moduleParalellCoordinate = svg.selectAll("#gParalellCoordinate")
    .data([1])
    .join(
        enter => enter.append("g")
        .attr("id", "gParalellCoordinate")
        .attr("transform", `translate(${margin.left+width-2*widthBarChart+30}, ${margin.top+160})`)
    );

    const moduleParalellCoordinateAxis = moduleParalellCoordinate.append("g")
    .selectAll(".myAxis")
    .data(attributesPC)
    .join(
        enter => enter.append("g")
        .attr("id", "myAxis")
        .attr("transform", d => `translate(${xScalePCPlot(d)},0)`)
    );

    /********************** BRUSHING ***********************/
    svg
        .on( "mousedown", function() {
            var p = mouse( this);
            svg.append( "rect")
            .attr("class", "selection")
            .attr("x", p[0])
            .attr("y", p[1])
            .attr("width", 0)
            .attr("height", 0)
        })
        .on( "mousemove", function() {
            var s = svg.select( "rect.selection");
            if( !s.empty()) {
                var p = mouse( this);
                var d = {
                        x       : s.attr( "x"), // parseInt( s.attr( "x"), 10),
                        y       :s.attr( "y"), // parseInt( s.attr( "y"), 10),
                        width   : s.attr( "width"), //parseInt( s.attr( "width"), 10),
                        height  : s.attr( "height") //parseInt( s.attr( "height"), 10)
                    };
                var move = {
                        x : p[0] - d.x,
                        y : p[1] - d.y
                };
                var x0 = 0, y0 = 0, x1 = 0, y1 =0;
                if( move.x < 1 || (move.x*2<d.width)) {
                    d.x = p[0];
                    d.width -= move.x;
                } else {
                    d.width = move.x;       
                }

                if( move.y < 1 || (move.y*2<d.height)) {
                    d.y = p[1];
                    d.height -= move.y;
                } else {
                    d.height = move.y;       
                }
                s.attr("x", d.x)
                .attr("y", d.y)
                .attr("width", d.width)
                .attr("height", d.height)

                // const [[x0, y0], [x1, y1]] = ext;
                var x0 = parseFloat(d.x), y0 = parseFloat(d.y) - margin.top, x1 = parseFloat(d.x) + d.width, y1 = parseFloat(d.y) - margin.top + d.height;
                const selected = data.filter(
                            d =>
                                x0 <= xScaleScatterPlot(d[xPositionName]) &&
                                xScaleScatterPlot(d[xPositionName]) < x1 &&
                                y0 <= yScaleScatterPlot(d[yPositionName]) &&
                                yScaleScatterPlot(d[yPositionName]) < y1
                            );
                /********************** UPDATED PLOTS BASED ON DATASETS SELECTION ***********************/
                highlightSelected(selected, moduleWordFrequencyTitle, freqTitle, xScaleBarChar, yScaleBarChar, margin.top, widthBarChart, heightBarChart,
                                            moduleWordFrequencyDescrip, freqDescrip, xScaleBarCharDescrip, yScaleBarCharDescrip,
                                            dataPC, attributesPC, moduleParalellCoordinate, moduleParalellCoordinateAxis, xScalePCPlot, yScalePCPlot,
                                            moduleDataTypeFrequency, datatypeFreq, xScaleDTBarChar, yScaleDTBarChar, widthDTBarChart, heightDTBarChart);
            }
        })
        .on( "mouseup", function() {
            svg.selectAll( ".selection").remove();

        });

        /********************** RENDER PLOTS ***********************/

        // Create bar charts using Title (word frequency)
        updateBarChart(moduleWordFrequencyTitle, freqTitle, xScaleBarChar, yScaleBarChar, margin.top);
        // Create bar charts using Description (word frequency)
        updateBarChart( moduleWordFrequencyDescrip, freqDescrip, xScaleBarCharDescrip, yScaleBarCharDescrip, margin.top);
        // Create bar charts using data types (Categorical, Temporal, and Spatial)
        updateBarChart(moduleDataTypeFrequency, datatypeFreq, xScaleDTBarChar, yScaleDTBarChar, margin.top);
        // Create Parallel Coordinates
        updateParallelCoordinatePlot(dataPC, attributesPC, moduleParalellCoordinate, moduleParalellCoordinateAxis, xScalePCPlot, yScalePCPlot);

}