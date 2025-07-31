import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner"; // Assuming you're using Sonner for toasts
import { useResetPassword, useVerifyResetToken } from "@/hooks/api/useAuthApi"; // Import your custom hook

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordReset, setIsPasswordReset] = useState(false); // Track if the password is reset
  const { mutateAsync, isPending: isLoading } = useResetPassword();
  const navigate = useNavigate();
  const query = useQuery();
  const token = query.get("token");

  const { data, isPending, error } = useVerifyResetToken(token);

  useEffect(() => {
    if (data?.message === "Reset token is valid") {
      // Token is valid, proceed with reset password flow
      console.log("Token is valid for email:", data.email); // Do something with the email
    }
  }, [data, navigate]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Validate password strength
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    try {
      // Call the reset password mutation with the new password and confirm password
      const response = await mutateAsync({ newPassword, confirmPassword, token });

      // Check if the reset was successful and show success message
      if (response?.success) {
        setIsPasswordReset(true); // Set password reset status to true
        toast.success("Password reset successfully! You can now log in.");
      }
    } catch (err) {
      // Show error message if something goes wrong
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 space-y-8 rounded-3xl shadow-2xl flex flex-col items-center">
        <RefreshCcw className="h-12 w-12 text-reel-purple-500 mb-2" />
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>

        {/* Show form if token is valid and password hasn't been reset */}
        {!isLoading &&
          data?.message === "Reset token is valid" &&
          !isPasswordReset && (
            <>
              <p className="text-center text-muted-foreground mb-4">
                Enter your new password and confirm it to reset your password.
              </p>
              <form
                onSubmit={handleReset}
                className="w-full flex flex-col items-center space-y-4"
              >
                <div className="w-full">
                  <label className="text-sm font-medium" htmlFor="newPassword">
                    New Password<span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter your new password"
                    className="mt-1"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="w-full">
                  <label
                    className="text-sm font-medium"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password<span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    className="mt-1"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </>
          )}

        {/* Show success message if password has been reset */}
        {!isLoading && isPasswordReset && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">
              Your password has been reset successfully!
            </h2>
            <p>Please use your new password to log in.</p>
            <Button onClick={() => navigate("/login")} className="w-full">
              Go to Login
            </Button>
          </div>
        )}

        {/* If token is invalid or expired, show message */}
        {!isLoading && data?.message !== "Reset token is valid" && (
          <div>
            <h2>Token Expired or Invalid</h2>
            <p>
              The reset token has either expired or is invalid. Please request a
              new reset link.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="text-blue-500"
            >
              Back to Login
            </button>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </Button>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
