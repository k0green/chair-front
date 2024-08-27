import React from 'react';

function ErrorComponent() {
    throw new Error('This is a test error!');
    return <div>This will not be rendered.</div>;
}

export default ErrorComponent;
