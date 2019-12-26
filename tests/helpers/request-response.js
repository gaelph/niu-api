const mockRequest = (method, path, headers, body) => ({
  method, path,
  headers,
  body,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.header = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  return res;
};

module.exports = {
  mockRequest,
  mockResponse,
}