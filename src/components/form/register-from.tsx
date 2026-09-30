import Link from "next/link";
import GoogleLoginComponent from "../modules/authentication/GoogleLogin";

export default function RegisterForm() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold font-heading tracking-tight text-secondary">
          Create your merchant account
        </h1>
        <p className="text-balance text-sm text-secondary/80">
          Already have an account? <Link href={"/login"} className="text-chart-3 font-bold font-heading underline hover:underline">Log in</Link>
        </p>
      </div>

      <GoogleLoginComponent />
    </div>
  );
}
