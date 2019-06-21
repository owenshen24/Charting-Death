let colors = [
'rgb(255, 31, 31)',
'rgb(201, 107, 31)',
'rgb(255, 174, 0)',
'rgb(255, 251, 3)',
'rgb(200, 255, 0)',
'rgb(92, 212, 35)',
'rgb(93, 160, 93)',
'rgb(0, 157, 185)',
'rgb(58, 117, 226)',
'rgb(184, 217, 255)',
'(130, 89, 255)',
'rgb(183, 0, 255)',
'rgb(252, 173, 255)'
]

let config = {
  "cdc": {
    "path" : 'data/cdc.csv',
    "id" : "#cdc_chart",
    "title" : "CDC Relative Mortality Rates",
    "colors" : colors,
    "parse_callback" : {
      "complete" : function(r) {
        data_arr['cdc'] = r.data;
        // Set up label list, only for first dataset
        if (label_list.length === 0) {
          label_list = data_arr['cdc'][1].slice(1);
        }
        make_bar_graph("cdc", 0);
      }
    },
    "chart" : undefined
  },
  "google": {
    "path" : 'data/google_trends.csv',
    "id" : "#google_chart",
    "title" : "Google Trends Relative Search Volume",
    "colors" : colors,
    "parse_callback" : {
      "complete" : function(r) {
        data_arr['google'] = r.data;
        make_bar_graph("google", 0);
      }
    },
    "chart" : undefined
  },
  "guardian": {
    "path" : 'data/guardian.csv',
    "id" : "#guardian_chart",
    "title" : "The Guardian's Relative Usage",
    "colors" : colors,
    "parse_callback" : {
      "complete" : function(r) {
        data_arr['guardian'] = r.data;
        make_bar_graph("guardian", 0);
      }
    },
    "chart" : undefined
  },
  "nyt": {
    "path" : 'data/nyt.csv',
    "id" : "#nyt_chart",
    "title" : "The NYT's Relative Usage",
    "colors" : colors,
    "parse_callback" : {
      "complete" : function(r) {
        data_arr['nyt'] = r.data;
        make_bar_graph("nyt", 0);
      }
    },
    "chart" : undefined
  },
  "factor": {
    "path" : 'data/factors.csv',
    "id" : "#factor_chart",
    "title" : "Ratio of Newspaper Coverage to Actual Deaths",
    "colors" : colors,
    "parse_callback" : {
      "complete" : function(r) {
        data_arr['factor'] = r.data;
        make_bar_graph('factor', 0);
      }
    },
    "chart" : undefined,
    "scale" : 'logarithmic'
  }
};

let data_arr = {};
let label_list = [];

// Load data into data_arr
function load_data() {
  for (let key in config) {
    let path = config[key]["path"];
    $.get(path, function (data) {
      data_arr[key] = Papa.parse(data, config[key]['parse_callback'])['data'];
    });
  }
}

function format_data(key, year) {
  let data = data_arr[key];
  let offset = 2;
  let num_causes = 13;
  format = []
  for (let i = 0; i < num_causes; i++) {
    format.push({
      label: label_list[i],
      data: [data[year+offset][i+1]],
      borderWidth: 1,
      backgroundColor: [config[key]['colors'][i]]
    });
  }
  return(format);
}

function update_data(key, year) {
  let chart = config[key]["chart"];
  chart.destroy();
  make_bar_graph(key, year);
}

function make_bar_graph(key, year) {
  let dataset = format_data(key, year);
  let scale = 'linear';
  if ('scale' in config[key]) {
    scale = config[key]['scale'];
  }
  let ctx = $(config[key]['id'])[0].getContext("2d");
  let chart = new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: dataset
    },
    options: {
      title: {
        display: true,
        text: config[key]['title'],
        fontSize: 22,
        padding: 30,
        fontColor: '#2b2b2b'
      },
      animation: {
        duration: 0
      },
      scales: {
        yAxes: [{
          type: scale
        }]
      }
    }
  });
  config[key]["chart"] = chart;
  chart.update();
}

// Wait until JQuery loads
$(document).ready(function() {
  load_data();

  // Update chart with slider
  $(".slider").on('input', function() {
    let key = $(this).parent().data("key");
    let year = parseInt($(this).val());
    let display_year = parseInt($(this).parent().data("start"))+year;
    $(this).siblings(".slider-value").text('Year: ' + display_year);
    update_data(key, year);
    console.log("ping!");
  });

  // Update chart with buttons
  $.fn.updateSlider = function(add) {
    let key = $(this).parent().data("key");
    let slider = $(this).siblings(".slider");
    let year = parseInt(slider.val());
    if (add) {
      if (year < parseInt(slider.attr("max"))) {
        year = year+1;
      }
    }
    if (!add) {
      if (year > parseInt(slider.attr("min"))) {
        year = year-1;
      }
    }
    let display_year = parseInt($(this).parent().data("start"))+year;
    $(this).siblings(".slider-value").text('Year: ' + display_year);
    slider.val(year);
    update_data(key, year);
  }
  $(".prev-year").on('click', function() {
    $(this).updateSlider(false);
  });
  $(".next-year").on('click', function() {
    $(this).updateSlider(true);
  });
  

  // Update average data on click
  $(".average-button").on('click', function() {
    let key = $(this).parent().data("key");
    let avg_index = parseInt($(this).siblings(".slider").attr('max'))+1;
    update_data(key, avg_index);
    $(this).siblings(".slider-value").text('Average');
  });
});