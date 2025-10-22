import { useEffect, useState } from "react";
import { DragSlider } from "./dragSlider";

type DeleteButtonProps = {
  onSuccess?: () => void;
  style?: React.CSSProperties;
};

export const DeleteButton = ({ onSuccess, style }: DeleteButtonProps) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  useEffect(() => {
    console.log(isConfirm);
  }, [isConfirm]);

  if (!isDeleting) {
    return (
      <div className="">
        <button
          type="button"
          className="bg-red-700 border border-red-700 text-white px-4 py-2 rounded transition hover:bg-white hover:text-red-700 cursor-pointer "
          style={style}
          onClick={() => {
            setIsDeleting(true);
          }}
        >
          Supprimer l'article
        </button>
      </div>
    );
  } else {
    return (
      <div className="flex flex-row items-center">
        {!isConfirm && (
          <button
            type="button"
            className="hover:bg-red-700 border border-red-700 hover:text-white px-4 py-2 rounded transition bg-white text-red-700 cursor-pointer"
            onClick={() => setIsDeleting(false)}
            style={style}
          >
            Cancel
          </button>
        )}
        {isConfirm && (
          <button
            type="button"
            className="hover:bg-red-700 border border-red-700 hover:text-white px-4 py-2 rounded transition bg-white text-red-700 cursor-pointer"
            onClick={() => onSuccess?.()}
            style={style}
          >
            Supprimer
          </button>
        )}
        <div className="ml-5 pt-3">
          <DragSlider
            onChange={(bool) => {
              setIsConfirm(bool);
            }}
            fillColor="#ff0000"
            height={45}
            width={240}
          />
        </div>
      </div>
    );
  }
};
