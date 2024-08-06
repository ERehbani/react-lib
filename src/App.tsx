import "./App.css";
import WebcamCapture from "./components/webcam";

const App = () => {
  return (
    <div>
      <WebcamCapture
        mainButtonText=""
        mainButtonColor="#7e00bf"
        takePictureText="Capture"
        uploadImageText="Upload"
        dialogBackgroundColor="white"
        successMessage="Image uploaded successfully!"
        mainTextColor="white"
        apiKey="23232323"
        cloudName="cloud"
        presetName="preset"
        customIcons={{
        }}
      />
    </div>
  );
}

export default App;
