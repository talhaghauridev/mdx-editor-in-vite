// src/components/AndroidPreview.tsx
import React from "react";

const AndroidPreview: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="android-frame">
      <div className="screen">{children}</div>
    </div>
  );
};

export default AndroidPreview;
