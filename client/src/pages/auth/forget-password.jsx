import CommonForm from "@/components/common/form";
import { forgetFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { forgetPassword } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";

const initialState = {
  email: "",
};

function ForgetPassword() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(forgetPassword(formData.email)).then((data) => {
      if (data?.payload?.success) {
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

  return (
    <div className="mx-auto w-full max-w-[350px] px-2 space-y-6">
      <p className="text-sm text-muted-foreground">Please enter the email address associated with your account. We&apos;ll promptly send you a link to reset your password.</p>
      <CommonForm
        formControls={forgetFormControls}
        buttonText={"Verify"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default ForgetPassword;
