import { describe, expect, it, vi } from 'vitest';
import { emit, on } from './events';

describe('domain event bus', () => {
  it('delivers an emitted event to a subscriber with its payload', () => {
    const handler = vi.fn();
    const off = on('module.completed', handler);

    emit('module.completed', { sportId: 'fussball', level: 'anfaenger', moduleId: 'b1' });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      sportId: 'fussball',
      level: 'anfaenger',
      moduleId: 'b1',
    });
    off();
  });

  it('fans out to every subscriber of the same event', () => {
    const a = vi.fn();
    const b = vi.fn();
    const offA = on('streak.advanced', a);
    const offB = on('streak.advanced', b);

    emit('streak.advanced', { days: 7 });

    expect(a).toHaveBeenCalledOnce();
    expect(b).toHaveBeenCalledOnce();
    offA();
    offB();
  });

  it('does not deliver across different event types', () => {
    const handler = vi.fn();
    const off = on('inquiry.sent', handler);

    emit('onboarding.completed', {});

    expect(handler).not.toHaveBeenCalled();
    off();
  });

  it('stops delivering after unsubscribe', () => {
    const handler = vi.fn();
    const off = on('module.completed', handler);
    off();

    emit('module.completed', { sportId: 'yoga', level: 'profi', moduleId: 'p1' });

    expect(handler).not.toHaveBeenCalled();
  });

  it('is a no-op when nobody is listening', () => {
    expect(() => emit('streak.advanced', { days: 14 })).not.toThrow();
  });

  it('survives a handler that unsubscribes mid-dispatch', () => {
    const calls: string[] = [];
    const offFirst = on('streak.advanced', () => {
      calls.push('first');
      offFirst(); // mutate the listener set while we iterate it
    });
    const offSecond = on('streak.advanced', () => calls.push('second'));

    expect(() => emit('streak.advanced', { days: 21 })).not.toThrow();
    expect(calls).toEqual(['first', 'second']);
    offSecond();
  });
});
