import React, { useState } from 'react'
import reactCSS from 'reactcss'
import { Material, SketchPicker } from 'react-color'
import { rgbToHex } from '../utils';

const styles = reactCSS({
    'default': {
        color: {
            width: '36px',
            height: '14px',
            borderRadius: '2px',
        },
        swatch: {
            padding: '5px',
            background: '#fff',
            borderRadius: '1px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'inline-block',
            cursor: 'pointer',
        },
        popover: {
            position: 'absolute',
            zIndex: '2',
        },
        cover: {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        },
    },
});

export default function ColorPicker(props) {



    return (
        <div>
            <div style={styles.swatch} onClick={props.handleClick}>
                <div style={{ ...styles.color, ...{ background: rgbToHex(props.color) } }} />
            </div>
            {props.display ? <div style={styles.popover}>
                <div style={styles.cover} onClick={props.handleClose} />
                <SketchPicker color={props.color} onChange={props.handleChange} />
            </div> : null}

        </div>
    )


}

