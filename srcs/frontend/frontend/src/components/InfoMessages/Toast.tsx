import { toast } from "react-toastify";

export const handleToastMsg = (status: boolean, msg: string) => {
    if (status)
        toast.success(msg);
    else
        toast.warning(msg);
};

