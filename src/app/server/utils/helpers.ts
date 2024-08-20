export const generateId = () => {
  return Math.floor(Date.now() + Math.random()).toString();
};

export const generateUserName = (name: string) => {
  return name.replace(/\s+/g, "").toLowerCase();
};

export const generateOTP = (min = 100000, max = 999999) => {
  return Math.abs(Math.floor(Math.random() * (max - min + 1) + min));
};

export const verifyEmail = () => {};

export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const convert_to_value = (word: string) => {
  let value = word?.split(" ").join("_").toUpperCase();
  return value;
};
