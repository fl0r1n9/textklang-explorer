import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {visuallyHidden} from '@mui/utils';
import {useEffect, useState} from "react";


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

//settings for formatting table head
const headCells = [{
    id: 'title', string: false, disablePadding: false, labelDE: 'Titel', labelEN: "Title"
}, {
    id: 'author', string: false, disablePadding: false, labelDE: 'VerfasserIn', labelEN: "Author"
}, {
    id: 'reader', string: false, disablePadding: false, labelDE: 'SprecherIn', labelEN: "Reader"
}, {
    id: 'year', string: false, disablePadding: false, labelDE: 'Jahr', labelEN: "Year"
},];

function EnhancedTableHead(props) {
    const {order, orderBy, onRequestSort, language} = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (<TableHead>
        <TableRow>
            {headCells.map((headCell) => (<TableCell
                sx={{fontWeight: "bold"}}
                key={headCell.id}
                align={headCell.string ? 'right' : 'left'}
                padding={headCell.disablePadding ? 'none' : 'normal'}
                sortDirection={orderBy === headCell.id ? order : false}
            >
                <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                >
                    {language === "enUS" ? headCell.labelEN : headCell.labelDE}
                    {orderBy === headCell.id ? (<Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>) : null}
                </TableSortLabel>
            </TableCell>))}
        </TableRow>
    </TableHead>);
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {

    const {results, data, conditions, language} = props;

    return (
        <div>
            <Toolbar>
                <Typography
                    sx={{flex: '1 1 100%', color: "black"}}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {language === "enUS" ? "Search Results" : "Suchergebnisse"}
                </Typography>
            </Toolbar>
            <p style={{
                margin: "10px",
                marginTop: "0px",
                fontSize: "12px"
            }}> {data && conditions.length !== 0 ? data.hits.length + " Treffer in " + results + " Rezitationen" : ""} </p>
        </div>
    );
};

export default function ContentTable(props) {

    const {
        setSelectedPoem,
        searchInput,
        searchFilter,
        all_poems_json,
        conditions,
        setReadingsArray,
        data,
        rowsPerPage,
        setRowsPerPage,
        language,
        page,
        setPage
    } = props;

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('');
    const [selected, setSelected] = React.useState([]);
    const [dense, setDense] = React.useState(true);


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = all_poems_json.poems.map((n) => n.documentId);

            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const handleClickPoem = (doc_id) => {
        const tempArray = [];
        const tempPoem = all_poems_json.poems.find(poem => poem.documentId === doc_id);
        tempArray.push(tempPoem);
        for (let i = 0; i < all_poems_json.poems.length; i++) {
            if (all_poems_json.poems[i].title === tempPoem.title && all_poems_json.poems[i].author === tempPoem.author && all_poems_json.poems[i].documentId !== tempPoem.documentId) {
                tempArray.push(all_poems_json.poems[i]);
            }
        }
        setSelectedPoem(tempPoem);
        setReadingsArray(tempArray);
    }

    const filterResults = (poem) => {
        switch (searchFilter) {
            case 'all':
                if (poem.title.toLowerCase().includes(searchInput.toLowerCase()) || poem.author.toLowerCase().includes(searchInput.toLowerCase()) || poem.reader.toLowerCase().includes(searchInput.toLowerCase())) return true
                for (const token of poem.tokens) {
                    if (token.tokenString.toLowerCase().includes(searchInput.toLowerCase())) {
                        return true
                    }
                }
                return false

            case 'title':

                return poem.title.toLowerCase().includes(searchInput.toLowerCase());

            case 'author':

                return poem.author.toLowerCase().includes(searchInput.toLowerCase());

            case 'reader':

                return poem.reader.toLowerCase().includes(searchInput.toLowerCase());

            case 'text':

                for (const token of poem.tokens) {
                    if (token.tokenString.toLowerCase().includes(searchInput.toLowerCase())) {
                        return true
                    }
                }
                return false

            default:
                return poem.title.toLowerCase().includes(searchInput.toLowerCase()) || poem.author.toLowerCase().includes(searchInput.toLowerCase()) || poem.reader.toLowerCase().includes(searchInput.toLowerCase());

        }
    }

    //array to render when only string search is applied
    const filteredBySearchInput = all_poems_json.poems.filter(poem => filterResults(poem))

    //array to render when filters are applied and received from backend
    const [filteredByConditionInput, setFilteredByConditionInput] = useState([]);

    useEffect(() => {
        if (data) {
            //console.log(data);
            setFilteredByConditionInput(all_poems_json.poems.filter(poem => [...new Set(data.hits.map(value => value.poemIndex))].includes(poem.index)))
        }
    }, [data])


    //fix for pagination overflow
    useEffect(() => {
        if (page * rowsPerPage > (filteredByConditionInput.length || filteredBySearchInput.length)) {
            setPage(0)
        }
    }, [filteredByConditionInput, filteredBySearchInput])


    // Avoid a layout jump when reaching the last page with empty rows.
    let emptyRows;
    if (data) {
        emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredByConditionInput.length) : 0;
    } else {
        emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredBySearchInput.length) : 0;
    }

    //results count
    const count = (conditions.length !== 0 && data) ? filteredByConditionInput.length : filteredBySearchInput.length;

    return (<Box sx={{width: '100%'}}>
            <EnhancedTableToolbar results={count} data={data} conditions={conditions} language={language}/>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{paddingLeft:"2px"}}
            />
            <TableContainer>
                <Table sx={{ml: "auto"}}
                       aria-labelledby="tableTitle"
                       size={dense ? 'small' : 'medium'}
                >
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={(conditions.length !== 0 && data) ? filteredByConditionInput.length : filteredBySearchInput.length}
                        language={language}
                    />
                    <TableBody>
                        {
                            stableSort((conditions.length !== 0 && data) ? filteredByConditionInput : filteredBySearchInput, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={() => handleClickPoem(row.documentId)}
                                            tabIndex={-1}
                                            key={row.documentId}
                                        >
                                            <TableCell align="left"
                                                       style={{
                                                           cursor: 'pointer',
                                                       }}
                                                       component="th"
                                                       id={labelId}
                                                       scope="row"
                                                       padding="none"> {row.title} </TableCell>
                                            <TableCell align="left"
                                                       style={{
                                                           cursor: 'pointer',
                                                       }}
                                                       component="th"
                                                       id={labelId}
                                                       scope="row"
                                            >{row.author} </TableCell>
                                            <TableCell align="left"
                                                       style={{
                                                           cursor: 'pointer',
                                                       }}
                                                       component="th"
                                                       id={labelId}
                                                       scope="row"
                                            >{row.reader} </TableCell>
                                            <TableCell align="left"
                                                       style={{
                                                           cursor: 'pointer',
                                                       }}
                                                       component="th"
                                                       id={labelId}
                                                       scope="row"
                                            >{row.year} </TableCell>

                                        </TableRow>
                                    );
                                })}
                        {emptyRows > 0 && (<TableRow
                            style={{
                                height: (dense ? 33 : 53) * emptyRows,
                            }}
                        >
                            <TableCell colSpan={6}/>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense}/>}
                label={language === "enUS" ? "Small table" : "Kleine Tabelle"}
            />

        </Box>

    );
}