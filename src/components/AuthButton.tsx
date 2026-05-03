import { signIn, useSession, signOut } from "@/lib/auth-client";
import { Button } from "./ui/Button";
import { FaGoogle } from "react-icons/fa";

const AuthButton = () => {
  const { data: session } = useSession();

  const handleGoogleSignIn = async () => {
    const { data: result } = await signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (!(result as { success?: boolean })?.success && !result?.redirect) {
      console.log(result);
    }
  };

  const handleLogOut = async () => {
    await signOut();
  };

  return (
    <>
      {JSON.stringify(session, null, 2)}
      {!session?.session ? (
        <Button type="button" variant="outline" onClick={handleGoogleSignIn}>
          <FaGoogle /> <span>Iniciar sesión con Google</span>
        </Button>
      ) : (
        <Button type="button" variant="outline" onClick={handleLogOut}>
          <FaGoogle /> <span>Cerrar sesión</span>
        </Button>
      )}
    </>
  );
};

export default AuthButton;
