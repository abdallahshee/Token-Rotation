import { createFileRoute } from "@tanstack/react-router";
import { useForm, zodResolver } from "@mantine/form";
import {
  LoginSchema,
  LoginSchemaDTO,
} from "@/schemas/account.schema";
import { useServerFn } from "@tanstack/react-start";
import { userLoginServerFn } from "@/server/account.functions";
import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";

export const Route = createFileRoute("/account/")({
  component: RouteComponent,
});

function RouteComponent() {
  const userLoginFn = useServerFn(userLoginServerFn);
  const form = useForm<LoginSchemaDTO>({
    initialValues: {
      password: "",
      email: "",
    },
    validate: zodResolver(LoginSchema),
  });
  const handleSubmit = async (values: LoginSchemaDTO) => {
    console.log(values);
    await userLoginFn({ data: { ...values } });
    form.reset();
  };
  return (
    <div>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            {...form.getInputProps("password")}
          />
          <Button type="submit" variant="filled">
            Submit
          </Button>
        </Stack>
      </form>
    </div>
  );
}
