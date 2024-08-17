"use client";
import React from "react";
import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type Props = {};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 500
    }
  }
});

const CustomQueryClientProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </ReactQueryClientProvider>
  );
};

export default CustomQueryClientProvider;
