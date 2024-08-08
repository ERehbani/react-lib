import "./App.css";
import WebcamCapture from "./components/webcam";

const App = () => {
  return (
    <div>
      <WebcamCapture
        mainButtonColor="#7e00bf"
        mainTextColor="white"
        apiKey="23232323"
        cloudName="cloud"
        presetName="preset"
      />
    </div>
  );
}

export default App;
