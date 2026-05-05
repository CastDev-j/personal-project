import type { User } from "better-auth";
import { signIn, useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import { FaGoogle } from "react-icons/fa";
import { useState, type FC } from "react";

interface Props {
  user: User | null;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const AuthButton: FC<Props> = ({ user }) => {
  const [isLoginOut, setIsLoginOut] = useState(false);

  const handleGoogleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/",
      errorCallbackURL: "/",
    });
  };

  const handleLogOut = async () => {
    setIsLoginOut(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsLoginOut(false);
          window.location.href = "/";
        },
      },
    });
  };

  return (
    <>
      {!user ? (
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isLoginOut}
        >
          <FaGoogle /> <span>Iniciar sesión con Google</span>
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleLogOut}
          disabled={isLoginOut}
        >
          {user.image ? (
            <img
              src={user.image}
              alt="User"
              className="size-5 shrink-0 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium text-neutral-600">
              {getInitials(user.name)}
            </span>
          )}
          <span>Cerrar sesión</span>
        </Button>
      )}
    </>
  );
};

export default AuthButton;
