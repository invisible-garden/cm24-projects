"use client";

import { usePeer } from "./context/PeerContext";
import { useRouter } from "next/navigation";
import { useNotification } from "./context/NotificationContext";

export default function Home() {
  const { peerId } = usePeer();
  const { notify } = useNotification();
  const router = useRouter();

  const createRoom = () => {
    const roomUrl = `${window.location.origin}/room/${peerId}`;
    navigator.clipboard.writeText(roomUrl);
    notify("Room URL copied to clipboard");
    router.push(`/room/${peerId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-[60px] font-bold">Whispr</h1>
      <h2 className="text-sm">Anonimous Audio Streaming</h2>
      <br />
      <br />
      {/* <p className="text-lg">Your Peer ID: {peerId}</p> */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={createRoom}
      >
        Create Room
      </button>
    </div>
  );
}
