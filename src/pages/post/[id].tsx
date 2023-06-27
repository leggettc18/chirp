import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/layout";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postview";
import { generateSSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const SinglePostPage: NextPage<PageProps> = ({ id }) => {
    const { data, isLoading } = api.posts.getById.useQuery({ id });
    if (isLoading) return <LoadingPage />;
    if (!data) return <div>404</div>;
    return (
        <>
            <Head>
                <title>{`${data.post.content} - @${data.author.username}`}</title>
            </Head>
            <PageLayout>
                <PostView {...data} />
            </PageLayout>
        </>
    );
};


export const getStaticProps = async (context: GetStaticPropsContext<{ id: string }>) => {
    const ssg = generateSSSGHelper();

    const id = context.params?.id;

    if (typeof id !== "string") throw new Error("no post matching that id");

    await ssg.posts.getById.prefetch({ id });

    return {
        props: {
            trpcState: ssg.dehydrate(),
            id,
        },
    };
};

export const getStaticPaths: GetStaticPaths = () => {
    return { paths: [], fallback: "blocking" };
}

export default SinglePostPage;
