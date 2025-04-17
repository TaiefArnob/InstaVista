import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // If user doesn't exist, don't render children (optional fallback)
    if (!user) return null;

    return (
        <>
            {children}
        </>
    );
};

export default ProtectedRoutes;
