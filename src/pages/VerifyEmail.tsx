import { useVerifyEmailMutation } from "@/hooks/useAuthMutations";
import { setAccessToken } from "@/lib/api";
import { useAppStore } from "@/store/app.store";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  MailCheck,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

type VerificationStatus = "loading" | "success" | "error";

const getApiErrorMessage = (
  error: unknown,
  fallback = "Email verification failed. Please login again."
) => {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const VerifyEmail = () => {
  const { userId, token } = useParams<{
    userId: string;
    token: string;
  }>();

  const navigate = useNavigate();

  const refreshCurrentUser = useAppStore((state) => state.refreshCurrentUser);
  const logout = useAppStore((state) => state.logout);

  const verifyEmailMutation = useVerifyEmailMutation();

  const hasRunRef = useRef(false);

  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [message, setMessage] = useState(
    "Please wait while we verify your email address."
  );

  useEffect(() => {
    const handleVerifyEmail = async () => {
      if (hasRunRef.current) return;

      hasRunRef.current = true;

      if (!userId || !token) {
        const errorMessage = "Invalid verification link.";

        setStatus("error");
        setMessage(errorMessage);
        toast.error(errorMessage);

        window.setTimeout(() => {
          navigate("/auth", { replace: true });
        }, 2200);

        return;
      }

      try {
        setStatus("loading");
        setMessage("Securing your account and verifying your email...");

        const data = await verifyEmailMutation.mutateAsync({
          userId,
          token,
        });

        if (!data.accessToken) {
          throw new Error("Access token missing from verification response.");
        }

        setAccessToken(data.accessToken);

        try {
          await refreshCurrentUser();
        } catch (refreshError) {
          console.error("VERIFY_EMAIL_REFRESH_USER_ERROR", refreshError);
        }

        const successMessage =
          data.message || "Email verified successfully.";

        setStatus("success");
        setMessage("Your email has been verified. Redirecting you now...");

        toast.success(successMessage);

        window.setTimeout(() => {
          navigate("/search", { replace: true });
        }, 1400);
      } catch (error) {
        console.error("VERIFY_EMAIL_PAGE_ERROR", error);

        logout();

        const errorMessage = getApiErrorMessage(
          error,
          "Verification failed. Please login again to receive a new verification link."
        );

        setStatus("error");
        setMessage(errorMessage);

        toast.error(errorMessage);

        window.setTimeout(() => {
          navigate("/auth", { replace: true });
        }, 2600);
      }
    };

    handleVerifyEmail();
  }, [
    userId,
    token,
    navigate,
    logout,
    refreshCurrentUser,
    verifyEmailMutation,
  ]);

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <main className="min-h-screen overflow-hidden bg-[#050812] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-12rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="absolute bottom-[-14rem] right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-20 left-[-10rem] h-[24rem] w-[24rem] rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-xl rounded-[2rem] border border-violet-400/20 bg-white/[0.06] p-6 shadow-2xl shadow-violet-950/40 backdrop-blur-2xl sm:p-8"
        >
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-400 shadow-lg shadow-violet-600/30">
                <MailCheck className="size-5 text-white" />
              </span>

              <span className="text-xl font-bold tracking-tight">
                FetchCart <span className="text-violet-300">AI</span>
              </span>
            </Link>

            <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200">
              Email Security
            </span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div
              className={`mb-6 flex size-20 items-center justify-center rounded-3xl border ${
                isLoading
                  ? "border-violet-400/30 bg-violet-500/10 text-violet-200"
                  : isSuccess
                    ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                    : "border-red-400/30 bg-red-500/10 text-red-300"
              }`}
            >
              {isLoading && <Loader2 className="size-9 animate-spin" />}
              {isSuccess && <CheckCircle2 className="size-9" />}
              {isError && <AlertTriangle className="size-9" />}
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              {isLoading && "Verifying your email"}
              {isSuccess && "Email verified"}
              {isError && "Verification failed"}
            </h1>

            <p className="mt-4 max-w-md text-sm leading-7 text-zinc-300 sm:text-base">
              {message}
            </p>

            <div className="mt-8 w-full rounded-3xl border border-white/10 bg-black/20 p-5 text-left">
              <div className="flex items-start gap-3">
                <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-200">
                  <ShieldCheck className="size-5" />
                </span>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Secure verification
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    We validate your unique email token before activating your
                    account. Never share this link with anyone.
                  </p>
                </div>
              </div>
            </div>

            {isError && (
              <Link
                to="/auth"
                className="mt-7 inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition hover:scale-[1.02]"
              >
                Go to login
              </Link>
            )}
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default VerifyEmail;