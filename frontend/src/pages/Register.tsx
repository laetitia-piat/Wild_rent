import { useForm, SubmitHandler } from "react-hook-form";
import { useRegisterMutation, UserInput } from "../generated/graphql-types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Register = () => {
  const [registerMutation] = useRegisterMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>();
  const onSubmit: SubmitHandler<UserInput> = (data) => {
    registerMutation({
      variables: {
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          email: data.email,
          password: data.password,
        },
      },
      onCompleted: () => {
        toast.success(
          "Consultez vos emails afin de finaliser votre inscription !"
        );
        navigate("/");
      },
      onError: (error) => {
        console.log("error", error);
      },
    });
  };

  const inputRegisterClasses =
    "w-full px-4 py-2 border text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400";

  const labelRegisterClasses = "block text-gray-600 font-semibold mb-1";

  return (
    <div className="flex flex-col flex-1 justify-center items-center py-5 ">
      <div className="bg-white p-8 rounded-lg shadow-md h-full md:h-auto w-full md:w-auto">
        <h2 className="text-2xl font-semibold text-center text-gray-600 mb-4">
          Inscription
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className={labelRegisterClasses}>Prénom</label>
            <input
              defaultValue={"Roman"}
              placeholder="Prénom"
              {...register("first_name", { required: true })}
              className={inputRegisterClasses}
            />
            {errors.first_name && (
              <span className="text-red-500 text-sm">Ce champ est requis</span>
            )}
          </div>

          <div>
            <label className={labelRegisterClasses}>Nom de famille</label>
            <input
              defaultValue={"Beldent"}
              placeholder="Nom de famille"
              {...register("last_name", { required: true })}
              className={inputRegisterClasses}
            />
            {errors.last_name && (
              <span className="text-red-500 text-sm">Ce champ est requis</span>
            )}
          </div>

          <div>
            <label className={labelRegisterClasses}>Email</label>
            <input
              defaultValue={"romanbeldent@gmail.com"}
              placeholder="Email"
              {...register("email", { required: true })}
              className={inputRegisterClasses}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">Ce champ est requis</span>
            )}
          </div>

          <div>
            <label className={labelRegisterClasses}>Numéro de téléphone</label>
            <input
              defaultValue={"0636656565"}
              placeholder="Numéro de téléphone"
              {...register("phone_number", { required: true })}
              className={inputRegisterClasses}
            />
            {errors.phone_number && (
              <span className="text-red-500 text-sm">Ce champ est requis</span>
            )}
          </div>

          <div>
            <label className={labelRegisterClasses}>Mot de passe</label>
            <input
              defaultValue={"password"}
              placeholder="Mot de passe"
              type="password"
              {...register("password", { required: true })}
              className={inputRegisterClasses}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">Ce champ est requis</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-3.5 bg-green shadow-xl text-white py-2 rounded-4xl hover:bg-blue transition duration-300 cursor-pointer"
          >
            S'inscrire
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Vous avez déjà un compte ?{" "}
          <a href="/login" className="text-green font-bold underline">
            Connectez-vous ici
          </a>
        </p>
      </div>
    </div>
  );
};
