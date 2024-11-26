export const checkEmailContent = (content: string = '') => {
  return content.includes(
    '<span style="display:none;width:0px;height:0px;position:absolute;">__template</span>',
  );
};
