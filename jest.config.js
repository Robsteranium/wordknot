module.exports = async () => {
  return {
    transformIgnorePatterns: ["/node_modules/(?!@thi\.ng)"]
  };
};