import React, {Component} from 'react';


const EditableText = ({
    title,
    transcription,
    type,
    placeholder,
    children
}) => {
    //manage when to show label/input box
    const[isEditing, seEditing] = useState(false);

    //handle key press events while editing
    const handleKeyDown = (event, type) => {
        // todo: handle when key is pressed (edit transcription UC-10)
    };

    return (
        <section {...props}>
            {isEditing ? (
                <div
                    onBlur={() => setEditing(false)}
                    onKeyDown={e => handleKeyDown(e, type)}
                >
                    {children}
                </div>
            ) : ( 
                <div
                onClick={() => setEditing(true)}
                >
                    <span>
                        {text || placeholder || "Edit me!"}
                    </span>
                </div>
            )}
        </section>
    );
};
export default EditableText;