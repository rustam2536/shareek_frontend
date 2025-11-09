// components/context/LoaderContext.js
import { createContext, useState, useContext } from 'react';

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    return (
        <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
            {loading && <div className="global-loader">
                <div className="dot-spinner">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                </div>
            </div>}
            {children}
        </LoaderContext.Provider>
    );
};
