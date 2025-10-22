import { FadeLoader } from "react-spinners";

const Loader = ({ text }: { text?: string }) => {
  return (
    <div>
      <FadeLoader />
      {text ? text : "loading..."}
    </div>
  );
};

export default Loader;
