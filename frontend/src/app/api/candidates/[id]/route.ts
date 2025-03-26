import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidates/${params.id}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const profile = JSON.parse(formData.get('profile') as string);
    const photo = formData.get('photo') as File | null;
    const resume = formData.get('resume') as File | null;

    // Create a new FormData instance for the backend
    const backendFormData = new FormData();
    backendFormData.append('profile', JSON.stringify(profile));

    if (photo) {
      backendFormData.append('photo', photo);
    }

    if (resume) {
      backendFormData.append('resume', resume);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidates/${params.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to update profile' },
      { status: 500 }
    );
  }
} 