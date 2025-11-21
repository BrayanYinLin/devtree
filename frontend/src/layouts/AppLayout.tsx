import { Link, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { Navigate } from "react-router-dom";
import NavigationTabs from "../components/NavigationTabs";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/DevTreeAPI";
import DevTree from "../components/DevTree";

export default function AppLayout() {

    const {data, isLoading,isError} = useQuery({
        queryFn: getUser,
        queryKey: ['user'],
        retry:1,
        refetchOnWindowFocus: false
    })

    if(isLoading) return 'CARGANDO .. '
    if (isError) {
        return<Navigate to={'/auth/login'}/>
    }
    //console.log(data)
    //console.log(isLoading)
    //console.log(isError)
    //console.log(error?.message)


    if(data) return <DevTree data = {data}/>
}