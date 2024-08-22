import React from "react";
import { stateColors } from "./utils";

const Footer = () => {
  return (
    <div
      className="mt-3"
      style={{
        color: stateColors.zero,
        fontSize: "15px",
        borderTop: "1px solid #e7e7e7",
        padding: "10px",
        marginTop: "auto",
      }}
    >
      ErasmusFinder 2024: ErasmusFinder is an independent platform dedicated to
      connecting students and professionals with study and work opportunities
      abroad. We are not affiliated and have no relationship with the European
      Commission's Erasmus+ programme or other trademarks under the Erasmus
      name.
    </div>
  );
};

export default Footer;
