const getRequestBody = async (req) => {
  return new Promise((resolve, reject) => {
    try {
      let body = '';

      // Listen to data sent by client
      req.on('data', (chunk) => {
        // Append the string version to the body
        body += chunk.toString();
      });

      // Listen till the end
      req.on('end', () => {
        // Send back the data
        resolve(body);
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = { getRequestBody };
