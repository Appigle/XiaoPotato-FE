import { user_profile } from '@src/@types/typeRequest';

interface FormState {
  email: string;
  subject: string;
  content: string;
}
const emailTemplate = (user: user_profile): FormState[] => {
  return [
    {
      email: '',
      subject: 'Join xiaoPotato - Where Creativity Meets Community',
      content: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h1 style="color: #2b6cb0; font-size: 24px; text-align: center; margin-bottom: 30px;">Join xiaoPotato - Where Creativity Meets Community</h1>

  <p style="font-size: 16px; margin: 20px 0;">Hi,</p>

  <p style="font-size: 16px; margin: 20px 0;">Imagine a space where artists worldwide share their work, connect, and grow together. That's ArtShare.</p>

  <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <strong>Key features:</strong>
    <ul style="list-style: none; padding: 0; margin: 10px 0;">
      <li style="margin: 8px 0; padding-left: 20px;">• Custom portfolio creation</li>
      <li style="margin: 8px 0; padding-left: 20px;">• Direct engagement with art collectors</li>
      <li style="margin: 8px 0; padding-left: 20px;">• Live collaborative sessions</li>
      <li style="margin: 8px 0; padding-left: 20px;">• Commission opportunities</li>
      <li style="margin: 8px 0; padding-left: 20px;">• Global artist community</li>
    </ul>
  </div>

  <p style="text-align: center; margin: auto;">
    Start to share your best art!
  </p>
  <h4 style="text-align: center; background:#bcd2ea; margin: auto;color: width:fit-content white; padding: 12px 24px; text-decoration: underline; cursor:pointer; border-radius: 4px;">https://zfc.xiaopotato.top</h4>
  <p style="margin: 20px 0;">Questions? Reply directly to this email.</p>

  <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px; color: #718096; font-size: 14px;">
    Best,<br>
    ${user?.firstName}.${user?.lastName}<br>
    <span style="display:none;width:0px;height:0px;position:absolute;">__template</span>
  </div>
</div>`,
    },
  ];
};

export default emailTemplate;
