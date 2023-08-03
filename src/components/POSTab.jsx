import * as React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import pos_tags from "./pos_tags.json";
import pos_tags_en from "./pos_tags_en.json";

export default function POSTab(props) {

   const {language} = props;

function createData(name, desc, exa) {
    return { name, desc, exa};
}

const rows = [];

const file = (language === "enUS" ? pos_tags_en : pos_tags);

for (const row of file) {
    rows.push(createData(row.name, row.desc, row.exa));
}

  return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} size="small" aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell sx={{fontWeight:"bold"}}>Tag</TableCell>
                    <TableCell sx={{fontWeight:"bold"}} align="right">{language === "enUS" ? "Description" : "Beschreibung"}</TableCell>
                    <TableCell sx={{fontWeight:"bold"}} align="right">{language === "enUS" ? "Example" : "Beispiele"}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                    <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, height: 33}}
                    >
                        <TableCell style={{
                            paddingTop:1,
                        }} component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell align="right">{row.desc}</TableCell>
                        <TableCell align="right">{row.exa}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
  )

}

