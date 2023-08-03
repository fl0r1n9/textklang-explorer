import * as React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select
} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import DeleteIcon from '@mui/icons-material/Delete';
import {useEffect} from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';


//routine and logic for adding components

export function CreateNewCondition(props) {

    const {
        handleAddCondition, func, setFunc,
        entity, setEntity, where, setWhere, operator, setOperator,
        conditionSearchInput, setConditionSearchInput,
        handleDeleteCondition, handleSavePreset,
        first, saveFilterName, setSaveFilterName, handleLoadPreset,
        loadOpen, setLoadOpen, selectedValue, language
    } = props;


    //savePreset dialog hooks
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    //loadPreset dialog hooks...
    const handleClickLoadOpen = () => {
        setLoadOpen(true);
    };

    const handleCloseLoadOpen = () => {
        setLoadOpen(false);
    };

    const [storageItems, setStorageItems] = React.useState([])

    const handleDeleteFilter = (value) => {
        localStorage.removeItem(value)
        let filterList = []
        for (let i = 0; i < localStorage.length; i++) {
            filterList.push(localStorage.key(i))
        }
        setStorageItems(filterList)
        // console.log(localStorage)
    }

    useEffect(() => {
        //read from local storage
        let filterList = []
        for (let i = 0; i < localStorage.length; i++) {
            filterList.push(localStorage.key(i))
        }
        setStorageItems(filterList)
    }, [loadOpen])

    //... & custom component
    function LoadPresetDialog(props) {
        const {onClose, open, storageItems} = props;

        const handleListItemClick = (value) => {
            onClose(value);
        };

        return (<Dialog onClose={handleCloseLoadOpen} open={open}>
            <DialogTitle sx={{
                justifyContent: "center",
                display: "flex",
                backgroundColor: "#1976D2",
                color: "white"
            }}>{language === "enUS" ? "Load filter" : "Filter laden"}</DialogTitle>
            <List sx={{pt: 0}}>
                {storageItems.map((entry) =>
                    //button is deprecated
                    <div key={entry} style={{flexDirection: "row", display: "flex"}}>
                        <ListItem onClick={() => handleListItemClick(entry)}
                                  sx={{cursor: "pointer", '&:hover': {color: "#1976D2"}}}>
                            <ListItemText primary={entry}/>
                        </ListItem>
                        <DeleteIcon
                            sx={{mt: "12px", mx: "10px", cursor: "pointer", '&:hover': {color: "red"}}}
                            onClick={() => handleDeleteFilter(entry)}/>
                    </div>
                )}
            </List>
        </Dialog>);
    }

    LoadPresetDialog.propTypes = {
        onClose: PropTypes.func.isRequired, open: PropTypes.bool.isRequired, selectedValue: PropTypes.string.isRequired,
    };

//editable condition box
    return (
        <div>
            <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                gridTemplateRows: "repeat(2, minmax(0, 1fr))",
                gap: "1rem",
                mt: 2
            }}>
                <FormControl variant="standard" sx={{gridColumn: "span 2 / span 2"}}>
                    <InputLabel
                        id="demo-simple-select-standard-label">{language === "enUS" ? "Mode" : "Modus"}</InputLabel>
                    <Select
                        value={func || 'node_begin'}
                        onChange={(event) => setFunc(event.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="node_begin">{language === "enUS" ? "Filter start" : "Filterbeginn"}</MenuItem>
                        <MenuItem
                            value="node_exclusion">{language === "enUS" ? "Exclusion filter" : "Ausschlussfilter"}</MenuItem>
                        {first ? "" : <MenuItem value="and">{language === "enUS" ? "and" : "und"}</MenuItem>}
                        {first ? "" : <MenuItem value="or">{language === "enUS" ? "or" : "oder"}</MenuItem>}
                    </Select>
                </FormControl>

                <FormControl variant="standard" sx={{gridColumn: "span 2 / span 2"}}>
                    <InputLabel id="demo-simple-select-standard-label">Layer</InputLabel>
                    <Select

                        value={entity || 'none'}
                        onChange={(event) => setEntity(event.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="none">-</MenuItem>
                        <MenuItem value="form">{language === "enUS" ? "Word form" : "Wortform"}</MenuItem>
                        <MenuItem value="lemma">Lemma</MenuItem>
                        <MenuItem value="pos">{language === "enUS" ? "Part of speech" : "Wortart"}</MenuItem>
                        <MenuItem value="punctuation">{language === "enUS" ? "Punctuation" : "Satzzeichen"}</MenuItem>
                        <MenuItem
                            value="tonal_prominence">{language === "enUS" ? "Tonal prominence" : "Tonale Prominenz"}</MenuItem>
                        <MenuItem
                            value="deprel">{language === "enUS" ? "Dependency relation" : "Dependenzrelation"}</MenuItem>
                        <MenuItem value="part_duration">{language === "enUS" ? "Word duration" : "Wortdauer"}</MenuItem>
                        <MenuItem value="bibo_performer">{language === "enUS" ? "Reader" : "SprecherIn"}</MenuItem>
                        <MenuItem
                            value="dcterms_created">{language === "enUS" ? "Year created" : "Verfassungsjahr"}</MenuItem>
                        <MenuItem
                            value="dcterms_issued">{language === "enUS" ? "Year recited" : "Rezitationsjahr"}</MenuItem>
                        <MenuItem value="dcterms_subject">{language === "enUS" ? "Title" : "Titel"}</MenuItem>
                        <MenuItem
                            value="foaf_gender">{language === "enUS" ? "Reader's gender" : "Geschlecht SprecherIn"}</MenuItem>
                        <MenuItem
                            value="pitch_accent">{language === "enUS" ? "Pitch accent" : "Pitch-Akzent"}</MenuItem>
                        <MenuItem value="boundary_tone">{language === "enUS" ? "Boundary tone" : "Grenzton"}</MenuItem>
                    </Select>
                </FormControl>

                <FormControl variant="standard" sx={{gridColumn: "span 2 / span 2"}}>
                    <InputLabel id="demo-simple-select-standard-label">Operator</InputLabel>
                    <Select
                        value={operator || 'none'}
                        onChange={(event) => setOperator(event.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="none">-</MenuItem>
                        <MenuItem value="equals">{language === "enUS" ? "equals" : "ist gleich"}</MenuItem>
                        <MenuItem value="equals_not">{language === "enUS" ? "equals not" : "ist ungleich"}</MenuItem>
                        <MenuItem value="contains">{language === "enUS" ? "contains" : "enthält"}</MenuItem>
                        <MenuItem
                            value="contains_not">{language === "enUS" ? "contains not" : "enthält nicht"}</MenuItem>
                        <MenuItem value="greater_than">{language === "enUS" ? "bigger" : "größer"}</MenuItem>
                        <MenuItem value="less_than">{language === "enUS" ? "smaller" : "kleiner"}</MenuItem>
                    </Select>
                </FormControl>

                <TextField sx={{gridColumn: "span 3 / span 3"}} id="input-for-condition"
                           label={language === "enUS" ? "Value" : "Wert"}
                           variant="standard"
                           value={conditionSearchInput || ''}
                           onChange={(event) => setConditionSearchInput(event.target.value)}/>

                <FormControl variant="standard" sx={{gridColumnStart: 5, gridColumnEnd: 7}}>
                    <InputLabel id="demo-simple-select-standard-label">Position</InputLabel>
                    <Select
                        value={where || 'anywhere'}
                        onChange={(event) => setWhere(event.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="anywhere">{language === "enUS" ? "anywhere" : "egal"}</MenuItem>
                        {first ? "" :
                            <MenuItem value="adjacent">{language === "enUS" ? "adjacent" : "anliegend"}</MenuItem>}
                        {first ? "" : <MenuItem
                            value="non_adjacent">{language === "enUS" ? "nonadjacent" : "nicht anliegend"}</MenuItem>}
                        <MenuItem value="rhyme_begin">{language === "enUS" ? "Ryhme start" : "Versbeginn"}</MenuItem>
                        <MenuItem value="rhyme_end">{language === "enUS" ? "Rhyme end" : "Versende"}</MenuItem>
                        <MenuItem
                            value="verse_begin">{language === "enUS" ? "Verse start" : "Strophenbeginn"}</MenuItem>
                        <MenuItem value="verse_end">{language === "enUS" ? "Verse end" : "Strophenende"}</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/*bottom button row */}
            <Box sx={{
                display: {xs: "flex", md: "grid", xl: "flex"},
                gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                gridAutoFlow: "row",
                columnGap: {md:"1rem", lg:"4rem", xl:"1rem"},
                rowGap: "1rem",
                justifyContent: 'space-between',
                mt: 4,
                flexWrap: 'wrap'
            }}>
                <Button variant="contained" onClick={handleAddCondition}
                        sx={{
                            fontSize: {md: "0.75rem", xl: "0.875rem"},
                            gridColumnStart: 1,
                            gridColumnEnd: {md: 4, lg: 4},
                            display: "flex",
                            textAlign: "center",
                            justifyContent: "center"
                        }}>
                    <Box sx={{display: {xs: "none", md: "block"}, marginTop:{md:"3px",xl:"0px"}}}>
                        <span>Filter</span>
                    </Box>
                    <AddCircleOutlineIcon sx={{marginLeft: {xs: "0px", md: "5px"}}}/>
                </Button>
                <Button variant="contained" onClick={handleDeleteCondition}
                        sx={{
                            fontSize: {md: "0.75rem", xl: "0.875rem"},
                            gridColumnStart: {md: 4, lg: 4},
                            gridColumnEnd: 7,
                            display: "flex",
                            alignItems: "center"
                        }}>
                    <Box sx={{display: {xs: "none", md: "block"}, marginTop:{md:"3px",xl:"0px"}}}>
                        <span>Filter</span>
                    </Box>
                    <RemoveCircleOutlineIcon sx={{marginLeft: {xs: "0px", md: "5px"}}}/>
                </Button>
                <Button variant="contained"
                        sx={{
                            fontSize: {md: "0.75rem", xl: "0.875rem"},
                            gridColumnStart: 1,
                            gridColumnEnd: {md: 4, lg: 4},
                            display: "flex",
                            alignItems: "center"
                        }}
                        onClick={handleClickOpen}>
                    <Box sx={{display: {xs: "none", md: "block"}, marginTop:{md:"3px",xl:"0px"}}}>
                        <span>{language === "enUS" ? "Save filter" : "Filter speichern"}</span>
                    </Box>
                    <SaveIcon sx={{marginLeft: {xs: "0px", md: "5px"}}}/>
                </Button>
                <Button variant="contained"
                        sx={{
                            fontSize: {md: "0.75rem", xl: "0.875rem"},
                            gridColumnStart: {md: 4, lg: 4},
                            gridColumnEnd: 7,
                            display: "flex",
                            alignItems: "center"
                        }}
                        onClick={handleClickLoadOpen}>
                    <Box sx={{display: {xs: "none", md: "block"}, marginTop:{md:"3px",xl:"0px"}}}>
                        <span>{language === "enUS" ? "Load filter" : "Filter laden"}</span>
                    </Box>
                    <SystemUpdateAltIcon sx={{marginLeft: {xs: "0px", md: "5px"}}}/>
                </Button>
            </Box>
            {/*add filter dialog*/}
            <Dialog open={open} onClose={handleSavePreset}>
                <DialogTitle>{language === "enUS" ? "Save filter" : "Filter speichern"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {language === "enUS" ? "Please provide a name for the filter(s) to be saved" : "Bitte einen Namen für den/die zu speichernden Filter angeben"}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="string"
                        fullWidth
                        variant="standard"
                        value={saveFilterName}
                        onChange={(event) => setSaveFilterName(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{language === "enUS" ? "Cancel" : "Abbrechen"}</Button>
                    <Button onClick={() => {
                        handleSavePreset();
                        handleClose()
                    }}>OK</Button>
                </DialogActions>

            </Dialog>
            {/*load filter dialog*/}
            <LoadPresetDialog
                selectedValue={selectedValue}
                open={loadOpen}
                onClose={handleLoadPreset}
                storageItems={storageItems}
            />
        </div>
    )
}