import { AuthProvider } from "@/constants/auth.enums";
import {
  useForgotPasswordMutation,
  useLoginMutation,
  useRegisterMutation,
} from "@/hooks/useAuthMutations";
import { setAccessToken } from "@/lib/api";
import { useAppStore } from "@/store/app.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BadgePercent,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import {
  useForm,
  type FieldError,
  type UseFormRegisterReturn,
  type UseFormSetError,
} from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

type AuthMode = "login" | "register";

type Message = {
  type: "success" | "error";
  text: string;
} | null;

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name is required.")
      .max(60, "Name must be less than 60 characters."),
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .email("Please enter a valid email address."),
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

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const getRedirectPath = (state: unknown) => {
  if (
    state &&
    typeof state === "object" &&
    "from" in state &&
    state.from &&
    typeof state.from === "object" &&
    "pathname" in state.from &&
    typeof state.from.pathname === "string"
  ) {
    return state.from.pathname;
  }

  return "/search";
};

const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again."
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

const applyApiFieldErrors = <TFormValues extends Record<string, unknown>>(
  error: unknown,
  setError: UseFormSetError<TFormValues>
) => {
  const responseData =
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response
      ? error.response.data
      : null;

  if (!responseData || typeof responseData !== "object") return;

  const fieldErrors =
    "errors" in responseData
      ? responseData.errors
      : "fieldErrors" in responseData
        ? responseData.fieldErrors
        : null;

  if (!fieldErrors || typeof fieldErrors !== "object") return;

  Object.entries(fieldErrors).forEach(([field, value]) => {
    const message = Array.isArray(value)
      ? String(value[0] || "")
      : typeof value === "string"
        ? value
        : "";

    if (!message) return;

    setError(field as Parameters<UseFormSetError<TFormValues>>[0], {
      type: "server",
      message,
    });
  });
};

const AuthPage = () => {
  const [currentMode, setCurrentMode] = useState<AuthMode>("login");

  return (
    <main className="auth-page">
      <Link to="/" className="auth-back-link">
        <ArrowLeft className="size-4" />
      </Link>

      <div className="auth-layout">
        <BrandPanel />

        <section className="auth-right-gradient auth-right-panel">
          <div className="auth-form-wrap">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMode}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {currentMode === "login" ? (
                  <LoginForm onSwitch={() => setCurrentMode("register")} />
                ) : (
                  <RegisterForm onSwitch={() => setCurrentMode("login")} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </main>
  );
};

const BrandPanel = () => {
  const trustItems = [
    { icon: ShieldCheck, text: "Bank-level secure & private" },
    { icon: Zap, text: "Instant AI search across stores" },
    { icon: BadgePercent, text: "Real deals, no fake discounts" },
  ];

  return (
    <section className="auth-left-gradient auth-left-panel">
      <div className="auth-left-inner">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-icon">
            <Sparkles className="size-5" />
          </span>
          FetchCart <span>AI</span>
        </Link>

        <div className="auth-hero-block">
          <h1 className="auth-hero-title">
            Your AI shopping
            <br />
            <span>assistant,</span>
            <br />
            <span>everywhere.</span>
          </h1>

          <p className="auth-hero-text">
            Search any product in plain language. Compare prices across every
            major store. Catch real deals before they&apos;re gone.
          </p>

          <div className="auth-floating-area">
            <FloatingMini
              className="auth-card-one"
              title="Sony WH-1000XM5"
              meta="−18% · AI 9.6"
              rotate="-4deg"
              tone="primary"
            />

            <FloatingMini
              className="auth-card-two"
              title="iPhone 15 Pro"
              meta="₹99,999 · −12%"
              tone="violet"
              rotate="2deg"
            />

            <FloatingMini
              className="auth-card-three"
              title="Nike Pegasus 41"
              meta="4.8★ · 2.4k reviews"
              tone="sky"
              rotate="5deg"
            />
          </div>
        </div>

        <ul className="auth-trust-list">
          {trustItems.map((item) => (
            <li key={item.text}>
              <span>
                <item.icon className="size-5" />
              </span>
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

const FloatingMini = ({
  className = "",
  title,
  meta,
  tone = "primary",
  rotate = "0deg",
}: {
  className?: string;
  title: string;
  meta: string;
  tone?: "primary" | "violet" | "sky";
  rotate?: string;
}) => {
  const imageClass = {
    primary: "from-indigo-500 via-violet-500 to-purple-500",
    violet: "from-violet-400 via-purple-400 to-fuchsia-400",
    sky: "from-sky-400 via-cyan-400 to-blue-500",
  } as const;

  return (
    <div
      className={`auth-floating-card ${className}`}
      style={{ transform: `rotate(${rotate})` }}
    >
      <div
        className={`auth-card-image bg-gradient-to-br ${imageClass[tone]}`}
      />
      <div className="auth-card-title">{title}</div>
      <div className="auth-card-meta">{meta}</div>
    </div>
  );
};

const LoginForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const refreshCurrentUser = useAppStore((state) => state.refreshCurrentUser);
  const logout = useAppStore((state) => state.logout);

  const loginMutation = useLoginMutation();
  const forgotPasswordMutation = useForgotPasswordMutation();

  const [message, setMessage] = useState<Message>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const completeLoginFlow = async (
    accessToken: string,
    successMessage: string
  ) => {
    setAccessToken(accessToken);

    try {
      await refreshCurrentUser();

      toast.success(successMessage);

      const redirectPath = getRedirectPath(location.state);

      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("AUTH_PAGE_REFRESH_USER_ERROR", error);

      logout();

      const errorMessage =
        "Login succeeded, but failed to load your profile. Please try again.";

      setMessage({
        type: "error",
        text: errorMessage,
      });

      form.setError("root.server", {
        type: "server",
        message: errorMessage,
      });

      toast.error(errorMessage);
    }
  };

  const handleForgotPassword = async () => {
    setMessage(null);
    form.clearErrors("root.server");

    const email = form.getValues("email")?.trim();

    if (!email) {
      form.setError("email", {
        type: "manual",
        message: "Please enter your email first.",
      });

      toast.error("Please enter your email first.");
      return;
    }

    const emailValidation = loginSchema.shape.email.safeParse(email);

    if (!emailValidation.success) {
      form.setError("email", {
        type: "manual",
        message: "Please enter a valid email address.",
      });

      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const data = await forgotPasswordMutation.mutateAsync({
        email,
      });

      const successMessage =
        data.message || "Successfully sent link for updating password.";

      toast.success(successMessage);

      setMessage({
        type: "success",
        text: "Password reset link sent. Please check your email.",
      });
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        "Failed to send reset password link. Please try again."
      );

      form.setError("root.server", {
        type: "server",
        message: errorMessage,
      });

      setMessage({
        type: "error",
        text: errorMessage,
      });

      toast.error(errorMessage);
    }
  };

  const submitManual = async (values: LoginFormValues) => {
    setMessage(null);
    form.clearErrors("root.server");

    try {
      const data = await loginMutation.mutateAsync({
        provider: AuthProvider.CREDENTIALS,
        email: values.email.trim(),
        password: values.password,
      });

      if (!data.accessToken) {
        throw new Error("Access token missing from login response.");
      }

      await completeLoginFlow(
        data.accessToken,
        data.message || "Login successful"
      );
    } catch (error) {
      applyApiFieldErrors<LoginFormValues>(error, form.setError);

      const errorMessage = getApiErrorMessage(
        error,
        "Login failed. Try again."
      );

      form.setError("root.server", {
        type: "server",
        message: errorMessage,
      });

      setMessage({
        type: "error",
        text: errorMessage,
      });

      toast.error(errorMessage);
    }
  };

  const submitGoogle = async (googleCredential: CredentialResponse) => {
    setMessage(null);
    form.clearErrors("root.server");

    if (!googleCredential.credential) {
      const errorMessage = "Google login did not return credentials.";

      form.setError("root.server", {
        type: "server",
        message: errorMessage,
      });

      setMessage({ type: "error", text: errorMessage });
      toast.error(errorMessage);

      return;
    }

    try {
      const data = await loginMutation.mutateAsync({
        provider: AuthProvider.GOOGLE,
        idToken: googleCredential.credential,
      });

      if (!data.accessToken) {
        throw new Error("Access token missing from Google login response.");
      }

      await completeLoginFlow(
        data.accessToken,
        data.message || "Google login successful"
      );
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, "Google login failed.");

      form.setError("root.server", {
        type: "server",
        message: errorMessage,
      });

      setMessage({
        type: "error",
        text: errorMessage,
      });

      toast.error(errorMessage);
    }
  };

  const isLoginLoading = loginMutation.isPending;
  const isForgotPasswordLoading = forgotPasswordMutation.isPending;
  const isLoading = isLoginLoading || isForgotPasswordLoading;

  return (
    <div>
      <h2 className="auth-form-title">Welcome back</h2>
      <p className="auth-form-subtitle">
        Sign in to continue your smart shopping journey.
      </p>

      <div className="auth-google-wrap">
        {isLoginLoading ? (
          <button type="button" disabled className="auth-submit-btn">
            <Loader2 className="size-4 animate-spin" />
            Signing in...
          </button>
        ) : (
          <GoogleLogin
            onSuccess={submitGoogle}
            onError={() => {
              const errorMessage = "Google sign-in failed. Please try again.";

              form.setError("root.server", {
                type: "server",
                message: errorMessage,
              });

              setMessage({ type: "error", text: errorMessage });
              toast.error(errorMessage);
            }}
            width="100%"
          />
        )}
      </div>

      <Divider />

      <form onSubmit={form.handleSubmit(submitManual)} className="auth-form">
        <Field
          label="Email"
          type="email"
          placeholder="you@example.com"
          disabled={isLoading}
          registration={form.register("email")}
          error={form.formState.errors.email}
        />

        <PasswordField
          label="Password"
          placeholder="••••••••"
          show={showPassword}
          setShow={setShowPassword}
          disabled={isLoading}
          registration={form.register("password")}
          error={form.formState.errors.password}
          rightLink={
            <button
              type="button"
              className="auth-forgot-link inline-flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleForgotPassword}
              disabled={isLoading}
            >
              {isForgotPasswordLoading && (
                <Loader2 className="size-3.5 animate-spin" />
              )}
              {isForgotPasswordLoading ? "Sending..." : "Forgot password?"}
            </button>
          }
        />

        {(message || form.formState.errors.root?.server?.message) && (
          <MessageBox
            message={{
              type: message?.type || "error",
              text:
                form.formState.errors.root?.server?.message ||
                message?.text ||
                "Login failed. Try again.",
            }}
          />
        )}

        <SubmitButton isLoading={isLoginLoading} disabled={isLoading}>
          Sign in
        </SubmitButton>
      </form>

      <p className="auth-switch-text">
        Don&apos;t have an account?{" "}
        <button type="button" onClick={onSwitch} disabled={isLoading}>
          Create account
        </button>
      </p>
    </div>
  );
};

const RegisterForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const refreshCurrentUser = useAppStore((state) => state.refreshCurrentUser);
  const logout = useAppStore((state) => state.logout);

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  const [message, setMessage] = useState<Message>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const completeGoogleSignupFlow = async (
    accessToken: string,
    successMessage: string
  ) => {
    setAccessToken(accessToken);

    try {
      await refreshCurrentUser();

      toast.success(successMessage);

      const redirectPath = getRedirectPath(location.state);

      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("AUTH_PAGE_REFRESH_USER_ERROR", error);

      logout();

      const errorMessage =
        "Signup succeeded, but failed to load your profile. Please try again.";

      setMessage({
        type: "error",
        text: errorMessage,
      });

      form.setError("root.server", {
        type: "server",
        message: errorMessage,
      });

      toast.error(errorMessage);
    }
  };

  const submitManual = async (values: RegisterFormValues) => {
    setMessage(null);
    form.clearErrors("root.server");

    try {
      const data = await registerMutation.mutateAsync({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      const successMessage =
        data?.message || "Account created. Please sign in.";

      setMessage({
        type: "success",
        text: successMessage,
      });

      toast.success(successMessage);

      form.reset();

      window.setTimeout(() => {
        onSwitch();
      }, 700);
    } catch (error) {
      applyApiFieldErrors<RegisterFormValues>(error, form.setError);

      const errorMessage = getApiErrorMessage(
        error,
        "Signup failed. Try again."
      );

      form.setError("root.server", {
        type: "server",
        message: errorMessage,
      });

      setMessage({
        type: "error",
        text: errorMessage,
      });

      toast.error(errorMessage);
    }
  };

  const submitGoogle = async (googleCredential: CredentialResponse) => {
    setMessage(null);
    form.clearErrors("root.server");

    if (!googleCredential.credential) {
      const errorMessage = "Google signup did not return credentials.";

      form.setError("root.server", {
        type: "server",
        message: errorMessage,
      });

      setMessage({
        type: "error",
        text: errorMessage,
      });

      toast.error(errorMessage);

      return;
    }

    try {
      const data = await loginMutation.mutateAsync({
        provider: AuthProvider.GOOGLE,
        idToken: googleCredential.credential,
      });

      if (!data.accessToken) {
        throw new Error("Access token missing from Google signup response.");
      }

      await completeGoogleSignupFlow(
        data.accessToken,
        data.message || "Google signup successful"
      );
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        "Google signup failed. Please try again."
      );

      form.setError("root.server", {
        type: "server",
        message: errorMessage,
      });

      setMessage({
        type: "error",
        text: errorMessage,
      });

      toast.error(errorMessage);
    }
  };

  const isManualSignupLoading = registerMutation.isPending;
  const isGoogleSignupLoading = loginMutation.isPending;
  const isLoading = isManualSignupLoading || isGoogleSignupLoading;

  return (
    <div>
      <h2 className="auth-form-title">Create your account</h2>
      <p className="auth-form-subtitle">
        Start finding better products in seconds — free forever.
      </p>

      <div className="auth-google-wrap">
        {isGoogleSignupLoading ? (
          <button type="button" disabled className="auth-submit-btn">
            <Loader2 className="size-4 animate-spin" />
            Signing up...
          </button>
        ) : (
          <GoogleLogin
            onSuccess={submitGoogle}
            onError={() => {
              const errorMessage = "Google sign-up failed. Please try again.";

              form.setError("root.server", {
                type: "server",
                message: errorMessage,
              });

              setMessage({
                type: "error",
                text: errorMessage,
              });

              toast.error(errorMessage);
            }}
            width="100%"
          />
        )}
      </div>

      <Divider />

      <form onSubmit={form.handleSubmit(submitManual)} className="auth-form">
        <Field
          label="Full name"
          type="text"
          placeholder="Abhishek Maniyar"
          disabled={isLoading}
          registration={form.register("name")}
          error={form.formState.errors.name}
        />

        <Field
          label="Email"
          type="email"
          placeholder="you@example.com"
          disabled={isLoading}
          registration={form.register("email")}
          error={form.formState.errors.email}
        />

        <PasswordField
          label="Password"
          placeholder="At least 6 characters"
          show={showPassword}
          setShow={setShowPassword}
          disabled={isLoading}
          registration={form.register("password")}
          error={form.formState.errors.password}
        />

        <PasswordField
          label="Confirm password"
          placeholder="Repeat password"
          show={showConfirmPassword}
          setShow={setShowConfirmPassword}
          disabled={isLoading}
          registration={form.register("confirmPassword")}
          error={form.formState.errors.confirmPassword}
        />

        {(message || form.formState.errors.root?.server?.message) && (
          <MessageBox
            message={{
              type: message?.type || "error",
              text:
                form.formState.errors.root?.server?.message ||
                message?.text ||
                "Signup failed. Try again.",
            }}
          />
        )}

        <SubmitButton isLoading={isManualSignupLoading} disabled={isLoading}>
          Create account
        </SubmitButton>
      </form>

      <p className="auth-switch-text">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} disabled={isLoading}>
          Sign in
        </button>
      </p>
    </div>
  );
};

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "name"> & {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
};

const Field = ({
  label,
  type,
  placeholder,
  error,
  registration,
  className,
  ...props
}: FieldProps) => (
  <label className="auth-field">
    <span>{label}</span>

    <input
      type={type}
      placeholder={placeholder}
      aria-invalid={Boolean(error)}
      className={className}
      {...registration}
      {...props}
    />

    {error?.message && <ErrorText>{error.message}</ErrorText>}
  </label>
);

const PasswordField = ({
  label,
  placeholder,
  show,
  setShow,
  registration,
  rightLink,
  disabled,
  error,
}: {
  label: string;
  placeholder?: string;
  show: boolean;
  setShow: (value: boolean) => void;
  registration: UseFormRegisterReturn;
  rightLink?: ReactNode;
  disabled?: boolean;
  error?: FieldError;
}) => (
  <label className="auth-field">
    <span className="auth-field-top">
      <span>{label}</span>
      {rightLink}
    </span>

    <span className="auth-password-wrap">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        {...registration}
      />

      <button type="button" onClick={() => setShow(!show)} disabled={disabled}>
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </span>

    {error?.message && <ErrorText>{error.message}</ErrorText>}
  </label>
);

const ErrorText = ({ children }: { children: ReactNode }) => (
  <span className="mt-1 text-xs font-medium text-red-500">{children}</span>
);

const Divider = () => (
  <div className="auth-divider">
    <span />
    or
    <span />
  </div>
);

const SubmitButton = ({
  children,
  isLoading,
  disabled,
}: {
  children: ReactNode;
  isLoading: boolean;
  disabled?: boolean;
}) => (
  <button
    type="submit"
    disabled={disabled || isLoading}
    className="auth-submit-btn"
  >
    {isLoading && <Loader2 className="size-4 animate-spin" />}
    {isLoading ? "Please wait..." : children}
  </button>
);

const MessageBox = ({ message }: { message: Exclude<Message, null> }) => (
  <div
    className={`rounded-2xl px-4 py-3 text-sm font-medium ${
      message.type === "error"
        ? "bg-red-500/10 text-red-500"
        : "bg-green-500/10 text-green-500"
    }`}
  >
    {message.text}
  </div>
);

export default AuthPage;