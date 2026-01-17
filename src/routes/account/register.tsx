import { createFileRoute } from "@tanstack/react-router";
import { useForm, zodResolver } from "@mantine/form";
import { UserSchema, UserSchemaDTO } from "@/schemas/account.schema";
import { useServerFn } from "@tanstack/react-start";
import { addUserServerFn } from "@/server/account.functions";
import {Button, PasswordInput, Stack, TextInput} from "@mantine/core"

export const Route = createFileRoute("/account/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const addUserFn=useServerFn(addUserServerFn)
  const form = useForm<UserSchemaDTO>({
    initialValues: {
      firstname: "",
      lastname: "",
      password: "",
      email: "",
    },
    validate: zodResolver(UserSchema),
  });
  const handleSubmit=async(values:UserSchemaDTO)=>{
    console.log(values);
      await addUserFn({data:{...values}})
      form.reset()
  }
  return <div>
    <form onSubmit={form.onSubmit(handleSubmit)}>
      
      <Stack>
      <TextInput label="Firstname" 
      placeholder="Enter your firstname"
      {...form.getInputProps("firstname")}/>

         <TextInput label="Lastname" 
      placeholder="Enter your lastname"
      {...form.getInputProps("lastname")}/>

               <TextInput label="Email" 
      placeholder="Enter your email"
      {...form.getInputProps("email")}/>

               <PasswordInput label="Password" 
      placeholder="Enter your password"
      {...form.getInputProps("password")}/>
        <Button type="submit" variant="filled">
          Submit
        </Button>
        </Stack>
    </form>
  </div>;
}
