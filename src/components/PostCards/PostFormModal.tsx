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
import { typePostGenre } from '@src/@types/typePostItem';
import Api from '@src/Api';
import allGenreList from '@src/constants/genreList';
import useGlobalStore from '@src/stores/useGlobalStore';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import Toast from '@src/utils/toastUtils';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import FileUpload from '../FileUpload';

interface PostModalProps {
  open: boolean;
  onClose?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postCb?: (b: boolean, err?: any) => void;
}

interface FormData {
  postGenre: typePostGenre;
  title: string;
  content: string;
  files: File[];
}
const defaultFormData: FormData = {
  postGenre: 'All',
  title: '',
  content: '',
  files: [],
};

const PostModal: React.FC<PostModalProps> = ({ open, onClose, postCb }) => {
  const currentPostGenre = useGlobalStore((s) => s.currentPostGenre);
  const [formData, setFormData] = useState<FormData>({
    ...defaultFormData,
    postGenre: currentPostGenre,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setFormData((prev) => ({
      ...prev,
      content: e.target.value,
    }));
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    const submitData = new FormData();
    submitData.append('post_title', formData.title);
    submitData.append('post_content', formData.content);
    submitData.append('file', formData.files[0]);
    Api.xPotatoApi
      .uploadFile(submitData)
      .then((res) => {
        console.log(
          '%c [ fileUrl ]-125',
          'font-size:13px; background:pink; color:#bf2c9f;',
          res.data,
        );
        return Api.xPotatoApi.postCreate({
          postTitle: formData.title,
          postContent: formData.content,
          postImage: res.data,
          postGenre: formData.postGenre,
        });
      })
      // https://fzqqq-test.oss-us-east-1.aliyuncs.com/74188bc7dd2042c5b634e64eba80a56f.png
      // Api.xPotatoApi
      //   .postCreate({
      //     postGenre: formData.postGenre,
      //     postTitle: formData.title,
      //     postContent: formData.content,
      //     postImage:
      //       'https://fzqqq-test.oss-us-east-1.aliyuncs.com/74188bc7dd2042c5b634e64eba80a56f.png',
      //   })
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

  const onFilesAdded = (files: File[]) => {
    console.log(
      '%c [ onFilesAdded ]-218',
      'font-size:13px; background:pink; color:#bf2c9f;',
      files,
    );
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...files],
    }));
  };
  const onFileRemove = (rIndex: number) => {
    console.log(
      '%c [ onFileRemove ]-222',
      'font-size:13px; background:pink; color:#bf2c9f;',
      rIndex,
    );
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
      <form onSubmit={handleSubmit}>
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
                value={formData.title}
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
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Write your content here..."
                className="min-h-[200px] resize-y auto-cols-auto whitespace-pre-line !border-blue-gray-200 bg-white text-blue-gray-900 focus:!border-gray-900 dark:!border-blue-gray-700 dark:bg-blue-gray-800 dark:text-gray-100 dark:focus:!border-blue-400"
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
                containerProps={{
                  className: 'min-h-[100px] max-h-[800px]',
                }}
              />
            </div>
          </div>
          {/* {formData.files.length > 0 && (
            <div className="space-y-2">
              {formData.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded bg-blue-gray-50 p-2 dark:bg-blue-gray-800"
                >
                  <Typography
                    variant="small"
                    className="truncate text-blue-gray-900 dark:text-gray-100"
                  >
                    {file.name}
                  </Typography>
                  <IconButton
                    variant="text"
                    color="blue-gray"
                    onClick={() => removeFile(index)}
                    className="hover:bg-blue-gray-100 dark:hover:bg-blue-gray-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </IconButton>
                </div>
              ))}
            </div>
          )} */}
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
            type="submit"
            disabled={isSubmitting}
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
