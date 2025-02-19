"use client";

import clsx from "clsx";
import { ComponentProps, useState } from "react";

export default function Button({
  children,
  className,
  onClick,
  ...props
}: ComponentProps<"button">) {
  const [duration, setDuration] = useState(0);
  return (
    <button
      {...props}
      className={clsx(
        "bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-200 hover:bg-blue-600 disabled:hover:bg-blue-200",
        className
      )}
      onClick={async (event) => {
        const target = event.currentTarget;
        target.disabled = true;
        const start = Date.now();
        setDuration(0);
        const i = setInterval(() => {
          setDuration(Date.now() - start);
        }, 1000);
        try {
          await onClick?.(event);
          clearInterval(i);
          setDuration(Date.now() - start);
        } catch (error) {
          clearInterval(i);
          setDuration(Date.now() - start);
          alert(error);
        }
        target.disabled = false;
      }}
    >
      {children}
      {duration > 0 && (
        <span className="ml-2 text-sm text-blue-900">{duration}ms</span>
      )}
    </button>
  );
}
