import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthModalStore } from '@/stores/authModalStore';
import { useLanguage } from '@/components/language-provider';

export function AuthModal() {
  const { isOpen, view, closeModal, setView } = useAuthModalStore();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = () => {
    // Login logic here
    console.log('Login attempt:', { email, password });
    closeModal();
  };

  const handleRegister = () => {
    // Register logic here
    console.log('Register attempt:', { username, email, password, confirmPassword });
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("auth.title")}</DialogTitle>
          <DialogDescription>
            {t("auth.description")}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={view} onValueChange={(value) => setView(value as 'login' | 'register')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t("auth.loginTab")}</TabsTrigger>
            <TabsTrigger value="register">{t("auth.registerTab")}</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-4 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="email-login">{t("auth.email")}</Label>
              <Input
                id="email-login"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password-login">{t("auth.password")}</Label>
              <Input
                id="password-login"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" onClick={handleLogin}>
              {t("auth.loginButton")}
            </Button>
          </TabsContent>
          <TabsContent value="register" className="space-y-4 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="username-register">{t("auth.username")}</Label>
              <Input
                id="username-register"
                type="text"
                placeholder="yourusername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email-register">{t("auth.email")}</Label>
              <Input
                id="email-register"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password-register">{t("auth.password")}</Label>
              <Input
                id="password-register"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password-register">{t("auth.confirmPassword")}</Label>
              <Input
                id="confirm-password-register"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" onClick={handleRegister}>
              {t("auth.registerButton")}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 