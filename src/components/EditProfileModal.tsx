import { type_req_update_profile, type_res_user_profile } from '@src/@types/typeRequest';
import React, { useEffect, useState } from 'react';

import Api from '@src/Api';
import FileUpload from './FileUpload';

interface EditProfileModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  profile: type_res_user_profile;
  onUpdateProfile: (updatedProfile: type_req_update_profile) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  setIsOpen,
  profile,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = useState<Omit<type_req_update_profile, 'id'>>({
    userAvatar: profile.userAvatar || '',
    email: '',
    phone: '',
    gender: '',
    description: '',
  });

  // 专门存储文件的状态
  const [fileState, setFileState] = useState<{ files: File[] }>({ files: [] });
  // 上传状态
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        userAvatar: profile.userAvatar,
        email: profile.email,
        phone: profile.phone,
        gender: profile.gender,
        description: profile.description,
      });
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      let avatarUrl = formData.userAvatar;

      // 如果有新上传的文件，先处理文件上传
      if (fileState.files.length > 0) {
        const submitData = new FormData();
        submitData.append('user_account', profile.userAccount);
        submitData.append('file', fileState.files[0]);

        const response = await Api.xPotatoApi.uploadFile(submitData);
        avatarUrl = response.data;
      }

      // 更新 profile，包含新的头像 URL
      const updatedProfile: type_req_update_profile = {
        ...formData,
        id: profile.id,
        userAvatar: avatarUrl,
      };

      // 调用父组件的更新方法
      await onUpdateProfile(updatedProfile);

      // 成功后关闭模态框
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      // 这里可以添加错误提示
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFilesAdded = (files: File[]) => {
    setFileState({ files });
  };

  const onFileRemove = (rIndex: number) => {
    setFileState((prev) => ({
      files: prev.files.filter((_, index) => index !== rIndex),
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50"
      id="my-modal"
    >
      <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
        <div className="mt-3 text-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Profile</h3>
          <form onSubmit={handleSubmit} className="mt-2 text-left">
            <FileUpload
              files={fileState.files}
              onFileRemove={onFileRemove}
              onFilesAdded={onFilesAdded}
              height="h-32"
              width="w-32"
              className="w-auto"
              title="Avatar"
              dragText="Upload"
              containerClassName="flex flex-col items-center"
            />

            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="phone">
                Phone
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="gender">
                Gender
              </label>
              <select
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="description">
                Description
              </label>
              <textarea
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                className="focus:shadow-outline rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700 focus:outline-none"
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
