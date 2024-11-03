import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Typography } from '@material-tailwind/react';
import Utils from '@src/utils/utils';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
type FilesType = (File | string)[];
interface FileUploadProps {
  files: FilesType;
  onFilesAdded: (newFiles: File[]) => void;
  onFileRemove: (index: number) => void;
  // 新增的样式属性
  className?: string;
  containerClassName?: string;
  dropzoneClassName?: string;
  previewClassName?: string;
  // 自定义高度
  height?: string;
  // 自定义宽度
  width?: string;
  // 标题文本
  title?: string;
  // 拖拽提示文本
  dragText?: string;
  dropText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  files: _files,
  onFilesAdded,
  onFileRemove,
  className = 'w-3/5',
  containerClassName = '',
  dropzoneClassName = '',
  previewClassName = '',
  height = 'h-[370px]',
  width = 'w-full',
  title = 'Arts Upload',
  dragText = 'Drag & drop files or click to select',
  dropText = 'Drop files here',
}) => {
  const [files, setFiles] = useState<FilesType>(_files);

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

  const baseDropzoneClasses = `flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors`;
  const activeDropzoneClasses = isDragActive
    ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/50'
    : 'border-blue-gray-200 hover:bg-gray-50 dark:border-blue-gray-700 dark:hover:bg-blue-gray-800';

  return (
    <div className={`space-y-4 ${className} ${containerClassName}`}>
      {title && (
        <Typography
          variant="small"
          className="mb-2 font-medium text-blue-gray-900 dark:text-gray-100"
        >
          {title}
        </Typography>
      )}

      {files.length === 0 && (
        <div
          {...getRootProps()}
          className={`${baseDropzoneClasses} ${activeDropzoneClasses} ${height} ${width} ${dropzoneClassName}`}
        >
          <input {...getInputProps()} />
          <ArrowUpTrayIcon className="h-6 w-6 text-blue-gray-500 dark:text-gray-400" />
          <Typography variant="small" className="mt-2 text-blue-gray-600 dark:text-gray-300">
            {isDragActive ? dropText : dragText}
          </Typography>
        </div>
      )}

      {files.length > 0 && (
        <div className={previewClassName}>
          {files.map((file, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-lg bg-blue-gray-50 p-2 dark:bg-blue-gray-800"
            >
              <img
                src={
                  Utils.isObjType(file, 'String')
                    ? (file as unknown as string)
                    : URL.createObjectURL(file as unknown as File)
                }
                alt={
                  Utils.isObjType(file, 'String')
                    ? (file as unknown as string)
                    : (file as unknown as File).name
                }
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
                {Utils.isObjType(file, 'String')
                  ? (file as unknown as string)
                  : (file as unknown as File).name}
              </Typography>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
