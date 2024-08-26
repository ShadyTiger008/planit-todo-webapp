import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import LoginForm from './forms/login-form';

type Props = {}

const LoginModal = (props: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-md bg-white px-6 py-3 text-indigo-600 transition-all hover:bg-gray-200">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Sign in to your account
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Access your account and manage your boards.
          </DialogDescription>
        </DialogHeader>
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal