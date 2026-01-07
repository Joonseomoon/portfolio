import React from "react";

const Home = () => {
    return (
        <div className="flex-1 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100">
            <div className="mx-auto h-full max-w-5xl flex items-center justify-center gap-24 px-6 py-8">
                <img
                    src="/moonv2.svg"
                    alt="Moon image"
                    className="mt-10 w-56 select-none opacity-95 drop-shadow-[0_18px_50px_rgba(165,180,252,0.15)] sm:w-72"
                    draggable={false}
                />
                <div className="flex flex-col items-start">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Hi, I&apos;m{" "}
                        <span className="text-indigo-200 drop-shadow-[0_0_18px_rgba(165,180,252,0.25)]">
                            Joonseo Moon
                        </span>
                    </h1>

                    <h2 className="mt-3 text-lg font-medium text-slate-300 sm:text-xl">
                        Full Stack Developer
                    </h2>
                </div>
            </div>
        </div>
    );
};


export default Home;
