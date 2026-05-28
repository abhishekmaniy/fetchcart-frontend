import { useResetPasswordMutation } from "@/hooks/useAuthMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters.")
      .max(100, "Password must be less than 100 characters."),
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const getApiErrorMessage = (
  error: unknown,
  fallback = "Password reset failed. Please request a new reset link.",
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

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();

  const navigate = useNavigate();
  const resetPasswordMutation = useResetPasswordMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = form.watch("password");

  const passwordChecks = useMemo(
    () => [
      {
        label: "At least 6 characters",
        isValid: passwordValue.length >= 6,
      },
      {
        label: "Contains a number",
        isValid: /\d/.test(passwordValue),
      },
      {
        label: "Contains a letter",
        isValid: /[a-zA-Z]/.test(passwordValue),
      },
    ],
    [passwordValue],
  );

  const onSubmit = async (values: ResetPasswordValues) => {
    setServerError("");
    setIsSuccess(false);

    if (!token) {
      const message = "Invalid password reset link.";
      setServerError(message);
      toast.error(message);
      return;
    }

    try {
      const data = await resetPasswordMutation.mutateAsync({
        token,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      setIsSuccess(true);

      toast.success(data.message || "Password reset successfully.");

      window.setTimeout(() => {
        navigate("/auth", { replace: true });
      }, 1500);
    } catch (error) {
      const message = getApiErrorMessage(error);

      setServerError(message);
      toast.error(message);
    }
  };

  const isLoading = resetPasswordMutation.isPending;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050812] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.18),transparent_36%)]" />
        <div className="absolute left-1/2 top-[-14rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute bottom-[-16rem] right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-16 left-[-12rem] h-[26rem] w-[26rem] rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      </div>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[620px]"
        >
          <div className="mb-5 flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.045] px-5 py-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Back to login
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-violet-200">
              <ShieldCheck className="size-3.5" />
              Secure reset
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-violet-400/20 bg-[#0b1020]/85 shadow-2xl shadow-violet-950/40 backdrop-blur-2xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-600 via-purple-500 to-cyan-400" />

            <div className="absolute right-[-5rem] top-[-5rem] h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="absolute bottom-[-5rem] left-[-5rem] h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />

            <div className="relative p-6 sm:p-8 md:p-10">
              <div className="mb-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-400 shadow-lg shadow-violet-600/30">
                  <LockKeyhole className="size-7 text-white" />
                </div>

                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-zinc-300">
                    <Sparkles className="size-3.5 text-violet-300" />
                    FetchCart AI account security
                  </div>

                  <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                    Create new password
                  </h1>

                  <p className="mt-3 max-w-md text-sm leading-7 text-zinc-400">
                    Choose a strong password to protect your account and
                    continue your smart shopping journey.
                  </p>
                </div>
              </div>

              {!token && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  Invalid password reset link.
                </div>
              )}

              {isSuccess && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                  Password updated successfully. Redirecting to login...
                </div>
              )}

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <PasswordInput
                  label="New password"
                  placeholder="At least 6 characters"
                  show={showPassword}
                  setShow={setShowPassword}
                  disabled={isLoading || isSuccess}
                  error={form.formState.errors.password?.message}
                  registration={form.register("password")}
                />

                <PasswordInput
                  label="Confirm password"
                  placeholder="Repeat your new password"
                  show={showConfirmPassword}
                  setShow={setShowConfirmPassword}
                  disabled={isLoading || isSuccess}
                  error={form.formState.errors.confirmPassword?.message}
                  registration={form.register("confirmPassword")}
                />

                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                    Password strength
                  </p>

                  <div className="space-y-2">
                    {passwordChecks.map((item) => (
                      <div
                        key={item.label}
                        className={`flex items-center gap-2 text-sm ${
                          item.isValid ? "text-emerald-300" : "text-zinc-500"
                        }`}
                      >
                        <span
                          className={`flex size-5 items-center justify-center rounded-full border ${
                            item.isValid
                              ? "border-emerald-400/30 bg-emerald-500/10"
                              : "border-white/10 bg-white/[0.03]"
                          }`}
                        >
                          {item.isValid && <CheckCircle2 className="size-3" />}
                        </span>
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                {serverError && (
                  <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !token || isSuccess}
                  className="group relative flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-[20px] bg-gradient-to-r from-violet-600 via-purple-500 to-cyan-500 px-6 text-base font-extrabold text-white shadow-lg shadow-violet-600/30 transition hover:scale-[1.01] hover:shadow-violet-600/40 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />

                  <span className="relative inline-flex items-center gap-2 tracking-tight">
                    {isLoading && <Loader2 className="size-4 animate-spin" />}
                    {isLoading
                      ? "Updating password..."
                      : isSuccess
                        ? "Password updated"
                        : "Update password"}
                  </span>
                </button>
              </form>

              <p className="mt-6 text-center text-xs leading-6 text-zinc-500">
                This reset link is time-sensitive. If it expires, request a new
                link from the login page.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

const PasswordInput = ({
  label,
  placeholder,
  show,
  setShow,
  disabled,
  error,
  registration,
}: {
  label: string;
  placeholder: string;
  show: boolean;
  setShow: (value: boolean) => void;
  disabled?: boolean;
  error?: string;
  registration: ReturnType<
    typeof useForm<ResetPasswordValues>
  >["register"] extends (name: any) => infer R
    ? R
    : never;
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-zinc-200">
        {label}
      </span>

      <div
        className={`flex h-14 items-center rounded-2xl border bg-black/30 px-4 transition ${
          error
            ? "border-red-500/40 ring-4 ring-red-500/10"
            : "border-white/10 focus-within:border-violet-400/60 focus-within:ring-4 focus-within:ring-violet-500/10"
        }`}
      >
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          className="h-full flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-60"
          {...registration}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          disabled={disabled}
          className="ml-3 rounded-xl p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>

      {error && (
        <span className="mt-2 block text-xs font-medium text-red-400">
          {error}
        </span>
      )}
    </label>
  );
};

export default ResetPasswordPage;
