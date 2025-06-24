import axios from 'axios';

async function login(email: string, password: string) {
  const response = await axios.post('/api/users/login', { email, password } , 
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}

export { login };