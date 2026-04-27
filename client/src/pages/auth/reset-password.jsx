import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import CommonForm from "@/components/common/form";
import { resetPasswordFormControls } from "@/config";
import { resetPassword } from "@/store/auth-slice";
import MESSAGES from '../../constants/messages';


const initialState = {
  password: "",
  confirmPassword: "",
};

function ResetPassword() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    if (!token) {
      toast({
        title: MESSAGES.INVALID_OR_MISSING_TOKEN,
        variant: "destructive",
      });
      navigate("/auth/login");
    }
  }, [token, toast, navigate]);

  function onSubmit(event) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: MESSAGES.PASSWORDS_DO_NOT_MATCH,
        variant: "destructive",
      });
      return;
    }

    dispatch(resetPassword({ token, password: formData.password })).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate("/auth/login");
      } else {
        toast({
          title: data?.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-[350px] px-2 space-y-6">
      <p className="text-sm text-muted-foreground">Please enter your new password below.</p>
      <CommonForm
        formControls={resetPasswordFormControls}
        buttonText={"Reset Password"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default ResetPassword;
