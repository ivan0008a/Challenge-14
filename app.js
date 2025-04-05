// URL to fetch the sample data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Initialize the dashboard
d3.json(url).then(data => console.log("Data loaded"));

function init() {
  d3.json(url).then(data => {
    let dropdown = d3.select("#selDataset");

    data.names.forEach(id => {
      dropdown.append("option").text(id).property("value", id);
    });

    let firstID = data.names[0];
    buildCharts(firstID);
    buildMetadata(firstID);
  });
}

function buildMetadata(id) {
  d3.json(url).then(data => {
    let metadata = data.metadata.find(meta => meta.id == id);
    let panel = d3.select("#sample-metadata");
    panel.html(""); // Clear old info

    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

function buildCharts(id) {
  d3.json(url).then(data => {
    let sample = data.samples.find(s => s.id === id);

    // Bar chart setup
    let otu_ids = sample.otu_ids.slice(0, 10).reverse();
    let sample_values = sample.sample_values.slice(0, 10).reverse();
    let otu_labels = sample.otu_labels.slice(0, 10).reverse();

    let barData = [{
      x: sample_values,
      y: otu_ids.map(id => `OTU ${id}`),
      text: otu_labels,
      type: "bar",
      orientation: "h"
    }];

    let barLayout = {
      title: "Top 10 OTUs",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);

    // Bubble chart setup
    let bubbleData = [{
      x: sample.otu_ids,
      y: sample.sample_values,
      text: sample.otu_labels,
      mode: "markers",
      marker: {
        size: sample.sample_values,
        color: sample.otu_ids,
        colorscale: "Earth"
      }
    }];

    let bubbleLayout = {
      title: "OTU Bubble Chart",
      xaxis: { title: "OTU ID" },
      height: 600,
      width: 1000
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

function optionChanged(newID) {
  buildCharts(newID);
  buildMetadata(newID);
}

// Run the init function when page loads
init();

