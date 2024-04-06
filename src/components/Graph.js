import "./Graph.css";
import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import dlIcon from "../assets/download.svg";
import { saveSvgAsPng } from 'save-svg-as-png';
import * as chroma from 'chroma-js';

const sampleKeys = ["groupA", "groupB", "groupC", "groupD", "groupE"];
const sampleData = [
  {
    x: 1,
    groupA: 38,
    groupB: 19,
    groupC: 9,
    groupD: 4,
  },
  {
    x: 2,
    groupA: 16,
    groupB: 14,
    groupC: 96,
    groupD: 40,
  },
  {
    x: 3,
    groupA: 64,
    groupB: 96,
    groupC: 64,
    groupD: 40,
  },
  {
    x: 4,
    groupA: 32,
    groupB: 48,
    groupC: 64,
    groupD: 40,
  },
  {
    x: 5,
    groupA: 12,
    groupB: 18,
    groupC: 14,
    groupD: 10,
  },
];

export default function Graph({ props }) {
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [max, setMax] = useState(0);
  const [themeColor, setThemeColor] = useState("purple");

  const startAge = 55;
  const endAge = 99;

  useEffect(() => {
    const calculateGraphData = (props) => {
      if (props.populated) {
        let tmp = [];
        let tmpMax = 0;
        let invested = 0;
        const realGrowthRate = 0.03;

        for (let age = startAge; age <= endAge; age++) {
          let tmpObj = {};

          // Set income values
          tmpObj.x = age;
          tmpObj.workIncome = age < 67 ? parseInt(props.workIncome) : 0;
          tmpObj.socialSecurity =
            age >= 70 ? parseInt(props.socialSecurity) : 0;
          tmpObj.pension = age >= 67 ? parseInt(props.pension) : 0;
          tmpObj.realEstate = parseInt(props.realEstate);
          tmpObj.otherIncome = props.otherIncome
            ? parseInt(props.otherIncome)
            : 0;

          // calculate and set investments
          if (age < 67) {
            invested += (invested * realGrowthRate) | 0;
            invested += parseInt(props.investing);
          }

          tmpObj.investing = age >= 67 ? (invested * realGrowthRate) | 0 : 0;

          // raise max y on chart
          let newTotal =
            parseInt(tmpObj.workIncome) +
            parseInt(tmpObj.socialSecurity) +
            parseInt(tmpObj.pension) +
            parseInt(tmpObj.realEstate) +
            parseInt(tmpObj.otherIncome) +
            parseInt(tmpObj.investing);

          if (newTotal > tmpMax) {
            tmpMax = newTotal;
          }

          tmp.push(tmpObj);
        }
        setData(tmp);
        setKeys([
          "workIncome",
          "socialSecurity",
          "pension",
          "realEstate",
          "otherIncome",
          "investing",
        ]);
        setMax(tmpMax);
      } else {
        setData(sampleData);
        setKeys(sampleKeys);
        setMax(300);
      }
    };

    calculateGraphData(props);
  }, [max, props]);

  const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };
  const width = 825;
  const height = 400;

  // bounds = area inside the graph axis = calculated by substracting the margins
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left - 125;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // color palette
  var color_scale = chroma.scale([themeColor, 'white']);

  var color = d3.scaleOrdinal()
    .domain([keys])
    .range([
      color_scale(0.1).hex(),
      color_scale(0.6).hex(),
      color_scale(0.5).hex(),
      color_scale(0.4).hex(),
      color_scale(0.3).hex(),
      color_scale(0.2).hex(),
    ]);

  // Data Wrangling: stack the data
  const stackSeries = d3
    .stack()
    .keys(keys)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);
  const series = stackSeries(data);

  // Y axis
  // const max = 300; // todo
  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, max || 0])
      .range([boundsHeight, 0]);
  }, [boundsHeight, max]);

  // X axis
  const [xMin, xMax] = d3.extent(data, (d) => d.x);
  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([xMin || 0, xMax || 0])
      .range([0, boundsWidth]);
  }, [xMin, xMax, boundsWidth]);

  // Render the X and Y axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g").call(yAxisGenerator);

    //     // create a tooltip
    //   var Tooltip = d3.select("#div_template")
    //   .append("div")
    //   .style("opacity", 0)
    //   .attr("class", "tooltip")
    //   .style("background-color", "white")
    //   .style("border", "solid")
    //   .style("border-width", "2px")
    //   .style("border-radius", "5px")
    //   .style("padding", "5px")

    // // Three function that change the tooltip when user hover / move / leave a cell
    // var mouseover = function(d) {
    //   Tooltip
    //     .style("opacity", 1)
    //   d3.select(this)
    //     .style("stroke", "black")
    //     .style("opacity", 1)
    // }
    // var mousemove = function(d) {
    //   Tooltip
    //     .html("The exact value of<br>this cell is: " + d.value)
    //     .style("left", (d3.pointer(this)[0]+70) + "px")
    //     .style("top", (d3.pointer(this)[1]) + "px")
    // }
    // var mouseleave = function(d) {
    //   Tooltip
    //     .style("opacity", 0)
    //   d3.select(this)
    //     .style("stroke", "none")
    //     .style("opacity", 0.8)
    // }

    // // add the squares
    // svgElement.selectAll()
    //   .data(data, function(d) {return d.group+':'+d.variable;})
    //   .enter()
    //   .append("rect")
    //     .attr("x", function(d) { return xScale(d.group) })
    //     .attr("y", function(d) { return yScale(d.variable) })
    //     .attr("rx", 4)
    //     .attr("ry", 4)
    //     .attr("width", 100 )
    //     .attr("height", 100 )
    //     .style("fill", '#9a6fb0' )
    //     .style("stroke-width", 4)
    //     .style("stroke", "none")
    //     .style("opacity", 0.8)
    //   .on("mouseover", mouseover)
    //   .on("mousemove", mousemove)
    //   .on("mouseleave", mouseleave)

    // What to do when one group is hovered
    var highlight = function (d) {
      console.log(d)
      // reduce opacity of all groups
      d3.selectAll(".myArea").style("opacity", .1)
      // expect the one that is hovered
      d3.select("." + d.srcElement.__data__).style("opacity", 1)
    }

    // And when it is not hovered anymore
    var noHighlight = function (d) {
      d3.selectAll(".myArea").style("opacity", 1)
    }


    // Add one dot in the legend for each name.
    var size = 20
    svgElement.selectAll("myrect")
      .data(keys)
      .enter()
      .append("rect")
      .attr("x", 650)
      .attr("y", function (d, i) { return (10 + i * (size + 5)) + 150 }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("width", size)
      .attr("height", size)
      .style("fill", function (d) { return color(d) })
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight)

    // Add one dot in the legend for each name.
    svgElement.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
      .attr("x", 650 + size * 1.2)
      .attr("y", function (d, i) { return (10 + i * (size + 5) + (size / 2)) + 150 }) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function (d) { return color(d) })
      .text(function (d) { return d })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight)

  }, [xScale, yScale, boundsHeight, themeColor, color, keys]);

  // Build the line
  const areaBuilder = d3
    .area()
    .x((d) => {
      return xScale(d.data.x);
    })
    .y1((d) => yScale(d[1]))
    .y0((d) => yScale(d[0]));

  const allPath = series.map((serie, i) => {
    const path = areaBuilder(serie);
    return (
      <path
        key={i}
        d={path}
        opacity={1}
        stroke="none"
        fill={color(serie.key)}
        class={"myArea " + serie.key}
      />
    );
  });

  const downloadScenario = () => {
    saveSvgAsPng(document.getElementById("diagram"), "scenario.png");
  }

  return (
    <>
      <div className="graphwrapper">
        <svg id="diagram" width={width} height={height}>
          <g
            width={boundsWidth}
            height={boundsHeight}
            transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
          >
            {allPath}
          </g>
          <g
            width={boundsWidth}
            height={boundsHeight}
            ref={axesRef}
            transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
          />
        </svg>
        <div className="optionsrow">
          <select className="colorpicker" onChange={(e) => setThemeColor(e.target.value)}>
            <option value="purple">Purple</option>
            <option value="orange">Orange</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="red">Red</option>
          </select>
          <button className="link download" onClick={downloadScenario} ><img src={dlIcon} alt="Download" /></button>
        </div>
      </div>
    </>
  );
}
