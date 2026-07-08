import ResetPasswordForm from "../_components/ResetPasswordForm";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const token = query.token as string | undefined;

  if (!token) {
    throw new Error("Invalid or missing token");
  }

  return (
    <div
      className="
        min-h-screen flex items-center justify-center p-4
        bg-[url('/images/login-bg.jpg')]
        bg-cover bg-center bg-no-repeat
      "
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* FORM CONTAINER */}
      <div className="relative z-10 w-full flex justify-center">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
