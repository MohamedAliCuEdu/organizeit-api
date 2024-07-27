const REGEX = {
  OBJECT_ID: /^[a-zA-Z0-9]{24}$/,
  USERNAME: /^[a-z][a-z0-9@#$%_]{4,}/gi,
  PASSWORD: /[a-zA-Z0-9!@#$%^&*()_+=-~]{8,}/gi,
  NAME: /^[a-z]{3,}/gi,
};

module.exports = REGEX;
