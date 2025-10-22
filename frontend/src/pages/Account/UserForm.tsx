import {
  UpdateUserInput,
  useUpdateUserMutation,
  useWhoamiQuery,
} from "@/generated/graphql-types";
import { GET_USER_INFO } from "@/graphql/queries";
import { client } from "@/main";
import { Dispatch, JSX, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type UserFormProps = {
  userInfo: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  setShowUserForm: Dispatch<SetStateAction<boolean>>;
};

function UserForm({ userInfo, setShowUserForm }: UserFormProps): JSX.Element {
  const whoami = useWhoamiQuery();
  const userId = whoami.data?.whoami?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    defaultValues: {
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      email: userInfo.email,
      phone_number: userInfo.phone_number,
    },
  });

  const [updateUser] = useUpdateUserMutation();

  const onSubmit: SubmitHandler<UpdateUserInput> = async (data) => {
    await updateUser({
      variables: {
        data: {
          userId: userId,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.phone_number,
        },
      },
      onCompleted: async () => {
        toast.success(
          "Vos informations personnelles ont été mis à jour avec succès."
        );
        await client.refetchQueries({ include: [GET_USER_INFO] });
        setShowUserForm(false);
      },
      onError: (error) => {
        console.log("error", error);
      },
    });
  };

 return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 max-w-md">
      <div>
        <label className="block text-sm text-gray-600">Prénom</label>
        <input
          type="text"
          {...register("first_name", { required: true })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.first_name && (
          <span className="text-red-500 text-sm">Ce champ est requis</span>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-600">Nom</label>
        <input
          type="text"
          {...register("last_name", { required: true })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.last_name && (
          <span className="text-red-500 text-sm">Ce champ est requis</span>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-600">Adresse mail</label>
        <input
          type="email"
          {...register("email", { required: true })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">Ce champ est requis</span>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-600">Numéro de téléphone</label>
        <input
          type="text"
          {...register("phone_number", { required: true })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.phone_number && (
          <span className="text-red-500 text-sm">Ce champ est requis</span>
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

export default UserForm;
