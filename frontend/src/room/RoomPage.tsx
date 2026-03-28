import React, { useRef, useEffect, useId, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { FiUsers, FiShare2, FiArrowLeft, FiVideo, FiVideoOff, FiMic, FiMicOff, FiLogOut } from "react-icons/fi";
import { QuickDrawCanvas } from "./TLDrawCanvas";
import { useWebRTC } from "../hooks/useWebRTC";
import { useAuth } from "../context/AuthContext";
import { joinRoomByCode, updateRoomThumbnail } from "../api/rooms";
import { UserAvatar } from "../components/UserAvatar";
import { Toast } from "../components/Toast";

const VideoTile: React.FC<{
  stream: MediaStream;
  label: string;
  isLocal?: boolean;
}> = ({ stream, label, isLocal }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className={`relative h-24 w-36 overflow-hidden rounded-md bg-[#071a2f] shadow-xl sm:h-28 sm:w-44 ${
        isLocal ? "ring-2 ring-[#51a9ff]" : "ring-1 ring-[#315475]"
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover ${isLocal ? "scale-x-[-1]" : ""}`}
      />
      <span className="absolute bottom-1.5 left-1.5 text-[9px] font-semibold bg-black/70 text-white px-2 py-0.5 rounded backdrop-blur">
        {label}
      </span>
    </div>
  );
};

const getParticipantColor = (value: string) => {
  const palette = [
    "#a78bfa",
    "#34d399",
    "#fbbf24",
    "#f472b6",
    "#60a5fa",
    "#fb7185",
    "#22d3ee",
    "#f87171",
  ];

  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  return palette[Math.abs(hash) % palette.length];
};

export const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const activeRoomId = roomId || "default-room";
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [boardConnected, setBoardConnected] = useState(false);
  const [joinState, setJoinState] = useState<"joining" | "ready" | "error">("joining");
  const [joinError, setJoinError] = useState("");
  const [notice, setNotice] = useState<{ message: string; variant: "success" | "error" } | null>(null);

  const generatedId = useId();
  const participantIdRef = React.useRef<string | null>(null);

  if (!participantIdRef.current) {
    const fallbackId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    participantIdRef.current = user?.id
      ? `${user.id}-${fallbackId}`
      : `guest-${generatedId.replace(/:/g, "")}-${fallbackId}`;
  }

  const userId = participantIdRef.current;
  const userName = user?.name || "Guest User";

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    setJoinState("joining");
    setJoinError("");

    void joinRoomByCode(token, activeRoomId)
      .then(() => {
        if (!cancelled) setJoinState("ready");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setJoinError(err instanceof Error ? err.message : "Failed to join room");
        setJoinState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [activeRoomId, token]);

  const {
    localStream,
    peers,
    peerNames,
    peerAvatars,
    socketReady,
    isVideoEnabled,
    isAudioEnabled,
    error: rtcError,
    toggleVideo,
    toggleAudio,
    subscribeBoard,
    sendBoardMessage,
    sendCursor,
  } = useWebRTC({
    roomId: activeRoomId,
    userId,
    token: token || "",
    enabled: joinState === "ready" && Boolean(token),
  });

  const sessionError = joinState === "error" ? joinError : rtcError;

  const remotePeerIds = Array.from(new Set([...Object.keys(peerNames), ...Object.keys(peers)]));
  const participants = [
    { id: userId, label: userName || "You", isYou: true, avatarUrl: user?.avatarUrl },
    ...remotePeerIds.map((peerId) => ({
      id: peerId,
      label: peerNames[peerId] || "Guest",
      isYou: false,
      avatarUrl: peerAvatars[peerId],
    })),
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice({ message: "Room invite link copied.", variant: "success" });
    } catch {
      setNotice({ message: "Could not copy the invite link.", variant: "error" });
    }
  };

  const handleResetBoard = () => {
    window.dispatchEvent(new CustomEvent(`quickdraw-reset:${activeRoomId}`));
  };

  const lastThumbnailRef = useRef("");

  const handleThumbnail = useCallback(
    (dataUrl: string) => {
      if (!token || dataUrl === lastThumbnailRef.current || dataUrl.length > 350_000) return;
      lastThumbnailRef.current = dataUrl;
      void updateRoomThumbnail(token, activeRoomId, dataUrl).catch(() => undefined);
    },
    [token, activeRoomId]
  );

  const handleExit = () => {
    navigate("/dashboard");
  };

  if (joinState === "joining") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071a2f]">
        <Oval
          visible={true}
          height="36"
          width="36"
          color="#ffdc45"
          secondaryColor="#274867"
          strokeWidth={4}
          strokeWidthSecondary={4}
          ariaLabel="joining-room"
        />
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#071a2f] px-6 text-center">
        <p className="text-sm text-[#aebed4]">{sessionError}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="primary-button min-h-9 px-4 text-xs"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#071a2f] font-sans">
      <header className="absolute top-0 left-0 right-0 z-20 flex h-14 items-center border-b border-[#244765] bg-[#061526]/95 px-3 text-white backdrop-blur-md sm:px-5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="shrink-0 rounded-md p-2 text-[#9eafc3] transition hover:bg-white/10 hover:text-white"
            title="Back to Dashboard"
          >
            <FiArrowLeft className="text-lg" />
          </button>
          <span className="truncate text-xs font-semibold text-[#aebed4]">
            Room:{" "}
            <span className="font-mono font-bold text-[#ffdc45]">
              {activeRoomId}
            </span>
          </span>
        </div>
      </header>

      <div className="relative h-full w-full pt-14">
        <div className="pointer-events-none absolute left-2 top-2 z-20 flex max-w-[calc(100%-1rem)] flex-wrap items-center gap-1.5 sm:left-4 sm:top-4 sm:max-w-[45%] sm:gap-2">
          {participants.map((participant) => {
            const color = getParticipantColor(participant.id);
            return (
              <div
                key={participant.id}
                className="flex items-center gap-1.5 rounded-full border border-[#315475] bg-[#071a2f]/90 px-2 py-1 shadow-sm backdrop-blur-sm sm:gap-2 sm:px-2.5 sm:py-1.5"
              >
                <UserAvatar
                  name={participant.label}
                  avatarUrl={participant.avatarUrl}
                  size={18}
                />
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="hidden text-[10px] font-semibold text-[#e5edf6] sm:inline">
                  {participant.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pointer-events-auto absolute right-2 top-2 z-20 flex max-w-[calc(100%-1rem)] flex-wrap items-center justify-end gap-1.5 sm:right-4 sm:top-4 sm:max-w-[55%] sm:gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-[#315475] bg-[#071a2f]/90 px-2 py-1 text-[10px] text-[#c2d0df] backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-xs">
            <span className={`h-2 w-2 rounded-full ${socketReady || boardConnected ? "bg-emerald-400" : "bg-amber-400"}`} />
            <span className="hidden sm:inline">{socketReady || boardConnected ? "Board synced" : "Board syncing"}</span>
            <span className="sm:hidden">{socketReady || boardConnected ? "Synced" : "Syncing"}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-[#315475] bg-[#071a2f]/90 px-2 py-1 text-[10px] text-[#c2d0df] backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-xs">
            <FiUsers className="text-xs text-[#51a9ff]" />
            <span>{Object.keys(peers).length + 1}</span>
          </div>
          <button
            onClick={handleResetBoard}
            className="rounded-md border border-[#315475] bg-[#071a2f]/90 px-2 py-1 text-[10px] font-semibold text-[#d7e1ed] transition backdrop-blur-sm hover:bg-[#123454] sm:px-3.5 sm:py-1.5 sm:text-xs"
          >
            <span className="hidden sm:inline">Reset board</span>
            <span className="sm:hidden">Reset</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 rounded-md bg-[#ffdc45] px-2 py-1 text-[10px] font-bold text-[#102039] transition hover:bg-[#ffe675] sm:gap-1.5 sm:px-3.5 sm:py-1.5 sm:text-xs"
          >
            <FiShare2 className="text-xs" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={handleExit}
            className="hidden items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-300 transition backdrop-blur-sm hover:bg-red-500/20 sm:flex"
            title="Exit room"
          >
            <FiLogOut className="text-xs" />
            <span>Exit</span>
          </button>
        </div>

        <QuickDrawCanvas
          roomId={activeRoomId}
          userId={userId}
          userName={userName}
          connected={socketReady}
          subscribeBoard={subscribeBoard}
          sendBoardMessage={sendBoardMessage}
          sendCursor={sendCursor}
          onConnectionChange={setBoardConnected}
          onThumbnail={handleThumbnail}
        />
      </div>

      <div className="pointer-events-auto absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-6 sm:left-6 sm:translate-x-0 sm:gap-2">
        <button
          onClick={toggleVideo}
          className="flex items-center gap-2 rounded-md border border-[#315475] bg-[#071a2f]/95 px-2.5 py-2 text-xs font-semibold text-[#e5edf6] shadow-lg backdrop-blur-sm transition hover:bg-[#123454] sm:px-3"
          title={isVideoEnabled ? "Video On" : "Video Off"}
        >
          {isVideoEnabled ? <FiVideo className="text-sm" /> : <FiVideoOff className="text-sm" />}
          <span className="hidden sm:inline">{isVideoEnabled ? "Video On" : "Video Off"}</span>
        </button>

        <button
          onClick={toggleAudio}
          className="flex items-center gap-2 rounded-md border border-[#315475] bg-[#071a2f]/95 px-2.5 py-2 text-xs font-semibold text-[#e5edf6] shadow-lg backdrop-blur-sm transition hover:bg-[#123454] sm:px-3"
          title={isAudioEnabled ? "Audio On" : "Audio Off"}
        >
          {isAudioEnabled ? <FiMic className="text-sm" /> : <FiMicOff className="text-sm" />}
          <span className="hidden sm:inline">{isAudioEnabled ? "Audio On" : "Audio Off"}</span>
        </button>

        <button
          onClick={handleExit}
          className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-2.5 py-2 text-xs font-semibold text-red-300 shadow-lg backdrop-blur-sm transition hover:bg-red-500/20 sm:px-3"
          title="Exit room"
        >
          <FiLogOut className="text-sm" />
          <span className="hidden sm:inline">Exit</span>
        </button>
      </div>

      <aside className="pointer-events-auto absolute bottom-20 right-2 z-30 max-h-[38vh] max-w-[calc(100%-1rem)] overflow-y-auto sm:bottom-6 sm:right-6 sm:max-h-[52vh] sm:max-w-[72vw]">
        <div className="flex flex-row-reverse flex-wrap justify-end items-end gap-3">
          {localStream && (
            <VideoTile stream={localStream} label="You" isLocal={true} />
          )}

          {Object.entries(peers).map(([peerId, stream]) => (
            <VideoTile
              key={peerId}
              stream={stream}
              label={peerNames[peerId] || "Guest"}
              isLocal={false}
            />
          ))}
        </div>
      </aside>

      <Toast
        message={notice?.message ?? ""}
        variant={notice?.variant}
        onDismiss={() => setNotice(null)}
      />
    </div>
  );
};

export default RoomPage;
