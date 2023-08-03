import React from "react";
import Layout from "./components/Layout";
import './App.css';
import all_poems_json from './data/new/omeka_s_export_20220915-forICARUS1.json';

function App() {

    if(localStorage.getItem("Enjambement") === null){
        localStorage.setItem("Enjambement", '{"Enjambement":[{"searchInput":"","searchFilter":"all"},{"first":true,"func":"node_begin","entity":"pos","operator":"contains_not","where":"rhyme_end","conditionSearchInput":"$"}]}')
    }

    return (
        <div className="App">
            <Layout all_poems_json={all_poems_json}/>
        </div>
    );
}

export default App;


/*
   // un-comment for checking audio file existence
   let audioString = './data/wavs/';

   const tryRequire = (path) => {
       try {
           return require(`${path}`);
       } catch (err) {
           console.log(path + " fehlt")
           return null;
       }
   };

   for (const poem of all_poems_json.poems) {
       let string = audioString+poem.audio
       tryRequire(string)

   }*/

