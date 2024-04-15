import Link from "next/link";
import React, { useState } from "react";

const TermsModal = () => {
  return (
    <div>
      <p className="text-sm">
        I Agree{" "}
        <a
          href="https://abovedigital.io/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-violet-700 hover:underline decoration-1 cursor-pointer">
            Terms and Conditions
          </span>
        </a>
      </p>
    </div>
  );
};

export default TermsModal;
