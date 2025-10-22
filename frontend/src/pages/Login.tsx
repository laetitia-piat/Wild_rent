import { SubmitHandler, useForm } from "react-hook-form";
import { useLoginMutation } from "../generated/graphql-types";
import { WHO_AM_I } from "../graphql/queries";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { JSX, useState } from "react";
import ForgottenPasswordRequest from "./Account/ForgottenPasswordRequest";

function Login(): JSX.Element {
  const { refetchUser } = useUser();
  const navigate = useNavigate();
  const [login] = useLoginMutation({
    refetchQueries: [{ query: WHO_AM_I }],
    onCompleted() {
      refetchUser({ fetchPolicy: "no-cache" });
      navigate("/");
    },
  });

  const [forgottenPassword, setForgottenPassword] = useState<boolean>(false);

  type LoginData = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    login({
      variables: { data: { email: data.email, password: data.password } },
    });
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      {forgottenPassword ? (
        <ForgottenPasswordRequest setForgottenPassword={setForgottenPassword} />
      ) : (
        <div className="flex justify-center items-center h-full bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md h-full md:h-auto w-full md:w-auto flex justify-center items-center flex-col">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
              Se connecter
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-gray-600">Email</label>
                <input
                  type="email"
                  defaultValue="jonsnow@wild-rent.com"
                  placeholder="Email"
                  {...register("email", { required: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 "
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">Email requis</span>
                )}
              </div>

              <div>
                <label className="block text-gray-600">Mot de passe</label>
                <input
                  type="password"
                  defaultValue="password"
                  placeholder="Mot de passe"
                  {...register("password", { required: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    Mot de passe requis
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-green text-white py-2 rounded-2xl hover:bg-blue transition duration-300 cursor-pointer"
              >
                Se connecter
              </button>
            </form>

            <a
              className="text-green underline font-semibold pt-2 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setForgottenPassword(true);
              }}
            >
              Mot de passe oublié ?
            </a>

            <p className="text-center text-gray-600 mt-4">
              Pas encore de compte ?{" "}
              <a
                href="/enregistrement"
                className="text-green underline font-semibold"
              >
                Inscrivez-vous ici
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
