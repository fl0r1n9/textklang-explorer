import * as React from 'react';
import Box from '@mui/material/Box';
import {
    Alert,
    InputLabel, MenuItem, Snackbar
} from "@mui/material";
import {Select} from "@mui/material";
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Condition from "./Condition";
import {CreateNewCondition} from "./CreateNewCondition";
import {useEffect, useState} from "react";
import Paper from "@mui/material/Paper";

export default function SearchPage(props) {

    const {
        searchInput,
        setString,
        searchFilter,
        setSearchFilter,
        setSearchInput,
        conditions,
        setConditions,
        setData,
        data,
        language
    } = props;

    //SearchFilter hook
    const handleChange = (event) => {
        setSearchFilter(event.target.value);
        setString('');
    };

    //FormControl hooks
    const [first, setFirst] = React.useState(true);
    const [func, setFunc] = React.useState("node_begin");
    const [entity, setEntity] = React.useState("none");
    const [operator, setOperator] = React.useState('none');
    const [where, setWhere] = React.useState('anywhere');
    const [conditionSearchInput, setConditionSearchInput] = React.useState('');
    const [saveFilterName, setSaveFilterName] = React.useState('');

    const [alertOn, setAlertOn] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    //snackbar hooks
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    useEffect(() => {
        language === "enUS" ? setMessage("Filter added") : setMessage("Filter hinzugefügt")
    }, [])

    function SimpleSnackbar() {

        const handleClose = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }

            setOpen(false);
        };

        return (<div>
            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                message={message}
            />
        </div>);
    }

    //adding a condition box when filter+ button is pressed
    const handleAddCondition = () => {
        setConditions(conditions.concat(new Condition(first, func, entity, operator, where, conditionSearchInput)));
        setFirst(false);
        setFunc('node_begin');
        setEntity('none');
        setOperator('none');
        setWhere('anywhere');
        setConditionSearchInput('');
        setOpen(true);
        language === "enUS" ? setMessage("Filter added") : setMessage("Filter hinzugefügt");
    }

    //create query object
    useEffect(async () => {

        //resets message state to prevent it being shown where there is no error
        setErrorMessage(null)

        if (conditions.length !== 0) {
            const conditionsQuery = {"searchInput": searchInput, "searchFilter": searchFilter, "filters": conditions}

            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(conditionsQuery)
            };

            let json;
            try {
                const response = await fetch(process.env.REACT_APP_QUERY_URL, requestOptions);
                json = await response.json();
                setData(json);

                if (json.message) {
                    if (json.message.includes("Conversion")) {
                        setErrorMessage(json.message.split(":")[1] + (json.message.split(":")[2] !== undefined ?  ": " + json.message.split(":")[2] : ""))
                    }
                    if (json.message.includes("Evaluation")) {
                        setErrorMessage(json.message.split(":")[1])
                    }
                }

            } catch (error) {
                if (error instanceof SyntaxError) {
                    // Unexpected token < in JSON
                    console.log('There was a SyntaxError', error);
                    setAlertOn(true);
                } else {
                    console.log('Different error', error);
                }
            }
        }
    }, [conditions])

    //undo previous
    const handleDeleteCondition = () => {
        if (conditions.length === 1) {
            setFirst(true);
            setData(null)
        }
        setConditions(conditions.filter((element) => element !== conditions.slice(-1)[0]));
        setOpen(true);
        language === "enUS" ? setMessage("Filter deleted") : setMessage("Filter entfernt")
    }

    //simple savePreset function
    const handleSavePreset = () => {

        let conditions_appended = {};
        conditions_appended[saveFilterName] = [];

        conditions_appended[saveFilterName].push({"searchInput": searchInput, "searchFilter": searchFilter});
        conditions.forEach((element) => {
            conditions_appended[saveFilterName].push(element);
        });

        //add filter blocks to local storage
        localStorage.setItem(saveFilterName, JSON.stringify(conditions_appended))
    }

    //loadPreset dialog hooks
    const [loadOpen, setLoadOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState("");

    const handleLoadPreset = (value) => {
        setLoadOpen(false);
        setSelectedValue(value);

        //get filters from local storage
        let retrieved = JSON.parse(localStorage.getItem(value))

        //set filters
        setSearchInput(Object.values(retrieved)[0][0].searchInput);
        setSearchFilter(Object.values(retrieved)[0][0].searchFilter);

        let writeToConditions = [];

        for (let i = 1; i < Object.values(retrieved)[0].length; i++) {
            writeToConditions[i - 1] = Object.values(retrieved)[0][i];
        }
        setConditions(writeToConditions);
    };

    //render newly added conditions
    function showConditions() {
        return conditions.map((condition, index) => {
            return <Box key={index} sx={{
                display: "grid",
                gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                gridTemplateRows: "repeat(2, minmax(0, 1fr))",
                gap: "1rem",
                border: 2,
                borderRadius: 3,
                borderColor: "#DEDEDE",
                mt: 2,
                padding: "10px"
            }}>
                <FormControl variant="standard" sx={{gridColumn: "span 2 / span 2"}}>
                    <InputLabel
                        id="demo-simple-select-standard-label">{language === "enUS" ? "Mode" : "Modus"}</InputLabel>
                    <Select
                        disabled={true}
                        value={condition.func || 'node_begin'}
                        displayEmpty
                    >
                        <MenuItem value="node_begin">{language === "enUS" ? "Filter start" : "Filterbeginn"}</MenuItem>
                        <MenuItem value="node_exclusion">{language === "enUS" ? "Exclusion filter" : "Ausschlussfilter"}</MenuItem>
                        <MenuItem value="and">{language === "enUS" ? "and" : "und"}</MenuItem>
                        <MenuItem value="or">{language === "enUS" ? "or" : "oder"}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="standard" sx={{gridColumn: "span 2 / span 2"}}>
                    <InputLabel id="demo-simple-select-standard-label">Layer</InputLabel>
                    <Select
                        disabled={true}
                        value={condition.entity || 'none'}
                        displayEmpty
                    >
                        <MenuItem value="none">-</MenuItem>
                        <MenuItem value="form">{language === "enUS" ? "Word form" : "Wortform"}</MenuItem>
                        <MenuItem value="lemma">Lemma</MenuItem>
                        <MenuItem value="pos">{language === "enUS" ? "Part of speech" : "Wortart"}</MenuItem>
                        <MenuItem value="punctuation">{language === "enUS" ? "Punctuation" : "Satzzeichen"}</MenuItem>
                        <MenuItem value="tonal_prominence">{language === "enUS" ? "Tonal prominence" : "Tonale Prominenz"}</MenuItem>
                        <MenuItem value="deprel">{language === "enUS" ? "Dependency relation" : "Dependenzrelation"}</MenuItem>
                        <MenuItem value="part_duration">{language === "enUS" ? "Word duration" : "Wortdauer"}</MenuItem>
                        <MenuItem value="bibo_performer">{language === "enUS" ? "Reader" : "SprecherIn"}</MenuItem>
                        <MenuItem value="dcterms_created">{language === "enUS" ? "Year created" : "Verfassungsjahr"}</MenuItem>
                        <MenuItem value="dcterms_issued">{language === "enUS" ? "Year recited" : "Rezitationsjahr"}</MenuItem>
                        <MenuItem value="dcterms_subject">{language === "enUS" ? "Title" : "Titel"}</MenuItem>
                        <MenuItem value="foaf_gender">{language === "enUS" ? "Reader's gender" : "Geschlecht SprecherIn"}</MenuItem>
                        <MenuItem value="pitch_accent">{language === "enUS" ? "Pitch accent" : "Pitch-Akzent"}</MenuItem>
                        <MenuItem value="boundary_tone">{language === "enUS" ? "Boundary tone" : "Grenzton"}</MenuItem>
                    </Select>
                </FormControl>

                <FormControl variant="standard" sx={{gridColumn: "span 2 / span 2"}}>
                    <InputLabel id="demo-simple-select-standard-label">Operator</InputLabel>
                    <Select
                        disabled={true}
                        value={condition.operator || 'none'}
                        displayEmpty
                    >
                        <MenuItem value="none">-</MenuItem>
                        <MenuItem value="equals">{language === "enUS" ? "equals" : "ist gleich"}</MenuItem>
                        <MenuItem value="equals_not">{language === "enUS" ? "equals not" : "ist ungleich"}</MenuItem>
                        <MenuItem value="contains">{language === "enUS" ? "contains" : "enthält"}</MenuItem>
                        <MenuItem value="contains_not">{language === "enUS" ? "contains not" : "enthält nicht"}</MenuItem>
                        <MenuItem value="greater_than">{language === "enUS" ? "bigger" : "größer"}</MenuItem>
                        <MenuItem value="less_than">{language === "enUS" ? "smaller" : "kleiner"}</MenuItem>
                    </Select>
                </FormControl>

                <TextField disabled={true} sx={{gridColumn: "span 3 / span 3"}} id="input-for-condition-retro"
                           variant="standard" label={language === "enUS" ? "Value" : "Wert"}
                           value={condition.conditionSearchInput || ''}/>

                <FormControl variant="standard" sx={{gridColumnStart: 5, gridColumnEnd: 7}}>
                    <InputLabel id="demo-simple-select-standard-label">Position</InputLabel>
                    <Select
                        disabled={true}
                        value={condition.where || 'anywhere'}
                        displayEmpty
                    >
                        <MenuItem value="anywhere">{language === "enUS" ? "anywhere" : "egal"}</MenuItem>
                        <MenuItem value="adjacent">{language === "enUS" ? "adjacent" : "anliegend"}</MenuItem>
                        <MenuItem value="non_adjacent">{language === "enUS" ? "nonadjacent" : "nicht anliegend"}</MenuItem>
                        <MenuItem value="rhyme_begin">{language === "enUS" ? "Ryhme start" : "Versbeginn"}</MenuItem>
                        <MenuItem value="rhyme_end">{language === "enUS" ? "Rhyme end" : "Versende"}</MenuItem>
                        <MenuItem value="verse_begin">{language === "enUS" ? "Verse start" : "Strophenbeginn"}</MenuItem>
                        <MenuItem value="verse_end">{language === "enUS" ? "Verse end" : "Strophenende"}</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        })
    }

    return (
        <div>
            {/*standard condition component*/}
            <Paper elevation={1} sx={{padding: "10px"}} key="topItem">
                <p style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    margin: "0px"
                }}>{language === "enUS" ? "Quick search" : "Schnellsuche"}</p>
                <Box sx={{display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "1rem", mt: 2}}>
                    {/*quick search bar*/}
                    <TextField key="searchFilter" sx={{gridColumn: "span 4 / span 4"}} id="input-with-sx"
                               label={language === "enUS" ? "Search" : "Suchen"}
                               variant="standard"
                               value={searchInput}
                               onChange={(event) => setSearchInput(event.target.value)}
                               disabled={conditions.length > 0}
                    />

                    {/*quick search select */}
                    <FormControl variant="standard" sx={{gridColumn: "span 2 / span 2"}}>
                        <InputLabel
                            id="demo-simple-select-standard-label">{language === "enUS" ? "Search for..." : "Suchen nach..."}</InputLabel>
                        <Select
                            value={searchFilter}
                            onChange={handleChange}
                            displayEmpty
                            disabled={conditions.length > 0}
                        >
                            <MenuItem value="all">{language === "enUS" ? "All" : "Alle"}</MenuItem>
                            <MenuItem value="title">{language === "enUS" ? "Title" : "Titel"}</MenuItem>
                            <MenuItem value="author">{language === "enUS" ? "Author" : "VerfasserIn"}</MenuItem>
                            <MenuItem value="reader">{language === "enUS" ? "Reader" : "SprecherIn"}</MenuItem>
                            <MenuItem value="text">Text</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Paper>

            <SimpleSnackbar/>

            <Paper elevation={1} sx={{padding: "10px", marginTop: "20px"}} key="bottomItem">
                <p style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    margin: "0px"
                }}>{language === "enUS" ? "Filter search" : "Filtersuche"}</p>

                {/*container for already added conditions*/}
                {showConditions()}

                {data && errorMessage ? <Alert
                    severity="warning"> {language === "enUS" ? "Invalid search: " : "Ungültige Suche: " + errorMessage}</Alert> : ""}
                {alertOn ? <Alert severity="error" onClose={() => {
                    setAlertOn(false)
                }}> {language === "enUS" ? "Unexpected error" : "Unerwarteter Fehler"} </Alert> : ""}
                <CreateNewCondition handleAddCondition={handleAddCondition}
                                    handleDeleteCondition={handleDeleteCondition}
                                    conditions={conditions}
                                    first={first} setFirst={setFirst}
                                    func={func} setFunc={setFunc}
                                    entity={entity} setEntity={setEntity}
                                    where={where} setWhere={setWhere}
                                    operator={operator} setOperator={setOperator}
                                    conditionSearchInput={conditionSearchInput}
                                    setConditionSearchInput={setConditionSearchInput}
                                    handleSavePreset={handleSavePreset}
                                    handleLoadPreset={handleLoadPreset}
                                    loadOpen={loadOpen} setLoadOpen={setLoadOpen}
                                    selectedValue={selectedValue}
                                    saveFilterName={saveFilterName} setSaveFilterName={setSaveFilterName}
                                    language={language}
                />
            </Paper>
        </div>
    );

}