import type { PropsWithChildren } from "react"


export const PageLayout = (props: PropsWithChildren) => {
    return (
        <main className="flex justify-center h-screen">
            <div className="border-x border-slate-400 w-full md:max-w-2xl overflow-y-scroll">
                {props.children}
            </div>
        </main>
    );
};


