import React from "react";
import "./index.css";

type SwitchType = {
  value?: boolean;
  label?: string;
  onChange?: (val: boolean) => void;
};
const Switch: React.FC<SwitchType> = ({ value=false, label, onChange }) => {
  const [checked, setChecked] = React.useState(value);

  React.useEffect(() => {
    setChecked(value);
  }, [value]);
  return (
    <>
      <div style={{ textAlign: "left" }}>
        <div className="switch-label">{label || "Your label"}</div>
        <label className="switch">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => {
              setChecked((prev) => !prev);
              onChange?.(!checked);
            }}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </>
  );
};

export default Switch;
