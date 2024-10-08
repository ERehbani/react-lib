import { useEffect, useRef, useState } from "react";

const MyDropzone = ({ cloudName, apiKey, presetName }) => {
  const [dataURL, setDataURL] = useState(null);
  const [uploadedURL, setUploadedURL] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const dropzoneRef = useRef(null);
  const fileInputRef = useRef(null);

  // useEffect(() => {
  const dropzone = dropzoneRef.current;

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  //   dropzone.addEventListener('dragenter', handleDragEnter);
  //   dropzone.addEventListener('dragleave', handleDragLeave);
  //   dropzone.addEventListener('dragover', handleDragOver);
  //   dropzone.addEventListener('drop', handleDrop);

  //   return () => {
  //     dropzone.removeEventListener('dragenter', handleDragEnter);
  //     dropzone.removeEventListener('dragleave', handleDragLeave);
  //     dropzone.removeEventListener('dragover', handleDragOver);
  //     dropzone.removeEventListener('drop', handleDrop);
  //   };
  // }, []);

  const handleFiles = (files) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      const binaryStr = reader.result;
      if (typeof binaryStr === "string") {
        setDataURL(binaryStr);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClick = (e) => {
    // Solo abre el selector de archivos si no hay una imagen seleccionada
    if (!dataURL) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const uploadImage = (e) => {
    e.stopPropagation(); // Previene la propagación del evento al contenedor
    const formData = new FormData();
    const file = dataURLtoFile(dataURL, "image.jpg");

    formData.append("file", file);
    formData.append("upload_preset", presetName);
    formData.append("api_key", apiKey);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    );

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

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div className="max-w-[300px] mx-auto mt-10">
      <div
        // ref={dropzoneRef}
        className="border border-dashed border-gray-500 rounded-md w-full flex justify-center items-center overflow-hidden"
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileInputChange}
          accept="image/*"
        />
        {dataURL ? (
          <div className="relative w-full">
            <img
              src={dataURL}
              alt="Selected"
              className="w-full block rounded-inherit"
            />
            <div className="absolute flex bottom-0 right-0 w-full p-2.5 bg-white/10 backdrop-blur-[1px] items-end gap-2.5 text-xs">
              {uploadedURL ? (
                <span className="bg-green-500 rounded border border-transparent font-medium cursor-pointer transition-colors duration-250 p-2.5">
                  Uploaded!
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={uploadImage}
                    className="bg-green-500 z-10 hover:bg-green-700 text-white font-bold p-2 rounded-full ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-3">
                      <title>check</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDataURL(null);
                  setUploadedURL(null);
                }}
                className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-3">
                  <title>cancel</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : isDragActive ? (
          <div className="w-[298px] h-[140px] flex justify-center items-center transition-colors duration-300 bg-[#343333] text-[#545353]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              height="50"
              width="50"
              fill="currentColor">
              <title>upload</title>
              <path d="M1 14.5C1 12.1716 2.22429 10.1291 4.06426 8.9812C4.56469 5.044 7.92686 2 12 2C16.0731 2 19.4353 5.044 19.9357 8.9812C21.7757 10.1291 23 12.1716 23 14.5C23 17.9216 20.3562 20.7257 17 20.9811L7 21C3.64378 20.7257 1 17.9216 1 14.5ZM16.8483 18.9868C19.1817 18.8093 21 16.8561 21 14.5C21 12.927 20.1884 11.4962 18.8771 10.6781L18.0714 10.1754L17.9517 9.23338C17.5735 6.25803 15.0288 4 12 4C8.97116 4 6.42647 6.25803 6.0483 9.23338L5.92856 10.1754L5.12288 10.6781C3.81156 11.4962 3 12.927 3 14.5C3 16.8561 4.81833 18.8093 7.1517 18.9868L7.325 19H16.675L16.8483 18.9868ZM13 13V17H11V13H8L12 8L16 13H13Z" />
            </svg>
          </div>
        ) : (
          <div className="w-full h-[140px] flex justify-center items-center text-center transition-colors duration-300">
            Suelta tus archivos aquí o haz clic para seleccionar
          </div>
        )}
      </div>
      {uploadedURL && (
        <div className="flex items-center justify-center my-2">
          <p className="text-md">Imagen subida exitosamente!</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="green"
            className="size-12 mx-2">
            <title>check</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default MyDropzone;
