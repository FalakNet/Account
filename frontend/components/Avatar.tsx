import Avatar from 'boring-avatars';

// Falak.io brand colors for avatars
const AVATAR_COLORS = ['#3006A3', '#C27586', '#ffffff', '#6d28d9', '#ec7d95'];

export interface AvatarProps {
  email: string;
  size?: number;
  variant?: 'marble' | 'beam' | 'pixel' | 'sunset' | 'ring' | 'bauhaus';
  className?: string;
}

export const BoringAvatar = ({ 
  email, 
  size = 40, 
  variant = 'marble',
  className = ''
}: AvatarProps) => {
  return (
    <div className={`rounded-full overflow-hidden ${className}`}>
      <Avatar
        size={size}
        name={email}
        variant={variant}
        colors={AVATAR_COLORS}
      />
    </div>
  );
};

// Generate avatar URL for use in img tags or external services
export const getAvatarUrl = (
  email: string, 
  size: number = 40, 
  variant: string = 'marble'
): string => {
  const colors = AVATAR_COLORS.map(color => color.replace('#', '')).join(',');
  return `https://source.boringavatars.com/${variant}/${size}/${encodeURIComponent(email)}?colors=${colors}`;
};

// Get initials fallback for when avatar fails to load
export const getInitials = (name: string | null | undefined): string => {
  if (!name) return 'U';
  
  const names = name.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// Avatar component with fallback to initials
export const UserAvatar = ({ 
  email, 
  displayName, 
  size = 40, 
  variant = 'marble',
  className = ''
}: AvatarProps & { displayName?: string | null }) => {
  const initials = getInitials(displayName);
  
  return (
    <div 
      className={`relative rounded-full bg-gradient-to-br from-primary-900 to-secondary-500 flex items-center justify-center text-white font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      <div className="absolute inset-0">
        <BoringAvatar 
          email={email} 
          size={size} 
          variant={variant}
          className="w-full h-full"
        />
      </div>
      <div className="relative z-10 opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-50 rounded-full w-full h-full flex items-center justify-center">
        {initials}
      </div>
    </div>
  );
};
