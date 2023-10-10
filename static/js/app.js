const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(url).then(function(data) {
    console.log(data);
});

function init() {
    let dropdownMenu = d3.select("#selDataset");
    d3.json(url).then((data) => {     
        let subjects = data.names;
        subjects.forEach((subjectID) => {
            console.log(subjectID);
            dropdownMenu.append("option").text(subjectID).property("value",subjectID);
        });
        let defaultname = subjects[0];
        BarChart(defaultname);
        BubbleChart(defaultname);
        Metadata(defaultname);
    });
};

function BarChart(currentvalue) {
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;
        let value1 = sampleInfo.filter(result => result.id == currentvalue);
        let value2 = value1[0];
        let otu_ids = value2.otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let otu_labels = value2.otu_labels.slice(0,10).reverse();  
        let sample_values = value2.sample_values.slice(0,10).reverse();  
        let trace1 = {
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            type: "bar",
            orientation: "h"
        };
        Plotly.newPlot("bar", [trace1])
    });
};

function BubbleChart(currentvalue) {
    d3.json(url).then((data) => {    
        let sampleInfo = data.samples;
        let value1 = sampleInfo.filter(result => result.id == currentvalue);
        let value2 = value1[0];
        let otu_ids = value2.otu_ids;
        let otu_labels = value2.otu_labels;
        let sample_values = value2.sample_values;

        let trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };
        let layout = {
            xaxis: {title: "OTU ID"},
        };
        Plotly.newPlot("bubble", [trace2], layout)
    });
};

function Metadata(currentvalue) {
    d3.json(url).then((data) => {
        let metadata1 = data.metadata;
        let metadata2 = metadata1.filter(result => result.id == currentvalue);
        let metadata3 = metadata2[0];
        d3.select("#sample-metadata").html("");
        for (var key in metadata3) {
            console.log(key, metadata3[key])
            d3.select("#sample-metadata").append('h5').text(`${key}: ${metadata3[key]}`);
        }
    });
};

function optionChanged(value) { 
    Metadata(value);
    BarChart(value);
    BubbleChart(value);
};

init();