import { useEffect } from "react";
import { signInWithGoogle } from "../../redux/actions/authenticationActions";
import { useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { useHistory, useLocation } from "react-router-dom";

function SignInWithGoogle() {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const handleGoogleSignIn = async () => {
      try {
        const result = await dispatch(signInWithGoogle(addToast));
        if (result.ok) {
          console.log("Google login successful:", result.data);
          history.push("/home-fashion");
        } else {
          console.error("Google login failed:", result.error);
          addToast("Đăng nhập bằng Google thất bại.", { appearance: "error", autoDismiss: true });
          history.push("/login");
        }
      } catch (error) {
        console.error("Google login error:", error);
        history.push("/not-found");
      }
    };

    if (location.pathname === "/signInWithGoogle") {
      handleGoogleSignIn();
    }
  }, [dispatch, addToast, history, location]);

  return null;
}

export default SignInWithGoogle;