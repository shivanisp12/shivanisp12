import { CelebrationProject } from '@/types/celebration';

export function encodeProjectPayload(project: CelebrationProject): string {
  const jsonString = JSON.stringify(project);
  if (typeof window !== 'undefined') {
    return btoa(encodeURIComponent(jsonString));
  }
  return Buffer.from(jsonString).toString('base64');
}

export function decodeProjectPayload(payload: string): CelebrationProject | null {
  try {
    let jsonString: string;
    if (typeof window !== 'undefined') {
      jsonString = decodeURIComponent(atob(payload));
    } else {
      jsonString = Buffer.from(payload, 'base64').toString('utf-8');
    }
    return JSON.parse(jsonString) as CelebrationProject;
  } catch (err) {
    console.error('Failed to decode celebration payload:', err);
    return null;
  }
}
