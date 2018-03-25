$( document ).ready(function() {

  var parse_config = {
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
  	complete: undefined,
  	error: undefined,
  	download: false,
  	skipEmptyLines: false,
  	chunk: undefined,
  	fastMode: undefined,
  	beforeFirstChunk: undefined,
  	withCredentials: undefined
  }

  var google_path = 'data/new_google_normalized_trends.csv';

  $.get(google_path, function (data) {
        var csvdata = Papa.parse(data, parse_config);
        console.log(csvdata.data);
        console.log(csvdata.data.keys());
        console.log(csvdata.data[0]);
    });



  var ctx = $("#myChart");
  /*
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
  }); */
});
