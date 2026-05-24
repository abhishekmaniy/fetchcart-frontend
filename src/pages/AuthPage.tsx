import {
  useLoginMutation,
  useRegisterMutation,
} from "@/hooks/useAuthMutations";
import { setAccessToken } from "@/lib/api";
import { useAppStore } from "@/store/app.store";
import { useUserStore } from "@/store/userStore";
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
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

type LoginFormValues = {
  email: string;
  password: string;
};

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Message = {
  type: "success" | "error";
  text: string;
} | null;

const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentMode =
    searchParams.get("mode") === "register" ? "register" : "login";

  return (
    <main className="auth-page">
      <Link to="/" className="auth-back-link">
        <ArrowLeft className="size-4" />
        {/* Back home */}
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
                  <LoginForm
                    onSwitch={() => setSearchParams({ mode: "register" })}
                  />
                ) : (
                  <RegisterForm
                    onSwitch={() => setSearchParams({ mode: "login" })}
                  />
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
  const { setUser } = useUserStore();

  const loginMutation = useLoginMutation();

  const [message, setMessage] = useState<Message>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });

  const submitManual = async (values: LoginFormValues) => {
    setMessage(null);

    try {
      const data = await loginMutation.mutateAsync({
        provider: "credentials",
        email: values.email,
        password: values.password,
      });

      if (data.user && data.accessToken) {
        setUser(data.user);
        setAccessToken(data.accessToken);
        useAppStore.getState().setAuthenticated(true);
        toast.success(data.message || "Login successful");
        navigate("/search");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Login failed. Try again.";

      setMessage({
        type: "error",
        text: errorMessage,
      });

      toast.error(errorMessage);
    }
  };

  const submitGoogle = async (googleCredential: CredentialResponse) => {
    setMessage(null);

    if (!googleCredential.credential) {
      const errorMessage = "Google login did not return credentials.";
      setMessage({ type: "error", text: errorMessage });
      toast.error(errorMessage);
      return;
    }

    try {
      const data = await loginMutation.mutateAsync({
        provider: "google",
        idToken: googleCredential.credential,
      });

      if (data.user && data.accessToken) {
        setUser(data.user);
        setAccessToken(data.accessToken);
        useAppStore.getState().setAuthenticated(true);
        toast.success(data.message || "Google login successful");
        navigate("/search");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Google login failed.";

      setMessage({
        type: "error",
        text: errorMessage,
      });

      toast.error(errorMessage);
    }
  };

  const isLoading = loginMutation.isPending;

  return (
    <div>
      <h2 className="auth-form-title">Welcome back</h2>
      <p className="auth-form-subtitle">
        Sign in to continue your smart shopping journey.
      </p>

      <div className="auth-google-wrap">
        {loginMutation.isPending ? (
          <button type="button" disabled className="auth-submit-btn">
            <Loader2 className="size-4 animate-spin" />
            Signing in...
          </button>
        ) : (
          <GoogleLogin
            onSuccess={submitGoogle}
            onError={() => {
              const errorMessage = "Google sign-in failed. Please try again.";
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
          {...form.register("email", { required: true })}
        />

        <PasswordField
          label="Password"
          placeholder="••••••••"
          show={showPassword}
          setShow={setShowPassword}
          disabled={isLoading}
          register={form.register("password", { required: true })}
          rightLink={
            <a href="#" className="auth-forgot-link">
              Forgot password?
            </a>
          }
        />

        {message && <MessageBox message={message} />}

        <SubmitButton isLoading={loginMutation.isPending} disabled={isLoading}>
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
  const registerMutation = useRegisterMutation();

  const [message, setMessage] = useState<Message>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const submitManual = async (values: RegisterFormValues) => {
    setMessage(null);

    if (values.password !== values.confirmPassword) {
      const errorMessage = "Passwords do not match.";
      setMessage({ type: "error", text: errorMessage });
      toast.error(errorMessage);
      return;
    }

    try {
      const data = await registerMutation.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      const successMessage =
        data.message || "Account created. Please verify your email.";

      setMessage({
        type: "success",
        text: successMessage,
      });

      toast.success(successMessage);

      form.reset();

      setTimeout(() => {
        onSwitch();
      }, 800);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Signup failed. Try again.";

      setMessage({
        type: "error",
        text: errorMessage,
      });

      toast.error(errorMessage);
    }
  };

  const isLoading = registerMutation.isPending;

  return (
    <div>
      <h2 className="auth-form-title">Create your account</h2>
      <p className="auth-form-subtitle">
        Start finding better products in seconds — free forever.
      </p>

      <Divider />

      <form onSubmit={form.handleSubmit(submitManual)} className="auth-form">
        <Field
          label="Full name"
          type="text"
          placeholder="Abhishek Maniyar"
          disabled={isLoading}
          {...form.register("name", { required: true })}
        />

        <Field
          label="Email"
          type="email"
          placeholder="you@example.com"
          disabled={isLoading}
          {...form.register("email", { required: true })}
        />

        <PasswordField
          label="Password"
          placeholder="At least 6 characters"
          show={showPassword}
          setShow={setShowPassword}
          disabled={isLoading}
          register={form.register("password", { required: true })}
        />

        <PasswordField
          label="Confirm password"
          placeholder="Repeat password"
          show={showConfirmPassword}
          setShow={setShowConfirmPassword}
          disabled={isLoading}
          register={form.register("confirmPassword", { required: true })}
        />

        {message && <MessageBox message={message} />}

        <SubmitButton
          isLoading={registerMutation.isPending}
          disabled={isLoading}
        >
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

const Field = ({
  label,
  type,
  placeholder,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <label className="auth-field">
    <span>{label}</span>
    <input type={type} placeholder={placeholder} {...props} />
  </label>
);

const PasswordField = ({
  label,
  placeholder,
  show,
  setShow,
  register,
  rightLink,
  disabled,
}: {
  label: string;
  placeholder?: string;
  show: boolean;
  setShow: (value: boolean) => void;
  register: any;
  rightLink?: ReactNode;
  disabled?: boolean;
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
        {...register}
      />

      <button type="button" onClick={() => setShow(!show)} disabled={disabled}>
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </span>
  </label>
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
    className={`rounded-2xl px-4 py-3 text-sm ${
      message.type === "error"
        ? "bg-red-500/10 text-red-200"
        : "bg-green-500/10 text-green-200"
    }`}
  >
    {message.text}
  </div>
);

export default AuthPage;
