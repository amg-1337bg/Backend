import { Stack } from "@mui/material"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import AllUsers from "./AllUsers"
import Header from "./Header"
import PublicRooms from "./PublicRooms"


const Home = () => {
    const is_collapse = useSelector((state: RootState) => state.collapseNav).is_collapsed;


    return (
        <div style={{
            flex:"0 0 100%",
            maxWidth: (!is_collapse) ? "calc(100% - 240px)" : "calc(100% - 70px)",

        }}>
            <Header />
            <Stack
                marginTop='45px'
                marginLeft='6%'
                spacing={4}>
                <PublicRooms kind="Public rooms" />
                <PublicRooms kind="Protected rooms" />
            </Stack>
            <AllUsers />
        </div>
    )
}

export default Home
