import "./App.css";
import WebcamCapture from "./components/webcam";

const App = () => {
  return (
    <div>
      <WebcamCapture
        mainButtonColor="#7e00bf"
        mainTextColor="white"
        apiKey="264592341453854"
        cloudName="dmnb6cfzj"
        presetName="Preset_Ozono"
      />
    </div>
  );
}

export default App;
