import {useEffect} from "react";
import {toast} from "sonner";

export const useMessageToast = (message: string) => {
  useEffect(() => {
    if (message) {


    }
  }, [message])
}

export const useErrorToast = (message: string) => {
  useEffect(() => {
    if (message) {
      switch (message) {
        case "signin_required":
          toast.error("ログインが必要です")
          break
        default:
          toast.error("予期せぬエラーが生じました")
          break
      }
    }
  }, [message])
}