import { IUserItem } from '@src/@types/typeUserItem';
import { Resend } from 'resend';
import Toast from './toastUtils';

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const resend = new Resend(RESEND_API_KEY);
interface FormState {
  email: string;
  subject: string;
  content: string;
  userInfo?: IUserItem;
}
const EmailUtils = {
  send: ({ email, subject, content, userInfo }: FormState) => {
    if (!email || !userInfo || !subject || !content) {
      return Promise.reject(new Error('Parameter error!'));
    }
    const [name] = email.split('@')[0];
    return new Promise((resolve, reject) => {
      resend.emails
        .send({
          from: `${name} <${userInfo!.firstName}.${userInfo!.lastName}@xiaopotato.top>`, // opt: need to Prevent repetition
          to: [email],
          subject: subject,
          html: content,
        })
        .then(({ data, error }) => {
          if (error) {
            console.error(
              '%c [ error ]-18',
              'font-size:13px; background:pink; color:#bf2c9f;',
              error,
            );
            Toast.error(error?.message);
            reject(error);
            return;
          }
          Toast.success('Email sent successfully!');
          console.log({ data });
          resolve(data);
        })
        .catch(reject);
    });
  },
};
export default EmailUtils;
