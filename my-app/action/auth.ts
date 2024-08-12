"use server";

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/* export const signUp = async (name: string, email: string, password: string) => {
  const isEmailExist = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (isEmailExist) {
    return { error: "Email is already exist" };
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  revalidatePath("/");
}; */

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user?.email) {
    return { error: "Email doesn't exist" };
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    return { error: "Email or password is incorrect" };
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  cookies().set("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 1000000000000,
  });

  redirect("/");
};

export const logout = async () => {
  cookies().delete("token");
  revalidatePath("/");
  redirect("/");
};
