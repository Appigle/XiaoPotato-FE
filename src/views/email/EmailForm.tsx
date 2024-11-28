import { Button, Card, CardBody, CardFooter, Input, Textarea } from '@material-tailwind/react';
import { IUserItem } from '@src/@types/typeUserItem';
import busEvent from '@src/constants/busEvent';
import useEventBusStore from '@src/stores/useEventBusStore';
import useGlobalStore from '@src/stores/useGlobalStore';
import bus from '@src/utils/bus';
import EmailUtils from '@src/utils/emailUtils';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import Toast from '@src/utils/toastUtils';
import React, { useEffect, useState } from 'react';
import emailTemplate from './template';
import { checkEmailContent } from './utils';

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
  } else if (content.length > 2000) {
    return 'content must be less than 2000 characters';
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
  const [useTemplate, setUseTemplate] = useState(false);
  const userInfo = useGlobalStore((s) => s.userInfo);
  const setHeaderConfig = useGlobalStore((s) => s.setHeaderConfig);
  const { currentEmailDetail } = useEventBusStore();

  useEffect(() => {
    if (!currentEmailDetail) {
      return;
    }
    setUseTemplate(checkEmailContent(currentEmailDetail.content));
    setFormState({
      email: currentEmailDetail.toUser,
      subject: currentEmailDetail.subject,
      content: currentEmailDetail.content,
    });
  }, [currentEmailDetail]);

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
        if (res.code === HTTP_RES_CODE.SUCCESS) {
          resetForm();
          bus.emit(busEvent.REFRESH_EMAIL_LIST);
          Toast.success('Send successfully!');
        }
      });
    }
  };
  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setUseTemplate(false);
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
  const handleTemplate = (type: number) => {
    const newEmail = { ...emailTemplate(userInfo!)[type], email: formState.email || '' };
    setFormState(newEmail);
    setUseTemplate(true);
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-4 text-blue-gray-900 dark:text-gray-200">
        <span>Template: </span>
        <Button
          className=""
          onClick={() => {
            handleTemplate(0);
          }}
        >
          + Invitation
        </Button>
      </div>
      <Card
        className={`w-full max-w-xl border-t-[1px] border-gray-300 bg-gray-100 text-blue-gray-900 dark:bg-blue-gray-800 dark:text-gray-100`}
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
              className="text-blue-gray-900 dark:text-gray-200"
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
              className="text-blue-gray-900 dark:text-gray-200"
            />
            {errors.subject && <div className="mt-2 text-red-500">{errors.subject}</div>}
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="mb-2 block">
              Content
            </label>
            {useTemplate ? (
              <div
                className="max-h-[300px] overflow-scroll bg-gray-200"
                dangerouslySetInnerHTML={{ __html: formState.content }}
              ></div>
            ) : (
              <Textarea
                id="content"
                placeholder="Enter email content"
                value={formState.content}
                onChange={handleContentChange}
                error={!!errors.content}
                className="min-h-[300px] text-blue-gray-900 dark:text-gray-200"
              />
            )}
            {errors.content && <div className="mt-2 text-red-500">{errors.content}</div>}
          </div>
        </CardBody>
        <CardFooter className="flex justify-end gap-4">
          <Button
            variant="outlined"
            onClick={resetForm}
            className="text-blue-gray-900 dark:text-gray-200"
          >
            Reset
          </Button>
          <div className="flex">
            <Button variant="outlined" onClick={handleCancel} className="mr-4 hidden">
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
