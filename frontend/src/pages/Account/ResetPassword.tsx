import MessageScreen from "@/components/MessageScreen";
import {
  ResetPasswordInput,
  useGetResetPasswordTokenQuery,
  useResetPasswordMutation,
} from "@/generated/graphql-types";
import { JSX } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

type FormData = {
  token: string;
  new_password: string;
  password_confirmation: string;
};

function ResetPassword(): JSX.Element {
  const [searchParams] = useSearchParams();
  const tokenURL = searchParams.get("token");

  const { data, loading, error } = useGetResetPasswordTokenQuery({
    variables: { token: tokenURL ?? "" },
    skip: !tokenURL,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>();
  const navigate = useNavigate();
  const [resetPassword] = useResetPasswordMutation();

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    if (!tokenURL) return;

    await resetPassword({
      variables: {
        data: {
          token: tokenURL,
          new_password: formData.new_password,
          password_confirmation: formData.password_confirmation,
        },
      },
      onCompleted: () => {
        toast.success("Nouveau mot de passe créé avec succès !");
        navigate("/");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  if (!tokenURL) return <MessageScreen message="Pas de token fourni." />;

  if (loading)
    return (
      <MessageScreen
        message="Vérification du token..."
        buttonLabel="Veuillez patienter"
      />
    );

  if (error || !data?.getResetPasswordToken)
    return <MessageScreen message="Token invalide ou expiré." />;

  return (
    <div className="flex justify-center items-center h-full bg-gray-100">
      <div className="bg-white p-12 rounded-xl shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Réinitialisation du mot de passe
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm text-gray-600">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              {...register("new_password", {
                required: "Ce champ est requis",
                minLength: { value: 8, message: "8 caractères minimum" },
              })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.new_password && (
              <p className="text-red-600 text-sm">
                {errors.new_password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              {...register("password_confirmation", {
                required: "Ce champ est requis",
                validate: (value, { new_password }) =>
                  value === new_password ||
                  "Les mots de passe ne correspondent pas",
              })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.password_confirmation && (
              <p className="text-red-600 text-sm">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green text-white py-2 rounded-2xl hover:bg-blue transition duration-300 cursor-pointer"
          >
            Valider
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
