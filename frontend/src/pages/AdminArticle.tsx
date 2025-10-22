import { useState } from "react";
import { ArticleForm } from "../components/ArticleForm";
import { SearchArticle } from "../components/SearchArticle";

export const AdminArticle = () => {
  const [reload, setReload] = useState<boolean>(false);
  return (
    <>
      <div>
        <section>
          <h2 className="font-bold text-lg md:text-xl lg:text-2xl mb-4">
            Nouvel article
          </h2>
          <ArticleForm
            createOrUpdate="create"
            formId="form-1"
            onAdd={() => {
              setReload(true);
            }}
          />
        </section>
        <section>
          <h2 className="font-bold text-lg md:text-xl lg:text-2xl mb-4">
            Modifier un article
          </h2>
          <SearchArticle isReload={reload} onReload={() => setReload(false)} />
        </section>
      </div>
    </>
  );
};
