export interface FormErrors {
  firstName?: string;
  lastName?: string;
  userAccount?: string;
  userPassword?: string;
  checkPassword?: string;
  email?: string;
  phone?: string;
  gender?: string;
  general?: string;
}
interface RegisterFormData {
  firstName: string;
  lastName: string;
  userAccount: string;
  userPassword: string;
  checkPassword: string;
  email: string;
  phone: string;
  gender: string;
}
const validateRequired = (value: string, fieldName: string): string | undefined => {
  if (!value) {
    return `This ${fieldName} is required`;
  }
};
const validateUserAccount = (userAccount: string): string | undefined => {
  if (userAccount.length < 4) {
    return 'User account must be at least 4 characters long';
  }
  if (
    /[`~!@#$%^&*()+=|{}':;',\\[\].<>/?~!@#￥%……&*（）——+|{}【】‘；：”“’。，、？]/.test(userAccount)
  ) {
    return 'User account cannot contain special characters';
  }
};
const validateUserPassword = (userPassword: string): string | undefined => {
  if (userPassword.length < 8) {
    return 'User password must be at least 8 characters long';
  }
};

export const validateEmail = (email: string): string | undefined => {
  if (!/^[\w.-]+@[\w-]+\.[a-z]{2,}$/i.test(email)) {
    return 'Invalid email address';
  }
};

export const validateRegisterForm = (data: RegisterFormData): FormErrors => {
  const errors: FormErrors = {};

  errors.firstName = validateRequired(data.firstName, 'First name');
  errors.lastName = validateRequired(data.lastName, 'Last name');
  errors.userAccount =
    validateUserAccount(data.userAccount) || validateRequired(data.userAccount, 'User account');
  errors.userPassword =
    validateUserPassword(data.userPassword) || validateRequired(data.userPassword, 'User password');

  if (data.userPassword !== data.checkPassword) {
    errors.checkPassword = 'Passwords do not match';
  }

  if (data.email) {
    errors.email = validateEmail(data.email);
  }
  //remove any undefined errors
  Object.keys(errors).forEach((key) => {
    if (errors[key as keyof FormErrors] === undefined) {
      delete errors[key as keyof FormErrors];
    }
  });
  return errors;
};
