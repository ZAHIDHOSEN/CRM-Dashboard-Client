import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { setUser } from "../redux/features/auth/authSlice";


const Test = () => {

  const dispatch = useAppDispatch();

  useEffect(() => {

    dispatch(
      setUser({
        name: "Zahid",
        role: "ADMIN",
      })
    );

  }, []);

  return (
    <div>
      Redux Test
    </div>
  );
};

export default Test;