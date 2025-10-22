import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddUserConfirmationMutation } from "@/generated/graphql-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z
  .object({
    password: z.string().min(1).min(8),
    confirm_password: z.string().min(1).min(8),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"], // attach error to confirm_password field
  });

const ConfirmRegistration = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const navigate = useNavigate();
  const params = useParams();
  const { code } = params;
  const [addUserConfirmationMutation] = useAddUserConfirmationMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await addUserConfirmationMutation({
        variables: {
          randomCode: code || "",
          password: values.confirm_password,
        },
      });
      if (result) {
        toast.success("Enregistrement complété avec succès");
        navigate("/login");
      } else {
        toast.error(
          "Votre enregistrement n'a pas pu être finalisé, veuillez contacter notre service client."
        );
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(
        "Il y a eu une erreur lors de la soumission du formulaire. Veuillez réessayer."
      );
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col items-start m-5 lg:m-10 max-w-3xl">
        <h1 className="font-bold lg:text-lg">
          Créez votre mot de passe pour compléter votre enregistrement:
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-3xl mx-auto py-10 w-full"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 hover:cursor-pointer top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeClosed size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      {" "}
                      <Input
                        placeholder="Confirm your password"
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-2 hover:cursor-pointer top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeClosed size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-green hover:bg-green/70">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ConfirmRegistration;
