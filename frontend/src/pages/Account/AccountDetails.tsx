import { useGetUserInfoQuery } from "../../generated/graphql-types";
import { useState } from "react";
import Menu from "./Menu";
import UserForm from "./UserForm";
import PasswordForm from "./PasswordForm";
import AddressForm from "./AddressForm";

export const AccountDetails = () => {
  const {
    loading,
    error,
    data: userInfo,
  } = useGetUserInfoQuery({
    fetchPolicy: "no-cache",
  });

  const [showUserForm, setShowUserForm] = useState<boolean>(false);
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);

  if (loading) return <p>Loading ...</p>;
  if (error) return <p> Error : {error.message}</p>;
  if (userInfo) {
    const date = new Date(+userInfo.getUserInfo.created_at);
    const formattedCreatedAt = date.toLocaleDateString("fr");
    return (
      <div className="flex w-full p-8 gap-8">
        <Menu
          setShowForms={[
            setShowUserForm,
            setShowPasswordForm,
            setShowAddressForm,
          ]}
        />

        <section className="flex-1 pl-8 space-y-6 text-sm text-gray-800">
          <>
            <section>
              <div className="flex items-center gap-2 font-semibold text-green-900">
                <h2>Mes informations personnelles</h2>
                {!showUserForm ? (
                  <button
                    className="text-xl text-gray-600 hover:text-green-800 cursor-pointer"
                    onClick={() => {
                      setShowUserForm(true);
                      setShowPasswordForm(false);
                      setShowAddressForm(false);
                    }}
                    title="Modifier"
                  >
                    ✎
                  </button>
                ) : (
                  <button
                    className="text-xl text-gray-600 hover:text-red-700 cursor-pointer"
                    onClick={() => setShowUserForm(false)}
                    title="Annuler"
                  >
                    X
                  </button>
                )}
              </div>

              {!showUserForm ? (
                <div className="mt-2 space-y-2">
                  <div>
                    <div className="text-gray-500">Prénom</div>
                    <div>{userInfo.getUserInfo.first_name}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Nom</div>
                    <div>{userInfo.getUserInfo.last_name}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Adresse mail</div>
                    <div>{userInfo.getUserInfo.email}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Numéro de téléphone</div>
                    <div>{userInfo.getUserInfo.phone_number}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Membre depuis le</div>
                    <div>{formattedCreatedAt}</div>
                  </div>
                </div>
              ) : (
                <UserForm
                  setShowUserForm={setShowUserForm}
                  userInfo={userInfo.getUserInfo}
                />
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 font-semibold text-green-900">
                <h2>Modifier mon mot de passe</h2>
                {!showPasswordForm ? (
                  <button
                    onClick={() => {
                      setShowPasswordForm(true);
                      setShowAddressForm(false);
                      setShowUserForm(false);
                    }}
                    className="text-xl text-gray-600 hover:text-green-800 cursor-pointer"
                    title="Modifier"
                  >
                    ✎
                  </button>
                ) : (
                  <button
                    className="text-xl text-gray-600 hover:text-red-700 cursor-pointer"
                    title="Annuler"
                    onClick={() => setShowPasswordForm(false)}
                  >
                    X
                  </button>
                )}
              </div>

              {showPasswordForm && (
                <PasswordForm
                  setShowPasswordForm={setShowPasswordForm}
                />
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 font-semibold text-green-900">
                <h2>Mon adresse de facturation</h2>
                {userInfo.getUserInfo.address && !showAddressForm && (
                  <button
                    onClick={() => {
                      setShowAddressForm(true);
                      setShowPasswordForm(false);
                      setShowUserForm(false);
                    }}
                    className="text-xl text-gray-600 hover:text-green-800 cursor-pointer"
                    title="Modifier l’adresse"
                  >
                    ✎
                  </button>
                )}
                {showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(false)}
                    className="text-xl text-gray-600 hover:text-red-700 cursor-pointer"
                    title="Annuler"
                  >
                    X
                  </button>
                )}
              </div>
              {!userInfo.getUserInfo.address || showAddressForm ? (
                <AddressForm
                  setShowAddressForm={setShowAddressForm}
                  userAddress={userInfo.getUserInfo.address}
                />
              ) : (
                <div className="mt-2 space-y-1">
                  <div>{userInfo.getUserInfo.address.street}</div>
                  <div>
                    {userInfo.getUserInfo.address.zipcode}{" "}
                    {userInfo.getUserInfo.address.city}
                  </div>
                  <div>{userInfo.getUserInfo.address.country}</div>
                </div>
              )}
            </section>
          </>
        </section>
      </div>
    );
  }
};
