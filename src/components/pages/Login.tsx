import { Eye, EyeOff } from 'lucide-react';
import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';


const Login: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await authService.login({
        id: parseInt(id),
        password
      });
      navigate('/class');
    } catch (err: any) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <Card className="w-full max-w-md shadow-2xl border-0 p-4">
        <CardHeader className="space-y-3 pb-4">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to Agora Conversational AI Demo
          </CardTitle>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Sign in to explore real-time AI conversations
        </p>
        </CardHeader>
        {error && (
          <div className="px-8 pb-4">
            <Alert variant="destructive" className="border-red-400">
              <AlertDescription className="flex items-center justify-center">{error}</AlertDescription>
            </Alert>
          </div>
        )}
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="id" className="text-sm font-medium">User ID</Label>
              <Input
                type="number"
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter your ID"
                className="w-full h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-11 pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 py-2  hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--foreground)',
                    border: 'none',
                  }}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground bg-transparent hover:text-foreground transition-colors" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground bg-transparent hover:text-foreground transition-colors" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;