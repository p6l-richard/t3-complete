import { type NextPage } from "next";
import Head from "next/head";
import { UseCase } from "@prisma/client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Controller } from "react-hook-form";
import { z } from "zod";

import { api } from "~/utils/api";
import { useZodForm } from "~/utils/zod-form";
import { Button } from "~/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/ui/card";
import { Input } from "~/ui/input";
import { Label } from "~/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select";
import { Textarea } from "~/ui/text-area";

// This schema is reused on the backend
export const projectCreateSchema = z.object({
  name: z.string().min(2).max(50),
  bio: z.string().min(50),
  useCase: z.nativeEnum(UseCase),
  authority: z.string().min(10).max(50),
  metrics: z.string().min(10).max(50),
});

const Home: NextPage = () => {
  const { data: session } = useSession();
  const hello = api.hello.useQuery({ text: session?.user.name });
  const methods = useZodForm({
    schema: projectCreateSchema,
  });
  const utils = api.useContext();
  const createProject = api.project.create.useMutation({
    onSettled: async () => {
      await utils.post.invalidate();
      methods.reset();
    },
  });

  const onSubmit = methods.handleSubmit(
    (data) => {
      createProject.mutate(data);
    },
    (e) => {
      console.log("Whoops... something went wrong!");
      console.error(e);
    },
  );

  const useCaseValue = methods.watch("useCase");

  return (
    <>
      <Head>
        <title>Startup Blurb Generator</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[rgb(46,2,109)] to-slate-900">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Startup <span className="text-purple-400">Blurb</span> Generator
          </h1>
          <div className="flex flex-col items-center gap-2">
            <div className="mx-auto max-w-xl space-y-8">
              <form
                action=""
                className="flex flex-col gap-4"
                onSubmit={onSubmit}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>The one-line elevator pitch</CardTitle>
                    <CardDescription>
                      We&apos;ll start out with the most important part of your
                      blurb: The sentence about what you do. If the recipient
                      doesn&apos;t understand what you do—the rest of your blurb
                      is useless.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* NAME */}
                    <Label htmlFor="name">
                      The Name of your project or product
                    </Label>
                    <Input id="name" {...methods.register("name")} />
                    <p className="font-medium text-red-500">
                      {methods.formState.errors?.name?.message}
                    </p>
                    {/*  BIO */}
                    <Label htmlFor="bio">What does your product offer?</Label>
                    <Textarea id="bio" {...methods.register("bio")} />
                    <p className="font-medium text-red-500">
                      {methods.formState.errors?.bio?.message}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={!session}>
                      {!session
                        ? "Generate one-line elevator pitch"
                        : createProject.isLoading
                        ? "Loading..."
                        : "Post"}
                    </Button>
                    <p className="font-medium text-red-500">
                      {createProject.error?.message}
                    </p>
                  </CardFooter>
                </Card>
              </form>
              <form
                action=""
                className="flex flex-col gap-4"
                onSubmit={onSubmit}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Context</CardTitle>
                    <CardDescription>
                      Let&apos;s add some authority to your blurb.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* CONTEXT */}
                    <Label htmlFor="useCase">
                      What is the occasion for reaching out?
                    </Label>
                    <Controller
                      control={methods.control}
                      name="useCase"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your use case" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(UseCase).map(([key, value]) => {
                              const capitalize = (value: string) =>
                                value.substring(0, 1).toLocaleUpperCase() +
                                value.substring(1, value.length).toLowerCase();
                              return (
                                <SelectItem key={key} value={value}>
                                  {capitalize(value)}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      )}
                    />

                    <p className="font-medium text-red-500">
                      {methods.formState.errors?.useCase?.message}
                    </p>
                    {/* AUTHORITY */}
                    <Label htmlFor="authority">
                      What&apos;s impressive about your project?
                    </Label>
                    <Textarea
                      id="authority"
                      {...methods.register("authority")}
                      placeholder={
                        useCaseValue === "RECRUITING"
                          ? `👉 If you're *recruiting*, add authority, e.g. "the team includes people from Facebook," etc.`
                          : useCaseValue === "FUNDRAISING"
                          ? `👉 If you're emailing *investors*, write a line relevant to them, e.g. "three Sequoia-backed companies use your product."`
                          : `write something impressive about your project`
                      }
                    />
                    <p className="font-medium text-red-500">
                      {methods.formState.errors?.authority?.message}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={!session}>
                      {!session
                        ? "Generate one-line elevator pitch"
                        : createProject.isLoading
                        ? "Loading..."
                        : "Post"}
                    </Button>
                    <p className="font-medium text-red-500">
                      {createProject.error?.message}
                    </p>
                  </CardFooter>
                </Card>
              </form>
              <form
                action=""
                className="flex flex-col gap-4"
                onSubmit={onSubmit}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Relevant Metrics/Data</CardTitle>
                    {/* DESCRIPTION */}
                    <div className="text-muted-foreground text-sm">
                      <p className="text-muted-foreground text-sm">
                        This normally gives a strong boost to reply rate. Your
                        data should be very easy to digest.
                      </p>
                      <ul className="text-muted-foreground my-6 ml-6 list-disc text-sm [&>li]:mt-2">
                        <li>How many people use your product / service?</li>
                        <li>
                          At what volume do those people use your product?
                        </li>
                        <li>Any notable people involved?</li>
                      </ul>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/*  METRICS */}
                    <Label htmlFor="metrics">
                      Which metrics stand out right now?
                    </Label>
                    <Textarea
                      id="metrics"
                      {...methods.register("metrics")}
                      placeholder="Data varies from startup to startup. Don't be
                        afraid to share metrics that stand out"
                    />
                    <p className="font-medium text-red-500">
                      {methods.formState.errors?.metrics?.message}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={!session}>
                      {!session
                        ? "Generate one-line elevator pitch"
                        : createProject.isLoading
                        ? "Loading..."
                        : "Post"}
                    </Button>
                    <p className="font-medium text-red-500">
                      {createProject.error?.message}
                    </p>
                  </CardFooter>
                </Card>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
