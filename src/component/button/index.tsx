import React from "react";
import "./index.css";

type ButtonType = {
  children?: JSX.Element | string;
  onClick?: () => void;
};
const Button: React.FC<ButtonType> = ({ children, onClick }) => {
  return (
    <button className="button" onClick={() => onClick?.()}>
      {children || "Your label"}
    </button>
  );
};

export default Button;
