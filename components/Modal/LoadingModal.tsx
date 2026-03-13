"use client"

import Lottie from "lottie-react";
import loadingAnimation from "@/assets/lottie/loading.json";

export const LoadingModal = () => {

  return (
    <>
      <Lottie animationData={loadingAnimation} width={30} height={30} loop autoplay />
    </>
  );
}