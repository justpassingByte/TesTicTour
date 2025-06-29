import { cookies } from 'next/headers';
import { IPlayerProfile, IUser } from '../types/user';

export class AuthServerService {
  static async getMe(): Promise<IUser | null> {
    try {
      const cookieStore = await cookies();
      const authToken = cookieStore.get('authToken')?.value;

      if (!authToken) {
        return null;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          Cookie: `authToken=${authToken}`,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        console.error('Failed to fetch user:', response.statusText);
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (err) {
      console.error('Error in getMe:', err);
      return null;
    }
  }

  static async getMyProfile(): Promise<IPlayerProfile | null> {
    const user = await this.getMe();

    if (!user) {
      return null;
    }

    // TODO: This should be replaced with a call to a dedicated backend endpoint
    // like /api/profile/me that returns the full player profile.
    const playerProfile: IPlayerProfile = {
      ...user,
      tournaments: [],
      matches: [],
      stats: {
        tournamentsPlayed: 0,
        tournamentsWon: 0,
        matchesPlayed: 0,
        averageGameDuration: "00:00",
        averagePlacement: 0,
        bestPlacement: 0,
        topFourRate: 0,
        firstPlaceRate: 0,
        totalPoints: 0,
        winStreak: 0,
        favoriteComposition: "N/A",
      },
      achievements: [],
      lastActive: new Date(),
      joinDate: user.createdAt,
    };

    return playerProfile;
  }
} 