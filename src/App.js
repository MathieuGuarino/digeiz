import React from 'react'
import './App.css'
import { trajectoires } from './trajectoires'
import CanvasJSReact from './canvasjs.react'
import { colors } from './colors'

/* App.js */
var Component = React.Component;
//var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
/* Check CanvasJS documentation :
https://canvasjs.com/docs/charts/basics-of-creating-html5-chart/ */

let charts = []
let maxX = 0
let maxY = 0
const deltaAxis = 1
const minimumXYAxis = 0
const legendMaxWidth = 450
const chartOpacity = .75
var windowsHeight = window.innerHeight; // adapt the chart height to the window height

// Formatting the data to be displayed on a chart

// loop each trajectories
for (var i = 0; i < trajectoires.length; i ++){

  let x = 0
  let y = 0
  let previousx = 0
  let previousy = 0
  let movingStartTime = 0
  let movingEndTime = 0
  const LabelFontSize = 10

  let dataPoints = trajectoires[i].points.map( coordinates => {
    /* initialize startTime variable for the first value
    and check if stored value is greater than current value (happen when timestamps are not sorted)*/
    if (movingStartTime === 0 || movingStartTime > coordinates.time) movingStartTime = coordinates.time
    if (coordinates.time > movingEndTime ) movingEndTime = coordinates.time // store the last timestamp value
    coordinates.indexLabel = coordinates.time.toString() // use the timestamp as label when hovering a point with the mouse
    coordinates.indexLabelFontSize = LabelFontSize
    // store the movement in x and y position
    x = x + Math.abs(coordinates.x - previousx)
    y = y + Math.abs(coordinates.y - previousy)

    // store XY max values to define the chart limits
    if (coordinates.x > maxX) maxX = coordinates.x
    if (coordinates.y > maxY) maxY = coordinates.y
    delete coordinates.time // remove the unused key

    previousx = coordinates.x
    previousy = coordinates.y

    return coordinates
  })
  const distance = Math.sqrt(Math.pow(x,2)+Math.pow(y,2)) // distance in XY plan = √(x²+y²)
  const travelTime = movingEndTime - movingStartTime
  const speed = (distance / travelTime).toPrecision(2) // limit precision to be displayed

  // Fill the chart with x,y data and calculated speed
  let chart = {}
  chart.showInLegend = true
  chart.legendText = `ID : ${trajectoires[i].id}, speed : ${speed} unit / unit`
  chart.type = "spline"
  chart.toolTipContent = "x: {x} y:{y}"
  chart.dataPoints = dataPoints
  chart.color = colors[i]
  chart.fillOpacity = chartOpacity
  charts.push(chart)
}

class App extends Component {

	render() {
		const options = {
      axisX:{
        title: "X position",
        minimum: minimumXYAxis,
        maximum: maxX+deltaAxis
       },
       axisY:{
        title: "Y position",
        minimum: minimumXYAxis,
        maximum: maxY+deltaAxis
       },
			animationEnabled: true,
			title:{
				text: "Position graphs"
      },
      legend: {
        itemMaxWidth: legendMaxWidth,
        itemWrap: true
      },
      height: windowsHeight,
			data: charts
		}
		return (
		<div>
			<CanvasJSChart options = {options}
			/>
			{}
		</div>
		);
	}
}
export default App;
