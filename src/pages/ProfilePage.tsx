
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');

  const handleLogout = () => {
    // TODO: Connect to your backend API
    console.log('Logout');
    navigate('/login');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to your backend API
    console.log('Update profile:', { name, email });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="p-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
              <AvatarFallback><UserRound /></AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-muted-foreground">{email}</p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md mx-auto">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Update Profile
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleLogout}
                className="flex-1"
              >
                Logout
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
