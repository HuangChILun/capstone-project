import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'not allow' });
  }

  const { email } = req.body;

  try {
    const response = await axios.post(`${process.env.BACKEND_URL}/auth/forgot`, { email });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'error'
    });
  }
}