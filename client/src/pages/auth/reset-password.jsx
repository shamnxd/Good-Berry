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
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const validateForm = () => {
    let newErrors = {};
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 8) {
        newErrors.password = "Minimum 8 characters required";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
        newErrors.password = "Must include uppercase, lowercase, number and special character";
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

    if (!validateForm()) return;

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
        errors={errors}
      />
    </div>
  );
}

export default ResetPassword;
