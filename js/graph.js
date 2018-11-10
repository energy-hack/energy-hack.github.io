Plotly.d3.dsv(";", ",")(
  "https://raw.githubusercontent.com/energy-hack/data/master/E150_daily.csv",
  function(err, rows) {
    if (err) {
      return console.error(err)
    }

    function unpack(rows, key) {
      return rows.map(function(row) { return row[key]; });
    }

    const timeline = unpack(rows, 'Local_Time');
    const real_data = unpack(rows, 'InvervalValue').map(parseFloat);

    const mean = real_data.reduce((sum, elem) => sum + elem, 0) / real_data.length

    const old_data = real_data.map(num => (num * 0.4 + mean * 0.4 + Math.random() * 0.2) * 1.5);

    // real_data[0] = 0

    const trace1 = {
      type: "scatter",
      mode: "lines",
      name: 'Using Green Energy',
      x: timeline,
      y: real_data,
      line: {color: '#26a69a'}
    };

    const trace2 = {
      type: "scatter",
      mode: "lines",
      name: 'Usual Consumption',
      x: timeline,
      y: old_data,
      line: {color: '#7F7F7F'}
    };

    const data = [
      trace1,
      trace2,
    ];

    const layout = {
      width: 800,
      title: 'Energy Consumption per day',
    };

    Plotly.newPlot('savingsGraph', data, layout, {displayModeBar: false});
  }
)
