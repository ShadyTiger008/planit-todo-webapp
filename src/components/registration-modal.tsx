import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import RegistrationForm from './forms/register-form';

type Props = {}

const RegistrationModal = (props: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-md bg-indigo-500 px-6 py-3 text-white transition-all hover:bg-indigo-600">
          Register
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Register yourself now
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Access your account and manage your boards.
          </DialogDescription>
        </DialogHeader>
        <RegistrationForm />
      </DialogContent>
    </Dialog>
  );
}

export default RegistrationModal