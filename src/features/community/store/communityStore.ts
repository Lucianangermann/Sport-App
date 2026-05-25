import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Post, Challenge, CommunityUser, Spot, LiveSession } from '../../../data/community';
import {
  mockPosts,
  mockChallenges,
  mockUsers,
  mockSpots,
  mockLiveSessions,
} from '../../../data/community';

interface CommunityState {
  posts: Post[];
  challenges: Challenge[];
  buddies: CommunityUser[];
  spots: Spot[];
  liveSessions: LiveSession[];
  pendingRequests: string[];
  joinedChallenges: string[];
  following: string[];
  notifications: number;

  toggleReaction: (postId: string, reaction: 'fire' | 'muscle' | 'clap') => void;
  addPost: (content: string, sport?: string, sportEmoji?: string) => void;
  addComment: (postId: string, content: string) => void;
  sendBuddyRequest: (userId: string) => void;
  joinChallenge: (challengeId: string) => void;
  leaveChallenge: (challengeId: string) => void;
  logChallengeProgress: (challengeId: string, amount: number) => void;
  toggleFollow: (userId: string) => void;
  checkInSpot: (spotId: string) => void;
  addSpot: (spot: Omit<Spot, 'id' | 'checkedInCount' | 'reviewCount' | 'photos'>) => void;
  toggleLiveReminder: (sessionId: string) => void;
  clearNotifications: () => void;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      posts: mockPosts,
      challenges: mockChallenges,
      buddies: mockUsers,
      spots: mockSpots,
      liveSessions: mockLiveSessions,
      pendingRequests: [],
      joinedChallenges: [],
      following: mockUsers.filter((u) => u.isFollowing).map((u) => u.id),
      notifications: 0,

      toggleReaction: (postId, reaction) => {
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id !== postId) return post;

            const prevReaction = post.userReaction;
            const isSame = prevReaction === reaction;

            const updatedReactions = { ...post.reactions };

            if (prevReaction && prevReaction !== reaction) {
              updatedReactions[prevReaction] = Math.max(0, updatedReactions[prevReaction] - 1);
            }

            if (!isSame) {
              updatedReactions[reaction] = updatedReactions[reaction] + 1;
            } else {
              updatedReactions[reaction] = Math.max(0, updatedReactions[reaction] - 1);
            }

            const totalReactions = updatedReactions.fire + updatedReactions.muscle + updatedReactions.clap;

            return {
              ...post,
              reactions: updatedReactions,
              userReaction: isSame ? undefined : reaction,
              likes: totalReactions,
            };
          }),
        }));
      },

      addPost: (content, sport, sportEmoji) => {
        const newPost: Post = {
          id: `post_${Date.now()}`,
          userId: 'me',
          userName: 'Du',
          userAvatar: 'https://i.pravatar.cc/150?u=me',
          content,
          sport,
          sportEmoji,
          likes: 0,
          reactions: { fire: 0, muscle: 0, clap: 0 },
          comments: [],
          createdAt: new Date().toISOString(),
          hasLiked: false,
        };
        set((state) => ({ posts: [newPost, ...state.posts] }));
      },

      addComment: (postId, content) => {
        const newComment = {
          id: `comment_${Date.now()}`,
          userId: 'me',
          userName: 'Du',
          userAvatar: 'https://i.pravatar.cc/150?u=me',
          content,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? { ...post, comments: [...post.comments, newComment] }
              : post,
          ),
        }));
      },

      sendBuddyRequest: (userId) => {
        const { pendingRequests } = get();
        if (pendingRequests.includes(userId)) return;
        set((state) => ({
          pendingRequests: [...state.pendingRequests, userId],
          notifications: state.notifications + 1,
        }));
      },

      joinChallenge: (challengeId) => {
        set((state) => ({
          joinedChallenges: state.joinedChallenges.includes(challengeId)
            ? state.joinedChallenges
            : [...state.joinedChallenges, challengeId],
          challenges: state.challenges.map((ch) =>
            ch.id === challengeId
              ? { ...ch, participantCount: ch.participantCount + 1, isJoined: true }
              : ch,
          ),
        }));
      },

      leaveChallenge: (challengeId) => {
        set((state) => ({
          joinedChallenges: state.joinedChallenges.filter((id) => id !== challengeId),
          challenges: state.challenges.map((ch) =>
            ch.id === challengeId
              ? { ...ch, participantCount: Math.max(0, ch.participantCount - 1), isJoined: false }
              : ch,
          ),
        }));
      },

      logChallengeProgress: (challengeId, amount) => {
        set((state) => ({
          challenges: state.challenges.map((ch) =>
            ch.id === challengeId
              ? { ...ch, userProgress: ch.userProgress + amount }
              : ch,
          ),
        }));
      },

      toggleFollow: (userId) => {
        const { following } = get();
        const isFollowing = following.includes(userId);
        set((state) => ({
          following: isFollowing
            ? state.following.filter((id) => id !== userId)
            : [...state.following, userId],
          buddies: state.buddies.map((u) =>
            u.id === userId ? { ...u, isFollowing: !isFollowing } : u,
          ),
        }));
      },

      checkInSpot: (spotId) => {
        set((state) => ({
          spots: state.spots.map((spot) =>
            spot.id === spotId
              ? { ...spot, checkedInCount: spot.checkedInCount + 1 }
              : spot,
          ),
        }));
      },

      addSpot: (spotData) => {
        const newSpot: Spot = {
          ...spotData,
          id: `spot_${Date.now()}`,
          checkedInCount: 0,
          reviewCount: 0,
          photos: [],
        };
        set((state) => ({ spots: [...state.spots, newSpot] }));
      },

      toggleLiveReminder: (sessionId) => {
        set((state) => ({
          liveSessions: state.liveSessions.map((session) =>
            session.id === sessionId
              ? { ...session, isReminded: !session.isReminded }
              : session,
          ),
        }));
      },

      clearNotifications: () => {
        set({ notifications: 0 });
      },
    }),
    {
      name: 'community-store-v1',
    },
  ),
);
