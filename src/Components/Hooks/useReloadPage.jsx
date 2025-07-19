import React from 'react';
import useReloadPage from './hooks/useReloadPage';

const ReloadButton = () => {
    const reload = useReloadPage();

    return (
        <button
            onClick={reload}
            className="px-4 py-2 bg-blue-600 text-white rounded"
        >
            Reload Page
        </button>
    );
};

export default ReloadButton;
