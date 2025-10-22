import {
  useGetOrdersByUserIdQuery,
  useWhoamiQuery,
} from "@/generated/graphql-types";

const AccountOrder = () => {
  const { data: userInfo } = useWhoamiQuery();
  const userId = userInfo?.whoami?.id;
  const { loading, error, data } = useGetOrdersByUserIdQuery({
    variables: { id: userId! },
    skip: !userId,
  });

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error</p>;
  return (
    <>
      <div className="w-full overflow-x-auto p-5">
        <table className="min-w-[800px] sm:min-w-full table-auto border-collapse shadow-md bg-white rounded-lg">
          <thead className="bg-gray-100 text-left text-sm text-gray-700 hidden md:table-header-group">
            <tr>
              <th className="px-4 py-3">N°</th>
              <th className="px-4 py-3">Produits</th>
              <th className="px-4 py-3 hidden md:table-cell">Location</th>
              <th className="px-4 py-3">Prix total</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 hidden md:table-cell">Commandé le</th>
            </tr>
          </thead>
          <tbody>
            {data?.getOrdersByUserId?.map((order, idx) => (
              <>
                {/* Mobile view */}
                <tr
                  key={`mobile-${idx}`}
                  className="md:hidden border-b border-gray-200"
                >
                  <td colSpan={8} className="p-4">
                    <details className="w-full">
                      <summary className="cursor-pointer font-medium text-sm flex justify-between items-center">
                        <span>#{order.id}</span>
                        <span className="text-gray-500 text-xs">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </summary>
                      <div className="mt-3 space-y-2 text-sm text-gray-700">
                        <div>
                          <strong>Produits :</strong>
                          {order.products_in_order.map((item, i) => (
                            <div key={i}>
                              {item.quantity}× {item.productOption.product.name}{" "}
                              ({item.productOption.size})
                            </div>
                          ))}
                        </div>
                        <div>
                          <strong>Location :</strong>
                          <br />
                          Début :{" "}
                          {new Date(
                            order.rental_start_date
                          ).toLocaleDateString()}
                          <br />
                          Fin :{" "}
                          {new Date(order.rental_end_date).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Statut :</strong> {order.status}
                        </div>
                        <div>
                          <strong>Prix total :</strong>{" "}
                          <span className="text-green-600 font-semibold">
                            {order.total_price.toFixed(2)} €
                          </span>
                        </div>
                      </div>
                    </details>
                  </td>
                </tr>

                {/* Desktop view */}
                <tr
                  key={`desktop-${idx}`}
                  className="hidden md:table-row border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm">{order.id}</td>
                  <td className="px-4 py-3 text-sm">
                    {order.products_in_order.map((item, i) => (
                      <div key={i} className="mb-1">
                        {item.quantity}× {item.productOption.product.name} (
                        {item.productOption.size})
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">
                    <div>
                      <strong>Début : </strong>
                      {new Date(order.rental_start_date).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Fin : </strong>
                      {new Date(order.rental_end_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">
                    {order.total_price.toFixed(2)} €
                  </td>
                  <td className="px-4 py-3 text-sm uppercase">
                    {order.status}
                  </td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AccountOrder;
