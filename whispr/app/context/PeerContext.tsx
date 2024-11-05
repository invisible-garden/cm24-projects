"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Peer from "peerjs";

interface PeerContextType {
  peer: Peer;
  resetPeer: () => void;
  peerId: string;
}

const PeerContext = createContext<PeerContextType | undefined>(undefined);

export const PeerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  //     const newPeer = new Peer(undefined, {
  //      port: 443,
  //      secure: true,
  //       host: "https://9000-peers-peerjsserver-q6xgn89im2s.ws-us116.gitpod.io",
  const [peer, setPeer] = useState<Peer>(new Peer());
  const [peerId, setPeerId] = useState<string>("");

  useEffect(() => {
    peer.on("open", (id) => {
      console.log("Peer opened", id);
      setPeerId(id);
    });

    // peer.on("call", (call) => {
    //   console.log("Call received", call);
    // });

    return () => {
      console.log("Destroying peer");
      peer.destroy();
    };
  }, [peer]);

  const resetPeer = () => {
    console.log("Resetting peer");
    peer.destroy();
    setPeer(new Peer());
  };

  return (
    <PeerContext.Provider value={{ peer, resetPeer, peerId }}>
      {children}
    </PeerContext.Provider>
  );
};

export const usePeer = (): PeerContextType => {
  const context = useContext(PeerContext);
  if (!context) {
    throw new Error("usePeer must be used within a PeerProvider");
  }
  return context;
};
