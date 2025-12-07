
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper type for our flexible JSON structure
type Ratings = Record<string, number>;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cafeId, walletAddress, ratings, text } = body;

    if (!cafeId || !walletAddress || !ratings) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Get the User
    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found. Please login first.' }, { status: 404 });
    }

    // 2. Get the Cafe to calculate consensus
    const cafe = await prisma.cafe.findUnique({
      where: { id: cafeId },
    });

    if (!cafe) {
      return NextResponse.json({ error: 'Cafe not found' }, { status: 404 });
    }

    // --- SMART SCORING ALGORITHM ---
    
    let earnedPoints = 10; // Base Reward for submission
    const cafeCurrentAmenities = (cafe.amenities as Ratings) || {};
    const userRatings = ratings as Ratings;
    const isNewCafe = cafe.reviewCount === 0;

    // Calculate Consensus Bonus
    // We iterate through the categories the user rated (wifi, noise, etc.)
    Object.keys(userRatings).forEach((key) => {
      const userScore = userRatings[key];
      const cafeScore = cafeCurrentAmenities[key];

      // Logic: If it's a new cafe OR the user's score is within 2 points of the average
      if (isNewCafe || (cafeScore !== undefined && Math.abs(userScore - cafeScore) <= 2)) {
        earnedPoints += 5; // Bonus for accuracy/discovery
      }
    });

    // 3. Database Transaction
    // We perform all updates atomically to ensure data integrity
    const result = await prisma.$transaction(async (tx) => {
      
      // A. Create the Review
      const newReview = await tx.review.create({
        data: {
          userId: user.id,
          cafeId: cafe.id,
          text: text || '',
          ratings: ratings,
        },
      });

      // B. Update User Points
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          totalPoints: { increment: earnedPoints },
        },
      });

      // C. Recalculate Cafe Averages (Incremental Update)
      // NewAvg = ((OldAvg * OldCount) + NewRating) / (OldCount + 1)
      const newCount = cafe.reviewCount + 1;
      const newAmenities: Ratings = { ...cafeCurrentAmenities };

      Object.keys(userRatings).forEach((key) => {
        const oldAvg = newAmenities[key] || 0;
        const newRating = userRatings[key];
        
        // If it was 0 and count was 0, just use new rating, else use formula
        const nextAvg = cafe.reviewCount === 0 
          ? newRating 
          : ((oldAvg * cafe.reviewCount) + newRating) / newCount;
          
        newAmenities[key] = parseFloat(nextAvg.toFixed(1)); // Keep it clean (1 decimal)
      });

      await tx.cafe.update({
        where: { id: cafeId },
        data: {
          reviewCount: newCount,
          amenities: newAmenities,
        },
      });

      return { newReview, updatedUser };
    });

    return NextResponse.json({
      success: true,
      earnedPoints,
      newTotal: result.updatedUser.totalPoints,
      message: `Review posted! You earned ${earnedPoints} points.`
    });

  } catch (error) {
    console.error('Post review error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
