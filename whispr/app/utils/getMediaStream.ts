// src/utils/getMediaStream.js
export const getAudioStream = async () => {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
    throw new Error('MediaDevices API is not available');
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return stream;
  } catch (error) {
    console.error("Error accessing audio stream:", error);
    throw error;
  }
};
