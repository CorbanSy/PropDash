export const apiRequest = async (url, body) => {
  return await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
};
