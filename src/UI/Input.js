import React from "react";

function Input(props) {
    return (
        <div>
            <label htmlFor={props.id} className="sr-only">
                {props.label}
            </label>
            <input
                id={props.id}
                name={props.name}
                type={props.type}
                autoComplete={props.name}
                // required
                className={props.classes}
                placeholder={props.label}
                value={props.value}
                onChange={props.handleChange}
                required={props.isRequired}
            />
        </div>
    )
}

export default Input
