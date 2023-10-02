let pdata;

// Fetch data from the API endpoint
fetch('http://127.0.0.1:5000/api/v1.0/airquality_data')
  .then((response) => response.json())
  .then((jsondata) => {
    pdata = jsondata;

    // Call the function to create the initial chart with 'CO' pollutant and 'day' view by default
    createChart('CO', 'day');
  })
  .catch((e) => console.log(e));

const selectPollutant = document.getElementById('chartSelect');

// Event listener for dropdown change
selectPollutant.addEventListener('change', (event) => {
  const selectedView = event.target.value;
  createChart(selectPollutant.value, selectedView);
});

// Function to group data by month and calculate monthly averages
function groupDataByMonth(data) {
  const monthlyData = {};

  data.forEach((entry) => {
    const dateParts = entry.date.split(' ')[0].split('-');
    const yearMonth = `${dateParts[0]}-${dateParts[1]}`;

    if (!monthlyData[yearMonth]) {
      monthlyData[yearMonth] = {
        date: yearMonth,
      };
    }

    for (const key in entry) {
      if (key !== 'date' && key !== 'aqi') {
        if (!monthlyData[yearMonth][key]) {
          monthlyData[yearMonth][key] = 0;
        }
        monthlyData[yearMonth][key] += entry[key];
      }
    }
  });

  // Calculate monthly averages
  for (const month in monthlyData) {
    for (const key in monthlyData[month]) {
      if (key !== 'date') {
        monthlyData[month][key] /= Object.keys(monthlyData).length;
      }
    }
  }

  return Object.values(monthlyData);
}

// Function to create and update the chart based on the selected pollutant and view
function createChart(selectedPollutant, selectedView) {
  if (!pdata) {
    console.log('Data not available yet.');
    return;
  }

  let chartData = pdata;
  let chartTitle = `Pollutant Values (${selectedPollutant}) - ${selectedView} view`;

  if (selectedView === 'month') {
    chartData = groupDataByMonth(pdata);
    chartTitle = `Monthly Average Pollutant Values (${selectedPollutant})`;
  }

  const x = chartData.map((d) => d.date);
  const y = chartData.map((d) => d[selectedPollutant]);

  const plotdata = [
    {
      x: x,
      y: y,
      type: 'bar',
      marker: {
        color: 'rgba(75, 192, 192, 0.6)', // Bar color
      },
    },
  ];

  const layout = {
    title: chartTitle,
    xaxis: {
      title: 'Date',
    },
    yaxis: {
      title: 'Value',
    },
  };

  // Use Plotly to create or update the chart
  Plotly.newPlot('barChartPlot', plotdata, layout);
}
