import * as React from "react";
import {Stack, tooltipClasses} from "@mui/material";
import Grid from "@mui/material/Grid";
import {useEffect, useRef} from "react";
import Tooltip from '@mui/material/Tooltip';
import {styled} from "@mui/material/styles";

export default function ProsodyTab(props) {

    const {selectedPoem, poemToCompare, readingsArray, language, painteTooltip} = props;

    let lineLength = 0;
    let lineLengths = [];
    let sampaStream = [];

    //check whether sometimes false syllable counts occur
    //get all sampa strings, relevant painte values & lineLengths for rendering
    for (const token of selectedPoem.tokens) {
        if (!isNaN(token.syllableCount)) {
            for (let i = 0; i < token.sampa.length; i++) {
                //values higher than 22 would exclude one recitation completely
                if (token.b[i] > 0 && (token.c1[i] >= 22 || token.c2[i] >= 22) && token.d[i] < 600) {
                    sampaStream.push([token.sampa[i], true, token.b[i], token.c1[i], token.c2[i], token.d[i]//,{start: token.startTime, end: token.endTime}
                    ]);
                    lineLength++;
                } else {
                    sampaStream.push([token.sampa[i], false]); // {start: token.startTime, end: token.endTime}
                    lineLength++;
                }
            }
        }
        if (token.newline !== "none") {
            lineLengths.push(lineLength);
            lineLength = 0;
        }
    }

    //condition for compare view
    if (poemToCompare !== null && poemToCompare !== selectedPoem) {
        //get difference in tokens
        const compareTokenLengths = () => {
            return selectedPoem.tokens.length - poemToCompare.tokens.length;
        }

        //match texts of selectedPoem and poemToCompare
        let matchedCompare = [];
        let currentDifference = 0;

        if (compareTokenLengths() === 0) {
            matchedCompare = poemToCompare.tokens;
        }

        try {
            if (compareTokenLengths() > 0) {
                //more is displayed than poemToCompare contains
                for (let i = 0; i < selectedPoem.tokens.length; i++) {
                    if (poemToCompare.tokens[i - currentDifference].tokenString === selectedPoem.tokens[i].tokenString) {
                        matchedCompare.push(poemToCompare.tokens[i - currentDifference]);
                    } else {
                        if (currentDifference === compareTokenLengths() && poemToCompare.tokens[i - currentDifference].tokenString !== selectedPoem.tokens[i].tokenString) {
                            matchedCompare.push(poemToCompare.tokens[i]);
                        } else {
                            //create a dummy token that won't display a canvas, since c1&c2 = 0
                            let dummy = selectedPoem.tokens[i];
                            //caused an error in An den Mond: Görner
                            if (dummy.c1 === null) {
                                dummy.c1 = [0];
                            }
                            if (dummy.c2 === null) {
                                dummy.c2 = [0];
                            }
                            for (let j = 0; j < dummy.c1.length; j++) {
                                dummy.c1[j] = 0;
                            }
                            for (let j = 0; j < dummy.c2.length; j++) {
                                dummy.c2[j] = 0;
                            }
                            matchedCompare.push(dummy);
                            currentDifference++;
                        }
                    }
                }
            }


            if (compareTokenLengths() < 0) {
                //poemToCompare has more Tokens -> omit all different tokens until numbers align

                for (let i = 0; i < poemToCompare.tokens.length; i++) {
                    if (poemToCompare.tokens[i].tokenString === selectedPoem.tokens[i - currentDifference].tokenString) {
                        matchedCompare.push(poemToCompare.tokens[i]);
                    } else {
                        if (currentDifference === -(compareTokenLengths()) && poemToCompare.tokens[i].tokenString !== selectedPoem.tokens[i - currentDifference].tokenString) {
                            matchedCompare.push(poemToCompare.tokens[i]);
                        } else {
                            currentDifference++;
                        }
                    }
                }
            }

            let sampaCounter = 0;
            for (let k = 0; k < matchedCompare.length; k++) {
                if (!isNaN(matchedCompare[k].syllableCount)) {
                    for (let i = 0; i < matchedCompare[k].sampa.length; i++) {
                        if (matchedCompare[k].b[i] > 0 && (matchedCompare[k].c1[i] >= 30 || matchedCompare[k].c2[i] >= 30) && matchedCompare[k].d[i] < 600) {
                            sampaStream[sampaCounter].push(true, matchedCompare[k].b[i], matchedCompare[k].c1[i], matchedCompare[k].c2[i], matchedCompare[k].d[i]);
                        } else {
                            sampaStream[sampaCounter].push(false);
                        }
                        sampaCounter = sampaCounter + 1;
                    }
                }
            }

        } catch (e) {
            console.log("Can't compare prosody", e)
        }
    }

    //min&max values
    let maxes = []
    let mins1 = []
    let mins2 = []

    for (const sampa of sampaStream) {
        if (sampa[1] === true) {
            maxes = maxes.concat(sampa[5])
            mins1 = mins1.concat(sampa[3])
            mins2 = mins2.concat(sampa[4])
        }
    }

    if (poemToCompare !== null && poemToCompare !== selectedPoem) {
        for (const sampa of sampaStream) {
            if (!sampaStream[1] && sampaStream[2]) {
                maxes = maxes.concat(sampa[6])
                mins1 = mins1.concat(sampa[4])
                mins2 = mins2.concat(sampa[5])
            } else {
                maxes = maxes.concat(sampa[10])
                mins1 = mins1.concat(sampa[8])
                mins2 = mins2.concat(sampa[9])
            }
        }
    }

    //determine max value for y-axis, filter out outliers >600Hz
    const max = maxes.filter(d => !isNaN(d) && d < 600).reduce((prev, curr) => {
        return (prev > curr) ? prev : curr
    })

    // determine minimal value for y-axis
    // Min(all d-c1, all d-c2)
    // if any c>d: min = 0
    const min = Math.max(0, Math.min(maxes.filter(d => !isNaN(d)).map((item, index) => {
        return item - mins1.filter(c1 => !isNaN(c1))[index]
    }).reduce((prev, curr) => {
        return (prev < curr) ? prev : curr
    }), maxes.filter(d => !isNaN(d)).map((item, index) => {
        return item - mins2.filter(c2 => !isNaN(c2))[index]
    }).reduce((prev, curr) => {
        return (prev < curr) ? prev : curr
    })))

    //custom Canvas component
    const Canvas = props => {

        const {coordinates} = props
        const canvasRef = useRef(null)
        const adapter = 150 / (max - min)

        //ctx.canvas.width: 300 & ctx.canvas.height: 150
        const draw = ctx => {

            if (coordinates[1]) {
                //element 1
                ctx.beginPath();
                ctx.strokeStyle = "#000000";
                ctx.moveTo(0, ctx.canvas.height - (coordinates[5] - coordinates[3] - min) * adapter)
                ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height - (coordinates[5] - min) * adapter)
                ctx.moveTo(ctx.canvas.width / 2, ctx.canvas.height - (coordinates[5] - min) * adapter)
                ctx.lineTo(ctx.canvas.width, ctx.canvas.height - (coordinates[5] - coordinates[4] - min) * adapter)
                ctx.lineWidth = 10
                ctx.stroke()
            }

            //compare view
            if (poemToCompare && poemToCompare !== selectedPoem) {
                //show graphs if only poemToCompare has relevant values
                if (!coordinates[1] && coordinates[2]) {
                    ctx.beginPath();
                    ctx.strokeStyle = "#1976d2";
                    ctx.moveTo(0, ctx.canvas.height - (coordinates[6] - coordinates[4] - min) * adapter)
                    ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height - (coordinates[6] - min) * adapter)
                    ctx.moveTo(ctx.canvas.width / 2, ctx.canvas.height - (coordinates[6] - min) * adapter)
                    ctx.lineTo(ctx.canvas.width, ctx.canvas.height - (coordinates[6] - coordinates[5] - min) * adapter)
                    ctx.lineWidth = 10;
                    ctx.stroke();
                } else {
                    //show graphs if both have relevant values
                    ctx.beginPath();
                    ctx.strokeStyle = "#1976d2";
                    ctx.moveTo(0, ctx.canvas.height - (coordinates[10] - coordinates[8] - min) * adapter)
                    ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height - (coordinates[10] - min) * adapter)
                    ctx.moveTo(ctx.canvas.width / 2, ctx.canvas.height - (coordinates[10] - min) * adapter)
                    ctx.lineTo(ctx.canvas.width, ctx.canvas.height - (coordinates[10] - coordinates[9] - min) * adapter)
                    ctx.lineWidth = 10;
                    ctx.stroke();
                }
            }
        }

        useEffect(() => {

            const canvas = canvasRef.current
            const context = canvas.getContext('2d')
            draw(context)
        })

        return <canvas ref={canvasRef} {...props}/>
    }

    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: 'black',
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
        },
    }));

    //get index of spans by lineLenghts
    let spanIndex
    const getIndex = (l, i, v) => {
        spanIndex = l.slice(0, i).reduce((pv, cv) => pv + cv, 0) + v
        return spanIndex
    }

    return (
        <>
            <style>
                {`#preline {
          white-space: pre-line;
          font-style: calibri;
           font-size: 15px;
           color:black;
        }`}
            </style>

            {poemToCompare && (selectedPoem !== poemToCompare) &&
                <p style={{color: "#1976d2"}}>{poemToCompare && (selectedPoem !== poemToCompare) ? (language === "enUS" ? "Comparing to " : "Vergleiche mit ") + (parseInt(readingsArray.indexOf(poemToCompare)) + 1) + ": " + poemToCompare.reader.split(", ")[1] + " " + poemToCompare.reader.split(", ")[0] + " (" + poemToCompare.year + ")" : ""}</p>}
            <span id="preline">
            {lineLengths.map((wordInLine, index) => {
                return <Grid container columnSpacing={0} sx={{justifyContent: 'center'}} key={wordInLine + "" + index}>
                    {Array.from(Array(wordInLine).keys()).map((value) => {
                        return <Grid item key={"Griditem" + value}>
                            <HtmlTooltip
                                    title={ painteTooltip &&
                                <>
                                        {
                                            (sampaStream[getIndex(lineLengths, index, value)][1]) || (sampaStream[getIndex(lineLengths, index, value)][2]) ?

                                            <table>
                                                <tr>
                                                    <td style={{fontWeight:"bold"}}>b</td>
                                                    {(sampaStream[getIndex(lineLengths, index, value)][1]) && <td>{sampaStream[getIndex(lineLengths, index, value)][2].toFixed(2)}</td>}
                                                    {(sampaStream[getIndex(lineLengths, index, value)][1] && sampaStream[getIndex(lineLengths, index, value)][6]) && <td style={{color:"#1976D2"}}>{sampaStream[getIndex(lineLengths, index, value)][7].toFixed(2)}</td>}
                                                    {(!sampaStream[getIndex(lineLengths, index, value)][1] && sampaStream[getIndex(lineLengths, index, value)][2]) && <td style={{color:"#1976D2"}}>{sampaStream[getIndex(lineLengths, index, value)][3].toFixed(2)}</td>}
                                                </tr>
                                                <tr>
                                                    <td style={{fontWeight:"bold"}}>c1</td>
                                                    {(sampaStream[getIndex(lineLengths, index, value)][1]) && <td>{sampaStream[getIndex(lineLengths, index, value)][3].toFixed(2)}</td>}
                                                    {(sampaStream[getIndex(lineLengths, index, value)][1] && sampaStream[getIndex(lineLengths, index, value)][6]) && <td style={{color:"#1976D2"}}>{sampaStream[getIndex(lineLengths, index, value)][8].toFixed(2)}</td>}
                                                    {(!sampaStream[getIndex(lineLengths, index, value)][1] && sampaStream[getIndex(lineLengths, index, value)][2]) && <td style={{color:"#1976D2"}}>{sampaStream[getIndex(lineLengths, index, value)][4].toFixed(2)}</td>}
                                                </tr>
                                                <tr>
                                                    <td style={{fontWeight:"bold"}}>c2</td>
                                                    {(sampaStream[getIndex(lineLengths, index, value)][1]) && <td>{sampaStream[getIndex(lineLengths, index, value)][4].toFixed(2)}</td>}
                                                    {(sampaStream[getIndex(lineLengths, index, value)][1] && sampaStream[getIndex(lineLengths, index, value)][6]) && <td style={{color:"#1976D2"}}>{sampaStream[getIndex(lineLengths, index, value)][9].toFixed(2)}</td>}
                                                    {(!sampaStream[getIndex(lineLengths, index, value)][1] && sampaStream[getIndex(lineLengths, index, value)][2]) && <td style={{color:"#1976D2"}}>{sampaStream[getIndex(lineLengths, index, value)][5].toFixed(2)}</td>}
                                                </tr>
                                                <tr>
                                                    <td style={{fontWeight:"bold"}}>d</td>
                                                    {(sampaStream[getIndex(lineLengths, index, value)][1]) && <td>{sampaStream[getIndex(lineLengths, index, value)][5].toFixed(2)}</td>}
                                                    {(sampaStream[getIndex(lineLengths, index, value)][1] && sampaStream[getIndex(lineLengths, index, value)][6]) && <td style={{color:"#1976D2"}}>{sampaStream[getIndex(lineLengths, index, value)][10].toFixed(2)}</td>}
                                                    {(!sampaStream[getIndex(lineLengths, index, value)][1] && sampaStream[getIndex(lineLengths, index, value)][2]) && <td style={{color:"#1976D2"}}>{sampaStream[getIndex(lineLengths, index, value)][6].toFixed(2)}</td>}
                                                </tr>
                                            </table>
                                            :
                                            <span>{ language === "enUS" ? "No PaIntE parameters " : "Keine PaIntE-Parameter"}</span>
                                        }
                                        </>
                                        }
                                >

                                <Stack
                                sx={{flexDirection: "column", display: "inline-flex",'&:hover': {color: "#1976D2"}}}
                            >
                                {/*div = dummy canvas, if paintE parameters not relevant*/}
                                {sampaStream[getIndex(lineLengths, index, value)].includes(true) ?
                                    <Canvas coordinates={sampaStream[getIndex(lineLengths, index, value)]}
                                            style={{
                                                height: "20px",
                                                width: Math.max(20, (sampaStream[getIndex(lineLengths, index, value)][0].length * 10)).toString() + "px"
                                            }}/> : <div style={{
                                        height: "20px",
                                        width: Math.max(20, (sampaStream[getIndex(lineLengths, index, value)][0].length * 10)).toString() + "px"
                                    }}/>}
                                    <span id={index} style={{
                                        font: "arial", fontFamily: "sans-serif", cursor: 'pointer'
                                    }}>

                                        {sampaStream[getIndex(lineLengths, index, value)][0]}

                                    </span>
                            </Stack>
                                </HtmlTooltip>
                        </Grid>
                    })}
                </Grid>
            })}
        </span>
        </>)
}
