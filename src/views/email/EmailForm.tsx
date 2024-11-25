import { Button, Card, CardBody, CardFooter, Input, Textarea } from '@material-tailwind/react';
import { IUserItem } from '@src/@types/typeUserItem';
import useGlobalStore from '@src/stores/useGlobalStore';
import EmailUtils from '@src/utils/emailUtils';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import Toast from '@src/utils/toastUtils';
import React, { useEffect, useState } from 'react';

interface FormState {
  email: string;
  subject: string;
  content: string;
}

interface FormErrors {
  email?: string;
  subject?: string;
  content?: string;
}

// Extract validation logic into separate functions
const validateEmail = (email: string): string => {
  if (!email) {
    return 'Email is required';
  } else if (!isValidEmail(email)) {
    return 'Email is not valid';
  }
  return '';
};

const validateSubject = (subject: string): string => {
  if (!subject) {
    return 'Subject is required';
  } else if (subject.length > 100) {
    return 'Subject must be less than 100 characters';
  }
  return '';
};

const validateContent = (content: string): string => {
  if (!content) {
    return 'Content is required';
  }
  return '';
};

const isValidEmail = (email: string): boolean => {
  // Simple email validation regex
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

const EmailForm: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    subject: '',
    content: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const userInfo = useGlobalStore((s) => s.userInfo);
  const setHeaderConfig = useGlobalStore((s) => s.setHeaderConfig);
  useEffect(() => {
    setHeaderConfig({
      hasSearch: false,
    });
    return () => {
      setHeaderConfig({
        hasSearch: true,
      });
    };
  }, [setHeaderConfig]);
  const handleSubmit = () => {
    const emailError = validateEmail(formState.email);
    const subjectError = validateSubject(formState.subject);
    const contentError = validateContent(formState.content);

    setErrors({
      email: emailError,
      subject: subjectError,
      content: contentError,
    });
    if (!userInfo) {
      Toast.error('Not login!');
      return;
    }
    if (!emailError && !subjectError && !contentError) {
      EmailUtils.send({ ...formState, userInfo: userInfo as IUserItem }).then((res) => {
        console.log('%c [ res ]-87', 'font-size:13px; background:pink; color:#bf2c9f;', res);
        if (res.code === HTTP_RES_CODE.SUCCESS) {
          resetForm();
        }
      });
    }
  };
  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setFormState({
      email: '',
      subject: '',
      content: '',
    });
    setErrors({
      email: '',
      subject: '',
      content: '',
    });
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({ ...prevState, email: event.target.value }));
    setErrors((prevErrors) => ({ ...prevErrors, email: validateEmail(event.target.value) }));
  };

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({ ...prevState, subject: event.target.value }));
    setErrors((prevErrors) => ({ ...prevErrors, subject: validateSubject(event.target.value) }));
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState((prevState) => ({ ...prevState, content: event.target.value }));
    setErrors((prevErrors) => ({ ...prevErrors, content: validateContent(event.target.value) }));
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card
        className={`w-full max-w-md bg-gray-100 text-blue-gray-900 dark:bg-blue-gray-900 dark:text-gray-100`}
      >
        <CardBody>
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block">
              To:
            </label>
            <Input
              id="email"
              type="email"
              crossOrigin=""
              placeholder="Enter email address"
              value={formState.email}
              onChange={handleEmailChange}
              error={!!errors.email}
            />
            {errors.email && <div className="mt-2 text-red-500">{errors.email}</div>}
          </div>
          <div className="mb-4">
            <label htmlFor="subject" className="mb-2 block">
              Subject
            </label>
            <Input
              id="subject"
              crossOrigin=""
              type="text"
              placeholder="Enter email subject"
              value={formState.subject}
              onChange={handleSubjectChange}
              error={!!errors.subject}
            />
            {errors.subject && <div className="mt-2 text-red-500">{errors.subject}</div>}
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="mb-2 block">
              Content
            </label>
            <Textarea
              id="content"
              placeholder="Enter email content"
              value={formState.content}
              onChange={handleContentChange}
              error={!!errors.content}
            />
            {errors.content && <div className="mt-2 text-red-500">{errors.content}</div>}
          </div>
        </CardBody>
        <CardFooter className="flex justify-between">
          <Button variant="outlined" onClick={resetForm}>
            Reset
          </Button>
          <div className="flex">
            <Button variant="outlined" onClick={handleCancel} className="mr-4">
              Cancel
            </Button>
            <Button variant="filled" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailForm;
