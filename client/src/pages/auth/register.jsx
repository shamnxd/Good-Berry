import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { registerFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MESSAGES from '../../constants/messages';


const initialState = {
  username: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    let newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 8) {
        newErrors.password = "Minimum 8 characters required";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
        newErrors.password = "Must include uppercase, lowercase, number and special character";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  
  function onSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) return;

    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate("/auth/verify-email", { state: { email: formData.email } });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  const handleGoogleSignUp = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE}/api/auth/google`;
};

  return (
    <div className="mx-auto w-full max-w-[350px] px-2 space-y-6">
      <div className="text-center">
        <Button className="w-full mb-4 bg-transparent hover:bg-transparent text-black  outline outline-1 outline-gray-200" onClick={handleGoogleSignUp}>
          <FcGoogle
            className="mr-2"
            style={{ width: "20px", height: "20px" }}
          />
          <p className="text-sm font-medium">Continue with Google</p>
        </Button>
      </div>
      <div
        className="flex items-center justify-center"
        style={{ marginTop: "13px" }}
      >
        <div className="w-full border-t border-gray-300"></div>
        <div className="mx-3 text-gray-500" style={{ fontSize: "12px" }}>
          OR
        </div>
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        formType="register"
        errors={errors}
      />
      <p className="mt-2 text-center text-md text-gray-900">
        Already have an account
        <Link
          className="font-medium ml-2 text-primary hover:underline"
          to="/auth/login"
        >
          Login
        </Link>
      </p>
    </div>
  );
}

export default AuthRegister;
