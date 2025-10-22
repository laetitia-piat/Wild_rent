import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Dispatch, JSX, SetStateAction } from "react";
import {
  ChangePasswordInput,
  useChangePasswordMutation,
} from "@/generated/graphql-types";

type FormData = {
  old_password: string;
  new_password: string;
  password_confirmation: string;
};

type PasswordFormProps = {
  setShowPasswordForm: Dispatch<SetStateAction<boolean>>;
};

function PasswordForm({ setShowPasswordForm }: PasswordFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordInput>();

  const [changePassword] = useChangePasswordMutation();

  const onSubmit: SubmitHandler<ChangePasswordInput> = async (
    data: FormData
  ) => {
    await changePassword({
      variables: { data },
      onCompleted: async () => {
        toast.success("Mot de passe changé avec succès !");
        setShowPasswordForm(false);
      },
      onError: (error) => {
        console.error("error", error);
      },
    });
  };

  return (
    <form className="space-y-4 mt-4 max-w-md" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block text-sm text-gray-600">
          Ancien mot de passe
        </label>
        <input
          type="password"
          {...register("old_password", {
            required: "Ce champ est requis",
          })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.old_password && (
          <p className="text-red-600 text-sm">{errors.old_password.message}</p>
        )}
      </div>

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
          <p className="text-red-600 text-sm">{errors.new_password.message}</p>
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
        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 cursor-pointer"
      >
        Valider
      </button>
    </form>
  );
}

export default PasswordForm;
