import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Select,
  Textarea,
  Typography,
} from '@material-tailwind/react';
import { IPostItem, typePostGenre } from '@src/@types/typePostItem';
import Api from '@src/Api';
import allGenreList from '@src/constants/genreList';
import useGlobalStore from '@src/stores/useGlobalStore';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import Toast from '@src/utils/toastUtils';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import FileUpload from '../FileUpload';

type FilesType = (File | string)[];

type ImageDimensions = {
  width: number;
  height: number;
};
interface PostModalProps {
  index?: number;
  open: boolean;
  mode?: 'edit' | 'create';
  post?: IPostItem;
  onClose?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postCb?: (b: boolean, err?: any) => void;
}

interface FormData {
  id?: number;
  postGenre: typePostGenre;
  postTitle: string;
  postContent: string;
  files: FilesType;
  imageWidth: number;
  imageHeight: number;
}
interface FormDataValidateResult {
  isPostGenreOk: boolean;
  isTitleOk: boolean;
  isContentOk: boolean;
  isFilesOk: boolean;
}
const defaultFormData: FormData = {
  postGenre: 'All',
  postTitle: '',
  postContent: '',
  files: [],
  imageWidth: 0,
  imageHeight: 0,
};

const defaultFormDataValidateResult: FormDataValidateResult = {
  isPostGenreOk: true,
  isTitleOk: true,
  isContentOk: true,
  isFilesOk: true,
};

const PostModal: React.FC<PostModalProps> = ({ open, onClose, postCb, post, mode }) => {
  const currentPostGenre = useGlobalStore((s) => s.currentPostGenre);
  const [fileChanged, setFileChanged] = useState(false);
  const [validateRes, setValidateRes] = useState<FormDataValidateResult>(
    defaultFormDataValidateResult,
  );
  const editModeFormData = useCallback(() => {
    const temp = {
      postGenre: post?.postGenre || 'All',
      postTitle: post?.postTitle || '',
      postContent: post?.postContent || '',
      files: post?.postImage ? [post?.postImage] : [],
    };
    return mode === 'create'
      ? {
          postTitle: '',
          postContent: '',
          files: [],
          postGenre: currentPostGenre,
        }
      : {
          ...temp,
          id: post?.id,
        };
  }, [currentPostGenre, post, mode]);
  const [formData, setFormData] = useState<FormData>({
    ...defaultFormData,
    ...editModeFormData(),
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setFileChanged(false);
    setFormData({
      ...defaultFormData,
      ...editModeFormData(),
    });
  }, [open, editModeFormData]);

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setFormData((prev) => ({
      ...prev,
      postContent: e.target.value,
    }));
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData((prev) => ({
      ...prev,
      postTitle: e.target.value,
    }));
  };

  useEffect(() => {
    const { postGenre, postTitle, postContent, files } = formData;
    setValidateRes({
      isPostGenreOk: !!postGenre,
      isTitleOk: !!postTitle,
      isContentOk: !!postContent,
      isFilesOk: files && files.length > 0,
    });
  }, [formData]);

  const onFormDataCheckBeforeSubmit = useCallback((): boolean => {
    const errs: string[] = [];
    if (!validateRes.isTitleOk) {
      errs.push('Please enter a title.');
    }
    if (!validateRes.isPostGenreOk) {
      errs.push('Please select a genre.');
    }
    if (!validateRes.isContentOk) {
      errs.push('Please enter a content.');
    }
    if (!validateRes.isFilesOk) {
      errs.push('Please upload an image.');
    }
    errs.forEach((err) => {
      Toast.error(err);
    });
    return errs.length === 0;
  }, [validateRes]);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const valid = onFormDataCheckBeforeSubmit();
    if (!valid) {
      setIsSubmitting(false);
      return;
    }
    let promise = null;
    if (mode === 'create') {
      const submitData = new FormData();
      submitData.append('post_title', formData.postTitle);
      submitData.append('post_content', formData.postContent);
      submitData.append('file', formData.files[0] as unknown as File);
      promise = Api.xPotatoApi.uploadFile(submitData).then((res) => {
        return Api.xPotatoApi.postCreate({
          postTitle: formData.postTitle,
          postContent: formData.postContent,
          postImage: res.data,
          postGenre: formData.postGenre,
          imageWidth: formData.imageWidth,
          imageHeight: formData.imageHeight,
        });
      });
    } else {
      const submitData = new FormData();
      submitData.append('post_title', formData.postTitle);
      submitData.append('post_content', formData.postContent);
      if (fileChanged) submitData.append('file', formData.files[0] as unknown as File);
      const promiseFile = fileChanged
        ? Api.xPotatoApi.uploadFile(submitData)
        : Promise.resolve({ data: post?.postImage });
      promise = promiseFile.then((res) => {
        return Api.xPotatoApi.postUpdate({
          postTitle: formData.postTitle,
          id: post?.id,
          postContent: formData.postContent,
          postImage: res.data,
          postGenre: formData.postGenre,
          imageWidth: formData.imageWidth,
          imageHeight: formData.imageHeight,
        });
      });
    }
    // https://fzqqq-test.oss-us-east-1.aliyuncs.com/74188bc7dd2042c5b634e64eba80a56f.png
    // Api.xPotatoApi
    //   .postCreate({
    //     postGenre: formData.postGenre,
    //     postTitle: formData.postTitle,
    //     postContent: formData.postContent,
    //     postImage:
    //       'https://fzqqq-test.oss-us-east-1.aliyuncs.com/74188bc7dd2042c5b634e64eba80a56f.png',
    //   })
    promise
      .then((createRes) => {
        if (createRes.code === HTTP_RES_CODE.SUCCESS) {
          Toast.success('Post Successfully!');
          handleClose();
        }
        postCb?.(createRes.code === HTTP_RES_CODE.SUCCESS);
      })
      .catch((err) => postCb?.(false, err))
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const getImageDimensions = (file: File): Promise<ImageDimensions> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.onerror = reject;
        img.src = (event.target?.result as string) || '';
      };
      reader.readAsDataURL(file);
    });
  };

  const onFilesAdded = (files: File[]) => {
    setFileChanged(true);

    getImageDimensions(files[0])
      .then((dimensions) => {
        console.log(`Image width: ${dimensions.width}`);
        console.log(`Image height: ${dimensions.height}`);
        setFormData((prev) => ({
          ...prev,
          imageHeight: dimensions.height,
          imageWidth: dimensions.width,
        }));
      })
      .catch((error) => {
        console.error('Error reading image dimensions:', error);
      });
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...files],
    }));
  };
  const onFileRemove = (rIndex: number) => {
    setFileChanged(true);
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== rIndex),
    }));
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    onClose?.();
  };

  const handleGenre = (genre: typePostGenre) => {
    setFormData((prev) => ({
      ...prev,
      postGenre: genre,
    }));
  };

  return (
    <Dialog
      open={open}
      handler={handleClose}
      size="lg"
      className="bg-gray-100 dark:bg-blue-gray-900"
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          return;
        }}
      >
        <DialogHeader>
          <Typography variant="h5" className="text-blue-gray-900 dark:text-gray-100">
            Create New Post
          </Typography>
        </DialogHeader>

        <DialogBody className="flex max-h-[70vh] gap-4 overflow-y-scroll">
          <FileUpload
            files={formData.files}
            onFileRemove={onFileRemove}
            onFilesAdded={onFilesAdded}
          />
          <div className="flex w-2/5 flex-col gap-4 p-2">
            <div className=" ">
              <Typography
                variant="small"
                className="mb-2 font-medium text-blue-gray-900 dark:text-gray-100"
              >
                Title
              </Typography>
              <Input
                value={formData.postTitle}
                error={!validateRes.isTitleOk}
                crossOrigin={'anonymous'}
                onChange={handleTitleChange}
                placeholder="Enter title"
                className="!border-blue-gray-200 bg-white text-blue-gray-900 focus:!border-gray-900 dark:!border-blue-gray-700 dark:bg-blue-gray-800 dark:text-gray-100 dark:focus:!border-blue-400"
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
              />
            </div>
            <div>
              <Typography
                variant="small"
                className="mb-2 font-medium text-blue-gray-900 dark:text-gray-100"
              >
                Genre
              </Typography>
              <div className="w-72">
                <Select
                  label="Select Genre"
                  size="md"
                  error={!validateRes.isPostGenreOk}
                  value={formData.postGenre}
                  onChange={(val) => handleGenre(val as typePostGenre)}
                >
                  {allGenreList.map(({ emoji, name, desc }) => {
                    return (
                      <Option
                        key={name}
                        value={name}
                        title={`${name}:${desc}`}
                      >{`${emoji} ${name}`}</Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div>
              <Typography
                variant="small"
                className="mb-2 font-medium text-blue-gray-900 dark:text-gray-100"
              >
                Content
              </Typography>
              <Textarea
                value={formData.postContent}
                onChange={handleContentChange}
                placeholder="Write your content here..."
                className={`min-h-[200px] resize-y auto-cols-auto whitespace-pre-line !border-blue-gray-200 bg-white text-blue-gray-900 focus:!border-gray-900 dark:!border-blue-gray-700 dark:bg-blue-gray-800 dark:text-gray-100 dark:focus:!border-blue-400`}
                containerProps={{
                  className: 'min-h-[100px] max-h-[800px]',
                }}
              />
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="space-x-2">
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isSubmitting}
            type="button"
            className="border-blue-gray-200 text-blue-gray-900 dark:border-blue-gray-700 dark:text-gray-100"
          >
            Cancel
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={(e) => {
              handleSubmit(e);
            }}
            className="bg-blue-500 text-white dark:bg-blue-600"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default PostModal;
