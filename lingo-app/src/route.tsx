import { createBrowserRouter, } from "react-router-dom";
import App from "./App";
import Chat from "./pages/Chat.tsx";


export const router = createBrowserRouter([
    {
        // This path will have the user registration
        path: "/",
        element: <App/>,
    },
    {
        path: "list",
        element: <Chat/>,
    },
]);