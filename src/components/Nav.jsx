import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Zoom from '@mui/material/Zoom';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from '@mui/icons-material/Stop';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import SettingsIcon from '@mui/icons-material/Settings';
import {Howl} from "howler";
import {ListItemIcon, Menu, MenuItem, Snackbar} from "@mui/material"
import {useEffect} from "react"
import ReactHowler from 'react-howler'
import Button from "@mui/material/Button";
import {Check} from "@mui/icons-material";

function ScrollTop(props) {
    const {children, window} = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        target: window ? window() : undefined, disableHysteresis: true, threshold: 100,
    });

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor',);

        if (anchor) {
            anchor.scrollIntoView({
                behavior: 'smooth', block: 'center',
            });
        }
    };

    return (<Zoom in={trigger}>
        <Box
            onClick={handleClick}
            role="presentation"
            sx={{position: 'fixed', bottom: 16, right: 16, zIndex: 9999}}
        >
            {children}
        </Box>
    </Zoom>);
}

ScrollTop.propTypes = {
    children: PropTypes.element.isRequired, /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default function Nav(props) {

    const {
        selectedPoem,
        setSelectedPoem,
        start,
        end,
        wordClicked,
        readingsArray,
        poemToCompare,
        setPoemToCompare,
        playing,
        setPlaying,
        audioVisualization,
        setAudioVisualization,
        painteTooltip,
        setPainteTooltip,
        language,
        setLanguage,
        snippetPlaying,
        setSnippetPlaying,
        setValue,
        setCanvasActive,
        pausedAt,
        setPausedAt
    } = props;

    //cycle through other readings
    const [noInReadings, setNoInReadings] = React.useState(0);
    const handleClickForward = () => {
        if ((noInReadings + 1 === readingsArray.length) || readingsArray.length === 1) {
            return null;
        } else {
            setNoInReadings(noInReadings + 1);
            setPlaying(false);
            setSnippetPlaying(false);
        }
    }

    const handleClickBack = () => {
        if (noInReadings === 0 || readingsArray.length === 1) {
            return null;
        } else {
            setNoInReadings(noInReadings - 1);
            setPlaying(false);
            setSnippetPlaying(false);
        }
    }

    //for switching to the next reading via left/right buttons
    useEffect(() => {
        if (selectedPoem) {
            setSelectedPoem(readingsArray[noInReadings]);
        }
    }, [noInReadings, selectedPoem, setSelectedPoem, readingsArray])

    useEffect(() => {
        if (selectedPoem === null) {
            setNoInReadings(0);
            setPlaying(false);
            setSnippetPlaying(false);
        }
    }, [selectedPoem])

    //Howler hooks
    const [volume, setVolume] = React.useState(1.0);

    //load audio file from name
    let entireAudio = null
    let audioString
    if (selectedPoem) {
        try {
            audioString = require(process.env.REACT_APP_SOUND_PATH + selectedPoem.audio)
            entireAudio = new Howl({
                src: [audioString], html5: true, preload: false,
                loop: false
            });

        } catch (e) {
            console.log("Fehler in Howler: ", e.toString());
        }
    }

    //check for click in ContentPage and play word interval
    useEffect(() => {
        if (selectedPoem && !playing) {
            audioString = require(process.env.REACT_APP_SOUND_PATH + selectedPoem.audio)
            const snippet = new Howl({
                src: [audioString], html5: true, preload: false,
                sprite: {
                    interval: [start * 1000, (end - start) * 1000],
                }
            })
            snippet.play('interval')
            setSnippetPlaying(true);

            snippet.on('end', function () {
                setSnippetPlaying(false);
            });

        }
    }, [wordClicked])

    //snackbar hooks
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    useEffect(() => {
        language === "enUS" ? setMessage("Volume: " + volume.toFixed(1) * 100 + "%") : setMessage("Lautstärke: " + volume.toFixed(1) * 100 + "%")
    }, [volume, language])


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
                autoHideDuration={500}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                message={message}
            />
        </div>);
    }

    //menu hooks
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handlePainteTooltip = () => {
        setPainteTooltip(!painteTooltip);
    }

    const handleAudioVisualization = () => {
        setAudioVisualization(!audioVisualization);
    }

    const handleLanguage = () => {
        language === "enUS" ? setLanguage("deDE") : setLanguage("enUS");
    }

    function BasicMenu() {

        return (
            <div>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    disableScrollLock={true}
                    open={openMenu}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={handleAudioVisualization}>
                        <ListItemIcon>
                            {audioVisualization ? <Check/> : ""}
                        </ListItemIcon>
                        {language === "enUS" ? "Audio visualization" : "Audio-Visualisierung"}
                    </MenuItem>
                    <MenuItem onClick={handlePainteTooltip}>
                        <ListItemIcon>
                            {painteTooltip ? <Check/> : ""}
                        </ListItemIcon>
                        {language === "enUS" ? "Show PaIntE Tooltips" : "PaIntE-Tooltips anzeigen"}
                    </MenuItem>
                    <MenuItem onClick={handleLanguage}>
                        <ListItemIcon>
                            {language === "enUS" ? <span className="fi fi-de"/> : <span className="fi fi-us"/>}
                        </ListItemIcon>
                        {language === "enUS" ? "Change language" : "Sprache ändern"}
                    </MenuItem>
                </Menu>
            </div>
        );
    }

    return (
        <Box sx={{display: "flex"}}>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/css/flag-icons.min.css"
            />
            <CssBaseline/>
            <AppBar>
                <SimpleSnackbar/>
                {(selectedPoem && !snippetPlaying) ?
                    <ReactHowler
                        src={audioString}
                        playing={playing}
                        volume={volume}
                        ref={(ref) => (entireAudio = ref)}
                        onEnd={() => setPlaying(false)}
                    /> : ""}

                <Toolbar
                    sx={{paddingLeft: "10px", alignItems: "center", display: "flex", justifyContent: "space-between", gridColumn: "span 6 / span 6"}}>
                    <Box sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                        {selectedPoem && (
                            <ArrowBackIos onClick={() => {
                                setSelectedPoem(null);
                                setValue(0);
                                setPausedAt(0)
                                setCanvasActive(false);
                                setPoemToCompare(null)
                            }} sx={{cursor: "pointer", marginRight: {xs:"5px", md:"10px"}, width:{xs:"18px", sm:"auto"}, '&:hover': {color: "#DEDEDE"}}}>
                                {language === "enUS" ? "Back" : "Zurück"}
                            </ArrowBackIos>
                        )}
                        <Typography variant="h6" component="div" sx={{mr:"10px", fontSize:{xs:"15px", sm: "20px"}}}>
                            {selectedPoem ?
                                language === "enUS" ?
                                    "Reader:  " + selectedPoem.reader.split(", ")[1] + " " + selectedPoem.reader.split(", ")[0] + " (" + selectedPoem.year + ")"
                                    :
                                    selectedPoem.reader.includes("&") ?
                                        "Rezitation von " + selectedPoem.reader + " (" + selectedPoem.year + ")"
                                        :
                                        "Rezitation von " + selectedPoem.reader.split(", ")[1] + " " + selectedPoem.reader.split(", ")[0] + " (" + selectedPoem.year + ")"
                                :
                                "»textklang« Explorer"}
                        </Typography>
                        <Box sx={{display:"flex", alignItems: "center", gap: "10px"}}>
                            <PlayArrowIcon
                                color={selectedPoem ? ((!playing && !snippetPlaying) ? "white" : "disabled") : "disabled"}
                                sx={{
                                    cursor: selectedPoem ? 'pointer' : 'auto',
                                    '&:hover': selectedPoem ? ((!playing && !snippetPlaying) ? {color: "#DEDEDE"} : "disabled") : "disabled"
                                }} onClick={() => {
                                if (!snippetPlaying) {
                                    setPlaying(true)
                                    if(pausedAt !== 0){
                                        entireAudio.seek(pausedAt)
                                    }
                                    setOpen(true)
                                    language === "enUS" ? setMessage("Audio playing") : setMessage("Audio wird abgespielt")
                                }
                            }}/>

                            <PauseIcon color={selectedPoem ? (playing ? "white" : "disabled") : "disabled"}
                                       sx={{
                                           cursor: selectedPoem ? 'pointer' : 'auto',
                                           '&:hover': selectedPoem ? (playing ? {color: "#DEDEDE"} : "disabled") : "disabled"
                                       }} onClick={() => {
                                setPlaying(false)
                                setOpen(true)
                                language === "enUS" ? setMessage("Audio paused") : setMessage("Audio pausiert")
                                setPausedAt(entireAudio.seek())
                            }}/>
                            <StopIcon color={selectedPoem ? "white" : "disabled"}
                                      sx={{
                                          cursor: selectedPoem ? 'pointer' : 'auto',
                                          '&:hover': selectedPoem && {color: "#DEDEDE"}
                                      }}
                                      onClick={() => {
                                          setPlaying(false)
                                          entireAudio.seek(0)
                                          setPausedAt(0)
                                          setOpen(true)
                                          language === "enUS" ? setMessage("Audio stopped") : setMessage("Audio gestoppt")
                                      }}/>
                            <VolumeDownIcon
                                sx={{cursor: 'pointer', borderRadius: "10px", '&:hover': {color: "#DEDEDE"}}}
                                onClick={() => {
                                    if (volume >= 0.09) {
                                        setVolume(volume - 0.1)
                                    }
                                    setOpen(true)
                                }}/>
                            <VolumeUpIcon sx={{cursor: 'pointer', borderRadius: "10px", '&:hover': {color: "#DEDEDE"}}}
                                          onClick={() => {
                                              if (volume !== 1) {
                                                  setVolume(volume + 0.1)
                                              }
                                              setOpen(true)
                                          }}/>
                        </Box>
                    </Box>

                    <Box sx={{display: selectedPoem ? {xs:"none", md:"flex"} : "flex", flexDirection: "row", alignItems: 'center'}}>
                        {selectedPoem ?
                            <>
                                <Button sx={{
                                    paddingX:"8px",
                                    marginRight: "15px",
                                    backgroundColor: "#ffffff",
                                    color: "#1976d2",
                                    '&:hover': {backgroundColor: "#eaeaea", color: "#1976d2"},
                                    display:  (readingsArray.length < 2) ? "none" : "inline"
                                }} variant="outlined" onClick={() => {
                                    if (poemToCompare === null) {
                                        setPoemToCompare(selectedPoem);
                                    }
                                    if (poemToCompare !== null) {
                                        setPoemToCompare(null);
                                    }
                                }} disabled={readingsArray.length === 1}>{poemToCompare ?
                                    language === "enUS" ?
                                        "End"
                                        :
                                        "Beenden"
                                    :
                                    language === "enUS" ?
                                        "Compare"
                                        :
                                        "Vergleichen"
                                }
                                </Button>
                                <ArrowBackIos sx={{cursor: 'pointer', '&:hover': {color: "#DEDEDE"}, display:  (readingsArray.length < 2) ? "none" : "inline"}}
                                              onClick={handleClickBack}/>
                                <Typography variant="h8" sx={{mr: "5px"}}>

                                    {language === "enUS" ?
                                        "Recitation "
                                        :
                                        "Rezitation "
                                    }

                                    {noInReadings + 1 + "/" + (readingsArray.length)}

                                </Typography>
                                <ArrowForwardIos sx={{cursor: 'pointer', '&:hover': {color: "#DEDEDE"}, display:  (readingsArray.length < 2) ? "none" : "inline"}}
                                                 onClick={handleClickForward}/>
                            </>
                            :
                            <>
                                <SettingsIcon sx={{cursor: 'pointer', '&:hover': {color: "#DEDEDE"}}}
                                              onClick={handleClickMenu}/>
                                <BasicMenu/>
                            </>
                        }
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar id="back-to-top-anchor" style={{minHeight: 1}}/>
            <ScrollTop {...props} sx={{zIndex: 10, backgroundColor: "#1976D2"}}>
                <Fab color="primary" size="small" aria-label="scroll back to top"
                     sx={{zIndex: 10, backgroundColor: "#1976D2"}}>
                    <KeyboardArrowUpIcon/>
                </Fab>
            </ScrollTop>
        </Box>
    );
}