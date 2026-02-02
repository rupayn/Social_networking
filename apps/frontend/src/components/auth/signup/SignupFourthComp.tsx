
import React, { useEffect, useRef, useState } from 'react';
import type { SignupDataFields } from '../../../hooks/useSignupForm';
import UploadFile from '../../UploadFile';

type Props = {
  dataFields: SignupDataFields;
  prevStep: () => void;
  updateDataFields: (element: Partial<SignupDataFields>) => void;
};
function SignupFourthComp({ dataFields, prevStep, updateDataFields }: Props) {
  const [file, setFile]= useState<File []>([]);
  const [filePdf, setFilePdf]= useState<File []>([]);
  const [uploaded, setUploaded] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const dpRef=useRef<HTMLInputElement|null>(null)
  const cvRef = useRef<HTMLInputElement | null>(null);

  const enterFullscreen = () => {
    if (pdfContainerRef.current) {
      pdfContainerRef.current.requestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };


  useEffect(()=>{
    if(!file[0]) return
    const objectUrl = URL.createObjectURL(file[0]);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  },[file])
  useEffect(()=>{
    if(!filePdf[0]) return
    const objectUrl = URL.createObjectURL(filePdf[0]);
    setPdfPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  },[filePdf])
  console.log(file[0])

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);
  
  return (
    <div
      className="relative w-full max-w-md mx-auto px-6 py-8 flex flex-col gap-5
                 "
    >
      {/* PROFILE IMAGE */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center
                     text-5xl font-bold shadow-md overflow-hidden
                     bg-linear-to-br from-gray-300 to-gray-400
                     text-gray-800 
                     ring-4 ring-black/10 dark:ring-white/10"
          style={{
            backgroundImage: preview ? `url(${preview})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {!preview && dataFields.name[0].toUpperCase()}
        </div>

        <p className="font-semibold w-full text-left text-gray-800 dark:text-gray-200">
          Add Profile Picture
        </p>

        {/* Upload Image */}
        <div
          onClick={() => dpRef.current?.click()}
          className={`
            w-full border-2 border-dashed rounded-xl cursor-pointer
            flex flex-col items-center gap-1 transition
            overflow-hidden text-center wrap-break-word
  
            ${
              file.length > 0
                ? "py-2 border-emerald-500 bg-emerald-500/10"
                : "py-5 border-blue-500 bg-blue-500/10 hover:bg-blue-500/20"
            }
  
            ${
              file.length > 0
                ? "dark:border-emerald-400 dark:bg-emerald-400/10"
                : "dark:border-blue-400 dark:bg-blue-400/10 dark:hover:bg-blue-400/20"
            }
          `}
        >
          <UploadFile
            id="profile-image"
            className="bg-transparent text-sm text-gray-700 dark:text-gray-200"
            onFileSelect={(fileArr) => setFile(fileArr)}
            multiple={false}
            ref={dpRef}
            accept="image/png, image/jpeg"
          />

          {file.length === 0 && (
            <span className="text-xs text-gray-950 dark:text-gray-400">
              Click to select Image (PNG / JPG)
            </span>
          )}
        </div>
      </div>

      {/* CV UPLOAD */}
      <div className="flex flex-col gap-3">
        <label className="font-semibold text-gray-800 dark:text-gray-200">Add CV</label>

        {pdfPreview && (
          <div ref={pdfContainerRef} className="relative w-full">
            <iframe
              src={`${pdfPreview}#zoom=70`}
              title="PDF Preview"
              className={`w-full ${
                isFullscreen ? "h-screen" : preview ? "h-32" : "h-24"
              } border border-slate-400 dark:border-slate-700 rounded-xl shadow`}
            />
            <button
              type="button"
              onClick={isFullscreen ? exitFullscreen : enterFullscreen}
              className="absolute top-2 right-2 px-3 py-1 text-xs
                         bg-black/80 text-white rounded-md hover:bg-black transition"
            >
              {isFullscreen ? "Exit" : "Fullscreen"}
            </button>
          </div>
        )}

        {/* Upload CV */}
        <div
          onClick={() => cvRef.current?.click()}
          className={`
            w-full border-2 border-dashed rounded-xl cursor-pointer
            flex flex-col items-center gap-1 transition
            overflow-hidden text-center wrap-break-word
  
            ${
              filePdf.length > 0
                ? "py-2 border-purple-500 bg-purple-500/10"
                : "py-5 border-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20"
            }
  
            ${
              filePdf.length > 0
                ? "dark:border-purple-400 dark:bg-purple-400/10"
                : "dark:border-indigo-400 dark:bg-indigo-400/10 dark:hover:bg-indigo-400/20"
            }
          `}
        >
          <UploadFile
            id="cv"
            className="text-sm text-gray-700 dark:text-gray-200"
            onFileSelect={(fileArr) => setFilePdf(fileArr)}
            multiple={false}
            accept="application/pdf"
            ref={cvRef}
          />

          {filePdf.length === 0 && (
            <span className="text-xs text-gray-950 dark:text-gray-400">Click to select PDF</span>
          )}
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={prevStep}
          className="w-full bg-emerald-600 dark:bg-transparent rounded-full border  dark:border-white py-2 cursor-pointer dark:hover:bg-white/10 hover:bg-emerald-800 hover:font-bold "
        >
          ← Prev
        </button>

        <button
          className="w-full bg-linear-to-r from-blue-600 to-indigo-600
                     text-white py-2 rounded-xl hover:from-blue-700
                     hover:to-indigo-700 transition font-semibold shadow"
        >
          Upload
        </button>
      </div>
    </div>
  );
  
  
}

export default SignupFourthComp;