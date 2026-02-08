interface InputScoreProps {
  label: string;
  name: string;
  id: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: number | string;
  type?: string;
}

const InputScore = ({
  label,
  name,
  id,
  onChange,
  value,
  type,
}: InputScoreProps) => {
  return (
    <div className="flex gap-2 justify-between items-center">
      <label htmlFor={id}>{label}</label>
      <input
        className="border border-black rounded-lg px-2 py-0.5 text-right"
        type={type || "number"}
        name={name}
        id={id}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

export default InputScore;
