import { describe, expect, it } from 'vitest';
import { unionById, useCommunityStore } from './communityStore';

describe('unionById', () => {
  it('appends seed items not present in the saved array', () => {
    const saved = [{ id: 'a' }];
    const seed = [{ id: 'a' }, { id: 'b' }];
    expect(unionById(saved, seed).map((x) => x.id)).toEqual(['a', 'b']);
  });

  it('keeps saved entries and does not overwrite them from seed', () => {
    const saved = [{ id: 'a', v: 1 }];
    const seed = [{ id: 'a', v: 2 }];
    expect(unionById(saved, seed)).toEqual([{ id: 'a', v: 1 }]);
  });

  it('falls back to the full seed when nothing is saved', () => {
    const seed = [{ id: 'a' }, { id: 'b' }];
    expect(unionById(undefined, seed)).toEqual(seed);
  });
});

describe('community store reducers', () => {
  const snapshotPost = (id: string) =>
    useCommunityStore.getState().posts.find((p) => p.id === id)!;

  it('toggleReaction adds, then removes, a reaction cleanly', () => {
    const id = useCommunityStore.getState().posts[0].id;

    // Normalize: clear any pre-existing reaction from the seed.
    const start = snapshotPost(id);
    if (start.userReaction) useCommunityStore.getState().toggleReaction(id, start.userReaction);
    expect(snapshotPost(id).userReaction).toBeUndefined();

    const fireBase = snapshotPost(id).reactions.fire;

    useCommunityStore.getState().toggleReaction(id, 'fire');
    const added = snapshotPost(id);
    expect(added.userReaction).toBe('fire');
    expect(added.reactions.fire).toBe(fireBase + 1);

    useCommunityStore.getState().toggleReaction(id, 'fire');
    const removed = snapshotPost(id);
    expect(removed.userReaction).toBeUndefined();
    expect(removed.reactions.fire).toBe(fireBase);
  });

  it('switching reactions moves the count from one to the other', () => {
    const id = useCommunityStore.getState().posts[0].id;
    const start = snapshotPost(id);
    if (start.userReaction) useCommunityStore.getState().toggleReaction(id, start.userReaction);

    const base = snapshotPost(id);
    useCommunityStore.getState().toggleReaction(id, 'muscle');
    useCommunityStore.getState().toggleReaction(id, 'clap');
    const after = snapshotPost(id);

    expect(after.userReaction).toBe('clap');
    expect(after.reactions.muscle).toBe(base.reactions.muscle); // moved away again
    expect(after.reactions.clap).toBe(base.reactions.clap + 1);
  });

  it('joinChallenge then leaveChallenge round-trips the participant count', () => {
    const id = useCommunityStore.getState().challenges[0].id;
    const snap = () => useCommunityStore.getState().challenges.find((c) => c.id === id)!;

    if (snap().isJoined) useCommunityStore.getState().leaveChallenge(id);
    const baseCount = snap().participantCount;

    useCommunityStore.getState().joinChallenge(id);
    expect(snap().isJoined).toBe(true);
    expect(snap().participantCount).toBe(baseCount + 1);
    expect(useCommunityStore.getState().joinedChallenges).toContain(id);

    useCommunityStore.getState().leaveChallenge(id);
    expect(snap().isJoined).toBe(false);
    expect(snap().participantCount).toBe(baseCount);
    expect(useCommunityStore.getState().joinedChallenges).not.toContain(id);
  });

  it('toggleFollow flips both the following list and the user flag', () => {
    const userId = useCommunityStore.getState().buddies[0].id;
    const was = useCommunityStore.getState().following.includes(userId);

    useCommunityStore.getState().toggleFollow(userId);
    const after = useCommunityStore.getState();
    expect(after.following.includes(userId)).toBe(!was);
    expect(after.buddies.find((u) => u.id === userId)!.isFollowing).toBe(!was);

    useCommunityStore.getState().toggleFollow(userId); // round-trip
    expect(useCommunityStore.getState().following.includes(userId)).toBe(was);
  });

  it('addPost prepends a post authored by the user', () => {
    const before = useCommunityStore.getState().posts.length;
    useCommunityStore.getState().addPost('Erster Lauf geschafft!', 'laufen', '🏃');
    const posts = useCommunityStore.getState().posts;

    expect(posts.length).toBe(before + 1);
    expect(posts[0].content).toBe('Erster Lauf geschafft!');
    expect(posts[0].userId).toBe('me');
    expect(posts[0].reactions).toEqual({ fire: 0, muscle: 0, clap: 0 });
  });
});
