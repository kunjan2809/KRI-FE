import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const reviewId = formData.get('review_id') as string;

    if (!file) {
      return NextResponse.json(
        { message: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `review_${reviewId || timestamp}_${timestamp}.${fileExtension}`;

    // In a real application, you would upload to a cloud storage service like AWS S3, Cloudinary, etc.
    // For now, we'll simulate the upload by returning a mock URL
    const imageUrl = `/uploads/reviews/${fileName}`;

    // Mock response - in production, this would be the actual uploaded file URL
    return NextResponse.json({
      success: true,
      image_url: imageUrl,
      file_name: fileName,
      file_size: file.size,
      file_type: file.type,
    });

  } catch (error) {
    console.error('Error uploading review image:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
