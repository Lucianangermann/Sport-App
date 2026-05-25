interface Props {
  src: string;
  size?: 'sm' | 'md' | 'lg';
  online?: boolean;
  story?: boolean;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};

export const UserAvatar = ({ src, size = 'md', online, story }: Props) => {
  return (
    <div className="relative inline-block shrink-0">
      <img
        src={src}
        alt=""
        className={`${sizeMap[size]} rounded-full object-cover ${
          story ? 'ring-2 ring-violet-500' : ''
        }`}
      />
      {online && (
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 dark:border-ink-800" />
      )}
    </div>
  );
};
