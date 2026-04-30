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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  
  function onSubmit(event) {
    event.preventDefault();
    if(formData.email.trim() === "" && formData.password.trim() === "" && formData.username.trim() === ""){ 
      toast({
        title: MESSAGES.REQUIRED,
        description: MESSAGES.PLEASE_FILL_IN_ALL_THE_REQUIRED_FIELDS_NAME_EMAIL_AND_PASSWORD,
        variant: "destructive",
      });
      return
    }

    if (formData.username.trim() === "") {
      toast({
        title: MESSAGES.MISSING_USERNAME,
        description: MESSAGES.PLEASE_ENTER_YOUR_NAME,
        variant: "destructive",
      });
      return;
    }
  
    if (formData.email.trim() === "") {
      toast({
        title: MESSAGES.MISSING_EMAIL,
        description: MESSAGES.PLEASE_ENTER_A_VALID_EMAIL_ADDRESS,
        variant: "destructive",
      });
      return;
    }
  
    if (formData.password.trim() === "") {
      toast({
        title: MESSAGES.MISSING_PASSWORD,
        description: MESSAGES.PASSWORD_IS_REQUIRED,
        variant: "destructive",
      });
      return;
    }
  
    if (formData.password.length < 8) {
      toast({
        title: MESSAGES.WEAK_PASSWORD,
        description: MESSAGES.PASSWORD_MUST_BE_AT_LEAST_8_CHARACTERS_LONG,
        variant: "destructive",
      });
      return;
    }
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate("/auth/verify-email");
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
