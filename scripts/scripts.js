$( document ).ready(function() {

// Variables to refer to our chart selectors
var cdc_chart = "#cdc_chart";
var google_chart = "#google_chart";
var guardian_chart = "#guardian_chart";
var nyt_chart = "#nyt_chart";

// Variables to refer to our data paths
var google_path = 'data/tp_google_trends_normalized.csv';

var cdc_data = [];
var google_data = [];
var nyt_data = [];
var guardian_data = [];

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
      google_data = results.data;
      chart_data(google_data, 1, google_chart);
     },
  	error: undefined,
  	download: false,
  	skipEmptyLines: false,
  	chunk: undefined,
  	fastMode: undefined,
  	beforeFirstChunk: undefined,
  	withCredentials: undefined
  }

$.get(google_path, function (data) {
      var csvdata = Papa.parse(data, google_config);
  });

function chart_data(data, year, chart_id) {
  label_list = [];
  data_list = [];
  for (var i = 0; i < Object.keys(data).length; i++) {
    label_list.push(data[0][i]);
    data_list.push(data[year][i]);
  }
  var canvas = $(chart_id);
  var chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: label_list,
      datasets: [{
        data: data_list,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true}}]}}});
  }



});
