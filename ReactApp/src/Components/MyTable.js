import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Popper from '@mui/material/Popper';

export default function BasicTable(props) {
  return (
<Popper id={"id"} open={true}>
    <div style={{'backgroundColor':"white"}}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Tweet</TableCell>
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
    </Popper>
  );
}
