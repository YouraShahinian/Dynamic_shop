const generateMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().toTimeString(),
  };
};

export { generateMessage };
