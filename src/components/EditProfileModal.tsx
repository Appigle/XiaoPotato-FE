import React, { useState, useEffect } from 'react';
import { type_res_user_profile, type_req_update_profile } from '@/@types/request/XPotato';

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
  const [formData, setFormData] = useState<type_req_update_profile>({
    firstName: '',
    lastName: '',
    userAvatar: null,
    email: '',
    phone: '',
    gender: '',
    bio: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        userAvatar: profile.userAvatar,
        email: profile.email,
        phone: profile.phone,
        gender: profile.gender,
        bio: profile.bio,
      });
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
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
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="firstName">
                First Name
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="lastName">
                Last Name
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
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
            //update bio
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="bio">
                Bio
              </label>
              <textarea
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                type="submit"
              >
                Save Changes
              </button>
              <button
                className="focus:shadow-outline rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700 focus:outline-none"
                type="button"
                onClick={() => setIsOpen(false)}
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
