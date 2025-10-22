import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PriceRangeSlider } from "./PriceRangeSlider";
import { useRentalDates } from "@/hooks/useRentalDates";
import { toUTCISOString } from "./CategoryCarousel";
import { Input } from "./ui/input";

type tag = {
  id: number;
  label: string;
};

const FormSchema = z.object({
  tags: z.array(z.string()),
  priceRange: z.tuple([z.number(), z.number()]),
  keyword: z.string(),
});

export function ProductFilters({
  tags,
  refetch,
  categoryId,
}: {
  tags: tag[];
  refetch: any;
  categoryId: number;
}) {
  const { startDate, endDate } = useRentalDates();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tags: [],
      priceRange: [0, 50],
      keyword: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (startDate && endDate) {
      refetch({
        minPrice: data.priceRange[0],
        maxPrice: data.priceRange[1],
        tags: data.tags,
        keyword: data.keyword,
        startDate: toUTCISOString(startDate),
        endDate: toUTCISOString(endDate),
      });
    } else {
      refetch({
        categoryId: categoryId,
        minPrice: data.priceRange[0],
        maxPrice: data.priceRange[1],
        keyword: data.keyword,
        tags: data.tags,
      });
    }
  }

  function reset() {
    const defaultValues = {
      tags: [],
      priceRange: [0, 50] as [number, number],
      keyword: "",
    };

    form.reset(defaultValues);

    if (startDate && endDate) {
      refetch({
        categoryId: categoryId,
        minPrice: defaultValues.priceRange[0],
        maxPrice: defaultValues.priceRange[1],
        tags: defaultValues.tags,
        keyword: defaultValues.keyword,
        startDate: toUTCISOString(startDate),
        endDate: toUTCISOString(endDate),
      });
    } else {
      refetch({
        categoryId: categoryId,
        minPrice: defaultValues.priceRange[0],
        maxPrice: defaultValues.priceRange[1],
        tags: defaultValues.tags,
        keyword: defaultValues.keyword,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="keyword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green font-semibold text-lg lg:text-xl mb-3">
                Rechercher un produit:
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Recherche par mot clé..."
                  type=""
                  className="border-green/20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green font-semibold text-lg lg:text-xl mb-3">
                Filtrer par type de produit:
              </FormLabel>
              {tags.map((tag) => {
                const isChecked = field.value?.includes(tag.label);
                return (
                  <FormItem
                    key={tag.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, tag.label])
                            : field.onChange(
                                field.value?.filter(
                                  (value) => value !== tag.label
                                )
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      {tag.label}
                    </FormLabel>
                  </FormItem>
                );
              })}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priceRange"
          render={() => (
            <FormItem>
              <FormLabel className="text-green font-semibold text-lg lg:text-xl mb-3">
                Filtrer par prix:
              </FormLabel>
              <Controller
                control={form.control}
                name="priceRange"
                render={({ field }) => (
                  <PriceRangeSlider
                    onChange={field.onChange}
                    values={field.value}
                  />
                )}
              />
            </FormItem>
          )}
        />
        <div className="flex justify-between w-full gap-5 mt-10">
          <div className="w-1/2">
            <Button
              type="button"
              variant={"outline"}
              className="cursor-pointer w-full text-sm md:text-base"
              onClick={() => reset()}
            >
              Réinitialiser
            </Button>
          </div>
          <div className="w-1/2">
            <Button
              type="submit"
              className="bg-green hover:bg-green/60 cursor-pointer w-full text-sm md:text-base"
            >
              Appliquer
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
