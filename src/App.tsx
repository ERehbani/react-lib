import "./App.css";
import WebcamCapture from "./components/webcam";

const App = () => {
  return (
    <div>
      <WebcamCapture
        mainButtonColor="#2ea5e1"
        apiKey="23232323"
        cloudName="cloud"
        presetName="preset"
      />
    </div>
  );
}

export default App;
