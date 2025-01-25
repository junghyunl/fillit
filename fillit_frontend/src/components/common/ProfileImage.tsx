interface ProfileImageProps {
  src: string;
  alt?: string;
  size?: number;
}

const ProfileImage = ({
  src,
  alt = 'profile image',
  size = 42,
}: ProfileImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`h-[${size}px] w-[${size}px] rounded-full object-cover`}
    />
  );
};

export default ProfileImage;
