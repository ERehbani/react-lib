import type React from "react";
import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Progress } from "../ui/progress";
import MyDropzone from "./dropzone";

interface WebcamCaptureProps {
  mainButtonText?: string;
  mainTextColor?: string;
  mainButtonColor?: string;
  takePictureText?: string;
  uploadImageText?: string;
  dialogBackgroundColor?: string;
  successMessage?: string;
  cameraButtonColor?: string;
  cameraTextColor?: string;
  uploadButtonColor?: string;
  uploadTextColor?: string;
  cloudName: string;
  apiKey: string;
  presetName: string;
  customIcons?: {
    edit?: React.ReactNode;
    camera?: React.ReactNode;
    check?: React.ReactNode;
    cancel?: React.ReactNode;
    changeCamera?: React.ReactNode;
  };
}

const defaultVideoConstraints = {
  width: 1280,
  height: 720,
};

const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  mainButtonText = "",
  mainTextColor = "black",
  mainButtonColor = "#292d3e",
  takePictureText = "Camera",
  uploadImageText = "Upload",
  dialogBackgroundColor = "white",
  cameraButtonColor = "black",
  cameraTextColor = "white",
  uploadButtonColor = "black",
  uploadTextColor = "white",
  successMessage = "",
  customIcons = {},
  cloudName,
  apiKey,
  presetName,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedURL, setUploadedURL] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const uploadImage = async (imageData: string) => {
    const formData = new FormData();

    // Convert base64 to blob
    const blob = await fetch(imageData).then((r) => r.blob());
    formData.append("file", blob, "webcam_capture.jpg");
    formData.append("upload_preset", presetName);
    formData.append("api_key", apiKey);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setUploadedURL(response.url);
      } else {
        console.error("Upload failed");
      }
    };

    xhr.onerror = () => {
      console.error("Upload failed");
    };

    xhr.send(formData);
  };

  const DefaultIcon = ({ path, title }: { path: string; title: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6">
      <title>{title}</title>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );

  const icons = {
    edit: customIcons.edit || (
      <DefaultIcon
        path="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
        title="edit"
      />
    ),
    camera: customIcons.camera || (
      <DefaultIcon
        path="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
        title="camera"
      />
    ),
    check: customIcons.check || (
      <DefaultIcon path="m4.5 12.75 6 6 9-13.5" title="check" />
    ),
    cancel: customIcons.cancel || (
      <DefaultIcon path="M6 18 18 6M6 6l12 12" title="cancel" />
    ),
    changeCamera: customIcons.changeCamera || (
      <DefaultIcon
        path="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
        title="change camera"
      />
    ),
  };

  const applyColorStyle = (color: string) => {
    if (color.startsWith("#")) {
      return { backgroundColor: color };
    }
    // Check if it's a valid CSS color name
    const isValidColor = CSS.supports("color", color);
    if (isValidColor) {
      return { backgroundColor: color };
    }
    // Fallback to Tailwind classes if it's not a valid CSS color
    return { backgroundColor: `bg-${color}-600` };
  };

  return (
    <div className="">
      <Dialog>
        <DialogTrigger
          className="flex gap-1 py-2 px-4 rounded-xl"
          style={{
            ...applyColorStyle(mainButtonColor),
            color: mainTextColor,
          }}>
          {mainButtonText}
          {icons.edit}
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          className={"border-none"}
          style={applyColorStyle(dialogBackgroundColor)}>
          <DialogHeader className="h-fit w-full">
            <DialogTitle className="mb-2">Seleccione una opción</DialogTitle>
            <DialogDescription className="flex items-center justify-center gap-4">
              <Dialog>
                <DialogTrigger
                  className="py-2 px-4 mt-4 rounded-full flex"
                  style={{
                    backgroundColor: cameraButtonColor,
                    color: cameraTextColor,
                  }}
                  onClick={() => setShowCamera(true)}>
                  {takePictureText}
                </DialogTrigger>
                <DialogContent
                  aria-describedby={undefined}
                  className={"border-none"}
                  style={applyColorStyle(dialogBackgroundColor)}>
                  <DialogTitle>Capturando cámara...</DialogTitle>
                  <DialogHeader>
                    {showCamera && (
                      <div className="p-2">
                        {imageSrc ? (
                          <div>
                            <img src={imageSrc} alt="captured" />
                            <div className="flex my-2 gap-4">
                              <Button
                                className="h-fit bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded-full"
                                onClick={() => {
                                  setImageSrc(null);
                                  setUploadedURL(null);
                                }}>
                                {icons.cancel}
                              </Button>
                              <Button
                                className="h-fit bg-green-500 hover:bg-green-700 text-white font-bold p-2 rounded-full"
                                onClick={() => uploadImage(imageSrc)}>
                                {icons.check}
                              </Button>
                            </div>
                            {uploadProgress > 0 && uploadProgress < 100 && (
                              <div className="w-full flex items-center gap-2 mt-4">
                                <Progress
                                  value={uploadProgress}
                                  className="w-[60%]"
                                />
                                <span>{uploadProgress.toFixed(0)}%</span>
                              </div>
                            )}
                            {uploadedURL && (
                              <div className="flex items-center justify-center my-2">
                                <p className="text-md">{successMessage}</p>
                                {icons.check}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <Webcam
                              className="max-h-[250px]"
                              ref={webcamRef}
                              audio={false}
                              height={360}
                              screenshotFormat="image/jpeg"
                              width={720}
                              videoConstraints={{
                                ...defaultVideoConstraints,
                                facingMode,
                              }}
                            />
                            <div className="flex my-4 gap-4">
                              <Button
                                onClick={() => {
                                  const imageSrc =
                                    webcamRef.current?.getScreenshot();
                                  setImageSrc(imageSrc || null);
                                }}
                                className="bg-slate-400 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-full flex">
                                {icons.camera}
                              </Button>
                              <Button
                                className="bg-slate-400 hover:bg-slate-600 text-white font-bold py-2 px-2 rounded-full"
                                onClick={() => {
                                  setFacingMode(
                                    facingMode === "user"
                                      ? "environment"
                                      : "user"
                                  );
                                }}>
                                {icons.changeCamera}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger
                  className="py-2 px-4 mt-4 rounded-full flex"
                  style={{
                    backgroundColor: uploadButtonColor,
                    color: uploadTextColor,
                  }}
                  onClick={() => setShowFileUpload(true)}>
                  {uploadImageText}
                </DialogTrigger>
                <DialogContent
                  aria-describedby={undefined}
                  className="min-h-[400px] flex flex-col justify-center items-center"
                  style={applyColorStyle(dialogBackgroundColor)}>
                  <DialogTitle>Ingrese una imagen</DialogTitle>
                  {showFileUpload && (
                    <div className="">
                      <MyDropzone apiKey={apiKey} cloudName={cloudName} presetName={presetName} />
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebcamCapture;
