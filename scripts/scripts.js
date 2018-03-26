// Edit these colors later
var colors = [
  'rgba(77, 157, 224, 1)',
  'rgba(225, 188, 41, 1)',
  'rgba(255, 133, 82, 1)',
  'rgba(59, 178, 115, 1)',
  'rgba(119, 104, 174, 1)',
  'rgba(129, 141, 146, 1)',
  'rgba(88, 106, 106, 1)',
  'rgba(185, 163, 148, 1)',
  'rgba(212, 197, 199, 1)',
  'rgba(218, 212, 239, 1)',
  'rgba(163, 217, 255, 1)',
  'rgba(126, 107, 143, 1)',
  'rgba(150, 230, 179, 1)',
  'rgba(218, 62, 82, 1)',
  'rgba(242, 233, 78, 1)'
]

// Variables to refer to our data paths
var cdc_path = 'data/tp_cdc_n.csv';
var google_path = 'data/tp_google_trends_n.csv';
var guardian_path = 'data/tp_guardian_n.csv';
var nyt_path = 'data/tp_nyt_n.csv';

// Variables to store our csv data as a JS Object for easy reference later
var cdc_data = undefined;
var google_data = undefined;
var nyt_data = undefined;
var guardian_data = undefined;

// Variables to store our charts as a JS Object for easy reference later
var cdc_chart = undefined;
var google_chart = undefined;
var nyt_chart = undefined;
var guardian_chart = undefined;

// Variables for our graph titles
var cdc_title = "PLACEHOLDER: ";
var google_title = "Google Trends: ";
var guardian_title = "PLACEHOLDER: ";
var nyt_title = "PLACEHOLDER: ";

// Load once the page is ready
$( document ).ready(function() {

  // Variables to refer to our chart selectors
  var cdc_canvas = "#cdc_chart";
  var google_canvas = "#google_chart";
  var guardian_canvas = "#guardian_chart";
  var nyt_canvas = "#nyt_chart";

  // Variables to refer to our chart sliders
  var google_slider = document.getElementById("google-slider");
  var google_output = document.getElementById("google-slider-value");

  // Chart JS config for google trends csv
  var google_config = {
  	delimiter: "",	// auto-detect
  	newline: "",	// auto-detect
  	quoteChar: '"',
  	escapeChar: '"',
  	header: true,
  	dynamicTyping: false,
  	preview: 0,
  	encoding: "",
  	worker: false,
  	comments: false,
  	step: undefined,
  	complete: function(results) {
      chart_data(results.data, 1, google_canvas, google_title);
     },
  	error: undefined,
  	download: false,
  	skipEmptyLines: false,
  	chunk: undefined,
  	fastMode: undefined,
  	beforeFirstChunk: undefined,
  	withCredentials: undefined
  }

  // AJAX request to grab the google trends csv
  $.get(google_path, function (data) {
      var csvdata = Papa.parse(data, google_config);
      google_data = csvdata.data;
    });


  // Abstracted charting function
  function chart_data(data, year, canvas_id, title) {
    label_list = [];
    data_list = [];

    // Hard-coded limit of 13 to solve problems w/ undefined
    for (var i = 0; i < 13; i++) {
      label_list.push(data[0][i]);
      var temp_data = {
        label: data[0][i],
        data: [data[year][i]],
        borderWidth: 1,
        backgroundColor: [colors[i]]
      };
      data_list.push(temp_data);
    }

    var canvas = $(canvas_id);
    var chart = new Chart(canvas, {
      type: 'bar',
      data: {
        // labels: label_list,
        datasets: data_list
      },
      options: {
        title: {
          display: true,
          text: title + data[year]['Year'],
          fontSize: 16,
          padding: 20
        },
        animation: {
          duration: 0
        },
        scales: {
          yAxes: [{
            beginAtZero:true,
            ticks: {
              min: 0,
              autoSkip: false}}],
          xAxes: [{
            stacked: false,
            beginAtZero: true,
            ticks: {
              min: 0,
              autoSkip: false}}]
          },
          legend: {
            display: true,
            position: 'left',
            labels: {
              padding: 5,
              boxWidth: 30,
              fontSize: 14
            }
          }
      }});

    switch(canvas_id) {
      case google_canvas:
        google_chart = chart;
        break;
      case cdc_canvas:
        cdc_chart = chart;
        break;
      case nyt_canvas:
        nyt_chart = chart;
        break;
      case guardian_canvas:
        guardian_chart = chart;
        break;
    }
  }

  // Function to show google slider and update accordingly
  google_output.innerHTML = parseInt(google_slider.value) + 2003;
  google_slider.oninput = function() {
    google_output.innerHTML = parseInt(google_slider.value) + 2003;
    updateData(google_chart, google_data, parseInt(google_slider.value), google_title);
  }

  // Updates a graph
  function updateData(chart, data_list, year, title) {

    // Clear old data
    chart.data.datasets = [];

    // Add new data
    for (var i = 0; i < 13; i++) {
      var temp_data = {
        label: data_list[0][i],
        data: [data_list[year][i]],
        borderWidth: 1,
        backgroundColor: [colors[i]]
      };
      chart.data.datasets.push(temp_data);
    }
    chart.options.title['text'] = title + data_list[year]['Year'];
    chart.update();
  }

// Ending of the document-ready mega-function
});
