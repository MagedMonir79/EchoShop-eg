import { useState, useContext } from "react";
import { useLocation } from "wouter";
import { CreditCard, LogOut, Settings, User as UserIcon, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "@/context/auth-context";
import { LanguageContext } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";

export function UserButton() {
  const [open, setOpen] = useState(false);
  const { user, userData, logout } = useContext(AuthContext);
  const { t, language } = useContext(LanguageContext);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isRTL = language === "ar";

  if (!user || !userData) return null;

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t("logoutSuccessful"),
        description: t("youHaveBeenLoggedOut"),
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: t("logoutFailed"),
        description: t("somethingWentWrong"),
        variant: "destructive",
      });
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`;
    } else if (userData.firstName) {
      return userData.firstName.charAt(0);
    } else if (userData.username) {
      return userData.username.charAt(0).toUpperCase();
    } else {
      return "U";
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userData.profileImage || ""} alt={userData.username || ""} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align={isRTL ? "start" : "end"} forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userData.firstName ? `${userData.firstName} ${userData.lastName}` : userData.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setLocation("/user/profile")}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>{t("profile")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLocation("/user/orders")}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>{t("orders")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLocation("/user/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>{t("settings")}</span>
          </DropdownMenuItem>
          
          {/* Seller Links */}
          {userData.role === "seller" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLocation("/seller/dashboard")}>
                <UserIcon className="mr-2 h-4 w-4 text-primary" />
                <span className="text-primary">{t("sellerDashboard")}</span>
              </DropdownMenuItem>
            </>
          )}
          
          {/* Admin Links */}
          {userData.role === "admin" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLocation("/admin/dashboard")}>
                <UserIcon className="mr-2 h-4 w-4 text-red-500" />
                <span className="text-red-500">{t("adminDashboard")}</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}