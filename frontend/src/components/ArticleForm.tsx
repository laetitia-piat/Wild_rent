import { useEffect, useRef, useState } from "react";
import { FieldError, useForm, useFieldArray } from "react-hook-form";
import {
  useCreateProductMutation,
  useDeleteProductByIdMutation,
  useGetAllCategoriesAndTagsQuery,
  useModifyProductMutation,
} from "../generated/graphql-types";
import { toast } from "react-toastify";
import axios from "axios";
import { ItemCardPreview, ProductType } from "./ItemCardPreview";
import { DeleteButton } from "./ui/deleteButton";

type ProductFormValues = {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  pictures: { url: string }[];
  product_options: { size: string; total_quantity: number }[];
  tag_ids: string[];
};

type tempProductBackend = {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  pictures: { url: string }[];
  product_options: { size: string; total_quantity: number }[];
  tags: {
    id: number;
  }[];
};

type ArticleFormProps = {
  createOrUpdate: "create" | "update";
  // formId permet d’identifier le bon formulaire afin d’afficher l’image dans la bonne instance
  formId: string;
  previewDefault?: boolean;
  productDefault?: ProductFormValues;
  onDelete?: () => void;
  onAdd?: () => void;
};

export const ArticleForm = ({
  createOrUpdate,
  formId,
  previewDefault = false,
  productDefault,
  onDelete,
  onAdd,
}: ArticleFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<ProductFormValues>({
    defaultValues: {
      product_options: [{ size: "", total_quantity: 1 }],
    },
  });
  const { error, loading, data } = useGetAllCategoriesAndTagsQuery();
  const [
    modifyProductMutation,
    { error: errorMutation, loading: loadingMutation },
  ] = useModifyProductMutation();
  const [createProductMutation] = useCreateProductMutation();
  const [modifyProduct, setModifyProduct] = useState(productDefault);
  const [selectedSize, setSelectedSize] = useState<
    { index: number; value: string }[]
  >([{ index: 0, value: "" }]);
  const [isEnable, setIsEnable] = useState(true);
  const [preview, setPreview] = useState(previewDefault);
  const [
    deleteProductByIdMutation,
    { loading: loadingDelete, error: errorDelete },
  ] = useDeleteProductByIdMutation();
  const watchValues = watch();
  const previewProduct: ProductType = {
    id: 0,
    name: watchValues.name,
    price: watchValues.price,
    category: {
      title: "",
    },
    pictures:
      watchValues.pictures && watchValues.pictures.length > 0
        ? watchValues.pictures.map(
            (picture: { url?: string }, index: number) => ({
              id: index,
              url:
                !picture.url || picture.url === ""
                  ? "/assets/images/default-image.webp"
                  : picture.url,
            })
          )
        : [
            {
              id: 0,
              url: "/assets/images/default-image.webp",
            },
          ],
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "product_options",
  });

  const {
    fields: pictureFields,
    append: appendPicture,
    remove: removePicture,
  } = useFieldArray({
    control,
    name: "pictures",
  });

  const getAvailableSizes = (index: number): string[] => {
    const baseSizes = ["S", "M", "L", "XL"];
    const includeUnique = fields.length === 1;
    const sizes = includeUnique ? [...baseSizes, "Taille unique"] : baseSizes;

    return sizes.filter((sizeOption) => {
      for (const sel of selectedSize) {
        if (sel.value === sizeOption && sel.index !== index) {
          return false;
        }
      }
      return true;
    });
  };

  useEffect(() => {
    const foundUnique = selectedSize.find((s) => s.value === "Taille unique");
    setIsEnable(!foundUnique);
  }, [selectedSize]);

  useEffect(() => {
    if (pictureFields.length === 0) {
      appendPicture({ url: "" });
    }
  }, []);

  useEffect(() => {
    if (createOrUpdate === "update" && productDefault) {
      const tagIdsFromTags =
        (productDefault as unknown as tempProductBackend).tags?.map((tag) =>
          tag.id.toString()
        ) || [];

      reset({
        name: productDefault.name,
        description: productDefault.description,
        price: productDefault.price,
        category: productDefault.category,
        pictures: productDefault.pictures?.length
          ? productDefault.pictures
          : [{ url: "" }],
        product_options: productDefault.product_options?.length
          ? productDefault.product_options
          : [{ size: "", total_quantity: 1 }],
        tag_ids: tagIdsFromTags,
      });

      // Initialise selectedSize pour empêcher doublons
      const sizes = productDefault.product_options.map((opt, i) => ({
        index: i,
        value: opt.size,
      }));
      setSelectedSize(sizes);
    }
    setModifyProduct(productDefault);
  }, [productDefault, createOrUpdate, reset]);

  const onSubmit = async (formData: ProductFormValues) => {
    formData.product_options.map(
      (opt: { size: string; total_quantity: any }) => ({
        size: opt.size,
        total_quantity: parseInt(opt.total_quantity),
      })
    );

    if ((formData as any).tags) {
      formData.tag_ids = (formData as any).tags.map((tag: any) =>
        tag.id.toString()
      );
    }

    const input = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price.toString()),
      category: {
        id: parseInt(formData.category),
      },
      pictures: formData.pictures.map(({ url }) => ({ url })),
      product_options: formData.product_options.map(
        ({ size, total_quantity }) => ({
          size,
          total_quantity: parseInt(total_quantity.toString()),
        })
      ),
      tag_ids: formData.tag_ids.map((id) => parseInt(id)),
    };

    if (createOrUpdate === "create") {
      try {
        const result = await createProductMutation({
          variables: { data: input },
        });
        if (result.data) {
          toast.success("Article publié! 💪");
          reset();
          onAdd?.();
        }
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de la publication");
      }
    } else if (createOrUpdate === "update") {
      try {
        const result = await modifyProductMutation({
          variables: { data: { ...input, id: modifyProduct?.id } },
        });

        if (result.data) {
          const newProduct = {
            ...result.data.modifyProductById,
            category: result.data.modifyProductById.category.id.toString(),
            tag_ids: result.data.modifyProductById.tags.map((tag) =>
              tag.id.toString()
            ),
          };
          setModifyProduct(newProduct);
        }

        toast.success("Article modifié! 💪");
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de la modifcation d'un article");
      }
    }
  };

  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const handleResizeTextarea = () => {
    const el = descriptionRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProductByIdMutation({ variables: { id: id } });
      toast.success("🗑️ Article supprimé avec succès !");
      setModifyProduct(undefined);
      setSelectedSize([{ index: 0, value: "" }]);
      reset({
        name: "",
        description: "",
        price: 0,
        category: "",
        pictures: [{ url: "" }],
        product_options: [{ size: "", total_quantity: 1 }],
        tag_ids: [],
      });
      onDelete?.();
    } catch (error) {
      console.error(error);
      toast.error("⚠️ Échec de la suppression");
    }
  };

  if (error) return <p>Error, something went wrong</p>;
  if (loading) return <p>Loading ...</p>;
  if (loadingMutation) return <p>Modification en cours...</p>;
  if (errorMutation) return <p>Erreur : {errorMutation.message}</p>;
  if (loadingDelete) return <p>Loading ...</p>;
  if (errorDelete) return <p>Erreur : {errorDelete.message}</p>;

  return (
    <div className="relative flex justify-between mb-20">
      <div className="w-100 md:w-140">
        <div className="mb-4 hidden lg:block">
          <label className="flex items-center gap-2 font-semibold text-sm">
            Preview
            <span className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preview}
                onChange={() => setPreview(!preview)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-300 peer-checked:bg-green rounded-full transition-colors duration-300"></div>
              <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-6 flex items-center justify-center text-sm">
                {preview ? "👁️‍🗨️" : "❌"}
              </span>
            </span>
          </label>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <div>
            <label htmlFor="name" className="block font-semibold mb-1">
              Titre
            </label>
            <input
              id="name"
              type="text"
              {...register("name", { required: "Le titre est requis" })}
              className="border p-2 rounded w-full bg-white"
            />
            {errors.name && (
              <p className="text-red-500">
                {(errors.name as FieldError).message}
              </p>
            )}
          </div>

          {/* Catégorie */}
          <div>
            <label htmlFor="category" className="block font-semibold mb-1 mt-3">
              Catégorie
            </label>
            <select
              id="category"
              {...register("category", {
                required: "Veuillez sélectionner une catégorie",
              })}
              className="border p-2 rounded w-full bg-white"
            >
              <option value="">-- Sélectionnez une catégorie --</option>
              {data?.getAllCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500">
                {(errors.category as FieldError).message}
              </p>
            )}
          </div>

          {/* Images */}
          <div className="mt-4  ">
            <label className="block font-semibold mb-1">Images</label>

            <div className="grid grid-cols-1 md:grid-cols-2 border rounded-xl p-4 shadow-sm gap-4">
              {pictureFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col items-start gap-2 p-3 rounded"
                >
                  {getValues(`pictures.${index}.url`) ? (
                    <img
                      src={
                        watch(`pictures.${index}.url`) ||
                        "/assets/images/default-image.webp"
                      }
                      alt={`Image ${index}`}
                      className="w-45 h-45 object-cover rounded shadow"
                    />
                  ) : (
                    <div className="flex flex-col items-start gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          document
                            .getElementById(`file-upload-${formId}-${index}`)
                            ?.click()
                        }
                        className="hover:bg-green border-green border-1 hover:text-white px-4 py-2 rounded bg-light-beige text-green transition mt-4 cursor-pointer"
                      >
                        Parcourir une image
                      </button>

                      <input
                        id={`file-upload-${formId}-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (
                          e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          if (e.target.files) {
                            const file = e.target.files[0];

                            if (file.size > 5 * 1024 * 1024) {
                              toast.error(
                                "L'image est trop grande (max. 5MB)."
                              );
                              return;
                            }
                            if (!file.type.startsWith("image/")) {
                              toast.error("Le fichier doit être une image.");
                              return;
                            }

                            // 1. Créer un lien temporaire pour prévisualisation
                            const previewUrl = URL.createObjectURL(file);

                            // 2. Mettre à jour directement dans le form (preview locale)
                            setValue(`pictures.${index}.url`, previewUrl);

                            // 3. Upload réel
                            const formData = new FormData();
                            formData.append("file", file);

                            try {
                              const res = await axios.post("/img", formData);
                              setValue(
                                `pictures.${index}.url`,
                                res.data.filename
                              );
                            } catch (err) {
                              console.error("Erreur upload image:", err);
                              toast.error(
                                "Erreur lors de l'upload de l'image."
                              );
                            }
                          }
                        }}
                      />
                    </div>
                  )}

                  <input
                    type="hidden"
                    {...register(`pictures.${index}.url` as const, {
                      required:
                        '"Une image est obligatoire pour publier un produit"',
                    })}
                  />
                  {errors.pictures && (
                    <p className="text-red-500">
                      Une image est obligatoire pour publier un produit
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => removePicture(index)}
                    className="text-red-500 mt-1 border-1 rounded px-2 py-1 cursor-pointer"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>

            {/* Bouton d'ajout */}
            <button
              type="button"
              onClick={() => appendPicture({ url: "" })}
              className="bg-green border-green border-1 text-white px-4 py-2 rounded hover:bg-light-beige hover:text-green transition mt-4 cursor-pointer"
            >
              Ajouter une image
            </button>
          </div>

          {/* Product Options */}
          <div className="space-y-4 mt-4">
            <label className="block font-semibold mb-1">
              Taille & Quantités
            </label>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center"
              >
                {/* Taille */}
                <div className="flex-1 w-full">
                  <label className="block">Taille</label>
                  <select
                    {...register(`product_options.${index}.size`, {
                      required: "Veuillez sélectionner une taille",
                    })}
                    className="border rounded p-2 w-full bg-white"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const oldSize = selectedSize.find(
                        (size) => size.index === index
                      );

                      if (oldSize) {
                        const newSelectedSize = selectedSize.map((el) =>
                          el.index === index ? { ...el, value: newValue } : el
                        );
                        setSelectedSize(newSelectedSize);
                      } else {
                        setSelectedSize([
                          ...selectedSize,
                          { index, value: newValue },
                        ]);
                      }
                    }}
                  >
                    <option value="">-- Sélectionnez une taille --</option>
                    {getAvailableSizes(index).map((taille, i) => (
                      <option key={i} value={taille}>
                        {taille}
                      </option>
                    ))}
                  </select>
                  {errors.product_options?.[index]?.size && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.product_options?.[index]?.size?.message}
                    </p>
                  )}
                </div>

                {/* Quantité */}
                <div className="flex-1 w-full">
                  <label className="block">Quantité</label>
                  <input
                    type="number"
                    min={1}
                    {...register(`product_options.${index}.total_quantity`, {
                      required: "Quantité requise",
                      min: { value: 1, message: "Minimum 1" },
                    })}
                    className="border rounded p-2 w-full bg-white"
                  />
                  {errors.product_options?.[index]?.total_quantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.product_options[index].total_quantity?.message}
                    </p>
                  )}
                </div>

                {/* Supprimer */}
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      remove(index);
                      setSelectedSize((prev) =>
                        prev.filter((el) => el.index !== index)
                      );
                    }}
                    className="text-red-500 font-bold text-xl cursor-pointer border-2 h-6 w-6 rounded-full transition mt-6 flex items-center justify-center pt-1 hover:animate-pulse"
                    title="Supprimer"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {/* Ajouter une taille */}
            <button
              type="button"
              onClick={() => {
                if (isEnable) {
                  append({ size: "", total_quantity: 1 });
                }
              }}
              className={
                isEnable
                  ? "bg-green border-green border-1 text-white px-4 py-2 rounded hover:bg-light-beige hover:text-green transition mb-3 cursor-pointer"
                  : "bg-gray-300 border-gray-300 text-red-600 cursor-not-allowed px-4 py-2 rounded transition mb-3 border-1"
              }
            >
              Ajouter une taille
            </button>
          </div>

          {/* Tags */}
          <div>
            <fieldset className="block font-semibold mb-1 mt-3 border rounded p-2">
              <legend className="p-2">Tags</legend>
              <div className="flex flex-wrap gap-5">
                {data?.getAllTags.map((tag) => (
                  <div key={tag.id} className="flex gap-2">
                    <input
                      type="checkbox"
                      value={tag.id}
                      id={`tag-${tag.id}`}
                      {...register("tag_ids")}
                    />
                    <label htmlFor={`tag-${tag.id}`}>{tag.label}</label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Prix */}
          <div>
            <label htmlFor="price" className="block font-semibold mb-1 mt-3">
              Prix (€)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min={0}
              {...register("price", {
                required: "Le prix est requis",
                min: { value: 0, message: "Le prix ne peut pas être négatif" },
              })}
              className="border p-2 rounded w-full bg-white"
            />
            {errors.price && (
              <p className="text-red-500">
                {(errors.price as FieldError).message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block font-semibold mb-1 mt-3"
            >
              Description (max 450 caractères)
            </label>
            <textarea
              id="description"
              {...register("description", {
                required: "La description est requise",
                maxLength: {
                  value: 450,
                  message: "La description ne doit pas dépasser 450 caractères",
                },
              })}
              className="border p-2 rounded w-full overflow-hidden resize-none bg-white"
              maxLength={450}
              onInput={handleResizeTextarea}
              ref={(e) => {
                register("description").ref(e);
                descriptionRef.current = e;
              }}
            />
            {errors.description && (
              <p className="text-red-500">
                {(errors.description as FieldError).message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-green border-green border-1 text-white px-4 py-2 rounded hover:bg-light-beige hover:text-green transition mt-4 cursor-pointer"
          >
            Envoyer
          </button>
          {createOrUpdate === "update" && (
            <DeleteButton
              style={{ marginTop: "1rem" }}
              onSuccess={() => {
                if (modifyProduct && modifyProduct.id) {
                  handleDelete(modifyProduct.id);
                }
              }}
            />
          )}
        </form>
      </div>

      {preview && (
        <div className="hidden lg:block w-2xl relative">
          <div
            className="sticky top-[calc(50vh-150px)] "
            style={{ height: 300 }}
          >
            <div className="bg-gray-100 w-[400px] rounded shadow p-1">
              <ItemCardPreview product={previewProduct} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
