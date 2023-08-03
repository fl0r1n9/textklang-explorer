import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Highlighter from "react-highlight-words";
import {Stack} from "@mui/material";
import Grid from "@mui/material/Grid";
import NotStartedIcon from '@mui/icons-material/NotStarted';
import DownloadIcon from '@mui/icons-material/Download';
import {Tooltip} from "@mui/material";

export default function ContentPage(props) {

    //parameters destructured
    const {
        selectedPoem,
        searchInput,
        searchFilter,
        canvasActive,
        setStart,
        setEnd,
        poemToCompare,
        data,
        playing,
        snippetPlaying,
        start,
        audioVisualization,
        pausedAt
    } = props;

    const [hovered, setHovered] = useState(null)

    //timer for visualization of spoken words
    const [currentTime, setCurrentTime] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        setCurrentTime(new Date(), 1000)
    }, [playing, snippetPlaying]);

    useEffect(() => {
        let interval = null;
        const date = new Date();
        if (playing) {
            interval = setInterval(() => {
                setElapsedTime((date / 1000 + pausedAt) - (currentTime / 1000));
            }, 100);
        }
        if (snippetPlaying) {
            interval = setInterval(() => {
                setElapsedTime((date / 1000 + start) - (currentTime / 1000));
            }, 100);
        }
        return () => {
            clearInterval(interval)
            if (!playing && !snippetPlaying) {
                setElapsedTime(0);
            }
        }
    })

    //variables for displaying content
    let tokenStream = [];
    let lineLength = 0;
    let lineLengths = [];

    //tokens to be highlighted
    let dataArray = []
    if (data) {
        dataArray = data.hits.filter((poem) => poem.poemIndex === selectedPoem.index).map((hit) => hit.tokenIndex)
    }

    //define text to be displayed and concat punctuation for pretty print
    const punctuationArrayEnd = [".", ",", ";", "!", "?", ":", ")", "«", "'"];
    const punctuationArrayFront = ["(", "»"];
    let previousPunctuation = [];
    let previous = false;

    for (const token of selectedPoem.tokens) {

        //handling punctuation
        if (previous) {
            tokenStream.push([[previousPunctuation[0], token.tokenString], token.startTime, token.endTime, [previousPunctuation[2], token.newline], [previousPunctuation[1], token.index]]);
            lineLength++
            previous = false
        } else if (punctuationArrayEnd.includes(token.tokenString)) {
            tokenStream[tokenStream.length - 1][0] = [...tokenStream[tokenStream.length - 1][0], token.tokenString]
            tokenStream[tokenStream.length - 1][3] = [...tokenStream[tokenStream.length - 1][3], token.newline]
            tokenStream[tokenStream.length - 1][4] = [...tokenStream[tokenStream.length - 1][4], token.index];

        } else if (punctuationArrayFront.includes(token.tokenString)) {
            previousPunctuation = [token.tokenString, token.index, token.newline];
            previous = true;
        }
        //normal adding to tokenStream
        else {
            tokenStream.push([[token.tokenString], token.startTime, token.endTime, [token.newline], [token.index]]);
            lineLength++;
        }

        //determining lines
        if (token.newline !== "none") {
            lineLengths.push(lineLength);
            lineLength = 0;
        }
    }

    //get index of spans by lineLenghts
    let spanIndex
    const getIndex = (l, i, v) => {
        spanIndex = l.slice(0, i).reduce((pv, cv) => pv + cv, 0) + v
        return spanIndex
    }

    //find index of concatenated tokens
    const concatIndexMatch = (l, i, v, inner) => {
        if (Array.isArray(tokenStream[getIndex(l, i, v)][4])) {
            if (dataArray.includes(tokenStream[getIndex(l, i, v)][4][inner])) {
                return true
            }
        } else if (dataArray.includes(tokenStream[getIndex(l, i, v)][4])) {
            return true
        }
    }

    return (
        <Box sx={{width: "100%"}}>
            <Box sx={{height: "33px", paddingBottom: "1px"}}>
                <h3 style={{overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                    <Highlighter
                        searchWords={(searchFilter === 'all' || searchFilter === 'author') ? [searchInput] : []}
                        autoEscape={true}
                        textToHighlight={selectedPoem.author.includes(",") ? selectedPoem.author.split(", ")[1] + " " + selectedPoem.author.split(", ")[0] + " - " + selectedPoem.title : selectedPoem.author + " - " + selectedPoem.title}
                        highlightStyle={{
                            borderRadius: "3px",
                            backgroundColor: "#4eeaea"
                        }}
                    >
                        {selectedPoem.author.includes(",") ? selectedPoem.author.split(", ")[1] + " " + selectedPoem.author.split(", ")[0] + " - " + selectedPoem.title : selectedPoem.author + " - " + selectedPoem.title}
                    </Highlighter>
                </h3>
            </Box>
            {poemToCompare && (selectedPoem !== poemToCompare) && canvasActive ?
                <Box sx={{visibility: "hidden", display: {xs: "none", md: "block"}, height: "48px"}}/> : ""}
            <div style={{padding: "10px"}}>
                <span style={{whiteSpace: "pre-line", fontStyle: 'calibri', fontSize: '15px', color: 'black'}}>
                       {lineLengths.map((wordInLine, index) => {
                           return (<div key={"div" + getIndex(lineLengths, index, 1)}>
                               <Grid container columnSpacing={1} sx={{justifyContent: 'center'}}
                                     onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)}>
                                   {hovered === index &&
                                       <Tooltip title="Diesen Vers abspielen"
                                                sx={{height: "15px", paddingTop: "15px"}}
                                                onClick={() => {
                                                    if (!snippetPlaying) {
                                                        props.setWordClicked(!props.wordClicked);
                                                        setStart(tokenStream[getIndex(lineLengths, index, 0)][1])
                                                        //only line
                                                        setEnd(tokenStream[getIndex(lineLengths, index, lineLengths[index] - 1)][2])
                                                        //until the end
                                                        //setEnd(tokenStream[getIndex(lineLengths, lineLengths[lineLengths.length - 1], lineLengths[index] - 1)][2])
                                                    }
                                                }}>
                                           <NotStartedIcon sx={{
                                               marginTop: canvasActive ? "23px" : "3px",
                                               cursor: "pointer",
                                               color: (playing || snippetPlaying) ? "#DEDEDE" : "#1976D2",
                                               width: "15px",
                                               height: "15px",
                                           }}
                                           />
                                       </Tooltip>
                                   }

                                   {Array.from(Array(wordInLine).keys()).map((value) => {
                                       /*Stack canvas (if selected in prosody tab) and spans including text*/
                                       return (
                                           <Grid item key={"item" + getIndex(lineLengths, index, value)}>
                                               <Stack
                                                   sx={{
                                                       flexDirection: "column",
                                                       display: "inline-flex",
                                                       cursor: "pointer",
                                                       '&:hover': {color: "#1976D2"}
                                                   }}>
                                                   {canvasActive ? <div style={{
                                                       height: "20px", width: "2px"
                                                   }}/> : ""}
                                                   <div>
                                                       {tokenStream[getIndex(lineLengths, index, value)][0].map((tokenString, innerIndex) =>
                                                               <span
                                                                   key={"span" + getIndex(lineLengths, index, value) + "-" + innerIndex}
                                                                   id={getIndex(lineLengths, index, value)}
                                                                   style={{
                                                                       borderRadius: "3px",
                                                                       backgroundColor: concatIndexMatch(lineLengths, index, value, innerIndex) ? '#ea9c4e' : '',
                                                                       fontWeight: (audioVisualization && (playing || snippetPlaying) && elapsedTime.toFixed(2) >= tokenStream[getIndex(lineLengths, index, value)][1] && elapsedTime.toFixed(2) <= tokenStream[getIndex(lineLengths, index, value)][2]) ? "bold" : ""
                                                                   }}>
                                                                <Highlighter
                                                                    searchWords={(searchFilter === 'all' || searchFilter === 'text') ? [searchInput] : []}
                                                                    autoEscape={true}
                                                                    textToHighlight={tokenString}
                                                                    highlightStyle={{
                                                                        borderRadius: "3px",
                                                                        backgroundColor: "#4eeaea"
                                                                    }}
                                                                    onClick={ /*get start and end time of clicked token*/ () => {
                                                                        setStart(tokenStream[getIndex(lineLengths, index, value)][1])
                                                                        props.setWordClicked(!props.wordClicked)
                                                                        setEnd(tokenStream[getIndex(lineLengths, index, value)][2])
                                                                        // console.log(tokenStream[getIndex(lineLengths, index, value)], lineLengths, index, value)
                                                                    }}
                                                                >
                                                                    {tokenString}
                                                                </Highlighter>
                                                       </span>
                                                       )}
                                                   </div>
                                                   {!canvasActive && (tokenStream[getIndex(lineLengths, index, value)][3].includes("O") || tokenStream[getIndex(lineLengths, index, value)][3].includes("S")) ?
                                                       <div style={{
                                                           height: "20px", width: "2px"
                                                       }}/> : ""}
                                               </Stack>
                                           </Grid>)
                                   })}

                                   {hovered === index && (
                                       <Tooltip title="Vers herunterladen" sx={{height: "14px", paddingTop: "14px"}}>
                                           <a href={`${process.env.REACT_APP_RHYMES_PATH}/${selectedPoem.documentId}/${index}.wav`}
                                              target="_blank" //to prevent the page to be overwritten in Chrome
                                              download>
                                               <DownloadIcon style={{
                                                   marginLeft: "10px",
                                                   marginTop: canvasActive ? "23px" : "3px",
                                                   cursor: "pointer",
                                                   color: "#1976D2",
                                                   width: "15px",
                                                   height: "15px"
                                               }}/>
                                           </a>
                                       </Tooltip>
                                   )}
                               </Grid>
                           </div>)
                       })}
            </span>
            </div>
        </Box>
    );
}

