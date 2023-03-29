import { Link } from 'react-router-dom';

export default function CustomLink(props) {
    if (props.disabled === true) {
        return (props.content)
    }
    return (
        <Link to={props.link}>{props.content}</Link>
    )
}