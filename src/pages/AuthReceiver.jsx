// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const AuthReceiver = () => {
//   const navigate = useNavigate();
//   const { loginWithToken } = useAuth();

//   useEffect(() => {
//     const hash = window.location.hash;

//     const token = new URLSearchParams(hash.substring(1)).get("token");

//     if (!token) {
//       navigate("/login", { replace: true });
//       return;
//     }

//     const authenticate = async () => {
//       const result = await loginWithToken(token);

//       if (result.success) {
//         navigate("/dashboard", { replace: true });
//       } else {
//         navigate("/login", { replace: true });
//       }
//     };

//     authenticate();
//   }, [navigate, loginWithToken]);

//   return (
//     <div className="flex justify-center items-center h-screen">
//       Authenticating...
//     </div>
//   );
// };

// export default AuthReceiver;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthReceiver = () => {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.substring(1)).get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const authenticate = async () => {
      const result = await loginWithToken(token);
      if (result.success) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    };

    authenticate();
  }, [navigate, loginWithToken]);

  return <div className="flex justify-center items-center h-screen">Authenticating...</div>;
};

export default AuthReceiver;