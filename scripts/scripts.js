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

// Variables to store our csv data as a JS Object
var cdc_data = undefined;
var google_data = undefined;
var nyt_data = undefined;
var guardian_data = undefined;

// Load once the page is ready
$( document ).ready(function() {

// Variables to refer to our chart selectors
var cdc_chart = "#cdc_chart";
var google_chart = "#google_chart";
var guardian_chart = "#guardian_chart";
var nyt_chart = "#nyt_chart";

// Variables to refer to our data paths
var cdc_path = 'data/tp_cdc_n.csv';
var google_path = 'data/tp_google_trends_n.csv';
var guardian_path = 'data/tp_guardian_n.csv';
var nyt_path = 'data/tp_nyt_n.csv';

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
      chart_data(results.data, 1, google_chart, "Google Trends: ");
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
    google_data = csvdata;
  });


// Abstracted charting function
function chart_data(data, year, chart_id, title) {
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

  var canvas = $(chart_id);
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
        fontSize: 16
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
            boxWidth: 20
          }
        }
    }});
  }

  // Function to show slider and update accordingly
  var slider = $(".google-slider");
  slider.oninput = function() {
    $(".google-slider-value").innerHTML = this.value;
  }


// Ending of the document-ready mega-function
});
