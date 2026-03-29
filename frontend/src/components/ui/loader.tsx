import classNames from "classnames";
import { useEffect } from "react";

export function PulseLoader({ absolute }: { absolute?: boolean }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  return (
    <div
      className={classNames("inset-0 flex justify-center items-center", {
        absolute: absolute,
      })}
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute size-20 rounded-full border-4 border-[#FC5903] border-t-[#FC5903] border-r-[#FC5903] border-b-transparent border-l-transparent animate-spin"></div>
        <img
          alt="Spirit Dynamics Logo"
          draggable={false}
          src={"/logo.png"}
          width="48"
          height="48"
          className="relative select-none w-12 h-12 object-contain z-10"
        />
      </div>
    </div>
  );
}
