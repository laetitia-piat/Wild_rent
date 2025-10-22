import {
  CreateOrUpdateAddressInput,
  useCreateOrUpdateAddressMutation,
  useWhoamiQuery,
} from "@/generated/graphql-types";
import { GET_USER_INFO } from "@/graphql/queries";
import { client } from "@/main";
import { Dispatch, JSX, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type AddressFormProps = {
  userAddress?: {
    street: string;
    zipcode: string;
    city: string;
    country: string;
  } | null;
  setShowAddressForm: Dispatch<SetStateAction<boolean>>;
};

function AddressForm({
  userAddress,
  setShowAddressForm,
}: AddressFormProps): JSX.Element {
  const whoami = useWhoamiQuery();
  const userId = whoami.data?.whoami?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrUpdateAddressInput>({
    defaultValues: {
      street: userAddress?.street || "",
      zipcode: userAddress?.zipcode || "",
      city: userAddress?.city || "",
      country: userAddress?.country || "",
    },
  });

  const [createOrUpdateAddress] = useCreateOrUpdateAddressMutation();

  const onSubmit: SubmitHandler<CreateOrUpdateAddressInput> = async (data) => {
    await createOrUpdateAddress({
      variables: {
        data: {
          userId: userId,
          street: data.street,
          city: data.city,
          zipcode: data.zipcode,
          country: data.country,
        },
      },
      onCompleted: async () => {
        toast.success(
          "Votre adresse de facturation a été enregistrée avec succès."
        );
        await client.refetchQueries({ include: [GET_USER_INFO] });
        setShowAddressForm(false);
      },
      onError: (error) => {
        console.error("error", error);
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 mt-4 max-w-md"
    >
      <div>
        <label className="block text-sm text-gray-600">Rue</label>
        <input
          type="text"
          {...register("street", { required: true })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.street && (
          <span className="text-red-500 text-sm">Ce champ est requis</span>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-600">Ville</label>
        <input
          type="text"
          {...register("city", { required: true })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.city && (
          <span className="text-red-500 text-sm">Ce champ est requis</span>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-600">Code postal</label>
        <input
          type="text"
          {...register("zipcode", { required: true,  minLength: 5, pattern: /^\d{5}$/ })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.zipcode && (
          <span className="text-red-500 text-sm">Veuillez rentrer un code postal valide (ex. : 75011)</span>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-600">Pays</label>
        <input
          type="text"
          {...register("country", { required: true })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.country && (
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

export default AddressForm;
