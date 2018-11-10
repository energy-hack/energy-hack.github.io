Plotly.d3.dsv(";", ",")(
  "https://raw.githubusercontent.com/energy-hack/data/master/E150.csv",
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

    const old_data = real_data.map(num => (num * 0.4 + mean * 0.55 + Math.random() * 0.05) * 1.5);

    console.log(timeline.join("\n"));
    console.log(real_data.join("\n"));


    const trace1 = {
      type: "scatter",
      mode: "lines",
      name: 'Current load',
      x: timeline,
      y: real_data,
      line: {color: '#17BECF'}
    };

    const trace2 = {
      type: "scatter",
      mode: "lines",
      name: 'Last-month load',
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

    Plotly.newPlot('savingsGraph', data, layout);
  }
)
