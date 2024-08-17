const CommonButton = ({
  text,
  type,
  onClick,
  disabled,
  confirmButton,
}: {
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  confirmButton?: boolean;
}) => {
  return (
    <>
      <button
        disabled={disabled}
        onClick={onClick}
        type={type}
        className={`inline-flex h-10 items-center rounded-md px-8 text-sm font-medium text-gray-700 shadow transition-colors duration-500 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 ${disabled && "opacity-50"} ${
          confirmButton
            ? "bg-red-500 text-white hover:bg-red-500/80"
            : "bg-white"
        } `}
      >
        {text}
      </button>
    </>
  );
};

export default CommonButton;
