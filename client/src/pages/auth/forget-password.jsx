import CommonForm from "@/components/common/form";
import { forgetFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { forgetPassword } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const initialState = {
  email: "",
};

function ForgetPassword() {
  const [formData, setFormData] = useState(initialState);
  const [isSent, setIsSent] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { toast } = useToast();

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function onSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    dispatch(forgetPassword(formData.email)).then((data) => {
      if (data?.payload?.success) {
        setIsSent(true);
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }

  if (isSent) {
    return (
      <div className="mx-auto w-full max-w-[400px] px-2 text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-[#8CC63F]/10 flex items-center justify-center text-[#8CC63F]">
            <MailCheck size={32} />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
          <p className="text-sm text-muted-foreground px-4">
            We've sent a password reset link to <span className="font-semibold text-gray-900">{formData.email}</span>. 
            Please check your inbox and click the link to reset your password.
          </p>
        </div>
        <div className="pt-2">
          <Button 
            variant="outline" 
            className="w-full rounded-xl border-gray-200"
            onClick={() => setIsSent(false)}
          >
            Didn't receive the email? Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[350px] px-2 space-y-6">
      <p className="text-sm text-muted-foreground">Please enter the email address associated with your account. We&apos;ll promptly send you a link to reset your password.</p>
      <CommonForm
        formControls={forgetFormControls}
        buttonText={"Verify"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        errors={errors}
      />
    </div>
  );
}

export default ForgetPassword;
