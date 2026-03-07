import React from 'react';

interface UserAvatarProps {
  name?: string;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarUrl,
  size = 40,
  className = '',
}) => {
  const initial = name?.trim().charAt(0).toUpperCase() || 'U';

  return (
    <div
      className={`rounded-full overflow-hidden bg-[#272147] border border-[#2c2652] flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name || 'Avatar'}
          className="w-full h-full object-contain bg-[#d8d0f0] p-0.5"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="text-white font-bold" style={{ fontSize: Math.max(10, size * 0.38) }}>
          {initial}
        </span>
      )}
    </div>
  );
};

export default UserAvatar;
