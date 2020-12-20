const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    dataset = data;

    const svgWidth = 800;
    const svgHeight = 500;

    const padding = 60;

    let svg = d3.select(".svg-content")
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight);

    const xScale = d3.scaleLinear()
                     .domain([d3.min(dataset, data => data["Year"]) - 1, d3.max(dataset, data => data["Year"]) + 1])
                     .range([padding, svgWidth - padding]);

    const yScale = d3.scaleLinear()
                     .domain([d3.max(dataset, data => new Date(data["Seconds"] * 1000)), d3.min(dataset, data => new Date(data["Seconds"] * 1000))])
                     .range([svgHeight - padding, padding]);

    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat("%M:%S"));

    svg.append("g")
       .attr("id", "x-axis")
       .attr("transform", "translate(0," + (svgHeight - padding) + ")")
       .call(xAxis);

    svg.append("g")
       .attr("id", "y-axis")
       .attr("transform", "translate(" + padding + ",0)")
       .call(yAxis);

    let tooltip = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0)
                    .style("display", "flex")
                    .style("align-items", "center")
                    .style("justify-content", "flex-start")
                    .style("position", "absolute")
                    .style("text-align", "left")
                    .style("width", "auto")
                    .style("height", "auto")
                    .style("padding", "6px")
                    .style("font-size", "12px")
                    .style("background-color", "lightsteelblue")
                    .style("box-shadow", "1px 1px 10px")
                    .style("border-radius", "2px")
                    .style("pointer-events", "none");

    svg.selectAll("circle")
       .data(dataset)
       .enter()
       .append("circle")
       .attr("class", "dot")
       .attr("r", "5")
       .attr("data-xvalue", data => data["Year"])
       .attr("data-yvalue", data => new Date(data["Seconds"] * 1000))
       .attr("cx", data => xScale(data["Year"]))
       .attr("cy", data => yScale(new Date(data["Seconds"] * 1000)))
       .attr("fill", data => data["Doping"] === "" ? "rgb(255, 140, 0)" : "rgb(31, 119, 180)")
       .on("mouseover", (data, index) => {
          tooltip.transition()
                 .style("opacity", 1)
                 .style("left", data.pageX + "px")
                 .style("top", data.pageY + "px");

        document.querySelector("#tooltip").setAttribute("data-year", index["Year"]);
        index["Doping"] === "" ?
          document.querySelector("#tooltip").innerHTML =
          index["Name"] + ": " + index["Nationality"] +
          "<br />" +
          "Year: " + index["Year"] + ", Time: " + index["Time"]
          :
          document.querySelector("#tooltip").innerHTML =
          index["Name"] + ": " + index["Nationality"] +
          "<br />" +
          "Year: " + index["Year"] + ", Time: " + index["Time"] +
          "<br />" +
          "<br />" +
          index["Doping"];
       })
       .on("mouseout", () => {
          tooltip.transition()
                 .style("opacity", 0)
       });
  }
)