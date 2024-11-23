import { IUserItem } from '@src/@types/typeUserItem';
import xPotatoApi from '@src/Api/xPotatoApi';
// import { Resend } from 'resend';

// const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || 're_';
// const resend = new Resend(RESEND_API_KEY);
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
    return xPotatoApi.sendEmail({
      toUser: email,
      fromUser: `${userInfo!.firstName}.${userInfo!.lastName} <${userInfo!.firstName}.${userInfo!.lastName}@xiaopotato.top>`,
      subject,
      content,
    });
  },
};
export default EmailUtils;
