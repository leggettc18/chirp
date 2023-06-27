import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { LoadingPage } from "~/components/loading";
import { api } from "~/utils/api";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const ProfilePage: NextPage<PageProps> = ({ username }) => {
    const { data, isLoading } = api.profile.getUserByUsername.useQuery({ username });
    if (isLoading) return <LoadingPage />;
    if (!data) return <div>404</div>;
    return (
        <>
            <Head>
                <title>{data.username}</title>
            </Head>
            <PageLayout>
                <div className="border-slate-400 bg-slate-600 relative h-36">
                    <Image
                        src={data.profileImageUrl}
                        alt={`${data.username ?? ""}'s profile pic`}
                        width={128}
                        height={128}
                        className="-mb-[64px] absolute bottom-0 left-0 ml-4 rounded-full border-4 border-black bg-black"
                    />
                </div>
                <div className="h-[64px]"></div>
                <div className="p-4 text-2xl font-bold">
                    {`@${data.username ?? ""}`}
                </div>
                <div className="border-b border-slate-400 w-full"></div>
            </PageLayout>
        </>
    );
};

import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { PageLayout } from "~/components/layout";
import Image from "next/image";

export const getStaticProps = async (context: GetStaticPropsContext<{ slug: string }>) => {
    const ssg = createServerSideHelpers({
        router: appRouter,
        ctx: { prisma, userId: null },
        transformer: superjson,
    });

    const slug = context.params?.slug;

    if (typeof slug !== "string") throw new Error("no slug");

    const username = slug.replace("@", "");

    await ssg.profile.getUserByUsername.prefetch({ username });

    return {
        props: {
            trpcState: ssg.dehydrate(),
            username,
        },
    };
};

export const getStaticPaths: GetStaticPaths = () => {
    return { paths: [], fallback: "blocking" };
}

export default ProfilePage;
