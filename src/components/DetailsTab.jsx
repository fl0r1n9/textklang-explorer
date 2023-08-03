import * as React from "react";

export default function DetailsTab(props) {

    const {readingsArray, poemToCompare, selectedPoem, language} = props;

    return (

        <div style={{fontSize: "14px", color: "black"}}>
            <p style={{color: "#1976d2"}}>{poemToCompare && (selectedPoem !== poemToCompare) ? (language === "enUS" ? "Comparing to " : "Vergleiche mit ") + (parseInt(readingsArray.indexOf(poemToCompare)) + 1) + ": " + poemToCompare.reader.split(", ")[1] + " " + poemToCompare.reader.split(", ")[0] + " (" + poemToCompare.year + ")" : ""}</p>
            <div>

                {selectedPoem.alternative &&
                    <div style={{marginBottom: "10px"}}>
                        <span
                            style={{fontWeight: "bold"}}>{language === "enUS" ? "Alternative title" : "Alternativtitel"}: </span>
                        <span>{selectedPoem.alternative}</span>
                    </div>
                }

                {selectedPoem.partOf &&
                    <div style={{marginBottom: "10px"}}>
                        <span style={{fontWeight: "bold"}}>{language === "enUS" ? "Part of" : "Kollektion"}: </span>
                        <span>{selectedPoem.partOf}</span>
                    </div>
                }

                <div style={{marginBottom: "10px"}}>
                    <span style={{fontWeight: "bold"}}>{language === "enUS" ? "Reader" : "SprecherIn"}: </span>
                    <span>{selectedPoem.reader}</span>
                    {poemToCompare && (selectedPoem !== poemToCompare) &&
                        <span style={{color: "#1976d2"}}> ↔ {poemToCompare.reader} </span>
                    }
                </div>

                <div style={{marginBottom: "10px"}}>
                    <span style={{fontWeight: "bold"}}>{language === "enUS" ? "Gender" : "Geschlecht"}: </span>
                    <span>{selectedPoem.gender}</span>
                    {poemToCompare && (selectedPoem !== poemToCompare) &&
                        <span style={{color: "#1976d2"}}> ↔ {poemToCompare.gender} </span>
                    }
                </div>

                <div style={{marginBottom: "10px"}}>
                    <span
                        style={{fontWeight: "bold"}}>{language === "enUS" ? "Reader's profile" : "Sprecherprofil"}: </span>
                    <span>{selectedPoem.member}</span>
                    {poemToCompare && (selectedPoem !== poemToCompare) &&
                        <span style={{color: "#1976d2"}}> ↔ {poemToCompare.member} </span>
                    }
                </div>

                <div style={{marginBottom: "10px"}}>
                    <span style={{fontWeight: "bold"}}>{language === "enUS" ? "Year recorded" : "Aufnahmejahr"}: </span>
                    <span>{selectedPoem.year}</span>
                    {poemToCompare && (selectedPoem !== poemToCompare) &&
                        <span style={{color: "#1976d2"}}> ↔ {poemToCompare.year} </span>
                    }
                </div>

                {selectedPoem.changed &&
                    <div style={{marginBottom: "10px"}}>
                        <span
                            style={{fontWeight: "bold"}}>{language === "enUS" ? "Text changed" : "Text geändert"}: </span>
                        <span>{selectedPoem.changed}</span>
                        {poemToCompare && (selectedPoem !== poemToCompare) &&
                            <span style={{color: "#1976d2"}}> ↔ {poemToCompare.changed} </span>
                        }
                    </div>
                }

                {selectedPoem.issued &&
                    <div style={{marginBottom: "10px"}}>
                        <span
                            style={{fontWeight: "bold"}}>{language === "enUS" ? "Year created" : "Verfassungsjahr"}: </span>
                        <span>{selectedPoem.issued}</span>
                    </div>
                }

                {selectedPoem.rights &&
                    <div style={{marginBottom: "10px"}}>
                        <span style={{fontWeight: "bold"}}>{language === "enUS" ? "Rights" : "Rechte"}: </span>
                        <span>{selectedPoem.rights}</span>
                    </div>
                }

                {selectedPoem.description &&
                    <div style={{marginBottom: "10px"}}>
                        <span
                            style={{fontWeight: "bold"}}>{language === "enUS" ? "Description" : "Beschreibung"}: </span>
                        <span>{selectedPoem.description}</span>
                    </div>
                }

            </div>
        </div>

    )

}

{/*
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{color: black}}>
                <Grid item xs={6}>Titel: </Grid> <Grid item xs={6}>{selectedPoem.title}</Grid>
                {selectedPoem.alternative ?<> <Grid item xs={6}>Alternativtitel:</Grid> <Grid item xs={6}>{selectedPoem.alternative}</Grid> </> : ""}
                {selectedPoem.partOf ? <><Grid item xs={6}>Kollektion:</Grid><Grid item xs={6}>{selectedPoem.partOf}</Grid></> : ""}
                <Grid item xs={6}>VerfasserIn: </Grid> <Grid item xs={6}>{selectedPoem.author}</Grid>
                <Grid item xs={6}>SprecherIn:</Grid> <Grid item xs={6}>{selectedPoem.reader}</Grid>
                <Grid item xs={6}>Geschlecht:</Grid> <Grid item xs={6}>{selectedPoem.gender}</Grid>
                <Grid item xs={6}>Aufnahmejahr:</Grid> <Grid item xs={6}>{selectedPoem.member}</Grid>
                {selectedPoem.issued ?<> <Grid item xs={6}>Verfassungsjahr:</Grid> <Grid item xs={6}>{selectedPoem.issued}</Grid> </> : ""}
                <Grid item xs={6}>Rechte:</Grid><Grid item xs={6}>{selectedPoem.rights}</Grid>
                {selectedPoem.description && !poemToCompare ?<> <Grid item xs={6}>Beschreibung:</Grid> <Grid item xs={6}>{selectedPoem.description}</Grid> </> : ""}
                {selectedPoem.changed}
            </Grid>
    */
}