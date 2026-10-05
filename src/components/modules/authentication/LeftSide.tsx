import DeliveryTrajectory from "@/assets/svg/DeliveryTrajectory";
import Logo from "@/assets/svg/Logo";
import Link from "next/link";
import CheckIcon from "./CheckIcon";

type LeftSideProps = {
    headingTextOne: string;
    headingTextTwo: string;
    descriptionText: string;
};

export default function LeftSide({
    headingTextOne,
    headingTextTwo,
    descriptionText,
}: LeftSideProps) {
    return (
        <div>
            <div className="flex justify-center gap-2 md:justify-start">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-medium group"
                >
                    <div className="flex items-center gap-2">
                        <span className="flex size-9 items-center justify-center rounded-xl text-primary-foreground transition-transform duration-300 group-hover:-rotate-6">
                            <Logo />
                        </span>
                        <span className="font-heading text-lg font-bold tracking-tight text-popover">
                            Parcel<span className="text-chart-2">Flow</span>
                        </span>
                    </div>
                </Link>
            </div>

            <div className="mt-10 flex flex-col gap-4 tracking-tighter">
                <h1 className="text-6xl text-white font-bold font-heading">
                    {headingTextOne}{" "}
                    <span className="text-chart-2">{headingTextTwo}</span>
                </h1>
                <h5 className="text-white/85 font-mono">{descriptionText}</h5>
            </div>

            <div className="mt-6 w-full">
                <DeliveryTrajectory />
            </div>

            <div>
                <div className="flex flex-row gap-2 items-center">
                    <CheckIcon
                        className="size-4 bg-chart-2"
                        iconClassName="size-3 text-black"
                    />
                    <span className="text-white font-medium">
                        bKash checkout & cash on delivery
                    </span>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <CheckIcon
                        className="size-4 bg-chart-2"
                        iconClassName="size-3 text-black"
                    />
                    <span className="text-white font-medium">
                        Upfront pricing, locked at booking
                    </span>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <CheckIcon
                        className="size-4 bg-chart-2"
                        iconClassName="size-3 text-black"
                    />
                    <span className="text-white font-medium">
                        Every status change, tracked live
                    </span>
                </div>
            </div>
        </div>
    );
}
