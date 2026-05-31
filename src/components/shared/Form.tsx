import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formZodSchema } from "@/interfaces/form";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { cn } from "@/lib/cn";
import { IoReload } from "react-icons/io5";

const Form = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isValid, isSubmitSuccessful, isDirty },
  } = useForm({
    resolver: zodResolver(formZodSchema),
    mode: "onChange",
  });

  watch(() => {
    if (errors.form) {
      clearErrors("form");
    }
  });

  return (
    <form
      className="flex flex-col gap-4 mx-auto w-full max-w-sm p-4 bg-neutral-50 text-neutral-800 border border-neutral-300 rounded-lg"
      onSubmit={handleSubmit(async ({ name }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        switch (name) {
          case "name":
            setError("name", {
              type: "deps",
              message: "El nombre debe ser diferente a 'name'",
            });

          case "error":
            setError("form", {
              type: "deps",
              message: "Error al enviar el formulario",
            });
            break;
        }
      })}
    >
      <div className="flex w-full justify-end">
        <Button size="icon" variant="ghost" onClick={() => reset()}>
          <IoReload
            className={cn(
              "transition-transform duration-500",
              !isSubmitSuccessful && "rotate-360",
            )}
          />
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          Nombre
        </label>
        <Input
          type="text"
          id="name"
          {...register("name", { required: true })}
        />
        <span
          className={cn(
            "text-rose-600 text-sm transition-all",
            isDirty && !errors.name
              ? "opacity-0 -translate-y-1"
              : "opacity-100 translate-y-0",
          )}
        >
          {errors.name?.message}
        </span>
      </div>
      <Button
        type="submit"
        className={cn(
          !!errors.form &&
            "bg-rose-600 opacity-80 pointer-events-none focus:bg-rose-600",
          isSubmitSuccessful &&
            "bg-emerald-600 opacity-80 pointer-events-none focus:bg-emerald-600",
        )}
        disabled={
          isSubmitting || !isValid || !!errors.form || isSubmitSuccessful
        }
      >
        {isSubmitting && "Enviando..."}
        {!!errors.form && "Vuelve a intentarlo"}
        {!isSubmitting && !isSubmitSuccessful && !errors.form && "Enviar"}
        {isSubmitSuccessful && "Enviado"}
      </Button>
    </form>
  );
};

export default Form;
