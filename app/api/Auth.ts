import axios from "axios";

async function login(username: string, password: string) {
  try {
    const response = await axios.post(
      "https://fakestoreapi.com/auth/login",
      JSON.stringify({ username, password }),
      {
        headers: {
          "Content-Type": "application/json" 
        }
      }
    );

    return response.data; // will be { token: '...' }
  } catch (error) {
    console.error("Error occurred while logging in:", error);
    throw error;
  }
}

export { login };
