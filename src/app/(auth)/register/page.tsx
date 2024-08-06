"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { Edit3, LoaderIcon } from "lucide-react";
import axios from "axios";
import Dropzone from "react-dropzone";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

const Registerpage = () => {
  const router = useRouter();
  const [values, setValues] = useState({ picture: null });
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const onDrop = async (acceptedFiles: any) => {
    setUploading(true);
    setValues({ picture: acceptedFiles[0] });

    const data = new FormData();
    data.append("file", acceptedFiles[0]);
    data.append("upload_preset", "eduzone");
    data.append("cloud_name", "ddcpocb6l");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/ddcpocb6l/image/upload",
        {
          method: "POST",
          body: data,
        },
      );

      const responseData = await response.json();
      setImageUrl(responseData?.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const signupSchema = z
    .object({
      fullname: z.string().min(3, {
        message: "Please enter your name!",
      }),
      username: z.string().min(3, {
        message: "Please enter your username!",
      }),
      email: z.string().email(),
      password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
      }),
      cpassword: z.string().min(8, {
        message: "Password must be at least 8 characters.",
      }),
      profession: z.string().min(2, {
        message: "Profession must be at least 2 characters.",
      }),
    })
    .refine((data) => data.password === data.cpassword, {
      message: "Confirm Password and Password must be the same",
      path: ["cpassword", "password"],
    });

  type SignupSchema = z.infer<typeof signupSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupSchema) => {
    try {
      console.log("Form data: ", data);
      const response = await axios.post("http://localhost:3001/register", {
        fullName: data.fullname,
        userName: data.username,
        email: data.email,
        password: data.password,
        occupation: data.profession,
        picturePath: imageUrl,
        todos: [],
      });

      console.log("Response:", response);

      if (response.status === 201) {
        console.log("User registered: ", response);
        reset();
        toast.success("User registered successfully!");
        router.push("/");
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col sm:flex-row">
      <div className="flex w-full flex-col items-center justify-center gap-2 bg-gray-100 p-10 sm:w-1/2">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white">
                NX
              </span>
              <span className="text-3xl font-bold text-gray-400">NexTask</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Empowering Your Every Task with NexTask!
            </p>
          </div>
        </div>
        <form
          action=""
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6"
        >
          <Input
            type="text"
            placeholder="Your Full Name"
            {...register("fullname")}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none"
          />
          {errors.fullname && <p>{`${errors.fullname.message}`}</p>}
          <Input
            type="text"
            placeholder="Your username"
            {...register("username")}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none"
          />
          {errors.username && <p>{`${errors.username.message}`}</p>}
          <Input
            type="email"
            placeholder="Your email address"
            {...register("email")}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none"
          />
          {errors.email && <p>{`${errors.email.message}`}</p>}
          <Input
            type="password"
            placeholder="Your password"
            {...register("password")}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none"
          />
          {errors.password && <p>{`${errors.password.message}`}</p>}
          <Input
            type="password"
            placeholder="Your Confirm password"
            {...register("cpassword")}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none"
          />
          {errors.cpassword && <p>{`${errors.cpassword.message}`}</p>}
          <Input
            type="text"
            placeholder="Your profession name"
            {...register("profession")}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none"
          />
          {errors.profession && <p>{`${errors.profession.message}`}</p>}
          <Dropzone onDrop={onDrop} disabled={uploading}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="border-2 border-dashed p-5">
                {uploading ? (
                  <div className="flex flex-row items-center justify-center gap-2">
                    <LoaderIcon className="animate-spin" />
                    <span>Uploading....</span>
                  </div>
                ) : !values.picture ? (
                  <>
                    <Input {...getInputProps()} />
                    <p>Add picture here</p>
                  </>
                ) : (
                  <div className="flex flex-row items-center justify-between px-5">
                    <h1>{values.picture.name}</h1>
                    <Edit3 />
                  </div>
                )}
              </div>
            )}
          </Dropzone>
          <Button
            disabled={isSubmitting}
            variant="secondary"
            type="submit"
            className="w-full rounded-md bg-blue-500 py-2 transition-all hover:rounded-xl"
          >
            {isSubmitting ? (
              <div className="flex flex-row items-center justify-center gap-2">
                <LoaderIcon className="animate-spin" />
                Signing in.....
              </div>
            ) : (
              <div className="text-white">Signup Now</div>
            )}
          </Button>
        </form>
        <hr />
        <div className="flex flex-row items-center">
          <span>Already have an account?</span>
          <Link href="/">
            <Button variant="link">Signin</Button>
          </Link>
        </div>
      </div>
      <img
        src="/register.jpg"
        alt=""
        className="w-full object-cover sm:w-1/2"
      />
    </main>
  );
};

export default Registerpage;
