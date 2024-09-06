import * as Yup from "yup"

export const signupSchema = Yup.object({
    name: Yup.string().min(2,"Name should be atleast 2 characters").required("Name is required"),
    email: Yup.string().email("Enter valid email").required("Email is required"),
    password: Yup.string().min(6,"Password should be atleast 6 characters").required("Password is required")
  });