import {BrowserRouter} from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';
import { testSupabaseAuth } from "./services/authService";
import { useEffect } from "react";


export function App() {

    useEffect(() => {
        testSupabaseAuth();
    }, []);
    return (
    
    <BrowserRouter>
        <AppRoutes />
    </BrowserRouter>

    )

}