import z from "zod"

export const UserSchema=z.object({
    firstname:z.string().nonempty(),
    lastname:z.string().nonempty(),
    email:z.string().nonempty(),
    password:z.string().nonempty()
})

export const LoginSchema=z.object({
    email:z.string().nonempty(),
    password:z.string().nonempty()
})

export type UserSchemaDTO=z.infer<typeof UserSchema>
export type LoginSchemaDTO=z.infer<typeof LoginSchema>