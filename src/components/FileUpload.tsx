import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Typography } from '@material-tailwind/react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload: React.FC<{
  files: File[];
  onFilesAdded: (newFiles: File[]) => void;
  onFileRemove: (index: number) => void;
}> = ({ files: _files, onFilesAdded, onFileRemove }) => {
  const [files, setFiles] = useState<File[]>(_files);
  useEffect(() => {
    setFiles(_files);
  }, [_files]);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  });

  return (
    <div className="w-3/5 space-y-4">
      <Typography
        variant="small"
        className="mb-2 font-medium text-blue-gray-900 dark:text-gray-100"
      >
        Arts Upload
      </Typography>
      {files.length === 0 && (
        <div
          {...getRootProps()}
          className={`flex h-[370px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/50'
              : 'border-blue-gray-200 hover:bg-gray-50 dark:border-blue-gray-700 dark:hover:bg-blue-gray-800'
          }`}
        >
          <input {...getInputProps()} />
          <ArrowUpTrayIcon className="h-6 w-6 text-blue-gray-500 dark:text-gray-400" />
          <Typography variant="small" className="mt-2 text-blue-gray-600 dark:text-gray-300">
            {isDragActive ? 'Drop files here' : 'Drag & drop files or click to select'}
          </Typography>
        </div>
      )}

      {files.length > 0 && (
        <div className="">
          {files.map((file, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-lg bg-blue-gray-50 p-2 dark:bg-blue-gray-800"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="h-full w-full rounded object-contain"
              />
              <button
                onClick={() => onFileRemove(index)}
                className="absolute right-1 top-1 rounded-full bg-white/80 p-1 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 dark:bg-black/80 dark:hover:bg-black"
              >
                <XMarkIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
              <Typography
                variant="small"
                className="absolute bottom-0 left-0 right-0 truncate bg-white/80 p-1 text-center text-xs dark:bg-black/80"
              >
                {file.name}
              </Typography>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default FileUpload;
