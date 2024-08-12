"use client";

import { contactUs } from "@/action/contact-us";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { ElementRef, useRef, useTransition } from "react";
import { toast } from "sonner";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { IoIosPin } from "react-icons/io";
import Link from "next/link";

export const ContactUs = () => {
  const [pending, setTransition] = useTransition();
  const formRef = useRef<ElementRef<"form">>(null);

  const onContact = async (formData: FormData) => {
    setTransition(async () => {
      await contactUs(formData)
        .then(() => {
          toast("Send successfully");
          formRef.current?.reset();
        })
        .catch(() => toast("Something went wrong"));
    });
  };

  return (
    <div
      id="contact"
      className="max-w-[80rem] mx-auto md:py-20 pt-0 pb-20 px-3 min-h-screen flex-1"
    >
      <h1 className="md:text-4xl text-3xl font-bold text-center">
        CONTACT <span className="text-green-500">US</span>
      </h1>

      <div className="flex xl:flex-row flex-col items-center gap-12 mt-14">
        <div className="text-center text-xl md:space-y-3 space-y-8">
          <div className="flex md:flex-row flex-col items-center justify-center gap-3">
            <BsFillTelephoneFill />
            <p className="text-green-500 md:text-xl text-base">0961-881-6823</p>
          </div>

          <Link
            href="https://www.facebook.com/people/Modestos-Farm-and-Resort/100090637717825/"
            className="flex md:flex-row flex-col items-center justify-center gap-3"
          >
            <FaFacebook />
            <p className="text-green-500 md:text-xl text-base">
              Modesto&apos;s Farm and Resort
            </p>
          </Link>

          <div className="flex md:flex-row flex-col items-center justify-center gap-3">
            <IoIosPin className="text-3xl" />
            <p className="text-green-500 md:text-xl text-base text-center">
              Brgy. Sitio 2 Sahingan, Balete Batangas City, Philippines
            </p>
          </div>

          <div className="flex md:flex-row flex-col items-center justify-center gap-3">
            <p>@</p>
            <p className="text-green-500 md:text-xl text-base">
              ModestoResort@gmail.com
            </p>
          </div>

          <p className="text-green-500 md:text-xl text-base">
            © Copyright 2024
          </p>
        </div>

        <div className="w-full max-w-[35rem]">
          <form action={onContact} ref={formRef} className="space-y-5">
            <div className="flex md:flex-row flex-col items-center gap-3">
              <Input
                type="text"
                placeholder="Your name"
                name="name"
                className="text-black flex-1"
              />
              <Input
                type="email"
                name="email"
                placeholder="Your@gmail.com"
                className="text-black flex-1"
              />
            </div>

            <div>
              <Textarea
                name="message"
                rows={10}
                placeholder="Your Message..."
                className="text-black"
              />
            </div>

            <div className="w-full">
              <Button
                disabled={pending}
                className="w-full bg-green-500 hover:bg-green-500/80 uppercase"
              >
                {pending ? "Loading..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
