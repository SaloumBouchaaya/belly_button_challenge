// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    var metadata = data.metadata; 

    // Filter the metadata for the object with the desired sample number
    var filteredMetadata = metadata.filter(meta => meta.id == sample)[0];


    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filteredMetadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
  });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    var samples = data.samples;

    // Filter the samples for the object with the desired sample number
    var filteredSamples = samples.filter(sampleObj => sampleObj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    var otuIds = filteredSamples.otu_ids;
    var otuLabels = filteredSamples.otu_labels;
    var sampleValues = filteredSamples.sample_values;


    // Build a Bubble Chart
    var bubbleData = [{
      x: otuIds,
      y: sampleValues, 
      text: otuLabels, 
      mode: 'markers', 
      marker: {
        size: sampleValues, 
        color: otuIds, 
        colorscale: 'Earth', 
        opacity: 0.6, 
        line: {
          width: 1 
        }
      }
    }];
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU IDs' },
      yaxis: { title: 'Number of Bacteria' },
      hovermode: 'closest'
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
 

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var top10Data = otuIds.map((id, index) => {
      return {
        otu_id: id,
        otu_label: otuLabels[index],
        sample_value: sampleValues[index]
      };
    });
    
    top10Data.sort((a, b) => b.sample_value - a.sample_value);
    var top10 = top10Data.slice(0, 10);
    
    var barIds = top10.map(data => `OTU ${data.otu_id}`);


    // Build a Bar Chart
    var barData = [{
      x: top10.map(data => data.sample_value).reverse(),
      y: barIds.reverse(),
      text: top10.map(data => data.otu_label).reverse(),
      type: 'bar',
      orientation: 'h'
    }];
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria' },
      yaxis: { title: 'OTU IDs' }
    };


    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);


  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    var sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    var dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });


    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Initialize the dashboard
init();
