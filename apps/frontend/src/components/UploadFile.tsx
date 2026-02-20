import { forwardRef, useRef } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";

type UploadFileProps = {
  multiple?: boolean;
  className?: string;
  accept?: string;
  id: string;
  onFileSelect: (file: File[]) => void;
};

const UploadFile = forwardRef<HTMLInputElement, UploadFileProps>(
  ({ id, multiple = false, onFileSelect, className, accept }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleUpload = (files: FileList | null) => {
      if (!files) return;

      if (files.length > 5) {
        alert("You can select a maximum of 5 files.");
        if (inputRef.current) inputRef.current.value = "";
        return;
      }

      onFileSelect(Array.from(files));
    };

    return (
      <div className="w-full">
        <input
          type="file"
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          className="hidden"
          multiple={multiple}
          id={id}
          accept={accept}
          onChange={(e) => handleUpload(e.target.files)}
        />

        <label
          htmlFor={id}
          className={`
            flex flex-col items-center justify-center cursor-pointer
            text-3xl sm:text-4xl
            text-gray-600 dark:text-gray-300
            hover:scale-105 transition
            ${className || ""}
          `}
        >
          <IoCloudUploadOutline />
        </label>
      </div>
    );
  }
);

export default UploadFile;
