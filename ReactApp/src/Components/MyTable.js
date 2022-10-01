import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Popover from '@mui/material/Popover';

export default function BasicTable(props) {
  return (
<Popover id={"id"} open={props.table_open} onClose={()=>props.Set_table_open(false)}>
    <div style={{'backgroundColor':"white"}}>
      <Table sx={{ maxWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Tweets</TableCell>
          </TableRow>
        </TableHead>
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
      </div>
    </Popover>
  );
}
