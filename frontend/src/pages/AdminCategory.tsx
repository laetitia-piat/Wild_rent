import CategoryAddForm from "@/components/CategoryAddForm";
import CategoryUpdateForm from "@/components/CategoryUpdateForm";

const AdminCategory = () => {
  return (
    <div>
      <section>
        <h1 className="font-bold text-lg md:text-xl lg:text-2xl mb-4">
          Catégories
        </h1>
        <CategoryAddForm />
      </section>
      <section className="mt-12">
        <h2 className="font-bold text-3xl mb-6">Modifier une catégorie</h2>
        <CategoryUpdateForm />
      </section>
    </div>
  );
};
export default AdminCategory;
