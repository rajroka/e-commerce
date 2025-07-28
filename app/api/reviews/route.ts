// Example in Next.js API route
// import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse , NextRequest  } from "next/server";
export default async function handler(req : NextRequest, res : NextResponse ) {
  if (req.method === 'POST') {
    const { productId, userId, username, comment, rating } = req.body;
    // Save to DB...
    res.status(201).json({ message: 'Review submitted' });
  }
}
