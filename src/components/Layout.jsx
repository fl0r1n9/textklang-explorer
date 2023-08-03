import * as React from 'react';
import {styled} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import ContentTable from "./ContentTable";
import Nav from "./Nav";
import ContentPage from "./ContentPage";
import {Tab, Tabs, useTheme} from "@mui/material";
import DetailsTab from "./DetailsTab";
import ProsodyTab from "./ProsodyTab";
import POSTab from "./POSTab";
import {useState} from "react";
import SearchPage from "./SearchPage";

import {createTheme, ThemeProvider} from "@mui/material/styles";
import * as locales from '@mui/material/locale';

const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2, padding: theme.spacing(1), textAlign: 'center', color: theme.palette.text.secondary,
}));


export default function Layout(props) {

    const [language, setLanguage] = React.useState('deDE');

    const theme = useTheme();

    const themeWithLocale = React.useMemo(
        () => createTheme(theme, locales[language]),
        [language, theme],
    );

    const {all_poems_json} = props;

    //global states
    const [selectedPoem, setSelectedPoem] = React.useState(null);
    const [searchInput, setSearchInput] = React.useState('');
    const [searchFilter, setSearchFilter] = React.useState('all');
    const [conditions, setConditions] = React.useState([]);

    const [value, setValue] = React.useState(0);

    const [canvasActive, setCanvasActive] = React.useState(false);
    const [start, setStart] = React.useState(0);
    const [end, setEnd] = React.useState(0);
    const [wordClicked, setWordClicked] = React.useState(false);

    const [audioVisualization, setAudioVisualization] = useState(true);
    const [painteTooltip, setPainteTooltip] = useState(true);

    const [readingsArray, setReadingsArray] = React.useState([]);
    const [poemToCompare, setPoemToCompare] = React.useState(null);

    const [playing, setPlaying] = React.useState(false);
    const [snippetPlaying, setSnippetPlaying] = React.useState(false);
    const [pausedAt, setPausedAt] = React.useState(0);

    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);

    // fetch data from backend
    const [data, setData] = React.useState(null);


    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 2) {
            setCanvasActive(true)

        } else {
            setCanvasActive(false)
        }
    };

    //main view
    return (
        <ThemeProvider theme={themeWithLocale}>
            {/*minHeight of Nav due to AppBar is 64px*/}
            <Nav
                playing={playing} setPlaying={setPlaying} selectedPoem={selectedPoem}
                setSelectedPoem={setSelectedPoem} start={start} end={end} wordClicked={wordClicked}
                all_poems_json={all_poems_json} readingsArray={readingsArray}
                poemToCompare={poemToCompare} setPoemToCompare={setPoemToCompare}
                audioVisualization={audioVisualization} setAudioVisualization={setAudioVisualization}
                painteTooltip={painteTooltip} setPainteTooltip={setPainteTooltip}
                snippetPlaying={snippetPlaying} setSnippetPlaying={setSnippetPlaying} pausedAt={pausedAt}
                setPausedAt={setPausedAt}
                language={language} setLanguage={setLanguage}
                setValue={setValue} setCanvasActive={setCanvasActive}
            />
            <Box sx={{
                marginTop: "64px",
                paddingLeft: {xs: "20px", md: "10px", xl: "0px"},
                paddingRight: {xs: "20px", md: "10px", xl: "0px"},
                paddingTop: "20px",
                paddingBottom: "20px",
                maxWidth: "1536px",
                minWidth: {md: "860px", lg: "1150px", xl: "1400px"},
                marginX: {xs: "0px", xl: "auto"},
            }}>
                <Grid container rowSpacing={3} columnSpacing={{xs: 1, lg: 2}}>
                    {/*left component*/}
                    <Grid item xs={12} md={6}>
                        {/*render text when table entry is chosen*/}
                        {selectedPoem === null ? (
                            <Item>
                                <ContentTable
                                    setReadingsArray={setReadingsArray}
                                    setSelectedPoem={setSelectedPoem}
                                    searchInput={searchInput}
                                    searchFilter={searchFilter}
                                    all_poems_json={all_poems_json}
                                    conditions={conditions}
                                    data={data}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    language={language}
                                />
                            </Item>
                        ) : (
                            <Item>
                                <ContentPage TabPanel={TabPanel} wordClicked={wordClicked}
                                             setWordClicked={setWordClicked}
                                             setStart={setStart} setEnd={setEnd} all_poems_json={all_poems_json}
                                             selectedPoem={selectedPoem}
                                             setSelectedPoem={setSelectedPoem} searchInput={searchInput}
                                             searchFilter={searchFilter}
                                             setValue={setValue} canvasActive={canvasActive}
                                             setCanvasActive={setCanvasActive}
                                             poemToCompare={poemToCompare} setPoemToCompare={setPoemToCompare}
                                             data={data}
                                             playing={playing} audioVisualization={audioVisualization}
                                             snippetPlaying={snippetPlaying} start={start}
                                             language={language} pausedAt={pausedAt}
                                />
                            </Item>
                        )}

                    </Grid>
                    {/*right component*/}
                    <Grid item xs={12} md={6}>
                        <Item>
                            <Box sx={{width: '100%'}}>
                                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                    <Tabs value={value} onChange={handleChange}>
                                        <Tab label={language === "enUS" ? "Search" : "Suche"}/>
                                        <Tab label={language === "enUS" ? "Metadata" : "Metadaten"}
                                             disabled={selectedPoem === null}/>
                                        <Tab label={language === "enUS" ? "Prosody" : "Prosodie"}
                                             disabled={selectedPoem === null}/>
                                        <Tab label="POS Tags"/>
                                    </Tabs>
                                </Box>
                                <TabPanel value={value} index={0}>
                                    <SearchPage searchInput={searchInput}
                                                setString={setSearchInput}
                                                searchFilter={searchFilter}
                                                setSearchFilter={setSearchFilter}
                                                setSearchInput={setSearchInput}
                                                conditions={conditions}
                                                setConditions={setConditions}
                                                setData={setData}
                                                data={data}
                                                language={language}
                                    />
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    {selectedPoem ?
                                        <DetailsTab selectedPoem={selectedPoem} poemToCompare={poemToCompare}
                                                    readingsArray={readingsArray} language={language}/> :
                                        <h1>Für die Detailansicht bitte ein neues Gedicht auswählen</h1>}
                                </TabPanel>
                                <TabPanel value={value} index={2}>
                                    {<ProsodyTab selectedPoem={selectedPoem} poemToCompare={poemToCompare}
                                                 readingsArray={readingsArray} language={language} painteTooltip={painteTooltip}/>}
                                </TabPanel>
                                <TabPanel value={value} index={3}>
                                    {<POSTab language={language}/>}
                                </TabPanel>
                            </Box>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
}


function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (<div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
    >
        {value === index && (<Box sx={{p: 3, padding: "10px"}}>
            {/*was surrounded by <Typography>*/}
            {children}
        </Box>)}
    </div>);
}
