// const { createFFmpeg, fetchFile } = require("@ffmpeg/ffmpeg");
// const ffmpeg = createFFmpeg({ log: true });

let option;
let chart;
let chartDom;
let init_height;
let init_width;
var play = false;
var colorScale;
var selectColor;
var totalNumber;
// Create scale
var timelineScale;
var hiddleAxisForNonTimeTimeline;
let namesThatAreShown;
let maxValueOverData = 0;

var draw;
var timelineIsTime;

//Styling values
let duration;
let barCount;
let k;
let totalAnim;
let animDuration;
let barSize;
//////////////

//Scales
var x;
var y;
///////////

//Data section
let names;
let discreteCategory;
let imagesDictionary;
let categoryDictionary;
let datevalues;
let keyframes = [];
let nameframes;
let prev;
let next;
let formatNumber = d3.format(",d");
let formatDate = d3.utcFormat("%b %Y");
let tickFormat = undefined;
let timeFrames;
let selectedFrame;
let timer;
///////////////
currentIntervalIndex = 0;
targetIndex = 0;
var outerSvg;
//Buttons path
const playBtnDfinition =
  "M12 12C5.3906 12 0 6.6094 0 0C0 -6.6094 5.3906 -12 12 -12C18.6094 -12 24 -6.6094 24 0C24 6.6094 18.6094 12 12 12ZM12 -11.2969C5.8125 -11.2969 0.7031 -6.2344 0.7031 0C0.7031 6.2344 5.7656 11.2969 12 11.2969C18.2344 11.2969 23.2969 6.2344 23.2969 0C23.2969 -6.2344 18.2344 -11.2969 12 -11.2969ZM8.8594 -2.8594C8.8594 -3.8906 9.6094 -4.3125 10.5 -3.7969L15.4219 -0.9375C16.312 -0.4219 16.312 0.4219 15.4219 0.9375L10.5 3.7969C9.6094 4.3125 8.8594 3.8906 8.8594 2.8594L8.8594 -2.8594Z";
const stopBtnDefinition =
  "M12.0234 12C5.4141 12 0.0234 6.6094 0.0234 0C0.0234 -6.6094 5.4141 -12 12.0234 -12C18.6328 -12 23.9766 -6.6094 23.9766 0C23.9766 6.6094 18.6328 12 12.0234 12ZM12.0234 -11.2969C5.7891 -11.2969 0.7266 -6.1875 0.7266 0C0.7266 6.2344 5.7891 11.2969 12.0239 11.2969C18.2578 11.2969 23.3203 6.2344 23.3203 0C23.2734 -6.1875 18.2109 -11.2969 12.0234 -11.2969ZM14.8359 3.8437C14.8359 4.1255 14.6484 4.3125 14.4141 4.3125L13.8047 4.3125C13.5703 4.3125 13.3828 4.1255 13.3828 3.8437L13.3828 -3.7969C13.3828 -4.0781 13.5703 -4.2656 13.8047 -4.2656L14.4141 -4.2656C14.6484 -4.2656 14.8359 -4.0781 14.8359 -3.7969L14.8359 3.8437ZM10.5703 3.8437C10.5703 4.1255 10.3828 4.3125 10.1484 4.3125L9.5391 4.3125C9.3047 4.3125 9.1172 4.1255 9.1172 3.8437L9.1172 -3.7969C9.1172 -4.0781 9.3047 -4.2656 9.5391 -4.2656L10.1953 -4.2656C10.4297 -4.2656 10.6172 -4.0781 10.6172 -3.7969L10.5703 3.8437Z";
/////////////

//TODO 0: video rendering vars
var canvas;
var context;
var videoStream;
var mediaRecorder;
var currentIntervalIndex, targetIndex;
var imageBase64Dic = {};

console.log({ crossOriginIsolated });
/////////////////////////////////////


// let hiddenDiv = document.createElement('div');
// hiddenDiv.setAttribute("id", "Div1");

// const worker = require('./worker.js');

// worker.postMessage('ping');

// worker.onmessage = (e) => {
//   console.log("Received parent");
//   console.log({b:e});
//   worker.terminate();
//   worker = undefined
// };

// document.querySelector('body').onclick = function() {
//   worker.postMessage([1, 2]);
//   console.log('Message posted to worker');
// }

// myWorker.onmessage = function(e) {
//   worker.log('Message received from worker');
// }

//TODO 1:
function initiateVideoRender() {
  canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 1000;
  document.querySelector("#chart-wrapper").appendChild(canvas);

  context = canvas.getContext("2d");

  /////////////
  videoStream = canvas.captureStream(0);

  mediaRecorder = new MediaRecorder(videoStream);

  mediaRecorder.start();

  var chunks = [];
  mediaRecorder.ondataavailable = function(e) {
    console.log(123);
    chunks.push(e.data);
  };

  mediaRecorder.onstop = async function(e) {
    var blob = new Blob(chunks, { type: "video/webm" });
    chunks = [];
    var videoURL = URL.createObjectURL(blob);
    console.log({ videoURL });

    // ffmpeg.FS("writeFile", "test.webm", await fetchFile(blob));
    // console.time("FF performance");
    // await ffmpeg.run(
    //   "-i",
    //   "test.webm",
    //   "output.webm"
    // );
    // console.timeEnd("FF performance");


    // const ffData = ffmpeg.FS("readFile", "output.webm");
    // const ffURL = URL.createObjectURL(new Blob([ffData.buffer]));

    //AUTO DOWNLOAD LINK
    let link = document.createElement("a");
    link.href = videoURL;
    link.download = "plotset.webm";

    link.click();
    window.URL.revokeObjectURL(videoURL);

    //Emptying local storage
    document.querySelector(".indicator-container").style.visibility = "hidden";
    //localStorage.removeItem('start-record');

    //VIDEO ELEMENT RENDER

    // let vid = document.createElement("video")
    // vid.controls = true;
    // vid.src = videoURL;

    // const myNode = document.querySelector("body");
    // myNode.innerHTML = '';
    // myNode.appendChild(vid)
    console.log("Done!!!");
  };
}

//TODO 2:
//StopCondition should be global var that can be accessible
async function recordFrame() {
  console.time("Export Time");

  //Approach 1 :
  // const svgBlob = await exportSvg();

  //Approach 2 :
  const svgURL = new XMLSerializer().serializeToString(
    document.querySelector("#chart-wrapper").querySelector("svg")
  );
  const svgBlob = new Blob([svgURL], { type: "image/svg+xml" });

  console.timeEnd("Export Time");

  const imgElement = new Image();
  let frameURL = URL.createObjectURL(svgBlob);
  imgElement.src = frameURL;
  imgElement.onload = function() {
    context.drawImage(imgElement, 0, 0);
    window.URL.revokeObjectURL(frameURL);
    videoStream.getVideoTracks()[0].requestFrame();
  };
  if (currentIntervalIndex === targetIndex) {
    console.log("finished");
    mediaRecorder.stop();
    return;
  } else {
    //console.log('yeeey');
    requestAnimationFrame(recordFrame);
  }
}

async function loadBase64Images() {
  
    for (const url of Object.entries(imagesDictionary)){
      let urlAdress = url[1];
      const data = await fetch(urlAdress);
      const blob = await data.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      reader.onloadend = () => {
        const base64data = reader.result;
        //let base64LocalAddress = URL.createObjectURL(base64data);
  
        imageBase64Dic[url[0]] = base64data
        console.log({ base64data });
        //console.log({base64LocalAddress});
      };
      // await new Promise((resolve) => {
      //   reader.onloadend = () => {
      //     const base64data = reader.result;
      //     imageBase64Dic[url[0]] = base64data
      //     console.log({ base64data });
      //     resolve();
      //   };
      // });
      console.log({imageBase64Dic});
    }
  
  
}

const removeSvg = () => {
  d3.select("#title")
    .selectAll("*")
    .remove();
  d3.select("body")
    .selectAll("svg")
    .remove();
};

function mapData() {
  names = new Set(data.map((d) => d.name));
  namesThatAreShown = new Set();

  barCount =
    +config?.bar.countOfBar > names.size ? names.size : +config?.bar.countOfBar;

  discreteCategory = [];

  /////////////////////////////////////////////////////////////
  //Creating Image Dictionary
  //Validating Date

  timelineIsTime = true;

  function isValidDate(dateObject) {
    return new Date(dateObject).toString() !== "Invalid Date";
  }

  imagesDictionary = {};
  categoryDictionary = {};

  data.forEach((d, i) => {
    if (d.value > maxValueOverData) {
      maxValueOverData = d.value;
    }
    //For getting timeline type
    if (timelineIsTime) {
      isValidDate(d.date) == true
        ? (timelineIsTime = true)
        : (timelineIsTime = false);
    }

    discreteCategory.push(d.date);

    if (imagesDictionary[d[col_rel.label]]) return;
    imagesDictionary[d.name] = d.image;

    if (categoryDictionary[d[col_rel.label]]) return;
    categoryDictionary[d.name] = d.category;
  });

  loadBase64Images();

  //////////////////////////////////////////////////////////////
  datevalues = Array.from(
    d3.rollup(
      data,
      ([d]) => +d.value,
      (d) => d.date,
      (d) => d.name
    )
  )
    .map(([date, data], i) =>
      timelineIsTime ? [new Date(date), data] : [i, data]
    )
    .sort(([a], [b]) => d3.ascending(a, b));

  function rank(value) {
    const rankData = Array.from(names, (name) => ({
      name,
      value: value(name),
    }));
    rankData.sort((a, b) => d3.descending(a.value, b.value));
    for (let i = 0; i < rankData.length; ++i) {
      if (i < barCount) namesThatAreShown.add(rankData[i]["name"]);
      rankData[i].rank = Math.min(barCount, i);
    }
    return rankData;
  }

  totalAnim = config?.animation.total;
  animDuration = config?.animation.duration;

  k = Math.ceil((totalAnim * 1000) / animDuration / col_rel.values.length);

  keyframes = [];
  let ka, a, kb, b;
  let loopIndex = 0;
  for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
    for (let i = 0; i < k; ++i) {
      loopIndex++;
      const t = i / k;
      keyframes.push([
        timelineIsTime ? new Date(ka * (1 - t) + kb * t) : loopIndex,
        rank((name) => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t),
      ]);
    }
  }
  keyframes.push([
    timelineIsTime ? new Date(kb) : ++loopIndex,
    rank((name) => b.get(name) || 0),
  ]);

  nameframes = d3.groups(
    keyframes.flatMap(([, data]) => data),
    (d) => d.name
  );

  prev = new Map(
    nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a]))
  );

  next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)));

  formatNumber = d3.format(",d");
  formatDate = d3.utcFormat("%b %Y");

  tickFormat = undefined; // override as desired

  timeFrames = Array.from(keyframes, (d) => d[0]);
  console.log("Data finish");
}

function createChart() {



  //TODO 3 :
  if (canvas) {
    canvas.width = width;
    canvas.height = height;
  }

  if (
    barCount != +config?.bar.countOfBar ||
    totalAnim !== config?.animation.total ||
    animDuration !== config?.animation.duration
  ) {
    barCount =
      +config?.bar.countOfBar > names.size
        ? names.size
        : +config?.bar.countOfBar;
    mapData();
  }

  init_height = height;
  init_width = width;

  ///color//////////////////////////////////////////////////
  colorScale = d3.scaleLinear().domain([0, [...names].length]);
  if (config.palette.type == "spectrum")
    colorScale.range([config.palette.colors[0], config.palette.colors[1]]);

  function calculateFontSize(svgHeight, svgWidth, userFontSize) {
    const fontScale = d3
      .scaleLinear()
      .domain([300, 4000])
      .range([0.3, 7]);
    const screenSize = Math.max(300, Math.min(svgHeight, svgWidth));

    return fontScale(screenSize) * userFontSize;
  }

  function calculateScaleSize(svgHeight, svgWidth, userFontSize) {
    const fontScale = d3
      .scaleLinear()
      .domain([300, 4000])
      .range([0.9, 2]);
    const screenSize = Math.max(300, Math.min(svgHeight, svgWidth));
    return fontScale(screenSize) * userFontSize;
  }

  function calculatePointerSize(svgHeight, svgWidth, userFontSize) {
    const fontScale = d3
      .scaleLinear()
      .domain([300, 4000])
      .range([0.5, 3]);
    const screenSize = Math.max(300, Math.min(svgHeight, svgWidth));
    return fontScale(screenSize) * userFontSize;
  }
  ///scale fot text////
  const timelineAxisScale = d3
    .scaleLinear()
    .domain([0, 1800])
    .range([3, 20]);

  const tickerScale = d3
    .scaleLinear()
    .domain([0, 1800])
    .range([40, 160]);

  const labelScale = d3
    .scaleLinear()
    .domain([0, 1400])
    .range([4, 22]);

  //////
  selectColor = (config, i) => {
    if (config.palette.type == "mono") {
      return config.palette.colors;
    } else if (config.palette.type == "multi") {
      return config.palette.colors;
    } else if (config.palette.type == "spectrum") {
      let colors = [];
      for (let i = 0; i < [...names].length; i++) {
        const color = colorScale(i);
        colors.push(color);
      }
      return colors;
    }
  };

  let categories;
  let categoryColor = {};
  if (typeof col_rel.category === "string") {
    categories = [
      ...new Set(Array.from(Object.entries(categoryDictionary), (d) => d[1])),
    ];

    categories.forEach((category, i) => {
      categoryColor[category] = selectColor(config)[
        i % selectColor(config).length
      ];
    });
  }

  ////////////////////////////////////////////////////////

  removeSvg();
  const mainSvg = d3
    .select("#chart-wrapper")
    .append("svg")
    .style("background-color", `${config?.palette.bg_color}`)
    .attr("height", init_height)
    .attr("width", init_width);

  const svg = mainSvg
    .append("svg")
    .attr("viewBox", [0, 0, init_width, init_height])
    .style("overflow", "hidden");
  // .attr('height',init_height)
  // .attr('width',init_width)

  var chartBox = plotset.chart.headerFooter(svg, config, width, height);

  const labelsForMargin = svg
    .selectAll(".hiddenLabel")
    .data(namesThatAreShown)
    .enter()
    .append("text")
    .attr("font-family", config?.fonts?.labels)
    .style("fill", `${config?.label.color}`)
    .attr(
      "font-size",
      calculateFontSize(height, width, +config?.label.font_size)
    )
    .style("opacity", 0)
    .attr("class", "hiddenLabel")
    .text((d) => d);

  let longestLabel = 20;
  d3.selectAll(".hiddenLabel")
    .nodes()
    .forEach((d, i) => {
      let currentElementWidth = d.getBoundingClientRect().width;

      if (currentElementWidth > init_width * 0.5) return;
      if (currentElementWidth > longestLabel) {
        longestLabel = currentElementWidth;
      }
      return;
    });
  const calculateLeftMargin = () => {
    if (config?.image.align === "axis" && config?.image.show) {
      return y?.bandwidth?.() + 30;
    }
    if (config?.label.show && config?.image.align === "bar") {
      return longestLabel + 10;
    }
    if (config?.label.show && config?.image.align === "barOut") {
      return longestLabel + 10;
    } else {
      return 12;
    }
  };
  // console.log(calculateLeftMargin(),"left")

  const calculateRightMargin = () => {
    let largestLabel = svg
      .append("text")
      .attr(
        "font-size",
        calculateFontSize(height, width, +config?.label.font_size)
      )
      .attr("font-family", config?.fonts?.value)
      .attr("opacity", 0)
      .text("10,000,000,000,000");

    let size = largestLabel.node().getBBox().width;

    return config?.image?.align === "barOut" ? size + y?.bandwidth?.() : size;
  };

  margin = {
    top: 16 + chartBox.y0,
    right: calculateRightMargin(),
    bottom:
      (config?.timeline.show ? 100 : 70) +
      (init_height - (chartBox.remainHeight + chartBox.y0)),
    left: calculateLeftMargin(),
  };

  svg
    .append("clipPath")
    .attr("id", "hideImages")
    .append("rect") // Everything outside the circle will be clipped and therefore invisible.
    .attr("width", width - margin.left)
    .attr("height", height)
    .attr("y", 0)
    .attr("x", margin.left);

  //let intervalDuration = (+config?.animation.total * 1000) / keyframes.length;

  //For checking if interval is longer than transition
  // duration =
  //   intervalDuration >= +config?.animation?.duration
  //     ? intervalDuration
  //     : +config?.animation?.duration;

  duration = +config?.animation?.duration;

  barSize = (height - margin.top - margin.bottom) / barCount;

  //Init on first frame
  selectedFrame = keyframes[0][0];

  let colorDic = [];
  let nameframeInit = [];
  keyframes[0][1].forEach((e) => {
    nameframeInit.push(e.name);
  });

  nameframeInit.forEach((e, z) => {
    let colorOBj = {};
    colorOBj[e] = selectColor(config)[z % selectColor(config).length];
    colorDic.push(colorOBj);
  });

  function bars(svg) {
    let bar = svg
      .append("g")
      .attr("fill-opacity", 0.8)
      .selectAll("rect");

    let xAxisInit = config?.scale?.type === "linear" ? 0 : 0.0001;
    return ([date, data], transition) =>
      (bar = bar
        .data(data.slice(0, barCount), (d) => d.name)
        .join(
          (enter) =>
            enter
              .append("rect")
              .attr("fill", (d, i) => {
                //COLOR FOR CATEGORICAL
                if (typeof col_rel.category === "string") {
                  return categoryColor[categoryDictionary[d.name]];
                }
                //COLOR FOR NON-CATEGORICAL
                return colorDic.filter((e) => e[d.name])[0][d.name];
              })
              .attr("height", y.bandwidth())
              .attr("x", x(xAxisInit))
              .attr("y", (d) => y((prev.get(d) || d).rank))
              .attr("width", (d) => x((prev.get(d) || d).value) - x(xAxisInit))
              .style("opacity", 1),
          (update) => update,
          (exit) =>
            exit
              .transition(transition)
              .remove()
              .attr("y", (d) => y((next.get(d) || d).rank))
              .attr("width", (d) => x((next.get(d) || d).value) - x(0))
        )
        .call((bar) =>
          bar
            .transition(transition)
            .attr("y", (d) => y(d.rank))
            .style("opacity", 1)
            .attr("width", (d) => x(d.value) - x(xAxisInit))
        ));
  }

  function labels(svg) {
    let label = svg
      .append("g")
      .attr("clip-path", (d) => {
        if (config?.image?.align === "axis") {
          return "url(#hideImages)";
        } else {
          return null;
        }
      })
      .attr("font-family", "Plus Jakarta Sans")
      .attr("text-anchor", "end")
      .selectAll("text");

    return ([date, data], transition) =>
      (label = label
        .data(data.slice(0, barCount), (d) => d.name)
        .join(
          (enter) =>
            enter
              .append("text")
              .attr(
                "transform",
                (d) =>
                  `translate(${
                    config?.image?.align === "axis" ? x(d.value) : longestLabel
                  },${y(d.rank) + 5})`
              )
              .attr("y", y.bandwidth() / 2 - 3)
              .attr("x", -6)
              .attr("dx", 5)
              .attr(
                "font-size",
                calculateFontSize(height, width, +config?.label.font_size)
              )
              .attr("font-family", config?.fonts?.labels)
              .attr("alignment-baseline", "middle")
              .attr("fill", `${config?.label.color}`)
              .attr("fill-opacity", config?.label.show == true ? 1 : 0)

              .text((d) => d.name)
              .call((text) =>
                text
                  .append("tspan")
                  .attr("font-family", config?.fonts?.value)
                  .attr("alignment-baseline", "middle")
                  .attr("fill-opacity", config?.value.show == true ? 0.7 : 0)
                  .attr(
                    "font-size",
                    calculateFontSize(height, width, +config?.value.font_size)
                  )
                  .attr("fill", `${config?.value.color}`)
                  .attr("font-weight", "normal")
                  .attr(
                    "x",
                    (d) =>
                      width * 0.01 +
                      x((d || next.get(d)).value) -
                      (config?.image?.align === "bar"
                        ? longestLabel
                        : config?.image?.align === "barOut"
                        ? longestLabel - 60
                        : x(d.value))
                  )
                  .attr("dy", "0px")
              ),
          (update) => update,
          (exit) =>
            exit
              .transition(transition)
              .remove()
              .attr(
                "transform",
                (d) =>
                  `translate(${
                    config?.image?.align === "axis" ? x(d.value) : longestLabel
                  },${y((next.get(d) || d).rank)})`
              )
          // .call((g) =>
          //   g
          //     .select("tspan")

          //     .tween("text", (d) =>
          //       textTween(d.value, (next.get(d) || d).value)
          //     )
          // )
        )
        //outer label
        .call((label) =>
          label
            .transition(transition)
            .attr(
              "transform",
              (d) =>
                `translate(${
                  config?.image?.align === "axis" ? x(d.value) : longestLabel
                },${y(d.rank) + 5})`
            )
            .call((g) =>
              g
                .select("tspan")
                .attr("text-anchor", "start")
                .attr(
                  "x",
                  (d) =>
                    width * 0.01 +
                    x((d || next.get(d)).value) -
                    (config?.image?.align === "bar"
                      ? longestLabel
                      : config?.image?.align === "barOut" && config?.image.show
                      ? longestLabel - y.bandwidth() - 5
                      : config?.image?.align === "barOut"
                      ? longestLabel
                      : x(d.value))
                )
                .tween("text", (d) =>
                  textTween((prev.get(d) || d).value, d.value)
                )
            )
        ));
  }

  function textTween(a, b) {
    const i = d3.interpolateNumber(a, b);
    return function(t) {
      this.textContent = config?.value.customformatter
        ? config?.customnumberformatter.prefix +
          numeral(i(t)).format(config?.cosutomnumberformatter?.type) +
          config?.customnumberformatter.suffix
        : numeral(i(t)).format(config?.numberformatter?.type);
    };
  }

  function axis(svg) {
    const g = svg
      .append("g")
      .attr("transform", `translate(0,${margin.top})`)
      .attr("class", "axis");

    const axis = d3
      .axisTop(x)
      .ticks(width / 200, tickFormat)
      .tickFormat(function(d, i) {
        return (
          config?.numberformatter.prefix +
          numeral(Number(d)).format(
            config?.numberformatter.type !== "custom"
              ? config?.numberformatter.type
              : config?.numberformatter.custom
          ) +
          config?.numberformatter.suffix
        );
      })
      .tickSizeOuter(0)
      .tickSizeInner(
        config?.timeline.show
          ? -barSize * (barCount + y.padding())
          : -barSize * (barCount + 1 + y.padding())
      );

    return (_, transition) => {
      g.transition(transition).call(axis);
      g.selectAll("text").attr("font-family", "Plus Jakarta Sans");

      g.select(".tick:first-of-type text").remove();
      //TODO : vertical line over charts

      g.selectAll(".tick line")
        .attr("opacity", (d) => (config?.axis?.show ? 1 : 0))
        .attr("stroke", "white")
        .style("stroke-dasharray", (d) =>
          config?.axis?.dashed ? "5,5" : "0,0"
        );

      g.select(".tick:first-of-type line")
        .attr("opacity", () => (config?.yAxisLine.show ? 1 : 0))
        .attr("stroke-width", config?.yAxisLine.width)
        .attr("stroke", config?.yAxisLine.color);

      g.select(".domain").remove();

      if (!config?.xAxis.show) {
        d3.selectAll(".axis g text").remove();
      }
    };
  }

  function timeline(svg) {
    // Append SVG
    var timelineAxis = mainSvg
      .append("svg")
      .attr(
        "y",
        init_height -
          100 -
          (init_height - (chartBox.remainHeight + chartBox.y0))
      )
      .attr("width", width)
      .attr("height", "100");
    var timelineBackground = timelineAxis
      .append("rect")
      .attr("fill", `${config?.palette.bg_color}`)
      .attr("width", width)
      .attr("height", "100");

    if (timelineIsTime) {
      timelineScale = d3
        .scaleTime()
        .domain([d3.min(timeFrames), d3.max(timeFrames)])
        .range([0, width - 100]);
    } else {
      timelineScale = d3
        .scaleBand()
        .domain([...new Set(discreteCategory)])
        .range([0, width - 100]);

      hiddleAxisForNonTimeTimeline = d3
        .scaleBand()
        .domain(timeFrames)
        .range([0, width - 100]);

      //Warning :Dont remove - For creating scaleBand reverse
      hiddleAxisForNonTimeTimeline.invert = function(_) {
        const scale = this;
        const domain = scale.domain;
        const paddingOuter = scale.paddingOuter();
        const paddingInner = scale.paddingInner();
        const step = scale.step();

        const range = scale.range();
        var domainIndex,
          n = domain().length,
          reverse = range[1] < range[0],
          start = range[reverse - 0],
          stop = range[1 - reverse];

        if (_ < start + paddingOuter * step) domainIndex = 0;
        else if (_ > stop - paddingOuter * step) domainIndex = n - 1;
        else domainIndex = Math.floor((_ - start - paddingOuter * step) / step);

        return domain()[domainIndex];
      };
    }
    // Add scales to axis
    var x_axis = d3
      .axisBottom()
      .tickSize(5)
      .tickSizeOuter(10)
      .scale(timelineScale);

    //Append group and insert axis
    timelineAxis
      .on("click", (event) => {
        if (event.x < 60) return;

        play ? false : true;
        clearInterval(timer);

        try {
          if (timelineIsTime) {
            let frameFromPositiom = timelineScale.invert(event.x - 60);

            let index;
            for (let i = 0; i < timeFrames.length; i++) {
              if (frameFromPositiom - timeFrames[i] < 0) break;
              index = i;
            }

            update(keyframes[index], 200, 50);

            selectedFrame = keyframes[index][0];
          } else {
            let frameFromPositiom = hiddleAxisForNonTimeTimeline.invert(
              event.x
            );

            let index;
            for (let i = 0; i < timeFrames.length; i++) {
              if (frameFromPositiom - timeFrames[i] < 0) break;
              index = i;
            }

            update(keyframes[index], 200, 50);

            selectedFrame = keyframes[index][0];
          }
        } catch (e) {
          update(keyframes[0], 200, 50);
          selectedFrame = keyframes[0][0];
        }
      })
      .append("g")
      .call(x_axis)
      .attr("class", "timelineAxis")
      .attr("transform", "translate(60, 50)")
      .attr("font-size", timelineAxisScale(width))
      .append("path")
      .attr("id", "symbol")
      .attr(
        "d",
        d3
          .symbol()
          .type(d3.symbolTriangle)
          .size(calculatePointerSize(height, width, 100))
      )
      .attr("transform", "rotate(180)")
      .attr("fill", "#0061F7")
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    //add overlapping x axis////

    var pass = [];
    d3.selectAll(".timelineAxis .tick text").each(function(d, i) {
      if (!plotset.common.hasOverLap(d3.select(this).node(), pass))
        pass.push(d3.select(this));
      else d3.select(this).remove();
    });
    /////////

    //add margin to x axis label////
    d3.selectAll(".timelineAxis .tick text").attr(
      "transform",
      "translate(0,8)"
    );
    ////////

    //Coloring axis properties
    timelineAxis.select("path").attr("stroke", "#a4b1d7");
    timelineAxis
      .selectAll("text")
      .attr("fill", "#a4b1d7")
      .attr("font-family", "Plus Jakarta Sans");

    timelineAxis
      .append("g")
      .call((timeline) => {
        timeline
          .append("circle")
          .attr("class", "playBtn")
          .attr("cx", "20")
          .attr("cy", "50")
          .attr("r", "30")
          // .attr("stroke" , '#000')
          // .attr("stroke-width",2)
          .attr("fill", "transparent")
          .on("click", () => {
            play ? (play = false) : (play = true);

            if (play) {
              startLoop();
              draw
                .attr("fill", "#a4b1d7")
                .attr("d", stopBtnDefinition)
                .attr("dx", "20")
                .attr(
                  "transform",
                  `translate(0 , 50) scale(${calculateScaleSize(
                    height,
                    width,
                    1.8
                  )})`
                );
            } else {
              clearInterval(timer);
              draw
                .attr("fill", "#0061F7")
                .attr("d", playBtnDfinition)
                .attr("dx", "20")
                .attr(
                  "transform",
                  `translate(0 , 50) scale(${calculateScaleSize(
                    height,
                    width,
                    1.8
                  )})`
                );
            }
          });
      })
      .call((timeline) => {
        draw = timeline.append("path");
        draw
          .attr("id", "playSymbol")
          .attr("d", playBtnDfinition)
          .attr("fill", "#0061F7")
          .attr("dx", "20")
          .attr(
            "transform",
            `translate(0 , 50) scale(${calculateScaleSize(height, width, 1.8)})`
          )
          .on("click", () => {
            play ? (play = false) : (play = true);

            if (play) {
              startLoop();
              draw
                .attr("fill", "#a4b1d7")
                .attr("d", stopBtnDefinition)
                .attr("dx", "20")
                .attr(
                  "transform",
                  `translate(0 , 50) scale(${calculateScaleSize(
                    height,
                    width,
                    1.8
                  )})`
                );
            } else {
              clearInterval(timer);
              draw
                .attr("fill", "#0061F7")
                .attr("d", playBtnDfinition)
                .attr("dx", "20")
                .attr(
                  "transform",
                  `translate(0 , 50) scale(${calculateScaleSize(
                    height,
                    width,
                    1.5
                  )})`
                );
            }
          });

        if (play) {
          draw.attr("fill", "#a4b1d7");
        } else draw.attr("fill", "#0061F7");
      });

    function dragstarted(d) {
      play ? false : true;
      clearInterval(timer);
    }

    function dragged(event) {
      try {
        if (timelineIsTime) {
          let frameFromPositiom = timelineScale.invert(event.x);

          let index;
          for (let i = 0; i < timeFrames.length; i++) {
            if (frameFromPositiom - timeFrames[i] < 0) break;
            index = i;
          }

          update(keyframes[index], 200, 50);

          selectedFrame = keyframes[index][0];
        } else {
          let frameFromPositiom = hiddleAxisForNonTimeTimeline.invert(event.x);

          let index;
          for (let i = 0; i < timeFrames.length; i++) {
            if (frameFromPositiom - timeFrames[i] < 0) break;
            index = i;
          }

          update(keyframes[index], 200, 50);

          selectedFrame = keyframes[index][0];
        }
      } catch (e) {
        update(keyframes[0], 200, 50);
        selectedFrame = keyframes[0][0];
      }
    }

    function dragended(event) {
      draw
        .attr("fill", "#0061F7")
        .attr("d", playBtnDfinition)
        .attr("dx", "20")
        .attr(
          "transform",
          `translate(0 , 50) scale(${calculateScaleSize(height, width, 1.8)})`
        );
    }

    ////////////////////////////////////////////////////////////////

    return ([date], transition, symbolDuration = duration) => {
      d3.select("#symbol")
        .transition()
        .duration(symbolDuration)
        .ease(d3.easeLinear)
        .attr(
          "transform",
          `  translate(${
            timelineIsTime
              ? timelineScale(date)
              : hiddleAxisForNonTimeTimeline(date)
          }, -10) rotate(180)`
        );
    };
  }

  function ticker(svg) {
    const now = svg
      .call((d) =>
        d
          .append("text")
          .attr("x", width - 300)
          .attr(
            "y",
            init_height -
              (init_height - (chartBox.remainHeight + chartBox.y0)) -
              105
          )
          .attr("class", "textTotal")
          .attr("font-family", config?.fonts.totalizer)
          .attr(
            "font-size",
            calculateFontSize(height, width, +config?.total.font_size)
          )
          .attr("fill-opacity", config?.total.show ? "1" : "0")
          .style("fill", `${config?.total.color}`)
          .text("Total : ")
      )
      .append("text")
      .attr("class", "ticker")
      .attr("font-family", config?.fonts?.ticker)
      .attr("fill-opacity", config?.ticker.show ? "1" : "0")
      .attr(
        "font-size",
        calculateFontSize(height, width, +config.ticker.font_size)
      )
      .style("fill", `${config?.ticker.color}`)
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", margin.top - 25 + barSize * (barCount - 0.45))
      .attr("dy", 0)
      .text(formatDate(keyframes[0][0]));

    const totalLabel = svg
      .append("text")
      .attr(
        "y",
        init_height -
          (init_height - (chartBox.remainHeight + chartBox.y0)) -
          105
      )
      .attr("class", "totalNumber")
      .attr("font-family", config?.fonts.totalizer)
      .attr(
        "font-size",
        config?.total.show
          ? calculateFontSize(height, width, +config?.total.font_size)
          : 0
      )
      .attr("fill-opacity", config?.total.show ? "1" : "0")
      .attr("text-anchor", "start")
      .style("fill", `${config?.total.color}`);

    //Calculate spacings\
    var hiddenTotalSize;
    d3.select(".totalNumber").attr("x", () => {
      let lastFrameTotal = d3.sum(
        keyframes.find(
          (frame) => frame[0] == keyframes[keyframes.length - 1][0]
        )[1],
        (d) => +d.value
      );
      //console.log({lastFrameTotal});
      let hiddenTotal = svg
        .append("text")
        .attr("class", "hiddenTotal")
        .attr("y", -100)
        .attr("font-family", config?.fonts.totalizer)
        .attr(
          "font-size",
          calculateFontSize(height, width, +config?.total.font_size)
        )
        .attr("fill-opacity", 0)
        .text(formatNumber(lastFrameTotal));
      hiddenTotalSize = hiddenTotal.node().getBBox().width;
      return width - (hiddenTotalSize + 30);
    });
    d3.select(".textTotal")
      .attr("x", () => {
        let totalLabelSize = d3
          .select(".textTotal")
          .node()
          .getBBox().width;
        return width - (totalLabelSize + hiddenTotalSize + 30);
      })
      .attr("font-family", config?.fonts.totalizer)
      .attr(
        "font-size",
        calculateFontSize(height, width, +config?.total.font_size)
      );
    d3.select(".ticker").attr("y", () => {
      let totalLableHeight = config?.total.show
        ? d3
            .select(".textTotal")
            .node()
            .getBBox().height
        : 0;
      //let tickerHeight = d3.select(".ticker").node().getBBox().height

      return height - (totalLableHeight + 130);
    });

    // console.log({keyframes});

    let prevTotal = 0;
    let initTotalSize;
    let prevDate = formatDate(keyframes[0][0]);

    return ([date], transition) => {
      const totalPerFrame = d3.sum(
        keyframes.find((frame) => frame[0] == date)[1],
        (d) => +d.value
      );

      if (timelineIsTime) {
        now
          .call((tick) => {
            initTotalSize = initTotalSize
              ? initTotalSize
              : tick.node().getBoundingClientRect().width;
            return tick.attr("x", width - 30);
          })
          .transition()
          .duration(duration)
          .ease(d3.easeSinOut)
          .text(formatDate(date));

        totalLabel
          .transition()
          .duration(duration)
          .ease(d3.easeSinOut)
          .tween("text", function() {
            const i = d3.interpolateNumber(prevTotal, totalPerFrame);

            prevTotal = totalPerFrame;

            return function(t) {
              this.textContent = formatNumber(i(t));
              if (!totalNumber) {
                totalNumber = i(t);
              }
            };
          });
      } else {
        //Warning :Dont remove - For creating scaleBand reverse
        timelineScale.invert = function(_) {
          const scale = this;
          const domain = scale.domain;
          const paddingOuter = scale.paddingOuter();
          const paddingInner = scale.paddingInner();
          const step = scale.step();

          const range = scale.range();
          var domainIndex,
            n = domain().length,
            reverse = range[1] < range[0],
            start = range[reverse - 0],
            stop = range[1 - reverse];

          if (_ < start + paddingOuter * step) domainIndex = 0;
          else if (_ > stop - paddingOuter * step) domainIndex = n - 1;
          else
            domainIndex = Math.floor((_ - start - paddingOuter * step) / step);

          return domain()[domainIndex];
        };
        // now
        // .text(timelineScale.invert(hiddleAxisForNonTimeTimeline(date)))
        // .call(d=>d.append('tspan')
        //   .attr('tranform' , 'translate(20 , 40)')
        //   .attr('dy' , 30)
        //   .attr("x", width - 20)
        //   .attr('font-size' ,  `${config?.total.font_size}`)
        //   .attr("fill-opacity", (config?.total.show)?"1":"0")
        //   .attr('text-anchor' , "start")
        //   .style("fill",`${config?.total.color}`)
        //   .transition()
        //     .duration(duration)
        //   .ease(d3.easeSinOut)
        //   .tween('text', function() {

        //     const i = d3.interpolateNumber(prevTotal, totalPerFrame);

        //     prevTotal = totalPerFrame

        //     return function(t) {
        //       this.textContent = formatNumber(i(t));
        //     };
        //   })
        //   )
        now
          .call((tick) => {
            initTotalSize = initTotalSize
              ? initTotalSize
              : tick.node().getBoundingClientRect().width;
            return tick.attr("x", width - 30);
          })
          .transition()
          .duration(duration)
          .ease(d3.easeSinOut)
          .text(timelineScale.invert(hiddleAxisForNonTimeTimeline(date)));

        totalLabel
          .transition()
          .duration(duration)
          .ease(d3.easeSinOut)
          .tween("text", function() {
            const i = d3.interpolateNumber(prevTotal, totalPerFrame);

            prevTotal = totalPerFrame;

            return function(t) {
              this.textContent = formatNumber(i(t));
              if (!totalNumber) {
                totalNumber = i(t);
              }
            };
          });
      }
    };
  }

  function clipPath(svg) {
    let ClipPath = svg
      .append("g")
      .attr("clip-path", (d) => {
        if (config?.image?.align === "axis") {
          return null;
        } else {
          return "url(#hideImages)";
        }
      })
      .attr("class", "clip")
      .attr("fill-opacity", 1)
      .selectAll("g");

    let imageSize = y.bandwidth();
    let calculateImgMargin = (xPos) => {
      return config?.image?.align === "barOut"
        ? xPos + 5
        : config?.image?.align === "bar"
        ? xPos - imageSize
        : 10;
    };


    return ([date, data], transition) =>
      (ClipPath = ClipPath.data(data.slice(0, barCount), (d) => d.name)
        .join(
          (enter) => {
            return enter
              .call((clip) => {
                clip
                  .append("defs")
                  .append("clipPath")
                  .attr("id", (d, i) => `img${i}`)
                  .append("circle")
                  .attr("cy", imageSize / 2)
                  .attr("cx", imageSize / 2)
                  .attr("r", imageSize / 2);
              })
              .append("image")
              .attr("crossorigin", "anonymous")
              .attr("height", imageSize)
              .attr("width", imageSize)
              .attr(
                "transform",
                (d) => `translate(${calculateImgMargin(x(d.value))},
         ${y((prev.get(d) || d).rank)})`
              )
              .attr("preserveAspectRatio", "xMidYMid slice")
              .attr("clip-path", (d, i) =>
                config?.shape?.type === "circle" ? `url(#img${i})` : null
              )
              .attr("href", (d) => {
                console.log({aaa : imageBase64Dic[d.name]});
                return `${imageBase64Dic[d.name]}`
              });
          },
          (update) => update,
          (exit) => exit.remove()
        )
        .call((ClipPath) =>
          ClipPath.style("opacity", 1)
            // .style('display' , d=> ? 'none' : 'block')
            .transition(transition)
            .attr(
              "transform",
              (d) => `translate(${calculateImgMargin(x(d.value))},${y(d.rank)})`
            )
        ));
  }

  let x;
  if (config?.scale?.type === "linear") {
    x = d3.scaleLinear([0, 1], [margin.left, width - margin.right]);
  } else {
    x = d3.scaleLog().range([margin.left, width - margin.right]);
  }

  y = d3
    .scaleBand()
    .domain(d3.range(barCount + 1))
    .rangeRound([
      margin.top,
      margin.top +
        barSize * ((config?.timeline.show ? barCount + 1 : barCount + 2) + 0.1),
    ])
    .padding(0.1)
    .paddingInner(config?.bar?.gap);
  ///////////////////////////////////////////////////////

  let updateTimeline;
  if (config?.timeline.show) {
    updateTimeline = timeline(svg);
  }
  const updateBars = bars(svg);
  const updateAxis = axis(svg);
  const updateLabels = labels(svg);
  const updateTicker = ticker(svg);
  const updateClipPath = clipPath(svg);
  // const updateImage = image(svg)

  //Warning : custom duration is mainly used in drag event
  async function update(keyframe, customDuration = duration, symbolDuration) {
    //console.log(keyframe);
    const transition = svg
      .transition()
      .duration(customDuration)
      //.ease(d3.easeQuadOut);
      //.ease(d3.easeLinear);
      //.ease(d3.easeQuadInOut);
      // .ease(d3.easeCubicOut);
      //.ease(d3.easePolyOut.exponent(6));
      // .ease(d3.easeExpOut);
      .ease(d3.easeLinear);

    let xAxisMax =
      config?.xAxis.type === "dynamic"
        ? +keyframe[1][0]?.value
          ? +keyframe[1][0]?.value
          : 100
        : maxValueOverData;

    if (config?.scale?.type === "linear") {
      x.domain([0, xAxisMax]);
    } else {
      x.domain([0.0001, xAxisMax]);
    }

    if (config?.timeline.show) {
      updateTimeline(keyframe, transition, symbolDuration);
    }
    updateAxis(keyframe, transition);
    updateBars(keyframe, transition);
    updateLabels(keyframe, transition);
    if (config?.image.show == true) {
      updateClipPath(keyframe, transition);
    }
    updateTicker(keyframe, transition);
    // updateImage(keyframe, transition);
    // await transition.end()
  }

  function startLoop() {
    let frameIndex = keyframes.findIndex((d) => d[0] === selectedFrame);

    arrayForInterval = keyframes.slice(frameIndex);

    targetIndex = arrayForInterval.length;
    timer = setInterval(() => {
      if (currentIntervalIndex === arrayForInterval.length) {
        clearInterval(timer);

        //for restarting loop
        selectedFrame = keyframes[0][0];
        if (config?.loop?.status) {
          setTimeout(startLoop, +config?.loop?.pauseTime);
        }
        return;
      }
      selectedFrame = arrayForInterval[currentIntervalIndex][0];

      update(arrayForInterval[currentIntervalIndex]);

      currentIntervalIndex++;
    }, duration);
  }

  //WARNING : For drawing initial chart
  update(keyframes[0]);
  finishRender();
  if (config?.timeline.show === false) {
    if (timer) {
      clearInterval(timer);
    }
    startLoop();
  } else {
    if (timer) {
      clearInterval(timer);
    }
  }
}

const init_handler = async () => {
  isVideoRecord = /videoRec=true/.test(window.location.search);
  console.log({ isVideoRecord });

  if (isVideoRecord) {
    document.querySelector(".indicator-container").style.visibility = "visible";
    //TODO 4 : await ffmpeg load
    // if(!ffmpeg.isLoaded()){
    //await ffmpeg.load();
    // }
    initiateVideoRender();
  }

  mapData();

  //NOTE : TIME OUT IS FOR IMAGEBASE64 LOAD
  setTimeout(()=>{
    createChart();
  } , 2000)
};

const change_config_handler = () => {
  setTimeout(()=>{
    createChart();

    //TODO 5: starting animation frame
    if (isVideoRecord) {
      requestAnimationFrame(recordFrame);
    }
  } , 2000)

  
  
};

const resizeHandler = () => {
  createChart();
};

const transformData = async (newData) => {
  let allArray = [];
  newData.forEach((d, i) => {
    let innerArray = [];
    let lastValue;

    col_rel.values.forEach((_, j) => {
      //Check for missing values
      let slicedArr = col_rel.values.slice(j);
      let isLastValue = true;
      for (let index = 0; index < slicedArr.length; index++) {
        const col = slicedArr[index];

        if (+d[col]) {
          isLastValue = false;
          break;
        }
      }
      // if((!d[_] || !+d[_] || isNaN(+d[_])) && !lastValue) return;

      innerArray.push({
        name: d[col_rel.label],
        date: _,
        value: isLastValue ? +d[_] || 0 : +d[_] || lastValue || 0,
        image: d[col_rel.image],
        category: d[col_rel.category],
      });

      lastValue = `${+d[_] || lastValue}`;
    });
    allArray.push(...innerArray);
  });
  return allArray;
};

module.exports = {
  change_config_handler,
  resizeHandler,
  init_handler,
  transformData,
};
