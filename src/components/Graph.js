import "./Graph.css";
import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

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
  const width = 700;
  const height = 400;

  // bounds = area inside the graph axis = calculated by substracting the margins
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

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
  }, [xScale, yScale, boundsHeight]);




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
        fill="#9a6fb0"
        fillOpacity={i / 10 + 0.1}
      />
    );
  });

  return (
    <>
      <div>
        <svg width={width} height={height}>
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
      </div>
    </>
  );
}
