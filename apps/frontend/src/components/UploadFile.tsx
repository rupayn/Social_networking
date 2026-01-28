import React from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
type UploadFileProps = {
  multiple?: boolean;
  className?: string;
  onFileSelect: (file: File[]) => void;
};
function UploadFile({ multiple = false, onFileSelect, className }: UploadFileProps) {
  /**
   * Handles the upload of a file.
   * This function is called whenever the user selects a new file to upload.
   */

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const handelUpload = (e: FileList | null) => {
    if (!e) {
      return;
    }
    if (e.length > 5) {
      alert("You can select a maximum of 5 files.");
      if (inputRef?.current) {
        inputRef.current.value = "";
      }
      return;
    }

    onFileSelect(Array.from(e));
  };
  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        className="hidden bg-pink-500"
        multiple={multiple}
        max={5}
        id="file"
        onChange={(e) => handelUpload(e.target.files)}
      />
      <label
        htmlFor="file"
        className={`flex items-center text-5xl justify-center cursor-pointer  bg-amber-50 ${className || ""} `}
      >
        <IoCloudUploadOutline />
      </label>
    </div>
  );
}

export default UploadFile;
