import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthModalStore } from '@/app/stores/authModalStore';
import { useLanguage } from '@/components/language-provider';
import { AuthClientService } from '@/services/AuthClientService';
import { useUserStore } from '@/app/stores/userStore';

export function AuthModal() {
  const { isOpen, view, closeModal, setView } = useAuthModalStore();
  const { t } = useLanguage();
  const { setUser, setToken } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');

  const handleLogin = async () => {
    setLoginError('');
    try {
      const { user } = await AuthClientService.login({ email, password });
      setUser(user);
      console.log('Login successful:', user);
      closeModal();
    } catch (error) {
      setLoginError(t('auth.loginError') || 'Đăng nhập thất bại.');
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async () => {
    setRegisterError('');
    if (password !== confirmPassword) {
      setRegisterError(t('auth.passwordMismatch') || 'Mật khẩu không khớp.');
      return;
    }
    try {
      const user = await AuthClientService.register({ username, email, password });
      console.log('Registration successful:', user);
      setView('login');
      setEmail(email);
      setPassword(password);
    } catch (error) {
      setRegisterError(t('auth.registerError') || 'Đăng ký thất bại.');
      console.error('Registration failed:', error);
    }
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
            {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
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
            {registerError && <div className="text-red-500 text-sm">{registerError}</div>}
            <Button type="submit" className="w-full" onClick={handleRegister}>
              {t("auth.registerButton")}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 