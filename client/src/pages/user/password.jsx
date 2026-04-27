import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "@/store/user-slice/account-slice";
import { useToast } from "@/hooks/use-toast";
import MESSAGES from '../../constants/messages';


const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: MESSAGES.PASSWORDS_DON_T_MATCH,
  path: ["confirmPassword"],
})

const PasswordPage = () => {
  
  const { isLoading } = useSelector((state) => state.account);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const dispatch = useDispatch();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      dispatch(updatePassword(data)).then((res) => {
        console.log(res.payload);
        if (res.payload.success) {
          toast({
            title: res.payload.message,
          })
        } else {
          toast({
            title: res.payload.message || "Something went wrong",
            variant: "destructive",
          })
        }
      })
      reset();
    } catch (error) {
      console.error("Failed to update password:", error);
    }
  };

  const currentPassword = watch("currentPassword");
  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const isFormEmpty = !currentPassword || !newPassword || !confirmPassword; 

  return (
    <Card className="rounded-none !shadow-none !border-none">
      <CardContent className="space-y-4 px-3 mt-5 lg:px-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Password
              </label>
              <Input
                className="max-w-[400px]"
                type="password"
                placeholder="Enter current password"
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <Input
                className="max-w-[400px]"
                type="password"
                placeholder="Enter new password"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <Input
                className="max-w-[400px]"
                type="password"
                placeholder="Confirm new password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-[200px] mt-6"
              disabled={Object.keys(errors).length > 0 || isFormEmpty}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit className="w-4 h-4 mr-1" />}
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordPage;