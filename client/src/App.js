import React, { useEffect, useState } from "react";
import Axios from "./lib/Axios/Axios";
import Nav from "./components/Nav/Nav";
import { Button } from "@material-ui/core";
import LanguageList from "./components/LanguageList/LanguageList";
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

export default function App() {
  const [transcript, setTranscript] = useState("");
  const [translatedTranscript, setTranslatedTranscript] = useState("");
  const [fromLang, setFromLang] = useState("en");
  const [language, setLanguage] = useState("");

  const voiceCommands = () => {
    recognition.onstart = () => {
      console.log("Voice is activated");
    };

    recognition.lang = fromLang;

    recognition.onresult = (event) => {
      const current = event.resultIndex;

      const voiceTranscript = event.results[current][0].transcript;
      setTranscript(voiceTranscript);
      fetchTranslation(voiceTranscript, language);
    };
  };

  const fetchTranslation = async (text, language) => {
    let data = {
      text,
      language,
    };
    try {
      let success = await Axios.post("/api/translate", data);

      setTranslatedTranscript(success.data);
      readOutLoud(success.data, language);
    } catch (error) {
      console.log(error);
    }
  };

  const readOutLoud = (message, language) => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    speech.lang = language;

    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    voiceCommands();
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "100px",
      }}>
      <Nav />
      <br />
      <LanguageList language={fromLang} setLanguage={setFromLang} name="From" />
      <h3>{transcript}</h3>
      <br />
      <LanguageList language={language} setLanguage={setLanguage} name="To" />
      <h3>{translatedTranscript}</h3>
      <br />
      <Button
        type="submit"
        variant="outlined"
        color="primary"
        href="#outlined-buttons"
        onClick={() => recognition.start()}>
        Voice Activate
      </Button>
    </div>
  );
}
