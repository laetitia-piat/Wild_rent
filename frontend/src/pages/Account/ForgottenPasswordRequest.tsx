import {
  ForgottenPasswordRequestInput,
  useForgottenPasswordRequestMutation,
} from "@/generated/graphql-types";
import { Dispatch, JSX, SetStateAction } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type Props = {
  setForgottenPassword?: Dispatch<SetStateAction<boolean>>;
};

function ForgottenPasswordRequest({
  setForgottenPassword,
}: Props): JSX.Element {
  const navigate = useNavigate();
  const [sendResetLink] = useForgottenPasswordRequestMutation();
  const { register, handleSubmit } = useForm<ForgottenPasswordRequestInput>();

  const onSubmit: SubmitHandler<ForgottenPasswordRequestInput> = async (
    data
  ) => {
    await sendResetLink({
      variables: { data },
      onCompleted: () => {
        toast.success(
          "Un email de réinitialisation a été envoyé si un compte est lié à cette adresse."
        );
        navigate("/");
      },
      onError: (error) => {
        console.log("error", error);
      },
    });
  };

  return (
    <div className="flex justify-center items-center h-full bg-gray-100">
      <div className="bg-white p-12 rounded-xl shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Mot de passe oublié
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Adresse email
            </label>
            <input
              type="email"
              placeholder="Entrez votre adresse email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
              required
              {...register("email", { required: true })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green text-white py-2 rounded-2xl hover:bg-blue transition duration-300 cursor-pointer"
          >
            Envoyer le lien de réinitialisation
          </button>
        </form>

        <button
          onClick={() => setForgottenPassword?.(false)}
          className="w-full mt-4 text-gray-600 underline cursor-pointer"
        >
          ← Retour à la connexion
        </button>
      </div>
    </div>
  );
}

export default ForgottenPasswordRequest;
