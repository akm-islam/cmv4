import Plot from 'react-plotly.js';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Popover from '@mui/material/Popover';
import { CSVLink, CSVDownload } from 'react-csv';
import Grid from '@mui/material/Grid';

export default function BasicTable(props) {
  console.log(props.selected_group_data, "selected_group_data")
var sorted_data=props.selected_group_data.sort((a,b)=>a.SentimentScore-b.SentimentScore)
  return (
    <Popover id={"id"} open={props.table_open} onClose={() => props.Set_table_open(false)}>
      <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" style={{ width: window.innerWidth, height: window.innerHeight * .8 }}>
        
        <Grid className="Graph1" container direction="column" justifyContent="flex-start" alignItems="flex-start" xs={8} style={{ height: 250 }}>
          <Grid item xs={2} className="histChart">
            <Plot
              data={[
                {
                  x: props.selected_group_data.map(item => item["SentimentScore"] / 100).sort((a, b) => a - b),
                  type: 'histogram',
                },
              ]}
              layout={{ width: "30%", height: 240, title: 'Sentiment',xaxis: {range: [-1, 1]}}}
            />
          </Grid>
          <Grid item xs={2} className="barChart">
          <Plot
              data={[
                {
                  x: props.selected_group_data.map(item => item["subjective_prob"]).sort((a, b) => a - b),
                  type: 'histogram',
                },
              ]}
              layout={{ width: "30%", height: 240, title: 'Subjectivity',xaxis: {range: [0, 1]}}}
            />
          </Grid>
        </Grid>




        {/*<Grid className="Graph2" container direction="column" justifyContent="flex-start" alignItems="flex-start" xs={12} style={{ height: 250 }}>
          <Grid item xs={2} className="histChart">
          <Plot
              data={[
                {
                  x: sorted_data.map(item => item["SentimentScore"]/100),
                  y: sorted_data.map(item => item["SentimentScore"]/100),
                  type: 'bar',
                  marker: { color: 'green' },
                },
              ]}
              layout={{ width: "30%", height: 240, title: 'Sentiment' }}
            />
          </Grid>
          <Grid item xs={2} className="barChart">
            <Plot
              data={[
                {
                  x: sorted_data.map(item => item["subjective_prob"]),                  
                  y: sorted_data.map(item => item["subjective_prob"]),
                  type: 'bar',
                  marker: { color: 'green' },
                },
              ]}
              layout={{ width: "30%", height: 240, title: 'Subjectivity' }}
            />
          </Grid>

        </Grid>*/}
        {/*<Grid className="Graph3" container direction="column" alignItems="center" xs={12} style={{ height:250 }}>
          <Grid item xs={12} className="histChart">
          <Plot
              data={[
                {
                  x: props.selected_group_data.map((d,i) => i),
                  y: sorted_data.map(item => item["SentimentScore"]/100),
                  type: 'bar',
                  marker: { color: 'red' },
                },
                {
                  x: props.selected_group_data.map((d,i) => i),                 
                  y: sorted_data.map(item => item["subjective_prob"]),
                  type: 'bar',
                  marker: { color: 'green' },
                }
              ]}
              layout={{ width: "80%", height: 240, title: 'Subjectivity and Sentiment' }}
            />
          </Grid>
        </Grid>*/}
        
      </Grid>
    </Popover>
  );
}