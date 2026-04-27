import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { loginFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { checkAuth, loginUser } from "@/store/auth-slice"; // Make sure to import setUser
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaUserAstronaut } from "react-icons/fa";
import MESSAGES from '../../constants/messages';


const initialState = {
  email: "",
  password: "",
};

const admin = {
  email: "admin@gmail.com",
  password: "Admin@1234",
};

const user = {
  email: "test@gmail.com",
  password: "Test@1234",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loginSuccess = searchParams.get('login');
    const error = searchParams.get('error');
    
    if (loginSuccess === 'success') {
        dispatch(checkAuth()).then((data) => {

            if (data.payload.success) {
              navigate('/');
                toast({
                    title: MESSAGES.SUCCESSFULLY_LOGGED_IN_WITH_GOOGLE
                });
            } else {
                toast({
                    title: MESSAGES.FAILED_TO_VERIFY_LOGIN,
                    variant: "destructive"
                });
            }
        });
    } else if (error) {
        toast({
            title: error === 'blocked_user' 
                ? "Account has been Suspended! Please contact admin" 
                : error === 'auth_failed' ? "Authentication failed" : "Something went wrong",
            variant: "destructive"
        });
    }
}, [searchParams, dispatch, toast, navigate]);

  const handleGoogleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE}/api/auth/google`;
  };

  function onSubmit(event) {
    event.preventDefault();

    if (formData.email.trim() === "" && formData.password.trim() === "") {
      toast({
        title: MESSAGES.REQUIRED,
        description: MESSAGES.PLEASE_FILL_IN_ALL_THE_REQUIRED_FIELDS,
        variant: "destructive",
      });
      return;
    }

    dispatch(loginUser(formData)).then((data) => {

      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate('/');
      } else {
        if(data?.payload?.isVerify) {
          navigate('/auth/verify-email');
          toast({
            title: data?.payload?.message
          });
        } else {
          toast({
            title: data?.payload?.message || "Something went wrong",
            description: MESSAGES.ENTER_CORRECT_EMAIL_AND_PASSWORD,
            variant: "destructive",
          });
        }
      }
    });
  }

  return (
    <div
      className="mx-auto w-full max-w-[350px] px-2 space-y-6">
      <div className="text-center">
        <Button 
          className="w-full mb-4 bg-transparent hover:bg-transparent text-black outline outline-1 outline-gray-200" 
          onClick={handleGoogleSignIn}
        >
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
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        formType="login"
      />
      <p className="text-md text-center text-gray-900">
        Don&apos;t have an account
        <Link
          className="font-medium ml-2 text-primary hover:underline"
          to="/auth/register"
        >
          Register
        </Link>
      </p>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          className="w-1/2"
          onClick={() =>
            dispatch(loginUser(user)).then((data) => {
              toast({ title: data?.payload?.message });
              if (data?.payload?.success) navigate('/');
            })
          }
        >
          <FaUserAstronaut style={{ width: "15px", height: "15px" }} /> Demo
          User
        </Button>
        <Button
          variant="outline"
          className="w-1/2"
          onClick={() =>
            dispatch(loginUser(admin)).then((data) => {
              toast({ title: data?.payload?.message });
              if (data?.payload?.success) navigate('/');
            })
          }
        >
          <MdAdminPanelSettings style={{ width: "20px", height: "20px" }} />
          Demo Admin
        </Button>
      </div>
    </div>
  );
}

export default AuthLogin;