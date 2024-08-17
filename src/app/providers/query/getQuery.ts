"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { server_api } from "~/app/config";

const getResponseData = async ({
  url,
  price_range,
  query,
  page,
  sort,
  sorting,
  skip,
}: {
  url: string;
  price_range: string;
  query: string;
  page: number | string;
  sort: any;
  sorting: any;
  skip: number;
}) => {
  const response = await axios.get(`${server_api}${url}`);
  console.log(response.data.data.users);
  return response.data;
};

export const useGetQuery = ({ url }: { url: string }) => {
  console.log("url", url);

  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;
  const sort: any = searchParams.get("sort") || "";
  const query: any = searchParams.get("query") || "";
  const sorting: any = searchParams.get("sorting") || "";
  const skip: any = searchParams.get("skip") || "";
  const price_range: any = searchParams.get("price_range") || "";

  return useQuery({
    queryKey: [getResponseData, query, page, sort, sorting, skip, price_range],
    queryFn: () =>
      getResponseData({
        url: url,
        price_range: price_range,
        query: query,
        page: page,
        sort: sort,
        sorting: sorting,
        skip: skip,
      }),
  });
};
