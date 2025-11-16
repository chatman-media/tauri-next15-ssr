interface RoundedButtonProps {
  onClick: () => void;
  title: string;
}

export const RoundedButton: React.FC<RoundedButtonProps> = ({
  onClick,
  title,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="m-4 flex h-10 max-w-xs cursor-pointer items-center justify-center rounded-full border border-solid border-black/08 px-4 text-sm text-inherit transition-colors hover:border-transparent hover:bg-[#f2f2f2] focus:border-blue-600 focus:text-blue-600 active:border-blue-600 active:text-blue-600 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base"
  >
    {title}
  </button>
);
