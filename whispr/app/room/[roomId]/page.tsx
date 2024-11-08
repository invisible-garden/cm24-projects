"use client";
import { usePeer } from "@/app/context/PeerContext";
import { useRouter } from "next/navigation";
import { MediaConnection, DataConnection } from "peerjs";
import { useEffect, useRef } from "react";
import { useNotification } from "@/app/context/NotificationContext";

export default function RoomPage({
  params: { roomId },
}: {
  params: { roomId: string };
}) {
  const { peer, peerId } = usePeer();
  const { notify } = useNotification();
  const router = useRouter();
  const remoteStreamsRef = useRef<{ [peerId: string]: MediaStream }>({});

  // Adicionar esta nova função de limpeza
  const cleanupPeerConnection = (remotePeerId: string) => {
    console.log(`Cleaning up connection for peer ${remotePeerId}`);
    if (remoteStreamsRef.current[remotePeerId]) {
      const stream = remoteStreamsRef.current[remotePeerId];
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      delete remoteStreamsRef.current[remotePeerId];
    }
  };

  useEffect(() => {
    const getMediaAndSetupAudio = async () => {
      try {
        let connectedPeers: string[] = [];
        console.log("Getting media and setup audio");
        const userStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        //setStream(userStream);
        console.log("userStream", userStream);

        const handleIncomingCall = (call: MediaConnection) => {
          console.log("handleIncomingCall", call);
          notify(`Call received from ${call.peer}`);

          call.on("error", (err) => {
            console.error("Call error:", err);
            notify(`Call error with peer ${call.peer}`);
            cleanupPeerConnection(call.peer);
          });

          // Add timeout to handle connection failures
          const connectionTimeout = setTimeout(() => {
            call.close();
            notify(`Connection timeout with peer ${call.peer}`);
            cleanupPeerConnection(call.peer);
          }, 30000);

          call.answer(userStream);

          call.on("stream", (remoteStream: MediaStream) => {
            console.log("Stream received from call", remoteStream);
            clearTimeout(connectionTimeout);
            remoteStreamsRef.current[call.peer] = remoteStream;
            updateConnectedPeers(call.peer);
          });

          call.on("close", () => {
            clearTimeout(connectionTimeout);
            cleanupPeerConnection(call.peer);
          });
        };

        const updateConnectedPeers = (newPeerId: string) => {
          if (!connectedPeers.includes(newPeerId)) {
            connectedPeers.push(newPeerId);
            sendConnectedPeersUpdate();
          }
        };

        const sendConnectedPeersUpdate = () => {
          connectedPeers.forEach((remotePeerId) => {
            if (remotePeerId !== peerId) {
              console.log("Sending connected peers update to", remotePeerId);
              const conn: DataConnection = peer.connect(remotePeerId);
              conn.on("open", () => {
                conn.send({
                  type: "connected_peers",
                  peers: connectedPeers,
                });
              });
            }
          });
        };

        const connectToPeer = async (remotePeerId: string) => {
          console.log(" try connectToPeer", remotePeerId);
          if (
            remotePeerId !== peerId &&
            !remoteStreamsRef.current[remotePeerId]
          ) {
            console.log(`connectToPeer: ${remotePeerId}`);
            notify(`Connecting to peer: ${remotePeerId}`);

            try {
              const call = peer.call(remotePeerId, userStream);

              handleIncomingCall(call);
            } catch (error) {
              console.error(`Error connecting to peer ${remotePeerId}:`, error);
              notify(`Failed to connect to peer ${remotePeerId}`);
            }
          } else {
            notify(`Peer ${remotePeerId} already connected`);
            console.log(`Peer ${remotePeerId} already connected`);
          }
        };

        console.log("peerId", peerId);
        console.log("roomId", roomId);
        if (peerId !== roomId) {
          // Join the room
          connectToPeer(roomId);
        }

        // Listen for incoming calls
        peer.on("call", handleIncomingCall);

        // Listen for incoming data connections
        peer.on("connection", (conn: DataConnection) => {
          console.log("Connection received", conn);
          conn.on("data", (data: unknown) => {
            if (
              typeof data === "object" &&
              data !== null &&
              "type" in data &&
              data.type === "connected_peers"
            ) {
              const newPeersData = data as {
                type: string;
                peers: string[];
              };
              console.log("Received peers list:", newPeersData.peers);
              const actualNewPeers = newPeersData.peers.filter(
                (id: string) => id !== peerId && !connectedPeers.includes(id)
              );

              if (actualNewPeers.length > 0) {
                notify(`Connecting to new peers: ${actualNewPeers}`);
                console.log("Connecting to new peers", actualNewPeers);
                actualNewPeers.forEach(connectToPeer);
                connectedPeers = [...connectedPeers, ...actualNewPeers];
              }
            }
          });
        });
      } catch (error) {
        console.error("Error accessing audio:", error);
      }
    };

    console.log("peer", peer);
    if (peer && peerId) {
      getMediaAndSetupAudio();
    } else {
      console.error("Peer not initialized");
    }

    // Cleanup function
    return () => {
      peer.removeAllListeners("call");
      peer.removeAllListeners("connection");
      peer.removeAllListeners("disconnected");

      // Close all existing connections
      Object.keys(remoteStreamsRef.current).forEach((remotePeerId) => {
        cleanupPeerConnection(remotePeerId);
      });
    };
  }, [peerId]); // eslint-disable-line react-hooks/exhaustive-deps

  console.log(remoteStreamsRef.current);
  return (
    <div className="w-screen h-screen">
      <div className="flex w-full justify-between h-14">
        <div className="h-14 w-[200px]">
          <button
            className="mb-4 h-14 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
            onClick={() => router.push("/")}
          >
            {"<"} Back
          </button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Room</h1>
          {/* <p className="text-sm font-bold">
            e97501ed-b278-4513-bb16-a44cb3168fa8
          </p> */}
          <p className="text-sm font-bold">{roomId}</p>
        </div>
        <div className="flex flex-col items-center justify-center w-[200px]">
          {/* <p className="text-sl font-bold ">
            My ID: e97501ed-b278-4513-bb16-a44cb3168fa8
          </p> */}
          <p className="text-sl font-bold">ID: {peerId}</p>
        </div>
      </div>
      {!peerId ? (
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)]">
          <div>
            <h2 className="text-lg">Remote Streams</h2>
            {Object.entries(remoteStreamsRef.current).map(
              ([remotePeerId, stream]) => (
                <div key={remotePeerId}>
                  <p className="text-sm">Peer {remotePeerId}</p>
                  <audio
                    className="w-full h-14 bg-black"
                    ref={(audio) => {
                      if (audio) {
                        // Only set srcObject if it's different to avoid unnecessary updates
                        if (audio.srcObject !== stream) {
                          audio.srcObject = stream;
                          audio.play().catch((e) => {
                            console.error(
                              `Error playing remote audio for peer ${remotePeerId}:`,
                              e
                            );
                          });
                        }
                      }
                    }}
                    controls
                  />
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
