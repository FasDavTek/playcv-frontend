export const ErrorMessages = {
  required: (value: string) => `${value} is required`,
  invalidEmail: `Invalid Email Address`,
  passwordMismatch: `Passwords do not match`,
  invalidType: (value: string) => `Please input only ${value}`,
};
