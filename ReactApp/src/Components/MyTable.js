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
  return (
    <Popover id={"id"} open={props.table_open} onClose={() => props.Set_table_open(false)}>
      <Grid container direction="row" justifyContent="space-around" >
        <Grid item xs={9} sx={{ paddingLeft: 0, marginLeft: -3 }}><p style={{ margin: 0, padding: 0, fontSize: 20, fontWeight: 600 }}>Tweets</p></Grid>
        <Grid item>
          <a href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(props.selected_group_data))}`}
            download={props.selected_month+"_"+props.selected_group+".json"}
          >
            {`Export Data`}
          </a>
        </Grid>
      </Grid>
      <div>{props.selected_group_data.map(row=> <p>{row.raw_tweet}</p>)}</div>
      {/*
      <Table sx={{ maxWidth: 650 }} aria-label="simple table">
        <TableBody>
          {props.selected_group_data.map((row) => (
            <TableRow key={row.raw_tweet} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.raw_tweet}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
          */}
    </Popover>
  );
}
