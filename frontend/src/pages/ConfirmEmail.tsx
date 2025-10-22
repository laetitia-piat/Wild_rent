import { useNavigate, useParams } from "react-router-dom";
import { useConfirmEmailMutation } from "../generated/graphql-types";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";

const ConfirmEmailPage = () => {
  type Input = {
    code: string;
  };

  const [confirmEmail] = useConfirmEmailMutation();
  const navigate = useNavigate();
  const { code } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>();
  const onSubmit: SubmitHandler<Input> = (data) => {
    confirmEmail({
      variables: { codeByUser: data.code },
      onCompleted: () => {
        navigate("/");
        toast.success("Votre compte a été créé avec succès !");
      },
      onError: () => {
        toast.error("Vous avez entré un mauvais code");
      },
    });
  };

  return (
    <>
      <h2 className="text-2xl pt-10 font-semibold text-center text-gray-600 mb-4">
        Cliquez sur le bouton ci-dessous pour créer votre compte Wild Rent !
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <input
          defaultValue={code}
          type="hidden"
          {...register("code", { required: true })}
        />
        {errors.code && <span>This field is required</span>}
        <button
          type="submit"
          className="w-100 mb-10 mt-3.5 bg-green shadow-xl text-white py-2 rounded-4xl hover:bg-blue transition duration-300 cursor-pointer"
        >
          {" "}
          Créer votre compte
        </button>
      </form>
    </>
  );
};

export default ConfirmEmailPage;
