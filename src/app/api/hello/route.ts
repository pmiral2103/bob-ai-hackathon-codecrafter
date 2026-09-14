import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ message: 'Hello from the backend API!' });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    return NextResponse.json({
      message: 'Data received successfully',
      receivedData: data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
