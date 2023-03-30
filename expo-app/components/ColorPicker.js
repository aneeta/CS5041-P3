import React, { useContext, useEffect, useState } from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import { rgbToHex } from '../utils';
import { SettingsContext } from '../Context';

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

    const { settings, setSettings } = useContext(SettingsContext)

    const [color, setColor] = useState(settings?.[0]?.[props.idx])

    const [display, setDisplay] = useState(false)

    const handleClick = () => {
        setDisplay(!display)
        setSettings(settings)
    };

    const handleClose = () => {
        setDisplay(false)
    };

    const handleChange = (val) => {
        setColor(val.rgb)
        settings[0][props.idx].r = color.r.toString()
        settings[0][props.idx].g = color.g.toString()
        settings[0][props.idx].b = color.b.toString()
        console.log("Settings Obji", JSON.stringify(settings))
    };

    useEffect(() => { setColor(settings?.[0]?.[props.idx]) }, [settings])

    return (
        <div>
            <div style={styles.swatch} onClick={handleClick}>
                <div style={{ ...styles.color, ...{ background: rgbToHex(color) } }} />
            </div>
            {(display || !settings) ? <div style={styles.popover}>
                <div style={styles.cover} onClick={handleClose} />
                <SketchPicker color={color} onChange={handleChange} />
            </div> : null}

        </div>
    )
}

