import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Popover from '@mui/material/Popover';
import { CSVLink, CSVDownload } from 'react-csv';
import Grid from '@mui/material/Grid';

export default function BasicTable(props) {
  return (
    <Popover id={"id"} open={props.table_open} onClose={() => props.Set_table_open(false)}>
      <Grid container direction="row" justifyContent="space-around" >
        <Grid item xs={9} sx={{paddingLeft:0,marginLeft:-3}}><p style={{margin:0,padding:0,fontSize:20,fontWeight:600}}>Tweets</p></Grid>
        <Grid item><CSVLink data={props.selected_group_data} >Export</CSVLink></Grid>
      </Grid>
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
    </Popover>
  );
}
