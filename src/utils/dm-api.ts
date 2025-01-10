const apiUrl = import.meta.env.DM_API_URL;

const defaultHeaders = {
  'Content-Type': 'application/json',
  'cache-control': 'no-cache',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
};

const apiAuth = async () => {
  try {
    const url = `${apiUrl}/login`;
    // console.log(url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
      },
      body: JSON.stringify({
        username: import.meta.env.DM_API_USER,
        password: import.meta.env.DM_API_PASSWORD,
      }),
    });
    const data = await response.json();

    // console.log(data);
    if (!response.ok) {
      console.error(response.statusText);
    }

    return data.token;
  } catch (error) {
    console.log(error);
  }
};

export const dmSearch = async (document: string, recaptcha: string) => {
  const token = await apiAuth();
  const url = `${apiUrl}/buscarDocente`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      asodni: document,
      recaptchatoken: recaptcha,
    }),
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const dmLogin = async (
  document: string,
  password: string,
  recaptcha: string
) => {
  try {
    const token = await apiAuth();
    const url = `${apiUrl}/acceder`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        asodni: document,
        clave: password,
        recaptchatoken: recaptcha,
      }),
    });
    const data = await response.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};

const validateToken = async (token: string) => {
  const recaptchaURL = 'https://www.google.com/recaptcha/api/siteverify';
  const requestHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const requestBody = new URLSearchParams({
    secret: import.meta.env.RECAPTCHA_SECRET_KEY,
    response: token, // The token passed in from the client
  });

  const response = await fetch(recaptchaURL, {
    method: 'POST',
    headers: requestHeaders,
    body: requestBody.toString(),
  });

  const responseData = await response.json();
  console.log(responseData);
  return responseData;
};
