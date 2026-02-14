import { useEffect, useRef, useState } from "react";
import type { SignupDataFields } from "../../../hooks/useSignupForm";
import UploadFile from "../../UploadFile";

import type { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

import { FaTrashAlt } from "react-icons/fa";

type Props = {
  dataFields: SignupDataFields;
  prevStep: () => void;
  nextStep: () => void;
  updateDataFields: (element: Partial<SignupDataFields>) => void;
};
function SignupThirdComp({ dataFields, prevStep, updateDataFields, nextStep }: Props) {
  const [fileImg, setFileImg] = useState<File[]>([]);
  const [filePdf, setFilePdf] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    dataFields.avatar ? URL.createObjectURL(dataFields.avatar) : null
  );
  const [pdfPreview, setPdfPreview] = useState<string | null>(dataFields.resume ? URL.createObjectURL(dataFields.resume) : null);
  const pdfContainerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const dpRef = useRef<HTMLInputElement | null>(null);
  const cvRef = useRef<HTMLInputElement | null>(null);

  const removeImage = () => {
    setFileImg([]);
    setPreview(null);
    
    updateDataFields({ avatar: null });
    if(!dataFields.resume){
      setUploaded(false);
    }
  };

  const removePdf = () => {
    setFilePdf([]);
    setPdfPreview(null);
    updateDataFields({ resume: null });
  if(!dataFields.avatar){
    setUploaded(false);
  }
  };

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

  const theme = useSelector((state: RootState) => state?.theme.value);
  const handelUpload = async function () {
    nextStep();
    
  };
  useEffect(()=>{
    if(dataFields.avatar||dataFields.resume){
      setUploaded(true);
    }
  },[])
  useEffect(() => {
    if (!fileImg[0]) return;
    updateDataFields({ avatar: fileImg[0] });
    const objectUrl = URL.createObjectURL(fileImg[0]);
    setPreview(objectUrl);
    setUploaded(true);
    return () => URL.revokeObjectURL(objectUrl);
  }, [fileImg]);
  useEffect(() => {
    if (!filePdf[0]) return;
    const objectUrl = URL.createObjectURL(filePdf[0]);
    updateDataFields({ resume: filePdf[0] });
    setPdfPreview(objectUrl);
    setUploaded(true);
    return () => URL.revokeObjectURL(objectUrl);
  }, [filePdf]);

  useEffect(() => {
    if(dataFields.avatar){}
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
          className="relative group w-32 h-32 rounded-full flex items-center justify-center
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

          {/* Delete Button */}
          {preview && (
            <button
              type="button"
              onClick={removeImage}
              className="absolute inset-0 flex items-center justify-center
               p-3 rounded-full
               bg-black/70 text-white
               opacity-0 group-hover:opacity-100
               transition hover:bg-red-600 hover:opacity-50"
            >
              <FaTrashAlt size={20} />
            </button>
          )}
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
              preview !== null
                ? "py-2 border-emerald-500 bg-emerald-500/10"
                : "py-5 border-blue-500 bg-blue-500/10 hover:bg-blue-500/20"
            }
  
            ${
              preview !== null
                ? "dark:border-emerald-400 dark:bg-emerald-400/10"
                : "dark:border-blue-400 dark:bg-blue-400/10 dark:hover:bg-blue-400/20"
            }
          `}
        >
          <UploadFile
            id="profile-image"
            className="bg-transparent text-sm text-gray-700 dark:text-gray-200"
            onFileSelect={(fileArr) => setFileImg(fileArr)}
            multiple={false}
            ref={dpRef}
            accept="image/png, image/jpeg"
          />

          {preview === null  && (
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
            {/* Remove Button */}
            <button
              type="button"
              onClick={removePdf}
              className={`absolute top-2 left-2 p-1 rounded-full
               bg-black/70 text-white
               hover:bg-red-600 transition z-10 ${isFullscreen ? "hidden" : ""}`}
            >
              <FaTrashAlt size={20} />
            </button>

            <iframe
              src={pdfPreview?`${pdfPreview}#zoom=70`:undefined}
              title="PDF Preview"
              className={`w-full ${
                isFullscreen ? "h-screen" : preview ? "h-24" : "h-24"
              } border border-slate-400 dark:border-slate-700 rounded-xl shadow`}
            />

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={isFullscreen ? exitFullscreen : enterFullscreen}
              className="absolute top-2 right-2 px-3 py-1 text-xs
               bg-black/80 text-white rounded-md
               hover:bg-black transition z-10"
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
              pdfPreview !==null
                ? "py-2 border-purple-500 bg-purple-500/10"
                : "py-5 border-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20"
            }
  
            ${
              pdfPreview !==null
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

          {pdfPreview===null && (
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
          onClick={handelUpload}
          className="w-full bg-linear-to-r from-blue-600 to-indigo-600
                     text-white py-2 rounded-xl hover:from-blue-700
                     hover:to-indigo-700 transition font-semibold shadow"
        >
          {uploaded ? "Next ->" : "skip For Now"}
        </button>
      </div>
    </div>
  );
}

export default SignupThirdComp;